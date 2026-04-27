import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { deals } from '../data/deals'

const navItems = [
  { to: '/', label: '驾驶舱', hint: '今日概览' },
  { to: '/pipeline', label: '漏斗看板', hint: '全部阶段' },
  { to: '/thesis', label: '投资论点', hint: 'Thesis 对齐' },
  { to: '/memory', label: '机构记忆', hint: '历史项目' },
]

export default function Layout() {
  const loc = useLocation()
  const priorityDeals = deals.filter((d) => d.recommendation === 'priority').slice(0, 3)

  return (
    <div className="min-h-[100dvh] flex bg-ink-50">
      <aside className="w-[248px] shrink-0 border-r border-ink-200 bg-white flex flex-col">
        <div className="px-5 py-5 border-b border-ink-200">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-brand-700 flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 19l4-4 3 3 7-8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="19" cy="10" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-[15px] tracking-tight">DealPilot</div>
              <div className="text-[11px] text-ink-500 tracking-wide">VC 筛选驾驶舱</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 scrollbar-thin overflow-y-auto">
          <div className="text-[10px] font-medium text-ink-400 tracking-[0.14em] uppercase px-3 py-2">工作台</div>
          {navItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
                  isActive ? 'bg-brand-50 text-brand-800 font-medium' : 'text-ink-700 hover:bg-ink-100'
                }`
              }
            >
              <span>{it.label}</span>
              <span className="text-[10px] text-ink-400">{it.hint}</span>
            </NavLink>
          ))}

          <div className="text-[10px] font-medium text-ink-400 tracking-[0.14em] uppercase px-3 pt-5 pb-2">优先推进</div>
          {priorityDeals.map((d) => (
            <Link
              key={d.id}
              to={`/deal/${d.id}`}
              className={`block px-3 py-2 rounded-lg text-sm hover:bg-ink-100 transition ${
                loc.pathname.includes(d.id) ? 'bg-ink-100' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="truncate max-w-[140px] font-medium">{d.name}</span>
                <span className="num text-[11px] font-semibold" style={{ color: d.accentColor }}>{d.score}</span>
              </div>
              <div className="text-[11px] text-ink-500 truncate mt-0.5">{d.sector} · {d.round}</div>
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-ink-200">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white text-xs font-semibold">HZ</div>
            <div className="flex-1">
              <div className="text-sm font-medium">Henry Zhao</div>
              <div className="text-[11px] text-ink-500">Partner · 早期 / AI</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 text-[11.5px] text-amber-900 flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0" fill="currentColor"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM7.25 5a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0V5zM8 12a1 1 0 110-2 1 1 0 010 2z"/></svg>
            演示版本 · 数据透明声明
          </span>
          <span className="text-amber-800">
            6 个项目本身为<b>虚构演示</b>；但<b>所有可比上市公司表格 100% 真实数据</b>（akshare 实时财报 + 东方财富股价，<span className="num">2026-04-24</span> 抓取）。
          </span>
          <span className="text-amber-800">
            真信源已接入：<code className="text-[10.5px] bg-amber-100 px-1 rounded">akshare</code>(A 股财报) · <code className="text-[10.5px] bg-amber-100 px-1 rounded">企查查</code>(工商/IP) · <code className="text-[10.5px] bg-amber-100 px-1 rounded">巨潮</code>(年报) · <code className="text-[10.5px] bg-amber-100 px-1 rounded">国知局</code>(专利) — BP 真实上传后逐项调用
          </span>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
