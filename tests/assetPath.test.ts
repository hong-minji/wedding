import { describe, it, expect } from 'vitest'
import { asset, versioned, absoluteAsset } from '@/lib/assetPath'

const VERSIONED = /\?v=[0-9a-f]{8}$/

describe('versioned', () => {
  it('appends the content hash of a photo in the manifest', () => {
    expect(versioned('/photos/main.webp')).toMatch(/^\/photos\/main\.webp\?v=[0-9a-f]{8}$/)
  })

  it('gives different photos different versions', () => {
    expect(versioned('/photos/main.webp')).not.toBe(versioned('/photos/meta-image.jpg'))
  })

  it('leaves paths that are not in the manifest untouched', () => {
    expect(versioned('/photos/does-not-exist.png')).toBe('/photos/does-not-exist.png')
  })
})

describe('asset', () => {
  it('versions every photo the site renders', () => {
    for (const path of [
      '/photos/main.webp',
      '/photos/photo-01-thumb.webp',
      '/photos/photo-06.webp',
    ]) {
      expect(asset(path)).toMatch(VERSIONED)
    }
  })
})

describe('absoluteAsset', () => {
  it('builds a versioned absolute URL for share/OG tags', () => {
    expect(absoluteAsset('https://example.com/wedding/', '/photos/meta-image.jpg')).toMatch(
      /^https:\/\/example\.com\/wedding\/photos\/meta-image\.jpg\?v=[0-9a-f]{8}$/,
    )
  })

  it('does not double up the slash when the base has no trailing slash', () => {
    expect(absoluteAsset('https://example.com', '/photos/meta-image.jpg')).toMatch(
      /^https:\/\/example\.com\/photos\/meta-image\.jpg\?v=/,
    )
  })
})
