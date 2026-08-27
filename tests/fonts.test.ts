import { describe, it, expect } from 'vitest'
import { readFileSync, statSync } from 'node:fs'

// The fonts are preloaded, so they compete with the hero photo for the first
// seconds of a phone's bandwidth. Before subsetting they were 4.9MB.
const BUILT = [
  { file: 'fonts-web/Pretendard-Regular.woff2', budgetKb: 250 },
  { file: 'fonts-web/Pretendard-Medium.woff2', budgetKb: 250 },
  { file: 'fonts-web/Lora-Regular.woff2', budgetKb: 40 },
]

describe('the fonts the site ships', () => {
  it('are built and stay inside their size budget', () => {
    for (const { file, budgetKb } of BUILT) {
      const kb = statSync(file).size / 1024
      expect(kb, `${file} is ${kb.toFixed(0)}KB`).toBeLessThan(budgetKb)
    }
  })

  it('are the only ones lib/fonts.ts asks for', () => {
    const declared = [...readFileSync('lib/fonts.ts', 'utf8').matchAll(/fonts-web\/([\w-]+\.woff2)/g)]
    expect(declared.map(m => `fonts-web/${m[1]}`).sort()).toEqual(BUILT.map(b => b.file).sort())
  })
})
