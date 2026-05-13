/**
 * GET /api/notices/personalized
 *
 * [핵심 전략]
 * G2B API에 사용자 키워드로 직접 검색 → Firestore 저장 → AI 분석 결과와 병합 반환
 *
 * - keywords/bizCodes 있는 경우: G2B API를 키워드별·유형별로 검색 (최근 30일)
 *   → 새 공고는 bid_notices에 저장 (기존 일괄 수집과 동일 컬렉션)
 *   → 이후 조회는 DB에서 바로 반환 (1시간 캐시)
 * - 프로필 미설정: DB 최신 50건 그대로
 */

import { NextRequest, NextResponse } from 'next/server'
import { Timestamp } from 'firebase-admin/firestore'
import { adminDb, requireAuth } from '@/lib/firebase-admin'
import { fetchBidNotices, parseAmountToManwon, parseG2BDate } from '@/lib/g2b'
import type { CompanyProfile } from '@/types'

// G2B 4개 유형 엔드포인트
const ENDPOINTS = [
  'getBidPblancListInfoServc',   // 용역 (SW, 영상, 컨설팅 등) — 우선
  'getBidPblancListInfoThng',    // 물품
  'getBidPblancListInfoCnstwk',  // 공사
  'getBidPblancListInfoEtc',     // 기타
]

type NoticeDoc = {
  title?: string
  bizCode?: string
  [key: string]: unknown
}

// ──────────────────────────────────────────────────────────────
// G2B 검색 → Firestore 저장 (신규만)
// ──────────────────────────────────────────────────────────────
async function fetchAndSaveByKeyword(keyword: string, startDate: Date): Promise<number> {
  let saved = 0

  await Promise.allSettled(
    ENDPOINTS.map(async (endpoint) => {
      try {
        const { items } = await fetchBidNotices(
          { startDate, endDate: new Date(), numOfRows: 100, pageNo: 1, keyword },
          endpoint
        )
        if (!items.length) return

        // 중복 체크
        const docRefs = items.map(n =>
          adminDb.collection('bid_notices').doc(`${n.bidNtceNo}-${n.bidNtceOrd}`)
        )
        const snaps = await Promise.all(docRefs.map(r => r.get()))
        const existingIds = new Set(snaps.filter(s => s.exists).map(s => s.id))

        const newItems = items.filter((_, i) => !existingIds.has(docRefs[i].id))
        if (!newItems.length) return

        // 배치 저장
        const CHUNK = 400
        for (let i = 0; i < newItems.length; i += CHUNK) {
          const batch = adminDb.batch()
          newItems.slice(i, i + CHUNK).forEach((notice, j) => {
            const ref = docRefs[items.indexOf(newItems[i + j])]
            const deadlineDate = parseG2BDate(notice.bidClseDt)
            batch.set(ref, {
              title: notice.bidNtceNm,
              orgName: notice.ntceInsttNm,
              bizCode: notice.bsnsDivNm || '',
              estimatedAmount: parseAmountToManwon(notice.presmptPrce || '0'),
              deadline: deadlineDate ? Timestamp.fromDate(deadlineDate) : null,
              requirements: [
                notice.ntceKindNm,
                notice.bidMthdNm,
                notice.indstrytyLmtYn === 'Y' ? '업종 제한 있음' : '업종 제한 없음',
              ].filter(Boolean).join(' / '),
              noticeUrl: notice.linkUrl ||
                `https://www.g2b.go.kr/link/PNPE027_01/single/?bidPbancNo=${notice.bidNtceNo}&bidPbancOrd=${notice.bidNtceOrd}`,
              rawData: notice,
              createdAt: Timestamp.now(),
            })
          })
          await batch.commit()
          saved += newItems.slice(i, i + CHUNK).length
        }
      } catch (err) {
        console.warn(`[personalized] G2B 검색 실패 [${endpoint}/${keyword}]:`, err)
      }
    })
  )

  return saved
}

