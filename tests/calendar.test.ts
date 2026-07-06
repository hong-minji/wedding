import { describe, it, expect } from 'vitest'
import { buildGoogleCalendarUrl } from '@/lib/calendar'

describe('buildGoogleCalendarUrl', () => {
  it('creates a Google Calendar TEMPLATE URL with encoded params', () => {
    const url = buildGoogleCalendarUrl({
      title: '홍민지 · 조해창 결혼식',
      startIso: '2026-10-03T17:00:00+09:00',
      endIso: '2026-10-03T19:00:00+09:00',
      details: '초대합니다',
      location: '서울 성북구 종암로 13',
    })
    const u = new URL(url)
    expect(u.origin + u.pathname).toBe('https://calendar.google.com/calendar/render')
    expect(u.searchParams.get('action')).toBe('TEMPLATE')
    expect(u.searchParams.get('text')).toBe('홍민지 · 조해창 결혼식')
    expect(u.searchParams.get('dates')).toBe('20261003T080000Z/20261003T100000Z')
    expect(u.searchParams.get('details')).toBe('초대합니다')
    expect(u.searchParams.get('location')).toBe('서울 성북구 종암로 13')
  })
})
