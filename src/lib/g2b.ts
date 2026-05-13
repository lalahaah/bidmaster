/**
 * 나라장터(G2B) 조달청 Open API 클라이언트
 * API: https://apis.data.go.kr/1230000/ad/BidPublicInfoService
 * 문서: https://www.data.go.kr/data/15001101/openapi.do
 */

const G2B_BASE = 'https://apis.data.go.kr/1230000/ad/BidPublicInfoService'
const API_KEY = process.env.G2B_API_KEY!

// ─── 나라장터 API 응답 타입 ───────────────────────────────────

export interface G2BNoticeItem {
  bidNtceNo: string        // 입찰공고번호
  bidNtceOrd: string       // 공고차수
  bidNtceNm: string        // 입찰공고명
  ntceInsttNm: string      // 공고기관명
  ntceInsttCd: string      // 공고기관코드
  dminsttNm: string        // 수요기관명
  bidNtceDt: string        // 입찰공고일시 (YYYY-MM-DD HH:mm)
  bidClseDt: string        // 입찰마감일시
  opengDt: string          // 개찰일시
  presmptPrce: string      // 추정가격 (원)
  asignBdgtAmt: string     // 배정예산액 (원)
  ntceKindNm: string       // 공고종류명 (물품/용역/공사 등)
  bidMthdNm: string        // 입찰방법명 (일반경쟁/제한경쟁 등)
  indstrytyLmtYn: string   // 업종제한여부 (Y/N)
  ntceInsttOfclNm: string  // 공고기관담당자명
  ntceInsttOfclTelNo: string // 담당자 연락처
  linkUrl: string          // 나라장터 공고 링크
  rbidPermsnYn: string     // 재입찰허용여부
  intrntnlDlngYn: string   // 국제입찰여부
  bsnsDivNm: string        // 업무구분명
}

interface G2BResponse {
  response: {
    header: { resultCode: string; resultMsg: string }
    body: {
      items: G2BNoticeItem[] | { item: G2BNoticeItem[] | G2BNoticeItem } | ''
      numOfRows: number
      pageNo: number
      totalCount: number
    }
  }
}

// ─── 날짜 헬퍼 ───────────────────────────────────────────────

