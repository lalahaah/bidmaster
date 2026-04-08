import { Timestamp } from 'firebase/firestore'

// ─── 구독 플랜 ────────────────────────────────────────────────
export type Plan = 'free' | 'pro' | 'enterprise'

// ─── 매칭 상태 ────────────────────────────────────────────────
export type MatchStatus = '가능' | '불가' | '조건부' | '미분석'

// ─── 난이도 ───────────────────────────────────────────────────
export type Difficulty = '상' | '중' | '하'

// ─── 회사 프로필 ─────────────────────────────────────────────
export interface CompanyProfile {
  bizCodes: string[]   // 업종코드 배열
  licenses: string[]   // 보유 면허
  revenue: number      // 최근 3년 평균 실적 (만원)
  headcount: number    // 직원 수
  region: string       // 주사업 지역
  amountMin?: number   // [신규 추가] 참여 희망 최소금액 (만원)
  amountMax?: number   // [신규 추가] 참여 희망 최대금액 (만원)
  keywords?: string[]  // [신규 추가] 실적 키워드
}

// ─── 알림 설정 ────────────────────────────────────────────────
export interface NotificationSettings {
  kakaoPhone: string
  scoreThreshold: number   // 기본 70
  notifyEnabled: boolean
}

// ─── 구독 정보 ────────────────────────────────────────────────
export interface Subscription {
  plan: Plan
  trialEndsAt: Timestamp | null
  paidUntil: Timestamp | null
}

// ─── AI 사용량 ────────────────────────────────────────────────
export interface AiUsage {
  count: number        // 이번 달 분석 건수
  resetAt: Timestamp   // 다음 리셋 일시 (매월 1일)
}

// ─── 사용자 문서 ─────────────────────────────────────────────
export interface UserDocument {
  uid: string
  email: string
  displayName: string
  photoURL: string | null
  profile: CompanyProfile
  settings: NotificationSettings
  subscription: Subscription
  aiUsage: AiUsage
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ─── AI 분석 요약 ────────────────────────────────────────────
export interface AISummary {
  qualifications: string
  cautions: string
  difficulty: Difficulty
  advantages: string
  oneLiner: string
  score: number
}

// ─── 유저별 분석 결과 (users/{uid}/analyses/{noticeId}) ──────
export interface UserAnalysis {
  noticeId: string
  aiSummary: AISummary
  matchStatus: MatchStatus
  score: number
  analyzedAt: Timestamp
}

// ─── 입찰 공고 (전역 원본 데이터) ────────────────────────────
export interface BidNotice {
  id: string
  title: string
  orgName: string
  bizCode: string
  estimatedAmount: number
  deadline: Timestamp
  requirements: string
  noticeUrl: string
  rawData: G2BNoticeItem
  createdAt: Timestamp
}

// ─── 공고 + 유저 분석 병합 (대시보드 표시용) ─────────────────
export interface EnrichedNotice extends BidNotice {
  matchStatus: MatchStatus
  aiSummary: AISummary | null
}

// ─── 나라장터 API 응답 ───────────────────────────────────────
export interface G2BNoticeItem {
  bidNtceNo: string
  bidNtceOrd: string
  bidNtceNm: string
  ntceInsttNm: string
  dminsttNm: string
  bidNtceDt: string
  opengDt: string
  bidClseDt: string
  presmptPrce: string
  bidMethdNm: string
  ntceKindNm: string
  bidNtceDtlUrl: string
  bsnsDivNm: string
  indstrytyLmtYn: string
}

// ─── 필터 옵션 ───────────────────────────────────────────────
export interface BidFilterOptions {
  matchStatus?: MatchStatus
  minScore?: number
  searchQuery?: string
}
