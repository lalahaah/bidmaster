'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import {
  User,
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { getUserDoc, createUserDoc } from '@/lib/firestore'
import type { UserDocument } from '@/types'

// ─── Context 타입 ─────────────────────────────────────────────
interface AuthContextValue {
  user: User | null
  userDoc: UserDocument | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
  refreshUserDoc: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// ─── Provider ────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userDoc, setUserDoc] = useState<UserDocument | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUserDoc = useCallback(async () => {
    if (!user) return
    const doc = await getUserDoc(user.uid)
    setUserDoc(doc)
  }, [user])

  // 리다이렉트 로그인 결과 처리
  useEffect(() => {
    if (!auth) return
    getRedirectResult(auth).catch(() => {})
  }, [])

  // Firebase Auth 상태 감지
  useEffect(() => {
    if (!auth) { setLoading(false); return }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        let doc = await getUserDoc(firebaseUser.uid)

        // 최초 로그인 시 사용자 문서 생성
        if (!doc) {
          await createUserDoc(
            firebaseUser.uid,
            firebaseUser.email ?? '',
            firebaseUser.displayName ?? '',
            firebaseUser.photoURL
          )
          doc = await getUserDoc(firebaseUser.uid)
        }

        setUserDoc(doc)
      } else {
        setUserDoc(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    if (!auth) throw new Error('Firebase가 초기화되지 않았습니다.')
    try {
      await signInWithRedirect(auth, googleProvider)
    } catch (error) {
      console.error('Google 로그인 실패:', error)
      throw error
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase가 초기화되지 않았습니다.')
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    if (!auth) throw new Error('Firebase가 초기화되지 않았습니다.')
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(newUser, { displayName })
  }

  const signOut = async () => {
    if (!auth) return
    try {
      await firebaseSignOut(auth)
      setUser(null)
      setUserDoc(null)
    } catch (error) {
      console.error('로그아웃 실패:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, userDoc, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, refreshUserDoc }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.')
  }
  return ctx
}
