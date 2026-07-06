# 모바일 청첩장 구현 플랜

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 참고 시안 기반 다크 톤 모바일 청첩장을 Next.js 정적 사이트로 만들어 GitHub Pages에 자동 배포한다.

**Architecture:** Next.js 15 App Router + TypeScript + Tailwind CSS. `output: 'export'`로 정적 빌드 → `out/` → GitHub Actions로 Pages 배포. 단일 스크롤 페이지, 클라이언트 컴포넌트로 인터랙션 처리, 순수 함수는 TDD.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, next/font/local, Kakao SDK, Playwright (스모크), Vitest (유닛).

**Spec:** `docs/superpowers/specs/2026-07-07-mobile-wedding-invitation-design.md`

---

## 파일 구조

```
app/
  layout.tsx              # 폰트, 메타, 전역 배경, Kakao Script
  page.tsx                # 단일 스크롤 조립
  opengraph-image.tsx     # 빌드 타임 OG 이미지
  globals.css             # Tailwind + CSS 변수
components/
  Hero.tsx
  Parents.tsx
  Calendar.tsx
  Gallery.tsx
  Lightbox.tsx
  Location.tsx
  Account.tsx
  Toast.tsx
  Share.tsx
lib/
  weddingInfo.ts          # 이름·일시·장소·계좌 상수
  calendar.ts             # 구글 캘린더 URL
  mapLinks.ts             # 지도 앱 딥링크
  copy.ts                 # 클립보드
  kakao.ts                # SDK 초기화·공유
tests/
  calendar.test.ts
  mapLinks.test.ts
  smoke.spec.ts           # Playwright
public/
  photos/                 # main.png, photo_01~07.png, meta-image.png, static-map.png
  fonts/Lora/*.ttf
  fonts/Pretendard/*.woff2
.github/workflows/deploy.yml
next.config.mjs
tailwind.config.ts
postcss.config.mjs
tsconfig.json
package.json
playwright.config.ts
vitest.config.ts
```

---

