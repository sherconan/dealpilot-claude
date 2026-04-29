import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { deals } from '../data/deals'
import { fundingFunnel } from '../lib/scoring'
import MetricCard from '../components/MetricCard'
import DealCard from '../components/DealCard'
import { StagePill } from '../components/StatusPill'
import { MonthlyTrendChart, DonutChart, BarChart, ConversionFlow, Sparkline } from '../components/Charts'
import { monthlyInbound, sectorMix, scoreDistribution, conversionRates, avgScoreTrend } from '../data/analytics'

export default function Dashboard() {
  const stats = useMemo(() => {
    const total = deals.length
    const priority = deals.filter((d) => d.recommendation === 'priority').length
    const passed = deals.filter((d) => d.stage === 'pass').length
    const inFunnel = deals.filter((d) => !['pass', 'invested'].includes(d.stage)).length
    const avgScore = Math.round(deals.reduce((s, d) => s + d.score, 0) / deals.length)
    return { total, priority, passed, inFunnel, avgScore }
  }, [])

  const top = [...deals].sort((a, b) => b.score - a.score).slice(0, 3)
  const todos = deals.filter((d) => d.stage === 'ic' || d.stage === 'dd' || d.stage === 'review')

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto">
      <header className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">Henry · 2026 年 4 月 24 日 · 周五</div>
          <h1 className="text-[28px] font-semibold tracking-tight mt-1">今天有 <span className="text-brand-700">3 个项目</span> 等你决策</h1>
          <p className="text-[13px] text-ink-600 mt-1.5">NebulaAI 已进入 IC，4/26 周日表决 · MetaMed 合伙人会议 4/27 · GreenLogistics 客户集中度红线待确认</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-medium rounded-lg border border-ink-200 bg-white hover:bg-ink-50 transition">
            导出本周简报
          </button>
          <button className="px-4 py-2 text-sm font-medium rounded-lg bg-brand-700 text-white hover:bg-brand-800 transition inline-flex items-center gap-2">
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="currentColor"><path d="M10 2a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H3a1 1 0 110-2h6V3a1 1 0 011-1z"/></svg>
            上传 BP
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        <MetricCard label="本月进入筛选" value={stats.total} delta="+12 QoQ" accent="#0f766e" />
        <MetricCard label="优先推进" value={stats.priority} hint="80 分以上 · 待 IC" accent="#0f766e" />
        <MetricCard label="漏斗活跃项目" value={stats.inFunnel} hint="初筛 / 跟进 / 尽调 / IC" accent="#0ea5e9" />
        <MetricCard label="已 Pass" value={stats.passed} hint="本月 + 4" accent="#94a3b8" />
        <MetricCard label="平均评分" value={stats.avgScore} hint="Scorecard 加权" accent="#d97706" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        <div className="lg:col-span-7 bg-white border border-ink-200 rounded-xl p-5">
          <div className="flex items-end justify-between mb-3 flex-wrap gap-2">
            <div>
              <h2 className="font-semibold text-[15px] tracking-tight">近 6 个月入箱与转化</h2>
              <p className="text-[12px] text-ink-500 mt-0.5">每月新增 BP 数 · 一笔投资从初筛到打款约 60–90 天</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-ink-500">
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-brand-700" />入箱 BP</span>
              <span>· 当月平均评分 <span className="num text-ink-900 font-semibold">{avgScoreTrend.at(-1)}</span></span>
              <div className="w-16"><Sparkline values={avgScoreTrend} /></div>
            </div>
          </div>
          <MonthlyTrendChart data={monthlyInbound} height={200} />
          <div className="grid grid-cols-5 gap-2 mt-3 text-center">
            {monthlyInbound.map((m) => (
              <div key={m.month} className="bg-ink-50 rounded-md py-2">
                <div className="text-[10px] text-ink-500 num">{m.month.slice(5)}</div>
                <div className="text-[10px] text-ink-700 mt-0.5">入 <span className="num font-semibold">{m.received}</span></div>
                <div className="text-[10px] text-emerald-700 num">投 {m.invested}</div>
              </div>
            )).slice(-5)}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-ink-200 rounded-xl p-5">
          <h2 className="font-semibold text-[15px] tracking-tight mb-3">各阶段转化率 vs 行业基准</h2>
          <ConversionFlow data={conversionRates} />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        <div className="lg:col-span-5 bg-white border border-ink-200 rounded-xl p-5">
          <h2 className="font-semibold text-[15px] tracking-tight mb-4">赛道分布（季度累计）</h2>
          <DonutChart data={sectorMix} size={170} thickness={26} />
        </div>
        <div className="lg:col-span-7 bg-white border border-ink-200 rounded-xl p-5">
          <h2 className="font-semibold text-[15px] tracking-tight mb-4">评分区间分布</h2>
          <BarChart data={scoreDistribution} />
          <div className="text-[11px] text-ink-500 mt-3 leading-relaxed border-t border-ink-100 pt-3">
            ＞85 分占比仅 <span className="num font-semibold text-emerald-700">6.5%</span>，与 Sequoia 全球样本头部 5–8% 接近 — 评分模型在过滤"伪优质项目"上稳定，未出现系统性宽松。
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-ink-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-[15px] tracking-tight">漏斗全景</h2>
                <p className="text-[12px] text-ink-500 mt-0.5">Q2 2026 · 累计 · 参考 Sequoia 项目漏斗模型</p>
              </div>
              <Link to="/pipeline" className="text-[12px] text-brand-700 hover:underline">进入看板 →</Link>
            </div>
            <div className="space-y-2.5">
              {fundingFunnel.map((f, idx) => {
                const max = fundingFunnel[0].count
                const width = (f.count / max) * 100
                return (
                  <div key={f.stage} className="flex items-center gap-3">
                    <div className="w-[60px] text-[12px] text-ink-700 font-medium">{f.stage}</div>
                    <div className="flex-1 h-8 relative bg-ink-100 rounded-md overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded-md flex items-center px-3 transition-all"
                        style={{ width: `${width}%`, background: f.color, opacity: 0.92 }}
                      >
                        <span className="num text-white text-[12px] font-semibold">{f.count}</span>
                      </div>
                      {idx < fundingFunnel.length - 1 && (
                        <div className="absolute right-2 inset-y-0 flex items-center text-[11px] text-ink-500 num">
                          → 通过 {f.passRate}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-semibold text-[15px] tracking-tight">Top 评分项目</h2>
                <p className="text-[12px] text-ink-500 mt-0.5">基于 Scorecard 综合得分 + Thesis Alignment</p>
              </div>
              <Link to="/pipeline" className="text-[12px] text-brand-700 hover:underline">查看全部 →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {top.map((d) => <DealCard key={d.id} deal={d} />)}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white border border-ink-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-[14px] tracking-tight">今日待办</h2>
              <span className="text-[11px] text-ink-400">按紧急度排序</span>
            </div>
            <div className="space-y-3">
              {todos.map((d) => (
                <Link key={d.id} to={`/deal/${d.id}`} className="block group">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center text-[11px] font-semibold num text-white shrink-0" style={{ background: d.accentColor }}>{d.score}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-ink-900 truncate group-hover:text-brand-800">{d.name}</div>
                      <div className="text-[11px] text-ink-500 mt-0.5 line-clamp-1">{d.timeline[d.timeline.length - 1]?.event}</div>
                      <div className="mt-1"><StagePill stage={d.stage} /></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-brand-50 to-white border border-brand-500/20 rounded-xl p-5">
            <div className="text-[11px] tracking-[0.14em] text-brand-700 uppercase font-medium">AI 深度发现</div>
            <div className="text-[13px] text-ink-800 mt-2 leading-relaxed">
              监控到 <b>NebulaAI</b> 创始人本周在 LinkedIn 新增 2 名前 Anthropic 工程师、GitHub 新建 <code className="text-[11px] bg-white px-1 py-0.5 rounded">agent-kernel</code> repo — 疑似准备发布核心开源模块，<b>建议提前锁定份额</b>。
            </div>
            <div className="text-[11px] text-ink-500 mt-3">监控 100+ 信号源 · Preemptive Deal Alert</div>
          </div>

          <div className="bg-white border border-ink-200 rounded-xl p-5">
            <div className="text-[14px] font-semibold tracking-tight mb-3">机构论点对齐率</div>
            <div className="space-y-2">
              {[
                { label: 'AI 原生', v: 92 },
                { label: '创始人 × 赛道', v: 78 },
                { label: '可验证收入', v: 64 },
                { label: '退出路径', v: 58 },
              ].map((x) => (
                <div key={x.label}>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-ink-700">{x.label}</span>
                    <span className="num text-ink-900 font-semibold">{x.v}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-ink-100 mt-1 overflow-hidden">
                    <div className="h-full rounded-full bg-brand-700" style={{ width: `${x.v}%`, transition: 'width 800ms cubic-bezier(0.16, 1, 0.3, 1)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
