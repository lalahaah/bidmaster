import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { eventType, data } = body

    // eventType: PAYMENTS_STATUS_CHANGED, etc.
    // data.status: CANCELED, EXPIRED, etc.
    
    if (eventType === 'PAYMENT_STATUS_CHANGED') {
      const { orderId, status } = data

      if (status === 'CANCELED' || status === 'EXPIRED') {
        const parts = orderId.split('_')
        const uid = parts[1]

        if (uid) {
          await adminDb.collection('users').doc(uid).update({
            'subscription.plan': 'free',
            'subscription.updatedAt': new Date(),
          })
          console.log(`Webhook: Plan reset to free for user ${uid} due to ${status}`)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook Error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
