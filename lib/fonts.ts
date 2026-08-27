import localFont from 'next/font/local'

// These files are subset to the glyphs this site can show and converted to
// woff2 by scripts/optimize-fonts.mjs — see font/ for the full originals.
// Only the weights the components actually use are loaded; adding a weight here
// means adding it to that script too, or the file will not exist.
export const lora = localFont({
  src: [{ path: '../fonts-web/Lora-Regular.woff2', weight: '400', style: 'normal' }],
  variable: '--font-lora',
  display: 'swap',
})

export const pretendard = localFont({
  src: [
    { path: '../fonts-web/Pretendard-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts-web/Pretendard-Medium.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-pretendard',
  display: 'swap',
})
