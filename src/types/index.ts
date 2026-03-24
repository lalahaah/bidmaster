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

// ─── 사용자 문서 ─────────────────────────────────────────────
export interface UserDocument {
  uid: string
  email: string
  displayName: string
  photoURL: string | null
  profile: CompanyProfile
  settings: NotificationSettings
  subscription: Subscription
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ─── AI 분석 요약 ────────────────────────────────────────────
export interface AISummary {
  qualifications: string   // 필수 자격 조건 (3줄 이내)
  cautions: string         // 주의사항
  difficulty: Difficulty
  advantages: string       // 우리 회사에 유리한 포인트
  oneLiner: string         // 한줄 요약 (20자 이내)
  score: number            // 추천 점수 0~100
}

// ─── 입찰 공고 ───────────────────────────────────────────────
export interface BidNotice {
  id: string               // 공고번호 (doc ID)
  title: string
  orgName: string          // 발주기관
  bizCode: string          // 업종코드
  estimatedAmount: number  // 추정금액 (만원)
  deadline: Timestamp
  requirements: string     // 자격조건 원문
  noticeUrl: string        // 나라장터 원문 링크
  matchStatus: MatchStatus
  aiSummary: AISummary | null
  createdAt: Timestamp
  analyzedAt: Timestamp | null
}

// ─── 나라장터 API 응답 ───────────────────────────────────────
export interface G2BNoticeItem {
  bidNtceNo: string          // 공고번호
  bidNtceNm: string          // 공고명
  ntceInsttNm: string        // 공고기관명
  dminsttNm: string          // 수요기관명
  bidNtceDt: string          // 공고일시
  opengDt: string            // 개찰일시
  bidClseDt: string          // 입찰마감일시
  presmptPrce: string        // 추정가격
  bidMthdNm: string          // 입찰방법명
  ntceKindNm: string         // 공고종류명
  linkUrl: string            // 링크URL
}

// ─── 필터 옵션 ───────────────────────────────────────────────
export interface BidFilterOptions {
  matchStatus?: MatchStatus
  minScore?: number
  maxAmount?: number
  region?: string
  searchQuery?: string
}

// ─── KPI 카드 ─────────────────────────────────────────────────
export interface KpiCard {
  label: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: string
}
