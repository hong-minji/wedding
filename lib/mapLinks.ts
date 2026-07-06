export interface Place {
  name: string
  lat: number
  lng: number
}

export function kakaoMapUrl(p: Place): string {
  const seg = encodeURIComponent(`${p.name},${p.lat},${p.lng}`)
  return `https://map.kakao.com/link/map/${seg}`
}

export function naverMapUrl(p: Place): string {
  const q = new URLSearchParams({
    lat: String(p.lat),
    lng: String(p.lng),
    name: p.name,
    appname: 'hong-minji.github.io',
  })
  return `nmap://place?${q.toString()}`
}

export function tmapUrl(p: Place): string {
  const q = new URLSearchParams({
    goalname: p.name,
    goalx: String(p.lng),
    goaly: String(p.lat),
  })
  return `tmap://route?${q.toString()}`
}
