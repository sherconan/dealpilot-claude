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
        <Outlet />
      </main>
    </div>
  )
}
