'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function PaymentFailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  const code = searchParams.get('code')

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="text-6xl mb-6">⚠️</div>
      <h1 className="text-3xl font-bold text-white mb-2">결제가 취소되었거나 실패했습니다.</h1>
      <p className="text-white/50 mb-8">
        {message || '오류가 발생했습니다.'}
        {code && <span className="block text-xs mt-1 text-white/20">에러 코드: {code}</span>}
      </p>
      
      <div className="flex gap-4">
        <button
          onClick={() => router.push('/dashboard/subscription')}
          className="px-8 py-3 rounded-xl bg-[#006B7A] text-white font-bold"
        >
          다시 시도하기
        </button>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-8 py-3 rounded-xl border border-white/10 text-white/70 hover:bg-white/5"
        >
          대시보드로 돌아가기
        </button>
      </div>
    </div>
  )
}
