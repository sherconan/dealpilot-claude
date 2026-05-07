// 路由级 document.title 钩子 — 多 tab / 多窗口时一眼区分
// 作用：浏览器标签页 / 任务栏 / 通知中心都显示当前页名
import { useEffect } from 'react'

const BASE = 'DealPilot · VC 智能筛选驾驶舱'

export function useDocumentTitle(pageName?: string) {
  useEffect(() => {
    const prev = document.title
    document.title = pageName ? `${pageName} · ${BASE}` : BASE
    return () => {
      document.title = prev
    }
  }, [pageName])
}
