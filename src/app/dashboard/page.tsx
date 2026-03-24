'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getBidNotices } from '@/lib/firestore'
import type { BidNotice, MatchStatus } from '@/types'

const STATUS_STYLE: Record<MatchStatus, { bg: string; color: string }> = {
  '가능':  { bg: 'rgba(34,197,94,0.12)',  color: '#4ade80' },
  '불가':  { bg: 'rgba(239,68,68,0.12)',   color: '#f87171' },
  '조건부':{ bg: 'rgba(234,179,8,0.12)',   color: '#facc15' },
  '미분석':{ bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' },
}

export default function DashboardPage() {
  const { userDoc } = useAuth()
  const [notices, setNotices] = useState<BidNotice[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<BidNotice | null>(null)

  useEffect(() => {
    getBidNotices({}, 20).then((data) => { setNotices(data); setLoading(false) })
  }, [])

  const plan = userDoc?.subscription.plan ?? 'free'

  return (
    <div className="p-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">대시보드</h1>
        <p className="text-white/40 text-sm mt-1">오늘의 AI 추천 공고를 확인하세요</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: '오늘 수집 공고', value: '247', icon: '📋', change: '+12' },
          { label: '추천 공고',     value: '18',  icon: '⭐', change: '+3' },
          { label: '참가 가능',     value: '12',  icon: '✅' },
          { label: '평균 점수',     value: '76점', icon: '🎯' },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-2xl p-5 transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/40 text-sm">{k.label}</span>
              <span className="text-xl">{k.icon}</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">{k.value}</span>
              {k.change && (
                <span className="text-sm text-emerald-400 mb-1">{k.change}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 업그레이드 배너 */}
      {plan === 'free' && (
        <div
          className="mb-6 p-4 rounded-xl flex items-center justify-between"
          style={{
            background: 'linear-gradient(135deg, rgba(79,110,247,0.12), rgba(124,58,237,0.08))',
            border: '1px solid rgba(79,110,247,0.25)',
          }}
        >
          <div>
            <p className="text-white font-medium text-sm">무료 체험 중</p>
            <p className="text-white/45 text-xs mt-0.5">Pro 플랜으로 업그레이드하면 무제한 공고 분석이 가능합니다.</p>
          </div>
          <button
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white shrink-0 ml-4 transition-all"
            style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)' }}
          >
            업그레이드
          </button>
        </div>
      )}

      {/* 공고 리스트 */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span className="text-white font-semibold text-sm">추천 공고 리스트</span>
          <span
            className="text-xs px-3 py-1 rounded-full"
            style={{ background: 'rgba(79,110,247,0.15)', color: '#818cf8' }}
          >
            {notices.length}건
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
          </div>
        ) : notices.length === 0 ? (
          <div className="text-center py-20 text-white/25">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm">아직 수집된 공고가 없습니다.</p>
            <p className="text-xs mt-1 text-white/15">매일 08:00에 자동으로 수집됩니다.</p>
          </div>
        ) : (
          <div>
            {notices.map((notice) => (
              <button
                key={notice.id}
                onClick={() => setSelected(notice)}
                className="w-full text-left px-6 py-4 transition-colors"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={STATUS_STYLE[notice.matchStatus]}
                      >
                        {notice.matchStatus}
                      </span>
                      {notice.aiSummary && (
                        <span className="text-xs text-white/25">점수 {notice.aiSummary.score}점</span>
                      )}
                    </div>
                    <p className="text-white/80 text-sm font-medium truncate">{notice.title}</p>
                    <p className="text-white/35 text-xs mt-0.5">
                      {notice.orgName} · {notice.estimatedAmount.toLocaleString()}만원
                    </p>
                    {notice.aiSummary?.oneLiner && (
                      <p className="text-white/25 text-xs mt-1 truncate">{notice.aiSummary.oneLiner}</p>
                    )}
                  </div>
                  {notice.aiSummary && (
                    <div
                      className="text-2xl font-bold shrink-0"
                      style={{ color: notice.aiSummary.score >= 70 ? '#818cf8' : 'rgba(255,255,255,0.2)' }}
                    >
                      {notice.aiSummary.score}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 슬라이드오버 */}
      {selected && <SlideOver notice={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function SlideOver({ notice, onClose }: { notice: BidNotice; onClose: () => void }) {
  const s = STATUS_STYLE[notice.matchStatus]
  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="fixed right-0 top-0 h-full w-[480px] z-50 flex flex-col"
        style={{
          background: '#130c2e',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <h3 className="text-white font-semibold text-sm">공고 상세</h3>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/70 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium inline-block mb-3"
              style={s}
            >
              {notice.matchStatus}
            </span>
            <h4 className="text-white font-bold text-lg leading-snug">{notice.title}</h4>
            <p className="text-white/40 text-sm mt-1">{notice.orgName}</p>
          </div>

          <div className="space-y-3">
            <InfoRow label="추정금액" value={`${notice.estimatedAmount.toLocaleString()}만원`} />
            <InfoRow
              label="마감일"
              value={notice.deadline?.toDate?.().toLocaleDateString('ko-KR') ?? '-'}
            />
          </div>

          {notice.aiSummary ? (
            <div
              className="rounded-2xl p-5 space-y-4"
              style={{
                background: 'linear-gradient(135deg, rgba(79,110,247,0.1), rgba(124,58,237,0.07))',
                border: '1px solid rgba(79,110,247,0.2)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm font-medium">AI 분석 결과</span>
                <span className="text-3xl font-bold" style={{ color: '#818cf8' }}>
                  {notice.aiSummary.score}점
                </span>
              </div>
              <p className="text-white font-medium text-sm">{notice.aiSummary.oneLiner}</p>
              <div className="space-y-2.5 text-sm text-white/50">
                <p><span className="text-white/30">필수 자격</span><br />{notice.aiSummary.qualifications}</p>
                <p><span className="text-white/30">주의사항</span><br />{notice.aiSummary.cautions}</p>
                <p><span className="text-white/30">난이도</span> · <span className="text-white/70">{notice.aiSummary.difficulty}</span></p>
                <p><span className="text-white/30">유리한 점</span><br />{notice.aiSummary.advantages}</p>
              </div>
            </div>
          ) : (
            <div
              className="rounded-2xl p-5 text-center text-white/25 text-sm"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              AI 분석 대기 중...
            </div>
          )}

          <a
            href={notice.noticeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            나라장터 원문 보기 →
          </a>
        </div>
      </div>
    </>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-center justify-between py-3"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <span className="text-white/35 text-sm">{label}</span>
      <span className="text-white/80 text-sm font-medium">{value}</span>
    </div>
  )
}
