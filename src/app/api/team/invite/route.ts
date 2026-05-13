import { NextRequest, NextResponse } from 'next/server'
import { adminDb, adminAuth, requireAuth } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

/**
 * POST /api/team/invite
 * { email: string }
 */
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req)
  if (auth instanceof NextResponse) return auth
  const { uid } = auth

  const { email } = await req.json().catch(() => ({}))
  if (!email) return NextResponse.json({ error: '이메일이 필요합니다.' }, { status: 400 })

  try {
    // 1. 초대자 권한 확인 (Enterprise)
    const ownerSnap = await adminDb.collection('users').doc(uid).get()
    const ownerData = ownerSnap.data()
    if (!ownerSnap.exists || ownerData?.subscription?.plan !== 'enterprise') {
      return NextResponse.json({ error: 'Enterprise 플랜 사용자만 팀원 초대가 가능합니다.' }, { status: 403 })
    }

    // 1.5. 팀원 수 제한 확인 (최대 5명)
    const membersSnap = await adminDb.collection('users').doc(uid).collection('team_members').get()
    if (membersSnap.size >= 5) {
      return NextResponse.json({ error: '팀원은 최대 5명까지 초대할 수 있습니다.' }, { status: 400 })
    }

    // 2. 초대할 사용자 찾기
    const userRecord = await adminAuth.getUserByEmail(email).catch(() => null)
    if (!userRecord) {
      return NextResponse.json({ error: '해당 이메일로 가입된 사용자가 없습니다. 먼저 가입해 주세요.' }, { status: 404 })
    }
    const memberUid = userRecord.uid

    if (memberUid === uid) {
      return NextResponse.json({ error: '자기 자신은 초대할 수 없습니다.' }, { status: 400 })
    }

    // 3. 사용자 문서 업데이트 및 팀 멤버 추가 (원자적 작업)
    const batch = adminDb.batch()

    // 멤버의 teamId, role 업데이트
    const memberRef = adminDb.collection('users').doc(memberUid)
    batch.update(memberRef, {
      teamId: uid,
      role: 'member',
      updatedAt: Timestamp.now()
    })

    // 소유자의 team_members 서브컬렉션에 추가
    const teamMemberRef = adminDb.collection('users').doc(uid).collection('team_members').doc(memberUid)
    batch.set(teamMemberRef, {
      uid: memberUid,
      email: userRecord.email,
      displayName: userRecord.displayName || '',
      photoURL: userRecord.photoURL || null,
      joinedAt: Timestamp.now()
    })

    await batch.commit()

    return NextResponse.json({ ok: true, message: '팀원으로 초대되었습니다.' })
  } catch (err) {
    console.error('[team/invite] 오류:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
