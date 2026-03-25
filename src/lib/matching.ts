/**
 * 자격 매칭 로직
 * 회사 프로필 vs 입찰 공고 조건을 비교하여 matchStatus와 matchScore를 산출합니다.
 */

import type { CompanyProfile, MatchStatus } from '@/types'
import type { G2BNoticeItem } from './g2b'
import { parseAmountToManwon } from './g2b'

// ─── 매칭 결과 타입 ──────────────────────────────────────────

export interface MatchResult {
  status: MatchStatus
  score: number       // 0~100 (AI 분석 전 기본 점수)
  reasons: string[]   // 매칭/불가 사유 목록
  warnings: string[]  // 조건부 경고 사항
}

// ─── 업종 코드 매칭 ──────────────────────────────────────────
// 나라장터 공고 업무구분명(bsnsDivNm)과 회사 업종코드 비교

/** 업종코드 앞 2자리로 대분류 비교 */
function bizCodeMatches(companyCodes: string[], noticeDivNm: string): boolean {
  if (!noticeDivNm || companyCodes.length === 0) return true // 업종 제한 없으면 통과

  // 공고의 업무구분명에 회사 업종코드 키워드가 포함되는지 확인
  return companyCodes.some(code => {
    const prefix = code.slice(0, 2)
    // 주요 업종코드 → 업무구분명 매핑
    const bizMap: Record<string, string[]> = {
      '용': ['용역', '서비스', 'SW', '소프트웨어', 'IT', '정보'],
      '물': ['물품', '구매', '납품'],
      '공': ['공사', '건설', '시설'],
      '01': ['소프트웨어', 'IT', '정보', '시스템', '개발'],
      '02': ['물품', '구매'],
      '03': ['공사', '건설'],
      '04': ['용역', '서비스'],
    }
    const keywords = bizMap[prefix] ?? []
    return keywords.some(kw => noticeDivNm.includes(kw)) ||
      noticeDivNm.includes(code)
  })
}

// ─── 실적 금액 기준 ──────────────────────────────────────────
// 공공조달 일반적 기준: 추정가격의 1/2 이상 실적 필요

function revenueQualifies(
  companyRevenue: number,  // 만원
  estimatedAmount: number  // 만원
): 'sufficient' | 'marginal' | 'insufficient' {
  if (estimatedAmount === 0) return 'sufficient'
  const required = estimatedAmount * 0.5
  if (companyRevenue >= required) return 'sufficient'
  if (companyRevenue >= required * 0.7) return 'marginal'
  return 'insufficient'
}

// ─── 지역 매칭 ───────────────────────────────────────────────

const REGION_KEYWORDS: Record<string, string[]> = {
  '서울': ['서울', '종로', '중구', '용산', '성동', '광진', '동대문', '중랑', '성북', '강북', '도봉', '노원', '은평', '서대문', '마포', '양천', '강서', '구로', '금천', '영등포', '동작', '관악', '서초', '강남', '송파', '강동'],
  '경기': ['경기', '수원', '성남', '의정부', '안양', '부천', '광명', '평택', '동두천', '안산', '고양', '과천', '구리', '남양주', '오산', '시흥', '군포', '의왕', '하남', '용인', '파주', '이천', '안성', '김포', '화성', '광주', '양주', '포천', '여주'],
  '인천': ['인천'],
  '부산': ['부산'],
  '대구': ['대구'],
  '광주': ['광주'],
  '대전': ['대전'],
  '울산': ['울산'],
  '세종': ['세종'],
  '강원': ['강원', '춘천', '원주', '강릉'],
  '충북': ['충북', '청주', '충주'],
  '충남': ['충남', '천안', '아산'],
  '전북': ['전북', '전주', '익산'],
  '전남': ['전남', '목포', '여수'],
  '경북': ['경북', '포항', '경주', '김천', '안동'],
  '경남': ['경남', '창원', '진주', '통영'],
  '제주': ['제주'],
}

function regionMatches(companyRegion: string, orgName: string): boolean {
  if (!companyRegion) return true // 지역 미설정이면 전국 허용
  const keywords = REGION_KEYWORDS[companyRegion] ?? [companyRegion]
  // 발주기관명 또는 공고명에 지역 키워드 포함 여부
  // (중앙부처는 전국 발주이므로 항상 매칭)
  const centralGov = ['행정안전부', '기획재정부', '국토교통부', '환경부', '교육부', '보건복지부', '과학기술', '국방부', '외교부', '법무부', '고용노동부', '산업통상', '문화체육']
  if (centralGov.some(g => orgName.includes(g))) return true
  return keywords.some(kw => orgName.includes(kw))
}

// ─── 핵심 매칭 함수 ──────────────────────────────────────────

