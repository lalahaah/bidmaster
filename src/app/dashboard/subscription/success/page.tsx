'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshUserDoc } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const confirmed = useRef(false)

  useEffect(() => {
    const confirmPayment = async () => {
      if (confirmed.current) return
      confirmed.current = true

      const paymentKey = searchParams.get('paymentKey')
      const orderId = searchParams.get('orderId')
      const amount = searchParams.get('amount')
      const plan = searchParams.get('plan')

      if (!paymentKey || !orderId || !amount || !plan) {
        setStatus('error')
        setErrorMsg('결제 정보가 부족합니다.')
        return
      }

      try {
        const res = await fetch('/api/payment/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentKey, orderId, amount, plan }),
        })

        const data = await res.json()

        if (res.ok) {
          await refreshUserDoc()
          setStatus('success')
          setTimeout(() => {
            router.push('/dashboard?welcome=true')
          }, 3000)
        } else {
          setStatus('error')
          setErrorMsg(data.error || '결제 승인 중 오류가 발생했습니다.')
        }
      } catch {
        setStatus('error')
        setErrorMsg('서버와 통신 중 오류가 발생했습니다.')
      }
    }

    confirmPayment()
  }, [searchParams, router, refreshUserDoc])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      {status === 'loading' && (
        <div className="space-y-4">
          <div className="w-12 h-12 border-4 border-[#006B7A]/20 border-t-[#006B7A] rounded-full animate-spin mx-auto" />
          <h1 className="text-2xl font-bold text-white">결제 승인 중...</h1>
          <p className="text-white/50">잠시만 기다려주세요. 결제를 완료하고 있습니다.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-4">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-white">결제가 완료되었습니다!</h1>
          <p className="text-white/60">구독이 성공적으로 시작되었습니다.<br/>잠시 후 대시보드로 이동합니다.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-6 px-8 py-3 rounded-xl bg-[#006B7A] text-white font-bold"
          >
            대시보드로 가기
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-4">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-2xl font-bold text-red-400">결제 승인 실패</h1>
          <p className="text-white/50">{errorMsg}</p>
          <button
            onClick={() => router.push('/dashboard/subscription')}
            className="mt-6 px-8 py-3 rounded-xl border border-white/10 text-white/70 hover:bg-white/5"
          >
            다시 시도하기
          </button>
        </div>
      )}
    </div>
  )
}
