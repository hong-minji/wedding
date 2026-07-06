'use client'
import Image from 'next/image'
import { useState } from 'react'
import { Lightbox } from './Lightbox'

const PHOTOS = [
  '/photos/photo-01.png',
  '/photos/photo-02.png',
  '/photos/photo-03.png',
  '/photos/photo-04.png',
  '/photos/photo-05.png',
  '/photos/photo-06.png',
  '/photos/photo-07.png',
]

export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16 px-4">
      <p className="mb-6 text-center uppercase text-[13px] tracking-[0.3em] text-[color:var(--text-muted)]" style={{ fontFamily: 'var(--font-lora)' }}>
        Gallery
      </p>
      <div className="grid grid-cols-2 gap-2">
        {PHOTOS.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="relative aspect-square overflow-hidden focus:outline-none"
            aria-label={`사진 ${i + 1} 크게 보기`}
          >
            <Image
              src={src}
              alt={`사진 ${i + 1}`}
              fill
              sizes="(max-width: 430px) 50vw, 200px"
              className="object-cover grayscale hover:grayscale-0 transition"
            />
          </button>
        ))}
      </div>
      {openIndex !== null && (
        <Lightbox photos={PHOTOS} startIndex={openIndex} onClose={() => setOpenIndex(null)} />
      )}
    </section>
  )
}
