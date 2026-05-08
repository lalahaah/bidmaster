# BidMaster — Gemini CLI 개발 컨텍스트

## 서비스 개요
나라장터 입찰 공고를 AI가 자동 분석해서
우리 회사에 맞는 공고만 카카오톡 알림톡으로 알려주는 SaaS

## 기술 스택
- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Auth: Firebase Authentication (Google 로그인)
- DB: Firebase Firestore
- AI: Claude API (@anthropic-ai/sdk ^0.80.0)
- 배포: Vercel
- 결제: 토스페이먼츠 (미구현)
- 알림: 알리고 카카오 알림톡 (구현 완료, LMS 우선 적용)

## 브랜드 컬러
- Primary: #006B7A (dark teal)
- Accent: #68D585 (green)
- Dark bg: #161c2d
- Light bg: #fcfdfe
- Text muted: #717182

## 현재 파일 구조
src/
├── app/
│   ├── api/
│   │   ├── match/route.ts          # Claude AI 분석 + 매칭 + 알림 발송
│   │   ├── notices/fetch/route.ts  # 나라장터 공고 수집 (Cron)
│   │   ├── notices/personalized/route.ts  # 맞춤 공고 조회
│   │   └── notices/route.ts        # 공고 목록
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # 대시보드 메인
│   │   ├── profile/page.tsx        # 회사 프로필 (완성도 게이지 포함)
│   │   └── settings/page.tsx       # 알림 설정
│   ├── demo/page.tsx
│   ├── login/page.tsx
│   ├── page.tsx                    # 랜딩페이지 (완성)
│   ├── layout.tsx
│   └── globals.css
├── contexts/AuthContext.tsx
├── lib/
│   ├── ai-analysis.ts              # Claude API 호출 + 가중치 로직
│   ├── firebase-admin.ts
│   ├── firebase.ts
│   ├── firestore.ts                # Firestore CRUD
│   ├── g2b.ts                      # 나라장터 API
│   ├── kakao.ts                    # 알리고 API 연동
│   └── matching.ts                 # 자격 매칭 로직
└── types/index.ts

## Firestore 컬렉션 구조
users/{uid}/
  profile:
    bizCodes: string[]
    licenses: string[]
    revenue: number
    headcount: number
    region: string
    amountMin: number
    amountMax: number
    keywords: string[]

  settings:
    kakaoPhone: string
    scoreThreshold: number
    notifyEnabled: boolean

  subscription:
    plan: 'free' | 'pro' | 'enterprise'
    trialEndsAt: timestamp
    paidUntil: timestamp

bid_notices/{bidNtceNo}:
  title, orgName, bizCode
  estimatedAmount: number
  deadline: timestamp
  requirements: string
  noticeUrl: string
  matchStatus: '가능' | '불가' | '조건부' | '미분석'
  aiSummary:
    qualifications, cautions
    difficulty: '상'|'중'|'하'
    advantages, oneLiner
    score: number
  createdAt, analyzedAt: timestamp

## 완성된 주요 기능
- **카카오 알림톡 (알리고 API)**: score >= 70 및 알림 설정 시 자동 발송 (LMS)
- **자동 공고 수집 (Vercel Cron)**: 매일 08:00 KST (23:00 UTC) 실행
- **프로필 상세화**: 참여 희망 금액 범위, 실적 키워드, 프로필 완성도 게이지
- **AI 매칭 고도화**: 금액 범위 및 키워드 기반 가중치 점수 산출 적용

## 미완성 기능 (우선순위 순)

### P2 — 구독 결제 (토스페이먼츠)
- 플랜: free / pro(₩29,000) / enterprise(₩99,000)
- 위치: src/app/api/payment/ (신규)
- Free: 기본 검색, 스크랩 10개
- Pro: AI 분석 무제한, 카카오 알림 무제한
- Enterprise: 팀 계정 5명, 경쟁사 분석

### P2 — 플랜별 기능 제한
- Firestore users/{uid}/subscription.plan 기준 분기
- AI 분석 월 한도 (Free: 0, Pro: 무제한)
- 현재 대시보드에 remaining/isTestAccount 로직 일부 있음 → 정식 구독으로 교체

## 작업 시 주의사항
1. Firebase Admin SDK는 서버(API Route)에서만 사용
   (firebase-admin.ts → api/ 폴더에서만 import)
2. Firebase Client SDK는 클라이언트에서만 사용
   (firebase.ts → contexts/, components/ 에서 import)
3. Claude API 키는 서버사이드에서만 호출
   (ANTHROPIC_API_KEY → api/match/route.ts 에서만 사용)
4. 브랜드 컬러 #006B7A 유지 — Tailwind 커스텀 컬러 미설정,
   인라인 style로 직접 적용 중
5. 다크 테마는 대시보드만 (#130c2e, #161c2d 계열)
   랜딩페이지는 라이트 테마 (#fcfdfe)

## 환경변수 목록
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
FIREBASE_PROJECT_ID          # Admin SDK용
FIREBASE_CLIENT_EMAIL        # Admin SDK용
FIREBASE_PRIVATE_KEY         # Admin SDK용
ANTHROPIC_API_KEY
ALIGO_API_KEY
ALIGO_USER_ID
ALIGO_SENDER
G2B_API_KEY                  # 나라장터 공공데이터포털 키
CRON_SECRET                  # Vercel Cron 인증용
TOSS_CLIENT_KEY              # 미입력
TOSS_SECRET_KEY              # 미입력
