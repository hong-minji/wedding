'use client'
import { useState } from 'react'
import { wedding } from '@/lib/weddingInfo'
import { copyText } from '@/lib/copy'
import { Toast } from './Toast'

type Side = 'groom' | 'bride'

const LABEL: Record<Side, string> = { groom: '신랑측', bride: '신부측' }

export function Account() {
  const [toast, setToast] = useState<string | null>(null)

  const onCopy = async (number: string) => {
    const ok = await copyText(number)
    setToast(ok ? '계좌번호가 복사되었어요' : '복사에 실패했어요')
  }

  const row = (side: Side) => {
    const person = wedding[side]
    return (
      <details className="rounded-md border border-[color:var(--card-border)] bg-[color:var(--card-bg)] overflow-hidden">
        <summary className="cursor-pointer list-none px-4 py-3 flex justify-between items-center">
          <span className="text-[13px] text-[color:var(--text-primary)]">{LABEL[side]}</span>
          <span className="text-[11px] text-[color:var(--text-muted)]">열기</span>
        </summary>
        <div className="border-t border-white/5 divide-y divide-white/5">
          {person.accounts.map((acc) => (
            <div key={acc.number} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[12px] text-[color:var(--text-muted)]">
                  {acc.role} · {acc.holder}
                </p>
                <p className="text-[13px] text-[color:var(--text-primary)]">
                  <span className="text-[color:var(--text-muted)]">{acc.bank} </span>
                  <span className="tracking-wider">{acc.number}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => onCopy(acc.number)}
                className="rounded-md border border-white/25 px-3 py-1 text-[12px] text-[color:var(--text-primary)] hover:bg-white/5 shrink-0"
              >
                복사
              </button>
            </div>
          ))}
        </div>
      </details>
    )
  }

  return (
    <section className="py-16 px-4">
      <p className="mb-6 text-center uppercase text-[13px] tracking-[0.3em] text-[color:var(--text-muted)]" style={{ fontFamily: 'var(--font-lora)' }}>
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