/**
 * 회사 프로필과 공고를 비교하여 매칭 결과를 반환합니다.
 *
 * @param profile  회사 프로필 (Firestore users/{uid}/profile)
 * @param notice   나라장터 공고 원본 데이터
 */
export function matchNoticeToCompany(
  profile: CompanyProfile,
  notice: G2BNoticeItem
): MatchResult {
  const reasons: string[] = []
  const warnings: string[] = []
  let baseScore = 50
  let hardBlock = false

  const estimatedAmount = parseAmountToManwon(notice.presmptPrce || '0')

  // 1. 업종 코드 체크 ─────────────────────────────────────────
  if (notice.indstrytyLmtYn === 'Y') {
    const matched = bizCodeMatches(profile.bizCodes, notice.bsnsDivNm || '')
    if (matched) {
      reasons.push('업종코드 일치')
      baseScore += 15
    } else {
      warnings.push(`업종 제한 있음 (${notice.bsnsDivNm}) — 상세 확인 필요`)
      baseScore -= 10
    }
  } else {
    reasons.push('업종 제한 없음')
    baseScore += 5
  }

  // 2. 실적 금액 체크 ─────────────────────────────────────────
  if (estimatedAmount > 0 && profile.revenue > 0) {
    const revenueResult = revenueQualifies(profile.revenue, estimatedAmount)
    if (revenueResult === 'sufficient') {
      reasons.push(`실적 충족 (${profile.revenue.toLocaleString()}만원)`)
      baseScore += 20
    } else if (revenueResult === 'marginal') {
      warnings.push('실적이 기준에 다소 부족할 수 있습니다')
      baseScore += 5
    } else {
      warnings.push(`실적 부족 우려 (추정가: ${estimatedAmount.toLocaleString()}만원, 보유: ${profile.revenue.toLocaleString()}만원)`)
      baseScore -= 15
      if (estimatedAmount > profile.revenue * 5) hardBlock = true
    }
  }

  // 3. 지역 체크 ───────────────────────────────────────────────
  const orgName = notice.ntceInsttNm || ''
  if (regionMatches(profile.region, orgName)) {
    reasons.push('발주지역 해당')
    baseScore += 10
  } else {
    warnings.push(`발주기관(${orgName})이 주사업 지역(${profile.region}) 외`)
    baseScore -= 5
  }

  // 4. 직원 수 체크 (50인 이상 필요한 경우 대략 추정) ─────────
  if (profile.headcount >= 5) {
    reasons.push('직원 수 충족')
    baseScore += 5
  }

  // 5. 국제입찰 여부 ──────────────────────────────────────────
  if (notice.intrntnlDlngYn === 'Y') {
    warnings.push('국제입찰 공고 — 별도 자격 요건 확인 필요')
    baseScore -= 10
  }

  // 6. 금액 클램프 ────────────────────────────────────────────
  // 추정가격이 매우 낮으면(소액) 낮은 경쟁 → 소폭 가산
  if (estimatedAmount > 0 && estimatedAmount < 5000) {
    baseScore += 5 // 소액 공고는 경쟁 낮음
  }

  // 7. 최종 점수 클램프 ───────────────────────────────────────
  const score = Math.min(100, Math.max(0, baseScore))

  // 8. 최종 상태 결정 ─────────────────────────────────────────
  let status: MatchStatus
  if (hardBlock) {
    status = '불가'
  } else if (warnings.length === 0 && score >= 70) {
    status = '가능'
  } else if (score >= 50) {
    status = '조건부'
  } else if (score < 30) {
    status = '불가'
  } else {
    status = '조건부'
  }

  return { status, score, reasons, warnings }
}

// ─── 배치 매칭 ───────────────────────────────────────────────

/**
 * 공고 목록 전체를 회사 프로필에 대해 매칭합니다.
 * 점수 내림차순으로 정렬하여 반환합니다.
 */
export function batchMatchNotices(
  profile: CompanyProfile,
  notices: G2BNoticeItem[]
): Array<G2BNoticeItem & { matchResult: MatchResult }> {
  return notices
    .map(notice => ({
      ...notice,
      matchResult: matchNoticeToCompany(profile, notice),
    }))
    .sort((a, b) => b.matchResult.score - a.matchResult.score)
}

// ─── 간편 요약 ───────────────────────────────────────────────

/** 매칭 결과를 한줄 요약 문자열로 변환 */
export function matchResultSummary(result: MatchResult): string {
  if (result.status === '불가') return `참가 불가 (점수 ${result.score})`
  if (result.status === '가능') return `참가 가능 ✓ (점수 ${result.score})`
  const warn = result.warnings[0] ?? '조건 확인 필요'
  return `조건부 가능 (점수 ${result.score}) — ${warn}`
}
