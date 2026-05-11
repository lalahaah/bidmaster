import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function POST(req: NextRequest) {
  try {
    const { paymentKey, orderId, amount, plan } = await req.json()

    // 1. 토스페이먼츠 결제 승인 API 호출
    const secretKey = process.env.TOSS_SECRET_KEY
    const basicToken = Buffer.from(`${secretKey}:`).toString('base64')

    const confirmRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    })

    const confirmData = await confirmRes.json()

    if (!confirmRes.ok) {
      console.error('Toss Confirmation Failed:', confirmData)
      return NextResponse.json({ error: confirmData.message || '결제 승인에 실패했습니다.' }, { status: 400 })
    }

    // 2. 주문 ID에서 유저 ID 추출 (orderId format: {plan}_{uid}_{timestamp})
    const parts = orderId.split('_')
    const uid = parts[1]

    if (!uid) {
      return NextResponse.json({ error: '유저 정보를 찾을 수 없습니다.' }, { status: 400 })
    }

    // 3. Firestore 유저 구독 정보 업데이트
    // adminDb는 src/lib/firebase-admin.ts에서 싱글톤 Firestore 인스턴스로 export됨
    const userRef = adminDb.collection('users').doc(uid)
    
    // 결제 성공 시각 및 만료 시각 계산 (1개월)
    const now = new Date()
    const paidUntil = new Date()
    paidUntil.setMonth(now.getMonth() + 1)

    await userRef.update({
      'subscription.plan': plan,
      'subscription.paidUntil': paidUntil,
      'subscription.updatedAt': now,
      'subscription.lastPayment': {
        paymentKey,
        orderId,
        amount,
        approvedAt: confirmData.approvedAt,
      }
    })

    return NextResponse.json({ success: true, plan })
  } catch (error) {
    const message = error instanceof Error ? error.message : '서버 오류가 발생했습니다.'
    console.error('Payment Confirmation Error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
