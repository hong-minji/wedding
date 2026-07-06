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
