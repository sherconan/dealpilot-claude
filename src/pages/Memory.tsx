import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { deals } from '../data/deals'
import { StagePill, RecommendationPill } from '../components/StatusPill'

type SortKey = 'score' | 'recent' | 'sector'
type RecFilter = 'all' | 'priority' | 'monitor' | 'conditional' | 'pass'

export default function Memory() {
  const [search, setSearch] = useState('')
  const [recFilter, setRecFilter] = useState<RecFilter>('all')
  const [sort, setSort] = useState<SortKey>('score')
  const [riskOnly, setRiskOnly] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return deals.filter((d) => {
      if (recFilter !== 'all' && d.recommendation !== recFilter) return false
      if (riskOnly && !d.redFlags.some((f) => f.severity === 'hard')) return false
      if (q && !`${d.name} ${d.cnName} ${d.tagline} ${d.sector} ${d.founders.map(f=>f.name).join(' ')}`.toLowerCase().includes(q)) return false
      return true
    }).sort((a, b) => {
      if (sort === 'score') return b.score - a.score
      if (sort === 'sector') return a.sector.localeCompare(b.sector)
      return a.lastUpdated.length - b.lastUpdated.length
    })
  }, [search, recFilter, sort, riskOnly])

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto">
      <header className="mb-5">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">Institutional Memory</div>
            <h1 className="text-[24px] font-semibold tracking-tight mt-1">机构记忆库</h1>
            <p className="text-[13px] text-ink-600 mt-1.5">所有评估过的项目结构化存档 · 创始人再次出现自动召回 · 共 <span className="num font-semibold text-ink-900">{deals.length}</span> 条记录</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400" fill="currentColor"><path d="M11.7 10.6l3 3-1 1-3-3a5.5 5.5 0 11.99-1zM7 11a4 4 0 100-8 4 4 0 000 8z"/></svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索 项目 / 创始人 / 赛道…"
                className="text-[12px] pl-8 pr-3 py-1.5 bg-white border border-ink-200 rounded-lg w-[240px] focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="text-[12px] bg-white border border-ink-200 rounded-lg px-3 py-1.5 focus:outline-none">
              <option value="score">按评分排序</option>
              <option value="sector">按赛道</option>
              <option value="recent">按更新时间</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {([
            ['all', '全部'],
            ['priority', '优先推进'],
            ['monitor', '持续观察'],
            ['conditional', '有条件跟进'],
            ['pass', '建议 Pass'],
          ] as [RecFilter, string][]).map(([k, label]) => (
            <button key={k} onClick={() => setRecFilter(k)} className={`px-2.5 py-1 text-[11px] rounded-md border transition ${recFilter === k ? 'bg-ink-900 text-white border-ink-900' : 'bg-white text-ink-600 border-ink-200 hover:bg-ink-50'}`}>{label}</button>
          ))}
          <label className={`px-2.5 py-1 text-[11px] rounded-md border transition cursor-pointer flex items-center gap-1.5 ${riskOnly ? 'bg-rose-700 text-white border-rose-700' : 'bg-white text-ink-600 border-ink-200 hover:bg-ink-50'}`}>
            <input type="checkbox" checked={riskOnly} onChange={(e) => setRiskOnly(e.target.checked)} className="hidden" />
            硬 Red Flag 项目
          </label>
          <span className="ml-auto text-[11px] text-ink-500 num">命中 {filtered.length} / {deals.length}</span>
        </div>
      </header>

      <div className="bg-white border border-ink-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[120px_1fr_100px_100px_140px_180px_100px_120px] gap-3 px-5 py-3 text-[10px] tracking-wider uppercase text-ink-500 bg-ink-50 border-b border-ink-200">
          <div>评分</div>
          <div>项目</div>
          <div>阶段</div>
          <div>本轮</div>
          <div>赛道</div>
          <div>创始团队 · 来源</div>
          <div>Red Flag</div>
          <div>最后更新</div>
        </div>
        <div className="divide-y divide-ink-100">
          {filtered.length === 0 ? (
            <div className="px-5 py-12 text-center text-[12px] text-ink-400">无匹配项目，调整筛选条件试试</div>
          ) : filtered.map((d) => (
            <Link key={d.id} to={`/deal/${d.id}`} className="grid grid-cols-[120px_1fr_100px_100px_140px_180px_100px_120px] gap-3 px-5 py-3 text-[13px] hover:bg-ink-50 transition items-center">
              <div className="flex items-center gap-2">
                <div className="num font-semibold text-[15px]" style={{ color: d.accentColor }}>{d.score}</div>
                <RecommendationPill rec={d.recommendation} />
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate">{d.name}<span className="text-ink-500 font-normal ml-1.5">{d.cnName}</span></div>
                <div className="text-[11px] text-ink-500 truncate">{d.tagline}</div>
              </div>
              <div><StagePill stage={d.stage} /></div>
              <div className="num text-ink-800">{d.askAmount}</div>
              <div className="text-ink-700">{d.sector}</div>
              <div className="min-w-0">
                <div className="text-[12px] text-ink-700 truncate">{d.founders[0]?.name}{d.founders.length > 1 ? ` +${d.founders.length - 1}` : ''}</div>
                <div className="text-[10px] text-ink-400 truncate">{d.source}</div>
              </div>
              <div>
                {d.redFlags.filter(f => f.severity === 'hard').length > 0
                  ? <span className="text-[11px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-medium">硬 · {d.redFlags.filter(f => f.severity === 'hard').length}</span>
                  : d.redFlags.length > 0
                  ? <span className="text-[11px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">软 · {d.redFlags.length}</span>
                  : <span className="text-[11px] text-emerald-700">干净</span>}
              </div>
              <div className="text-[11px] text-ink-400">{d.lastUpdated}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4 text-[11px] text-ink-500 flex items-center gap-4 flex-wrap">
        <span>结构化字段：公司名 · 创始人 · 赛道 · 拒绝原因 · 评分 · 时间戳</span>
        <span>· 创始人二次出现自动召回 · 防止信息断层错过二次机会</span>
      </div>
    </div>
  )
}
