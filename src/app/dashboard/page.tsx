'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { getUserAnalyses } from '@/lib/firestore'
import { auth } from '@/lib/firebase'
import type { BidNotice, EnrichedNotice, AISummary, MatchStatus } from '@/types'

const STATUS_STYLE: Record<MatchStatus, { bg: string; color: string }> = {
  '가능':  { bg: 'rgba(34,197,94,0.12)',  color: '#4ade80' },
  '불가':  { bg: 'rgba(239,68,68,0.12)',   color: '#f87171' },
  '조건부':{ bg: 'rgba(234,179,8,0.12)',   color: '#facc15' },
  '미분석':{ bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' },
}

const TEST_ACCOUNTS = ['test@test.com']
const QUOTA: Record<string, number> = { free: 3, pro: 100, enterprise: 500 }

type SortKey = 'relevance' | 'deadline' | 'amount' | 'latest'
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'relevance', label: '관련도순' },
  { key: 'deadline',  label: '마감임박순' },
  { key: 'amount',    label: '금액높은순' },
  { key: 'latest',    label: '최신등록순' },
]

/** 마감일까지 남은 일수 → 표시용 문자열 + 색상 */
function deadlineBadge(notice: EnrichedNotice & { _daysLeft?: number | null }) {
  const days = notice._daysLeft
  if (days === undefined || days === null) return null
  if (days < 0)   return { label: '마감',      color: 'rgba(255,255,255,0.2)' }
  if (days === 0) return { label: 'D-Day',     color: '#f87171' }
  if (days <= 3)  return { label: `D-${days}`, color: '#f87171' }
  if (days <= 7)  return { label: `D-${days}`, color: '#fb923c' }
  if (days <= 14) return { label: `D-${days}`, color: '#facc15' }
  if (days <= 30) return { label: `D-${days}`, color: '#4ade80' }
  return { label: `D-${days}`, color: 'rgba(255,255,255,0.3)' }
}

function sortNotices(list: EnrichedNotice[], key: SortKey): EnrichedNotice[] {
  const copy = [...list]
  switch (key) {
    case 'relevance':
      return copy.sort((a, b) => ((b as never as Record<string, number>)._score ?? 0) - ((a as never as Record<string, number>)._score ?? 0))
    case 'deadline':
      return copy.sort((a, b) => {
        const da = (a as never as Record<string, number | null>)._daysLeft
        const db = (b as never as Record<string, number | null>)._daysLeft
        if (da === null || da === undefined) return 1
        if (db === null || db === undefined) return -1
        if ((da as number) < 0) return 1
        if ((db as number) < 0) return -1
        return (da as number) - (db as number)
      })
    case 'amount':
      return copy.sort((a, b) => b.estimatedAmount - a.estimatedAmount)
    case 'latest':
      return copy  // API가 이미 최신순
    default:
      return copy
  }
}

