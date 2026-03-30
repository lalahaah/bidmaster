import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  title: 'BidMaster — 놓치는 공고 없이, 이기는 입찰만',
  description:
    '나라장터 입찰 공고를 AI가 자동 분석하여 우리 회사에 맞는 공고만 카카오톡으로 알려주는 SaaS',
  keywords: ['나라장터', '입찰', '공공조달', 'AI', '입찰공고', '자동분석'],
  openGraph: {
    title: 'BidMaster',
    description: '놓치는 공고 없이, 이기는 입찰만',
    type: 'website',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${plusJakarta.variable} font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
