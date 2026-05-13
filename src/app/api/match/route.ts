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
import type { CompanyProfile, Plan } from '@/types'
import type { G2BNoticeItem } from '@/lib/g2b'
import { Timestamp } from 'firebase-admin/firestore'
import { sendKakaoNotification } from '@/lib/kakao'

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
    const userSnap = await adminDb.collection('users').doc(uid).get()
    if (!userSnap.exists) {
      return NextResponse.json({ error: '회원 정보를 찾을 수 없습니다.' }, { status: 400 })
    }
    const userData = userSnap.data()!

    // ── 팀 멤버면 소유자의 데이터 사용 ────────────────────────
    let ownerUid = uid
    let ownerData = userData

    if (userData.role === 'member' && userData.teamId) {
      ownerUid = userData.teamId
      const ownerSnap = await adminDb.collection('users').doc(ownerUid).get()
      if (ownerSnap.exists) {
        ownerData = ownerSnap.data()!
      }
    }

    const [noticeSnap] = await Promise.all([
      adminDb.collection('bid_notices').doc(noticeId).get(),
    ])

    if (!noticeSnap.exists) {
      return NextResponse.json({ error: '공고를 찾을 수 없습니다.' }, { status: 404 })
    }

    const profile = ownerData.profile as CompanyProfile
    const plan: Plan = ownerData.subscription?.plan ?? 'free'
    const authUser = await adminAuth.getUser(uid)
    const isTestAccount = TEST_ACCOUNTS.includes(authUser.email ?? '')

    if (!profile.bizCodes?.length) {
      return NextResponse.json({ error: '업종코드를 등록해야 매칭이 가능합니다.' }, { status: 400 })
    }

    // ─── 쿼터 확인 (소유자 쿼터 차감) ─────────────────────────
    const now = new Date()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let usage: any = ownerData.aiUsage ?? { count: 0, resetAt: Timestamp.fromDate(now) }

    if (!isTestAccount) {
      // 리셋 시점이 지났으면 초기화
      if (usage.resetAt.toDate() <= now) {
        const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        usage = { count: 0, resetAt: Timestamp.fromDate(nextReset) }
        await adminDb.collection('users').doc(ownerUid).update({ aiUsage: usage })
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

    // 유저별 분석 결과 저장 (개인 서브컬렉션 - 팀이면 소유자와 공유?)
    // 요청: "분석 결과를 공유" -> 소유자의 analyses 서브컬렉션에 저장하고 공유
    await adminDb.collection('users').doc(ownerUid).collection('analyses').doc(noticeId).set({
      noticeId,
      aiSummary,
      matchStatus,
      score: aiSummary.score,
      analyzedAt: Timestamp.now(),
      analyzedBy: uid // 누가 분석했는지 기록
    })

    // ─── 알림톡 발송 (소유자 설정 기준) ───────────────────────────
    const settings = ownerData.settings ?? {}
    if (aiSummary.score >= 70 && settings.notifyEnabled && settings.kakaoPhone) {
      const deadline = noticeData.deadline?.toDate()
      const daysLeft = deadline
        ? Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 0

      sendKakaoNotification({
        phone: settings.kakaoPhone,
        title: noticeData.title,
        estimatedAmount: noticeData.estimatedAmount,
        deadline: deadline ? deadline.toLocaleDateString('ko-KR') : '미정',
        daysLeft,
        matchStatus,
        oneLiner: aiSummary.oneLiner,
        noticeId,
      }).catch(err => console.error('[Kakao] 발송 실패(배경):', err))
    }

    // ─── 쿼터 차감 (소유자 쿼터) ──────────────────────────────
    const newCount = usage.count + 1
    if (!isTestAccount) {
      await adminDb.collection('users').doc(ownerUid).update({ 'aiUsage.count': newCount })
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