/** YYYYMMDD 형식으로 변환 */
function toG2BDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}${m}${d}`
}

// ─── 공고 목록 조회 ──────────────────────────────────────────

export interface FetchNoticesOptions {
  /** 조회 시작일 (기본: 오늘) */
  startDate?: Date
  /** 조회 종료일 (기본: 오늘) */
  endDate?: Date
  /** 페이지당 건수 (기본: 100) */
  numOfRows?: number
  /** 페이지 번호 (기본: 1) */
  pageNo?: number
  /** 공고명 키워드 필터 */
  keyword?: string
}

/**
 * 나라장터 공고 유형별 엔드포인트
 * - Cnstwk: 공사
 * - Servc:  용역 (소프트웨어, 영상제작, 컨설팅 등)
 * - Thng:   물품
 * - Etc:    기타 / 외자
 */
const G2B_ENDPOINTS: Record<string, string> = {
  공사: 'getBidPblancListInfoCnstwk',
  용역: 'getBidPblancListInfoServc',
  물품: 'getBidPblancListInfoThng',
  기타: 'getBidPblancListInfoEtc',
}

/**
 * 키워드 검색 전용 엔드포인트 (PPSSrch)
 */
const G2B_SEARCH_ENDPOINTS: Record<string, string> = {
  공사: 'getBidPblancListInfoCnstwkPPSSrch',
  용역: 'getBidPblancListInfoServcPPSSrch',
  외자: 'getBidPblancListInfoFrgcptPPSSrch',
  물품: 'getBidPblancListInfoThngPPSSrch',
}

/**
 * 특정 엔드포인트에서 나라장터 입찰공고 목록을 가져옵니다.
 * 서버 사이드 전용 (API_KEY 사용)
 */
export async function fetchBidNotices(
  options: FetchNoticesOptions = {},
  endpoint: string = G2B_ENDPOINTS['공사']
): Promise<{ items: G2BNoticeItem[]; totalCount: number }> {
  const today = new Date()
  const {
    startDate = today,
    endDate = today,
    numOfRows = 100,
    pageNo = 1,
    keyword,
  } = options

  const start = `${toG2BDate(startDate)}0000`
  const end   = `${toG2BDate(endDate)}2359`

  const params = new URLSearchParams({
    serviceKey: API_KEY,
    numOfRows:  String(numOfRows),
    pageNo:     String(pageNo),
    type:       'json',
    inqryDiv:   '1',       // 1: 등록일시 기준
    inqryBgnDt: start,
    inqryEndDt: end,
  })

  if (keyword) params.set('bidNtceNm', keyword)

  const url = `${G2B_BASE}/${endpoint}?${params}`

  const res = await fetch(url, {
    next: { revalidate: 0 }, // 항상 최신 데이터
  })

  if (!res.ok) {
    throw new Error(`나라장터 API 오류 [${endpoint}]: ${res.status} ${res.statusText}`)
  }

  const data: G2BResponse = await res.json()
  const { header, body } = data.response

  if (header.resultCode !== '00') {
    throw new Error(`나라장터 API 결과 오류 [${endpoint}]: ${header.resultCode} - ${header.resultMsg}`)
  }

  if (!body.items || (body.items as unknown) === '') {
    return { items: [], totalCount: 0 }
  }

  const raw = body.items
  let items: G2BNoticeItem[]

  if (Array.isArray(raw)) {
    items = raw
  } else if ('item' in raw) {
    items = Array.isArray(raw.item) ? raw.item : [raw.item]
  } else {
    items = [raw as G2BNoticeItem]
  }

  return { items, totalCount: body.totalCount }
}

/**
 * 단일 엔드포인트의 전체 페이지를 순회합니다.
 */
async function fetchAllFromEndpoint(
  options: FetchNoticesOptions,
  endpoint: string
): Promise<G2BNoticeItem[]> {
  const all: G2BNoticeItem[] = []
  let pageNo = 1
  const numOfRows = 100

  while (true) {
    const { items, totalCount } = await fetchBidNotices({ ...options, numOfRows, pageNo }, endpoint)
    all.push(...items)
    if (all.length >= totalCount || items.length === 0) break
    pageNo++
  }

  return all
}

/**
 * 오늘 등록된 전체 공고를 공사/용역/물품/기타 4개 유형에서 모두 가져옵니다.
 * 각 유형은 병렬로 요청합니다.
 */
export async function fetchAllTodayNotices(options: FetchNoticesOptions = {}): Promise<G2BNoticeItem[]> {
  const results = await Promise.allSettled(
    Object.entries(G2B_ENDPOINTS).map(([, endpoint]) =>
      fetchAllFromEndpoint(options, endpoint)
    )
  )

  const all: G2BNoticeItem[] = []
  for (const result of results) {
    if (result.status === 'fulfilled') {
      all.push(...result.value)
    } else {
      // 한 유형이 실패해도 나머지는 계속
      console.warn('[fetchAllTodayNotices] 일부 엔드포인트 실패:', result.reason)
    }
  }

  return all
}

/**
 * 특정 키워드로 최근 30일간 등록된 공고를 모든 유형(공사/용역/물품/기타)에서 조회합니다.
 */
export async function fetchBidNoticesByKeyword(keyword: string): Promise<G2BNoticeItem[]> {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - 30)

  const results = await Promise.allSettled(
    Object.entries(G2B_SEARCH_ENDPOINTS).map(([, endpoint]) =>
      fetchBidNotices({ startDate, endDate, keyword, numOfRows: 100 }, endpoint)
    )
  )

  const all: G2BNoticeItem[] = []
  for (const result of results) {
    if (result.status === 'fulfilled') {
      all.push(...result.value.items)
    }
  }

  // 중복 제거 (bidNtceNo + bidNtceOrd 기준)
  const unique = new Map<string, G2BNoticeItem>()
  all.forEach(item => {
    unique.set(`${item.bidNtceNo}-${item.bidNtceOrd}`, item)
  })

  return Array.from(unique.values())
}

// ─── 금액 파싱 유틸 ──────────────────────────────────────────

/** 나라장터 금액 문자열 → 만원 단위 숫자 */
export function parseAmountToManwon(value: string): number {
  const num = parseFloat(value.replace(/,/g, ''))
  if (isNaN(num)) return 0
  return Math.round(num / 10000) // 원 → 만원
}

/** 나라장터 일시 문자열 → Date */
export function parseG2BDate(value: string): Date | null {
  if (!value) return null
  // "2026-03-24 08:00" 또는 "20260324" 형식
  const clean = value.replace(/[-: ]/g, '')
  if (clean.length < 8) return null
  const y = clean.slice(0, 4)
  const m = clean.slice(4, 6)
  const d = clean.slice(6, 8)
  const h = clean.slice(8, 10) || '00'
  const min = clean.slice(10, 12) || '00'
  return new Date(`${y}-${m}-${d}T${h}:${min}:00+09:00`)
}
