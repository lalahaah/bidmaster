'use client'

import { useState } from 'react'
import Link from 'next/link'

const MOCK_NOTICES = [
  {
    id: '1',
    title: '행정안전부 지능형 정부서비스 플랫폼 구축 용역',
    orgName: '행정안전부',
    estimatedAmount: 85000,
    matchStatus: '가능' as const,
    matchScore: 92,
    bizCode: '소프트웨어 개발',
    deadline: '2026-04-15',
    requirements: '소프트웨어 개발업 / 전자입찰 / 업종 제한 없음',
    oneLiner: '업종코드 완전 일치, 지역 우대 적용 가능. 참가 강력 추천.',
    qualifications: '소프트웨어 개발업 등록 · 정보처리 면허 필수',
    cautions: '실적 증명 서류 발주기관 원본 제출 필요',
    advantages: '업종코드 완전 일치, 중앙부처 발주로 지역 제한 없음',
    noticeUrl: 'https://www.g2b.go.kr',
  },
  {
    id: '2',
    title: '국토교통부 스마트시티 통합 관제 플랫폼 개발',
    orgName: '국토교통부',
    estimatedAmount: 120000,
    matchStatus: '가능' as const,
    matchScore: 87,
    bizCode: 'IT 용역',
    deadline: '2026-04-20',
    requirements: '정보통신 / 전자입찰 / 업종 제한 있음',
    oneLiner: '대형 프로젝트, 실적 요건 충족 시 강력 추천.',
    qualifications: '정보통신공사업 면허 또는 소프트웨어 개발업 등록',
    cautions: '추정가 120억 — 실적 60억 이상 필요',
    advantages: '국토부 발주 대형 사업, 높은 단가',
    noticeUrl: 'https://www.g2b.go.kr',
  },
  {
    id: '3',
    title: '교육부 AI 기반 학습관리시스템(LMS) 고도화',
    orgName: '교육부',
    estimatedAmount: 45000,
    matchStatus: '조건부' as const,
    matchScore: 78,
    bizCode: '소프트웨어',
    deadline: '2026-04-10',
    requirements: '소프트웨어 개발 / 제한경쟁 / 업종 제한 있음',
    oneLiner: '실적 요건 확인 필요. 조건 충족 시 참가 권장.',
    qualifications: 'AI/ML 관련 개발 실적 1건 이상',
    cautions: 'AI 관련 실적 증빙 자료 필수',
    advantages: '교육 분야 레퍼런스 확보 가능',
    noticeUrl: 'https://www.g2b.go.kr',
  },
  {
    id: '4',
    title: '보건복지부 복지서비스 통합 포털 유지보수',
    orgName: '보건복지부',
    estimatedAmount: 32000,
    matchStatus: '가능' as const,
    matchScore: 82,
    bizCode: 'IT 유지보수',
    deadline: '2026-04-25',
    requirements: '정보처리 / 전자입찰 / 업종 제한 없음',
    oneLiner: '유지보수 사업, 안정적인 수익 확보 가능.',
    qualifications: '정보처리 관련 면허 또는 등록',
    cautions: '기존 시스템 이해도 필요',
    advantages: '업종 제한 없음, 소액으로 경쟁 낮음',
    noticeUrl: 'https://www.g2b.go.kr',
  },
  {
    id: '5',
    title: '환경부 탄소중립 모니터링 시스템 구축',
    orgName: '환경부',
    estimatedAmount: 68000,
    matchStatus: '조건부' as const,
    matchScore: 71,
    bizCode: '환경 IT',
    deadline: '2026-05-01',
    requirements: '환경 모니터링 / 전자입찰 / 업종 제한 있음',
    oneLiner: '환경 분야 경험 있으면 도전 가능.',
    qualifications: '환경 관련 시스템 개발 실적',
    cautions: '환경 분야 특수 요건 별도 확인 필요',
    advantages: '신규 분야 레퍼런스 확보 기회',
    noticeUrl: 'https://www.g2b.go.kr',
  },
  {
    id: '6',
    title: '중소벤처기업부 창업지원 플랫폼 개선 용역',
    orgName: '중소벤처기업부',
    estimatedAmount: 28000,
    matchStatus: '가능' as const,
    matchScore: 88,
    bizCode: '소프트웨어',
    deadline: '2026-04-18',
    requirements: '소프트웨어 / 전자입찰 / 업종 제한 없음',
    oneLiner: '소규모 사업, 조건 완전 부합. 강력 추천.',
    qualifications: '소프트웨어 개발 면허',
    cautions: '없음',
    advantages: '업종 제한 없음, 소액 경쟁 낮음, 조건 완전 부합',
    noticeUrl: 'https://www.g2b.go.kr',
  },
]

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  '가능':   { bg: 'rgba(34,197,94,0.12)',  color: '#4ade80' },
  '불가':   { bg: 'rgba(239,68,68,0.12)',  color: '#f87171' },
  '조건부': { bg: 'rgba(234,179,8,0.12)',  color: '#facc15' },
  '미분석': { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' },
}

const NAV_ITEMS = [
  { label: '대시보드', icon: '📊', active: true },
  { label: '회사 프로필', icon: '🏢', active: false },
  { label: '알림 설정', icon: '⚙️', active: false },
]

type Notice = typeof MOCK_NOTICES[number]

