import { Hero } from '@/components/Hero'
import { Parents } from '@/components/Parents'
import { Calendar } from '@/components/Calendar'
import { Gallery } from '@/components/Gallery'

export default function Home() {
  return (
    <main className="mx-auto max-w-[430px] min-h-dvh">
      <Hero />
      <Parents />
      <Calendar />
      <Gallery />
    </main>
  )
}
