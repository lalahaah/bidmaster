import { NextRequest, NextResponse } from 'next/server'
import { adminDb, requireAuth } from '@/lib/firebase-admin'

/**
 * GET /api/payment/history
 * 결제 내역 조회
 */
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req)
  if (auth instanceof NextResponse) return auth
  const { uid } = auth

  try {
    const snap = await adminDb
      .collection('users')
      .doc(uid)
      .collection('payments')
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get()

    const history = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }))

    return NextResponse.json({ history })
  } catch (err) {
    console.error('[payment/history] 오류:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
