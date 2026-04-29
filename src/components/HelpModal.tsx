import { useEffect, useState } from 'react'

const shortcuts = [
  { group: '全局', items: [
    { keys: ['⌘', 'K'], desc: '唤起命令面板（搜索 / 跳转）' },
    { keys: ['Shift', '?'], desc: '打开本帮助 modal' },
    { keys: ['Esc'], desc: '关闭弹层' },
  ]},
  { group: '导航（输入框外）', items: [
    { keys: ['G', 'D'], desc: '跳到驾驶舱 Dashboard' },
    { keys: ['G', 'P'], desc: '跳到漏斗看板 Pipeline' },
    { keys: ['G', 'B'], desc: '跳到基金周报 Briefings' },
    { keys: ['G', 'U'], desc: '跳到上传 BP' },
    { keys: ['G', 'C'], desc: '跳到项目对比' },
    { keys: ['G', 'R'], desc: '跳到风险扫描' },
    { keys: ['G', 'S'], desc: '跳到信号雷达' },
  ]},
  { group: '主题与语言', items: [
    { keys: ['T'], desc: '切换 Light / Dark 主题（输入框外）' },
    { keys: ['L'], desc: '切换中 / English（输入框外）' },
  ]},
  { group: 'Pipeline 看板', items: [
    { keys: ['鼠标拖拽'], desc: '拖动卡片在阶段间移动（自动持久化）' },
    { keys: ['↑', '↓'], desc: '在命令面板中切换条目' },
  ]},
]

export default function HelpModal() {
  const [open, setOpen] = useState(false)
  const [gPressed, setGPressed] = useState<number | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      const inField = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault()
        setOpen((v) => !v)
        return
      }
      if (e.key === 'Escape' && open) setOpen(false)
      if (inField) return

      // T / L 切换
      if (e.key === 't' || e.key === 'T') {
        document.querySelector<HTMLButtonElement>('[title*="Dark mode"], [title*="Light mode"]')?.click()
      }
      if (e.key === 'l' || e.key === 'L') {
        document.querySelector<HTMLButtonElement>('[title*="English"], [title*="中文"]')?.click()
      }

      // G + 字母 双键导航
      if (e.key === 'g' || e.key === 'G') {
        setGPressed(Date.now())
        setTimeout(() => setGPressed((v) => (v === Date.now() ? null : v)), 1500)
        return
      }
      if (gPressed && Date.now() - gPressed < 1500) {
        const map: Record<string, string> = { d: '/', p: '/pipeline', b: '/briefings', u: '/upload', c: '/compare', r: '/risk', s: '/signals', m: '/memory' }
        const target = map[e.key.toLowerCase()]
        if (target) {
          window.history.pushState({}, '', (import.meta.env.BASE_URL.replace(/\/$/, '') || '') + target)
          window.dispatchEvent(new PopStateEvent('popstate'))
          setGPressed(null)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, gPressed])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4 bg-ink-900/30 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[640px] bg-white border border-ink-200 rounded-2xl shadow-pop overflow-hidden">
        <div className="px-5 py-4 border-b border-ink-200 flex items-center justify-between">
          <div>
            <div className="text-[10px] tracking-wider uppercase text-ink-500">Keyboard Shortcuts</div>
            <h3 className="text-[16px] font-semibold tracking-tight">键盘快捷键</h3>
          </div>
          <kbd className="text-[10px] text-ink-400 bg-ink-100 border border-ink-200 px-2 py-0.5 rounded num">esc</kbd>
        </div>
        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto scrollbar-thin">
          {shortcuts.map((g) => (
            <div key={g.group}>
              <div className="text-[11px] tracking-wider uppercase text-ink-500 font-medium mb-2">{g.group}</div>
              <div className="space-y-1.5">
                {g.items.map((it, i) => (
                  <div key={i} className="flex items-center justify-between text-[13px]">
                    <span className="text-ink-700">{it.desc}</span>
                    <span className="flex items-center gap-1">
                      {it.keys.map((k, j) => (
                        <kbd key={j} className="text-[11px] bg-ink-100 border border-ink-200 px-2 py-0.5 rounded num font-medium">{k}</kbd>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-ink-200 text-[11px] text-ink-500 text-center">
          按 <kbd className="bg-ink-100 border border-ink-200 px-1.5 rounded num">Shift + ?</kbd> 随时再次打开本帮助
        </div>
      </div>
    </div>
  )
}
