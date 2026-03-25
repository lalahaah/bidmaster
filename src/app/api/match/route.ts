/**
 * POST /api/match
 *
 * 로그인한 사용자의 회사 프로필을 기준으로
 * '미분석' 상태인 공고들을 일괄 매칭합니다.
 *
 * Body: { limit?: number }  — 한 번에 처리할 최대 건수 (기본 50)
 */

import { NextRequest, NextResponse } from 'next/server'
import { adminDb, verifyIdToken } from '@/lib/firebase-admin'
import { matchNoticeToCompany } from '@/lib/matching'
import type { CompanyProfile } from '@/types'
import type { G2BNoticeItem } from '@/lib/g2b'

export async function POST(req: NextRequest) {
  // 인증
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let uid: string
  try {
    const decoded = await verifyIdToken(token)
    uid = decoded.uid
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const batchLimit: number = body.limit ?? 50

  try {
    // 1. 사용자 프로필 로드
    const userSnap = await adminDb.collection('users').doc(uid).get()
    if (!userSnap.exists) {
      return NextResponse.json({ error: '회사 프로필을 먼저 등록해주세요.' }, { status: 400 })
    }
    const profile = userSnap.data()!.profile as CompanyProfile

    if (!profile.bizCodes?.length) {
      return NextResponse.json({ error: '업종코드를 등록해야 매칭이 가능합니다.' }, { status: 400 })
    }

    // 2. 미분석 공고 조회
    const unanalyzed = await adminDb
      .collection('bid_notices')
      .where('matchStatus', '==', '미분석')
      .orderBy('createdAt', 'desc')
      .limit(batchLimit)
      .get()

    if (unanalyzed.empty) {
      return NextResponse.json({ ok: true, matched: 0, message: '매칭할 공고가 없습니다.' })
    }

    // 3. 배치 매칭 및 저장
    const batch = adminDb.batch()
    let matched = 0

    for (const doc of unanalyzed.docs) {
      const raw = doc.data().rawData as G2BNoticeItem | undefined

      if (!raw) {
        // rawData 없으면 최소한 matchStatus만 업데이트
        batch.update(doc.ref, { matchStatus: '조건부' })
        continue
      }

      const result = matchNoticeToCompany(profile, raw)

      batch.update(doc.ref, {
        matchStatus: result.status,
        matchScore: result.score,
        matchReasons: result.reasons,
        matchWarnings: result.warnings,
        matchedAt: new Date(),
        matchedBy: uid,
      })

      matched++
    }

    await batch.commit()

    return NextResponse.json({
      ok: true,
      matched,
      total: unanalyzed.size,
    })
  } catch (err) {
    console.error('[match] 오류:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
