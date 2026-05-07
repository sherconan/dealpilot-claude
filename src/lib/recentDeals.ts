// 最近查看的 deal 跟踪（localStorage，跨 session 保留 7 天，最多 6 条）
const KEY = 'dp:recentViewed'
const MAX_ITEMS = 6
const TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 天

interface RecentEntry {
  id: string
  ts: number
}

const listeners = new Set<() => void>()

function load(): RecentEntry[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]') as RecentEntry[]
    const now = Date.now()
    return raw.filter((e) => e && e.id && now - e.ts < TTL_MS)
  } catch { return [] }
}

function save(arr: RecentEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(arr))
  listeners.forEach((fn) => fn())
}

export function trackDealView(dealId: string) {
  if (!dealId) return
  const cur = load()
  const filtered = cur.filter((e) => e.id !== dealId)
  filtered.unshift({ id: dealId, ts: Date.now() })
  save(filtered.slice(0, MAX_ITEMS))
}

export function getRecentDealIds(): string[] {
  return load().map((e) => e.id)
}

export function subscribeRecent(cb: () => void): () => void {
  listeners.add(cb)
  return () => { listeners.delete(cb) }
}

export function clearRecent() {
  save([])
}

// React hook — 自动响应变更
import { useEffect, useState } from 'react'

export function useRecentDealIds(): string[] {
  const [ids, setIds] = useState<string[]>(getRecentDealIds())
  useEffect(() => subscribeRecent(() => setIds(getRecentDealIds())), [])
  return ids
}
