import localFont from 'next/font/local'

export const lora = localFont({
  src: [
    { path: '../public/fonts/Lora/Lora-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/Lora/Lora-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../public/fonts/Lora/Lora-SemiBold.ttf', weight: '600', style: 'normal' },
  ],
  variable: '--font-lora',
  display: 'swap',
})

export const pretendard = localFont({
  src: [
    { path: '../public/fonts/Pretendard/Pretendard-Regular.otf', weight: '400', style: 'normal' },
    { path: '../public/fonts/Pretendard/Pretendard-Medium.otf', weight: '500', style: 'normal' },
    { path: '../public/fonts/Pretendard/Pretendard-SemiBold.otf', weight: '600', style: 'normal' },
  ],
  variable: '--font-pretendard',
  display: 'swap',
})
