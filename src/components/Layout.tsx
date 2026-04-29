import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { deals } from '../data/deals'
import { useApp } from '../contexts/AppContext'
import CommandPalette from './CommandPalette'
import HelpModal from './HelpModal'

export default function Layout() {
  const { t, lang, theme, toggleLang, toggleTheme } = useApp()
  const loc = useLocation()
  const priorityDeals = deals.filter((d) => d.recommendation === 'priority').slice(0, 3)

  const workspace = [
    { to: '/', label: t('nav.dashboard'), hint: t('nav.dashboard.hint') },
    { to: '/pipeline', label: t('nav.pipeline'), hint: t('nav.pipeline.hint') },
    { to: '/portfolio', label: t('nav.portfolio'), hint: t('nav.portfolio.hint') },
    { to: '/briefings', label: t('nav.briefings'), hint: t('nav.briefings.hint') },
  ]
  const tools = [
    { to: '/upload', label: t('nav.upload'), hint: t('nav.upload.hint') },
    { to: '/compare', label: t('nav.compare'), hint: t('nav.compare.hint') },
    { to: '/risk', label: t('nav.risk'), hint: t('nav.risk.hint') },
    { to: '/signals', label: t('nav.signals'), hint: t('nav.signals.hint') },
    { to: '/thesis', label: t('nav.thesis'), hint: t('nav.thesis.hint') },
    { to: '/memory', label: t('nav.memory'), hint: t('nav.memory.hint') },
    { to: '/sources', label: t('nav.sources'), hint: t('nav.sources.hint') },
    { to: '/docs', label: t('nav.docs'), hint: t('nav.docs.hint') },
  ]

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
              <div className="font-semibold text-[15px] tracking-tight">{t('brand.title')}</div>
              <div className="text-[11px] text-ink-500 tracking-wide">{t('brand.tagline')}</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 scrollbar-thin overflow-y-auto">
          <div className="text-[10px] font-medium text-ink-400 tracking-[0.14em] uppercase px-3 py-2">{t('nav.workspace')}</div>
          {workspace.map((it) => (
            <NavItem key={it.to} {...it} />
          ))}

          <div className="text-[10px] font-medium text-ink-400 tracking-[0.14em] uppercase px-3 pt-4 pb-2">{t('nav.tools')}</div>
          {tools.map((it) => (
            <NavItem key={it.to} {...it} />
          ))}

          <div className="text-[10px] font-medium text-ink-400 tracking-[0.14em] uppercase px-3 pt-4 pb-2">{t('nav.priority')}</div>
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

        <div className="p-3 border-t border-ink-200 space-y-2">
          <button
            onClick={() => {
              const ev = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
              window.dispatchEvent(ev)
            }}
            className="w-full px-3 py-1.5 text-[11px] rounded-md border border-ink-200 hover:bg-ink-50 transition flex items-center justify-between text-ink-600"
          >
            <span className="inline-flex items-center gap-1.5">
              <svg viewBox="0 0 16 16" className="w-3 h-3" fill="currentColor"><path d="M11.7 10.6l3 3-1 1-3-3a5.5 5.5 0 11.99-1zM7 11a4 4 0 100-8 4 4 0 000 8z"/></svg>
              快速搜索
            </span>
            <kbd className="text-[9px] bg-ink-100 border border-ink-200 px-1 rounded num">⌘ K</kbd>
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleLang}
              title={lang === 'zh' ? 'Switch to English' : '切换到中文'}
              className="flex-1 px-2 py-1.5 text-[11px] font-medium rounded-md border border-ink-200 hover:bg-ink-50 transition flex items-center justify-center gap-1.5"
            >
              <svg viewBox="0 0 16 16" className="w-3 h-3" fill="currentColor"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM2.5 8a5.5 5.5 0 011.5-3.78c.42.74.74 1.6.94 2.55h-2.4A5.46 5.46 0 002.5 8zm.04.77h2.5c-.06.43-.1.88-.1 1.34 0 .58.06 1.14.16 1.66H4.04A5.46 5.46 0 012.54 8.77zM5.32 4c.7-.94 1.6-1.62 2.6-1.92-.31.5-.55 1.13-.74 1.92H5.32zm-.34 0H3.55A5.5 5.5 0 015 2.96 7.4 7.4 0 004.98 4zM5.6 4.77H8v1.5H5.39c.05-.51.13-1.02.21-1.5zM8 7.04v1.73H5.4c-.06-.5-.1-1.03-.1-1.59 0-.05 0-.09.01-.14H8zM5.78 9.5H8v1.5H6.05c-.13-.5-.22-1-.27-1.5zM8 11.77v1.92c-.84-.27-1.6-.86-2.2-1.7l-.07-.22H8zm.77 0h2.27c-.62.97-1.42 1.66-2.27 1.92v-1.92zm0-.77V9.5h2.34c-.06.5-.15 1-.27 1.5H8.77zm0-2.23V7.04h2.7v.14c0 .56-.04 1.09-.1 1.59H8.77zm0-2.27v-1.5H10.4c.08.48.16.99.21 1.5H8.77zM8.77 4V2.08c1 .3 1.9.98 2.6 1.92H8.77zm2.95 0a7.4 7.4 0 00-.78-1.04A5.5 5.5 0 0112.45 4h-.73zm.4.77h2.4c.27.6.43 1.27.45 1.97h-2.4c-.05-.71-.2-1.38-.45-1.97zm0 4.46c.25-.59.4-1.26.45-1.96h2.4c-.02.7-.18 1.37-.45 1.96h-2.4zM4.04 11.23h2.13c.07.32.16.62.27.92H4.4a5.5 5.5 0 01-.36-.92zm6.8 0h2.13a5.5 5.5 0 01-.36.92h-2.04c.1-.3.2-.6.27-.92z"/></svg>
              {lang === 'zh' ? 'EN' : '中'}
            </button>
            <button
              onClick={toggleTheme}
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
              className="flex-1 px-2 py-1.5 text-[11px] font-medium rounded-md border border-ink-200 hover:bg-ink-50 transition flex items-center justify-center gap-1.5"
            >
              {theme === 'light' ? (
                <svg viewBox="0 0 16 16" className="w-3 h-3" fill="currentColor"><path d="M8 6a2 2 0 100 4 2 2 0 000-4zM8 1a.75.75 0 01.75.75v.5a.75.75 0 01-1.5 0v-.5A.75.75 0 018 1zm0 11.5a.75.75 0 01.75.75v.5a.75.75 0 01-1.5 0v-.5a.75.75 0 01.75-.75zM2 8a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5A.75.75 0 012 8zm10.75-.75a.75.75 0 000 1.5h.5a.75.75 0 000-1.5h-.5zM3.4 3.4a.75.75 0 011.06 0l.36.36a.75.75 0 01-1.06 1.06l-.36-.36a.75.75 0 010-1.06zm7.78 7.78a.75.75 0 011.06 0l.36.36a.75.75 0 11-1.06 1.06l-.36-.36a.75.75 0 010-1.06zM3.4 12.6a.75.75 0 010-1.06l.36-.36a.75.75 0 011.06 1.06l-.36.36a.75.75 0 01-1.06 0zm7.78-7.78a.75.75 0 010-1.06l.36-.36a.75.75 0 011.06 1.06l-.36.36a.75.75 0 01-1.06 0z"/></svg>
              ) : (
                <svg viewBox="0 0 16 16" className="w-3 h-3" fill="currentColor"><path d="M6.95 1.21a.75.75 0 01.46.97A4.5 4.5 0 0013.82 8.6a.75.75 0 011.43.46 6 6 0 11-9.27-7.85.75.75 0 01.97.0z"/></svg>
              )}
              {theme === 'light' ? t('theme.dark') : t('theme.light')}
            </button>
          </div>
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white text-xs font-semibold">HZ</div>
            <div className="flex-1">
              <div className="text-sm font-medium">Henry Zhao</div>
              <div className="text-[11px] text-ink-500">Partner · 早期 / AI</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto scrollbar-thin flex flex-col">
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 text-[11.5px] text-amber-900 flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0" fill="currentColor"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM7.25 5a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0V5zM8 12a1 1 0 110-2 1 1 0 010 2z"/></svg>
            {t('disclaimer.title')}
          </span>
          <span className="text-amber-800">{t('disclaimer.body')}</span>
          <span className="text-amber-800">
            {t('disclaimer.sources')}: <code className="text-[10.5px] bg-amber-100 px-1 rounded">akshare</code> · <code className="text-[10.5px] bg-amber-100 px-1 rounded">qcc</code> · <code className="text-[10.5px] bg-amber-100 px-1 rounded">cninfo</code> · <code className="text-[10.5px] bg-amber-100 px-1 rounded">SIPO</code>
          </span>
          <Link to="/changelog" className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-brand-700 hover:underline">
            7h Challenge · 18 Sprints →
          </Link>
        </div>
        <Outlet />
        <footer className="mt-auto border-t border-ink-200 px-6 py-4 text-[11px] text-ink-500 flex items-center justify-between flex-wrap gap-3 no-print">
          <div className="flex items-center gap-3 flex-wrap">
            <span>© 2026 DealPilot · 仅用于产品演示，不构成投资建议</span>
            <a href="https://github.com/sherconan/dealpilot-claude" target="_blank" className="hover:text-brand-700">GitHub</a>
            <Link to="/docs" className="hover:text-brand-700">方法论</Link>
            <Link to="/sources" className="hover:text-brand-700">真信源</Link>
            <Link to="/changelog" className="hover:text-brand-700">7h Challenge</Link>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="bg-ink-100 border border-ink-200 px-1.5 py-0.5 rounded num">⌘ K</kbd>
            <span>唤起命令面板</span>
          </div>
        </footer>
      </main>
      <CommandPalette />
      <HelpModal />
    </div>
  )
}

function NavItem({ to, label, hint }: { to: string; label: string; hint: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
          isActive ? 'bg-brand-50 text-brand-800 font-medium' : 'text-ink-700 hover:bg-ink-100'
        }`
      }
    >
      <span>{label}</span>
      <span className="text-[10px] text-ink-400">{hint}</span>
    </NavLink>
  )
}
