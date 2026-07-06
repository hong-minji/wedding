import type { Metadata } from 'next'
import Script from 'next/script'
import { lora, pretendard } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://hong-minji.github.io/wedding/'),
  title: '홍민지 · 조해창 결혼합니다',
  description: '2026. 10. 3. SAT 5PM · 고려대학교 교우회관',
  openGraph: {
    title: '홍민지 · 조해창 결혼합니다',
    description: '2026. 10. 3. SAT 5PM · 고려대학교 교우회관',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${lora.variable} ${pretendard.variable}`}>
      <body className="antialiased" style={{ fontFamily: 'var(--font-pretendard)' }}>
        {children}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  )
}
