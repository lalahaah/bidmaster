/**
 * GET /api/notices/personalized
 * 
 * [요구사항 반영]
 * 1. 실시간 G2B API 호출 완전 제거 (Firestore 전용)
 * 2. ?all=true: 최신 200건 조회 후 페이지네이션
 * 3. ?all=false (기본): 최신 500건 중 키워드/업종코드 필터링
 * 4. 점수 로직: 기본 50 + 키워드(20~40) + 업종(30) + 금액(20) = 최대 100
 */

import { NextRequest, NextResponse } from 'next/server'
import { adminDb, requireAuth } from '@/lib/firebase-admin'
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

    // 2. 데이터 조회 및 필터링
    let notices: NoticeDoc[] = []
    let isPersonalized = false

    if (showAll) {
      // ?all=true: 최신 200건
      const snap = await adminDb.collection('bid_notices')
        .orderBy('createdAt', 'desc')
        .limit(200)
        .get()
      notices = snap.docs.map(d => ({ id: d.id, ...d.data() } as NoticeDoc))
    } else {
      if (!hasProfile) {
        // 프로필 미완성: 최신 200건
        const snap = await adminDb.collection('bid_notices')
          .orderBy('createdAt', 'desc')
          .limit(200)
          .get()
        notices = snap.docs.map(d => ({ id: d.id, ...d.data() } as NoticeDoc))
      } else {
        // 맞춤 공고: 최신 500건 가져와서 서버 필터링
        const snap = await adminDb.collection('bid_notices')
          .orderBy('createdAt', 'desc')
          .limit(500)
          .get()
        const rawNotices: NoticeDoc[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as NoticeDoc))

        notices = rawNotices.filter(n => {
          const title = (n.title ?? '').toLowerCase()
          const bCode = (n.bizCode as string) || ''
          
          const kwMatch = keywords.some(kw => title.includes(kw.toLowerCase()))
          const bcMatch = bCode && bizCodes.some(bc => bCode.includes(bc))
          
          return kwMatch || bcMatch
        })

        // 점수 계산 및 정렬
        notices = notices.map(n => ({
          ...n,
          score: calculateRelevance(n, profile)
        })).sort((a, b) => ((b.score as number) || 0) - ((a.score as number) || 0))

        isPersonalized = true
      }
    }

    // 3. 페이지네이션 처리
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
