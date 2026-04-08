/**
 * POST /api/notices/fetch
 *
 * 나라장터에서 오늘 공고를 가져와 Firestore에 저장합니다.
 * 수동 트리거 또는 Vercel Cron으로 매일 08:00 호출됩니다.
 *
 * 보호: CRON_SECRET 헤더로 인증
 */

import { NextRequest, NextResponse } from 'next/server'
import { fetchAllTodayNotices, parseAmountToManwon, parseG2BDate } from '@/lib/g2b'
import { Timestamp } from 'firebase-admin/firestore'
import { adminDb } from '@/lib/firebase-admin'

// Vercel Cron 또는 수동 호출 인증
const CRON_SECRET = process.env.CRON_SECRET

async function runFetch(req: NextRequest) {
  // 인증 체크 (선택적 — CRON_SECRET 설정 시)
  if (CRON_SECRET) {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const notices = await fetchAllTodayNotices()

    const docRefs = notices.map(n =>
      adminDb.collection('bid_notices').doc(`${n.bidNtceNo}-${n.bidNtceOrd}`)
    )

    const snapshots = await Promise.all(docRefs.map(ref => ref.get()))
    const existingIds = new Set(
      snapshots.filter(s => s.exists).map(s => s.id)
    )

    // Firestore 배치는 최대 500건 제한 → 청크로 분할
    const BATCH_SIZE = 400
    let saved = 0
    let skipped = 0

    const newNotices = notices
      .map((notice, i) => ({ notice, ref: docRefs[i] }))
      .filter(({ ref }) => !existingIds.has(ref.id))

    for (let start = 0; start < newNotices.length; start += BATCH_SIZE) {
      const chunk = newNotices.slice(start, start + BATCH_SIZE)
      const batch = adminDb.batch()

      chunk.forEach(({ notice, ref }) => {
        const deadlineDate = parseG2BDate(notice.bidClseDt)
        const estimatedAmount = parseAmountToManwon(notice.presmptPrce || '0')

        batch.set(ref, {
          title: notice.bidNtceNm,
          orgName: notice.ntceInsttNm,
          bizCode: notice.bsnsDivNm || '',
          estimatedAmount,
          deadline: deadlineDate ? Timestamp.fromDate(deadlineDate) : null,
          requirements: [
            notice.ntceKindNm,
            notice.bidMthdNm,
            notice.indstrytyLmtYn === 'Y' ? '업종 제한 있음' : '업종 제한 없음',
          ].filter(Boolean).join(' / '),
          noticeUrl: notice.linkUrl || `https://www.g2b.go.kr/link/PNPE027_01/single/?bidPbancNo=${notice.bidNtceNo}&bidPbancOrd=${notice.bidNtceOrd}`,
          rawData: notice,
          createdAt: Timestamp.now(),
        })
        saved++
      })

      await batch.commit()
    }

    skipped = notices.length - saved

    return NextResponse.json({ ok: true, fetched: notices.length, saved, skipped })
  } catch (err) {
    console.error('[notices/fetch] 오류:', err)
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    )
  }
}

// Vercel Cron은 GET으로 호출, 수동 트리거는 POST로 호출
export async function GET(req: NextRequest) { return runFetch(req) }
export async function POST(req: NextRequest) { return runFetch(req) }

export const dynamic = 'force-dynamic'
