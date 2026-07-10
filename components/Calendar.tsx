'use client'
import { useEffect, useState } from 'react'
import { wedding } from '@/lib/weddingInfo'
import { buildGoogleCalendarUrl } from '@/lib/calendar'

const WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function buildMonthGrid(year: number, month: number): (number | null)[] {
  const first = new Date(year, month - 1, 1).getDay()
  const days = new Date(year, month, 0).getDate()
  const cells: (number | null)[] = Array(first).fill(null)
  for (let d = 1; d <= days; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export function Calendar() {
  const [dday, setDday] = useState<number | null>(null)

  useEffect(() => {
    const nowKst = new Date(Date.now() + 9 * 60 * 60 * 1000)
    const todayUtc = Date.UTC(nowKst.getUTCFullYear(), nowKst.getUTCMonth(), nowKst.getUTCDate())
    const targetUtc = Date.UTC(2026, 9, 3)
    setDday(Math.round((targetUtc - todayUtc) / 86400000))
  }, [])

  const cells = buildMonthGrid(2026, 10)
  const gcalUrl = buildGoogleCalendarUrl({
    title: `${wedding.bride.name} · ${wedding.groom.name} 결혼식`,
    startIso: wedding.date.iso,
    endIso: wedding.date.endIso,
    details: `${wedding.bride.name} · ${wedding.groom.name}의 결혼식에 초대합니다.`,
    location: `${wedding.venue.address} ${wedding.venue.name}`,
  })

  let ddayText = ''
  if (dday !== null) {
    if (dday > 0) ddayText = `${wedding.groom.name} ♥ ${wedding.bride.name}의 결혼식이 ${dday}일 남았습니다`
    else if (dday === 0) ddayText = '오늘은 저희의 결혼식입니다'
    else ddayText = '결혼했습니다'
  }

  return (
    <section className="py-16 flex flex-col items-center px-6">
      <p className="uppercase text-[13px] tracking-[0.3em] text-[color:var(--text-muted)]" style={{ fontFamily: 'var(--font-lora)' }}>
        October 2026
      </p>
      <p className="mt-1 text-[15px] text-[color:var(--text-primary)]">{wedding.date.dayLabel}</p>

      <div className="mt-8 w-full max-w-[320px] grid grid-cols-7 gap-y-2 text-center">
        {WEEK.map((w, i) => (
          <div key={i} className="text-[11px] text-[color:var(--text-subtle)] pb-2" style={{ fontFamily: 'var(--font-lora)' }}>
            {w}
          </div>
        ))}
        {cells.map((d, i) => {
          const isTarget = d === 3
          return (
            <div key={i} className="flex items-center justify-center h-9">
              {d === null ? null : (
                <span
                  className={
                    isTarget
                      ? 'flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-[color:var(--text-primary)] text-[13px]'
                      : 'text-[13px] text-[color:var(--text-muted)]'
                  }
                >
                  {d}
                </span>
              )}
            </div>
          )
        })}
      </div>

      <p className="mt-6 min-h-[20px] text-[12px] text-[color:var(--text-muted)]">{ddayText}</p>

      <a
        href={gcalUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-6 rounded-full border border-white/25 px-5 py-2 text-[12px] tracking-wide text-[color:var(--text-primary)] hover:bg-white/5 transition"
      >
        구글 캘린더에 추가
      </a>
    </section>
  )
}
