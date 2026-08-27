This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 사진 교체하기

원본 사진은 `photos-src/`에 있고, 사이트가 실제로 내보내는 파일은 거기서 자동으로 만들어진다.

1. `photos-src/`의 파일을 같은 이름으로 덮어쓴다 (`main.png`, `photo-01.png` …).
2. `npm run photos` — WebP로 다시 굽고(`public/photos/`), 캐시 무효화용 해시도 다시 계산한다.

`npm run dev`와 `npm run build`가 알아서 먼저 돌리므로, 보통은 1번만 하고 개발 서버를 켜면 된다.
`public/photos/`는 결과물이니 직접 손대지 않는다.

## 폰트

`font/`에 원본 전체가 있고, `npm run fonts`가 실제로 쓰는 굵기만 골라 한글 상용
2350자로 서브셋한 woff2를 `fonts-web/`에 만든다 (4.9MB → 393KB). 굵기를 새로
쓰려면 `scripts/optimize-fonts.mjs`와 `lib/fonts.ts` 양쪽에 추가해야 한다.

`npm run assets` = 사진 + 폰트 한 번에.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
