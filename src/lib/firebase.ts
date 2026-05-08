import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getFunctions, Functions } from 'firebase/functions'

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY

// env 변수 없이 빌드(SSG)할 때 초기화하지 않음
function getFirebaseApp(): FirebaseApp | null {
  if (!apiKey) return null
  if (getApps().length > 0) return getApp()
  return initializeApp({
    apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  })
}

const app = getFirebaseApp()

export const auth = app ? getAuth(app) : null as unknown as Auth
export const db = app ? getFirestore(app) : null as unknown as Firestore
export const functions = app ? getFunctions(app, 'asia-northeast3') : null as unknown as Functions
export const googleProvider = new GoogleAuthProvider()

googleProvider.setCustomParameters({ prompt: 'select_account' })

export default app
