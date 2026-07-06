# 모바일 청첩장 설계 (홍민지 · 조해창)

- 작성일: 2026-07-07
- 저장소: https://github.com/hong-minji/wedding
- 배포 URL: https://hong-minji.github.io/wedding/
- 예식: 2026-10-03(토) 17:00, 고려대학교 교우회관

## 목표

참고 시안(흑백 미니멀, 세리프+산세리프)의 무드를 따르되, 페이지 전체에 상단 `#313131` → 하단 `#000000` 세로 그라데이션을 적용한 다크 톤 단일 스크롤 모바일 청첩장을 만든다. GitHub Pages에 정적 배포하고 카카오톡 공유·구글 캘린더 추가·앱 딥링크·계좌 복사·라이트박스 갤러리를 지원한다.

## 범위

**포함**
- 단일 스크롤 페이지 (Hero → Parents → Calendar → Gallery → Location → Account → Share)
- 라이트박스 갤러리 (스와이프/키보드)
- 구글 캘린더 URL 생성
- 카카오톡 공유 SDK
- 계좌 복사 + 토스트
- 지도 앱 딥링크 (카카오맵/네이버지도/T맵)
- 빌드 타임 OG 이미지 생성 (`ImageResponse`)
- GitHub Actions로 Pages 자동 배포

**제외**
- 인사말 섹션
- 방명록·RSVP
- BGM
- 동적 개인화 OG 이미지 (서버 필요)
- 인터랙티브 임베드 지도

## 아키텍처

- Next.js 15 App Router, TypeScript, Tailwind CSS
- `output: 'export'` 정적 빌드 → `out/`
- 이미지 최적화 서버 없음 → `images.unoptimized: true`, Next `<Image>`는 정적 참조로 사용
- `basePath: '/wedding'`, `trailingSlash: true`
- 로컬 폰트: `font/Lora`, `font/Pretendard` → `next/font/local`

```
app/
  layout.tsx           # 폰트, 전역 메타, Kakao Script
  page.tsx             # 단일 스크롤 페이지
  opengraph-image.tsx  # 빌드 타임 OG 생성 (1200×630)
components/
  Hero.tsx
  Parents.tsx
  Calendar.tsx
  Gallery.tsx
  Lightbox.tsx
  Location.tsx
  Account.tsx
  Share.tsx
  Toast.tsx
lib/
  kakao.ts             # SDK 초기화·공유
  calendar.ts          # 구글 캘린더 URL 생성
  copy.ts              # 클립보드 복사 (execCommand 폴백)
  mapLinks.ts          # 카카오맵/네이버지도/T맵 딥링크 생성
  weddingInfo.ts       # 이름·일시·장소·계좌 상수
public/
  photos/main.png photo_01.png ... photo_07.png meta-image.png static-map.png
  fonts/               # (또는 next/font/local이 참조하는 위치)
  CNAME                # (선택, 커스텀 도메인 시)
.github/workflows/
  deploy.yml
next.config.mjs
tailwind.config.ts
```

## 페이지 구조 (모바일 단일 스크롤)

배경: `linear-gradient(to bottom, #313131 0%, #000000 100%)` — `body`에 적용. 전체가 다크 톤이므로 모든 섹션은 밝은 텍스트(`#F5F1EA` 계열)를 사용한다. 지도·계좌 카드 등은 어두운 배경 위 미묘하게 밝은 카드(`bg-white/5`, `border-white/10`)로 처리해 대비를 확보한다.

1. **Hero** (dark)
   - "The Wedding of" — Lora 12px, tracking-widest, `#F5F1EA`
   - "홍민지 · 조해창" — Pretendard 14px, `#F5F1EA`
   - `main.png` — 흑백, `aspect-[3/4]`, 하단 페이드아웃 (`mask-image` 또는 그라데이션 오버레이)
   - 사진 위 중앙 오버레이: "2026.10.03 SAT 5PM" (Lora 28px) + "고려대학교 교우회관" (Pretendard 13px)

2. **Parents** (dark)
   - 2열 flex, 가운데 세로 구분선 `--divider`
   - 좌: `신랑 · 조수현 · 김보영의 아들 조해창`
   - 우: `신부 · 홍영권 · 김계열의 딸 홍민지`

3. **Calendar** (dark)
   - CSS 그리드 (7열), 2026년 10월. 3일 셀에 원형 하이라이트 (`bg-white/15`, 텍스트 `#F5F1EA`)
   - 하단 D-day 카운터 (`useEffect`로 클라이언트 계산). SSR 시 값 미표시로 hydration mismatch 회피.
   - `[구글 캘린더에 추가]` 버튼 → 새 탭. outline 스타일 (`border-white/25`)

