/**
 * GET /api/notices/personalized
 * 
 * [요구사항 반영 - 아키텍처 변경]
 * 1. users/{uid}/profile 에서 keywords, bizCodes 가져오기
 * 2. 1시간 이내 검색 이력이 없으면 나라장터 API 실시간 키워드 검색
 * 3. 검색 결과를 Firestore bid_notices에 저장 (중복 제거)
 * 4. 결과를 relevanceScore 순으로 정렬해서 반환
 */

import { NextRequest, NextResponse } from 'next/server'
import { Timestamp } from 'firebase-admin/firestore'
import { adminDb, requireAuth } from '@/lib/firebase-admin'
import { fetchBidNoticesByKeyword, parseAmountToManwon, parseG2BDate, G2BNoticeItem } from '@/lib/g2b'
import type { CompanyProfile } from '@/types'

type NoticeDoc = {
  id?: string
  title?: string
  bizCode?: string
  estimatedAmount?: number
  [key: string]: unknown
}

/**
 * 관련도 점수 계산 (50~100)
 */
function calculateRelevance(notice: NoticeDoc, profile: CompanyProfile): number {
  let score = 50 // 기본값

  const title = (notice.title ?? '').toLowerCase()
  const bizCode = (notice.bizCode as string) || ''
  const keywords = profile.keywords ?? []
  const bizCodes = profile.bizCodes ?? []

  // 1. 키워드 매칭 (제목 기준, 대소문자 무시)
  const kwMatches = keywords.filter(kw => title.includes(kw.toLowerCase())).length
  if (kwMatches >= 2) score += 40
  else if (kwMatches === 1) score += 20

  // 2. 업종코드(bizCode) 일치 여부
  if (bizCode && bizCodes.some(bc => bizCode.includes(bc))) {
    score += 30
  }

  // 3. 금액 범위 일치 여부 (amountMin ~ amountMax)
  const amountMin = profile.amountMin ?? 0
  const amountMax = profile.amountMax ?? 0
  const amount = Number(notice.estimatedAmount ?? 0)
  if (amount > 0 && amountMin > 0 && amountMax > 0) {
    if (amount >= amountMin && amount <= amountMax) score += 20
  }

  return Math.min(100, score)
}

/**
 * G2B 검색 결과를 Firestore에 저장 (중복 제거)
 */
async function saveNoticesToFirestore(items: G2BNoticeItem[]): Promise<number> {
  if (!items.length) return 0
  let saved = 0

  const CHUNK = 400
  for (let i = 0; i < items.length; i += CHUNK) {
    const batch = adminDb.batch()
    const chunk = items.slice(i, i + CHUNK)
    
    for (const item of chunk) {
      const docId = `${item.bidNtceNo}-${item.bidNtceOrd}`
      const ref = adminDb.collection('bid_notices').doc(docId)
      
      const deadlineDate = parseG2BDate(item.bidClseDt)
      batch.set(ref, {
        title: item.bidNtceNm,
        orgName: item.ntceInsttNm,
        bizCode: item.bsnsDivNm || '',
        estimatedAmount: parseAmountToManwon(item.presmptPrce || '0'),
        deadline: deadlineDate ? Timestamp.fromDate(deadlineDate) : null,
        requirements: [
          item.ntceKindNm,
          item.bidMthdNm,
          item.indstrytyLmtYn === 'Y' ? '업종 제한 있음' : '업종 제한 없음',
        ].filter(Boolean).join(' / '),
        noticeUrl: item.linkUrl ||
          `https://www.g2b.go.kr/link/PNPE027_01/single/?bidPbancNo=${item.bidNtceNo}&bidPbancOrd=${item.bidNtceOrd}`,
        rawData: item,
        createdAt: Timestamp.now(),
      }, { merge: true })
    }
    
    await batch.commit()
    saved += chunk.length
  }
  return saved
}

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req)
  if (auth instanceof NextResponse) return auth
  const { uid } = auth

  const url = new URL(req.url)
  const showAll = url.searchParams.get('all') === 'true'
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '50')

  try {
    // 1. 유저 프로필 조회 (팀 멤버 고려)
    const userSnap = await adminDb.collection('users').doc(uid).get()
    const userData = userSnap.data() || {}
    
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
    const keywords = profile.keywords ?? []
    const bizCodes = profile.bizCodes ?? []
    const hasProfile = keywords.length > 0 || bizCodes.length > 0

    // 2. 캐시 확인 및 실시간 검색 (1시간 주기)
    if (!showAll && hasProfile) {
      const lastFetchedAt: Timestamp | undefined = profileUserData.keywordFetchedAt
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      const needsFetch = !lastFetchedAt || lastFetchedAt.toDate() < oneHourAgo

      if (needsFetch) {
        console.log(`[personalized] 실시간 검색 시작 (${uid}):`, keywords, bizCodes)
        const searchTerms = Array.from(new Set([...keywords, ...bizCodes]))
        
        // 키워드별 나라장터 API 검색 (병렬)
        const allFetchedResults = await Promise.allSettled(
          searchTerms.map(term => fetchBidNoticesByKeyword(term))
        )
        
        const flatResults: G2BNoticeItem[] = []
        allFetchedResults.forEach(res => {
          if (res.status === 'fulfilled') flatResults.push(...res.value)
        })

        // Firestore 저장 (중복 제거 포함)
        await saveNoticesToFirestore(flatResults)

        // 마지막 검색 시각 업데이트 (소유자 기준)
        await adminDb.collection('users').doc(profileOwnerUid).update({
          keywordFetchedAt: Timestamp.now()
        })
      }
    }

    // 3. 데이터 조회 및 필터링 (Firestore)
    let notices: NoticeDoc[] = []
    let isPersonalized = false

    if (showAll) {
      const snap = await adminDb.collection('bid_notices')
        .orderBy('createdAt', 'desc')
        .limit(200)
        .get()
      notices = snap.docs.map(d => ({ id: d.id, ...d.data() } as NoticeDoc))
    } else {
      if (!hasProfile) {
        const snap = await adminDb.collection('bid_notices')
          .orderBy('createdAt', 'desc')
          .limit(200)
          .get()
        notices = snap.docs.map(d => ({ id: d.id, ...d.data() } as NoticeDoc))
      } else {
        // 맞춤 공고: 최신 500건 중 필터링
        const snap = await adminDb.collection('bid_notices')
          .orderBy('createdAt', 'desc')
          .limit(500)
          .get()
        const rawNotices = snap.docs.map(d => ({ id: d.id, ...d.data() } as NoticeDoc))

        notices = rawNotices.filter(n => {
          const title = (n.title ?? '').toLowerCase()
          const bCode = (n.bizCode as string) || ''
          const kwMatch = keywords.some(kw => title.includes(kw.toLowerCase()))
          const bcMatch = bCode && bizCodes.some(bc => bCode.includes(bc))
          return kwMatch || bcMatch
        })

        notices = notices.map(n => ({
          ...n,
          score: calculateRelevance(n, profile)
        })).sort((a, b) => ((b.score as number) || 0) - ((a.score as number) || 0))

        isPersonalized = true
      }
    }

    // 4. 페이지네이션 처리
    const total = notices.length
    const startIndex = (page - 1) * limit
    const paginated = notices.slice(startIndex, startIndex + limit)
    const hasMore = total > startIndex + limit

    return NextResponse.json({
      notices: paginated,
      total,
      page,
      limit,
      hasMore,
      personalized: isPersonalized
    })

  } catch (err) {
    console.error('[personalized] API Error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
