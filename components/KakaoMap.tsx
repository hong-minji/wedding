'use client'
import { useEffect, useRef } from 'react'
import { wedding } from '@/lib/weddingInfo'

const KEY = process.env.NEXT_PUBLIC_KAKAO_KEY ?? ''
const SDK_URL = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KEY}&autoload=false`

interface KakaoNamespace {
  maps: {
    LatLng: new (lat: number, lng: number) => unknown
    Map: new (el: HTMLElement, opts: { center: unknown; level: number }) => unknown
    Marker: new (opts: { position: unknown; map?: unknown }) => {
      setMap: (m: unknown) => void
    }
    load: (cb: () => void) => void
  }
}

declare global {
  interface Window {
    kakao?: KakaoNamespace
  }
}

function loadKakaoMap(): Promise<KakaoNamespace> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('no window'))
    if (window.kakao?.maps) return resolve(window.kakao)

    const existing = document.getElementById('kakao-map-sdk') as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener('load', () => window.kakao?.maps.load(() => resolve(window.kakao!)))
      existing.addEventListener('error', () => reject(new Error('sdk load failed')))
      return
    }

    const s = document.createElement('script')
    s.id = 'kakao-map-sdk'
    s.src = SDK_URL
    s.async = true
    s.onload = () => window.kakao?.maps.load(() => resolve(window.kakao!))
    s.onerror = () => reject(new Error('sdk load failed'))
    document.head.appendChild(s)
  })
}

export function KakaoMap() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    if (!KEY) return

    loadKakaoMap()
      .then(kakao => {
        if (cancelled || !ref.current) return
        const center = new kakao.maps.LatLng(wedding.venue.lat, wedding.venue.lng)
        const map = new kakao.maps.Map(ref.current, { center, level: 3 })
        const marker = new kakao.maps.Marker({ position: center })
        marker.setMap(map)
      })
      .catch(() => {
        // silently fail — Location section still shows address + app buttons
      })

    return () => {
      cancelled = true
    }
  }, [])

  return <div ref={ref} className="w-full h-full" />
}
