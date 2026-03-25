/**
 * GET /api/notices
 *
 * Firestore에서 입찰 공고 목록을 반환합니다.
 * 로그인된 사용자의 회사 프로필을 기준으로 매칭 상태 포함.
 *
 * Query params:
 *   - status: 매칭 상태 필터 ('가능'|'불가'|'조건부'|'미분석')
 *   - minScore: 최소 AI 점수 (0-100)
 *   - limit: 페이지당 건수 (기본 20)
 */

import { NextRequest, NextResponse } from 'next/server'
import { adminDb, requireAuth } from '@/lib/firebase-admin'
import type { BidNotice } from '@/types'
import type { Query, QueryDocumentSnapshot } from 'firebase-admin/firestore'

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req)
  if (auth instanceof NextResponse) return auth

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const minScore = searchParams.get('minScore')
  const pageLimit = parseInt(searchParams.get('limit') ?? '20', 10)

  try {
    let q: Query = adminDb.collection('bid_notices')
      .orderBy('createdAt', 'desc')
      .limit(pageLimit)

    if (status) {
      q = q.where('matchStatus', '==', status)
    }
    if (minScore) {
      q = q.where('aiSummary.score', '>=', parseInt(minScore, 10))
    }

    const snap = await q.get()
    const notices = snap.docs.map((d: QueryDocumentSnapshot) => ({ id: d.id, ...d.data() })) as BidNotice[]

    return NextResponse.json({ notices, total: snap.size })
  } catch (err) {
    console.error('[notices] 오류:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
