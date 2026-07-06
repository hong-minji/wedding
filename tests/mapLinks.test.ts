import { describe, it, expect } from 'vitest'
import { kakaoMapUrl, naverMapUrl, tmapUrl } from '@/lib/mapLinks'

const p = { name: '고려대학교 교우회관', lat: 37.5893, lng: 127.0329 }

describe('map deep links', () => {
  it('kakaoMapUrl uses map.kakao.com link format', () => {
    const u = new URL(kakaoMapUrl(p))
    expect(u.hostname).toBe('map.kakao.com')
    expect(u.pathname).toContain('/link/map/')
    expect(decodeURIComponent(u.pathname)).toContain('고려대학교 교우회관')
    expect(decodeURIComponent(u.pathname)).toContain('37.5893')
    expect(decodeURIComponent(u.pathname)).toContain('127.0329')
  })

  it('naverMapUrl uses nmap:// scheme with encoded name', () => {
    const url = naverMapUrl(p)
    expect(url.startsWith('nmap://place?')).toBe(true)
    const q = new URLSearchParams(url.split('?')[1])
    expect(q.get('lat')).toBe('37.5893')
    expect(q.get('lng')).toBe('127.0329')
    expect(q.get('name')).toBe('고려대학교 교우회관')
    expect(q.get('appname')).toBe('hong-minji.github.io')
  })

  it('tmapUrl uses tmap:// scheme with goalx/goaly', () => {
    const url = tmapUrl(p)
    expect(url.startsWith('tmap://route?')).toBe(true)
    const q = new URLSearchParams(url.split('?')[1])
    expect(q.get('goalname')).toBe('고려대학교 교우회관')
    expect(q.get('goalx')).toBe('127.0329')
    expect(q.get('goaly')).toBe('37.5893')
  })
})
