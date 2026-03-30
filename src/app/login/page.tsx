'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

function LoginContent() {
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const redirect = searchParams.get('redirect') ?? '/dashboard'
  const [isLoginMode, setIsLoginMode] = useState(searchParams.get('mode') === 'login')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const switchTab = (login: boolean) => {
    setIsLoginMode(login)
    setError(null)
    const url = new URL(window.location.href)
    if (login) url.searchParams.set('mode', 'login')
    else url.searchParams.delete('mode')
    window.history.replaceState(null, '', url.toString())
  }

  useEffect(() => {
    if (!loading && user) router.replace(redirect)
  }, [user, loading, router, redirect])

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      await signInWithGoogle()
    } catch {
      setError('Google 로그인에 실패했습니다.')
      setIsSubmitting(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      if (isLoginMode) {
        await signInWithEmail(email, password)
      } else {
        if (!name.trim()) { setError('이름을 입력해주세요.'); setIsSubmitting(false); return }
        if (password.length < 6) { setError('비밀번호는 6자 이상이어야 합니다.'); setIsSubmitting(false); return }
        await signUpWithEmail(email, password, name)
      }
      document.cookie = 'bidmaster_session=1; path=/; max-age=86400'
      router.replace(redirect)
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      } else if (code === 'auth/email-already-in-use') {
        setError('이미 사용 중인 이메일입니다.')
      } else if (code === 'auth/invalid-email') {
        setError('올바른 이메일 형식이 아닙니다.')
      } else {
        setError('오류가 발생했습니다. 다시 시도해 주세요.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0820' }}>
        <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
      </div>
    )
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.85)',
    outline: 'none',
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{ background: '#0d0820' }}
    >
      <div className="glow-blob w-[500px] h-[500px] -top-48 left-1/2 -translate-x-1/2" style={{ background: 'rgba(0,107,122,0.15)' }} />
      <div className="glow-blob w-64 h-64 bottom-0 right-0" style={{ background: 'rgba(0,107,122,0.18)' }} />

      <div className="relative w-full max-w-md">
        {/* 로고 */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex mb-6 hover:opacity-80 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-white.svg" alt="BidMaster" style={{ height: '38px', width: 'auto', display: 'block' }} />
          </a>
          <h1 className="text-2xl font-bold text-white mb-2">{isLoginMode ? '로그인' : '시작하기'}</h1>
          <p className="text-white/40 text-sm">
            {isLoginMode ? '계정에 로그인하세요' : '무료로 시작하세요'}
          </p>
        </div>

        {/* 탭 */}
        <div className="flex rounded-xl p-1 mb-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {[{ label: '로그인', value: true }, { label: '시작하기', value: false }].map(tab => (
            <button
              key={tab.label}
              onClick={() => switchTab(tab.value)}
              className="flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200"
              style={isLoginMode === tab.value
                ? { background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)' }
                : { color: 'rgba(255,255,255,0.35)' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 카드 */}
        <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
          {error && (
            <div className="mb-5 p-3.5 rounded-xl text-sm text-red-300" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          {/* Google 버튼 */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-5"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}
            onMouseEnter={e => { if (!isSubmitting) { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' } }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
          >
            {isSubmitting ? <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/70 animate-spin" /> : <GoogleIcon />}
            {isLoginMode ? 'Google로 로그인' : 'Google로 시작하기'}
          </button>

          {/* 구분선 */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <span className="text-white/25 text-xs">또는</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* 이메일/비밀번호 폼 */}
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
            {!isLoginMode && (
              <input
                type="text"
                placeholder="이름"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm placeholder-white/25 transition-all"
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,107,122,0.6)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
              />
            )}
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-sm placeholder-white/25 transition-all"
              style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,107,122,0.6)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-sm placeholder-white/25 transition-all"
              style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,107,122,0.6)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              style={{ background: '#006B7A' }}
            >
              {isSubmitting ? '처리 중...' : isLoginMode ? '이메일로 로그인' : '무료로 시작하기'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5">
            <p className="text-center text-xs text-white/25 leading-relaxed">
              계속 진행하면{' '}
              <a href="#" className="text-white/40 hover:text-white/60 underline transition-colors">이용약관</a>{' '}
              및{' '}
              <a href="#" className="text-white/40 hover:text-white/60 underline transition-colors">개인정보처리방침</a>
              에 동의합니다.
            </p>
          </div>
        </div>

        {/* 특징 요약 */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[{ icon: '🤖', text: 'AI 자동 분석' }, { icon: '💬', text: '카카오 알림' }, { icon: '🔒', text: '안전한 보안' }].map(item => (
            <div key={item.text} className="text-center py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-xl mb-1">{item.icon}</div>
              <p className="text-white/35 text-xs">{item.text}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-white/20 text-xs mt-8">© 2026 BidMaster</p>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0820' }}>
        <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
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
