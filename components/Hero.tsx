import Image from 'next/image'
import { wedding } from '@/lib/weddingInfo'

export function Hero() {
  return (
    <section className="relative flex flex-col items-center pt-16 pb-8 text-center">
      <p className="uppercase text-[12px] tracking-[0.35em] text-[color:var(--text-muted)]" style={{ fontFamily: 'var(--font-lora)' }}>
        The Wedding of
      </p>
      <p className="mt-3 text-[14px] text-[color:var(--text-primary)]">
        {wedding.bride.name} · {wedding.groom.name}
      </p>

      <div className="relative mt-8 w-full aspect-[3/4] overflow-hidden">
        <Image
          src="/photos/main.png"
          alt="홍민지 조해창"
          fill
          priority
          sizes="(max-width: 430px) 100vw, 430px"
          className="object-cover grayscale"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background: 'linear-gradient(to bottom, rgba(31,31,31,0) 0%, rgba(31,31,31,0.9) 100%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-6 flex flex-col items-center text-center">
          <p className="text-[28px] leading-tight text-[color:var(--text-primary)]" style={{ fontFamily: 'var(--font-lora)' }}>
            {wedding.date.display}
          </p>
          <p className="mt-1 text-[13px] text-[color:var(--text-muted)]">
            {wedding.venue.name}
          </p>
        </div>
      </div>
    </section>
  )
}
