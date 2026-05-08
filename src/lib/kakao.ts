/**
 * 알리고(Aligo) 카카오 알림톡/LMS 발송 모듈
 */

interface SendKakaoParams {
  phone: string;
  title: string;
  estimatedAmount: number;
  deadline: string;
  daysLeft: number;
  matchStatus: string;
  oneLiner: string;
  noticeId: string;
}

export async function sendKakaoNotification(params: SendKakaoParams) {
  const {
    phone,
    title,
    estimatedAmount,
    deadline,
    daysLeft,
    matchStatus,
    oneLiner,
    noticeId,
  } = params;

  const ALIGO_API_KEY = process.env.ALIGO_API_KEY;
  const ALIGO_USER_ID = process.env.ALIGO_USER_ID;
  const ALIGO_SENDER = process.env.ALIGO_SENDER;

  if (!ALIGO_API_KEY || !ALIGO_USER_ID || !ALIGO_SENDER) {
    console.warn('[Kakao] 알리고 환경변수가 설정되지 않아 발송을 건너뜁니다.');
    return { success: false, error: 'Missing environment variables' };
  }

  // 템플릿 내용 구성
  const message = `[BidMaster 입찰 추천]
📋 ${title}
💰 추정금액: ${estimatedAmount.toLocaleString()}만원
⏰ 마감: ${deadline} (D-${daysLeft})
✅ 참가 가능 여부: ${matchStatus}
🤖 ${oneLiner}
🔗 https://bidmaster.vercel.app/dashboard/notices/${noticeId}`;

  try {
    // 알리고 API 호출 (LMS 기준 - 알림톡 템플릿 승인 전이라도 발송 가능하도록)
    // 실제 알림톡 사용 시에는 /akv10/alimtalk/send/ 호출 필요
    const body = new URLSearchParams();
    body.append('key', ALIGO_API_KEY);
    body.append('userid', ALIGO_USER_ID);
    body.append('sender', ALIGO_SENDER);
    body.append('receiver', phone.replace(/-/g, ''));
    body.append('msg', message);
    body.append('title', '[BidMaster 입찰 추천]');
    body.append('msg_type', 'LMS'); // 긴 메시지

    const response = await fetch('https://apis.aligo.in/send/', {
      method: 'POST',
      body,
    });

    const result = await response.json();

    if (result.result_code === '1') {
      return { success: true, mid: result.msg_id };
    } else {
      console.error('[Kakao] 알리고 발송 실패:', result.message);
      return { success: false, error: result.message };
    }
  } catch (err) {
    console.error('[Kakao] 발송 오류:', err);
    return { success: false, error: String(err) };
  }
}
