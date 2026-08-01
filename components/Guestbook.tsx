'use client'
import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Toast } from './Toast'

type Entry = {
  id: string
  name: string
  message: string
  createdAt: Timestamp | null
}

const NAME_MAX = 20
const MESSAGE_MAX = 300

function formatDate(ts: Timestamp | null) {
  if (!ts) return ''
  const d = ts.toDate()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

export function Guestbook() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setEntries(
          snap.docs.map((d) => {
            const data = d.data() as { name: string; message: string; createdAt: Timestamp | null }
            return { id: d.id, name: data.name, message: data.message, createdAt: data.createdAt ?? null }
          }),
        )
      },
      () => setToast('방명록을 불러오지 못했어요'),
    )
    return () => unsub()
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const n = name.trim()
    const m = message.trim()
    if (!n || !m) {
      setToast('이름과 메시지를 입력해주세요')
      return
    }
    if (n.length > NAME_MAX || m.length > MESSAGE_MAX) {
      setToast('글자 수 제한을 확인해주세요')
      return
    }
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'guestbook'), {
        name: n,
        message: m,
        createdAt: serverTimestamp(),
      })
      setName('')
      setMessage('')
      setToast('메시지가 등록되었어요')
    } catch {
      setToast('등록에 실패했어요')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="py-16 px-4">
      <p className="mb-6 text-center uppercase text-[13px] tracking-[0.3em] text-[color:var(--text-muted)]" style={{ fontFamily: 'var(--font-lora)' }}>
        Guestbook
      </p>

      <form onSubmit={onSubmit} className="space-y-2 mb-8">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          maxLength={NAME_MAX}
          className="w-full rounded-md border border-white/25 bg-transparent px-3 py-2 text-[14px] text-[color:var(--text-primary)] placeholder:text-[color:var(--text-muted)] focus:outline-none focus:border-white/50"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="축하 메시지를 남겨주세요"
          maxLength={MESSAGE_MAX}
          rows={3}
          className="w-full rounded-md border border-white/25 bg-transparent px-3 py-2 text-[14px] text-[color:var(--text-primary)] placeholder:text-[color:var(--text-muted)] focus:outline-none focus:border-white/50 resize-none"
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md border border-white/25 py-3 text-[13px] text-[color:var(--text-primary)] hover:bg-white/5 disabled:opacity-50"
        >
          {submitting ? '등록 중…' : '메시지 남기기'}
        </button>
      </form>

      <ul className="space-y-3">
        {entries.map((entry) => (
          <li key={entry.id} className="rounded-md border border-white/15 px-4 py-3">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-[13px] font-medium text-[color:var(--text-primary)]">{entry.name}</span>
              <span className="text-[11px] text-[color:var(--text-muted)]">{formatDate(entry.createdAt)}</span>
            </div>
            <p className="text-[13px] text-[color:var(--text-primary)] whitespace-pre-wrap break-words">{entry.message}</p>
          </li>
        ))}
      </ul>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </section>
  )
}
