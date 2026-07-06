'use client'
import { useState } from 'react'
import { wedding } from '@/lib/weddingInfo'
import { copyText } from '@/lib/copy'
import { shareToKakao } from '@/lib/kakao'
import { Toast } from './Toast'

export function Share() {
  const [toast, setToast] = useState<string | null>(null)

  const onKakao = async () => {
    const ok = await shareToKakao({
      title: `${wedding.bride.name} · ${wedding.groom.name} 결혼합니다`,
      description: `${wedding.date.display} · ${wedding.venue.name}`,
      imageUrl: `${wedding.url}opengraph-image.png`,
      linkUrl: wedding.url,
    })
    if (!ok) setToast('카카오톡 공유를 사용할 수 없어요')
  }

  const onCopyLink = async () => {
    const ok = await copyText(wedding.url)
    setToast(ok ? '링크가 복사되었어요' : '복사에 실패했어요')
  }

  return (
    <section className="py-16 px-4 pb-24">
      <p className="mb-6 text-center uppercase text-[13px] tracking-[0.3em] text-[color:var(--text-muted)]" style={{ fontFamily: 'var(--font-lora)' }}>
        Share
      </p>
      <div className="space-y-3">
        <button
          type="button"
          onClick={onKakao}
          className="w-full rounded-md bg-[#FEE500] py-3 text-[13px] font-medium text-[#191600]"
        >
          카카오톡으로 공유하기
        </button>
        <button
          type="button"
          onClick={onCopyLink}
          className="w-full rounded-md border border-white/25 py-3 text-[13px] text-[color:var(--text-primary)] hover:bg-white/5"
        >
          링크 복사
        </button>
      </div>
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </section>
  )
}
