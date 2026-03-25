'use client'

import Link from 'next/link'

// ── 레퍼런스 컬러 팔레트 (02SaaSSubscription.tsx 기준) ────────
// bg: #fcfdfe  |  section-alt: #f4f7fa  |  dark: #161c2d
// primary: #473bf0  |  accent-green: #68D585
// card: white / border #e7e9ed  |  tag badge: #473bf0 @ 10% opacity

export default function LandingPage() {
  return (
    <div style={{ background: '#fcfdfe', color: '#161c2d', fontFamily: 'var(--font-jakarta, "Plus Jakarta Sans", Inter, sans-serif)' }}>
      <Nav />
      <Hero />
      <Features />
      <Stats />
      <ContentSection1 />
      <ContentSection2 />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTABanner />
      <Footer />
    </div>
  )
}

/* ─── NAV ──────────────────────────────────────────────────── */
function Nav() {
  return (
    <header className="w-full px-8 py-5" style={{ borderBottom: '1px solid #e7e9ed' }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* 로고 */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#473bf0' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" />
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: '20px', color: '#161c2d', letterSpacing: '-0.5px' }}>BidMaster</span>
        </div>

        {/* 중앙 링크 */}
        <nav className="hidden md:flex items-center gap-10">
          {[['#features','기능'],['#how','이용방법'],['#pricing','요금제'],['#faq','FAQ']].map(([href, label]) => (
            <a key={label} href={href}
              className="hover:text-[#473bf0] transition-colors"
              style={{ fontSize: '15px', fontWeight: 700, color: '#161c2d', letterSpacing: '-0.1px' }}>{label}</a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login?mode=login"
            className="font-bold rounded-lg px-4 py-2.5 transition-colors hover:text-[#473bf0]"
            style={{ fontSize: '15px', color: '#161c2d', letterSpacing: '-0.3px' }}>
            로그인
          </Link>
          <Link href="/login"
            className="inline-flex items-center justify-center text-white font-bold rounded-lg px-5 py-2.5 transition-opacity hover:opacity-90"
            style={{ background: '#473bf0', fontSize: '15px', letterSpacing: '-0.5px' }}>
            무료 체험 시작
          </Link>
        </div>
      </div>
    </header>
  )
}

/* ─── HERO ─────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="pt-20 pb-0 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3rem)', fontWeight: 800, color: '#161c2d', lineHeight: 1.2, letterSpacing: '-1.8px', marginBottom: '24px' }}>
          나라장터 입찰 공고를<br />AI가 자동으로 분석합니다
        </h1>
        <p className="mx-auto" style={{ fontSize: '19px', color: '#161c2d', opacity: 0.7, lineHeight: '32px', letterSpacing: '-0.2px', maxWidth: '580px', marginBottom: '40px' }}>
          수백 건의 공고 중 우리 회사 조건에 맞는 것만 골라<br />카카오톡으로 즉시 알려드립니다
        </p>

        {/* 버튼 2개 - 레퍼런스와 동일: solid blue + ghost */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/login"
            className="inline-flex items-center gap-2 text-white font-bold rounded-lg px-6 py-3.5 transition-opacity hover:opacity-90"
            style={{ background: '#473bf0', fontSize: '17px', letterSpacing: '-0.6px' }}>
            무료 체험 시작하기
            <ArrowRight color="white" />
          </Link>
          <a href="#demo"
            className="inline-flex items-center justify-center font-bold rounded-lg px-6 py-3.5 transition-colors hover:bg-gray-100"
            style={{ fontSize: '17px', letterSpacing: '-0.6px', color: '#161c2d' }}>
            데모 살펴보기
          </a>
        </div>
      </div>

      {/* 브라우저 목업 - 레퍼런스의 browser 이미지 역할 */}
      <div id="demo" className="max-w-5xl mx-auto mt-16">
        <div className="rounded-xl overflow-hidden shadow-[0px_42px_44px_-10px_rgba(1,23,48,0.12)]"
          style={{ background: '#94a2b6' }}>
          <BrowserMockup />
        </div>
      </div>
    </section>
  )
}

