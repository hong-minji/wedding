export interface GoogleCalendarInput {
  title: string
  startIso: string
  endIso: string
  details: string
  location: string
}

function toUtcCompact(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  )
}

export function buildGoogleCalendarUrl(input: GoogleCalendarInput): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: input.title,
    dates: `${toUtcCompact(input.startIso)}/${toUtcCompact(input.endIso)}`,
    details: input.details,
    location: input.location,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
