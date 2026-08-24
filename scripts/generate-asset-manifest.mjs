// Maps every file in public/photos to a short hash of its contents, so asset()
// can serve it under a URL that changes whenever the photo changes. Without
// this a re-uploaded photo keeps its old URL and browsers (and the Kakao share
// scraper) keep showing the cached one.
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const PHOTOS_DIR = 'public/photos'
const OUT = 'lib/asset-manifest.json'

const manifest = {}
for (const name of readdirSync(PHOTOS_DIR).sort()) {
  if (name.startsWith('.')) continue
  const hash = createHash('sha256').update(readFileSync(join(PHOTOS_DIR, name))).digest('hex')
  manifest[`/photos/${name}`] = hash.slice(0, 8)
}

writeFileSync(OUT, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`${OUT}: ${Object.keys(manifest).length} assets`)
