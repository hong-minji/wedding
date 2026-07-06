'use client'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface Props {
  photos: string[]
  startIndex: number
  onClose: () => void
}

export function Lightbox({ photos, startIndex, onClose }: Props) {
  const [index, setIndex] = useState(startIndex)
  const startX = useRef<number | null>(null)

  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setIndex(i => (i - 1 + photos.length) % photos.length)
      if (e.key === 'ArrowRight') setIndex(i => (i + 1) % photos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = original
      window.removeEventListener('keydown', onKey)
    }
  }, [photos.length, onClose])

  const next = () => setIndex(i => (i + 1) % photos.length)
  const prev = () => setIndex(i => (i - 1 + photos.length) % photos.length)

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return
    const dx = e.changedTouches[0].clientX - startX.current
    if (Math.abs(dx) > 40) (dx > 0 ? prev : next)()
    startX.current = null
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
    >
      <div className="relative h-full w-full" onClick={e => e.stopPropagation()}>
        <Image
          key={photos[index]}
          src={photos[index]}
          alt={`사진 ${index + 1}`}
          fill
          sizes="100vw"
          className="object-contain"
        />
        <button
          aria-label="닫기"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-white text-sm"
        >
          ✕
        </button>
        <button
          aria-label="이전"
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white"
        >
          ‹
        </button>
        <button
          aria-label="다음"
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-white"
        >
          ›
        </button>
        <p className="absolute bottom-6 left-0 right-0 text-center text-white/70 text-xs">
          {index + 1} / {photos.length}
        </p>
      </div>
    </div>
  )
}
