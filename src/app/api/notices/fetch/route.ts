/**
 * GET /api/notices/fetch
 * 
 * [Vercel Cron용 아키텍처 변경]
 * 1. 모든 유저의 키워드(keywords) 및 업종코드(bizCodes)를 수집
 * 2. 수집된 모든 키워드에 대해 나라장터 API 검색 및 Firestore 저장
 * 3. 사용자 맞춤형 데이터 적재 효율화
 */

import { NextRequest, NextResponse } from 'next/server'
import { Timestamp } from 'firebase-admin/firestore'
import { adminDb } from '@/lib/firebase-admin'
import { fetchBidNoticesByKeyword, parseAmountToManwon, parseG2BDate, G2BNoticeItem } from '@/lib/g2b'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const testKeyword = url.searchParams.get('test')

  // 테스트 모드 로직
  if (testKeyword) {
    try {
      const items = await fetchBidNoticesByKeyword(testKeyword)
      return NextResponse.json({
        keyword: testKeyword,
        totalCount: items.length,
        items: items.slice(0, 3).map(item => ({
          title: item.bidNtceNm,
          org: item.ntceInsttNm
        }))
      })
    } catch (err) {
      return NextResponse.json({ error: String(err) }, { status: 500 })
    }
  }

  // Cron 인증 확인
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('[Cron] 키워드 기반 공고 수집 시작...')

    // 1. 모든 유저의 검색어 수집
    const usersSnap = await adminDb.collection('users').get()
    const allSearchTerms = new Set<string>()

    usersSnap.docs.forEach(doc => {
      const data = doc.data()
      const profile = data.profile || {}
      
      const keywords = profile.keywords || []
      const bizCodes = profile.bizCodes || []
      
      keywords.forEach((k: string) => k && allSearchTerms.add(k))
      bizCodes.forEach((b: string) => b && allSearchTerms.add(b))
    })

    const terms = Array.from(allSearchTerms)
    console.log(`[Cron] 수집된 고유 키워드/업종코드 (${terms.length}개):`, terms)

    if (terms.length === 0) {
      return NextResponse.json({ message: 'No keywords found to search' })
    }

    // 2. 키워드별 나라장터 API 검색 (병렬 처리하되 과부하 방지 위해 청크 단위 권장)
    let totalSaved = 0
    const CHUNK_SIZE = 5 // 동시에 5개 키워드씩 검색
    
    for (let i = 0; i < terms.length; i += CHUNK_SIZE) {
      const chunk = terms.slice(i, i + CHUNK_SIZE)
      console.log(`[Cron] 검색 진행 중... (${i + 1}/${terms.length})`)

      const results = await Promise.allSettled(
        chunk.map(term => fetchBidNoticesByKeyword(term))
      )

      const flatResults: G2BNoticeItem[] = []
      results.forEach(res => {
        if (res.status === 'fulfilled') flatResults.push(...res.value)
      })

      // 3. Firestore 저장 (중복 제거 포함)
      if (flatResults.length > 0) {
        const savedCount = await saveToFirestore(flatResults)
        totalSaved += savedCount
      }
    }

    console.log(`[Cron] 수집 완료. 총 저장 시도 건수: ${totalSaved}`)
    return NextResponse.json({ 
      success: true, 
      termsCount: terms.length,
      totalSaved 
    })

  } catch (err) {
    console.error('[Cron] 오류:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

/**
 * G2B 검색 결과를 Firestore에 저장 (중복 제거 및 업데이트)
 */
async function saveToFirestore(items: G2BNoticeItem[]): Promise<number> {
  if (!items.length) return 0
  let saved = 0

  const CHUNK = 400
  for (let i = 0; i < items.length; i += CHUNK) {
    const batch = adminDb.batch()
    const chunk = items.slice(i, i + CHUNK)
    
    for (const item of chunk) {
      const docId = `${item.bidNtceNo}-${item.bidNtceOrd}`
      const ref = adminDb.collection('bid_notices').doc(docId)
      
      const deadlineDate = parseG2BDate(item.bidClseDt)
      batch.set(ref, {
        title: item.bidNtceNm,
        orgName: item.ntceInsttNm,
        bizCode: item.bsnsDivNm || '',
        estimatedAmount: parseAmountToManwon(item.presmptPrce || '0'),
        deadline: deadlineDate ? Timestamp.fromDate(deadlineDate) : null,
        requirements: [
          item.ntceKindNm,
          item.bidMthdNm,
          item.indstrytyLmtYn === 'Y' ? '업종 제한 있음' : '업종 제한 없음',
        ].filter(Boolean).join(' / '),
        noticeUrl: item.linkUrl ||
          `https://www.g2b.go.kr/link/PNPE027_01/single/?bidPbancNo=${item.bidNtceNo}&bidPbancOrd=${item.bidNtceOrd}`,
        rawData: item,
        createdAt: Timestamp.now(),
      }, { merge: true })
    }
    
    await batch.commit()
    saved += chunk.length
  }
  return saved
}

export const dynamic = 'force-dynamic'
