/**
 * Claude API를 이용한 입찰 공고 AI 분석
 */

import Anthropic from '@anthropic-ai/sdk'
import type { CompanyProfile, AISummary, MatchStatus } from '@/types'
import type { G2BNoticeItem } from './g2b'
import { parseAmountToManwon } from './g2b'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export interface AIMatchResult {
  aiSummary: AISummary
  matchStatus: MatchStatus
}

export async function analyzeNoticeWithAI(
  profile: CompanyProfile,
  notice: G2BNoticeItem
): Promise<AIMatchResult> {
  const amount = parseAmountToManwon(notice.presmptPrce || '0')

  // [신규 추가] 금액 범위 및 실적 키워드
  const amountMin = profile.amountMin ?? 0
  const amountMax = profile.amountMax ?? 0
  const keywords = profile.keywords ?? []

  // [신규 추가] 금액 범위 가중치 계산 안내 텍스트 구성
  const amountRangeText =
    amountMin > 0 && amountMax > 0
      ? `${amountMin.toLocaleString()}만원 ~ ${amountMax.toLocaleString()}만원`
      : '미설정'

  const keywordsText = keywords.length > 0 ? keywords.join(', ') : '없음'

  // [신규 추가] 금액 범위 가중치 지시 (미설정 시 적용 안 함)
  const amountScoreInstruction =
    amountMin > 0 && amountMax > 0 && amount > 0
      ? `- 공고 추정금액(${amount.toLocaleString()}만원)이 희망 범위(${amountMin.toLocaleString()}~${amountMax.toLocaleString()}만원) 내이면 +20점, 범위 밖이면 -30점`
      : '- 금액 범위 미설정 또는 금액 미공개이므로 금액 가중치 적용 안 함'

  // [신규 추가] 키워드 매칭 가중치 지시
  const keywordScoreInstruction =
    keywords.length > 0
      ? `- 공고명/공고종류에 실적 키워드(${keywordsText})와 매칭되는 항목이 있으면 매칭 1개당 +10점 (최대 +30점)`
      : '- 실적 키워드 미등록이므로 키워드 가중치 적용 안 함'

  const prompt = `당신은 대한민국 공공 입찰 전문가입니다. 아래 회사 정보와 입찰 공고를 분석하여 적합 여부를 판단하고 JSON만 반환하세요.

[회사 정보]
- 업종코드: ${profile.bizCodes.join(', ') || '미등록'}
- 보유 면허: ${profile.licenses.join(', ') || '없음'}
- 최근 실적: ${profile.revenue.toLocaleString()}만원
- 직원 수: ${profile.headcount}명
- 주사업 지역: ${profile.region || '전국'}
- 참여 희망 금액 범위: ${amountRangeText}
- 실적 키워드: ${keywordsText}

[입찰 공고]
- 공고명: ${notice.bidNtceNm}
- 발주기관: ${notice.ntceInsttNm}
- 수요기관: ${notice.dminsttNm || '-'}
- 추정금액: ${amount > 0 ? amount.toLocaleString() + '만원' : '미공개'}
- 입찰방법: ${notice.bidMthdNm || '-'}
- 공고종류: ${notice.ntceKindNm || '-'}

[점수 산출 가중치 — 반드시 적용하세요]
- 기본 점수: 업종코드·면허·실적 규모의 적합도로 산출 (0~50점 범위)
${amountScoreInstruction}
${keywordScoreInstruction}
- 최종 score는 0~100 사이 정수로 클램프하세요

반환 형식 (JSON만, 다른 텍스트 없이):
{
  "score": 0~100 사이 정수,
  "matchStatus": "가능" 또는 "조건부" 또는 "불가",
  "qualifications": "필수 자격 조건 요약 (2~3줄)",
  "cautions": "주의사항 (없으면 빈 문자열)",
  "difficulty": "상" 또는 "중" 또는 "하",
  "advantages": "이 회사에 유리한 포인트 (없으면 빈 문자열)",
  "oneLiner": "공고 한줄 요약 (20자 이내)"
}`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Claude 응답에서 JSON을 파싱할 수 없습니다.')

  const parsed = JSON.parse(jsonMatch[0])

  const aiSummary: AISummary = {
    score: Math.min(100, Math.max(0, Number(parsed.score) || 0)), // [신규 추가] 0~100 클램프
    qualifications: parsed.qualifications || '',
    cautions: parsed.cautions || '',
    difficulty: parsed.difficulty || '중',
    advantages: parsed.advantages || '',
    oneLiner: parsed.oneLiner || '',
  }

  const matchStatus: MatchStatus =
    ['가능', '조건부', '불가'].includes(parsed.matchStatus)
      ? parsed.matchStatus
      : '조건부'

  return { aiSummary, matchStatus }
}
