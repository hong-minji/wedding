import { describe, it, expect } from 'vitest'
import { existsSync, statSync } from 'node:fs'
import { galleryPhotos, mainPhoto } from '@/lib/photos'

/** '/wedding/photos/x.webp?v=abc123' -> 'public/photos/x.webp' */
const toFile = (url: string) => `public/photos/${url.split('/photos/')[1].split('?')[0]}`

const everyPhoto = [
  { url: mainPhoto.src, blur: mainPhoto.blur, budgetKb: 200 },
  ...galleryPhotos.flatMap(p => [
    { url: p.thumb, blur: p.thumbBlur, budgetKb: 40 },
    { url: p.full, blur: p.fullBlur, budgetKb: 120 },
  ]),
]

describe('the photos the site ships', () => {
  it('are all WebP', () => {
    for (const { url } of everyPhoto) expect(url).toContain('.webp')
  })

  it('have been generated into public/photos', () => {
    for (const { url } of everyPhoto) expect(existsSync(toFile(url)), toFile(url)).toBe(true)
  })

  it('stay inside their size budget, so the invitation opens fast on mobile data', () => {
    for (const { url, budgetKb } of everyPhoto) {
      const kb = statSync(toFile(url)).size / 1024
      expect(kb, `${toFile(url)} is ${kb.toFixed(0)}KB`).toBeLessThan(budgetKb)
    }
  })

  it('each carry a blur placeholder to show while they load', () => {
    for (const { url, blur } of everyPhoto) {
      expect(blur, url).toMatch(/^data:image\/webp;base64,/)
      expect(blur!.length, `${url} placeholder is inlined in the HTML`).toBeLessThan(1000)
    }
  })
})
