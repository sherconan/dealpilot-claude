import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getDecisionPackByDealId, getRealDealById, REAL_DEALS, type DecisionPack as DP } from '../data/realDeals'
import type { Deal } from '../types'

const DIM_LABEL: Record<string, string> = {
  mission: '公司使命', problem: '问题', solution: '解决方案', whyNow: '时机',
  market: '市场潜力', competition: '竞争格局', businessModel: '商业模式',
  team: '团队', financials: '财务', vision: '愿景',
}

function FiveSecondSummary({ deal, dp }: { deal: Deal; dp: DP }) {
  const hard = dp.redFlags.filter(f => f.severity === 'hard').length
  const soft = dp.redFlags.filter(f => f.severity === 'soft').length
  const cells = [
    { label: '本轮估值', value: deal.valuation, hint: deal.round },
    { label: '本基金拟出资', value: deal.askAmount, hint: '占本轮 ~16.6%' },
    { label: '团队 / 总部', value: `${deal.teamSize} 人`, hint: deal.location },
    { label: '冠军合伙人', value: deal.champion || 'TBD', hint: '本轮 owner' },
    { label: '红线信号', value: `${hard} 硬 / ${soft} 软`, hint: hard > 0 ? '需会议聚焦缓释' : '无重大红线' },
    { label: 'LLM 评分', value: `${dp.totalScore}/100`, hint: 'Sequoia 加权' },
  ]
  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 print:grid-cols-6">
      {cells.map((c) => (
        <div key={c.label} className="bg-white border border-ink-100 rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-ink-400 mb-0.5">{c.label}</div>
          <div className="text-base font-semibold text-ink-900 leading-tight">{c.value}</div>
          <div className="text-[11px] text-ink-500 mt-0.5">{c.hint}</div>
        </div>
      ))}
    </section>
  )
}