4. **Gallery** (dark)
   - 2열 그리드 (`gap-2`), 사진 7장
   - 탭 시 라이트박스 오픈

5. **Location** (dark)
   - `static-map.png` (미리 캡처) — 지도 자체는 밝을 수 있으므로 다크 스타일 정적 지도(카카오 지도 다크 스킨) 우선. 여의치 않으면 일반 지도에 살짝 어두운 오버레이를 얹어 톤을 맞춘다.
   - 주소: `서울 성북구 종암로 13 · 고려대학교 교우회관`
   - 지하철: `6호선 고려대역 2번 출구 → 도보 5~7분 직진`
   - 자가용: `내비 "종암로 13" 검색 · 건물 내 주차장 400대 이상`
   - `[카카오맵] [네이버지도] [T맵]` 딥링크 버튼 — outline 스타일

6. **Account** (dark)
   - 신랑측/신부측 두 개의 아코디언, 카드 배경 `bg-white/5`, 테두리 `border-white/10`
   - 신부 홍민지 — 국민은행 032902-04-260074
   - 신랑 조해창 — 국민은행 021902-04-127492
   - 각 항목에 `[복사]` 버튼, 성공 시 하단 토스트

7. **Share** (dark)
   - `[카카오톡으로 공유]` — 카카오 옐로우 (`#FEE500`) 유지 (브랜드 가이드 준수), 텍스트 `#191600`
   - `[링크 복사]` — outline 스타일
   - SDK 로드 실패 시 링크 복사로 폴백

## 타이포그래피 & 컬러

**폰트**
- Lora — 세리프, 영문·숫자·날짜
- Pretendard — 산세리프, 한글

**컬러 토큰** (다크 톤 단일 팔레트)
- `--bg-top: #313131`
- `--bg-bottom: #000000`
- `--text-primary: #F5F1EA` (크림빛 화이트)
- `--text-muted: rgba(245,241,234,0.60)`
- `--text-subtle: rgba(245,241,234,0.40)`
- `--divider: rgba(255,255,255,0.12)`
- `--card-bg: rgba(255,255,255,0.05)`
- `--card-border: rgba(255,255,255,0.10)`
- `--accent-kakao: #FEE500`

**레이아웃**
- `max-w-[430px] mx-auto` 폰 프레임
- 섹션 상하 여백 `py-24`, 요소 간 `space-y-6`
- 스크롤 페이드인 애니메이션 최소화

## 주요 컴포넌트 상세

### Hero.tsx
- 이미지: `main.png` (`public/photos/`)
- 사진 하단 20%는 배경으로 페이드아웃 → 오버레이 텍스트와 자연스럽게 연결
- 오버레이 텍스트는 사진 하단 중앙에 절대 배치

### Calendar.tsx
- 순수 CSS 그리드, 라이브러리 없음
- 요일 헤더: `S M T W T F S` (Lora)
- 날짜 셀: 원형(`rounded-full`), 3일 셀은 `bg-white/15 text-[#F5F1EA]`
- D-day 카운터: 렌더 후 `useEffect`에서 계산해 표시

### Gallery.tsx + Lightbox.tsx
- 라이브러리 없이 자체 구현 (약 80줄)
- 라이트박스: `fixed inset-0`, `role="dialog"`, 포커스 트랩, ESC/오버레이 탭 닫기
- 스와이프: 터치·마우스 드래그 좌/우, 첫/마지막에서 loop
- 이미지: `object-contain`, 배경 `bg-black/90`

### Location.tsx
- 정적 지도 이미지 하나 (미리 캡처하여 `public/photos/static-map.png`)
- 앱 딥링크 URL 스키마 (`lib/mapLinks.ts`):
  - 카카오맵: `kakaomap://look?p=<lat>,<lng>` (실패 시 `https://map.kakao.com/link/map/고려대학교 교우회관,<lat>,<lng>`)
  - 네이버지도: `nmap://place?lat=<lat>&lng=<lng>&name=<url-encoded>&appname=hong-minji.github.io.wedding`
  - T맵: `tmap://route?goalname=<name>&goalx=<lng>&goaly=<lat>`
- 좌표는 `lib/weddingInfo.ts` 상수로. 정확한 위경도는 카카오맵 좌표 조회로 확정 (플랜 단계에서).

### Account.tsx
- 아코디언은 `<details><summary>` 로 순수 마크업 (JS 최소화)
- 복사: `lib/copy.ts` → `navigator.clipboard.writeText` → 실패 시 `execCommand('copy')` 폴백
- 성공 시 `<Toast>` 컴포넌트가 "계좌번호가 복사되었어요" 2초 표시

