import { Hero } from '@/components/Hero'
import { Parents } from '@/components/Parents'
import { Calendar } from '@/components/Calendar'

export default function Home() {
  return (
    <main className="mx-auto max-w-[430px] min-h-dvh">
      <Hero />
      <Parents />
      <Calendar />
    </main>
  )
}
