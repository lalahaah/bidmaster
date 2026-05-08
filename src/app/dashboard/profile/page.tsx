'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { updateUserProfile } from '@/lib/firestore'
import type { CompanyProfile } from '@/types'

const REGIONS = ['서울','경기','인천','부산','대구','광주','대전','울산','세종','강원','충북','충남','전북','전남','경북','경남','제주']

const EMPTY_PROFILE: CompanyProfile = {
  bizCodes: [],
  licenses: [],
  revenue: 0,
  headcount: 0,
  region: '',
  amountMin: 1000,
  amountMax: 100000,
  keywords: [],
}

function hasProfile(p: CompanyProfile) {
  return p.bizCodes.length > 0 || p.licenses.length > 0 || p.revenue > 0 || p.headcount > 0 || p.region
}

// 프로필 완성도 계산 (7개 항목 기준)
function calcCompletion(p: CompanyProfile): number {
  const filled = [
    p.bizCodes.length > 0,
    p.licenses.length > 0,
    p.revenue > 0,
    p.headcount > 0,
    !!p.region,
    (p.amountMin ?? 0) > 0 || (p.amountMax ?? 0) > 0,
    (p.keywords?.length ?? 0) > 0,
  ].filter(Boolean).length
  return Math.round((filled / 7) * 100)
}

function completionMessage(pct: number): string {
  if (pct <= 40) return '프로필을 채울수록 정확한 공고를 추천받을 수 있어요'
  if (pct <= 70) return '조금만 더 채우면 매칭 정확도가 크게 올라가요!'
  if (pct < 100) return '거의 다 왔어요! 마지막 항목을 채워보세요'
  return '완벽한 프로필이에요. 최상의 공고를 추천받고 있어요 ✓'
}

