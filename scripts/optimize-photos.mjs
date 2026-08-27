// Turns the full-size originals in photos-src/ into the web-sized files the
// site actually serves. The originals are 1-6MB PNGs; a phone only ever draws
// them a few hundred CSS pixels wide, so shipping them as-is meant the
// invitation downloaded ~17MB before the first photo appeared.
//
// Every photo becomes WebP, which every phone released since 2020 (iOS 14+,
// all Android) can decode and which is far smaller than PNG for photographs.
// The only exception is the share thumbnail: KakaoTalk's link scraper is not
// reliably WebP-aware, so that one stays JPEG.
//
// Widths are picked from how big each photo is drawn on the largest phone we
// care about (430pt wide, 3x screen), so a 3x device still gets real pixels.
import { mkdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const SRC = 'photos-src'
const OUT = 'public/photos'
const BLUR_OUT = 'lib/photo-blur.json'

const GALLERY = ['photo-01', 'photo-02', 'photo-03', 'photo-04', 'photo-05', 'photo-06']

/** width: longest side of the output. quality: WebP/JPEG quality. */
const JOBS = [
  // Hero, drawn edge-to-edge and cropped to the screen height.
  { src: 'main.png', out: 'main.webp', width: 1600, quality: 85, blur: true },
  // Open Graph / KakaoTalk thumbnail. JPEG on purpose — see above.
  { src: 'meta-image.png', out: 'meta-image.jpg', width: 1200, quality: 82 },
  // Gallery: a small one for the 2-column grid, a big one for the lightbox.
  ...GALLERY.flatMap(name => [
    { src: `${name}.png`, out: `${name}-thumb.webp`, width: 640, quality: 74, blur: true },
    { src: `${name}.png`, out: `${name}.webp`, width: 1280, quality: 80, blur: true },
  ]),
]

mkdirSync(OUT, { recursive: true })

// This file counts as an input too, so changing a width or a quality below
// re-encodes even though the originals have not been touched.
const SELF = statSync(fileURLToPath(import.meta.url)).mtimeMs

const isStale = (srcPath, outPath) => {
  try {
    return Math.max(statSync(srcPath).mtimeMs, SELF) > statSync(outPath).mtimeMs
  } catch {
    return true // no output yet
  }
}

const blurs = {}
let written = 0

for (const job of JOBS) {
  const srcPath = join(SRC, job.src)
  const outPath = join(OUT, job.out)

  if (isStale(srcPath, outPath)) {
    const resized = sharp(srcPath).rotate().resize({
      width: job.width,
      height: job.width,
      fit: 'inside',
      withoutEnlargement: true,
    })
    const encoded = job.out.endsWith('.jpg')
      ? resized.jpeg({ quality: job.quality, progressive: true, mozjpeg: true })
      : resized.webp({ quality: job.quality, effort: 6 })
    await encoded.toFile(outPath)
    written += 1
  }

  if (job.blur) {
    // A 16px-wide WebP inlined as next/image's blur placeholder, so the layout
    // shows the photo's colours while the real file is still downloading.
    const tiny = await sharp(srcPath)
      .resize({ width: 16 })
      .webp({ quality: 40, alphaQuality: 0 })
      .toBuffer()
    blurs[`/photos/${job.out}`] = `data:image/webp;base64,${tiny.toString('base64')}`
  }
}

writeFileSync(BLUR_OUT, `${JSON.stringify(blurs, null, 2)}\n`)
console.log(`${OUT}: ${written} of ${JOBS.length} photos re-encoded, ${Object.keys(blurs).length} blur placeholders`)
