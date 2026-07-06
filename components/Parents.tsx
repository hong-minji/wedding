import { wedding } from '@/lib/weddingInfo'

interface CellProps {
  label: string
  role: string
  father: string
  mother: string
  child: string
}

function Cell({ label, role, father, mother, child }: CellProps) {
  return (
    <div className="flex-1 flex flex-col items-center gap-2 px-4">
      <span className="uppercase text-[11px] tracking-[0.3em] text-[color:var(--text-subtle)]" style={{ fontFamily: 'var(--font-lora)' }}>
        {label}
      </span>
      <p className="text-[13px] text-[color:var(--text-muted)] leading-relaxed text-center">
        {father} · {mother}
      </p>
      <p className="text-[12px] text-[color:var(--text-subtle)]">의 {role}</p>
      <p className="text-[15px] text-[color:var(--text-primary)]">{child}</p>
    </div>
  )
}

export function Parents() {
  return (
    <section className="py-16">
      <div className="flex items-stretch">
        <Cell
          label="Groom"
          role="아들"
          father={wedding.groom.father}
          mother={wedding.groom.mother}
          child={wedding.groom.name}
        />
        <div className="w-px bg-[color:var(--divider)]" />
        <Cell
          label="Bride"
          role="딸"
          father={wedding.bride.father}
          mother={wedding.bride.mother}
          child={wedding.bride.name}
        />
      </div>
    </section>
  )
}