### Share.tsx
- `lib/kakao.ts`:
  - `ensureKakao()` — Kakao SDK 준비될 때까지 대기(폴링 최대 3초), init 미완이면 초기화
  - `shareFeed()` — objectType: 'feed', title/description/imageUrl/link 설정. imageUrl은 절대 URL (`https://hong-minji.github.io/wedding/opengraph-image.png` 등)
- 실패/미로딩 시 `[링크 복사]`로 폴백 유도 (에러 토스트)

### calendar.ts
```
buildGoogleCalendarUrl({
  title: '홍민지 · 조해창 결혼식',
  start: '20261003T170000',
  end:   '20261003T190000',
  timezone: 'Asia/Seoul',
  details: '홍민지 · 조해창의 결혼식에 초대합니다.',
  location: '서울 성북구 종암로 13 고려대학교 교우회관',
})
→ https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&dates=.../...&ctz=Asia/Seoul&details=...&location=...
```

## OG 이미지 (빌드 타임 생성)

- `app/opengraph-image.tsx`, `size: { width: 1200, height: 630 }`
- `ImageResponse` JSX로 렌더:
  - 좌측 40%: 흑백 사진 (main.png)
  - 우측 60%: 세리프 "The Wedding of" + 이름 + "2026.10.03 SAT 5PM"
  - 배경 그라데이션 `#313131 → #000000`, 텍스트 `#F5F1EA`
- 정적 export 시 `opengraph-image.png` 파일로 굽혀져 `<meta property="og:image">`에 자동 연결
- 카카오톡 공유 카드 이미지도 이걸 사용

## 배포 (GitHub Actions → Pages)

`.github/workflows/deploy.yml`:
- 트리거: `push: { branches: [main] }`, `workflow_dispatch`
- 권한: `pages: write`, `id-token: write`
- 단계:
  1. `actions/checkout@v4`
  2. `actions/setup-node@v4` (node 20)
  3. `npm ci`
  4. `npm run build` — env `NEXT_PUBLIC_KAKAO_KEY: ${{ secrets.KAKAO_KEY }}`
  5. `actions/configure-pages@v5`
  6. `actions/upload-pages-artifact@v3` (path: `./out`)
  7. `actions/deploy-pages@v4`
- Repo 설정: Settings → Pages → Source: GitHub Actions
- Secret 등록: `KAKAO_KEY` (Kakao Developers 앱의 JavaScript 키)
- Kakao Developers 도메인 등록: `https://hong-minji.github.io`

## next.config.mjs

```
output: 'export',
images: { unoptimized: true },
basePath: '/wedding',
trailingSlash: true,
```

## 엣지 케이스 / 접근성

- Kakao SDK 로드 실패 → 공유 버튼은 링크 복사로 폴백 + 에러 토스트
- 클립보드 API 미지원 → `execCommand('copy')` 폴백
- 앱 딥링크 실패(설치 안됨) → 웹 대체 URL로 열림
- 라이트박스 열림 시 body 스크롤 잠금, ESC/오버레이 탭 닫기, 포커스 트랩
- 카톡 인앱 브라우저 대응: `100vh` 대신 `100dvh` 사용
- 모든 `<Image>`에 의미 있는 `alt`
- 다크 톤 전체이므로 텍스트 대비는 `#F5F1EA` 기준 WCAG AA 이상 유지. `--text-muted`는 본문에만 사용, 중요 텍스트는 `--text-primary`

## 테스팅

- Playwright 스모크 1건: 페이지 로드 → 각 섹션 스냅샷 → 라이트박스 개폐 → 계좌 복사 → Kakao 스크립트 태그 존재
- 유닛: `lib/calendar.ts`, `lib/mapLinks.ts` (순수 함수 URL 생성)
- 수동 실기기 QA: iOS Safari, Android Chrome, 카톡 인앱 브라우저

## 개발 순서

1. Next.js + Tailwind 초기화, 로컬 폰트/사진 배치, `weddingInfo.ts` 상수화
2. `layout.tsx` + 전역 배경 그라데이션 + 메타
3. Hero → Parents → Calendar (D-day/구글 캘린더 URL 포함)
4. Gallery + Lightbox
5. Location + 앱 딥링크 (`static-map.png` 준비)
6. Account 복사 + Toast
7. Share (Kakao SDK)
8. `opengraph-image.tsx`
9. `next.config.mjs` (export/basePath) + GitHub Actions 파이프라인
10. 실기기 QA

## 열린 항목 (구현 플랜 단계에서 확정)

- 예식장 위경도 정확 좌표
- `static-map.png` 소스 (카카오 정적 지도 API로 자동 생성 vs 수동 캡처)
- Kakao Developers 앱 생성 및 JavaScript 키 발급 (사용자 작업)
- 커스텀 도메인 사용 여부
