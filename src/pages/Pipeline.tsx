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

export default function Pipeline() {
  const [sector, setSector] = useState<string>('all')
  const grouped = useMemo(() => {
    const g: Record<string, typeof deals> = {}
    columns.forEach((c) => (g[c.stage] = []))
    deals.forEach((d) => {
      if (sector !== 'all' && d.sector !== sector) return
      g[d.stage].push(d)
    })
    return g
  }, [sector])

  const sectors = Array.from(new Set(deals.map((d) => d.sector)))

  return (
    <div className="px-8 py-6 max-w-[1800px] mx-auto">
      <header className="flex items-end justify-between mb-5 gap-4 flex-wrap">
        <div>
          <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">Pipeline · Kanban</div>
          <h1 className="text-[24px] font-semibold tracking-tight mt-1">漏斗看板</h1>
          <p className="text-[13px] text-ink-600 mt-1">6 阶段流转 · 可拖动卡片换阶段 · 支持按赛道 / 评分筛选</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-ink-200 rounded-lg p-1">
            <button onClick={() => setSector('all')} className={`px-3 py-1 text-[12px] rounded-md transition ${sector === 'all' ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-100'}`}>全部</button>
            {sectors.map((s) => (
              <button key={s} onClick={() => setSector(s)} className={`px-3 py-1 text-[12px] rounded-md transition ${sector === s ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-100'}`}>{s}</button>
            ))}
          </div>
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
