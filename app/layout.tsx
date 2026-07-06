import type { Metadata } from 'next'
import { lora, pretendard } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: '홍민지 · 조해창 결혼합니다',
  description: '2026. 10. 3. SAT 5PM · 고려대학교 교우회관',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${lora.variable} ${pretendard.variable}`}>
      <body className="antialiased" style={{ fontFamily: 'var(--font-pretendard)' }}>
        {children}
      </body>
    </html>
  )
}
