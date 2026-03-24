'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirect = searchParams.get('redirect') ?? '/dashboard'

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirect)
    }
  }, [user, loading, router, redirect])

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true)
    setError(null)
    try {
      await signInWithGoogle()
      document.cookie = 'bidmaster_session=1; path=/; max-age=86400'
      router.replace(redirect)
    } catch {
      setError('로그인에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setIsSigningIn(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0820' }}>
        <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden grid-bg"
      style={{ background: '#0d0820' }}
    >
      {/* 글로우 블롭 */}
      <div
        className="glow-blob w-[500px] h-[500px] -top-48 left-1/2 -translate-x-1/2"
        style={{ background: 'rgba(79,110,247,0.15)' }}
      />
      <div
        className="glow-blob w-64 h-64 bottom-0 right-0"
        style={{ background: 'rgba(124,58,237,0.12)' }}
      />

      <div className="relative w-full max-w-md">
        {/* 로고 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)' }}
            >
              <span className="text-white font-bold">B</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">BidMaster</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">시작하기</h1>
          <p className="text-white/40 text-sm">
            Google 계정으로 30초 만에 가입하세요
          </p>
        </div>

        {/* 카드 */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* 에러 */}
          {error && (
            <div
              className="mb-5 p-3.5 rounded-xl text-sm text-red-300"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              {error}
            </div>
          )}

          {/* Google 로그인 */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.85)',
            }}
            onMouseEnter={(e) => {
              if (!isSigningIn) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
            }}
          >
            {isSigningIn ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/70 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {isSigningIn ? '로그인 중...' : 'Google로 계속하기'}
          </button>

          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-center text-xs text-white/25 leading-relaxed">
              계속 진행하면{' '}
              <a href="#" className="text-white/40 hover:text-white/60 underline transition-colors">
                이용약관
              </a>{' '}
              및{' '}
              <a href="#" className="text-white/40 hover:text-white/60 underline transition-colors">
                개인정보처리방침
              </a>
              에 동의합니다.
            </p>
          </div>
        </div>

        {/* 특징 요약 */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { icon: '🤖', text: 'AI 자동 분석' },
            { icon: '💬', text: '카카오 알림' },
            { icon: '🔒', text: '안전한 보안' },
          ].map((item) => (
            <div
              key={item.text}
              className="text-center py-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="text-xl mb-1">{item.icon}</div>
              <p className="text-white/35 text-xs">{item.text}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-white/20 text-xs mt-8">
          © 2026 BidMaster
        </p>
      </div>
    </main>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}
