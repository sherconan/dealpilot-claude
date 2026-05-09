import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { REAL_DEALS, REAL_DECISION_PACKS } from '../data/realDeals'

const SEQUOIA_KEYS = [
  { key: 'mission', label: '使命' },
  { key: 'problem', label: '问题' },
  { key: 'solution', label: '方案' },
  { key: 'whyNow', label: '时机' },
  { key: 'market', label: '市场' },
  { key: 'competition', label: '竞争' },
  { key: 'businessModel', label: '商业' },
  { key: 'team', label: '团队' },
  { key: 'financials', label: '财务' },
  { key: 'vision', label: '愿景' },
] as const

type SortKey = 'score' | 'valuation' | 'foundedYear' | 'team'
type FilterSig = 'all' | 'GREEN' | 'YELLOW' | 'RED'

function sigOf(score: number): 'GREEN' | 'YELLOW' | 'RED' {
  return score >= 80 ? 'GREEN' : score >= 65 ? 'YELLOW' : 'RED'
}

export default function RealDeals() {
  const [sortBy, setSortBy] = useState<SortKey>('score')
  const [filter, setFilter] = useState<FilterSig>('all')

  useEffect(() => {
    document.title = '真实公开公司库 · DealPilot'
  }, [])

  const sortedDeals = useMemo(() => {
    let arr = [...REAL_DEALS]
    if (filter !== 'all') arr = arr.filter(d => sigOf(d.score) === filter)
    arr.sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score
      if (sortBy === 'foundedYear') return a.foundedYear - b.foundedYear
      if (sortBy === 'team') return b.teamSize - a.teamSize
      return a.name.localeCompare(b.name)
    })
    return arr
  }, [sortBy, filter])

  // 聚合统计
  const stats = useMemo(() => {
    const total = REAL_DEALS.length
    const greenCount = REAL_DEALS.filter(d => sigOf(d.score) === 'GREEN').length
    const yellowCount = REAL_DEALS.filter(d => sigOf(d.score) === 'YELLOW').length
    const avgScore = Math.round(REAL_DEALS.reduce((s, d) => s + d.score, 0) / total)
    const totalTeam = REAL_DEALS.reduce((s, d) => s + d.teamSize, 0)
    const totalRedFlags = REAL_DEALS.reduce((s, d) => s + d.redFlags.length, 0)
    const hardFlags = REAL_DEALS.reduce((s, d) => s + d.redFlags.filter(f => f.severity === 'hard').length, 0)
    return { total, greenCount, yellowCount, avgScore, totalTeam, totalRedFlags, hardFlags }
  }, [])

  return (
    <div className="px-4 md:px-8 py-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <header className="mb-5">
        <div className="text-[11px] tracking-[0.16em] text-emerald-700 uppercase font-medium">⚡ Real Deals · Public Companies</div>
        <h1 className="text-[28px] font-semibold tracking-tight mt-1">真实公开公司库</h1>
        <p className="text-[13.5px] text-ink-700 mt-1.5 max-w-3xl leading-relaxed">
          {stats.total} 家中国大模型创业公司决策包矩阵 · 基于 2024-2025 公开新闻 + 工商信息 + 团队履历 + VC 经验整合 ·
          每份决策包含 10 段深度分析 / Sequoia 10 评分 / 8 题创始人访谈 / Reference Check
        </p>
      </header>

      {/* 5 KPI 卡 */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        <div className="bg-white border border-emerald-200 rounded-xl p-3.5">
          <div className="text-[10px] uppercase tracking-wider text-emerald-700 font-medium">真实公司</div>
          <div className="num font-semibold text-[24px] tracking-tight mt-1 text-emerald-700">{stats.total}</div>
          <div className="text-[10.5px] text-ink-500 mt-0.5">国内大模型 6 强</div>
        </div>
        <div className="bg-white border border-ink-200 rounded-xl p-3.5">
          <div className="text-[10px] uppercase tracking-wider text-ink-500">🟢 推荐进会</div>
          <div className="num font-semibold text-[24px] tracking-tight mt-1 text-emerald-700">{stats.greenCount}</div>
          <div className="text-[10.5px] text-ink-500 mt-0.5">综合 ≥ 80 分</div>
        </div>
        <div className="bg-white border border-ink-200 rounded-xl p-3.5">
          <div className="text-[10px] uppercase tracking-wider text-ink-500">🟡 附条件</div>
          <div className="num font-semibold text-[24px] tracking-tight mt-1 text-amber-700">{stats.yellowCount}</div>
          <div className="text-[10.5px] text-ink-500 mt-0.5">65-79 分</div>
        </div>
        <div className="bg-white border border-ink-200 rounded-xl p-3.5">
          <div className="text-[10px] uppercase tracking-wider text-ink-500">平均分</div>
          <div className="num font-semibold text-[24px] tracking-tight mt-1">{stats.avgScore}</div>
          <div className="text-[10.5px] text-ink-500 mt-0.5">/ 100 Sequoia 加权</div>
        </div>
        <div className="bg-white border border-ink-200 rounded-xl p-3.5">
          <div className="text-[10px] uppercase tracking-wider text-ink-500">合计团队</div>
          <div className="num font-semibold text-[24px] tracking-tight mt-1">{stats.totalTeam.toLocaleString()}</div>
          <div className="text-[10.5px] text-ink-500 mt-0.5">人 · 红线 {stats.totalRedFlags}（{stats.hardFlags} 硬）</div>
        </div>
      </section>

      {/* 控制条 */}
      <section className="bg-white border border-ink-200 rounded-xl p-3 mb-5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-ink-500">筛选:</span>
          {(['all', 'GREEN', 'YELLOW', 'RED'] as FilterSig[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 text-[12px] rounded-md transition ${
                filter === f ? 'bg-ink-900 text-white' : 'bg-ink-50 text-ink-700 hover:bg-ink-100'
              }`}
            >
              {f === 'all' ? '全部' : f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-ink-500">排序:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="text-[12px] bg-white border border-ink-200 rounded-md px-2 py-1"
          >
            <option value="score">综合评分</option>
            <option value="valuation">估值</option>
            <option value="foundedYear">成立时间</option>
            <option value="team">团队规模</option>
          </select>
        </div>
      </section>

      {/* 公司卡片 grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {sortedDeals.map(d => {
          const sig = sigOf(d.score)
          const dp = REAL_DECISION_PACKS[d.id]
          const sigColor = sig === 'GREEN' ? 'emerald' : sig === 'YELLOW' ? 'amber' : 'rose'
          return (
            <article key={d.id} className={`bg-white border-2 border-${sigColor}-300 rounded-2xl p-4 hover:shadow-pop transition`}>
              <header className="flex items-start justify-between mb-3 gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-[18px] font-semibold tracking-tight">
                    {d.name} <span className="text-ink-500 font-normal">· {d.cnName}</span>
                  </h2>
                  <p className="text-[12px] text-ink-600 mt-0.5 truncate">{d.tagline}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-[11px] text-ink-500">
                    <span>{d.round}</span>
                    <span>·</span>
                    <span className="font-medium text-ink-700">{d.valuation}</span>
                    <span>·</span>
                    <span>{d.location}</span>
                    <span>·</span>
                    <span>{d.teamSize} 人</span>
                  </div>
                </div>
                <div className={`shrink-0 text-center bg-${sigColor}-50 border border-${sigColor}-300 rounded-lg p-2 min-w-[64px]`}>
                  <div className={`text-[10px] uppercase tracking-wider text-${sigColor}-700 font-medium`}>{sig}</div>
                  <div className={`num text-[24px] font-semibold text-${sigColor}-700`}>{d.score}</div>
                </div>
              </header>

              {/* Sequoia 10 spark line */}
              <div className="grid grid-cols-10 gap-0.5 mb-3 h-12 items-end">
                {SEQUOIA_KEYS.map(k => {
                  const score = (d.sequoia as any)[k.key] as number
                  const h = (score / 10) * 100
                  const color = score >= 8 ? 'bg-emerald-500' : score >= 6 ? 'bg-amber-500' : 'bg-rose-500'
                  return (
                    <div key={k.key} className="flex flex-col items-center justify-end" title={`${k.label}: ${score}/10`}>
                      <div className={`w-full ${color} rounded-sm`} style={{ height: `${h}%` }} />
                      <div className="text-[8px] text-ink-400 mt-0.5">{k.label}</div>
                    </div>
                  )
                })}
              </div>

              {/* Verdict */}
              <div className={`bg-${sigColor}-50 rounded-lg p-2.5 mb-3`}>
                <div className={`text-[11px] font-semibold text-${sigColor}-800`}>{dp.verdict.label}</div>
                <div className={`text-[10.5px] text-${sigColor}-700 mt-0.5 leading-relaxed`}>{dp.verdict.reason}</div>
              </div>

              {/* 创始人 + 红线行 */}
              <div className="flex items-center justify-between text-[11px] mb-3">
                <span className="text-ink-700 truncate flex-1 mr-2">
                  <span className="text-ink-400">创始人</span> {d.founders[0]?.name}
                  {d.founders.length > 1 ? ` +${d.founders.length - 1}` : ''}
                </span>
                <span className="text-ink-700 shrink-0">
                  <span className="text-ink-400">红线</span>{' '}
                  {d.redFlags.filter(f => f.severity === 'hard').length > 0 && (
                    <span className="text-rose-700 font-medium">硬 {d.redFlags.filter(f => f.severity === 'hard').length}</span>
                  )}
                  {d.redFlags.filter(f => f.severity === 'hard').length > 0 && d.redFlags.filter(f => f.severity === 'soft').length > 0 && ' · '}
                  {d.redFlags.filter(f => f.severity === 'soft').length > 0 && (
                    <span className="text-amber-700">软 {d.redFlags.filter(f => f.severity === 'soft').length}</span>
                  )}
                  {d.redFlags.length === 0 && <span className="text-emerald-700">干净</span>}
                </span>
              </div>

              {/* 操作行 */}
              <div className="flex items-center gap-2">
                <Link
                  to={`/deal/${d.id}/decision-pack`}
                  className={`flex-1 text-center px-3 py-1.5 text-[12px] rounded-md bg-${sigColor}-600 text-white hover:bg-${sigColor}-700 font-medium`}
                >
                  ⚡ 30 分钟决策包
                </Link>
                <Link
                  to={`/deal/${d.id}`}
                  className="px-3 py-1.5 text-[12px] rounded-md border border-ink-200 hover:bg-ink-50"
                >
                  详情
                </Link>
              </div>
            </article>
          )
        })}
      </section>

      {/* Sequoia 10 横向对比矩阵 */}
      <section className="bg-white border border-ink-200 rounded-2xl p-4 mb-5 overflow-x-auto">
        <header className="mb-3 flex items-baseline justify-between flex-wrap gap-2">
          <h2 className="text-[16px] font-semibold tracking-tight">Sequoia 10 维度横向对比矩阵</h2>
          <span className="text-[11px] text-ink-400">行 = {sortedDeals.length} 家公司 · 列 = 10 个维度评分（颜色越深分越高）</span>
        </header>
        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-left text-[10px] text-ink-500 uppercase tracking-wider">
              <th className="px-2 py-2 font-medium">公司</th>
              {SEQUOIA_KEYS.map(k => (
                <th key={k.key} className="px-1 py-2 font-medium text-center">{k.label}</th>
              ))}
              <th className="px-2 py-2 font-medium text-right">综合</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {sortedDeals.map(d => (
              <tr key={d.id} className="hover:bg-ink-50/50">
                <td className="px-2 py-2 font-medium whitespace-nowrap">
                  <Link to={`/deal/${d.id}/decision-pack`} className="hover:text-emerald-700">
                    {d.name}
                  </Link>
                </td>
                {SEQUOIA_KEYS.map(k => {
                  const score = (d.sequoia as any)[k.key] as number
                  const bg = score >= 8 ? 'bg-emerald-100 text-emerald-900' : score >= 6 ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-900'
                  return (
                    <td key={k.key} className="px-1 py-2 text-center">
                      <span className={`inline-block w-7 num text-[11px] font-semibold rounded ${bg}`}>{score}</span>
                    </td>
                  )
                })}
                <td className="px-2 py-2 text-right num font-semibold">{d.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* CTA 投决工具 */}
      <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
        <div className="text-[11px] uppercase tracking-wider text-emerald-700 font-medium mb-2">⚡ 基于决策包继续投决流程</div>
        <div className="flex flex-wrap gap-3">
          <Link to="/termsheet" className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">起草 Term Sheet →</Link>
          <Link to="/captable" className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">模拟 Cap Table 稀释 →</Link>
          <Link to="/compare" className="px-4 py-2 text-sm border border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-100 font-medium">横向对比</Link>
          <Link to="/upload" className="px-4 py-2 text-sm border border-ink-200 rounded-lg hover:bg-ink-50">上传你的真 BP</Link>
        </div>
      </section>

      <footer className="mt-6 text-[11px] text-ink-500 leading-relaxed">
        <div>⚠️ 数据来源：2024-2025 公开新闻 + 公司官网 + 爱企查工商 + 团队公开履历 + VC 经验综合产出。</div>
        <div className="mt-1">不构成投资建议；任何决策需经完整尽调流程。</div>
      </footer>
    </div>
  )
}