export default function ProfilePage() {
  const { user, userDoc, refreshUserDoc } = useAuth()
  const [form, setForm] = useState<CompanyProfile>(EMPTY_PROFILE)
  const [saved, setSavedProfile] = useState<CompanyProfile | null>(null)
  const [bizInput, setBizInput] = useState('')
  const [licInput, setLicInput] = useState('')
  const [kwInput, setKwInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)

  useEffect(() => {
    if (userDoc?.profile) {
      const merged: CompanyProfile = {
        ...EMPTY_PROFILE,
        ...userDoc.profile,
        keywords: userDoc.profile.keywords ?? [],
        amountMin: userDoc.profile.amountMin ?? 1000,
        amountMax: userDoc.profile.amountMax ?? 100000,
      }
      setForm(merged)
      if (hasProfile(userDoc.profile)) setSavedProfile(merged)
    }
  }, [userDoc])

  const addTag = (field: 'bizCodes' | 'licenses' | 'keywords', val: string, setInput: (v: string) => void) => {
    const t = val.trim()
    const arr = form[field] as string[]
    if (!t || arr.includes(t)) return
    setForm(p => ({ ...p, [field]: [...arr, t] }))
    setInput('')
  }
  const removeTag = (field: 'bizCodes' | 'licenses' | 'keywords', val: string) =>
    setForm(p => ({ ...p, [field]: (p[field] as string[]).filter(v => v !== val) }))

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      await updateUserProfile(user.uid, form)
      await refreshUserDoc()
      setSavedProfile(form)
      setSavedMsg(true)
      setTimeout(() => setSavedMsg(false), 2000)
    } finally { setSaving(false) }
  }

  const completion = calcCompletion(form)
  const completionColor = completion === 100 ? '#4ade80' : completion > 70 ? '#006B7A' : completion > 40 ? '#facc15' : 'rgba(255,255,255,0.3)'

  return (
    <div className="p-8 max-w-2xl space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-white">회사 프로필</h1>
        <p className="text-white/40 text-sm mt-1">정확한 프로필을 입력할수록 AI 매칭 정확도가 높아집니다.</p>
      </div>

      {/* 프로필 완성도 게이지 */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-white">프로필 완성도</span>
          <span className="text-sm font-bold" style={{ color: completionColor }}>{completion}%</span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${completion}%`, background: completionColor }}
          />
        </div>
        <p className="text-xs mt-2.5" style={{ color: completion === 100 ? '#4ade80' : 'rgba(255,255,255,0.35)' }}>
          {completionMessage(completion)}
        </p>
      </div>

      {/* 저장된 프로필 카드 */}
      {saved && hasProfile(saved) && (
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(0,107,122,0.1), rgba(0,107,122,0.06))',
            border: '1px solid rgba(0,107,122,0.25)',
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm font-semibold text-white">저장된 프로필</span>
            <span
              className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(0,107,122,0.2)', color: '#5BBCCA' }}
            >
              AI 매칭 활성
            </span>
          </div>

          <div className="space-y-4">
            {saved.bizCodes.length > 0 && (
              <ProfileItem label="업종코드">
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {saved.bizCodes.map(c => (
                    <span key={c} className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: 'rgba(0,107,122,0.15)', color: '#5BBCCA', border: '1px solid rgba(0,107,122,0.25)' }}>
                      {c}
                    </span>
                  ))}
                </div>
              </ProfileItem>
            )}
            {saved.licenses.length > 0 && (
              <ProfileItem label="보유 면허">
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {saved.licenses.map(l => (
                    <span key={l} className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {l}
                    </span>
                  ))}
                </div>
              </ProfileItem>
            )}
            {/* 실적 키워드 표시 */}
            {(saved.keywords?.length ?? 0) > 0 && (
              <ProfileItem label="실적 키워드">
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {saved.keywords!.map(k => (
                    <span key={k} className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: 'rgba(234,179,8,0.1)', color: '#facc15', border: '1px solid rgba(234,179,8,0.2)' }}>
                      {k}
                    </span>
                  ))}
                </div>
              </ProfileItem>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
              {saved.revenue > 0 && (
                <div>
                  <p className="text-white/35 text-xs mb-1">평균 실적</p>
                  <p className="text-white font-semibold text-sm">{saved.revenue.toLocaleString()}만원</p>
                </div>
              )}
              {saved.headcount > 0 && (
                <div>
                  <p className="text-white/35 text-xs mb-1">직원 수</p>
                  <p className="text-white font-semibold text-sm">{saved.headcount}명</p>
                </div>
              )}
              {saved.region && (
                <div>
                  <p className="text-white/35 text-xs mb-1">주사업 지역</p>
                  <p className="text-white font-semibold text-sm">{saved.region}</p>
                </div>
              )}
              {((saved.amountMin ?? 0) > 0 || (saved.amountMax ?? 0) > 0) && (
                <div>
                  <p className="text-white/35 text-xs mb-1">희망 금액</p>
                  <p className="text-white font-semibold text-sm">
                    {(saved.amountMin ?? 0).toLocaleString()} ~ {(saved.amountMax ?? 0).toLocaleString()}만원
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 프로필 편집 카드 */}
      <div
        className="rounded-2xl p-6 space-y-6"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white">
            {saved && hasProfile(saved) ? '프로필 수정' : '프로필 입력'}
          </span>
        </div>

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
              style={{ background: '#006B7A' }}>
              추가
            </button>
          </div>
          <TagList tags={form.bizCodes} onRemove={v => removeTag('bizCodes', v)} color="teal" />
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
              style={{ background: '#006B7A' }}>
              추가
            </button>
          </div>
          <TagList tags={form.licenses} onRemove={v => removeTag('licenses', v)} color="white" />
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

        {/* 참여 희망 금액 범위 */}
        <Field label="참여 희망 금액 범위" hint="이 범위 밖의 공고는 추천에서 제외됩니다">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/35 mb-1.5 block">최소금액 (만원)</label>
              <input
                type="number"
                value={form.amountMin ?? 1000}
                placeholder="1000"
                onChange={e => setForm(p => ({ ...p, amountMin: Number(e.target.value) }))}
                className="w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-blue-500/50"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
            <div>
              <label className="text-xs text-white/35 mb-1.5 block">최대금액 (만원)</label>
              <input
                type="number"
                value={form.amountMax ?? 100000}
                placeholder="100000"
                onChange={e => setForm(p => ({ ...p, amountMax: Number(e.target.value) }))}
                className="w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-blue-500/50"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
          </div>
          {(form.amountMin ?? 0) > 0 && (form.amountMax ?? 0) > 0 && (
            <p className="text-xs text-white/25 mt-2">
              {(form.amountMin ?? 0).toLocaleString()}만원 ~ {(form.amountMax ?? 0).toLocaleString()}만원
            </p>
          )}
        </Field>

        {/* 실적 키워드 */}
        <Field label="실적 키워드" hint="실제 수행 경험 업무를 입력하세요. 공고 검색과 AI 매칭 점수에 모두 반영됩니다">
          <div className="flex gap-2">
            <input
              type="text"
              value={kwInput}
              onChange={e => setKwInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag('keywords', kwInput, setKwInput) } }}
              placeholder="예: 영상제작, SW개발, 도로포장"
              className="flex-1 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-blue-500/50"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <button onClick={() => addTag('keywords', kwInput, setKwInput)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
              style={{ background: '#006B7A' }}>
              추가
            </button>
          </div>
          <TagList tags={form.keywords ?? []} onRemove={v => removeTag('keywords', v)} color="yellow" />
        </Field>

        <button onClick={handleSave} disabled={saving}
          className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-50"
          style={{ background: '#006B7A', boxShadow: '0 0 24px rgba(0,107,122,0.3)' }}
        >
          {savedMsg ? '✓ 저장됨' : saving ? '저장 중...' : '프로필 저장'}
        </button>
      </div>
    </div>
  )
}

function ProfileItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-white/35 text-xs">{label}</p>
      {children}
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

function TagList({ tags, onRemove, color = 'teal' }: { tags: string[]; onRemove: (v: string) => void; color?: 'teal' | 'white' | 'yellow' }) {
  if (!tags.length) return null

  const style =
    color === 'yellow'
      ? { background: 'rgba(234,179,8,0.12)', color: '#facc15', border: '1px solid rgba(234,179,8,0.25)' }
      : color === 'white'
      ? { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }
      : { background: 'rgba(0,107,122,0.15)', color: '#006B7A', border: '1px solid rgba(0,107,122,0.25)' }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map(tag => (
        <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={style}>
          {tag}
          <button onClick={() => onRemove(tag)} className="opacity-50 hover:opacity-100 transition-opacity leading-none">×</button>
        </span>
      ))}
    </div>
  )
}
