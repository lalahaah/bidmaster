'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { updateNotificationSettings } from '@/lib/firestore'
import type { NotificationSettings } from '@/types'

export default function SettingsPage() {
  const { user, userDoc, refreshUserDoc } = useAuth()
  const [form, setForm] = useState<NotificationSettings>({ kakaoPhone: '', scoreThreshold: 70, notifyEnabled: false })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { if (userDoc?.settings) setForm(userDoc.settings) }, [userDoc])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      await updateNotificationSettings(user.uid, form)
      await refreshUserDoc()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally { setSaving(false) }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">알림 설정</h1>
        <p className="text-white/40 text-sm mt-1">카카오 알림톡으로 맞춤 공고를 받아보세요.</p>
      </div>

      <div className="space-y-4">
        {/* 알림 토글 */}
        <div
          className="rounded-2xl p-5 flex items-center justify-between"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div>
            <p className="text-white font-medium text-sm">카카오 알림톡 수신</p>
            <p className="text-white/35 text-xs mt-0.5">추천 점수 기준 이상 공고를 즉시 알림</p>
          </div>
          <button
            onClick={() => setForm(p => ({ ...p, notifyEnabled: !p.notifyEnabled }))}
            className="relative w-12 h-6 rounded-full transition-all duration-300"
            style={{ background: form.notifyEnabled ? '#006B7A' : 'rgba(255,255,255,0.15)' }}
          >
            <span
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300"
              style={{ left: form.notifyEnabled ? '28px' : '4px' }}
            />
          </button>
        </div>

        {/* 나머지 설정 */}
        <div
          className="rounded-2xl p-6 space-y-6"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* 전화번호 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">카카오톡 수신 번호</label>
            <input
              type="tel" value={form.kakaoPhone} placeholder="010-0000-0000"
              onChange={e => setForm(p => ({ ...p, kakaoPhone: e.target.value }))}
              className="w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-blue-500/50"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <p className="text-xs text-white/25">카카오톡에 등록된 번호와 동일해야 합니다.</p>
          </div>

          {/* 점수 슬라이더 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white/70">추천 점수 기준</label>
              <span
                className="text-sm font-bold px-3 py-1 rounded-full"
                style={{ background: 'rgba(0,107,122,0.15)', color: '#006B7A' }}
              >
                {form.scoreThreshold}점
              </span>
            </div>
            <input
              type="range" min={50} max={95} step={5} value={form.scoreThreshold}
              onChange={e => setForm(p => ({ ...p, scoreThreshold: Number(e.target.value) }))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-white/25">
              <span>50점 (많이 받기)</span>
              <span>95점 (엄선)</span>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving}
            className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #006B7A, #006B7A)', boxShadow: '0 0 24px rgba(0,107,122,0.3)' }}
          >
            {saved ? '✓ 저장됨' : saving ? '저장 중...' : '설정 저장'}
          </button>
        </div>

        {/* 플랜 안내 */}
        <div
          className="rounded-2xl p-5"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/50 text-xs font-medium">플랜별 알림 제한</p>
            <a href="/dashboard/subscription" className="text-[#006B7A] text-xs font-bold hover:underline">플랜 변경하기 →</a>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { plan: 'Free', limit: '일 3건', color: 'rgba(255,255,255,0.1)' },
              { plan: 'Pro', limit: '무제한', color: 'rgba(0,107,122,0.2)' },
              { plan: 'Enterprise', limit: '무제한+팀', color: 'rgba(0,107,122,0.2)' },
            ].map(p => (
              <div key={p.plan} className="text-center py-3 rounded-xl" style={{ background: p.color }}>
                <p className="text-white/60 text-xs font-medium">{p.plan}</p>
                <p className="text-white/40 text-xs mt-0.5">{p.limit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
