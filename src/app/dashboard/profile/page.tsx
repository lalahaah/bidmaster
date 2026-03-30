'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { updateUserProfile } from '@/lib/firestore'
import type { CompanyProfile } from '@/types'

const REGIONS = ['서울','경기','인천','부산','대구','광주','대전','울산','세종','강원','충북','충남','전북','전남','경북','경남','제주']

export default function ProfilePage() {
  const { user, userDoc, refreshUserDoc } = useAuth()
  const [form, setForm] = useState<CompanyProfile>({ bizCodes: [], licenses: [], revenue: 0, headcount: 0, region: '' })
  const [bizInput, setBizInput] = useState('')
  const [licInput, setLicInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { if (userDoc?.profile) setForm(userDoc.profile) }, [userDoc])

  const addTag = (field: 'bizCodes' | 'licenses', val: string, setInput: (v: string) => void) => {
    const t = val.trim()
    if (!t || form[field].includes(t)) return
    setForm(p => ({ ...p, [field]: [...p[field], t] }))
    setInput('')
  }
  const removeTag = (field: 'bizCodes' | 'licenses', val: string) =>
    setForm(p => ({ ...p, [field]: p[field].filter(v => v !== val) }))

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      await updateUserProfile(user.uid, form)
      await refreshUserDoc()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally { setSaving(false) }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">회사 프로필</h1>
        <p className="text-white/40 text-sm mt-1">정확한 프로필을 입력할수록 AI 매칭 정확도가 높아집니다.</p>
      </div>

      <div
        className="rounded-2xl p-6 space-y-6"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* 업종코드 */}
        <Field label="업종코드" hint="예: 건설업, SW개발업">
          <div className="flex gap-2">
            <input
              type="text" value={bizInput} onChange={e => setBizInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag('bizCodes', bizInput, setBizInput) } }}
              placeholder="업종코드 입력 후 Enter"
              className="flex-1 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-blue-500/50"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <button onClick={() => addTag('bizCodes', bizInput, setBizInput)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #006B7A, #006B7A)' }}>
              추가
            </button>
          </div>
          <TagList tags={form.bizCodes} onRemove={v => removeTag('bizCodes', v)} />
        </Field>

        {/* 보유 면허 */}
        <Field label="보유 면허" hint="예: 정보통신공사업, 소방시설공사업">
          <div className="flex gap-2">
            <input
              type="text" value={licInput} onChange={e => setLicInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag('licenses', licInput, setLicInput) } }}
              placeholder="면허명 입력 후 Enter"
              className="flex-1 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-blue-500/50"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <button onClick={() => addTag('licenses', licInput, setLicInput)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #006B7A, #006B7A)' }}>
              추가
            </button>
          </div>
          <TagList tags={form.licenses} onRemove={v => removeTag('licenses', v)} />
        </Field>

        {/* 실적 */}
        <Field label="최근 3년 평균 실적" hint="단위: 만원">
          <input type="number" value={form.revenue || ''} placeholder="예: 500000"
            onChange={e => setForm(p => ({ ...p, revenue: Number(e.target.value) }))}
            className="w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-blue-500/50"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </Field>

        {/* 직원 수 */}
        <Field label="직원 수" hint="단위: 명">
          <input type="number" value={form.headcount || ''} placeholder="예: 25"
            onChange={e => setForm(p => ({ ...p, headcount: Number(e.target.value) }))}
            className="w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-blue-500/50"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </Field>

        {/* 지역 */}
        <Field label="주사업 지역">
          <select value={form.region} onChange={e => setForm(p => ({ ...p, region: e.target.value }))}
            className="w-full rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500/50"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <option value="" className="bg-slate-900">지역 선택</option>
            {REGIONS.map(r => <option key={r} value={r} className="bg-slate-900">{r}</option>)}
          </select>
        </Field>

        <button onClick={handleSave} disabled={saving}
          className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #006B7A, #006B7A)', boxShadow: '0 0 24px rgba(0,107,122,0.3)' }}
        >
          {saved ? '✓ 저장됨' : saving ? '저장 중...' : '프로필 저장'}
        </button>
      </div>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div>
        <label className="text-sm font-medium text-white/70">{label}</label>
        {hint && <span className="text-xs text-white/25 ml-2">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function TagList({ tags, onRemove }: { tags: string[]; onRemove: (v: string) => void }) {
  if (!tags.length) return null
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map(tag => (
        <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
          style={{ background: 'rgba(0,107,122,0.15)', color: '#006B7A', border: '1px solid rgba(0,107,122,0.25)' }}>
          {tag}
          <button onClick={() => onRemove(tag)} className="opacity-50 hover:opacity-100 transition-opacity leading-none">×</button>
        </span>
      ))}
    </div>
  )
}
