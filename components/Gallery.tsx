'use client'
import Image from 'next/image'
import { useState } from 'react'
import { Lightbox } from './Lightbox'
import { galleryPhotos } from '@/lib/photos'

export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16 px-4">
      <p className="mb-6 text-center uppercase text-[13px] tracking-[0.3em] text-[color:var(--text-muted)]" style={{ fontFamily: 'var(--font-lora)' }}>
        Gallery
      </p>
      <div className="grid grid-cols-2 gap-2">
        {galleryPhotos.map((photo, i) => (
          <button
            key={photo.thumb}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="relative aspect-square overflow-hidden focus:outline-none"
            aria-label={`사진 ${i + 1} 크게 보기`}
          >
            <Image
              src={photo.thumb}
              alt={`사진 ${i + 1}`}
              fill
              placeholder="blur"
              blurDataURL={photo.thumbBlur}
              sizes="(max-width: 430px) 50vw, 200px"
              className="object-cover transition duration-500 hover:scale-[1.04]"
            />
          </button>
        ))}
      </div>
      {openIndex !== null && (
        <Lightbox photos={galleryPhotos} startIndex={openIndex} onClose={() => setOpenIndex(null)} />
      )}
    </section>
  )
}
