import { Hero } from '@/components/Hero'
import { Parents } from '@/components/Parents'
import { Calendar } from '@/components/Calendar'
import { Gallery } from '@/components/Gallery'
import { Location } from '@/components/Location'
import { Account } from '@/components/Account'
import { Guestbook } from '@/components/Guestbook'
import { Share } from '@/components/Share'

export default function Home() {
  return (
    <>
      <Hero />
      <main className="mx-auto max-w-[430px] min-h-dvh">
        <Parents />
        <Calendar />
        <Gallery />
        <Location />
        <Account />
        <Guestbook />
        <Share />
      </main>
    </>
  )
}
