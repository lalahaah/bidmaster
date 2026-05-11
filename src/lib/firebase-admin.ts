/**
 * Firebase Admin SDK — 서버 사이드 전용 (API Routes)
 * 클라이언트 컴포넌트에서 절대 임포트하지 마세요.
 */

import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import { getAuth, Auth } from 'firebase-admin/auth'
import { type NextRequest, NextResponse } from 'next/server'

function getAdminApp(): App {
  const apps = getApps()
  if (apps.length > 0) return apps[0]

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (serviceAccount) {
    return initializeApp({
      credential: cert(JSON.parse(serviceAccount)),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    })
  }

  // 개별 환경변수 사용
  return initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
      privateKey:  (process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
    }),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  })
}

// 싱글톤 인스턴스 직접 생성
const adminApp = getAdminApp()
export const adminDb: Firestore = getFirestore(adminApp)
export const adminAuth: Auth = getAuth(adminApp)

export async function verifyIdToken(token: string) {
  return adminAuth.verifyIdToken(token)
}

/** Bearer 토큰 추출 + 검증. 실패 시 401 NextResponse 반환. */
export async function requireAuth(
  req: NextRequest
): Promise<{ uid: string } | NextResponse> {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { uid } = await verifyIdToken(token)
    return { uid }
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}