function DashboardContent() {
  const { userDoc, user, refreshUserDoc } = useAuth()
  const searchParams = useSearchParams()
  const [showWelcome, setShowWelcome] = useState(searchParams.get('welcome') === 'true')
  const [notices, setNotices] = useState<EnrichedNotice[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMsg, setLoadingMsg] = useState('공고 불러오는 중...')
  const [selected, setSelected] = useState<EnrichedNotice | null>(null)
  const [isPersonalized, setIsPersonalized] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('relevance')
  const [activeTab, setActiveTab] = useState<'personalized' | 'all'>('personalized')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isMoreLoading, setIsMoreLoading] = useState(false)

  const loadNotices = useCallback(async (isMore = false) => {
    if (!user) return
    if (isMore) setIsMoreLoading(true)
    else {
      setLoading(true)
      setNotices([])
    }

    setLoadingMsg(activeTab === 'personalized' ? '내 프로필 맞춤 공고 검색 중...' : '전체 공고 불러오는 중...')
    
    try {
      const token = await auth!.currentUser!.getIdToken()
      const currentPage = isMore ? page + 1 : 1
      const url = `/api/notices/personalized?page=${currentPage}&limit=50${activeTab === 'all' ? '&all=true' : ''}`
      
      const ownerUid = userDoc?.role === 'member' && userDoc?.teamId ? userDoc.teamId : user.uid

      const [res, analyses] = await Promise.all([
        fetch(url, { headers: { Authorization: `Bearer ${token}` } }),
        getUserAnalyses(ownerUid),
      ])
      
      const data = await res.json()
      const rawNotices: BidNotice[] = data.notices ?? []
      setIsPersonalized(data.personalized ?? false)
      setHasMore(data.hasMore ?? false)
      setTotalCount(data.total ?? 0)
      
      if (isMore) setPage(currentPage)
      else setPage(1)

      const enriched: EnrichedNotice[] = rawNotices.map((n) => {
        const analysis = analyses[n.id]
        return {
          ...n,
          matchStatus: analysis?.matchStatus ?? '미분석',
          aiSummary: analysis?.aiSummary ?? null,
        }
      })

      if (isMore) {
        setNotices(prev => [...prev, ...enriched])
      } else {
        setNotices(enriched)
      }
    } finally {
      setLoading(false)
      setIsMoreLoading(false)
      setLoadingMsg('공고 불러오는 중...')
    }
  }, [user, activeTab, page])

  useEffect(() => { loadNotices() }, [activeTab]) // 탭 바뀔 때만 초기 로드

  const plan = userDoc?.subscription.plan ?? 'free'
  const isTestAccount = TEST_ACCOUNTS.includes(user?.email ?? '')
  const quota = isTestAccount ? Infinity : (QUOTA[plan] ?? 3)
  const usedCount = userDoc?.aiUsage?.count ?? 0
  const remaining = isTestAccount ? Infinity : Math.max(0, quota - usedCount)

  // KPI
  const analyzed = notices.filter(n => n.aiSummary).length
  const possible = notices.filter(n => n.matchStatus === '가능').length
  const conditional = notices.filter(n => n.matchStatus === '조건부').length
  const avgScore = analyzed > 0
    ? Math.round(notices.filter(n => n.aiSummary).reduce((s, n) => s + (n.aiSummary?.score ?? 0), 0) / analyzed)
    : 0

  const unanalyzedCount = notices.filter(n => n.matchStatus === '미분석').length

  // 개별 분석 완료 후 리스트 내 해당 공고 업데이트
  const handleAnalyzed = useCallback((noticeId: string, aiSummary: AISummary, matchStatus: MatchStatus) => {
    setNotices(prev => prev.map(n =>
      n.id === noticeId ? { ...n, aiSummary, matchStatus } : n
    ))
    setSelected(prev => prev?.id === noticeId ? { ...prev, aiSummary, matchStatus } : prev)
    refreshUserDoc()
  }, [refreshUserDoc])

  const hasProfile = !!(userDoc?.profile?.bizCodes?.length)

  return (
    <div className="p-8">
      {/* 웰컴 알림 */}
      {showWelcome && (
        <div 
          className="mb-8 p-6 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500"
          style={{ 
            background: 'linear-gradient(135deg, #006B7A, #005a69)', 
            boxShadow: '0 8px 32px rgba(0,107,122,0.25)' 
          }}
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">🎉</span>
            <div>
              <h2 className="text-white font-bold text-lg">구독해 주셔서 감사합니다!</h2>
              <p className="text-white/70 text-sm">이제 모든 AI 기능을 무제한으로 이용하실 수 있습니다.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowWelcome(false)}
            className="text-white/50 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* 헤더 */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">대시보드</h1>
          <p className="text-white/40 text-sm mt-1">
            {isPersonalized
              ? '내 프로필에 맞는 공고를 우선 표시합니다'
              : '공고를 클릭하면 AI 분석을 실행할 수 있습니다'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isTestAccount ? (
            <span className="text-xs px-3 py-1.5 rounded-full" style={{ background: 'rgba(104,213,133,0.1)', color: '#68D585' }}>
              테스트 계정 (무제한)
            </span>
          ) : (
            <span className="text-xs px-3 py-1.5 rounded-full" style={{
              background: remaining > 5 ? 'rgba(104,213,133,0.1)' : 'rgba(234,179,8,0.1)',
              color: remaining > 5 ? '#68D585' : '#facc15',
            }}>
              AI 분석 {isTestAccount ? '∞' : `${usedCount}/${quota}`}건 사용
            </span>
          )}
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: '수집 공고',   value: totalCount, icon: '📋' },
          { label: 'AI 분석 완료', value: analyzed, icon: '🎯' },
          { label: '참가 가능',   value: possible, icon: '✅', highlight: true, color: '#4ade80' },
          { label: '조건부',      value: conditional, icon: '⚠️', highlight: conditional > 0, color: '#facc15' },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-2xl p-5"
            style={{
              background: k.highlight
                ? `linear-gradient(135deg, rgba(${k.color === '#4ade80' ? '34,197,94' : '234,179,8'}, 0.12), rgba(${k.color === '#4ade80' ? '34,197,94' : '234,179,8'}, 0.08))`
                : 'rgba(255,255,255,0.04)',
              border: k.highlight
                ? `1px solid rgba(${k.color === '#4ade80' ? '34,197,94' : '234,179,8'}, 0.25)`
                : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/40 text-sm">{k.label}</span>
              <span className="text-xl">{k.icon}</span>
            </div>
            <span className="text-3xl font-bold text-white" style={k.highlight ? { color: k.color } : {}}>
              {k.value}
            </span>
          </div>
        ))}
      </div>

      {/* 프로필 미설정 안내 */}
      {!hasProfile && (
        <div
          className="mb-6 p-4 rounded-xl flex items-center justify-between"
          style={{
            background: 'linear-gradient(135deg, rgba(234,179,8,0.1), rgba(234,179,8,0.06))',
            border: '1px solid rgba(234,179,8,0.25)',
          }}
        >
          <div>
            <p className="text-white font-medium text-sm">회사 프로필을 먼저 설정해주세요</p>
            <p className="text-white/45 text-xs mt-0.5">업종코드, 면허 등을 입력해야 AI가 내 회사에 맞는 공고를 분석할 수 있습니다.</p>
          </div>
          <a
            href="/dashboard/profile"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white shrink-0 ml-4"
            style={{ background: '#b45309' }}
          >
            프로필 설정
          </a>
        </div>
      )}

      {/* 업그레이드 배너 */}
      {plan === 'free' && !isTestAccount && (
        <div
          className="mb-6 p-4 rounded-xl flex items-center justify-between"
          style={{
            background: 'linear-gradient(135deg, rgba(0,107,122,0.12), rgba(0,107,122,0.08))',
            border: '1px solid rgba(0,107,122,0.25)',
          }}
        >
          <div>
            <p className="text-white font-medium text-sm">무료 체험 중 ({remaining}건 남음)</p>
            <p className="text-white/45 text-xs mt-0.5">Pro 플랜으로 업그레이드하면 월 100건 AI 분석이 가능합니다.</p>
          </div>
          <a
            href="/#pricing"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white shrink-0 ml-4"
            style={{ background: '#006B7A' }}
          >
            업그레이드
          </a>
        </div>
      )}

      {/* 공고 리스트 */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div
          className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* 왼쪽: 메인 탭 */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/20">
            <button
              onClick={() => setActiveTab('personalized')}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              style={activeTab === 'personalized'
                ? { background: 'rgba(0,107,122,0.2)', color: '#5BBCCA' }
                : { color: 'rgba(255,255,255,0.4)' }
              }
            >
              내 맞춤 공고
              {activeTab === 'personalized' && !loading && (
                <span className="text-[10px] bg-[#006B7A]/30 px-1.5 py-0.5 rounded-full">{notices.length}</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              style={activeTab === 'all'
                ? { background: 'rgba(255,255,255,0.1)', color: '#fff' }
                : { color: 'rgba(255,255,255,0.4)' }
              }
            >
              전체 공고
              {activeTab === 'all' && !loading && (
                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">{notices.length}</span>
              )}
            </button>
          </div>

          {/* 오른쪽: 정렬 및 정보 */}
          <div className="flex items-center gap-3">
            {unanalyzedCount > 0 && (
              <span className="text-[10px] px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-500 font-bold uppercase tracking-tight">
                미분석 {unanalyzedCount}
              </span>
            )}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSortKey(opt.key)}
                  className="px-2.5 py-1 rounded-md text-[11px] transition-all"
                  style={sortKey === opt.key
                    ? { background: 'rgba(0,107,122,0.3)', color: '#5BBCCA', fontWeight: 600 }
                    : { background: 'transparent', color: 'rgba(255,255,255,0.3)' }
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
            <p className="text-white/30 text-xs">{loadingMsg}</p>
          </div>
        ) : notices.length === 0 ? (
          <div className="text-center py-20 text-white/25">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm">
              {activeTab === 'personalized'
                ? '프로필에 맞는 공고가 없습니다. 희망 금액 범위나 키워드를 조정해보세요.'
                : '아직 수집된 공고가 없습니다.'}
            </p>
            <p className="text-xs mt-1 text-white/15">매일 08:00에 자동으로 수집됩니다.</p>
          </div>
        ) : (
          <div>
            {sortNotices(notices, sortKey).map((notice) => {
              const badge = deadlineBadge(notice as EnrichedNotice & { _daysLeft?: number | null })
              return (
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
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={STATUS_STYLE[notice.matchStatus]}
                      >
                        {notice.matchStatus}
                      </span>
                      {badge && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: 'rgba(255,255,255,0.05)', color: badge.color }}>
                          {badge.label}
                        </span>
                      )}
                      {notice.aiSummary && (
                        <span className="text-xs text-white/25">{notice.aiSummary.score}점</span>
                      )}
                    </div>
                    <p className="text-white/80 text-sm font-medium truncate">{notice.title}</p>
                    <p className="text-white/35 text-xs mt-0.5">
                      {notice.orgName} · {notice.estimatedAmount > 0 ? `${notice.estimatedAmount.toLocaleString()}만원` : '금액 미공개'}
                    </p>
                    {notice.aiSummary?.oneLiner && (
                      <p className="text-white/25 text-xs mt-1 truncate">{notice.aiSummary.oneLiner}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {notice.aiSummary ? (
                      <div
                        className="text-2xl font-bold"
                        style={{ color: notice.aiSummary.score >= 70 ? '#006B7A' : 'rgba(255,255,255,0.2)' }}
                      >
                        {notice.aiSummary.score}
                      </div>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(0,107,122,0.15)', color: '#5BBCCA' }}>
                        ⚡ 분석하기
                      </span>
                    )}
                  </div>
                </div>
              </button>
              )
            })}

            {hasMore && !loading && (
              <div className="p-6 flex justify-center">
                <button
                  onClick={() => loadNotices(true)}
                  disabled={isMoreLoading}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {isMoreLoading ? (
                    <><div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" /> 불러오는 중...</>
                  ) : (
                    '더 보기'
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {selected && (
        <SlideOver
          notice={selected}
          onClose={() => setSelected(null)}
          onAnalyzed={handleAnalyzed}
          remaining={remaining}
          isTestAccount={isTestAccount}
        />
      )}
    </div>
  )
}

function SlideOver({
  notice,
  onClose,
  onAnalyzed,
  remaining,
  isTestAccount,
}: {
  notice: EnrichedNotice
  onClose: () => void
  onAnalyzed: (id: string, aiSummary: AISummary, matchStatus: MatchStatus) => void
  remaining: number | typeof Infinity
  isTestAccount: boolean
}) {
  const [current, setCurrent] = useState<EnrichedNotice>(notice)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const s = STATUS_STYLE[current.matchStatus]

  const handleAnalyze = async () => {
    if (!auth?.currentUser) return
    setIsAnalyzing(true)
    setError(null)
    try {
      const token = await auth.currentUser.getIdToken()
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ noticeId: current.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? '분석 실패')

      const updated: EnrichedNotice = { ...current, aiSummary: data.aiSummary, matchStatus: data.matchStatus }
      setCurrent(updated)
      onAnalyzed(current.id, data.aiSummary, data.matchStatus)
    } catch (err) {
      setError(String(err))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const canAnalyze = current.matchStatus === '미분석' && !isAnalyzing && (isTestAccount || remaining > 0)

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="fixed right-0 top-0 h-full w-[480px] z-50 flex flex-col"
        style={{ background: '#130c2e', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <h3 className="text-white font-semibold text-sm">공고 상세</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors text-xl leading-none">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium inline-block mb-3" style={s}>
              {current.matchStatus}
            </span>
            <h4 className="text-white font-bold text-lg leading-snug">{current.title}</h4>
            <p className="text-white/40 text-sm mt-1">{current.orgName}</p>
          </div>

          <div className="space-y-3">
            <InfoRow label="추정금액" value={current.estimatedAmount > 0 ? `${current.estimatedAmount.toLocaleString()}만원` : '미공개'} />
            <InfoRow label="마감일" value={current.deadline?.toDate?.().toLocaleDateString('ko-KR') ?? '-'} />
            {current.requirements && <InfoRow label="공고 유형" value={current.requirements} />}
          </div>

          {current.aiSummary ? (
            <div
              className="rounded-2xl p-5 space-y-4"
              style={{
                background: 'linear-gradient(135deg, rgba(0,107,122,0.1), rgba(0,107,122,0.07))',
                border: '1px solid rgba(0,107,122,0.2)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm font-medium">AI 분석 결과</span>
                <span className="text-3xl font-bold" style={{ color: '#006B7A' }}>{current.aiSummary.score}점</span>
              </div>
              <p className="text-white font-medium text-sm">{current.aiSummary.oneLiner}</p>
              <div className="space-y-2.5 text-sm text-white/50">
                {current.aiSummary.qualifications && (
                  <p><span className="text-white/30">필수 자격</span><br />{current.aiSummary.qualifications}</p>
                )}
                {current.aiSummary.cautions && (
                  <p><span className="text-white/30">주의사항</span><br />{current.aiSummary.cautions}</p>
                )}
                <p><span className="text-white/30">난이도</span> · <span className="text-white/70">{current.aiSummary.difficulty}</span></p>
                {current.aiSummary.advantages && (
                  <p><span className="text-white/30">유리한 점</span><br />{current.aiSummary.advantages}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {error && (
                <p className="text-xs text-red-400 text-center">{error}</p>
              )}
              <button
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: '#006B7A', boxShadow: '0 4px 16px rgba(0,107,122,0.3)' }}
              >
                {isAnalyzing ? (
                  <><div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" /> AI 분석 중...</>
                ) : !isTestAccount && remaining === 0 ? (
                  '⚡ 이번 달 분석 한도 소진'
                ) : (
                  '⚡ AI 분석하기'
                )}
              </button>
              {!isTestAccount && remaining <= 3 && remaining > 0 && (
                <p className="text-xs text-center" style={{ color: '#facc15' }}>
                  이번 달 분석 {remaining}건 남음
                </p>
              )}
            </div>
          )}

          <a
            href={current.noticeUrl}
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
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span className="text-white/35 text-sm">{label}</span>
      <span className="text-white/80 text-sm font-medium">{value}</span>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="p-8">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin mx-auto mt-20" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}

