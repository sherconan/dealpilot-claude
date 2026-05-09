import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fundingFunnel } from '../lib/scoring'
import { useAllDeals } from '../lib/userDealStore'
import MetricCard from '../components/MetricCard'
import DealCard from '../components/DealCard'
import { StagePill } from '../components/StatusPill'
import { MonthlyTrendChart, DonutChart, BarChart, ConversionFlow, Sparkline } from '../components/Charts'
import { monthlyInbound, sectorMix, scoreDistribution, conversionRates, avgScoreTrend } from '../data/analytics'
import { SAMPLE_BPS } from '../data/sampleBPs'
import { REAL_DEALS } from '../data/realDeals'

export default function Dashboard() {
  const navigate = useNavigate()
  const deals = useAllDeals()
  const stats = useMemo(() => {
    const total = deals.length
    const priority = deals.filter((d) => d.recommendation === 'priority').length
    const passed = deals.filter((d) => d.stage === 'pass').length
    const inFunnel = deals.filter((d) => !['pass', 'invested'].includes(d.stage)).length
    const avgScore = total > 0 ? Math.round(deals.reduce((s, d) => s + d.score, 0) / total) : 0
    const llmAnalyzed = deals.filter((d) => d.id.startsWith('user-') || d.deepAnalysisRaw).length
    const userUploaded = deals.filter((d) => d.id.startsWith('user-')).length
    return { total, priority, passed, inFunnel, avgScore, llmAnalyzed, userUploaded }
  }, [deals])

  const top = [...deals].sort((a, b) => b.score - a.score).slice(0, 3)
  const todos = deals.filter((d) => d.stage === 'ic' || d.stage === 'dd' || d.stage === 'review')

  // 动态日期 + 实时决策提醒
  const today = new Date()
  const wkLabel = ['日', '一', '二', '三', '四', '五', '六'][today.getDay()]
  const todayStr = `${today.getFullYear()} 年 ${today.getMonth() + 1} 月 ${today.getDate()} 日 · 周${wkLabel}`
  const icDeals = deals.filter((d) => d.stage === 'ic').slice(0, 3)
  const decisionCount = todos.length
  const headlineHint = icDeals.length > 0
    ? icDeals.map((d) => `${d.name} · ${d.stage === 'ic' ? '已进入 IC' : 'DD 中'}`).join(' · ')
    : todos.length > 0
    ? `${todos.length} 个项目处于 Review/DD/IC 阶段，等待跟进`
    : '当前无待决项目 — 上传新 BP 触发 LLM 真分析'

  return (
    <div className="px-4 md:px-8 py-6 max-w-[1400px] mx-auto">
      <header className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">Henry · {todayStr}</div>
          <h1 className="text-[28px] font-semibold tracking-tight mt-1">{REAL_DEALS.length} 家真实公司决策包 · {decisionCount > 0 ? `${decisionCount} 个项目待决` : '今日无待决'}</h1>
          <p className="text-[13px] text-ink-600 mt-1.5">{headlineHint}</p>
          <p className="text-[12px] text-ink-500 mt-2 max-w-2xl leading-relaxed italic border-l-2 border-emerald-500/30 pl-3">
            "VC 的核心赌注始终是「人」 — BP 只是敲门砖。" <span className="not-italic">— DealPilot 通过 30 分钟决策包让你 brutally 看人 + 看公司。</span>
          </p>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <Link to="/upload" className="inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-full bg-violet-700 text-white hover:bg-violet-800 transition font-medium">
              ✨ 上传 BP · LLM 真分析
            </Link>
            <Link to="/sources" className="inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span className="num font-semibold">5/7</span> 真信源 + Kimi K2.6 多模态
            </Link>
            <Link to="/sources" className="inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-full bg-brand-50 border border-brand-500/30 text-brand-800 hover:bg-brand-50/80 transition">
              <span className="num font-semibold">4,568</span> 专利 · <span className="num font-semibold">25</span> PDF
            </Link>
            <Link to="/termsheet" className="inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-full bg-emerald-700 text-white hover:bg-emerald-800 transition font-medium">
              ⚡ Term Sheet
            </Link>
            <Link to="/captable" className="inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-full bg-emerald-700 text-white hover:bg-emerald-800 transition font-medium">
              ⚡ Cap Table
            </Link>
            <Link to="/changelog" className="inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition">
              <span className="num font-semibold">152+</span> Sprint 闭环
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/briefings" className="px-4 py-2 text-sm font-medium rounded-lg border border-ink-200 bg-white hover:bg-ink-50 transition">
            导出本周简报
          </Link>
          <Link to="/upload" className="px-4 py-2 text-sm font-medium rounded-lg bg-brand-700 text-white hover:bg-brand-800 transition inline-flex items-center gap-2">
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="currentColor"><path d="M10 2a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H3a1 1 0 110-2h6V3a1 1 0 011-1z"/></svg>
            上传 BP
          </Link>
        </div>
      </header>

      {/* 真实公开公司决策包库 — 产品核心 deliverable，永远显示 */}
      <section className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border-2 border-emerald-500/40 rounded-2xl p-4 mb-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-emerald-700 font-medium">⚡ 真实公开公司决策包库</div>
            <div className="text-[15px] font-semibold tracking-tight mt-0.5">{REAL_DEALS.length} 家真实公司 · 公开数据 + VC 经验产出 30 分钟决策包</div>
            <div className="text-[12px] text-ink-600 mt-1">基于 2024 年公开新闻 + 工商信息 + 团队履历 · 10 段深度 / Sequoia 10 评分 / 8 题访谈 / Reference Check 名单</div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link to="/real-deals" className="text-[11px] px-2.5 py-1 rounded-md bg-emerald-700 text-white hover:bg-emerald-800 font-medium">⚡ 全部 {REAL_DEALS.length} 家</Link>
            <Link to="/termsheet" className="text-[11px] px-2.5 py-1 rounded-md bg-emerald-700 text-white hover:bg-emerald-800 font-medium">⚡ Term Sheet</Link>
            <Link to="/captable" className="text-[11px] px-2.5 py-1 rounded-md bg-emerald-700 text-white hover:bg-emerald-800 font-medium">⚡ Cap Table</Link>
            <Link to="/upload" className="text-[11px] text-emerald-700 hover:underline font-medium whitespace-nowrap">上传真 BP →</Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {REAL_DEALS.map(d => {
            const sig = d.score >= 80 ? '🟢 GREEN' : d.score >= 65 ? '🟡 YELLOW' : '🔴 RED'
            return (
              <Link
                key={d.id}
                to={`/deal/${d.id}/decision-pack`}
                className="group bg-white border border-emerald-200 hover:border-emerald-500 hover:shadow-pop rounded-lg p-3 transition flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-ink-900 truncate group-hover:text-emerald-700">{d.name} · {d.cnName}</div>
                  <div className="text-[11px] text-ink-500 mt-0.5">{d.round} · {d.valuation} · {d.tagline.split('·')[0]?.trim()}</div>
                </div>
                <div className="flex items-center gap-2 ml-3 shrink-0">
                  <span className="text-[11px] num text-ink-700"><b>{d.score}</b><span className="text-ink-400">/100</span></span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-ink-50 text-ink-700">{sig}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 首次访问 / 零上传 — 直接给 4 行业示例入口，2 秒上手 */}
      {stats.userUploaded === 0 && (
        <section className="bg-gradient-to-r from-violet-50 via-white to-violet-50 border-2 border-violet-500/30 rounded-2xl p-4 mb-5">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-violet-700 font-medium">演示样例（虚构）</div>
              <div className="text-[14px] font-semibold tracking-tight">想看其他行业？点示例 BP — 30 秒看 LLM 10 段</div>
            </div>
            <Link to="/upload" className="text-[11px] text-violet-700 hover:underline font-medium">上传你的真 BP →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {SAMPLE_BPS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  // 用 sessionStorage 让 Upload 页知道要预填哪个示例
                  try { sessionStorage.setItem('dp:prefill-sample', s.id) } catch {}
                  navigate('/upload')
                }}
                className="text-left bg-white border border-ink-200 rounded-lg p-2.5 hover:border-violet-500/60 hover:shadow-pop transition group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[18px]">{s.emoji}</span>
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium" style={{ background: s.accent + '14', color: s.accent }}>{s.industry}</span>
                </div>
                <div className="text-[12px] font-semibold tracking-tight truncate group-hover:text-violet-800">{s.company}</div>
                <div className="text-[10.5px] text-ink-500 line-clamp-1 mt-0.5">{s.tagline}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-5">
        <MetricCard label="进入筛选" value={stats.total} hint={`含 ${stats.userUploaded} 份用户上传`} accent="#0f766e" />
        <MetricCard label="优先推进" value={stats.priority} hint="80 分以上 · 待 IC" accent="#0f766e" />
        <MetricCard label="漏斗活跃" value={stats.inFunnel} hint="初筛/跟进/尽调/IC" accent="#0ea5e9" />
        <MetricCard label="已 Pass" value={stats.passed} hint="标准化存档" accent="#94a3b8" />
        <MetricCard label="平均评分" value={stats.avgScore} hint="Scorecard 加权" accent="#d97706" />
        <MetricCard label="LLM 已分析" value={stats.llmAnalyzed} hint="✨ 真 LLM 报告" accent="#7c3aed" />
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
              <span>· 当月平均评分 <span className="num text-ink-900 font-semibold">{avgScoreTrend[avgScoreTrend.length - 1]}</span></span>
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

          <div className="bg-white border border-ink-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-[14px] tracking-tight">团队近 7 天活动</h2>
              <span className="text-[10px] text-ink-400 num">14 件</span>
            </div>
            <ol className="space-y-2.5 relative pl-4 before:absolute before:left-[5px] before:top-1 before:bottom-1 before:w-px before:bg-ink-200">
              {[
                { who: 'Henry', t: '2 小时前', icon: '⤴', color: '#0f766e', text: '将 NebulaAI 标记为 Priority + 推入 4/30 IC' },
                { who: 'Elaine', t: '4 小时前', icon: '✓', color: '#0ea5e9', text: 'NeoBank 财务尽调签署 by 德勤' },
                { who: 'AI', t: '6 小时前', icon: '!', color: '#dc2626', text: '触发 CryptoVault 创始人风险预警 → 自动 Pass' },
                { who: 'Martin', t: '今天上午', icon: '✎', color: '#7c3aed', text: '完成 MetaMed 临床顾问 reference check（3/3）' },
                { who: 'Henry', t: '昨天 20:14', icon: '✎', color: '#0f766e', text: '更新 Lumen AI 投后季报：MoM 38%' },
                { who: 'AI', t: '昨天 12:30', icon: '⤳', color: '#d97706', text: '检测到 Orbit Logistics 跑道 < 12 月，触发紧急预警' },
                { who: 'Elaine', t: '前天', icon: '+', color: '#0ea5e9', text: '新增 7 个 BP 入箱（Fintech 4 / Health 2 / Robot 1）' },
              ].map((a, i) => (
                <li key={i} className="relative">
                  <div className="absolute -left-4 top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2" style={{ borderColor: a.color }} />
                  <div className="flex items-center justify-between text-[10px] text-ink-500 mb-0.5">
                    <span className="font-medium">{a.who}</span>
                    <span className="num">{a.t}</span>
                  </div>
                  <div className="text-[12.5px] text-ink-800 leading-relaxed">{a.text}</div>
                </li>
              ))}
            </ol>
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
