import { Link, useParams } from 'react-router-dom'
import { getDealById } from '../data/deals'
import { getDealExtra } from '../data/extra'
import { recommendationMeta } from '../lib/scoring'

export default function DealBrief() {
  const { id } = useParams()
  const deal = getDealById(id || '')
  const extra = getDealExtra(id || '')
  if (!deal) return <div className="p-10 text-center text-ink-500">项目未找到</div>

  const recMeta = recommendationMeta[deal.recommendation]
  const hardCount = deal.redFlags.filter(f => f.severity === 'hard').length
  const softCount = deal.redFlags.filter(f => f.severity === 'soft').length
  const topQuestions = (extra?.interviewQuestions || []).slice(0, 3)
  const topComp = extra?.publicComps[0]

  return (
    <div className="px-8 py-6 max-w-[900px] mx-auto">
      <div className="flex items-center gap-2 text-[12px] text-ink-500 mb-3 no-print">
        <Link to={`/deal/${deal.id}`} className="hover:text-brand-700">{deal.name}</Link>
        <span>/</span>
        <span className="text-ink-900">一页简报</span>
        <button onClick={() => window.print()} className="ml-auto px-3 py-1 text-[12px] rounded-md border border-ink-200 hover:bg-ink-50">打印</button>
      </div>

      <article className="bg-white border border-ink-200 rounded-2xl shadow-card p-10">
        {/* Hero */}
        <header className="flex items-start justify-between gap-4 pb-5 border-b border-ink-100">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-semibold text-[18px] tracking-tight" style={{ background: deal.accentColor }}>
              {deal.name.slice(0, 2)}
            </div>
            <div>
              <h1 className="text-[24px] font-semibold tracking-tight">{deal.name} <span className="text-ink-500 text-[16px] font-normal">{deal.cnName}</span></h1>
              <p className="text-[13px] text-ink-700 mt-1">{deal.tagline}</p>
              <div className="text-[11px] text-ink-500 mt-1.5">{deal.sector} · {deal.round} · 估值 {deal.valuation} · 本轮 {deal.askAmount} · {deal.location}</div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="num text-[44px] font-semibold tracking-tight leading-none" style={{ color: deal.accentColor }}>{deal.score}</div>
            <div className="text-[10px] text-ink-400 tracking-wider uppercase">/ 100</div>
            <div className={`mt-1 inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full ${recMeta.bg}`} style={{ color: recMeta.color }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: recMeta.color }} />
              {recMeta.label}
            </div>
          </div>
        </header>

        {/* Why we like */}
        <section className="mt-5">
          <h2 className="text-[12px] tracking-wider uppercase text-emerald-700 font-medium mb-2">为什么投（Core Bet）</h2>
          <ol className="space-y-1.5">
            {deal.wins.slice(0, 3).map((w, i) => (
              <li key={i} className="text-[13px] text-ink-800 leading-relaxed flex items-start gap-2">
                <span className="num w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <span>{w}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Risks */}
        <section className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-[12px] tracking-wider uppercase text-rose-700 font-medium mb-2">关键风险（{hardCount} 硬 · {softCount} 软）</h2>
            {deal.redFlags.length === 0 ? (
              <div className="text-[12.5px] text-ink-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">未发现 Red Flag</div>
            ) : (
              <ul className="space-y-1.5">
                {deal.redFlags.slice(0, 3).map((f, i) => (
                  <li key={i} className="text-[12.5px] leading-relaxed flex items-start gap-2">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${f.severity === 'hard' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{f.severity === 'hard' ? '硬' : '软'}</span>
                    <span className="text-ink-800">{f.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h2 className="text-[12px] tracking-wider uppercase text-ink-500 font-medium mb-2">关键数字</h2>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="ARR" value={deal.arr || '—'} />
              <Stat label="增速" value={deal.growthRate || '—'} />
              <Stat label="LTV/CAC" value={deal.ltvCac ? `${deal.ltvCac}x` : '—'} />
              <Stat label="毛利率" value={deal.grossMargin || '—'} />
            </div>
          </div>
        </section>

        {/* Top 3 questions */}
        {topQuestions.length > 0 && (
          <section className="mt-5">
            <h2 className="text-[12px] tracking-wider uppercase text-brand-700 font-medium mb-2">会前必问 3 题</h2>
            <ol className="space-y-2">
              {topQuestions.map((q, i) => (
                <li key={i} className="text-[12.5px] leading-relaxed border-l-2 border-brand-500/40 pl-3 py-0.5">
                  <span className="num text-brand-700 font-semibold mr-1">Q{i + 1}.</span>
                  <span className="text-ink-900">{q.question}</span>
                  <div className="text-[11px] text-ink-500 mt-0.5">期待信号：{q.expect}</div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Comp anchor */}
        {topComp && (
          <section className="mt-5 bg-ink-50 rounded-lg p-3">
            <div className="text-[10px] tracking-wider uppercase text-ink-500 font-medium mb-1">估值锚定 · 真实可比</div>
            <div className="text-[12.5px] text-ink-800 leading-relaxed">
              <b>{topComp.name}</b>（{topComp.ticker}）· 营收 <span className="num font-medium">{topComp.revenue}</span> · 净利率 <span className="num font-medium">{topComp.netMargin}</span>
              <span className="text-[11px] text-ink-500 ml-2">数据：akshare 实时 · 2026-04</span>
            </div>
            {extra?.compsTakeaway && <div className="text-[12px] text-ink-700 mt-1.5 leading-relaxed">{extra.compsTakeaway}</div>}
          </section>
        )}

        {/* Footer */}
        <footer className="mt-6 pt-4 border-t border-ink-100 flex items-center justify-between text-[11px] text-ink-500">
          <span>冠军合伙人：{deal.champion} · 来源：{deal.source}</span>
          <span>DealPilot · 一页简报 · {new Date().toISOString().slice(0, 10)}</span>
        </footer>
      </article>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ink-50 rounded-md px-2.5 py-1.5">
      <div className="text-[10px] text-ink-500">{label}</div>
      <div className="text-[13px] font-semibold num mt-0.5">{value}</div>
    </div>
  )
}
