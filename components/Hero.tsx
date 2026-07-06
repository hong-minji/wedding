import Image from 'next/image'
import { wedding } from '@/lib/weddingInfo'

export function Hero() {
  return (
    <section className="relative w-full h-[100dvh] overflow-hidden">
      <Image
        src="/photos/main.png"
        alt="홍민지 조해창"
        fill
        priority
        sizes="(max-width: 430px) 100vw, 430px"
        className="object-cover grayscale"
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1/4"
        style={{
          background: 'linear-gradient(to top, rgba(31,31,31,0) 0%, rgba(31,31,31,0.7) 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      <div className="absolute inset-x-0 top-12 flex flex-col items-center text-center">
        <p className="uppercase text-[12px] tracking-[0.35em] text-[color:var(--text-primary)]" style={{ fontFamily: 'var(--font-lora)' }}>
          The Wedding of
        </p>
        <p className="mt-3 text-[14px] text-[color:var(--text-primary)]">
          {wedding.bride.name} · {wedding.groom.name}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-10 flex flex-col items-center text-center">
        <p className="text-[32px] leading-tight text-[color:var(--text-primary)]" style={{ fontFamily: 'var(--font-lora)' }}>
          {wedding.date.display}
        </p>
        <p className="mt-2 text-[13px] text-[color:var(--text-muted)]">
          {wedding.venue.name}
        </p>
      </div>
    </section>
  )
}
