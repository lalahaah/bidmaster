import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 로그인이 필요한 경로 패턴
const PROTECTED_PATHS = ['/dashboard']

// 로그인 상태에서 접근 불가한 경로
const AUTH_PATHS = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Firebase Auth 세션 쿠키 확인
  // Firebase는 클라이언트 사이드 Auth를 사용하므로
  // 미들웨어에서는 커스텀 쿠키로 로그인 여부를 판단합니다.
  // (실제 토큰 검증은 클라이언트/서버 컴포넌트에서 처리)
  const sessionCookie = request.cookies.get('bidmaster_session')
  const isAuthenticated = !!sessionCookie?.value

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  )
  const isAuthPath = AUTH_PATHS.some((path) => pathname.startsWith(path))

  // 보호된 경로에 미인증 접근 → 로그인 페이지로
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 로그인 상태에서 로그인 페이지 접근 → 대시보드로
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * 다음 경로는 제외:
     * - api 라우트
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico
     * - public 폴더 파일
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
}
