import Image from 'next/image'
import { wedding } from '@/lib/weddingInfo'
import { kakaoMapUrl, naverMapUrl, tmapUrl } from '@/lib/mapLinks'

export function Location() {
  const place = {
    name: wedding.venue.name,
    lat: wedding.venue.lat,
    lng: wedding.venue.lng,
  }

  return (
    <section className="py-16 px-4">
      <p className="mb-6 text-center uppercase text-[13px] tracking-[0.3em] text-[color:var(--text-muted)]" style={{ fontFamily: 'var(--font-lora)' }}>
        Location
      </p>

      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-md border border-[color:var(--card-border)] bg-[color:var(--card-bg)]">
        <Image
          src="/photos/static-map.png"
          alt="예식장 위치 지도"
          fill
          sizes="(max-width: 430px) 100vw, 430px"
          className="object-cover"
        />
      </div>

      <div className="mt-6 text-center">
        <p className="text-[15px] text-[color:var(--text-primary)]">{wedding.venue.name}</p>
        <p className="mt-1 text-[13px] text-[color:var(--text-muted)]">
          {wedding.venue.address} {wedding.venue.addressDetail}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        <a
          href={kakaoMapUrl(place)}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-white/20 py-2 text-center text-[12px] text-[color:var(--text-primary)] hover:bg-white/5 transition"
        >
          카카오맵
        </a>
        <a
          href={naverMapUrl(place)}
          className="rounded-md border border-white/20 py-2 text-center text-[12px] text-[color:var(--text-primary)] hover:bg-white/5 transition"
        >
          네이버지도
        </a>
        <a
          href={tmapUrl(place)}
          className="rounded-md border border-white/20 py-2 text-center text-[12px] text-[color:var(--text-primary)] hover:bg-white/5 transition"
        >
          T맵
        </a>
      </div>

      <div className="mt-8 space-y-4 text-[13px] text-[color:var(--text-muted)] leading-relaxed">
        <div>
          <p className="text-[color:var(--text-primary)] text-[13px]">지하철</p>
          <p className="mt-1">{wedding.venue.subway}</p>
        </div>
        <div>
          <p className="text-[color:var(--text-primary)] text-[13px]">자가용</p>
          <p className="mt-1">{wedding.venue.car}</p>
        </div>
      </div>
    </section>
  )
}
