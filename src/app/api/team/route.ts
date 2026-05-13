import { NextRequest, NextResponse } from 'next/server'
import { adminDb, requireAuth } from '@/lib/firebase-admin'

/**
 * GET /api/team
 * 팀원 목록 조회
 */
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req)
  if (auth instanceof NextResponse) return auth
  const { uid } = auth

  try {
    const userSnap = await adminDb.collection('users').doc(uid).get()
    const userData = userSnap.data()
    if (!userSnap.exists) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const teamId = userData.role === 'owner' ? uid : (userData.teamId || uid)
    const isOwner = userData.subscription?.plan === 'enterprise' && !userData.teamId

    // 소유자 UID(teamId)의 team_members 서브컬렉션 조회
    const membersSnap = await adminDb.collection('users').doc(teamId).collection('team_members').get()
    const members = membersSnap.docs.map(d => d.data())

    return NextResponse.json({
      members,
      isOwner,
      teamId
    })
  } catch (err) {
    console.error('[team/get] 오류:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

/**
 * DELETE /api/team
 * 팀원 삭제 (Owner만 가능)
 */
export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req)
  if (auth instanceof NextResponse) return auth
  const { uid } = auth

  const url = new URL(req.url)
  const memberUid = url.searchParams.get('memberUid')
  if (!memberUid) return NextResponse.json({ error: 'memberUid가 필요합니다.' }, { status: 400 })

  try {
    const ownerSnap = await adminDb.collection('users').doc(uid).get()
    const ownerData = ownerSnap.data()
    if (!ownerSnap.exists || ownerData?.subscription?.plan !== 'enterprise') {
      return NextResponse.json({ error: '삭제 권한이 없습니다.' }, { status: 403 })
    }

    const batch = adminDb.batch()

    // 1. 멤버 문서에서 teamId 제거
    batch.update(adminDb.collection('users').doc(memberUid), {
      teamId: null,
      role: null
    })

    // 2. 소유자의 team_members 서브컬렉션에서 제거
    batch.delete(adminDb.collection('users').doc(uid).collection('team_members').doc(memberUid))

    await batch.commit()

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[team/delete] 오류:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
