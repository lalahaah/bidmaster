/**
 * POST /api/match
 *
 * 로그인한 사용자의 회사 프로필을 기준으로
 * '미분석' 상태인 공고들을 Claude AI로 일괄 분석합니다.
 *
 * Body: { limit?: number }  — 한 번에 처리할 최대 건수 (기본 20)
 */

import { NextRequest, NextResponse } from 'next/server'
import { adminDb, requireAuth } from '@/lib/firebase-admin'
import { analyzeNoticeWithAI } from '@/lib/ai-analysis'
import type { CompanyProfile } from '@/types'
import type { G2BNoticeItem } from '@/lib/g2b'

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req)
  if (auth instanceof NextResponse) return auth
  const { uid } = auth

  const body = await req.json().catch(() => ({}))
  const batchLimit: number = body.limit ?? 20

  try {
    const userSnap = await adminDb.collection('users').doc(uid).get()
    if (!userSnap.exists) {
      return NextResponse.json({ error: '회사 프로필을 먼저 등록해주세요.' }, { status: 400 })
    }
    const profile = userSnap.data()!.profile as CompanyProfile

    if (!profile.bizCodes?.length) {
      return NextResponse.json({ error: '업종코드를 등록해야 매칭이 가능합니다.' }, { status: 400 })
    }

    const unanalyzed = await adminDb
      .collection('bid_notices')
      .where('matchStatus', '==', '미분석')
      .orderBy('createdAt', 'desc')
      .limit(batchLimit)
      .get()

    if (unanalyzed.empty) {
      return NextResponse.json({ ok: true, matched: 0, message: '매칭할 공고가 없습니다.' })
    }

    // Claude API는 병렬 호출 (단, 과도한 동시 요청 방지를 위해 5개씩 처리)
    const docs = unanalyzed.docs
    let matched = 0
    let failed = 0
    const batch = adminDb.batch()

    for (let i = 0; i < docs.length; i += 5) {
      const chunk = docs.slice(i, i + 5)
      const results = await Promise.allSettled(
        chunk.map(async (doc) => {
          const raw = doc.data().rawData as G2BNoticeItem | undefined
          if (!raw) return null

          const { aiSummary, matchStatus } = await analyzeNoticeWithAI(profile, raw)
          return { ref: doc.ref, aiSummary, matchStatus }
        })
      )

      for (const result of results) {
        if (result.status === 'fulfilled' && result.value) {
          const { ref, aiSummary, matchStatus } = result.value
          batch.update(ref, {
            matchStatus,
            matchScore: aiSummary.score,
            aiSummary,
            analyzedAt: new Date(),
            analyzedBy: uid,
          })
          matched++
        } else {
          failed++
        }
      }
    }

    await batch.commit()

    return NextResponse.json({ ok: true, matched, failed, total: unanalyzed.size })
  } catch (err) {
    console.error('[match] 오류:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
