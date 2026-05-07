// 全局 Toast 渲染容器 — 接收 window CustomEvent，统一渲染
import { useEffect, useState } from 'react'
import { TOAST_EVENT, type ToastEvent } from '../lib/toast'

interface ToastItem extends ToastEvent {
  expiresAt: number
}

const LEVEL_META = {
  success: { color: '#059669', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: '✓' },
  error: { color: '#dc2626', bg: 'bg-rose-50', border: 'border-rose-200', icon: '✕' },
  info: { color: '#0ea5e9', bg: 'bg-sky-50', border: 'border-sky-200', icon: 'ⓘ' },
} as const

export default function ToastHost() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    function onToast(e: Event) {
      const ce = e as CustomEvent<ToastEvent>
      const t = ce.detail
      setToasts((arr) => [...arr.slice(-4), { ...t, expiresAt: Date.now() + t.durationMs }])
      // 到期自动清理
      setTimeout(() => {
        setToasts((arr) => arr.filter((x) => x.id !== t.id))
      }, t.durationMs)
    }
    window.addEventListener(TOAST_EVENT, onToast)
    return () => window.removeEventListener(TOAST_EVENT, onToast)
  }, [])

  function dismiss(id: string) {
    setToasts((arr) => arr.filter((t) => t.id !== id))
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-[380px] w-[calc(100vw-2rem)] no-print">
      {toasts.map((t) => {
        const m = LEVEL_META[t.level]
        return (
          <div
            key={t.id}
            onClick={() => dismiss(t.id)}
            role="alert"
            className={`${m.bg} ${m.border} border rounded-xl shadow-pop px-4 py-3 cursor-pointer animate-[fadeInUp_0.2s_ease-out] backdrop-blur-sm flex items-start gap-3`}
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[12px] font-semibold shrink-0"
              style={{ background: m.color }}
              aria-hidden
            >
              {m.icon}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] text-ink-900 leading-relaxed whitespace-pre-line">{t.message}</div>
              <div className="text-[10px] text-ink-400 mt-1">点击关闭</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
