import type { Metadata } from 'next'
import { Manrope, Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-manrope',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${manrope.variable} ${inter.variable} font-body antialiased bg-[#111318] text-[#e2e2e8]`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
