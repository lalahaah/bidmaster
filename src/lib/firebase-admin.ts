/**
 * Firebase Admin SDK — 서버 사이드 전용 (API Routes)
 * 클라이언트 컴포넌트에서 절대 임포트하지 마세요.
 */

import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import { getAuth, Auth } from 'firebase-admin/auth'

// ─── Admin 앱 초기화 (싱글톤) ─────────────────────────────────

function getAdminApp(): App {
  if (getApps().length > 0) return getApps()[0]

  // 환경 변수에서 서비스 계정 정보 읽기
  // Firebase Console → 프로젝트 설정 → 서비스 계정 → 새 비공개 키 생성
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON

  if (serviceAccount) {
    // JSON 문자열로 환경 변수 설정한 경우
    return initializeApp({
      credential: cert(JSON.parse(serviceAccount)),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    })
  }

  // 개별 환경 변수로 설정한 경우
  return initializeApp({
    credential: cert({
      projectId:    process.env.FIREBASE_ADMIN_PROJECT_ID    ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      clientEmail:  process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
      privateKey:   (process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
    }),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  })
}

let adminAppInstance: App | undefined
let adminDbInstance: Firestore | undefined
let adminAuthInstance: Auth | undefined

function initializeAdmin() {
  if (adminAppInstance) return
  try {
    adminAppInstance = getAdminApp()
    adminDbInstance = getFirestore(adminAppInstance)
    adminAuthInstance = getAuth(adminAppInstance)
  } catch (err) {
    // Build-time initialization can fail if env vars are missing
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Firebase Admin initialization deferred:', err)
    }
  }
}

export const adminDb = new Proxy({} as Firestore, {
  get(target: Firestore, prop: PropertyKey) {
    initializeAdmin()
    return adminDbInstance?.[prop as keyof Firestore]
  },
})

export const adminAuth = new Proxy({} as Auth, {
  get(target: Auth, prop: PropertyKey) {
    initializeAdmin()
    return adminAuthInstance?.[prop as keyof Auth]
  },
})

export async function verifyIdToken(token: string) {
  initializeAdmin()
  return adminAuthInstance!.verifyIdToken(token)
}

