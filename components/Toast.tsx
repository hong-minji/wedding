'use client'
import { useEffect } from 'react'

interface Props {
  message: string
  onDone: () => void
  duration?: number
}

export function Toast({ message, onDone, duration = 2000 }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, duration)
    return () => clearTimeout(t)
  }, [duration, onDone])

  return (
    <div
      role="status"
      className="pointer-events-none fixed bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-[color:var(--text-primary)] px-4 py-2 text-[12px] text-white shadow-lg z-50"
    >
      {message}
    </div>
  )
}
