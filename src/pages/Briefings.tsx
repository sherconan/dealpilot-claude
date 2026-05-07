import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAllDeals } from '../lib/userDealStore'
import { recommendationMeta } from '../lib/scoring'

function getISOWeek(d = new Date()) {
  const date = new Date(d.getTime())
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 4 - (date.getDay() || 7))
  const yearStart = new Date(date.getFullYear(), 0, 1)
  const weekNo = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return { year: date.getFullYear(), week: weekNo }
}

function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default function Briefings() {
  const allDeals = useAllDeals()
  const [shared, setShared] = useState(false)

  const { year, week } = getISOWeek()
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - 6)

  const stats = useMemo(() => {
    const inbox = allDeals.filter(d => d.stage === 'inbox').length
    const review = allDeals.filter(d => d.stage === 'review').length
    const dd = allDeals.filter(d => d.stage === 'dd').length
    const ic = allDeals.filter(d => d.stage === 'ic').length
    const passed = allDeals.filter(d => d.recommendation === 'pass').length
    const priority = allDeals.filter(d => d.recommendation === 'priority').length
    const userUploaded = allDeals.filter(d => d.id.startsWith('user-')).length
    const hardFlags = allDeals.reduce((s, d) => s + d.redFlags.filter(f => f.severity === 'hard').length, 0)
    const softFlags = allDeals.reduce((s, d) => s + d.redFlags.filter(f => f.severity === 'soft').length, 0)
    return { inbox, review, dd, ic, passed, priority, userUploaded, hardFlags, softFlags }
  }, [allDeals])

  const top3 = useMemo(() => [...allDeals].sort((a, b) => b.score - a.score).slice(0, 3), [allDeals])
  const watchlist = useMemo(
    () => allDeals.filter(d => d.recommendation === 'monitor' || d.recommendation === 'conditional').slice(0, 4),
    [allDeals]
  )
  const hardFlagDeals = useMemo(
    () => allDeals.filter(d => d.redFlags.some(f => f.severity === 'hard')).slice(0, 3),
    [allDeals]
  )

  function copyLink() {
    navigator.clipboard.writeText(window.location.href)
    setShared(true)
    setTimeout(() => setShared(false), 2200)
  }

  function summary() {
    const lead = top3[0]
    if (!lead) return '本周无新增 BP — 建议在 Upload 上传 1-2 份 BP 触发自动评分'
    const watchTxt = watchlist.length > 0 ? `${watchlist.length} 个观察项` : ''
    const flagTxt = stats.hardFlags > 0 ? `${stats.hardFlags} 项硬红线` : '无硬红线'
    return `本周 Pipeline 共 ${allDeals.length} 个项目（其中 ${stats.userUploaded} 个为本周上传），优先级 #1 是 ${lead.name}（${lead.score}/100，${lead.sector}）；${watchTxt}；${flagTxt}；推荐进入 IC 表决 ${stats.priority} 个。`
  }

  return (
    <div className="px-8 py-6 max-w-[1100px] mx-auto">
      <header className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">Weekly Brief · {year} W{week}</div>
          <h1 className="text-[26px] font-semibold tracking-tight mt-1">基金周报</h1>
          <p className="text-[13.5px] text-ink-700 mt-1.5 max-w-3xl leading-relaxed">
            {fmtDate(weekStart)} 至 {fmtDate(new Date())} · 实时聚合 Pipeline + 用户上传 BP + Scorecard
          </p>
        </div>
        <div className="flex items-center gap-2 no-print">
          <button onClick={copyLink} className="px-3.5 py-2 text-[13px] rounded-lg border border-ink-200 bg-white hover:bg-ink-50">
            {shared ? '已复制 ✓' : '分享链接'}
          </button>
          <button onClick={() => window.print()} className="px-3.5 py-2 text-[13px] rounded-lg bg-brand-700 text-white hover:bg-brand-800">导出 PDF</button>
        </div>
      </header>

      <article className="bg-white border border-ink-200 rounded-2xl p-8 shadow-card space-y-7">
        <Section num="1" title="一句话提要">
          <p className="text-[14.5px] text-ink-800 leading-relaxed">{summary()}</p>
        </Section>

        <Section num="2" title="本周决策池">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="新入箱" value={`${stats.inbox}`} delta={stats.userUploaded > 0 ? `本周上传 ${stats.userUploaded}` : '无新增上传'} pos={stats.userUploaded > 0} />
            <Stat label="进入跟进" value={`${stats.review + stats.dd}`} delta={`Review ${stats.review} · DD ${stats.dd}`} />
            <Stat label="进入 IC" value={`${stats.ic}`} delta={stats.priority > 0 ? `优先 ${stats.priority} 个` : '本周无新增'} pos={stats.priority > 0} />
            <Stat label="已 Pass" value={`${stats.passed}`} delta="已标准化存档" />
          </div>
        </Section>

        <Section num="3" title="Top 3 优先项目">
          {top3.length === 0 ? (
            <div className="text-center py-8 text-[13px] text-ink-500">
              暂无项目 — <Link to="/upload" className="text-brand-700 underline">上传 BP 触发分析</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {top3.map((d, i) => {
                const rm = recommendationMeta[d.recommendation]
                return (
                  <Link key={d.id} to={`/deal/${d.id}`} className="flex items-start gap-3 p-3 border border-ink-200 rounded-xl hover:bg-ink-50 transition">
                    <div className="num w-7 h-7 rounded-full bg-brand-700 text-white text-[12px] font-medium flex items-center justify-center shrink-0">#{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[14px]">{d.name}</span>
                        <span className="text-[11px] text-ink-500">{d.cnName} · {d.sector} · {d.round}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${rm.bg}`} style={{ color: rm.color }}>{rm.label}</span>
                        <span className="num text-[13px] font-semibold ml-auto" style={{ color: d.accentColor }}>{d.score}</span>
                      </div>
                      <div className="text-[12px] text-ink-700 mt-1 line-clamp-2">{d.llmOneLiner || d.tagline}</div>
                      <div className="text-[11px] text-ink-500 mt-1">推荐：{d.wins[0] || '—'}</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </Section>

        <Section num="4" title="本周关键信号">
          <ul className="space-y-2 text-[13px] text-ink-800 leading-relaxed">
            {hardFlagDeals.length > 0 ? (
              hardFlagDeals.map(d => {
                const hf = d.redFlags.find(f => f.severity === 'hard')!
                return (
                  <li key={d.id} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-[7px] shrink-0" />
                    <span><b>[紧急]</b> <Link to={`/deal/${d.id}`} className="text-brand-700 hover:underline">{d.name}</Link> · {hf.label}</span>
                  </li>
                )
              })
            ) : (
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-[7px] shrink-0" />
                <span><b>[OK]</b> 本周组合无硬红线触发 — 所有 deal 通过初筛 Red Flag 检查</span>
              </li>
            )}
            {stats.softFlags > 0 && (
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-[7px] shrink-0" />
                <span><b>[关注]</b> 共 {stats.softFlags} 项软扣分项需在尽调阶段验证 — 见各项目详情页 Red Flag 段落</span>
              </li>
            )}
            {stats.userUploaded > 0 && (
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-600 mt-[7px] shrink-0" />
                <span><b>[新]</b> 本周新上传 {stats.userUploaded} 份 BP 经 LLM 真分析 → 已写入 Pipeline + Memory，可 <Link to="/compare" className="text-brand-700 hover:underline">横向对比</Link></span>
              </li>
            )}
          </ul>
        </Section>

        <Section num="5" title="观察名单（监控 / 条件性推进）">
          {watchlist.length === 0 ? (
            <div className="text-[12px] text-ink-500">暂无观察项</div>
          ) : (
            <ul className="space-y-1.5 text-[13px] text-ink-800 leading-relaxed">
              {watchlist.map(d => (
                <li key={d.id}>
                  · <Link to={`/deal/${d.id}`} className="font-semibold text-brand-700 hover:underline">{d.name}</Link>
                  <span className="text-ink-600"> · {d.sector} · {d.score}/100 · {d.tagline.slice(0, 60)}{d.tagline.length > 60 ? '…' : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section num="6" title="下周聚焦">
          <ol className="list-decimal list-inside marker:text-brand-700 marker:font-semibold space-y-1.5 text-[13px] text-ink-800 leading-relaxed">
            {stats.priority > 0 && <li>把 {stats.priority} 个 priority 项目排入下周合伙人晨会议程，准备 IC pre-read</li>}
            {stats.hardFlags > 0 && <li>对 {stats.hardFlags} 项硬红线触发项目执行 qcc-risk + 巨潮咨询的全维背调（actual_controller / case_filing / dishonest_info）</li>}
            {stats.userUploaded > 0 && <li>对本周上传的 {stats.userUploaded} 份 BP 做 founder reference check（Champion 带队）— 见 ICMemo「创始人追问」</li>}
            <li>对 watchlist {watchlist.length} 个项目补 1 次创始人深度访谈（30min 聚焦 Top 3 风险）</li>
            <li>更新 Thesis Alignment 评分模型 — 加入本周新增赛道权重</li>
          </ol>
        </Section>

        <div className="text-[11px] text-ink-400 pt-4 border-t border-ink-100 flex items-center justify-between">
          <span>由 DealPilot 实时生成 · 数据来源：Pipeline + 用户上传 BP + Scorecard 引擎</span>
          <span>Generated {new Date().toLocaleString('zh-CN')}</span>
        </div>
      </article>
    </div>
  )
}

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-[16px] font-semibold tracking-tight mb-3 flex items-center gap-2 text-ink-900">
        <span className="num w-6 h-6 rounded bg-brand-700 text-white text-[11px] flex items-center justify-center">{num}</span>
        {title}
      </h3>
      {children}
    </section>
  )
}

function Stat({ label, value, delta, pos }: { label: string; value: string; delta: string; pos?: boolean }) {
  return (
    <div className="bg-ink-50 border border-ink-200/70 rounded-xl p-3">
      <div className="text-[10px] text-ink-500 tracking-wider uppercase">{label}</div>
      <div className="num font-semibold text-[20px] tracking-tight mt-1">{value}</div>
      <div className={`text-[10px] num mt-0.5 ${pos ? 'text-emerald-700' : 'text-ink-500'}`}>{delta}</div>
    </div>
  )
}
