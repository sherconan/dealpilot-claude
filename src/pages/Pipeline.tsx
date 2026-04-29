import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { deals } from '../data/deals'
import { stageMeta } from '../lib/scoring'
import type { Stage } from '../types'

const columns: { stage: Stage; description: string; passRate: string }[] = [
  { stage: 'inbox', description: '5–15 分钟速读 · 通过率 ~2%', passRate: '2%' },
  { stage: 'review', description: '合伙人跟进 · 深度行研', passRate: '20%' },
  { stage: 'dd', description: '尽调 2–4 周 · 客户 / 技术 / 团队', passRate: '50%' },
  { stage: 'ic', description: '投委会审批 · 1 次 IC', passRate: '60%' },
  { stage: 'invested', description: '已投决 · 交割 / 投后', passRate: '—' },
  { stage: 'pass', description: '已 Pass · 保留机构记忆', passRate: '—' },
]

type ScoreFilter = 'all' | '85+' | '70-85' | '50-70' | '<50'
type SortKey = 'score' | 'recent' | 'valuation'

export default function Pipeline() {
  const [sector, setSector] = useState<string>('all')
  const [search, setSearch] = useState<string>('')
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>('all')
  const [sort, setSort] = useState<SortKey>('score')

  const grouped = useMemo(() => {
    const g: Record<string, typeof deals> = {}
    columns.forEach((c) => (g[c.stage] = []))
    const q = search.trim().toLowerCase()
    const matchScore = (s: number) => {
      if (scoreFilter === 'all') return true
      if (scoreFilter === '85+') return s >= 85
      if (scoreFilter === '70-85') return s >= 70 && s < 85
      if (scoreFilter === '50-70') return s >= 50 && s < 70
      if (scoreFilter === '<50') return s < 50
      return true
    }
    const filtered = deals.filter((d) => {
      if (sector !== 'all' && d.sector !== sector) return false
      if (!matchScore(d.score)) return false
      if (q && !(d.name.toLowerCase().includes(q) || d.cnName.toLowerCase().includes(q) || d.tagline.toLowerCase().includes(q))) return false
      return true
    })
    const sortFn = (a: typeof deals[number], b: typeof deals[number]) => {
      if (sort === 'score') return b.score - a.score
      if (sort === 'valuation') {
        const parse = (v: string) => parseFloat(v.replace(/[^0-9.]/g, '')) || 0
        return parse(b.valuation) - parse(a.valuation)
      }
      // recent: 时间字符串里的中文长度近似
      return a.lastUpdated.length - b.lastUpdated.length
    }
    filtered.sort(sortFn).forEach((d) => g[d.stage].push(d))
    return g
  }, [sector, search, scoreFilter, sort])

  const sectors = Array.from(new Set(deals.map((d) => d.sector)))
  const total = Object.values(grouped).reduce((s, list) => s + list.length, 0)

  return (
    <div className="px-8 py-6 max-w-[1800px] mx-auto">
      <header className="mb-5">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">Pipeline · Kanban</div>
            <h1 className="text-[24px] font-semibold tracking-tight mt-1">漏斗看板</h1>
            <p className="text-[13px] text-ink-600 mt-1">6 阶段流转 · 共 <span className="num font-semibold text-ink-900">{total}</span> 个项目</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400" fill="currentColor"><path d="M11.7 10.6l3 3-1 1-3-3a5.5 5.5 0 11.99-1zM7 11a4 4 0 100-8 4 4 0 000 8z"/></svg>
              <input
                type="text"
                placeholder="搜索名称 / 中文 / 一句话简介…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-[12px] pl-8 pr-3 py-1.5 bg-white border border-ink-200 rounded-lg w-[220px] focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
            <div className="flex items-center gap-1 bg-white border border-ink-200 rounded-lg p-1">
              {(['all', '85+', '70-85', '50-70', '<50'] as ScoreFilter[]).map((s) => (
                <button key={s} onClick={() => setScoreFilter(s)} className={`px-2.5 py-1 text-[11px] rounded-md transition num ${scoreFilter === s ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-100'}`}>
                  {s === 'all' ? '全部' : s}
                </button>
              ))}
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="text-[12px] bg-white border border-ink-200 rounded-lg px-3 py-1.5 focus:outline-none">
              <option value="score">按评分排序</option>
              <option value="valuation">按估值排序</option>
              <option value="recent">按更新时间</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1 flex-wrap">
          <button onClick={() => setSector('all')} className={`px-2.5 py-1 text-[11px] rounded-md border transition ${sector === 'all' ? 'bg-ink-900 text-white border-ink-900' : 'bg-white text-ink-600 border-ink-200 hover:bg-ink-50'}`}>全部赛道</button>
          {sectors.map((s) => (
            <button key={s} onClick={() => setSector(s)} className={`px-2.5 py-1 text-[11px] rounded-md border transition ${sector === s ? 'bg-ink-900 text-white border-ink-900' : 'bg-white text-ink-600 border-ink-200 hover:bg-ink-50'}`}>{s}</button>
          ))}
        </div>
      </header>

      <div className="flex gap-4 overflow-x-auto scrollbar-thin pb-4">
        {columns.map((col) => {
          const m = stageMeta[col.stage]
          const list = grouped[col.stage]
          return (
            <div key={col.stage} className="w-[280px] shrink-0">
              <div className="flex items-center justify-between mb-2.5 px-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />
                  <span className="font-medium text-[13px]">{m.label}</span>
                  <span className="num text-[11px] text-ink-500">{list.length}</span>
                </div>
                <span className="text-[10px] text-ink-400 num">{col.passRate}</span>
              </div>
              <div className="text-[11px] text-ink-500 mb-2 px-1 leading-relaxed">{col.description}</div>
              <div className={`space-y-2 min-h-[200px] rounded-lg p-1.5 border border-dashed ${m.border}/40`}>
                {list.length === 0 ? (
                  <div className="text-[12px] text-ink-400 text-center py-10">—</div>
                ) : list.map((d) => (
                  <Link key={d.id} to={`/deal/${d.id}`} className="block bg-white border border-ink-200 rounded-lg p-3 hover:shadow-pop hover:border-brand-500/50 transition">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold text-[13px] truncate">{d.name}</div>
                        <div className="text-[11px] text-ink-500 mt-0.5 truncate">{d.sector} · {d.round}</div>
                      </div>
                      <div className="num font-semibold text-[16px]" style={{ color: d.accentColor }}>{d.score}</div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-ink-400">
                      <span className="num">{d.askAmount} · {d.valuation}</span>
                      <span>{d.lastUpdated}</span>
                    </div>
                    {d.redFlags.some((f) => f.severity === 'hard') && (
                      <div className="mt-2 text-[10px] text-rose-700 bg-rose-50 rounded px-1.5 py-0.5 inline-flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-rose-600" /> 硬 Red Flag
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
