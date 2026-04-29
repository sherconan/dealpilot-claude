import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deals } from '../data/deals'
import { useApp } from '../contexts/AppContext'

interface Cmd {
  id: string
  label: string
  hint?: string
  group: '导航' | '项目' | '动作'
  action: () => void
  keywords?: string
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { toggleLang, toggleTheme, lang, theme } = useApp()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey
      if (meta && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
        return
      }
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (open) {
      setQ('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const cmds: Cmd[] = useMemo(() => {
    const nav: Cmd[] = [
      { id: 'go-home', label: '驾驶舱 Dashboard', hint: 'g d', group: '导航', action: () => navigate('/'), keywords: 'home dashboard 驾驶舱' },
      { id: 'go-pipe', label: '漏斗看板 Pipeline', hint: 'g p', group: '导航', action: () => navigate('/pipeline'), keywords: 'pipeline kanban 看板' },
      { id: 'go-upload', label: '上传 BP', group: '导航', action: () => navigate('/upload'), keywords: 'upload bp 上传' },
      { id: 'go-risk', label: '风险扫描', group: '导航', action: () => navigate('/risk'), keywords: 'risk 风险 合规' },
      { id: 'go-portfolio', label: '投后组合', group: '导航', action: () => navigate('/portfolio'), keywords: 'portfolio 投后' },
      { id: 'go-signals', label: 'AI 信号雷达', group: '导航', action: () => navigate('/signals'), keywords: 'signals 信号 雷达' },
      { id: 'go-thesis', label: '投资论点', group: '导航', action: () => navigate('/thesis'), keywords: 'thesis 论点' },
      { id: 'go-memory', label: '机构记忆', group: '导航', action: () => navigate('/memory'), keywords: 'memory 记忆' },
      { id: 'go-sources', label: '真信源', group: '导航', action: () => navigate('/sources'), keywords: 'sources 信源' },
      { id: 'go-docs', label: '方法论文档', group: '导航', action: () => navigate('/docs'), keywords: 'docs methodology 方法论' },
    ]
    const dealCmds: Cmd[] = deals.map((d) => ({
      id: `deal-${d.id}`,
      label: `${d.name} · ${d.cnName}`,
      hint: `${d.score} 分`,
      group: '项目',
      action: () => navigate(`/deal/${d.id}`),
      keywords: [
        d.name, d.cnName, d.sector, d.round, d.tagline, d.location, d.champion,
        d.founders.map((f) => `${f.name} ${f.role} ${f.background}`).join(' '),
        d.wins.join(' '), d.concerns.join(' '),
        d.redFlags.map((f) => f.label).join(' '),
      ].filter(Boolean).join(' '),
    }))
    const acts: Cmd[] = [
      { id: 'lang', label: `切换语言 → ${lang === 'zh' ? 'English' : '中文'}`, hint: 'cmd+L', group: '动作', action: toggleLang, keywords: 'language 语言 中英' },
      { id: 'theme', label: `切换主题 → ${theme === 'light' ? '深色 Dark' : '浅色 Light'}`, hint: 'cmd+J', group: '动作', action: toggleTheme, keywords: 'theme dark light 主题 暗色' },
    ]
    return [...nav, ...dealCmds, ...acts]
  }, [navigate, toggleLang, toggleTheme, lang, theme])

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return cmds
    return cmds.filter((c) =>
      c.label.toLowerCase().includes(query) ||
      (c.keywords || '').toLowerCase().includes(query),
    )
  }, [cmds, q])

  const grouped = useMemo(() => {
    const g: Record<string, Cmd[]> = { 导航: [], 项目: [], 动作: [] }
    filtered.forEach((c) => g[c.group].push(c))
    return g
  }, [filtered])

  function run(c: Cmd) {
    c.action()
    setOpen(false)
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(filtered.length - 1, a + 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive((a) => Math.max(0, a - 1)) }
    if (e.key === 'Enter')     { e.preventDefault(); const c = filtered[active]; if (c) run(c) }
  }

  if (!open) return null

  let runningIdx = -1

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4 bg-ink-900/30 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[600px] bg-white border border-ink-200 rounded-2xl shadow-pop overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-ink-200">
          <svg viewBox="0 0 16 16" className="w-4 h-4 text-ink-400 shrink-0" fill="currentColor"><path d="M11.7 10.6l3 3-1 1-3-3a5.5 5.5 0 11.99-1zM7 11a4 4 0 100-8 4 4 0 000 8z"/></svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => { setQ(e.target.value); setActive(0) }}
            onKeyDown={handleKey}
            placeholder="搜索页面 · 项目 · 动作…"
            className="flex-1 bg-transparent text-[14px] focus:outline-none"
          />
          <kbd className="text-[10px] text-ink-400 bg-ink-100 border border-ink-200 px-1.5 py-0.5 rounded num">esc</kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto scrollbar-thin py-1">
          {filtered.length === 0 && <div className="px-4 py-6 text-center text-[13px] text-ink-400">无匹配项</div>}
          {Object.entries(grouped).map(([group, list]) => list.length === 0 ? null : (
            <div key={group} className="py-1">
              <div className="px-3 py-1 text-[10px] tracking-wider uppercase text-ink-400 font-medium">{group}</div>
              {list.map((c) => {
                runningIdx++
                const isActive = runningIdx === active
                return (
                  <button
                    key={c.id}
                    onMouseEnter={() => setActive(filtered.indexOf(c))}
                    onClick={() => run(c)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-[13px] transition ${isActive ? 'bg-brand-50 text-brand-800' : 'hover:bg-ink-50'}`}
                  >
                    <span className="truncate">{c.label}</span>
                    {c.hint && <kbd className="text-[10px] text-ink-400 bg-ink-100 border border-ink-200 px-1.5 py-0.5 rounded num shrink-0">{c.hint}</kbd>}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
        <div className="px-4 py-2 border-t border-ink-200 flex items-center justify-between text-[10px] text-ink-500">
          <span>↑↓ 移动 · Enter 选中 · Esc 关闭</span>
          <span><kbd className="bg-ink-100 border border-ink-200 px-1 rounded num">⌘ K</kbd> 唤起</span>
        </div>
      </div>
    </div>
  )
}
