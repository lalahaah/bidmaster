'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

const NAV_ITEMS = [
  { href: '/dashboard', icon: '📊', label: '대시보드' },
  { href: '/dashboard/profile', icon: '🏢', label: '회사 프로필' },
  { href: '/dashboard/team', icon: '👥', label: '팀 관리' },
  { href: '/dashboard/settings', icon: '⚙️', label: '알림 설정' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // useAuth에서 userDoc을 가져옵니다.
  const { user, userDoc, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0820' }}>
        <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const handleSignOut = async () => {
    await signOut()
    router.replace('/')
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0d0820' }}>
      {/* 사이드바 */}
      <aside
        className="w-60 fixed inset-y-0 left-0 z-50 flex flex-col"
        style={{
          background: 'rgba(10,13,25,0.95)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* 로고 */}
        <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/" className="inline-flex hover:opacity-80 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-white.svg" alt="BidMaster" style={{ height: '30px', width: 'auto', display: 'block' }} />
          </Link>
        </div>

        {/* 네비 */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={active ? {
                  background: 'rgba(0,107,122,0.25)',
                  color: '#5BBCCA',
                  border: '1px solid rgba(0,107,122,0.4)',
                } : {
                  color: 'rgba(255,255,255,0.45)',
                  border: '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* 유저 정보 */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div
            className="flex items-center gap-3 p-3 rounded-xl mb-2"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            {user.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full shrink-0" />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: '#006B7A' }}
              >
                {user.displayName?.[0] ?? 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">
                {user.displayName ?? '사용자'}
              </p>
              <p className="text-white/30 text-xs truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full text-left text-xs text-white/30 hover:text-white/60 transition-colors py-1.5 px-3"
          >
            로그아웃
          </button>
        </div>

        {/* 플랜 뱃지 */}
        <div className="px-3 pb-6 mt-auto">
          <div 
            className="p-4 rounded-2xl" 
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40 text-[10px] uppercase font-bold tracking-wider">현재 플랜</span>
              {(() => {
                const plan = userDoc?.subscription?.plan ?? 'free'
                if (plan === 'pro') return <span className="text-[10px] font-bold text-[#5BBCCA]">Pro ✓</span>
                if (plan === 'enterprise') return <span className="text-[10px] font-bold text-[#facc15]">Enterprise ✓</span>
                return <span className="text-[10px] font-bold text-white/30">Free</span>
              })()}
            </div>
            <Link 
              href="/#pricing" 
              className="block w-full text-center py-2 rounded-lg text-[11px] font-bold text-white/60 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              업그레이드 하기 →
            </Link>
          </div>
        </div>
      </aside>

      {/* 메인 */}
      <main className="flex-1 ml-60 min-h-screen">
        {children}
      </main>
    </div>
  )
}
