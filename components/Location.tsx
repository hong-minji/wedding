'use client'
import { useState } from 'react'
import { wedding } from '@/lib/weddingInfo'
import { copyText } from '@/lib/copy'
import { KakaoMap } from './KakaoMap'
import { Toast } from './Toast'

export function Location() {
  const [toast, setToast] = useState<string | null>(null)

  const onCopyAddress = async () => {
    const ok = await copyText(wedding.venue.address)
    setToast(ok ? '주소가 복사되었어요' : '복사에 실패했어요')
  }

  return (
    <section className="py-16 px-4">
      <p className="mb-6 text-center uppercase text-[13px] tracking-[0.3em] text-[color:var(--text-muted)]" style={{ fontFamily: 'var(--font-lora)' }}>
        Location
      </p>

      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-md border border-[color:var(--card-border)] bg-[color:var(--card-bg)] grayscale">
        <KakaoMap />
      </div>

      <div className="mt-6 text-center">
        <p className="text-[15px] text-[color:var(--text-primary)]">{wedding.venue.name}</p>
        <p className="mt-1 text-[13px] text-[color:var(--text-muted)]">
          {wedding.venue.address}
        </p>
        <button
          type="button"
          onClick={onCopyAddress}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 text-[11px] text-[color:var(--text-muted)] hover:bg-white/5 transition"
        >
          주소 복사
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <a
          href={wedding.venue.kakaoMapLink}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-white/20 py-2 text-center text-[12px] text-[color:var(--text-primary)] hover:bg-white/5 transition"
        >
          카카오맵
        </a>
        <a
          href={wedding.venue.naverMapLink}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-white/20 py-2 text-center text-[12px] text-[color:var(--text-primary)] hover:bg-white/5 transition"
        >
          네이버지도
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

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </section>
  )
}
