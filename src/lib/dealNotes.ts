// 个人笔记 — localStorage 按 dealId 隔离 + 自动保存 (debounce 600ms)
const KEY_PREFIX = 'dp:notes:'

const listeners = new Map<string, Set<() => void>>()

export function loadNotes(dealId: string): string {
  if (!dealId) return ''
  return localStorage.getItem(KEY_PREFIX + dealId) || ''
}

export function saveNotes(dealId: string, content: string) {
  if (!dealId) return
  if (content) localStorage.setItem(KEY_PREFIX + dealId, content)
  else localStorage.removeItem(KEY_PREFIX + dealId)
  const set = listeners.get(dealId)
  if (set) set.forEach((fn) => fn())
}

export function subscribeNotes(dealId: string, cb: () => void): () => void {
  let set = listeners.get(dealId)
  if (!set) {
    set = new Set()
    listeners.set(dealId, set)
  }
  set.add(cb)
  return () => set!.delete(cb)
}

// React hook：自动 debounce 保存
import { useEffect, useState, useRef } from 'react'

export function useDealNotes(dealId: string): {
  notes: string
  setNotes: (v: string) => void
  saving: boolean
  lastSavedAt: number | null
} {
  const [notes, setNotesState] = useState<string>(() => loadNotes(dealId))
  const [saving, setSaving] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null)
  const timerRef = useRef<number | null>(null)

  // 切 deal 时重新加载
  useEffect(() => {
    setNotesState(loadNotes(dealId))
    setLastSavedAt(null)
  }, [dealId])

  function setNotes(v: string) {
    setNotesState(v)
    setSaving(true)
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      saveNotes(dealId, v)
      setSaving(false)
      setLastSavedAt(Date.now())
    }, 600)
  }

  return { notes, setNotes, saving, lastSavedAt }
}
