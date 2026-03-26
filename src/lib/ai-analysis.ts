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

  const prompt = `당신은 대한민국 공공 입찰 전문가입니다. 아래 회사 정보와 입찰 공고를 분석하여 적합 여부를 판단하고 JSON만 반환하세요.

[회사 정보]
- 업종코드: ${profile.bizCodes.join(', ') || '미등록'}
- 보유 면허: ${profile.licenses.join(', ') || '없음'}
- 최근 실적: ${profile.revenue.toLocaleString()}만원
- 직원 수: ${profile.headcount}명
- 주사업 지역: ${profile.region || '전국'}

[입찰 공고]
- 공고명: ${notice.bidNtceNm}
- 발주기관: ${notice.ntceInsttNm}
- 수요기관: ${notice.dminsttNm || '-'}
- 추정금액: ${amount > 0 ? amount.toLocaleString() + '만원' : '미공개'}
- 입찰방법: ${notice.bidMthdNm || '-'}
- 공고종류: ${notice.ntceKindNm || '-'}

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
    score: Number(parsed.score) || 0,
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