// ──────────────────────────────────────────────────────────────
// 마감일까지 남은 일수 계산
// ──────────────────────────────────────────────────────────────
function daysUntilDeadline(notice: NoticeDoc): number | null {
  const deadline = notice.deadline as { toDate?: () => Date } | null
  if (!deadline?.toDate) return null
  const diff = deadline.toDate().getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// ──────────────────────────────────────────────────────────────
// 기본 관련도 점수
// 반환값은 클라이언트에도 내려줘서 프론트 정렬에도 활용
// ──────────────────────────────────────────────────────────────
function relevanceScore(notice: NoticeDoc, profile: CompanyProfile): number {
  let score = 50 // 기본값

  const title = (notice.title ?? '').toLowerCase()
  const bizCode = (notice.bizCode as string) || ''
  const keywords = profile.keywords ?? []
  const bizCodes = profile.bizCodes ?? []

  // 1. 키워드 매칭 (제목 기준)
  const kwMatches = keywords.filter(kw => title.includes(kw.toLowerCase())).length
  if (kwMatches >= 2) score += 40
  else if (kwMatches === 1) score += 20

  // 2. bizCode 필드 매칭
  if (bizCode && bizCodes.some(bc => bizCode.includes(bc))) {
    score += 30
  }

  // 3. 금액 범위 일치 여부
  const amountMin = profile.amountMin ?? 0
  const amountMax = profile.amountMax ?? 0
  const amount = Number(notice.estimatedAmount ?? 0)
  if (amount > 0 && amountMin > 0 && amountMax > 0) {
    if (amount >= amountMin && amount <= amountMax) score += 20
  }

  // 4. 마감일 가중치는 정렬용 (점수에는 미포함하거나 별도 합산)
  // 여기서는 순수 관련도 점수만 반환 (0~100 클램프 생략 또는 필요시 적용)
  return Math.min(100, score)
}

function hasTextProfile(profile: CompanyProfile): boolean {
  return (profile.bizCodes?.length ?? 0) > 0 || (profile.keywords?.length ?? 0) > 0
}

function hasRealProfile(profile: CompanyProfile): boolean {
  return (
    hasTextProfile(profile) ||
    (profile.amountMin ?? 0) > 0 ||
    (profile.amountMax ?? 0) > 0
  )
}

// ──────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req)
  if (auth instanceof NextResponse) return auth
  const { uid } = auth

  const url = new URL(req.url)
  const showAll = url.searchParams.get('all') === 'true'
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || (showAll ? '50' : '50'))

  try {
    const userSnap = await adminDb.collection('users').doc(uid).get()
    const userData = userSnap.data() ?? {}
    
    // ── 팀 멤버면 소유자의 프로필 사용 ────────────────────────
    let profileOwnerUid = uid
    let profileUserData = userData

    if (userData.role === 'member' && userData.teamId) {
      profileOwnerUid = userData.teamId
      const ownerSnap = await adminDb.collection('users').doc(profileOwnerUid).get()
      if (ownerSnap.exists) {
        profileUserData = ownerSnap.data() || {}
      }
    }

    const profile = (profileUserData.profile ?? {}) as CompanyProfile

    // ── 텍스트 프로필 있으면 G2B 키워드 검색 (1시간 캐시) ───
    const keywords = profile.keywords ?? []
    const bizCodes = profile.bizCodes ?? []
    const searchTerms = [...keywords, ...bizCodes]
    let g2bFetched = 0

    if (!showAll && hasTextProfile(profile)) {
      const lastFetchedAt: Timestamp | undefined = userData.keywordFetchedAt
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      const needsFetch = !lastFetchedAt || lastFetchedAt.toDate() < oneHourAgo

      if (needsFetch) {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

        // 키워드별 G2B 검색 (병렬)
        const counts = await Promise.all(
          searchTerms.map(term => fetchAndSaveByKeyword(term, thirtyDaysAgo))
        )
        g2bFetched = counts.reduce((a, b) => a + b, 0)

        // 마지막 검색 시각 저장
        await adminDb.collection('users').doc(uid).update({
          keywordFetchedAt: Timestamp.now(),
        })
      }
    }

    // ── DB에서 매칭 공고 조회 ─────────────────────────────────
    const snap = await adminDb
      .collection('bid_notices')
      .orderBy('createdAt', 'desc')
      .limit(200) // 요청에 따라 200건으로 조정
      .get()

    const allNotices: NoticeDoc[] = snap.docs.map(d => ({ id: d.id, ...d.data() }))

    // ── 필터링 로직 ──
    let matched: NoticeDoc[] = []

    if (showAll) {
      matched = allNotices
    } else if (keywords.length === 0 && bizCodes.length === 0) {
      // 키워드와 bizCode 둘 다 없으면 전체 공고 표시
      matched = allNotices
    } else {
      matched = allNotices.filter(n => {
        const title = (n.title ?? '').toLowerCase()
        const bizCode = (n.bizCode as string) || ''

        // 우선순위 1: 키워드 매칭 (제목)
        const keywordMatch = keywords.some(kw => title.includes(kw.toLowerCase()))
        
        // 우선순위 2: bizCode 매칭
        const bizCodeMatch = bizCode && bizCodes.some(bc => bizCode.includes(bc))

        return keywordMatch || bizCodeMatch
      })
    }

    // 관련도 점수 계산 및 정렬
    const ranked = matched.map(n => ({
      ...n,
      _score: hasRealProfile(profile) ? relevanceScore(n, profile) : 0,
      _daysLeft: daysUntilDeadline(n),
    }))

    // '내 맞춤 공고' 탭에서는 항상 점수순 정렬 (키워드/업종코드 없어도 금액 등 점수 반영)
    if (!showAll) {
      ranked.sort((a, b) => b._score - a._score)
    }

    // 페이지네이션 (50건씩)
    const startIndex = (page - 1) * limit
    const paginated = ranked.slice(startIndex, startIndex + limit)
    const hasMore = ranked.length > startIndex + limit

    return NextResponse.json({
      notices: paginated,
      personalized: !showAll && (keywords.length > 0 || bizCodes.length > 0),
      g2bFetched,
      total: ranked.length,
      page,
      limit,
      hasMore,
    })
  } catch (err) {
    console.error('[notices/personalized] 오류:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