export default function DemoPage() {
  const [selected, setSelected] = useState<Notice | null>(null)
  const [filter, setFilter] = useState<string>('전체')

  const filtered = filter === '전체'
    ? MOCK_NOTICES
    : MOCK_NOTICES.filter(n => n.matchStatus === filter)

  return (
    <div className="min-h-screen flex" style={{ background: '#0d0820' }}>
      {/* 데모 배너 */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-2 text-xs"
        style={{ background: 'linear-gradient(90deg, #006B7A, #006B7A)', color: 'white' }}
      >
        <span className="font-medium">👀 데모 모드 — 샘플 데이터로 구성된 미리보기입니다</span>
        <Link
          href="/login"
          className="font-bold underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          무료로 시작하기 →
        </Link>
      </div>

      {/* 사이드바 */}
      <aside
        className="w-60 fixed inset-y-0 left-0 z-40 flex flex-col pt-8"
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
            <img src="/logo-white.svg" alt="BidMaster" style={{ height: '28px', width: 'auto', display: 'block' }} />
          </Link>
        </div>

        {/* 네비 */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
              style={item.active ? {
                background: 'rgba(0,107,122,0.15)',
                color: '#006B7A',
                border: '1px solid rgba(0,107,122,0.2)',
              } : {
                color: 'rgba(255,255,255,0.35)',
                border: '1px solid transparent',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        {/* 가상 유저 */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div
            className="flex items-center gap-3 p-3 rounded-xl mb-2"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: '#006B7A' }}
            >
              데
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">데모 사용자</p>
              <p className="text-white/30 text-xs truncate">demo@bidmaster.io</p>
            </div>
          </div>
          <Link
            href="/login"
            className="w-full text-center block text-xs font-bold py-2 rounded-lg transition-all"
            style={{ background: 'linear-gradient(135deg, #006B7A, #006B7A)', color: 'white' }}
          >
            실제로 시작하기
          </Link>
        </div>
      </aside>

      {/* 메인 */}
      <main className="flex-1 ml-60 pt-8 p-8">
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
              className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/40 text-sm">{k.label}</span>
                <span className="text-xl">{k.icon}</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-white">{k.value}</span>
                {k.change && <span className="text-sm text-emerald-400 mb-1">{k.change}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* 업그레이드 배너 */}
        <div
          className="mb-6 p-4 rounded-xl flex items-center justify-between"
          style={{
            background: 'linear-gradient(135deg, rgba(0,107,122,0.12), rgba(0,107,122,0.08))',
            border: '1px solid rgba(0,107,122,0.25)',
          }}
        >
          <div>
            <p className="text-white font-medium text-sm">무료 체험 중</p>
            <p className="text-white/45 text-xs mt-0.5">Pro 플랜으로 업그레이드하면 무제한 공고 분석이 가능합니다.</p>
          </div>
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white shrink-0 ml-4"
            style={{ background: '#006B7A' }}
          >
            업그레이드
          </Link>
        </div>

        {/* 필터 탭 */}
        <div className="flex gap-2 mb-4">
          {['전체', '가능', '조건부', '불가'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
              style={filter === f
                ? { background: 'rgba(0,107,122,0.2)', color: '#006B7A', border: '1px solid rgba(0,107,122,0.3)' }
                : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.07)' }
              }
            >
              {f}
            </button>
          ))}
        </div>

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
              style={{ background: 'rgba(0,107,122,0.15)', color: '#006B7A' }}
            >
              {filtered.length}건
            </span>
          </div>

          {filtered.map((notice) => (
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
                    <span className="text-xs text-white/25">점수 {notice.matchScore}점</span>
                  </div>
                  <p className="text-white/80 text-sm font-medium truncate">{notice.title}</p>
                  <p className="text-white/35 text-xs mt-0.5">
                    {notice.orgName} · {notice.estimatedAmount.toLocaleString()}만원
                  </p>
                  <p className="text-white/25 text-xs mt-1 truncate">{notice.oneLiner}</p>
                </div>
                <div
                  className="text-2xl font-bold shrink-0"
                  style={{ color: notice.matchScore >= 70 ? '#006B7A' : 'rgba(255,255,255,0.2)' }}
                >
                  {notice.matchScore}
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* 슬라이드오버 */}
      {selected && <DemoSlideOver notice={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function DemoSlideOver({ notice, onClose }: { notice: Notice; onClose: () => void }) {
  const s = STATUS_STYLE[notice.matchStatus]
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
              {notice.matchStatus}
            </span>
            <h4 className="text-white font-bold text-lg leading-snug">{notice.title}</h4>
            <p className="text-white/40 text-sm mt-1">{notice.orgName}</p>
          </div>

          <div className="space-y-3">
            {[
              { label: '추정금액', value: `${notice.estimatedAmount.toLocaleString()}만원` },
              { label: '마감일', value: notice.deadline },
              { label: '입찰 방법', value: notice.requirements },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-white/35 text-sm">{r.label}</span>
                <span className="text-white/80 text-sm font-medium">{r.value}</span>
              </div>
            ))}
          </div>

          <div
            className="rounded-2xl p-5 space-y-4"
            style={{
              background: 'linear-gradient(135deg, rgba(0,107,122,0.1), rgba(0,107,122,0.07))',
              border: '1px solid rgba(0,107,122,0.2)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-sm font-medium">AI 분석 결과</span>
              <span className="text-3xl font-bold" style={{ color: '#006B7A' }}>{notice.matchScore}점</span>
            </div>
            <p className="text-white font-medium text-sm">{notice.oneLiner}</p>
            <div className="space-y-2.5 text-sm text-white/50">
              <p><span className="text-white/30">필수 자격</span><br />{notice.qualifications}</p>
              <p><span className="text-white/30">주의사항</span><br />{notice.cautions}</p>
              <p><span className="text-white/30">유리한 점</span><br />{notice.advantages}</p>
            </div>
          </div>

          <Link
            href="/login"
            className="block w-full text-center py-3.5 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: '#006B7A' }}
          >
            지금 가입하고 실제 공고 보기 →
          </Link>
        </div>
      </div>
    </>
  )
}