function BrowserMockup() {
  const notices = [
    { title: '행정안전부 정보화 시스템 구축 용역', org: '행정안전부', score: 92, status: '가능', amount: '85,000' },
    { title: '국토교통부 스마트시티 플랫폼 개발', org: '국토교통부', score: 87, status: '가능', amount: '120,000' },
    { title: '교육부 AI 학습관리시스템 고도화', org: '교육부', score: 78, status: '조건부', amount: '45,000' },
    { title: '보건복지부 복지서비스 통합 포털', org: '보건복지부', score: 71, status: '가능', amount: '62,000' },
  ]
  return (
    <div style={{ background: '#f8fafc', borderRadius: '12px', overflow: 'hidden', fontFamily: 'inherit' }}>
      {/* 브라우저 크롬 바 */}
      <div className="flex items-center gap-2 px-4 py-3" style={{ background: '#e9edf2', borderBottom: '1px solid #dde2ea' }}>
        <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
        <div className="flex-1 mx-4 h-6 rounded flex items-center px-3"
          style={{ background: 'white', border: '1px solid #dde2ea' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>bidmaster.io/dashboard</span>
        </div>
      </div>

      {/* 대시보드 레이아웃 */}
      <div className="flex" style={{ minHeight: '380px' }}>
        {/* 사이드바 */}
        <div className="w-44 shrink-0 p-4" style={{ background: '#161c2d', borderRight: '1px solid #1e2535' }}>
          <div className="font-bold text-sm mb-6" style={{ color: 'rgba(255,255,255,0.9)' }}>BidMaster</div>
          {[{ l: '대시보드', a: true }, { l: '공고 목록' }, { l: 'AI 분석' }, { l: '알림 설정' }, { l: '프로필' }].map(m => (
            <div key={m.l} className="px-2 py-2 rounded-lg mb-1"
              style={{ background: m.a ? '#473bf0' : 'transparent', color: m.a ? 'white' : 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: m.a ? 700 : 400, cursor: 'default' }}>
              {m.l}
            </div>
          ))}
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex-1 p-5" style={{ background: '#f8fafc' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#161c2d' }}>AI 추천 공고</h3>
            <span style={{ fontSize: '11px', color: '#473bf0', fontWeight: 700, background: 'rgba(71,59,240,0.08)', padding: '3px 10px', borderRadius: '12px' }}>오늘 247건 수집</span>
          </div>
          {/* KPI 카드 */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[{ l: '수집 공고', v: '247' }, { l: 'AI 추천', v: '18' }, { l: '참가 가능', v: '12' }, { l: '평균 점수', v: '76' }].map(k => (
              <div key={k.l} className="rounded-lg p-3" style={{ background: 'white', border: '1px solid #e7e9ed' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#161c2d' }}>{k.v}</div>
                <div style={{ fontSize: '10px', color: '#717182' }}>{k.l}</div>
              </div>
            ))}
          </div>
          {/* 공고 테이블 */}
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #e7e9ed', background: 'white' }}>
            <div className="px-4 py-2 flex gap-3" style={{ background: '#f8fafc', borderBottom: '1px solid #e7e9ed' }}>
              {['공고명', '발주기관', '추정금액', '상태', 'AI점수'].map((h, i) => (
                <span key={h} style={{ fontSize: '10px', fontWeight: 700, color: '#717182', flex: i === 0 ? 3 : 1 }}>{h}</span>
              ))}
            </div>
            {notices.map((n, i) => (
              <div key={n.title} className="px-4 py-2.5 flex gap-3 items-center"
                style={{ borderBottom: i < notices.length - 1 ? '1px solid #f1f3f5' : 'none' }}>
                <span style={{ flex: 3, fontSize: '11px', color: '#161c2d', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</span>
                <span style={{ flex: 1, fontSize: '10px', color: '#717182', whiteSpace: 'nowrap' }}>{n.org}</span>
                <span style={{ flex: 1, fontSize: '10px', color: '#717182', whiteSpace: 'nowrap' }}>{n.amount}만</span>
                <span style={{ flex: 1 }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '99px',
                    background: n.status === '가능' ? 'rgba(104,213,133,0.15)' : 'rgba(250,204,21,0.15)',
                    color: n.status === '가능' ? '#15803d' : '#92400e' }}>{n.status}</span>
                </span>
                <span style={{ flex: 1, fontSize: '15px', fontWeight: 800, color: n.score >= 85 ? '#473bf0' : '#94a3b8' }}>{n.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── FEATURES ─────────────────────────────────────────────── */
// 레퍼런스: 3칼럼, 아이콘(초록) + 타이틀 + 설명, 배경 없음
function Features() {
  const features = [
    {
      icon: <IconCode />,
      title: '공고 자동 수집',
      desc: '나라장터 API를 통해 매일 오전 8시, 전국 발주기관의 수백 건 공고를 자동으로 수집합니다. 누락 없이, 실시간으로.',
    },
    {
      icon: <IconAI />,
      title: 'AI 분석 요약',
      desc: 'Claude AI가 공고문 전체를 읽고 자격조건, 주의사항, 유리한 포인트를 5가지 항목으로 자동 정리합니다.',
    },
    {
      icon: <IconPhone />,
      title: '카카오 알림톡',
      desc: 'AI 추천 점수 70점 이상 공고가 등록되면 즉시 카카오 알림톡으로 발송합니다. 모바일에서도 절대 놓치지 마세요.',
    },
  ]
  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-16">
          {features.map(f => (
            <div key={f.title}>
              <div className="mb-5">{f.icon}</div>
              <h3 style={{ fontSize: '21px', fontWeight: 800, color: '#161c2d', letterSpacing: '-0.5px', marginBottom: '10px' }}>{f.title}</h3>
              <p style={{ fontSize: '17px', color: '#161c2d', opacity: 0.7, lineHeight: '29px', letterSpacing: '-0.2px' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── STATS ─────────────────────────────────────────────────── */
// 레퍼런스: 3개 숫자(48px bold) + 설명, 하단 구분선
function Stats() {
  const stats = [
    { value: '500건+', desc: '나라장터에서 매일 수집되는 공고 수' },
    { value: '95%',   desc: 'AI 자격 매칭 정확도' },
    { value: '14일',  desc: '신용카드 없이 무료 체험 기간' },
  ]
  return (
    <>
      <div className="px-6">
        <div className="max-w-6xl mx-auto py-10">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map(s => (
              <div key={s.value} className="flex items-center gap-4">
                <span style={{ fontSize: '48px', fontWeight: 800, color: '#161c2d', letterSpacing: '-1.8px', whiteSpace: 'nowrap' }}>{s.value}</span>
                <p style={{ fontSize: '17px', color: '#161c2d', opacity: 0.7, lineHeight: '29px', letterSpacing: '-0.2px' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <hr style={{ borderColor: '#e7e9ed' }} />
    </>
  )
}

/* ─── CONTENT SECTION 1 (레퍼런스 "Content 01": bg #f4f7fa) ── */
// 레퍼런스: 왼쪽 텍스트+CTA, 오른쪽 플로팅 이미지들
function ContentSection1() {
  return (
    <section className="py-24 px-6" style={{ background: '#f4f7fa' }}>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        {/* 왼쪽 텍스트 */}
        <div className="lg:w-2/5">
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#161c2d', letterSpacing: '-1.2px', lineHeight: '48px', marginBottom: '20px' }}>
            입찰 담당자의 하루를 완전히 바꿔드립니다
          </h2>
          <p style={{ fontSize: '19px', color: '#161c2d', opacity: 0.7, lineHeight: '32px', letterSpacing: '-0.2px', marginBottom: '32px' }}>
            회사 프로필만 입력하면 BidMaster가 나머지를 모두 처리합니다. 매일 아침 맞춤형 입찰 공고를 카카오톡으로 받으세요.
          </p>
          <Link href="/login"
            className="inline-flex items-center gap-2 text-white font-bold rounded-lg px-6 py-3.5 transition-opacity hover:opacity-90"
            style={{ background: '#473bf0', fontSize: '17px', letterSpacing: '-0.6px' }}>
            무료 체험 시작하기
            <ArrowRight color="white" />
          </Link>
        </div>

        {/* 오른쪽 플로팅 목업 카드 (레퍼런스 이미지 역할) */}
        <div className="lg:w-3/5 relative">
          {/* 메인 AI 분석 카드 */}
          <div className="rounded-2xl overflow-hidden shadow-[0px_32px_54px_0px_rgba(15,14,35,0.19)]"
            style={{ background: 'white', border: '1px solid #e7e9ed' }}>
            <div className="p-4 flex items-center justify-between"
              style={{ background: '#f8fafc', borderBottom: '1px solid #e7e9ed' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#161c2d' }}>AI 분석 리포트</span>
              <span style={{ fontSize: '11px', color: '#473bf0', fontWeight: 700, background: 'rgba(71,59,240,0.1)', padding: '3px 10px', borderRadius: '12px' }}>92점</span>
            </div>
            <div className="p-6">
              {[
                { label: '필수 자격', value: '소프트웨어 개발업 등록 · 정보처리 면허 필수' },
                { label: '주의사항', value: '실적 증명 서류 발주기관 원본 제출 필요' },
                { label: '유리한 점', value: '우리 회사 업종코드 완전 일치, 지역 우대 적용' },
                { label: '난이도',   value: '중 (경쟁사 3~5개 예상)' },
                { label: '한줄 요약', value: '참가 강력 추천 — 조건 완전 부합' },
              ].map(r => (
                <div key={r.label} className="flex gap-3 py-2.5" style={{ borderBottom: '1px solid #f1f3f5' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#473bf0', width: '72px', flexShrink: 0 }}>{r.label}</span>
                  <span style={{ fontSize: '12px', color: '#161c2d', opacity: 0.7 }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
          {/* 플로팅 알림 카드 (레퍼런스 user 2 이미지 역할) */}
          <div className="absolute -bottom-4 -left-6 rounded-xl px-4 py-3 shadow-lg hidden lg:flex items-center gap-3"
            style={{ background: 'white', border: '1px solid #e7e9ed', minWidth: '220px' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(104,213,133,0.15)' }}>
              <span style={{ fontSize: '18px' }}>💬</span>
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#161c2d' }}>카카오 알림톡 발송</p>
              <p style={{ fontSize: '10px', color: '#717182' }}>92점 공고 · 방금 전</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── CONTENT SECTION 2 (레퍼런스 "Content 02": How It Works) ─ */
// 레퍼런스: 센터 타이틀, 왼쪽 이미지, 오른쪽 번호 단계 목록
function ContentSection2() {
  const steps = [
    { num: '1', title: '회사 프로필 등록', desc: '업종코드, 보유 면허, 최근 실적, 직원 수를 입력합니다.' },
    { num: '2', title: '나라장터 공고 자동 수집', desc: '매일 오전 8시, 전국 발주기관 공고를 자동으로 가져옵니다.' },
    { num: '3', title: 'AI 분석 & 점수 산출', desc: 'Claude AI가 공고문을 분석하고 0~100점 추천 점수를 산출합니다.' },
    { num: '4', title: '카카오 알림톡 수신', desc: '70점 이상 공고는 즉시 카카오톡으로 전송됩니다.' },
  ]
  return (
    <section id="how" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* 센터 타이틀 */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#161c2d', letterSpacing: '-1.2px', lineHeight: '48px' }}>
            4단계로 시작하는 BidMaster
          </h2>
          <p style={{ fontSize: '19px', color: '#161c2d', opacity: 0.7, lineHeight: '32px', letterSpacing: '-0.2px', marginTop: '12px' }}>
            복잡한 설정 없이 5분이면 모든 준비가 끝납니다.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* 왼쪽 목업 (레퍼런스 calendar / card / event 이미지 역할) */}
          <div className="lg:w-1/2">
            <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background: 'white', border: '1px solid #e7e9ed' }}>
              {/* 차트 영역 */}
              <div className="p-5" style={{ background: '#f8fafc', borderBottom: '1px solid #e7e9ed' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#717182', marginBottom: '12px' }}>발주기관 분포</p>
                {[
                  { name: '중앙부처', pct: 38, color: '#473bf0' },
                  { name: '지방자치단체', pct: 29, color: '#68D585' },
                  { name: '공공기관', pct: 22, color: '#f59e0b' },
                  { name: '교육기관', pct: 11, color: '#ef4444' },
                ].map(b => (
                  <div key={b.name} className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span style={{ fontSize: '12px', color: '#161c2d', fontWeight: 600 }}>{b.name}</span>
                      <span style={{ fontSize: '12px', color: '#717182' }}>{b.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: '#e7e9ed' }}>
                      <div className="h-2 rounded-full" style={{ width: `${b.pct}%`, background: b.color }} />
                    </div>
                  </div>
                ))}
              </div>
              {/* 추천 공고 리스트 */}
              <div className="p-5">
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#717182', marginBottom: '12px' }}>이번 주 추천 공고</p>
                {[
                  { t: '행정안전부 정보화 시스템 구축', s: 92 },
                  { t: '국토교통부 스마트시티 플랫폼', s: 87 },
                  { t: '교육부 AI 학습관리시스템', s: 78 },
                ].map((item, i) => (
                  <div key={item.t} className="flex items-center gap-3 py-2.5"
                    style={{ borderBottom: i < 2 ? '1px solid #f1f3f5' : 'none' }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(71,59,240,0.1)', fontSize: '10px', fontWeight: 800, color: '#473bf0' }}>
                      {item.s}
                    </div>
                    <span style={{ fontSize: '12px', color: '#161c2d', flex: 1 }}>{item.t}</span>
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px',
                      background: 'rgba(104,213,133,0.15)', color: '#15803d' }}>가능</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽 번호 단계 (레퍼런스 Content Right 그대로) */}
          <div className="lg:w-1/2">
            {steps.map(s => (
              <div key={s.num} className="flex gap-5 mb-8">
                <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(71,59,240,0.1)' }}>
                  <span style={{ fontSize: '17px', fontWeight: 700, color: '#473bf0' }}>{s.num}</span>
                </div>
                <div>
                  <h4 style={{ fontSize: '21px', fontWeight: 800, color: '#161c2d', letterSpacing: '-0.5px', marginBottom: '6px' }}>{s.title}</h4>
                  <p style={{ fontSize: '17px', color: '#161c2d', opacity: 0.7, lineHeight: '29px', letterSpacing: '-0.2px' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── TESTIMONIALS (레퍼런스: bg #f4f7fa, 2칸, 세로선) ────── */
function Testimonials() {
  const testimonials = [
    {
      quote: '"입찰 업무가 절반으로 줄었습니다"',
      body: '하루 2시간씩 나라장터를 뒤지던 게 이제는 카카오톡 확인으로 끝납니다. BidMaster 덕분에 전략에 집중할 수 있게 됐어요.',
      name: '김민준',
      role: '(주)한국건설 구매팀장',
      initials: 'K',
    },
    {
      quote: '"놓치는 공고가 사라졌습니다"',
      body: '이전엔 좋은 공고를 마감 직전에야 발견하곤 했는데, 이제는 등록 당일 바로 알림을 받습니다. 낙찰률도 올랐어요.',
      name: '박서연',
      role: '코리아테크 대표이사',
      initials: 'P',
    },
  ]
  return (
    <section className="py-20 px-6" style={{ background: '#f4f7fa' }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x"
          style={{ border: '1px solid #e7e9ed', borderRadius: '12px', overflow: 'hidden', background: 'white' }}>
          {testimonials.map((t) => (
            <div key={t.name} className="p-10 text-center">
              {/* 아바타 */}
              <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #473bf0, #68D585)', fontSize: '24px', fontWeight: 800, color: 'white' }}>
                {t.initials}
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#161c2d', letterSpacing: '-0.5px', lineHeight: '34px', marginBottom: '14px' }}>
                {t.quote}
              </h3>
              <p style={{ fontSize: '19px', color: '#161c2d', opacity: 0.7, lineHeight: '32px', letterSpacing: '-0.2px', marginBottom: '20px' }}>
                {t.body}
              </p>
              <p style={{ fontSize: '17px', fontWeight: 800, color: '#161c2d', letterSpacing: '-0.2px', marginBottom: '4px' }}>{t.name}</p>
              <p style={{ fontSize: '15px', color: '#161c2d', opacity: 0.7, letterSpacing: '-0.1px' }}>{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── PRICING (레퍼런스: bg #161c2d, 흰 카드 3개) ────────────── */
function Pricing() {
  const plans = [
    {
      tag: 'Basic',
      price: '49,000',
      sub: '월 구독',
      desc: '일 50건 공고 분석, 기본 AI 리포트, 카카오 알림 일 3건. 소규모 입찰 담당자에게 딱 맞습니다.',
    },
    {
      tag: 'Pro',
      price: '129,000',
      sub: '월 구독',
      desc: '무제한 공고 분석, 심층 AI 리포트, 카카오 알림 무제한, 낙찰 확률 예측 포함. 가장 인기 있는 플랜.',
    },
    {
      tag: 'Enterprise',
      price: '문의',
      sub: '맞춤 견적',
      desc: '팀 계정, 전담 CS, API 연동 지원. 대규모 조달 팀을 위한 커스텀 플랜입니다.',
    },
  ]
  return (
    <section id="pricing" className="py-24 px-6" style={{ background: '#161c2d' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'white', letterSpacing: '-1.2px', lineHeight: '48px' }}>
            요금제 &amp; 플랜
          </h2>
          <p style={{ fontSize: '19px', color: 'white', opacity: 0.65, lineHeight: '32px', letterSpacing: '-0.2px', marginTop: '12px' }}>
            14일 무료 체험으로 시작하고, 필요할 때 업그레이드 하세요.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map(p => (
            <div key={p.tag} className="rounded-xl overflow-hidden"
              style={{ background: 'white', border: '1px solid #e7e9ed' }}>
              <div className="p-8">
                {/* 태그 - 레퍼런스 TagText 컴포넌트 스타일 그대로 */}
                <div className="inline-block mb-6">
                  <span style={{
                    background: 'rgba(71,59,240,0.1)',
                    color: '#473bf0',
                    fontSize: '13px',
                    fontWeight: 800,
                    letterSpacing: '1.625px',
                    padding: '4px 14px',
                    borderRadius: '14px',
                    textTransform: 'uppercase',
                  }}>{p.tag}</span>
                </div>
                {/* 가격 */}
                <div style={{ fontSize: '48px', fontWeight: 800, color: '#161c2d', letterSpacing: '-1.8px', lineHeight: '58px', marginBottom: '4px' }}>
                  {p.price === '문의' ? '문의' : `₩${p.price}`}
                </div>
                <p style={{ fontSize: '17px', color: '#161c2d', opacity: 0.7, letterSpacing: '-0.2px', marginBottom: '20px' }}>{p.sub}</p>
                <p style={{ fontSize: '17px', color: '#161c2d', opacity: 0.7, lineHeight: '29px', letterSpacing: '-0.2px', marginBottom: '32px' }}>{p.desc}</p>
                {/* CTA 버튼 - 레퍼런스 ButtonText1 스타일 */}
                <button className="w-full py-3.5 text-white font-bold rounded-lg transition-opacity hover:opacity-90"
                  style={{ background: '#473bf0', fontSize: '17px', letterSpacing: '-0.6px' }}>
                  {p.price === '문의' ? '문의하기' : '무료 체험 시작'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── FAQ (레퍼런스: #161c2d bg, 2×N 그리드, 초록 체크 원) ───── */
function FAQ() {
  const faqs = [
    {
      q: '나라장터 API 연동은 어떻게 되나요?',
      a: '별도 설정 없이 BidMaster가 자동으로 나라장터 조달청 API에 연결합니다. 회원가입 후 회사 프로필만 입력하면 다음 날 아침부터 바로 공고를 받을 수 있습니다.',
    },
    {
      q: '카카오 알림은 어떻게 설정하나요?',
      a: '대시보드 설정 메뉴에서 카카오톡 수신 번호와 알림 점수 임계값(기본 70점)을 입력하면 됩니다. 카카오 비즈니스 채널 수신 동의가 필요합니다.',
    },
    {
      q: '어떤 업종에서 사용할 수 있나요?',
      a: '나라장터에 등록된 모든 업종코드를 지원합니다. IT, 건설, 용역, 물품 등 공공조달에 참여하는 모든 중소기업이 사용할 수 있습니다.',
    },
    {
      q: '구독은 언제든지 해지할 수 있나요?',
      a: '언제든지 해지 가능합니다. 위약금이나 해지 수수료는 없으며, 남은 기간은 그대로 사용하실 수 있습니다. 해지 후 데이터는 30일간 보관됩니다.',
    },
  ]
  return (
    <section id="faq" className="py-20 px-6" style={{ background: '#161c2d' }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10">
          {faqs.map(f => (
            <div key={f.q} className="flex gap-4">
              {/* 초록 체크 원 - 레퍼런스 SmallRight 컴포넌트 */}
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                style={{ background: '#68D585' }}>
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h4 style={{ fontSize: '21px', fontWeight: 800, color: 'white', letterSpacing: '-0.5px', lineHeight: '32px', marginBottom: '10px' }}>{f.q}</h4>
                <p style={{ fontSize: '17px', color: 'white', opacity: 0.65, lineHeight: '29px', letterSpacing: '-0.2px', marginBottom: '14px' }}>{f.a}</p>
                {/* "Click to learn more" 링크 - 레퍼런스 그대로 */}
                <a href="/login" className="inline-flex items-center gap-1.5 font-bold hover:opacity-80 transition-opacity"
                  style={{ color: '#68D585', fontSize: '17px', letterSpacing: '-0.6px' }}>
                  자세히 알아보기
                  <ArrowRight color="#68D585" size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center mt-14" style={{ fontSize: '17px', color: 'white', opacity: 0.7, letterSpacing: '-0.2px' }}>
          원하는 답변을 찾지 못하셨나요?{' '}
          <a href="mailto:support@bidmaster.io" style={{ color: '#68D585', fontWeight: 700 }}>
            지금 문의하기
          </a>
        </p>
      </div>
    </section>
  )
}

/* ─── CTA BANNER (레퍼런스 "CTA": 왼쪽 텍스트, 오른쪽 버튼 2개) */
function CTABanner() {
  return (
    <section className="py-16 px-6" style={{ borderTop: '1px solid #e7e9ed' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-lg">
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#161c2d', letterSpacing: '-1.2px', lineHeight: '44px', marginBottom: '12px' }}>
            놓치는 입찰 공고 없이<br />이기는 입찰만 하세요
          </h2>
          <p style={{ fontSize: '19px', color: '#161c2d', opacity: 0.7, lineHeight: '32px', letterSpacing: '-0.2px' }}>
            지금 바로 14일 무료 체험을 시작하세요. 신용카드가 필요 없습니다.
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          {/* 레퍼런스 "Learn more" 버튼 (outline style) */}
          <a href="#features"
            className="inline-flex items-center gap-2 font-bold rounded-lg px-6 py-3.5 transition-colors hover:bg-gray-50"
            style={{ fontSize: '17px', letterSpacing: '-0.6px', color: '#473bf0', border: '1px solid rgba(71,59,240,0.25)' }}>
            기능 알아보기
            <ArrowRight color="#473bf0" />
          </a>
          {/* 레퍼런스 "Get it now" 버튼 (solid blue) */}
          <Link href="/login"
            className="inline-flex items-center gap-2 text-white font-bold rounded-lg px-6 py-3.5 transition-opacity hover:opacity-90"
            style={{ background: '#473bf0', fontSize: '17px', letterSpacing: '-0.6px' }}>
            지금 시작하기
            <ArrowRight color="white" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── FOOTER (레퍼런스: 로고+소셜+설명, 4칼럼 링크) ─────────── */
function Footer() {
  return (
    <footer className="px-6 py-16" style={{ borderTop: '1px solid #e7e9ed' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-5 gap-10">
          {/* 왼쪽 영역 (레퍼런스 "0" 영역) */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#473bf0' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" />
                </svg>
              </div>
              <span style={{ fontWeight: 800, fontSize: '18px', color: '#161c2d' }}>BidMaster</span>
            </div>
            <p style={{ fontSize: '15px', color: '#161c2d', opacity: 0.7, lineHeight: '26px', letterSpacing: '-0.1px', marginBottom: '20px' }}>
              나라장터 입찰 공고를 AI가 자동 분석하여 우리 회사에 맞는 공고만 카카오톡으로 알려주는 SaaS 서비스입니다.
            </p>
            {/* 소셜 아이콘 */}
            <div className="flex gap-3">
              {['T', 'F', 'I', 'L'].map(s => (
                <a key={s} href="#"
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
                  style={{ border: '1px solid #e7e9ed' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#161c2d', opacity: 0.5 }}>{s}</span>
                </a>
              ))}
            </div>
          </div>

          {/* 4개 링크 컬럼 (레퍼런스 1~4 영역) */}
          {[
            { title: '서비스', links: ['기능 소개', '요금제', '새소식', '도움말', '고객센터'] },
            { title: '회사', links: ['소개', '채용', '블로그', '문의'] },
            { title: '지원', links: ['나라장터 연동', 'API 문서', 'FAQ', '상태 페이지'] },
            { title: '법적 고지', links: ['개인정보처리방침', '이용약관', '환불 정책'] },
          ].map(col => (
            <div key={col.title}>
              <p style={{ fontSize: '15px', color: '#161c2d', opacity: 0.7, fontWeight: 700, letterSpacing: '-0.1px', marginBottom: '16px' }}>
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="hover:text-[#473bf0] transition-colors"
                      style={{ fontSize: '17px', color: '#161c2d', letterSpacing: '-0.2px' }}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr style={{ borderColor: '#e7e9ed', margin: '48px 0 24px' }} />
        <p style={{ fontSize: '14px', color: '#161c2d', opacity: 0.45, textAlign: 'center' }}>
          © 2026 BidMaster. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

/* ─── 공통 유틸 ─────────────────────────────────────────────── */
function ArrowRight({ color = '#161c2d', size = 12 }: { color?: string; size?: number }) {
  return (
    <svg width={size + 4} height={size} viewBox="0 0 16 12" fill="none">
      <path d="M1 6h14M9 1l6 5-6 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// 레퍼런스 Features 아이콘 (초록 #68D585)
function IconCode() {
  return (
    <svg width="44" height="37" viewBox="0 0 44 37" fill="none">
      <path clipRule="evenodd" fillRule="evenodd" fill="#68D585"
        d="M16 0L0 18.5L16 37l3.2-2.9L3.6 18.5 19.2 2.9 16 0zm12 0l-3.2 2.9 15.6 15.6-15.6 15.6 3.2 2.9L44 18.5 28 0z" />
      <rect fill="#D5D7DD" x="16" y="17" width="12" height="3" rx="1.5" />
    </svg>
  )
}

function IconAI() {
  return (
    <svg width="37" height="37" viewBox="0 0 37 37" fill="none">
      <path fill="#D5D7DD" d="M18.5 0A18.5 18.5 0 0 0 0 18.5h3A15.5 15.5 0 0 1 18.5 3V0z" />
      <path fill="#D5D7DD" d="M18.5 37A18.5 18.5 0 0 0 37 18.5h-3A15.5 15.5 0 0 1 18.5 34V37z" />
      <path fill="#68D585" d="M37 18.5A18.5 18.5 0 0 1 18.5 37v-3A15.5 15.5 0 0 0 34 18.5h3z" />
      <path fill="#68D585" d="M0 18.5A18.5 18.5 0 0 0 18.5 37v-3A15.5 15.5 0 0 1 3 18.5H0z" />
      <circle cx="18.5" cy="18.5" r="6" fill="#68D585" />
      <circle cx="18.5" cy="18.5" r="3" fill="white" />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg width="26" height="38" viewBox="0 0 26 38" fill="none">
      <path clipRule="evenodd" fillRule="evenodd" fill="#68D585"
        d="M4 0C1.8 0 0 1.8 0 4v30c0 2.2 1.8 4 4 4h18c2.2 0 4-1.8 4-4V4c0-2.2-1.8-4-4-4H4zm0 2h18c1.1 0 2 .9 2 2v30c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm7 31a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM9 4h8v2H9V4z" />
    </svg>
  )
}
