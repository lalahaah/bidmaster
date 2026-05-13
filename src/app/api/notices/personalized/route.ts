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

type NoticeDoc = Record<string, unknown>

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
  let score = 0
  const haystack = `${notice.title ?? ''} ${notice.requirements ?? ''}`.toLowerCase()

  // 1. 키워드 매칭 (+10/개)
  for (const kw of [...(profile.keywords ?? []), ...(profile.bizCodes ?? [])]) {
    if (haystack.includes(kw.toLowerCase())) score += 10
  }

  // 2. bizCode 필드 매칭 (직접 일치 시 보너스)
  if (notice.bizCode && profile.bizCodes.some(bc => (notice.bizCode as string).includes(bc))) {
    score += 30
  }

  // 3. 금액 범위 일치 여부
  const amountMin = profile.amountMin ?? 0
  const amountMax = profile.amountMax ?? 0
  const amount = Number(notice.estimatedAmount ?? 0)
  if (amount > 0 && amountMin > 0 && amountMax > 0) {
    score += amount >= amountMin && amount <= amountMax ? 20 : -15
  }

  // 4. 마감일 기반 우선순위
  const days = daysUntilDeadline(notice)
  if (days !== null) {
    if (days < 0)       score -= 50
    else if (days <= 7) score -= 20
    else if (days <= 14) score += 10
    else if (days <= 30) score += 25
    else                 score += 5
  }

  return score
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

  try {
    const userSnap = await adminDb.collection('users').doc(uid).get()
    const userData = userSnap.data() ?? {}
    const profile = (userData.profile ?? {}) as CompanyProfile

    // ── 텍스트 프로필 있으면 G2B 키워드 검색 (1시간 캐시) ───
    const searchTerms = [...(profile.keywords ?? []), ...(profile.bizCodes ?? [])]
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
      .limit(showAll ? 500 : 1000)
      .get()

    const allNotices: NoticeDoc[] = snap.docs.map(d => ({ id: d.id, ...d.data() }))

    // ── 필터링 로직 ──
    let matched: NoticeDoc[] = []

    if (showAll) {
      matched = allNotices
    } else if (!hasRealProfile(profile)) {
      matched = allNotices.slice(0, 50)
    } else {
      matched = allNotices.filter(n => {
        const bizCode = (n.bizCode as string) || ''
        const haystack = `${n.title ?? ''} ${n.requirements ?? ''}`.toLowerCase()

        // 1. bizCode 필드 매칭
        const bizCodeMatch = bizCode && profile.bizCodes.some(bc => bizCode.includes(bc))
        
        // 2. 키워드 매칭
        const keywordMatch = searchTerms.some(term => haystack.includes(term.toLowerCase()))

        // 3. bizCode가 비어있는 공고는 일단 포함 (유저 요청: 필터링 완화)
        const isEmptyBizCode = !bizCode || bizCode === ""

        return bizCodeMatch || keywordMatch || isEmptyBizCode
      })
    }

    // 관련도 + 마감일 복합 정렬
    const ranked = matched
      .map(n => ({
        ...n,
        _score: hasRealProfile(profile) ? relevanceScore(n, profile) : 0,
        _daysLeft: daysUntilDeadline(n),
      }))
      .sort((a, b) => {
        if (showAll) return 0 // 정렬은 클라이언트에서 수행하거나 생성일순 유지
        return b._score - a._score
      })
      .slice(0, showAll ? 500 : 50)

    return NextResponse.json({
      notices: ranked,
      personalized: !showAll && hasRealProfile(profile),
      g2bFetched,
      total: matched.length,
    })
  } catch (err) {
    console.error('[notices/personalized] 오류:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
