'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { useState } from 'react'

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || ''

export default function Pricing() {
  const { user, userDoc } = useAuth()
  const router = useRouter()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handleSubscribe = async (planId: string, amount: number, planName: string) => {
    if (!user) {
      router.push(`/login?redirect=/pricing`)
      return
    }

    if (userDoc?.subscription?.plan === planId) {
      alert('이미 구독 중인 플랜입니다.')
      return
    }

    setLoadingPlan(planId)

    try {
      // @ts-ignore
      const tossPayments = window.TossPayments(TOSS_CLIENT_KEY)
      const orderId = `${planId}_${user.uid}_${Date.now()}`
      
      await tossPayments.requestPayment('카드', {
        amount,
        orderId,
        orderName: `BidMaster ${planName} 구독`,
        customerName: user.displayName || '고객',
        successUrl: `${window.location.origin}/dashboard/subscription/success?plan=${planId}`,
        failUrl: `${window.location.origin}/dashboard/subscription/fail`,
      })
    } catch (err) {
      console.error(err)
      alert('결제 준비 중 오류가 발생했습니다.')
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <section id="pricing" className="py-24 px-6" style={{ background: '#161c2d' }}>
      <Script src="https://js.tosspayments.com/v1/payment" strategy="lazyOnload" />
      <div className="max-w-6xl mx-auto">

        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <span style={{
            fontSize: '12px', fontWeight: 800, color: '#006B7A',
            letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '16px',
          }}>요금 안내</span>
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'white', letterSpacing: '-1.2px', lineHeight: '48px', marginBottom: '16px' }}>
            낙찰을 만드는 가장 저렴한 투자
          </h2>
          <p style={{ fontSize: '19px', color: 'white', opacity: 0.55, lineHeight: '32px', letterSpacing: '-0.2px', maxWidth: '520px', margin: '0 auto' }}>
            입찰 공고 하나 분석하는 데 들이는 인건비는 얼마인가요?<br />
            월 29,000원으로 AI 비서에게 맡기세요.
          </p>
        </div>

        {/* 카드 그리드 */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">

          {/* ── Starter (Free) ── */}
          <div className="rounded-xl p-8 flex flex-col" style={{ background: 'white', border: '1px solid #e7e9ed' }}>
            <div className="mb-6">
              <h3 style={{ fontSize: '21px', fontWeight: 800, color: '#161c2d', letterSpacing: '-0.5px', marginBottom: '6px' }}>Starter</h3>
              <p style={{ fontSize: '15px', color: '#717182', letterSpacing: '-0.1px' }}>가끔 입찰에 참여하는 기업</p>
            </div>
            <div className="mb-8">
              <div style={{ height: '29px', marginBottom: '4px' }} />
              <span style={{ fontSize: '48px', fontWeight: 800, color: '#161c2d', letterSpacing: '-1.8px', lineHeight: '58px' }}>Free</span>
              <span style={{ fontSize: '17px', color: '#717182', letterSpacing: '-0.2px', marginLeft: '6px' }}>/ 평생</span>
            </div>
            <ul className="flex-1 mb-8" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { ok: true,  text: '기본 공고 검색' },
                { ok: true,  text: '관심 공고 스크랩 (최대 10개)' },
                { ok: false, text: 'AI 10초 요약 리포트' },
                { ok: false, text: 'AI 낙찰 확률 예측' },
              ].map(item => (
                <li key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px',
                  color: item.ok ? '#161c2d' : '#717182', letterSpacing: '-0.1px' }}>
                  {item.ok
                    ? <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="#68D585"/><path d="M5 9l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="#e7e9ed"/><path d="M6 6l6 6M12 6l-6 6" stroke="#717182" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  }
                  {item.text}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => router.push('/login')}
              disabled={userDoc?.subscription?.plan === 'free'}
              className="w-full font-bold rounded-lg py-3.5 transition-colors hover:bg-gray-50 disabled:opacity-50"
              style={{ fontSize: '17px', letterSpacing: '-0.6px', color: '#161c2d', border: '1.5px solid #e7e9ed' }}>
              {userDoc?.subscription?.plan === 'free' ? '현재 플랜' : '무료로 시작하기'}
            </button>
          </div>

          {/* ── Professional (Featured) ── */}
          <div className="rounded-xl p-8 flex flex-col relative md:-mt-5 md:mb-[-20px]"
            style={{ background: '#0d1a26', border: '2px solid #006B7A', boxShadow: '0 24px 48px rgba(0,107,122,0.25)' }}>
            <div style={{
              position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)',
              background: '#006B7A', color: 'white', padding: '5px 14px', borderRadius: '99px',
              fontSize: '12px', fontWeight: 800, letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '5px',
              whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,107,122,0.4)',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              런칭 기념 특가 (선착순 100명)
            </div>
            <div className="mb-6">
              <h3 style={{ fontSize: '21px', fontWeight: 800, color: 'white', letterSpacing: '-0.5px', marginBottom: '6px' }}>Professional</h3>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.1px' }}>적극적으로 낙찰을 노리는 기업</p>
            </div>
            <div className="mb-8">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '19px', color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through', letterSpacing: '-0.5px' }}>₩49,000</span>
                <span style={{
                  background: 'rgba(0,107,122,0.35)', color: '#5BBCCA',
                  fontSize: '12px', fontWeight: 800, padding: '2px 9px', borderRadius: '99px',
                }}>40% 할인</span>
              </div>
              <span style={{ fontSize: '48px', fontWeight: 800, color: 'white', letterSpacing: '-1.8px', lineHeight: '58px' }}>₩29,000</span>
              <span style={{ fontSize: '17px', color: 'rgba(255,255,255,0.4)', letterSpacing: '-0.2px', marginLeft: '6px' }}>/ 월</span>
            </div>
            <ul className="flex-1 mb-8" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                '실시간 맞춤 키워드 알림',
                'AI 10초 요약 리포트 (무제한)',
                'AI 낙찰 확률 분석 엔진',
                '적격심사 점수 자동 계산기',
              ].map(text => (
                <li key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: 'white', letterSpacing: '-0.1px' }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(0,107,122,0.5)"/><path d="M5 9l3 3 5-5" stroke="#5BBCCA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {text}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleSubscribe('pro', 29000, 'Professional')}
              disabled={loadingPlan !== null || userDoc?.subscription?.plan === 'pro'}
              className="w-full text-white font-bold rounded-lg py-3.5 transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ fontSize: '17px', letterSpacing: '-0.6px', background: '#006B7A', boxShadow: '0 4px 16px rgba(0,107,122,0.4)' }}>
              {loadingPlan === 'pro' ? '준비 중...' : userDoc?.subscription?.plan === 'pro' ? '현재 플랜' : '지금 혜택가로 구독하기'}
            </button>
          </div>

          {/* ── Enterprise ── */}
          <div className="rounded-xl p-8 flex flex-col" style={{ background: 'white', border: '1px solid #e7e9ed' }}>
            <div className="mb-6">
              <h3 style={{ fontSize: '21px', fontWeight: 800, color: '#161c2d', letterSpacing: '-0.5px', marginBottom: '6px' }}>Enterprise</h3>
              <p style={{ fontSize: '15px', color: '#717182', letterSpacing: '-0.1px' }}>입찰 전담팀이 있는 중견 기업</p>
            </div>
            <div className="mb-8">
              <div style={{ marginBottom: '4px' }}>
                <span style={{ fontSize: '19px', color: '#717182', textDecoration: 'line-through', letterSpacing: '-0.5px' }}>₩129,000</span>
              </div>
              <span style={{ fontSize: '48px', fontWeight: 800, color: '#161c2d', letterSpacing: '-1.8px', lineHeight: '58px' }}>₩99,000</span>
              <span style={{ fontSize: '17px', color: '#717182', letterSpacing: '-0.2px', marginLeft: '6px' }}>/ 월</span>
            </div>
            <ul className="flex-1 mb-8" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                'Professional의 모든 기능',
                '경쟁사 낙찰·투찰 동향 분석',
                '다중 계정 지원 (팀원 5명)',
                '1:1 입찰 컨설턴트 매칭 우선권',
              ].map(text => (
                <li key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#161c2d', letterSpacing: '-0.1px' }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="#68D585"/><path d="M5 9l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {text}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleSubscribe('enterprise', 99000, 'Enterprise')}
              disabled={loadingPlan !== null || userDoc?.subscription?.plan === 'enterprise'}
              className="w-full font-bold rounded-lg py-3.5 transition-colors hover:bg-gray-50 disabled:opacity-50"
              style={{ fontSize: '17px', letterSpacing: '-0.6px', color: '#161c2d', border: '1.5px solid #e7e9ed' }}>
              {loadingPlan === 'enterprise' ? '준비 중...' : userDoc?.subscription?.plan === 'enterprise' ? '현재 플랜' : '지금 시작하기'}
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}