function VerdictHero({ verdict, totalScore, recommendation }: Pick<DP, 'verdict' | 'totalScore' | 'recommendation'>) {
  const palette = verdict.signal === 'GREEN'
    ? { bg: 'bg-emerald-50', border: 'border-emerald-300', dot: 'bg-emerald-500', text: 'text-emerald-900' }
    : verdict.signal === 'YELLOW'
    ? { bg: 'bg-amber-50', border: 'border-amber-300', dot: 'bg-amber-500', text: 'text-amber-900' }
    : { bg: 'bg-rose-50', border: 'border-rose-300', dot: 'bg-rose-500', text: 'text-rose-900' }
  return (
    <section className={`${palette.bg} ${palette.border} border rounded-2xl p-6 md:p-8`}>
      <div className="flex items-start gap-4">
        <span className={`mt-2 inline-block h-4 w-4 rounded-full ${palette.dot} shadow-lg`} />
        <div className="flex-1 space-y-2">
          <div className={`text-xs uppercase tracking-widest ${palette.text} opacity-70`}>
            决策信号 · {verdict.signal}
          </div>
          <h1 className={`text-2xl md:text-3xl font-semibold ${palette.text}`}>
            {verdict.label}
          </h1>
          <p className="text-sm text-ink-600 leading-relaxed">{verdict.reason}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm">
            <span className="text-ink-700"><b className="text-ink-900">{totalScore}</b><span className="text-ink-400"> / 100</span> · Sequoia 加权</span>
            <span className="text-ink-700">建议：<b>{recommendation === 'priority' ? '优先推进' : recommendation === 'monitor' ? '持续观察' : recommendation === 'conditional' ? '附条件' : 'Pass'}</b></span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Sequoia10Card({ scores }: { scores: DP['sequoia10'] }) {
  return (
    <section className="border border-ink-100 rounded-2xl p-6 bg-white">
      <header className="flex items-baseline justify-between mb-4">
        <h2 className="text-lg font-semibold text-ink-900">Sequoia 10 维度真评分</h2>
        <span className="text-xs text-ink-400">含评分依据 · 来自 LLM 真分析 + VC 经验补全</span>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {scores.map((d) => {
          const tone = d.score >= 8 ? 'bg-emerald-500' : d.score >= 6 ? 'bg-amber-500' : 'bg-rose-500'
          return (
            <div key={d.key} className="border border-ink-100 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-ink-900">{DIM_LABEL[d.key] || d.key}</span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded text-white ${tone}`}>{d.score}/10</span>
              </div>
              <p className="text-xs text-ink-600 leading-relaxed">{d.rationale}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function FounderQuestionsCard({ questions }: { questions: DP['founderQuestions'] }) {
  const catLabel: Record<string, string> = {
    financial: '财务', business: '业务', team: '团队', competition: '竞争',
    risk: '风险', 'fund-use': '资金用途', governance: '治理',
  }
  return (
    <section className="border border-ink-100 rounded-2xl p-6 bg-white">
      <header className="flex items-baseline justify-between mb-4">
        <h2 className="text-lg font-semibold text-ink-900">8 题创始人深度访谈</h2>
        <span className="text-xs text-ink-400">基于 BP 真实数字 · 不能被模板话术敷衍</span>
      </header>
      <ol className="space-y-4">
        {questions.map((q, i) => (
          <li key={i} className="border-l-2 border-brand-400 pl-4">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-xs font-mono text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">Q{i + 1}</span>
              <span className="text-xs text-ink-400">{catLabel[q.category] || q.category}</span>
            </div>
            <p className="text-sm text-ink-900 mb-2 leading-relaxed">{q.question}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-ink-50 rounded p-2">
                <div className="text-ink-400 mb-0.5">为什么问</div>
                <div className="text-ink-700">{q.why}</div>
              </div>
              <div className="bg-ink-50 rounded p-2">
                <div className="text-ink-400 mb-0.5">期待回答</div>
                <div className="text-ink-700">{q.expect}</div>
              </div>
              {q.watch && (
                <div className="bg-rose-50 rounded p-2">
                  <div className="text-rose-500 mb-0.5">⚠️ 警惕信号</div>
                  <div className="text-rose-700">{q.watch}</div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function ReferenceCheckCard({ refs }: { refs: DP['referenceCheck'] }) {
  return (
    <section className="border border-ink-100 rounded-2xl p-6 bg-white">
      <header className="flex items-baseline justify-between mb-4">
        <h2 className="text-lg font-semibold text-ink-900">Reference Check 名单（{refs.length} 人）</h2>
        <span className="text-xs text-ink-400">P0/P1/P2 优先级 · 30 分钟会议前完成 P0 半数</span>
      </header>
      <div className="overflow-hidden rounded-lg border border-ink-100">
        <table className="w-full text-sm">
          <thead className="bg-ink-50">
            <tr className="text-left text-xs text-ink-500">
              <th className="px-3 py-2 font-medium">优先级</th>
              <th className="px-3 py-2 font-medium">类型</th>
              <th className="px-3 py-2 font-medium">对象</th>
              <th className="px-3 py-2 font-medium">核验内容</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {refs.map((r, i) => (
              <tr key={i} className="hover:bg-ink-50/50">
                <td className="px-3 py-2">
                  <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${r.priority === 'P0' ? 'bg-rose-100 text-rose-700' : r.priority === 'P1' ? 'bg-amber-100 text-amber-700' : 'bg-ink-100 text-ink-600'}`}>{r.priority}</span>
                </td>
                <td className="px-3 py-2 text-ink-600 whitespace-nowrap">{r.type}</td>
                <td className="px-3 py-2 text-ink-900 font-medium">{r.who}</td>
                <td className="px-3 py-2 text-ink-700 text-xs leading-relaxed">{r.context}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function RedFlagsCard({ flags }: { flags: DP['redFlags'] }) {
  if (!flags?.length) return null
  return (
    <section className="border border-ink-100 rounded-2xl p-6 bg-white">
      <header className="flex items-baseline justify-between mb-4">
        <h2 className="text-lg font-semibold text-ink-900">Red Flag 扫描（{flags.length} 项）</h2>
        <span className="text-xs text-ink-400">硬红线 = 推荐 Pass · 软红线 = 议题进尽调</span>
      </header>
      <ul className="space-y-2">
        {flags.map((f, i) => (
          <li key={i} className={`flex gap-3 p-3 rounded-lg border ${f.severity === 'hard' ? 'border-rose-300 bg-rose-50' : 'border-amber-200 bg-amber-50'}`}>
            <span className={`text-xs font-mono px-1.5 py-0.5 rounded h-5 flex items-center ${f.severity === 'hard' ? 'bg-rose-200 text-rose-800' : 'bg-amber-200 text-amber-800'}`}>
              {f.severity === 'hard' ? '硬' : '软'}
            </span>
            <div>
              <div className="text-sm font-medium text-ink-900">{f.label}</div>
              <div className="text-xs text-ink-600 mt-0.5">{f.detail}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function DeepAnalysisCard({ sections }: { sections: DP['deepAnalysis'] }) {
  return (
    <section className="border border-ink-100 rounded-2xl p-6 bg-white">
      <header className="flex items-baseline justify-between mb-4">
        <h2 className="text-lg font-semibold text-ink-900">10 段深度分析</h2>
        <span className="text-xs text-ink-400">Pollinations LLM 真分析 · 总 {sections.reduce((a, s) => a + s.content.length, 0).toLocaleString()} 字</span>
      </header>
      <div className="space-y-5">
        {sections.map((s, i) => (
          <div key={i} className="border-l-2 border-ink-200 pl-4">
            <h3 className="text-sm font-medium text-ink-900 mb-1">{s.label}</h3>
            <p className="text-sm text-ink-700 leading-relaxed whitespace-pre-line">{s.content}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function DecisionPack() {
  const { id } = useParams()
  const navigate = useNavigate()

  const deal = id ? getRealDealById(id) : undefined
  const dp = id ? getDecisionPackByDealId(id) : undefined

  useEffect(() => {
    if (deal) document.title = `30分钟决策包 · ${deal.cnName} · DealPilot`
  }, [deal])

  // 不在真实公司库 → 引导到现有真实公司 + 上传 BP
  if (!deal || !dp) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 space-y-4">
        <h1 className="text-xl font-semibold text-ink-900">该项目暂无完整 30 分钟决策包</h1>
        <p className="text-sm text-ink-600">
          决策包目前只对接入真实公开信息的项目生成。当前已接入 <b>{REAL_DEALS.length}</b> 家真实公开公司：
        </p>
        <ul className="space-y-2 ml-4">
          {REAL_DEALS.map(d => (
            <li key={d.id}>
              <Link to={`/deal/${d.id}/decision-pack`} className="text-brand-600 hover:underline font-medium">
                {d.name} · {d.cnName}（{d.round} · {d.valuation}）
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-sm text-ink-500 pt-2">
          其他项目可在 <Link to="/upload" className="text-brand-600 hover:underline">上传 BP</Link> 走完整 LLM 分析流程后，自动产出决策包草稿。
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6">
      {/* 面包屑 */}
      <nav className="text-xs text-ink-400 flex items-center gap-2 no-print">
        <Link to="/" className="hover:text-brand-600">驾驶舱</Link>
        <span>/</span>
        <Link to={`/deal/${deal.id}`} className="hover:text-brand-600">{deal.name}</Link>
        <span>/</span>
        <span className="text-ink-700">30 分钟决策包</span>
      </nav>

      {/* 头部 */}
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-widest text-ink-400 mb-1">30-MINUTE DECISION PACK</div>
          <h1 className="text-2xl md:text-3xl font-semibold text-ink-900">
            {deal.name} · <span className="text-ink-500">{deal.cnName}</span>
          </h1>
          <p className="text-sm text-ink-600 mt-1">{deal.tagline}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-ink-500">
            <span>{deal.sector}</span>
            <span>·</span>
            <span>{deal.round}</span>
            <span>·</span>
            <span>本轮估值 {deal.valuation}</span>
            <span>·</span>
            <span>本基金拟出资 {deal.askAmount}</span>
            <span>·</span>
            <span>团队 {deal.teamSize} 人 · {deal.location}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 no-print">
          <button
            onClick={() => navigate(`/deal/${deal.id}`)}
            className="px-3 py-1.5 text-sm border border-ink-200 rounded-lg hover:bg-ink-50"
          >
            ← 项目详情
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700"
          >
            打印 / 导出 PDF
          </button>
        </div>
      </header>

      {/* 1. 决策信号 hero */}
      <VerdictHero verdict={dp.verdict} totalScore={dp.totalScore} recommendation={dp.recommendation} />

      {/* 1.5. 5 秒决策摘要（KPI 行）— 让合伙人扫一眼就有判断 */}
      <FiveSecondSummary deal={deal} dp={dp} />

      {/* 2. Sequoia 10 评分 */}
      <Sequoia10Card scores={dp.sequoia10} />

      {/* 3. 8 题创始人访谈 */}
      <FounderQuestionsCard questions={dp.founderQuestions} />

      {/* 4. Reference Check 名单 */}
      <ReferenceCheckCard refs={dp.referenceCheck} />

      {/* 5. Red Flag */}
      <RedFlagsCard flags={dp.redFlags} />

      {/* 6. 10 段深度分析 */}
      <DeepAnalysisCard sections={dp.deepAnalysis} />

      {/* 数据来源透明 */}
      <footer className="border-t border-ink-100 pt-4 text-xs text-ink-400 leading-relaxed">
        <div>数据来源：{dp.meta.source}</div>
        <div>BP 来源：2024 年 3-8 月公开新闻报道 + 工商信息 + 团队公开履历整理</div>
        <div>分析时间：{new Date(dp.meta.runAt).toLocaleString('zh-CN')} · 完成于 {new Date(dp.meta.finalizedAt).toLocaleString('zh-CN')}</div>
        <div className="mt-2">⚠️ 本决策包基于公开信息生成，不构成投资建议；实际投资决策需完成全部尽调流程。</div>
      </footer>
    </div>
  )
}
