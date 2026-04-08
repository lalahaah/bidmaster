/**
 * POST /api/match
 *
 * 특정 공고 1건을 Claude AI로 분석합니다.
 *
 * 플랜별 월 쿼터:
 *   free       →  3건/월
 *   pro        → 100건/월
 *   enterprise → 500건/월
 *
 * Body: { noticeId: string }
 */

import { NextRequest, NextResponse } from 'next/server'
import { adminDb, adminAuth, requireAuth } from '@/lib/firebase-admin'
import { analyzeNoticeWithAI } from '@/lib/ai-analysis'
import type { CompanyProfile, Plan, AiUsage } from '@/types'
import type { G2BNoticeItem } from '@/lib/g2b'
import { Timestamp } from 'firebase-admin/firestore'

const QUOTA: Record<Plan, number> = {
  free: 3,
  pro: 100,
  enterprise: 500,
}

const TEST_ACCOUNTS = ['test@test.com']

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req)
  if (auth instanceof NextResponse) return auth
  const { uid } = auth

  const body = await req.json().catch(() => ({}))
  const noticeId: string | undefined = body.noticeId

  if (!noticeId) {
    return NextResponse.json({ error: 'noticeId가 필요합니다.' }, { status: 400 })
  }

  try {
    const [userSnap, noticeSnap] = await Promise.all([
      adminDb.collection('users').doc(uid).get(),
      adminDb.collection('bid_notices').doc(noticeId).get(),
    ])

    if (!userSnap.exists) {
      return NextResponse.json({ error: '회사 프로필을 먼저 등록해주세요.' }, { status: 400 })
    }
    if (!noticeSnap.exists) {
      return NextResponse.json({ error: '공고를 찾을 수 없습니다.' }, { status: 404 })
    }

    const userData = userSnap.data()!
    const profile = userData.profile as CompanyProfile
    const plan: Plan = userData.subscription?.plan ?? 'free'
    const authUser = await adminAuth.getUser(uid)
    const isTestAccount = TEST_ACCOUNTS.includes(authUser.email ?? '')

    if (!profile.bizCodes?.length) {
      return NextResponse.json({ error: '업종코드를 등록해야 매칭이 가능합니다.' }, { status: 400 })
    }

    // ─── 쿼터 확인 (테스트 계정 스킵) ─────────────────────────
    const now = new Date()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let usage: any = userData.aiUsage ?? { count: 0, resetAt: Timestamp.fromDate(now) }

    if (!isTestAccount) {
      // 리셋 시점이 지났으면 초기화
      if (usage.resetAt.toDate() <= now) {
        const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        usage = { count: 0, resetAt: Timestamp.fromDate(nextReset) }
        await adminDb.collection('users').doc(uid).update({ aiUsage: usage })
      }

      const remaining = QUOTA[plan] - usage.count
      if (remaining <= 0) {
        return NextResponse.json(
          {
            error: `이번 달 AI 분석 한도(${QUOTA[plan]}건)를 모두 사용했습니다. 다음 달 1일에 초기화됩니다.`,
            quota: QUOTA[plan],
            used: usage.count,
          },
          { status: 429 }
        )
      }
    }

    // ─── AI 분석 ───────────────────────────────────────────────
    const noticeData = noticeSnap.data()!
    const raw = noticeData.rawData as G2BNoticeItem | undefined

    if (!raw) {
      return NextResponse.json({ error: '공고 원본 데이터가 없습니다.' }, { status: 400 })
    }

    const { aiSummary, matchStatus } = await analyzeNoticeWithAI(profile, raw)

    // 유저별 분석 결과 저장 (글로벌이 아닌 개인 서브컬렉션)
    await adminDb.collection('users').doc(uid).collection('analyses').doc(noticeId).set({
      noticeId,
      aiSummary,
      matchStatus,
      score: aiSummary.score,
      analyzedAt: Timestamp.now(),
    })

    // ─── 쿼터 차감 (테스트 계정 스킵) ─────────────────────────
    const newCount = usage.count + 1
    if (!isTestAccount) {
      await adminDb.collection('users').doc(uid).update({ 'aiUsage.count': newCount })
    }

    return NextResponse.json({
      ok: true,
      aiSummary,
      matchStatus,
      quota: isTestAccount ? null : QUOTA[plan],
      used: isTestAccount ? null : newCount,
      remaining: isTestAccount ? null : QUOTA[plan] - newCount,
    })
  } catch (err) {
    console.error('[match] 오류:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