## Task 1: 프로젝트 초기화 & Git 저장소

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.gitignore`

- [ ] **Step 1: Next.js 프로젝트 스캐폴딩**

작업 디렉토리에서 실행 (기존 파일들과 병합):

```bash
cd "/Users/minji/Documents/모바일 청첩장"
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --use-npm --no-eslint --turbopack
```

프롬프트에서 "would you like to install in a non-empty directory?" → Yes.

- [ ] **Step 2: 불필요 파일 제거 & 기본 페이지 리셋**

```bash
rm -f app/favicon.ico public/*.svg
```

`app/page.tsx` 를 다음으로 교체:

```tsx
export default function Home() {
  return <main className="min-h-dvh" />
}
```

`app/globals.css` 는 다음으로 교체:

```css
@import "tailwindcss";

:root {
  --bg-top: #313131;
  --bg-bottom: #000000;
  --text-primary: #F5F1EA;
  --text-muted: rgba(245, 241, 234, 0.60);
  --text-subtle: rgba(245, 241, 234, 0.40);
  --divider: rgba(255, 255, 255, 0.12);
  --card-bg: rgba(255, 255, 255, 0.05);
  --card-border: rgba(255, 255, 255, 0.10);
  --accent-kakao: #FEE500;
}

html, body {
  background: linear-gradient(to bottom, var(--bg-top) 0%, var(--bg-bottom) 100%);
  background-attachment: fixed;
  color: var(--text-primary);
  min-height: 100dvh;
}
```

- [ ] **Step 3: Git 초기화**

```bash
git init
git branch -M main
```

`.gitignore` 는 create-next-app이 생성한 것 유지. 다음을 추가:

```
# spec/plan 저장소
!docs/
# macOS
.DS_Store
```

- [ ] **Step 4: 빌드 확인**

```bash
npm run build
```

성공하면 `out/` 대신 `.next/` 가 생김 (아직 export 설정 전). 에러 없이 종료되면 통과.

- [ ] **Step 5: 커밋**

```bash
git add -A
git commit -m "chore: scaffold Next.js project with Tailwind"
```

---

## Task 2: 로컬 폰트 & 이미지 자산 배치

**Files:**
- Move: `font/` → `public/fonts/` (또는 프로젝트 폰트 로딩 위치)
- Move: `photo/` → `public/photos/`
- Create: `lib/fonts.ts`

- [ ] **Step 1: 자산 이동**

```bash
mkdir -p public/photos public/fonts
mv photo/*.png public/photos/
# meta image.png는 공백 제거
mv "public/photos/meta image.png" public/photos/meta-image.png
cp -r font/Lora public/fonts/Lora
cp -r font/Pretendard public/fonts/Pretendard
ls public/fonts/Lora public/fonts/Pretendard
```

폰트 파일명을 확인해서 다음 스텝에서 정확히 참조할 수 있게 한다.

- [ ] **Step 2: 폰트 로더 작성**

`lib/fonts.ts`:

```ts
import localFont from 'next/font/local'

export const lora = localFont({
  src: [
    { path: '../public/fonts/Lora/Lora-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/Lora/Lora-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../public/fonts/Lora/Lora-SemiBold.ttf', weight: '600', style: 'normal' },
  ],
  variable: '--font-lora',
  display: 'swap',
})

export const pretendard = localFont({
  src: [
    { path: '../public/fonts/Pretendard/Pretendard-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/Pretendard/Pretendard-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/Pretendard/Pretendard-SemiBold.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-pretendard',
  display: 'swap',
})
```

주의: `ls public/fonts/*` 결과가 위 파일명과 다르면 실제 파일명에 맞춰 수정. 없는 weight는 삭제.

- [ ] **Step 3: layout.tsx 에서 폰트 변수 적용**

`app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { lora, pretendard } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: '홍민지 · 조해창 결혼합니다',
  description: '2026. 10. 3. SAT 5PM · 고려대학교 교우회관',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${lora.variable} ${pretendard.variable}`}>
      <body className="font-[var(--font-pretendard)] antialiased">{children}</body>
    </html>
  )
}
```

`app/globals.css` 하단에 폰트 유틸리티 추가:

```css
@theme {
  --font-lora: var(--font-lora);
  --font-pretendard: var(--font-pretendard);
}
```

- [ ] **Step 4: 빌드 확인**

```bash
npm run build
```

폰트 로딩 관련 에러 없어야 함. 에러 시 파일명/경로 수정 후 재시도.

- [ ] **Step 5: 커밋**

```bash
git add -A
git commit -m "chore: add local fonts and photo assets"
```

원본 `font/`, `photo/`, `info.md`, `처음.pdf` 는 그대로 두거나 삭제(선택). 삭제 시 `git rm -rf font photo && rm info.md 처음.pdf` (플랜에는 남기고 커밋만).

---

## Task 3: 결혼식 정보 상수 (`lib/weddingInfo.ts`)

**Files:**
- Create: `lib/weddingInfo.ts`

- [ ] **Step 1: 상수 파일 작성**

```ts
// lib/weddingInfo.ts
export const wedding = {
  groom: {
    name: '조해창',
    father: '조수현',
    mother: '김보영',
    account: { bank: '국민은행', number: '021902-04-127492', holder: '조해창' },
  },
  bride: {
    name: '홍민지',
    father: '홍영권',
    mother: '김계열',
    account: { bank: '국민은행', number: '032902-04-260074', holder: '홍민지' },
  },
  date: {
    iso: '2026-10-03T17:00:00+09:00',
    endIso: '2026-10-03T19:00:00+09:00',
    display: '2026.10.03 SAT 5PM',
    dayLabel: '2026년 10월 3일 토요일 오후 5시',
  },
  venue: {
    name: '고려대학교 교우회관',
    address: '서울 성북구 종암로 13',
    addressDetail: '(종암동 29-26)',
    lat: 37.5893,   // TODO Task 8에서 카카오맵 좌표 조회 후 확정
    lng: 127.0329,
    subway: '6호선 고려대역 2번 출구 → 도보 5~7분 직진 (스타벅스 종암DT점 인근)',
    car: '내비 "종암로 13" 검색 · 건물 내 주차장 400대 이상',
  },
  url: 'https://hong-minji.github.io/wedding/',
} as const
```

정확한 위경도는 Task 8(Location)에서 확정. 우선 대략 좌표로 진행.

- [ ] **Step 2: 커밋**

```bash
git add lib/weddingInfo.ts
git commit -m "feat: add wedding info constants"
```

---

## Task 4: 구글 캘린더 URL 생성 (`lib/calendar.ts`, TDD)

**Files:**
- Create: `lib/calendar.ts`, `tests/calendar.test.ts`, `vitest.config.ts`

- [ ] **Step 1: Vitest 설치**

```bash
npm i -D vitest
```

`vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
})
```

`package.json` 의 `scripts` 에 추가:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 2: 실패 테스트 작성**

`tests/calendar.test.ts`:

```ts
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
```

- [ ] **Step 3: 테스트 실패 확인**

```bash
npm test
```

Expected: FAIL — `Failed to resolve import "@/lib/calendar"`.

- [ ] **Step 4: 최소 구현**

`lib/calendar.ts`:

```ts
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
```

- [ ] **Step 5: 테스트 통과 확인**

```bash
npm test
```

Expected: PASS.

`tsconfig.json` 에 `paths` 가 `@/*` 로 매핑되어 있는지 확인. Vitest가 이 alias를 못 읽으면 `vitest.config.ts`에 alias 추가:

```ts
import path from 'node:path'
// ...
resolve: { alias: { '@': path.resolve(__dirname, '.') } },
```

- [ ] **Step 6: 커밋**

```bash
git add -A
git commit -m "feat(lib): buildGoogleCalendarUrl with tests"
```

---

## Task 5: 지도 앱 딥링크 (`lib/mapLinks.ts`, TDD)

**Files:**
- Create: `lib/mapLinks.ts`, `tests/mapLinks.test.ts`

- [ ] **Step 1: 실패 테스트 작성**

`tests/mapLinks.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { kakaoMapUrl, naverMapUrl, tmapUrl } from '@/lib/mapLinks'

const p = { name: '고려대학교 교우회관', lat: 37.5893, lng: 127.0329 }

describe('map deep links', () => {
  it('kakaoMapUrl uses map.kakao.com link format', () => {
    const u = new URL(kakaoMapUrl(p))
    expect(u.hostname).toBe('map.kakao.com')
    expect(u.pathname).toContain('/link/map/')
    expect(decodeURIComponent(u.pathname)).toContain('고려대학교 교우회관')
    expect(decodeURIComponent(u.pathname)).toContain('37.5893')
    expect(decodeURIComponent(u.pathname)).toContain('127.0329')
  })

  it('naverMapUrl uses nmap:// scheme with encoded name', () => {
    const url = naverMapUrl(p)
    expect(url.startsWith('nmap://place?')).toBe(true)
    const q = new URLSearchParams(url.split('?')[1])
    expect(q.get('lat')).toBe('37.5893')
    expect(q.get('lng')).toBe('127.0329')
    expect(q.get('name')).toBe('고려대학교 교우회관')
    expect(q.get('appname')).toBe('hong-minji.github.io')
  })

  it('tmapUrl uses tmap:// scheme with goalx/goaly', () => {
    const url = tmapUrl(p)
    expect(url.startsWith('tmap://route?')).toBe(true)
    const q = new URLSearchParams(url.split('?')[1])
    expect(q.get('goalname')).toBe('고려대학교 교우회관')
    expect(q.get('goalx')).toBe('127.0329')
    expect(q.get('goaly')).toBe('37.5893')
  })
})
```

- [ ] **Step 2: 실패 확인**

```bash
npm test
```

Expected: FAIL — module not found.

- [ ] **Step 3: 구현**

`lib/mapLinks.ts`:

```ts
export interface Place {
  name: string
  lat: number
  lng: number
}

export function kakaoMapUrl(p: Place): string {
  // 웹 대체 URL (kakaomap:// 대신 항상 열리는 링크 사용)
  const seg = encodeURIComponent(`${p.name},${p.lat},${p.lng}`)
  return `https://map.kakao.com/link/map/${seg}`
}

export function naverMapUrl(p: Place): string {
  const q = new URLSearchParams({
    lat: String(p.lat),
    lng: String(p.lng),
    name: p.name,
    appname: 'hong-minji.github.io',
  })
  return `nmap://place?${q.toString()}`
}

export function tmapUrl(p: Place): string {
  const q = new URLSearchParams({
    goalname: p.name,
    goalx: String(p.lng),
    goaly: String(p.lat),
  })
  return `tmap://route?${q.toString()}`
}
```

- [ ] **Step 4: 통과 확인**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 5: 커밋**

```bash
git add -A
git commit -m "feat(lib): map deep links for Kakao/Naver/T map"
```

---

## Task 6: 클립보드 유틸 (`lib/copy.ts`)

**Files:**
- Create: `lib/copy.ts`

- [ ] **Step 1: 구현**

`lib/copy.ts`:

```ts
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fall through to legacy
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.focus()
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}
```

- [ ] **Step 2: 커밋**

```bash
git add lib/copy.ts
git commit -m "feat(lib): clipboard copy with execCommand fallback"
```

---

## Task 7: Hero 컴포넌트

**Files:**
- Create: `components/Hero.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Hero 컴포넌트 작성**

`components/Hero.tsx`:

```tsx
import Image from 'next/image'
import { wedding } from '@/lib/weddingInfo'

export function Hero() {
  return (
    <section className="relative flex flex-col items-center pt-16 pb-8 text-center">
      <p className="font-[var(--font-lora)] text-[12px] tracking-[0.35em] text-[color:var(--text-muted)] uppercase">
        The Wedding of
      </p>
      <p className="mt-3 font-[var(--font-pretendard)] text-[14px] text-[color:var(--text-primary)]">
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
            background: 'linear-gradient(to bottom, rgba(49,49,49,0) 0%, rgba(49,49,49,0.85) 100%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-6 flex flex-col items-center text-center">
          <p className="font-[var(--font-lora)] text-[28px] leading-tight text-[color:var(--text-primary)]">
            {wedding.date.display}
          </p>
          <p className="mt-1 font-[var(--font-pretendard)] text-[13px] text-[color:var(--text-muted)]">
            {wedding.venue.name}
          </p>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: page.tsx에 임시 연결**

```tsx
// app/page.tsx
import { Hero } from '@/components/Hero'

export default function Home() {
  return (
    <main className="mx-auto max-w-[430px] min-h-dvh">
      <Hero />
    </main>
  )
}
```

- [ ] **Step 3: 개발 서버로 시각 확인**

```bash
npm run dev
```

브라우저 http://localhost:3000 열고 폰 사이즈로 확인. 이미지가 흑백으로 뜨고, 하단 페이드 위에 날짜/장소 오버레이 보이면 통과. 서버 종료.

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "feat(ui): Hero section"
```

---

## Task 8: Parents 컴포넌트 + 정확한 위경도 확정

**Files:**
- Create: `components/Parents.tsx`
- Modify: `lib/weddingInfo.ts`
- Modify: `app/page.tsx`

- [ ] **Step 1: 위경도 확정**

브라우저에서 https://map.kakao.com 에 "고려대학교 교우회관" 검색. 상세 페이지 URL 또는 좌표 조회에서 위경도 획득. 소수점 6자리까지 `lib/weddingInfo.ts` 의 `venue.lat`, `venue.lng` 갱신.

주의: 사용자가 확인해야 하는 값. 이 시점에 정확 좌표로 교체.

- [ ] **Step 2: Parents 컴포넌트 작성**

`components/Parents.tsx`:

```tsx
import { wedding } from '@/lib/weddingInfo'

export function Parents() {
  const cell = (side: '신랑' | '신부', father: string, mother: string, child: string) => (
    <div className="flex-1 flex flex-col items-center gap-2 px-4">
      <span className="font-[var(--font-lora)] text-[11px] tracking-[0.3em] uppercase text-[color:var(--text-subtle)]">
        {side === '신랑' ? 'Groom' : 'Bride'}
      </span>
      <p className="text-[13px] text-[color:var(--text-muted)] leading-relaxed text-center">
        {father} · {mother}
      </p>
      <p className="text-[12px] text-[color:var(--text-subtle)]">
        의 {side === '신랑' ? '아들' : '딸'}
      </p>
      <p className="text-[15px] text-[color:var(--text-primary)]">{child}</p>
    </div>
  )

  return (
    <section className="py-16">
      <div className="flex items-stretch">
        {cell('신랑', wedding.groom.father, wedding.groom.mother, wedding.groom.name)}
        <div className="w-px bg-[color:var(--divider)]" />
        {cell('신부', wedding.bride.father, wedding.bride.mother, wedding.bride.name)}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: page.tsx에 연결**

```tsx
import { Hero } from '@/components/Hero'
import { Parents } from '@/components/Parents'

export default function Home() {
  return (
    <main className="mx-auto max-w-[430px] min-h-dvh">
      <Hero />
      <Parents />
    </main>
  )
}
```

- [ ] **Step 4: 시각 확인 & 커밋**

```bash
npm run dev
# 확인 후 종료
git add -A
git commit -m "feat(ui): Parents section and confirm venue coordinates"
```

---

## Task 9: Calendar 컴포넌트 (D-day + 구글 캘린더 추가)

**Files:**
- Create: `components/Calendar.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Calendar 컴포넌트 작성**

`components/Calendar.tsx`:

```tsx
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
    const target = new Date(wedding.date.iso).getTime()
    const now = Date.now()
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24))
    setDday(diff)
  }, [])

  const cells = buildMonthGrid(2026, 10)
  const gcalUrl = buildGoogleCalendarUrl({
    title: `${wedding.bride.name} · ${wedding.groom.name} 결혼식`,
    startIso: wedding.date.iso,
    endIso: wedding.date.endIso,
    details: `${wedding.bride.name} · ${wedding.groom.name}의 결혼식에 초대합니다.`,
    location: `${wedding.venue.address} ${wedding.venue.name}`,
  })

  return (
    <section className="py-16 flex flex-col items-center px-6">
      <p className="font-[var(--font-lora)] text-[13px] tracking-[0.3em] uppercase text-[color:var(--text-muted)]">
        October 2026
      </p>
      <p className="mt-1 text-[15px] text-[color:var(--text-primary)]">{wedding.date.dayLabel}</p>

      <div className="mt-8 w-full max-w-[320px] grid grid-cols-7 gap-y-2 text-center">
        {WEEK.map((w, i) => (
          <div key={i} className="font-[var(--font-lora)] text-[11px] text-[color:var(--text-subtle)] pb-2">
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

      <p className="mt-6 min-h-[20px] text-[12px] text-[color:var(--text-muted)]">
        {dday === null
          ? ''
          : dday > 0
            ? `${wedding.groom.name} ♥ ${wedding.bride.name}의 결혼식이 ${dday}일 남았습니다`
            : dday === 0
              ? '오늘은 저희의 결혼식입니다'
              : '결혼했습니다'}
      </p>

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
```

- [ ] **Step 2: page.tsx에 연결 + 시각 확인**

```tsx
<Calendar />
```

`npm run dev` 로 3일 하이라이트, D-day 카운터, 구글 캘린더 링크 클릭 시 새 탭 열림 확인.

- [ ] **Step 3: 커밋**

```bash
git add -A
git commit -m "feat(ui): Calendar with D-day and Google Calendar link"
```

---

## Task 10: Gallery 그리드

**Files:**
- Create: `components/Gallery.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Gallery 컴포넌트 작성**

`components/Gallery.tsx`:

```tsx
'use client'
import Image from 'next/image'
import { useState } from 'react'
import { Lightbox } from './Lightbox'

const PHOTOS = [
  '/photos/photo_01.png',
  '/photos/photo_02.png',
  '/photos/photo_03.png',
  '/photos/photo_04.png',
  '/photos/photo_05.png',
  '/photos/photo_06.png',
  '/photos/photo_07.png',
]

export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16 px-4">
      <p className="mb-6 text-center font-[var(--font-lora)] text-[13px] tracking-[0.3em] uppercase text-[color:var(--text-muted)]">
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
```

- [ ] **Step 2: Lightbox 스텁 (다음 Task에서 완성)**

임시 스텁 `components/Lightbox.tsx`:

```tsx
'use client'
export function Lightbox({ onClose }: { photos: string[]; startIndex: number; onClose: () => void }) {
  return <div onClick={onClose} className="fixed inset-0 bg-black/90 z-50" />
}
```

- [ ] **Step 3: 시각 확인 & 커밋**

```bash
npm run dev
```

2열 그리드, 클릭 시 검은 오버레이. 커밋:

```bash
git add -A
git commit -m "feat(ui): Gallery grid with lightbox stub"
```

---

## Task 11: Lightbox (스와이프 · 키보드)

**Files:**
- Modify: `components/Lightbox.tsx`

- [ ] **Step 1: Lightbox 완성**

```tsx
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
```

- [ ] **Step 2: 시각 확인**

```bash
npm run dev
```

- 사진 클릭 시 오픈
- 좌/우 화살표 버튼, 키보드, 스와이프 동작
- ESC 및 오버레이 탭으로 닫힘
- body 스크롤 잠금

- [ ] **Step 3: 커밋**

```bash
git add components/Lightbox.tsx
git commit -m "feat(ui): Lightbox with swipe and keyboard navigation"
```

---

## Task 12: 정적 지도 이미지 준비 & Location 컴포넌트

**Files:**
- Add: `public/photos/static-map.png`
- Create: `components/Location.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: 정적 지도 이미지 준비**

사용자 작업: 카카오맵/네이버지도에서 고려대학교 교우회관 위치를 캡처하여 `public/photos/static-map.png` 로 저장. 권장 크기 800×500, 다크 톤이면 더 좋음.

- [ ] **Step 2: Location 컴포넌트 작성**

`components/Location.tsx`:

```tsx
import Image from 'next/image'
import { wedding } from '@/lib/weddingInfo'
import { kakaoMapUrl, naverMapUrl, tmapUrl } from '@/lib/mapLinks'

export function Location() {
  const place = {
    name: wedding.venue.name,
    lat: wedding.venue.lat,
    lng: wedding.venue.lng,
  }

  return (
    <section className="py-16 px-4">
      <p className="mb-6 text-center font-[var(--font-lora)] text-[13px] tracking-[0.3em] uppercase text-[color:var(--text-muted)]">
        Location
      </p>

      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-md border border-[color:var(--card-border)]">
        <Image
          src="/photos/static-map.png"
          alt="예식장 위치 지도"
          fill
          sizes="(max-width: 430px) 100vw, 430px"
          className="object-cover"
        />
      </div>

      <div className="mt-6 text-center">
        <p className="text-[15px] text-[color:var(--text-primary)]">{wedding.venue.name}</p>
        <p className="mt-1 text-[13px] text-[color:var(--text-muted)]">
          {wedding.venue.address} {wedding.venue.addressDetail}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        <a
          href={kakaoMapUrl(place)}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-white/20 py-2 text-center text-[12px] text-[color:var(--text-primary)] hover:bg-white/5"
        >
          카카오맵
        </a>
        <a
          href={naverMapUrl(place)}
          className="rounded-md border border-white/20 py-2 text-center text-[12px] text-[color:var(--text-primary)] hover:bg-white/5"
        >
          네이버지도
        </a>
        <a
          href={tmapUrl(place)}
          className="rounded-md border border-white/20 py-2 text-center text-[12px] text-[color:var(--text-primary)] hover:bg-white/5"
        >
          T맵
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
    </section>
  )
}
```

- [ ] **Step 3: 시각 확인 & 커밋**

```bash
npm run dev
# 지도 이미지, 앱 버튼, 지하철·자가용 안내 확인
git add -A
git commit -m "feat(ui): Location section with static map and app deep links"
```

---

## Task 13: Toast + Account (계좌 복사)

**Files:**
- Create: `components/Toast.tsx`, `components/Account.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Toast 컴포넌트**

`components/Toast.tsx`:

```tsx
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
      className="pointer-events-none fixed bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-[12px] text-black shadow-lg z-50"
    >
      {message}
    </div>
  )
}
```

- [ ] **Step 2: Account 컴포넌트**

`components/Account.tsx`:

```tsx
'use client'
import { useState } from 'react'
import { wedding } from '@/lib/weddingInfo'
import { copyText } from '@/lib/copy'
import { Toast } from './Toast'

type Side = 'groom' | 'bride'

const LABEL: Record<Side, string> = { groom: '신랑측', bride: '신부측' }

export function Account() {
  const [toast, setToast] = useState<string | null>(null)

  const row = (side: Side) => {
    const person = wedding[side]
    const onCopy = async () => {
      const ok = await copyText(person.account.number)
      setToast(ok ? '계좌번호가 복사되었어요' : '복사에 실패했어요')
    }
    return (
      <details className="rounded-md border border-[color:var(--card-border)] bg-[color:var(--card-bg)] overflow-hidden">
        <summary className="cursor-pointer list-none px-4 py-3 flex justify-between items-center">
          <span className="text-[13px] text-[color:var(--text-primary)]">
            {LABEL[side]} · {person.name}
          </span>
          <span className="text-[11px] text-[color:var(--text-muted)]">열기</span>
        </summary>
        <div className="border-t border-white/5 px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[12px] text-[color:var(--text-muted)]">{person.account.bank}</p>
            <p className="text-[14px] text-[color:var(--text-primary)] tracking-wider">{person.account.number}</p>
          </div>
          <button
            type="button"
            onClick={onCopy}
            className="rounded-md border border-white/25 px-3 py-1 text-[12px] text-[color:var(--text-primary)] hover:bg-white/5"
          >
            복사
          </button>
        </div>
      </details>
    )
  }

  return (
    <section className="py-16 px-4">
      <p className="mb-6 text-center font-[var(--font-lora)] text-[13px] tracking-[0.3em] uppercase text-[color:var(--text-muted)]">
        Account
      </p>
      <p className="mb-6 text-center text-[13px] text-[color:var(--text-muted)]">마음 전하실 곳</p>
      <div className="space-y-3">
        {row('groom')}
        {row('bride')}
      </div>
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </section>
  )
}
```

- [ ] **Step 3: 시각 확인 & 커밋**

```bash
npm run dev
```

아코디언 열림, 복사 클릭 시 토스트 나타나고 2초 후 사라짐, 실제 클립보드에 계좌번호 들어감 확인.

```bash
git add -A
git commit -m "feat(ui): Account section with copy-to-clipboard toast"
```

---

## Task 14: Kakao SDK 로더 (`lib/kakao.ts`)

**Files:**
- Create: `lib/kakao.ts`
- Modify: `app/layout.tsx`

- [ ] **Step 1: `lib/kakao.ts`**

```ts
type KakaoWindow = Window & {
  Kakao?: {
    isInitialized: () => boolean
    init: (key: string) => void
    Share: {
      sendDefault: (opts: unknown) => void
    }
  }
}

const KEY = process.env.NEXT_PUBLIC_KAKAO_KEY ?? ''

export async function ensureKakao(): Promise<NonNullable<KakaoWindow['Kakao']> | null> {
  if (!KEY) return null
  const w = window as KakaoWindow
  const start = Date.now()
  while (!w.Kakao && Date.now() - start < 3000) {
    await new Promise(r => setTimeout(r, 100))
  }
  if (!w.Kakao) return null
  if (!w.Kakao.isInitialized()) w.Kakao.init(KEY)
  return w.Kakao
}

export interface ShareInput {
  title: string
  description: string
  imageUrl: string
  linkUrl: string
}

export async function shareToKakao(input: ShareInput): Promise<boolean> {
  const k = await ensureKakao()
  if (!k) return false
  try {
    k.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: input.title,
        description: input.description,
        imageUrl: input.imageUrl,
        link: { mobileWebUrl: input.linkUrl, webUrl: input.linkUrl },
      },
      buttons: [
        {
          title: '청첩장 열기',
          link: { mobileWebUrl: input.linkUrl, webUrl: input.linkUrl },
        },
      ],
    })
    return true
  } catch {
    return false
  }
}
```

- [ ] **Step 2: layout.tsx 에 Kakao SDK 스크립트 추가**

`app/layout.tsx` 상단에 `Script` import 추가, `<body>` 끝에 스크립트:

```tsx
import Script from 'next/script'
// ...
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${lora.variable} ${pretendard.variable}`}>
      <body className="font-[var(--font-pretendard)] antialiased">
        {children}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
          integrity="sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
```

- [ ] **Step 3: 로컬 개발용 환경변수**

`.env.local` 생성 (git에는 커밋되지 않음):

```
NEXT_PUBLIC_KAKAO_KEY=<Kakao Developers에서 발급받은 JavaScript 키>
```

Kakao Developers에서 앱 미생성 시:
1. https://developers.kakao.com/console/app 접속 → 앱 추가
2. 앱 키 → JavaScript 키 복사
3. 플랫폼 → Web → 사이트 도메인에 `http://localhost:3000`, `https://hong-minji.github.io` 등록
4. Kakao Share는 별도 활성화 불필요 (기본 제공)

키가 없어도 개발 진행 가능 (share가 false 반환).

- [ ] **Step 4: 커밋**

```bash
git add lib/kakao.ts app/layout.tsx
git commit -m "feat(lib): Kakao SDK loader and share helper"
```

`.env.local`은 `.gitignore` 포함 확인.

---

## Task 15: Share 컴포넌트

**Files:**
- Create: `components/Share.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Share 컴포넌트**

`components/Share.tsx`:

```tsx
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
      <p className="mb-6 text-center font-[var(--font-lora)] text-[13px] tracking-[0.3em] uppercase text-[color:var(--text-muted)]">
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
```

- [ ] **Step 2: 시각 확인 & 커밋**

```bash
npm run dev
```

카카오 옐로우 버튼과 링크 복사 버튼 확인. Kakao 키 없으면 카톡 버튼은 "공유를 사용할 수 없어요" 토스트.

```bash
git add -A
git commit -m "feat(ui): Share section with Kakao share and link copy"
```

---

## Task 16: page.tsx 조립 완성

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: 최종 조립**

```tsx
import { Hero } from '@/components/Hero'
import { Parents } from '@/components/Parents'
import { Calendar } from '@/components/Calendar'
import { Gallery } from '@/components/Gallery'
import { Location } from '@/components/Location'
import { Account } from '@/components/Account'
import { Share } from '@/components/Share'

export default function Home() {
  return (
    <main className="mx-auto max-w-[430px] min-h-dvh">
      <Hero />
      <Parents />
      <Calendar />
      <Gallery />
      <Location />
      <Account />
      <Share />
    </main>
  )
}
```

- [ ] **Step 2: 전체 흐름 확인**

`npm run dev` — 처음부터 끝까지 스크롤하면서:
- Hero 다크 배경 + 흑백 사진
- Parents 좌우 구분
- Calendar 하이라이트
- Gallery 라이트박스
- Location 지도 + 앱 버튼
- Account 복사
- Share 카톡/링크

- [ ] **Step 3: 커밋**

```bash
git add app/page.tsx
git commit -m "feat: assemble full landing page"
```

---

## Task 17: OG 이미지 생성 (`app/opengraph-image.tsx`)

**Files:**
- Create: `app/opengraph-image.tsx`
- Modify: `app/layout.tsx` (metadata.openGraph)

- [ ] **Step 1: OG 컴포넌트 작성**

`app/opengraph-image.tsx`:

```tsx
import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const runtime = 'nodejs'
export const alt = '홍민지 · 조해창 결혼합니다'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage() {
  const photoPath = join(process.cwd(), 'public/photos/main.png')
  const photoBase64 = readFileSync(photoPath).toString('base64')
  const photoDataUrl = `data:image/png;base64,${photoBase64}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(to bottom, #313131 0%, #000000 100%)',
          color: '#F5F1EA',
        }}
      >
        <div style={{ width: '40%', display: 'flex' }}>
          <img
            src={photoDataUrl}
            alt=""
            width="480"
            height="630"
            style={{ objectFit: 'cover', filter: 'grayscale(1)' }}
          />
        </div>
        <div
          style={{
            width: '60%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 60px',
          }}
        >
          <div style={{ fontSize: 22, letterSpacing: 8, opacity: 0.7 }}>THE WEDDING OF</div>
          <div style={{ fontSize: 48, marginTop: 16 }}>홍민지 · 조해창</div>
          <div style={{ fontSize: 40, marginTop: 40, opacity: 0.9 }}>2026.10.03 SAT 5PM</div>
          <div style={{ fontSize: 22, marginTop: 12, opacity: 0.7 }}>고려대학교 교우회관</div>
        </div>
      </div>
    ),
    size,
  )
}
```

- [ ] **Step 2: layout.tsx metadata 강화**

```tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://hong-minji.github.io/wedding/'),
  title: '홍민지 · 조해창 결혼합니다',
  description: '2026. 10. 3. SAT 5PM · 고려대학교 교우회관',
  openGraph: {
    title: '홍민지 · 조해창 결혼합니다',
    description: '2026. 10. 3. SAT 5PM · 고려대학교 교우회관',
    type: 'website',
    locale: 'ko_KR',
  },
}
```

`opengraph-image.tsx` 파일이 있으면 Next.js가 자동으로 `openGraph.images` 를 채워준다.

- [ ] **Step 3: 빌드 확인**

```bash
npm run build
```

`out/opengraph-image.png` (또는 `.next/server/app/opengraph-image.png`) 가 생성되고, PNG를 열어 다크 그라데이션에 사진과 텍스트가 올라간 이미지 확인.

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "feat(og): build-time OG image with dark gradient"
```

---

## Task 18: 정적 export & basePath 설정

**Files:**
- Modify: `next.config.mjs`

- [ ] **Step 1: 설정 업데이트**

```js
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/wedding',
  trailingSlash: true,
}

export default nextConfig
```

- [ ] **Step 2: 이미지 경로 확인**

`basePath: '/wedding'` 을 넣으면 `<Image src="/photos/...">` 는 실제로 `/wedding/photos/...` 로 접근된다. Next.js가 자동 처리하므로 소스는 그대로 유지.

- [ ] **Step 3: 빌드 & 로컬 검증**

```bash
npm run build
npx serve out -l 3001
```

브라우저에서 http://localhost:3001/wedding/ 열어 페이지 정상 렌더링 확인. (basePath 때문에 root는 404, `/wedding/` 로 접근해야 함.)

- [ ] **Step 4: 커밋**

```bash
git add next.config.mjs
git commit -m "chore: enable static export with basePath /wedding"
```

---

## Task 19: GitHub Actions 배포 워크플로

**Files:**
- Create: `.github/workflows/deploy.yml`, `README.md` (선택)

- [ ] **Step 1: 워크플로 작성**

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
        env:
          NEXT_PUBLIC_KAKAO_KEY: ${{ secrets.KAKAO_KEY }}
      - name: Add .nojekyll
        run: touch out/.nojekyll
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: GitHub 저장소 & 시크릿 설정** (사용자 작업)

1. `github.com/hong-minji/wedding` 저장소 생성 (private/public 선택)
2. Settings → Pages → Source: **GitHub Actions**
3. Settings → Secrets and variables → Actions → New repository secret
   - Name: `KAKAO_KEY`
   - Value: Kakao Developers JavaScript 키
4. Kakao Developers → 앱 → 플랫폼 → Web → 사이트 도메인에 `https://hong-minji.github.io` 등록

- [ ] **Step 3: 원격 연결 & push**

```bash
git remote add origin git@github.com:hong-minji/wedding.git
git push -u origin main
```

Actions 탭에서 워크플로 실행 확인 → 완료 후 https://hong-minji.github.io/wedding/ 접속.

- [ ] **Step 4: 커밋 (README 등)**

만약 README 등을 추가한 경우 별도 커밋. 워크플로 파일은 이미 push됨.

---

## Task 20: Playwright 스모크 테스트

**Files:**
- Create: `playwright.config.ts`, `tests/smoke.spec.ts`

- [ ] **Step 1: 설치**

```bash
npm i -D @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: 설정**

`playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'tests',
  testMatch: /.*\.spec\.ts$/,
  use: {
    baseURL: 'http://localhost:3001/wedding/',
    viewport: { width: 390, height: 844 },
  },
  webServer: {
    command: 'npm run build && npx serve out -l 3001',
    port: 3001,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
```

- [ ] **Step 3: 스모크 테스트**

`tests/smoke.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

test('landing renders all sections and lightbox works', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('The Wedding of')).toBeVisible()
  await expect(page.getByText('2026.10.03 SAT 5PM')).toBeVisible()
  await expect(page.getByText('October 2026')).toBeVisible()
  await expect(page.getByText('Gallery')).toBeVisible()
  await expect(page.getByText('Location')).toBeVisible()
  await expect(page.getByText('마음 전하실 곳')).toBeVisible()
  await expect(page.getByText('Share')).toBeVisible()

  // 라이트박스 open/close
  await page.getByLabel('사진 1 크게 보기').click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()

  // 카카오 SDK 스크립트 로드 확인
  const kakaoScript = await page.locator('script[src*="kakao_js_sdk"]').count()
  expect(kakaoScript).toBeGreaterThan(0)
})
```

`package.json` scripts:

```json
"test:e2e": "playwright test"
```

- [ ] **Step 4: 실행**

```bash
npm run test:e2e
```

PASS 확인. 실패 시 셀렉터/타이밍 조정.

- [ ] **Step 5: 커밋**

```bash
git add -A
git commit -m "test: Playwright smoke test for landing page"
git push
```

---

## Task 21: 실기기 QA & 마무리

**Files:** (수정 없음, 확인만)

- [ ] **Step 1: 실기기 확인 항목**

배포 URL `https://hong-minji.github.io/wedding/` 을 다음 환경에서 확인:
- iOS Safari (아이폰)
- Android Chrome
- **카카오톡 인앱 브라우저** (링크를 카톡으로 자신에게 보내서 열기)

체크리스트:
- [ ] 폰트 로딩 (Lora/Pretendard)
- [ ] 배경 그라데이션이 스크롤 시 유지 (`background-attachment: fixed` 이슈)
- [ ] 이미지 그레이스케일 표시
- [ ] Calendar D-day 카운터 표시
- [ ] 구글 캘린더 링크 → 구글 캘린더 앱/웹 열림
- [ ] 라이트박스 스와이프 부드럽게 동작
- [ ] 카카오맵/네이버/T맵 딥링크 → 앱 미설치 시 대체 동작
- [ ] 계좌 복사 → 실제 클립보드에 저장
- [ ] 카카오톡 공유 카드 이미지·제목 정상 표시
- [ ] 링크 복사 → 클립보드
- [ ] OG 이미지: 카톡·메시지·트위터 등 미리보기

- [ ] **Step 2: 발견된 이슈 수정**

이슈가 있을 경우 별도 커밋으로 fix. 예:
- 배경이 스크롤 시 흰 여백 → `background-attachment: fixed` → iOS 이슈면 `body` 대신 `main`에 그라데이션 적용 방식으로 변경
- 카톡 인앱 브라우저에서 `100dvh` 깨짐 → `100vh` 병기

- [ ] **Step 3: 최종 커밋**

```bash
git add -A
git commit -m "chore: final QA fixes"
git push
```

---

## 자기 검토 결과

**Spec coverage:**
- Hero → Task 7
- Parents → Task 8
- Calendar + 구글 캘린더 + D-day → Task 9
- Gallery + Lightbox → Task 10, 11
- Location + 앱 딥링크 + 정적 지도 → Task 12
- Account + 복사 + Toast → Task 13
- Share + Kakao SDK → Task 14, 15
- OG 이미지 → Task 17
- 정적 export + basePath → Task 18
- GitHub Actions 배포 → Task 19
- 카카오 브랜드 옐로우 버튼 → Task 15 (`#FEE500`)
- 다크 톤 팔레트 & 카드 스타일 → Task 1 (`globals.css`), 컴포넌트 전반
- 정확 위경도 → Task 8 Step 1
- 유닛/E2E 테스트 → Task 4, 5, 20
- 실기기 QA → Task 21

**열린 항목 (구현 중 확정 필요):**
- 예식장 정확 위경도 → Task 8 Step 1에서 확정
- `static-map.png` 실제 이미지 준비 → Task 12 Step 1 사용자 작업
- Kakao Developers JS 키 → Task 14 Step 3, Task 19 Step 2 사용자 작업
- Kakao SDK CDN integrity 해시 → `t1.kakaocdn.net` 문서에서 배포 시점 최신 해시로 교체 (Task 14)
- 커스텀 도메인 → 필요 시 `public/CNAME` 추가하여 별도 커밋

**타입/시그니처 일관성:**
- `Place { name, lat, lng }` — Task 5·12에서 동일
- `GoogleCalendarInput` — Task 4·9에서 동일 필드
- `wedding` 상수 접근 경로 — 전반적으로 일관 (`wedding.groom`, `wedding.bride`, `wedding.venue`)
- Toast props (`message`, `onDone`, `duration`) — Task 13·15에서 동일 사용

플랜 준비 완료.
