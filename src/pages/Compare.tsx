import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { deals } from '../data/deals'
import { sequoiaLabels, recommendationMeta } from '../lib/scoring'
import type { Deal, Sequoia10 } from '../types'

export default function Compare() {
  const [selected, setSelected] = useState<string[]>([deals[0].id, deals[1].id, deals[2].id])

  function toggle(id: string) {
    setSelected((s) => {
      if (s.includes(id)) return s.filter((x) => x !== id)
      if (s.length >= 3) return [...s.slice(1), id]
      return [...s, id]
    })
  }

  const list: Deal[] = useMemo(() => selected.map((id) => deals.find((d) => d.id === id)!).filter(Boolean), [selected])

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto">
      <header className="mb-5">
        <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">Compare · Side-by-Side</div>
        <h1 className="text-[26px] font-semibold tracking-tight mt-1">项目横向对比</h1>
        <p className="text-[13.5px] text-ink-700 mt-1.5 max-w-3xl leading-relaxed">
          最多选 3 个 BP 并排比较：综合评分 + Sequoia 10 要素 + Red Flag + Traction + 估值 — IC 前快速锁定决策颗粒度
        </p>
      </header>

      <section className="bg-white border border-ink-200 rounded-xl p-4 mb-5">
        <div className="text-[11px] uppercase tracking-wider text-ink-500 mb-2">选择项目（最多 3 个）</div>
        <div className="flex items-center gap-2 flex-wrap">
          {deals.map((d) => {
            const on = selected.includes(d.id)
            return (
              <button
                key={d.id}
                onClick={() => toggle(d.id)}
                className={`px-3 py-1.5 text-[12px] rounded-lg border transition ${
                  on ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-ink-700 border-ink-200 hover:bg-ink-50'
                }`}
              >
                {d.name} <span className="num text-[11px] opacity-80 ml-1">{d.score}</span>
              </button>
            )
          })}
        </div>
      </section>

      {list.length === 0 ? (
        <div className="text-center py-12 text-ink-400 text-[13px]">至少选择 1 个项目</div>
      ) : (
        <>
          {/* 顶部对比卡 */}
          <section className={`grid gap-4 mb-5`} style={{ gridTemplateColumns: `repeat(${list.length}, minmax(0, 1fr))` }}>
            {list.map((d) => {
              const recMeta = recommendationMeta[d.recommendation]
              const hard = d.redFlags.filter((f) => f.severity === 'hard').length
              const soft = d.redFlags.filter((f) => f.severity === 'soft').length
              return (
                <div key={d.id} className="bg-white border border-ink-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-[13px] shrink-0" style={{ background: d.accentColor }}>
                      {d.name.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/deal/${d.id}`} className="font-semibold text-[15px] tracking-tight hover:text-brand-700 truncate block">{d.name}</Link>
                      <div className="text-[11px] text-ink-500 truncate">{d.cnName} · {d.sector} · {d.round}</div>
                    </div>
                  </div>
                  <div className="flex items-end gap-3 mt-4">
                    <div className="num font-semibold text-[36px] tracking-tight" style={{ color: d.accentColor }}>{d.score}</div>
                    <div className="text-[10px] text-ink-400 mb-1.5 tracking-wider uppercase">/ 100</div>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full ${recMeta.bg} font-medium mt-1`} style={{ color: recMeta.color }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: recMeta.color }} />
                    {recMeta.label}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                    <Stat k="估值" v={d.valuation} />
                    <Stat k="本轮" v={d.askAmount} />
                    <Stat k="ARR" v={d.arr || '—'} />
                    <Stat k="增速" v={d.growthRate || '—'} />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {hard > 0 && <span className="text-[10px] px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded font-medium">硬 {hard}</span>}
                    {soft > 0 && <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded font-medium">软 {soft}</span>}
                    {hard === 0 && soft === 0 && <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded font-medium">无 Red Flag</span>}
                  </div>
                </div>
              )
            })}
          </section>

          {/* Sequoia 10 要素并排横条 */}
          <section className="bg-white border border-ink-200 rounded-xl p-5 mb-5">
            <h2 className="text-[15px] font-semibold tracking-tight mb-3">Sequoia 10 要素 · 并排</h2>
            <div className="space-y-3">
              {sequoiaLabels.map((s) => (
                <div key={s.key}>
                  <div className="text-[12.5px] font-medium text-ink-900">{s.label}</div>
                  <div className="grid gap-2 mt-1.5" style={{ gridTemplateColumns: `repeat(${list.length}, minmax(0, 1fr))` }}>
                    {list.map((d) => {
                      const v = d.sequoia[s.key as keyof Sequoia10]
                      return (
                        <div key={d.id} className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-ink-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${v * 10}%`, background: d.accentColor }} />
                          </div>
                          <span className="num text-[11px] w-8 text-right font-medium" style={{ color: d.accentColor }}>{v}/10</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Red Flags 并排 */}
          <section className="bg-white border border-ink-200 rounded-xl p-5 mb-5">
            <h2 className="text-[15px] font-semibold tracking-tight mb-3">Red Flag 并排</h2>
            <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${list.length}, minmax(0, 1fr))` }}>
              {list.map((d) => (
                <div key={d.id}>
                  <div className="text-[12px] text-ink-500 mb-2">{d.name}</div>
                  {d.redFlags.length === 0 ? (
                    <div className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-2.5 py-1.5">未发现 Red Flag</div>
                  ) : (
                    <ul className="space-y-1.5">
                      {d.redFlags.map((f, i) => (
                        <li key={i} className={`text-[11px] px-2 py-1 rounded ${f.severity === 'hard' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>
                          <span className="font-semibold">[{f.severity === 'hard' ? '硬' : '软'}]</span> {f.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 量化指标并排 */}
          <section className="bg-white border border-ink-200 rounded-xl overflow-hidden">
            <table className="w-full text-[12.5px]">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-ink-500 border-b border-ink-200 bg-ink-50">
                  <th className="text-left py-2.5 px-4">指标</th>
                  {list.map((d) => (
                    <th key={d.id} className="text-right py-2.5 px-4 font-medium" style={{ color: d.accentColor }}>{d.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {[
                  ['ARR', (d: Deal) => d.arr || '—'],
                  ['增长率', (d: Deal) => d.growthRate || '—'],
                  ['LTV / CAC', (d: Deal) => d.ltvCac ? `${d.ltvCac}x` : '—'],
                  ['CAC 回收期', (d: Deal) => d.cacPayback || '—'],
                  ['毛利率', (d: Deal) => d.grossMargin || '—'],
                  ['团队人数', (d: Deal) => `${d.teamSize}`],
                  ['成立年份', (d: Deal) => `${d.foundedYear}`],
                  ['TAM', (d: Deal) => d.tam],
                  ['SAM', (d: Deal) => d.sam],
                  ['冠军合伙人', (d: Deal) => d.champion || '—'],
                  ['来源', (d: Deal) => d.source],
                ].map(([label, fn], i) => (
                  <tr key={i}>
                    <td className="py-2.5 px-4 text-ink-500">{label as string}</td>
                    {list.map((d) => (
                      <td key={d.id} className="text-right py-2.5 px-4 num text-ink-900">{(fn as any)(d)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  )
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-ink-50 rounded px-2 py-1">
      <div className="text-[10px] text-ink-500">{k}</div>
      <div className="text-[12px] font-medium num truncate">{v}</div>
    </div>
  )
}
