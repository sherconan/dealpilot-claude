import { Link, useParams } from 'react-router-dom'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from 'recharts'
import { getDealById } from '../data/deals'
import { sequoiaLabels, recommendationMeta, thesisChecks } from '../lib/scoring'
import ScoreRing from '../components/ScoreRing'
import { StagePill, RecommendationPill } from '../components/StatusPill'

export default function DealDetail() {
  const { id } = useParams()
  const deal = getDealById(id || '')
  if (!deal) {
    return (
      <div className="p-10 max-w-xl mx-auto text-center">
        <div className="text-[14px] text-ink-500">项目未找到</div>
        <Link to="/pipeline" className="text-[12px] text-brand-700 mt-2 inline-block">返回看板 →</Link>
      </div>
    )
  }

  const radarData = sequoiaLabels.map((s) => ({
    axis: s.label,
    value: deal.sequoia[s.key],
    fullMark: 10,
  }))

  const recMeta = recommendationMeta[deal.recommendation]
  const hardFlags = deal.redFlags.filter((f) => f.severity === 'hard')
  const softFlags = deal.redFlags.filter((f) => f.severity === 'soft')

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-2 text-[12px] text-ink-500 mb-3">
        <Link to="/pipeline" className="hover:text-brand-700">看板</Link>
        <span>/</span>
        <span>{deal.sector}</span>
        <span>/</span>
        <span className="text-ink-900">{deal.name}</span>
      </div>

      <header className="flex items-start justify-between gap-4 flex-wrap mb-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-semibold text-lg tracking-tight shrink-0" style={{ background: deal.accentColor }}>
            {deal.name.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-[26px] font-semibold tracking-tight">{deal.name}</h1>
              <span className="text-ink-500 text-[14px]">{deal.cnName}</span>
              <StagePill stage={deal.stage} />
              <RecommendationPill rec={deal.recommendation} />
            </div>
            <p className="text-[14px] text-ink-700 mt-1.5 max-w-2xl leading-relaxed">{deal.tagline}</p>
            <div className="flex items-center gap-4 mt-2.5 text-[12px] text-ink-500 flex-wrap">
              <span><span className="text-ink-400">赛道</span> · {deal.sector}</span>
              <span><span className="text-ink-400">阶段</span> · {deal.round}</span>
              <span><span className="text-ink-400">估值</span> · <span className="num text-ink-800 font-medium">{deal.valuation}</span></span>
              <span><span className="text-ink-400">本轮</span> · <span className="num text-ink-800 font-medium">{deal.askAmount}</span></span>
              <span><span className="text-ink-400">成立</span> · {deal.foundedYear} · {deal.location}</span>
              <span><span className="text-ink-400">团队</span> · <span className="num">{deal.teamSize}</span> 人</span>
              <span><span className="text-ink-400">来源</span> · {deal.source}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3.5 py-2 text-[13px] rounded-lg border border-ink-200 bg-white hover:bg-ink-50">
            安排会议
          </button>
          <button className="px-3.5 py-2 text-[13px] rounded-lg border border-ink-200 bg-white hover:bg-ink-50">
            进入尽调
          </button>
          <Link to={`/deal/${deal.id}/memo`} className="px-3.5 py-2 text-[13px] rounded-lg bg-brand-700 text-white hover:bg-brand-800">
            生成 IC Memo
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4 bg-white border border-ink-200 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <ScoreRing score={deal.score} color={deal.accentColor} size={128} label="Scorecard" />
            <div className="flex-1">
              <div className={`inline-flex items-center gap-1.5 text-[12px] px-2 py-1 rounded ${recMeta.bg}`} style={{ color: recMeta.color }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: recMeta.color }} />
                {recMeta.label}
              </div>
              <div className="text-[12px] text-ink-600 mt-2 leading-relaxed">{recMeta.rationale}</div>
              <div className="text-[11px] text-ink-400 mt-2">冠军合伙人：{deal.champion}</div>
            </div>
          </div>
          <div className="h-[220px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10, fill: '#475569' }} />
                <PolarRadiusAxis angle={90} domain={[0, 10]} tick={false} axisLine={false} />
                <Radar dataKey="value" stroke={deal.accentColor} fill={deal.accentColor} fillOpacity={0.22} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-ink-400 text-center -mt-1">Sequoia 10 要素雷达</div>
        </div>

        <div className="lg:col-span-4 bg-white border border-ink-200 rounded-xl p-5">
          <h2 className="text-[14px] font-semibold tracking-tight mb-3">Red Flag 扫描</h2>
          {hardFlags.length === 0 && softFlags.length === 0 && (
            <div className="text-[12px] text-ink-500 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
              未发现硬红线或软扣分项
            </div>
          )}
          {hardFlags.length > 0 && (
            <div className="mb-3">
              <div className="text-[11px] tracking-wider uppercase text-rose-700 font-medium mb-1.5">硬 Red Flag · {hardFlags.length}</div>
              <div className="space-y-2">
                {hardFlags.map((f, i) => (
                  <div key={i} className="bg-rose-50 border border-rose-200 rounded-md px-3 py-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-[12.5px] font-semibold text-rose-800">{f.label}</div>
                      <div className="text-[10px] text-rose-600 shrink-0">{f.source}</div>
                    </div>
                    <div className="text-[12px] text-rose-700 mt-1 leading-relaxed">{f.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {softFlags.length > 0 && (
            <div>
              <div className="text-[11px] tracking-wider uppercase text-amber-700 font-medium mb-1.5">软 扣分项 · {softFlags.length}</div>
              <div className="space-y-2">
                {softFlags.map((f, i) => (
                  <div key={i} className="bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-[12.5px] font-semibold text-amber-800">{f.label}</div>
                      <div className="text-[10px] text-amber-600 shrink-0">{f.source}</div>
                    </div>
                    <div className="text-[12px] text-amber-700 mt-1 leading-relaxed">{f.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 bg-white border border-ink-200 rounded-xl p-5">
          <h2 className="text-[14px] font-semibold tracking-tight mb-3">关键指标</h2>
          <div className="grid grid-cols-2 gap-3">
            {deal.traction.map((t) => (
              <div key={t.label} className="bg-ink-50 border border-ink-200/70 rounded-lg p-2.5">
                <div className="text-[11px] text-ink-500">{t.label}</div>
                <div className="num font-semibold text-[16px] text-ink-900 mt-1">{t.value}</div>
                {t.delta && <div className="text-[10px] text-emerald-700 num mt-0.5">▲ {t.delta}</div>}
              </div>
            ))}
          </div>
          <div className="border-t border-ink-200 mt-4 pt-3 space-y-1.5 text-[12px]">
            <Row k="市场规模 TAM" v={deal.tam} />
            <Row k="可服务 SAM" v={deal.sam} />
            <Row k="ARR" v={deal.arr || '—'} />
            <Row k="增长率" v={deal.growthRate || '—'} />
            <Row k="LTV / CAC" v={deal.ltvCac ? `${deal.ltvCac}x` : '—'} />
            <Row k="CAC 回收期" v={deal.cacPayback || '—'} />
            <Row k="毛利率" v={deal.grossMargin || '—'} />
          </div>
        </div>

        <div className="lg:col-span-7 bg-white border border-ink-200 rounded-xl p-5">
          <h2 className="text-[14px] font-semibold tracking-tight mb-4">Sequoia 10 要素评分</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {sequoiaLabels.map((s) => {
              const v = deal.sequoia[s.key]
              const barColor = v >= 8 ? '#0f766e' : v >= 6 ? '#0ea5e9' : v >= 4 ? '#d97706' : '#dc2626'
              return (
                <div key={s.key}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[13px] font-medium text-ink-900">{s.label}</div>
                      <div className="text-[11px] text-ink-500 leading-relaxed mt-0.5">{s.desc}</div>
                    </div>
                    <div className="num font-semibold text-[16px] shrink-0 ml-2" style={{ color: barColor }}>{v}<span className="text-[11px] text-ink-400">/10</span></div>
                  </div>
                  <div className="h-1.5 bg-ink-100 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${v * 10}%`, background: barColor, transition: 'width 800ms cubic-bezier(0.16, 1, 0.3, 1)' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-ink-200 rounded-xl p-5">
            <h2 className="text-[14px] font-semibold tracking-tight mb-3">投资论点对齐</h2>
            <div className="space-y-2">
              {thesisChecks.map((c) => (
                <div key={c.title} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded flex items-center justify-center text-white text-[10px] shrink-0 ${c.pass ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                    {c.pass ? '✓' : '✕'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium text-ink-900">{c.title}</span>
                      <span className="text-[11px] text-ink-400 num">权重 {c.weight}%</span>
                    </div>
                    <div className="text-[11px] text-ink-500 mt-0.5">{c.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-ink-200 rounded-xl p-5">
            <h2 className="text-[14px] font-semibold tracking-tight mb-3">创始团队</h2>
            <div className="space-y-3">
              {deal.founders.map((f) => (
                <div key={f.name} className="flex items-start gap-3 pb-3 border-b border-ink-100 last:border-0 last:pb-0">
                  <div className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center text-[12px] font-semibold text-ink-700 shrink-0">
                    {f.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium">{f.name}</span>
                      <span className="text-[11px] text-ink-500">· {f.role}</span>
                    </div>
                    <div className="text-[12px] text-ink-600 mt-0.5 leading-relaxed">{f.background}</div>
                    {f.highlight && <div className="text-[11px] text-brand-700 mt-1">{f.highlight}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white border border-ink-200 rounded-xl p-5">
            <h2 className="text-[14px] font-semibold tracking-tight mb-3 text-emerald-700">核心亮点</h2>
            <ul className="space-y-2">
              {deal.wins.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-ink-800 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-[7px] shrink-0" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white border border-ink-200 rounded-xl p-5">
            <h2 className="text-[14px] font-semibold tracking-tight mb-3 text-amber-700">关注问题</h2>
            <ul className="space-y-2">
              {deal.concerns.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-ink-800 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-[7px] shrink-0" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-ink-200 rounded-xl p-5">
          <h2 className="text-[14px] font-semibold tracking-tight mb-3">项目时间线</h2>
          <div className="space-y-3 relative pl-4 before:absolute before:left-[5px] before:top-1 before:bottom-1 before:w-px before:bg-ink-200">
            {deal.timeline.map((e, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-4 top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2" style={{ borderColor: deal.accentColor }} />
                <div className="text-[11px] text-ink-500 num">{e.date}</div>
                <div className="text-[13px] text-ink-900 mt-0.5">{e.event}</div>
                {e.actor && <div className="text-[11px] text-ink-400 mt-0.5">{e.actor}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-500">{k}</span>
      <span className="text-ink-900 num font-medium">{v}</span>
    </div>
  )
}
