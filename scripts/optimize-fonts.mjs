// Subsets the full font families in font/ down to the glyphs this invitation
// can actually show, and converts them to woff2.
//
// The site used to load three 1.5MB Pretendard .otf files — every Korean
// syllable, every weight — as <link rel="preload">, so 4.9MB of fonts competed
// with the photos for the phone's first few seconds of bandwidth.
//
// Output goes to fonts-web/, not public/, because next/font copies these into
// the build itself; anything left in public/ would be deployed a second time
// and never requested.
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import subsetFont from 'subset-font'

const OUT = 'fonts-web'

/**
 * The 2350 Hangul syllables of KS X 1001 — the set Korean typing has treated as
 * "everything you need" for decades. Guestbook visitors type freely, so we
 * cannot subset to just the text we ship. Derived from the EUC-KR Hangul block
 * rather than pasted in, so there is no 2350-character literal to maintain.
 */
function ksx1001Syllables() {
  const decoder = new TextDecoder('euc-kr')
  let syllables = ''
  for (let hi = 0xb0; hi <= 0xc8; hi++) {
    for (let lo = 0xa1; lo <= 0xfe; lo++) {
      const char = decoder.decode(new Uint8Array([hi, lo]))
      if (char >= '가' && char <= '힣') syllables += char
    }
  }
  return syllables
}

const ascii = Array.from({ length: 0x7f - 0x20 }, (_, i) => String.fromCharCode(0x20 + i)).join('')
/** ㄱ-ㅎ and ㅏ-ㅣ on their own, for the ㅋㅋ / ㅎㅎ in guestbook messages. */
const jamo = Array.from({ length: 0x3163 - 0x3131 + 1 }, (_, i) => String.fromCharCode(0x3131 + i)).join('')
const symbols = '·…—–‘’“”♥♡★☆※○●▲△▶◀✓「」『』ㆍ°±×÷←→↑↓€£¥©®'

/** Every character the site itself renders, so no name or place name is missing. */
function charsInSource() {
  const dirs = ['app', 'components', 'lib']
  let text = ''
  for (const dir of dirs) {
    for (const name of readdirSync(dir)) {
      if (['.ts', '.tsx', '.css'].includes(extname(name))) text += readFileSync(join(dir, name), 'utf8')
    }
  }
  return [...new Set(text)].join('')
}

const KOREAN_TEXT = ksx1001Syllables() + ascii + jamo + symbols + charsInSource()
const LATIN_TEXT = ascii + symbols

// Only the weights the components actually ask for. Nothing renders at 600, so
// shipping SemiBold would be ~190KB nobody downloads for a reason. Add the
// weight back here (and in lib/fonts.ts) if a heavier style is ever used.
const FONTS = [
  { src: 'font/Pretendard/Pretendard-Regular.otf', out: 'Pretendard-Regular.woff2', text: KOREAN_TEXT },
  { src: 'font/Pretendard/Pretendard-Medium.otf', out: 'Pretendard-Medium.woff2', text: KOREAN_TEXT },
  { src: 'font/Lora/static/Lora-Regular.ttf', out: 'Lora-Regular.woff2', text: LATIN_TEXT },
]

// This file decides the glyph set, so editing it has to re-subset everything.
const SELF = statSync(fileURLToPath(import.meta.url)).mtimeMs

const isStale = (srcPath, outPath) => {
  try {
    return Math.max(statSync(srcPath).mtimeMs, SELF) > statSync(outPath).mtimeMs
  } catch {
    return true // no output yet
  }
}

mkdirSync(OUT, { recursive: true })

let totalKb = 0
let written = 0

for (const font of FONTS) {
  const outPath = join(OUT, font.out)
  if (isStale(font.src, outPath)) {
    const subset = await subsetFont(readFileSync(font.src), font.text, { targetFormat: 'woff2' })
    writeFileSync(outPath, subset)
    written += 1
  }
  totalKb += statSync(outPath).size / 1024
}

console.log(`${OUT}: ${written} of ${FONTS.length} fonts re-subset, ${totalKb.toFixed(0)}KB total`)
