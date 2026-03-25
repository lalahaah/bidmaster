'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="bg-[#111318] text-[#e2e2e8] font-body">
      <Nav />
      <Hero />
      <Trust />
      <Features />
      <Process />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  )
}

function Nav() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-[#1a1c20]">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-black text-[#adc7ff] tracking-tighter font-headline">BidMaster</span>
          <div className="hidden md:flex gap-6 font-headline tracking-tight font-bold">
            <a className="text-[#c6c5d4] hover:text-white transition-colors text-sm" href="#features">기능</a>
            <a className="text-[#c6c5d4] hover:text-white transition-colors text-sm" href="#process">이용방법</a>
            <a className="text-[#c6c5d4] hover:text-white transition-colors text-sm" href="#pricing">요금제</a>
            <a className="text-[#c6c5d4] hover:text-white transition-colors text-sm" href="#faq">FAQ</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-[#c6c5d4] hover:text-white transition-colors font-bold tracking-tight text-sm">로그인</Link>
          <Link href="/login" className="bg-[#adc7ff] text-[#002e68] px-5 py-2 rounded-xl font-bold tracking-tight text-sm hover:bg-[#282a2e] hover:text-[#adc7ff] transition-all duration-200">무료 체험</Link>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative pt-24 pb-32 px-8 overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[80%] rounded-full bg-[#adc7ff]/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] rounded-full bg-[#e4c27c]/5 blur-[120px]" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#282a2e] border border-[#454652]/15 text-xs font-semibold text-[#e4c27c]">
            <span>⚡</span>나라장터 조달청 API 직접 연동
          </div>
          <h1 className="font-headline font-extrabold text-6xl md:text-8xl editorial-title text-[#e2e2e8]">
            이기는 입찰,<br /><span className="gradient-text">AI 인텔리전스</span><br />로 시작합니다.
          </h1>
          <p className="text-[#c6c5d4] text-lg max-w-xl font-body leading-relaxed">
            수백 건의 나라장터 공고를 AI가 자동 분석하여 우리 회사 조건에 꼭 맞는 공고만 카카오톡으로 즉시 알려드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/login" className="bg-[#adc7ff] text-[#002e68] px-8 py-4 rounded-xl font-headline font-bold text-lg hover:shadow-[0_0_20px_rgba(173,199,255,0.3)] transition-all text-center">무료 체험 시작</Link>
            <a href="#process" className="border border-[#454652]/30 text-[#e2e2e8] px-8 py-4 rounded-xl font-headline font-bold text-lg hover:bg-[#1a1c20] transition-all text-center">이용 방법 보기</a>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="glass p-6 rounded-2xl border border-[#454652]/20 ambient-shadow">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-bold text-[#908f9d] font-headline tracking-widest uppercase">실시간 AI 분석</span>
              <span className="flex items-center gap-1.5 text-xs text-[#e4c27c] font-bold px-2 py-0.5 rounded-full bg-[#3f2d00]/50">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e4c27c] animate-pulse inline-block" />AI 엔진 활성
              </span>
            </div>
            <div className="space-y-4">
              <div className="bg-[#1a1c20] p-4 rounded-xl flex justify-between items-center">
                <div><p className="text-[10px] text-[#908f9d] font-bold uppercase mb-1">공고번호</p><p className="font-headline font-bold text-[#e2e2e8]">KR-PPS-2024-8821</p></div>
                <div className="text-right"><p className="text-[10px] text-[#908f9d] font-bold uppercase mb-1">낙찰 확률</p><p className="font-headline font-bold text-[#e4c27c] text-xl">84.2%</p></div>
              </div>
              <div className="bg-[#1a1c20] p-4 rounded-xl">
                <p className="text-[10px] text-[#908f9d] font-bold uppercase mb-3">경쟁사 분포</p>
                <div className="flex items-end gap-1 h-12">
                  {[40, 80, 30, 60, 45].map((h, i) => (
                    <div key={i} className={`w-full rounded-t-sm ${i === 1 ? 'bg-[#adc7ff]' : 'bg-[#002e67]'}`} style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
              <div className="bg-[#adc7ff]/10 border border-[#adc7ff]/20 p-4 rounded-xl flex items-center gap-4">
                <div className="bg-[#adc7ff] text-[#002e68] p-2 rounded-lg shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" /></svg>
                </div>
                <div><p className="text-xs font-bold text-[#e2e2e8]">전략 추천</p><p className="text-[11px] text-[#c6c5d4]">가격을 -1.2% 조정하면 과거 낙찰 패턴과 일치합니다.</p></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[{ label: '수집 공고', value: '247건' }, { label: 'AI 추천', value: '18건' }, { label: '평균 점수', value: '76점' }].map(k => (
                  <div key={k.label} className="bg-[#1a1c20] rounded-xl p-3 text-center">
                    <p className="font-headline font-bold text-[#e2e2e8] text-lg">{k.value}</p>
                    <p className="text-[10px] text-[#908f9d] font-bold mt-0.5">{k.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Trust() {
  return (
    <section className="py-12 bg-[#0c0e12] border-y border-[#454652]/10">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <span className="text-[#908f9d] font-headline font-bold text-sm tracking-widest uppercase opacity-60 shrink-0">국내 기업이 신뢰합니다</span>
        <div className="flex flex-wrap justify-center gap-12 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {['HYUNDAI', 'SAMSUNG', 'NAVER', 'KAKAO', 'SK GROUP'].map(name => (
            <div key={name} className="font-headline font-black text-xl tracking-tighter text-[#e2e2e8]">{name}</div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="features" className="py-32 px-8 max-w-7xl mx-auto">
      <div className="mb-20 text-center space-y-4">
        <h2 className="font-headline font-extrabold text-5xl text-[#e2e2e8]">인텔리전스 계층 구조</h2>
        <p className="text-[#c6c5d4] max-w-2xl mx-auto font-body">나라장터의 수백만 건 데이터를 처리하여 결정적인 입찰 우위를 제공합니다.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:grid-rows-2 md:h-[800px]">
        <div className="md:col-span-2 md:row-span-1 bg-[#1a1c20] rounded-2xl p-8 relative overflow-hidden group">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="max-w-sm">
              <div className="text-[#adc7ff] text-4xl mb-4">⚖️</div>
              <h3 className="font-headline font-bold text-2xl text-[#e2e2e8] mb-3">공고 인텔리전스</h3>
              <p className="text-[#c6c5d4] text-sm leading-relaxed">나라장터 API를 통해 매일 오전 8시, 전국 발주기관의 수백 건 공고를 자동 수집합니다. 업종 코드 기반 시맨틱 필터링으로 놓치는 공고 없이, 실시간으로.</p>
            </div>
            <div className="mt-8 flex gap-4">
              <div className="bg-[#1e2024] p-3 rounded-xl border border-[#454652]/15 flex-1"><span className="text-[10px] font-bold text-[#908f9d] block mb-1 uppercase">평균 입찰 금액</span><span className="text-xl font-bold font-headline text-[#e2e2e8]">₩14.2B</span></div>
              <div className="bg-[#1e2024] p-3 rounded-xl border border-[#454652]/15 flex-1"><span className="text-[10px] font-bold text-[#908f9d] block mb-1 uppercase">시장 성장률</span><span className="text-xl font-bold font-headline text-[#e4c27c]">+12.4%</span></div>
            </div>
          </div>
          <div className="absolute right-8 bottom-8 flex items-end gap-1 h-24 opacity-15 group-hover:opacity-30 transition-opacity">
            {[40, 65, 35, 80, 55, 90, 45, 70].map((h, i) => (<div key={i} className="w-4 bg-[#adc7ff] rounded-t-sm" style={{ height: `${h}%` }} />))}
          </div>
        </div>
        <div className="md:col-span-1 md:row-span-2 bg-[#1a1c20] rounded-2xl p-8 border border-[#adc7ff]/10 flex flex-col">
          <div className="mb-12">
            <div className="text-[#e4c27c] text-4xl mb-4">🎯</div>
            <h3 className="font-headline font-bold text-2xl text-[#e2e2e8] mb-3">AI 낙찰 확률</h3>
            <p className="text-[#c6c5d4] text-sm leading-relaxed">5년치 낙찰 이력 데이터로 정밀 예측 모델을 구성합니다. 정확한 낙찰 가능성을 수치로 제공합니다.</p>
          </div>
          <div className="flex-grow flex items-center justify-center">
            <div className="relative w-44 h-44 rounded-full border-[12px] border-[#1e2024] flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[12px] border-[#adc7ff] border-r-transparent border-b-transparent -rotate-45" />
              <div className="text-center"><span className="text-4xl font-headline font-black text-[#e2e2e8]">92%</span><span className="text-[10px] block font-bold text-[#adc7ff] tracking-widest mt-1">신뢰도</span></div>
            </div>
          </div>
          <div className="mt-8 space-y-2">
            <div className="h-1.5 w-full bg-[#1e2024] rounded-full overflow-hidden"><div className="h-full bg-[#adc7ff] rounded-full" style={{ width: '92%' }} /></div>
            <p className="text-[10px] text-center text-[#908f9d] font-bold tracking-widest uppercase">낙찰 최적화 완료</p>
          </div>
        </div>
        <div className="md:col-span-1 md:row-span-1 bg-[#1a1c20] rounded-2xl p-8 border border-[#454652]/5">
          <div className="text-[#c6c5d4] text-4xl mb-4">📊</div>
          <h3 className="font-headline font-bold text-xl text-[#e2e2e8] mb-2">발주기관 분석</h3>
          <p className="text-[#c6c5d4] text-xs leading-relaxed">담당자 행동 패턴, 부서별 예산 집행 성향, 발주 시즌을 심층 분석합니다.</p>
        </div>
        <div className="md:col-span-1 md:row-span-1 bg-[#282a2e] rounded-2xl p-8 flex flex-col justify-between">
          <div>
            <div className="text-[#e4c27c] text-4xl mb-4">💬</div>
            <h3 className="font-headline font-bold text-xl text-[#e2e2e8] mb-1">카카오 알림톡</h3>
            <p className="text-[#c6c5d4] text-xs leading-relaxed">70점 이상 공고를 마감 전에 카카오톡으로 즉시 발송합니다.</p>
          </div>
          <div className="flex gap-2 mt-4">
            <span className="px-2 py-1 bg-[#333539] rounded-lg text-[10px] font-bold text-[#c6c5d4]">실시간 발송</span>
            <span className="px-2 py-1 bg-[#333539] rounded-lg text-[10px] font-bold text-[#c6c5d4]">모바일 최적화</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Process() {
  const steps = [
    { num: '01', title: '회사 프로필 등록', desc: '업종코드, 보유 면허, 최근 실적, 직원 수를 입력합니다. 5분이면 완료됩니다.' },
    { num: '02', title: '공고 자동 수집', desc: '매일 오전 8시, 나라장터 전국 발주기관 공고를 자동으로 가져옵니다.' },
    { num: '03', title: 'AI 분석 & 점수 산출', desc: 'Claude AI가 공고문 전체를 분석하고 0~100점 추천 점수를 산출합니다.' },
    { num: '04', title: '카카오 알림톡 수신', desc: '70점 이상 공고는 즉시 카카오톡으로 전송됩니다. 모바일에서 바로 확인하세요.' },
  ]
  return (
    <section id="process" className="py-32 px-8 bg-[#0c0e12]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center space-y-4">
          <h2 className="font-headline font-extrabold text-5xl text-[#e2e2e8]">4단계로 시작하는 BidMaster</h2>
          <p className="text-[#c6c5d4] max-w-xl mx-auto font-body">복잡한 설정 없이 5분이면 모든 준비가 끝납니다.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {steps.map(s => (
            <div key={s.num} className="bg-[#1a1c20] rounded-2xl p-8 flex gap-6 items-start">
              <div className="shrink-0 w-14 h-14 rounded-xl bg-[#adc7ff]/10 border border-[#adc7ff]/15 flex items-center justify-center">
                <span className="font-headline font-black text-xl text-[#adc7ff]">{s.num}</span>
              </div>
              <div><h3 className="font-headline font-bold text-xl text-[#e2e2e8] mb-2">{s.title}</h3><p className="text-[#c6c5d4] text-sm leading-relaxed">{s.desc}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-12 bg-[#1a1c20] rounded-2xl p-8 border border-[#adc7ff]/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline font-bold text-lg text-[#e2e2e8]">AI 분석 리포트 예시</h3>
            <span className="text-xs text-[#adc7ff] font-bold bg-[#adc7ff]/10 px-3 py-1 rounded-full">92점</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: '필수 자격', value: '소프트웨어 개발업 등록 · 정보처리 면허 필수' },
              { label: '주의사항', value: '실적 증명 서류 발주기관 원본 제출 필요' },
              { label: '유리한 점', value: '업종코드 완전 일치, 지역 우대 적용 가능' },
              { label: '한줄 요약', value: '참가 강력 추천 — 조건 완전 부합' },
            ].map(r => (
              <div key={r.label} className="bg-[#1e2024] rounded-xl p-4 flex gap-3">
                <span className="text-xs font-bold text-[#adc7ff] w-16 shrink-0 pt-0.5">{r.label}</span>
                <span className="text-xs text-[#c6c5d4] leading-relaxed">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const testimonials = [
    { quote: '"입찰 업무가 절반으로 줄었습니다"', body: '하루 2시간씩 나라장터를 뒤지던 게 이제는 카카오톡 확인으로 끝납니다. BidMaster 덕분에 전략에 집중할 수 있게 됐어요.', name: '김민준', role: '(주)한국건설 구매팀장', initials: 'K' },
    { quote: '"놓치는 공고가 완전히 사라졌습니다"', body: '이전엔 좋은 공고를 마감 직전에야 발견하곤 했는데, 이제는 등록 당일 바로 알림을 받습니다. 낙찰률도 올랐어요.', name: '박서연', role: '코리아테크 대표이사', initials: 'P' },
  ]
  return (
    <section className="py-24 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center"><h2 className="font-headline font-extrabold text-4xl text-[#e2e2e8]">실제 고객의 이야기</h2></div>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="bg-[#1a1c20] rounded-2xl p-10">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 text-[#002e68] font-black text-xl" style={{ background: 'linear-gradient(135deg, #adc7ff, #e4c27c)' }}>{t.initials}</div>
              <h3 className="font-headline font-bold text-2xl text-[#e2e2e8] mb-4 leading-tight">{t.quote}</h3>
              <p className="text-[#c6c5d4] leading-relaxed mb-6 text-sm">{t.body}</p>
              <div><p className="font-bold text-[#e2e2e8] text-sm">{t.name}</p><p className="text-[#908f9d] text-xs mt-0.5">{t.role}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const plans = [
    { tag: 'Basic', price: '49,000', sub: '월 구독', desc: '일 50건 공고 분석, 기본 AI 리포트, 카카오 알림 일 3건. 소규모 입찰 담당자에게 딱 맞습니다.', featured: false },
    { tag: 'Pro', price: '129,000', sub: '월 구독', desc: '무제한 공고 분석, 심층 AI 리포트, 카카오 알림 무제한, 낙찰 확률 예측 포함. 가장 인기 있는 플랜.', featured: true },
    { tag: 'Enterprise', price: '문의', sub: '맞춤 견적', desc: '팀 계정, 전담 CS, API 연동 지원. 대규모 조달 팀을 위한 커스텀 플랜입니다.', featured: false },
  ]
  return (
    <section id="pricing" className="py-24 px-8 bg-[#0c0e12]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-headline font-extrabold text-5xl text-[#e2e2e8]">요금제 & 플랜</h2>
          <p className="text-[#c6c5d4] max-w-xl mx-auto font-body">14일 무료 체험으로 시작하고, 필요할 때 업그레이드 하세요. 신용카드 불필요.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map(p => (
            <div key={p.tag} className={`rounded-2xl p-8 flex flex-col ${p.featured ? 'bg-[#adc7ff]/10 border border-[#adc7ff]/25' : 'bg-[#1a1c20] border border-[#454652]/10'}`}>
              <div className="inline-block mb-6"><span className={`text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full ${p.featured ? 'bg-[#adc7ff]/15 text-[#adc7ff]' : 'bg-[#282a2e] text-[#908f9d]'}`}>{p.tag}</span></div>
              <div className="mb-1"><span className="font-headline font-black text-5xl text-[#e2e2e8] tracking-tight">{p.price === '문의' ? '문의' : `₩${p.price}`}</span></div>
              <p className="text-[#908f9d] text-sm mb-6">{p.sub}</p>
              <p className="text-[#c6c5d4] text-sm leading-relaxed mb-8 flex-1">{p.desc}</p>
              <Link href="/login" className={`w-full py-3.5 rounded-xl font-headline font-bold text-sm transition-all text-center ${p.featured ? 'bg-[#adc7ff] text-[#002e68] hover:shadow-[0_0_20px_rgba(173,199,255,0.3)]' : 'bg-[#282a2e] text-[#e2e2e8] hover:bg-[#333539]'}`}>
                {p.price === '문의' ? '문의하기' : '무료 체험 시작'}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const faqs = [
    { q: '나라장터 API 연동은 어떻게 되나요?', a: '별도 설정 없이 BidMaster가 자동으로 조달청 API에 연결합니다. 회사 프로필만 입력하면 다음 날 아침부터 공고를 받을 수 있습니다.' },
    { q: '카카오 알림은 어떻게 설정하나요?', a: '대시보드 설정에서 카카오톡 수신 번호와 알림 점수 임계값(기본 70점)을 입력하면 됩니다.' },
    { q: '어떤 업종에서 사용할 수 있나요?', a: '나라장터에 등록된 모든 업종코드를 지원합니다. IT, 건설, 용역, 물품 등 공공조달에 참여하는 모든 중소기업이 사용 가능합니다.' },
    { q: '구독은 언제든지 해지할 수 있나요?', a: '언제든지 위약금 없이 해지 가능합니다. 남은 기간은 그대로 사용하시고, 데이터는 30일간 보관됩니다.' },
    { q: 'AI 분석 정확도는 어느 정도인가요?', a: '5년치 나라장터 낙찰 데이터로 훈련된 모델의 자격 매칭 정확도는 95% 이상입니다.' },
    { q: '팀원과 함께 사용할 수 있나요?', a: 'Enterprise 플랜에서 팀 계정을 지원합니다. 여러 담당자가 함께 공고를 관리하고 알림을 설정할 수 있습니다.' },
  ]
  return (
    <section id="faq" className="py-24 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center space-y-4">
          <h2 className="font-headline font-extrabold text-5xl text-[#e2e2e8]">자주 묻는 질문</h2>
          <p className="text-[#c6c5d4] font-body">원하는 답변을 찾지 못하셨나요?{' '}<a href="mailto:support@bidmaster.io" className="text-[#adc7ff] font-bold hover:opacity-80 transition-opacity">문의하기</a></p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map(f => (
            <div key={f.q} className="bg-[#1a1c20] rounded-2xl p-7 flex gap-4">
              <div className="w-6 h-6 rounded-full bg-[#e4c27c]/20 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="10" height="8" viewBox="0 0 12 10" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="#e4c27c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div><h4 className="font-headline font-bold text-[#e2e2e8] mb-3 leading-snug">{f.q}</h4><p className="text-[#c6c5d4] text-sm leading-relaxed">{f.a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-24 px-8">
      <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-[#002e67] to-[#1a1c20] p-12 md:p-20 text-center relative overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[80%] rounded-full bg-[#adc7ff]/5 blur-[80px] pointer-events-none" />
        <div className="relative z-10 space-y-8">
          <h2 className="font-headline font-extrabold text-4xl md:text-6xl editorial-title text-[#e2e2e8]">놓치는 입찰 없이<br />이기는 입찰만 하세요</h2>
          <p className="text-[#5a96ff] text-lg max-w-xl mx-auto font-body">450개 이상의 기업이 BidMaster로 공공조달 매출을 늘리고 있습니다.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/login" className="bg-[#adc7ff] text-[#002e68] px-10 py-4 rounded-xl font-headline font-bold text-lg hover:scale-105 transition-transform text-center">무료로 시작하기</Link>
            <a href="#process" className="bg-white/5 backdrop-blur-sm text-white px-10 py-4 rounded-xl font-headline font-bold text-lg border border-white/10 hover:bg-white/10 transition-all text-center">이용 방법 보기</a>
          </div>
          <p className="text-[#908f9d] text-sm">신용카드 불필요 · 14일 무료 체험</p>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-[#111318] border-t border-[#454652]/15">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <span className="text-xl font-black text-[#adc7ff] tracking-tighter font-headline block mb-3">BidMaster</span>
            <p className="text-xs text-[#c6c5d4] leading-relaxed mb-6 max-w-xs">나라장터 입찰 공고를 AI가 자동 분석하여 우리 회사에 맞는 공고만 카카오톡으로 알려주는 B2B SaaS입니다.</p>
            <div className="flex gap-2">
              {['T', 'F', 'I', 'L'].map(s => (
                <a key={s} href="#" className="w-8 h-8 rounded-full flex items-center justify-center border border-[#454652]/30 hover:border-[#adc7ff]/40 transition-colors">
                  <span className="text-xs font-bold text-[#908f9d]">{s}</span>
                </a>
              ))}
            </div>
          </div>
          {[
            { title: '서비스', links: ['기능 소개', '요금제', '새소식', '고객센터'] },
            { title: '회사', links: ['소개', '채용', '블로그', '문의'] },
            { title: '법적 고지', links: ['개인정보처리방침', '이용약관', '환불 정책'] },
          ].map(col => (
            <div key={col.title}>
              <p className="text-xs font-bold text-[#908f9d] uppercase tracking-widest mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map(l => (<li key={l}><a href="#" className="text-sm text-[#c6c5d4] hover:text-[#adc7ff] transition-colors">{l}</a></li>))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-[#454652]/15">
          <p className="text-center text-xs text-[#908f9d]">© 2026 BidMaster Intelligence. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
