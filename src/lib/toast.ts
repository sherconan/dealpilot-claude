// 全局 Toast 通知系统 — 替换阻塞 alert()
// 不依赖 React Context，通过 CustomEvent + window 单例事件总线，任何文件 import 即可调用

export type ToastLevel = 'success' | 'error' | 'info'

export interface ToastEvent {
  id: string
  level: ToastLevel
  message: string
  durationMs: number
}

export const TOAST_EVENT = 'dp:toast'

function emit(level: ToastLevel, message: string, durationMs = 4200) {
  const ev = new CustomEvent<ToastEvent>(TOAST_EVENT, {
    detail: {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      level,
      message,
      durationMs,
    },
  })
  window.dispatchEvent(ev)
}

export const toast = {
  success: (msg: string, ms?: number) => emit('success', msg, ms),
  error: (msg: string, ms?: number) => emit('error', msg, ms ?? 6000),
  info: (msg: string, ms?: number) => emit('info', msg, ms),
}
