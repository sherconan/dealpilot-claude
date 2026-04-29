import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDealById } from '../data/deals'
import { getDealExtra } from '../data/extra'
import { sequoiaLabels, recommendationMeta } from '../lib/scoring'
import ScoreRing from '../components/ScoreRing'
import ThesisCanvas from '../components/ThesisCanvas'

export default function ICMemo() {
  const { id } = useParams()
  const deal = getDealById(id || '')
  const extra = getDealExtra(id || '')
  const [shareCopied, setShareCopied] = useState(false)
  if (!deal) return <div className="p-10 text-center text-ink-500">项目未找到</div>
  const recMeta = recommendationMeta[deal.recommendation]
  const topComp = extra?.publicComps[0]

  const sections = [
    { id: 'memo-1', title: '执行摘要' },
    { id: 'memo-2', title: '市场分析' },
    { id: 'memo-3', title: '团队评估' },
    { id: 'memo-4', title: '产品 / 牵引力' },
    { id: 'memo-5', title: '单位经济学' },
    { id: 'memo-6', title: '风险与缓释' },
    { id: 'memo-7', title: '投资结构与退出' },
    { id: 'memo-8', title: 'Sequoia 10 附录' },
  ]
  const handlePrint = () => window.print()
  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2200)
    } catch { /* clipboard might be blocked */ }
  }

  return (
    <div className="px-8 py-6 max-w-[1280px] mx-auto grid lg:grid-cols-[200px_1fr] gap-8">
      <aside className="hidden lg:block sticky top-6 self-start no-print">
        <div className="text-[10px] tracking-wider uppercase text-ink-500 font-medium mb-2">本页目录</div>
        <ol className="space-y-1.5 border-l border-ink-200 pl-3">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-[12.5px] text-ink-600 hover:text-brand-700 transition flex items-baseline gap-1.5">
                <span className="num text-[10px] text-ink-400 font-medium">0{i + 1}</span>
                <span>{s.title}</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="mt-4 text-[10px] text-ink-400 leading-relaxed">
          <kbd className="bg-ink-100 border border-ink-200 px-1 rounded num">⌘P</kbd> 打印 / <kbd className="bg-ink-100 border border-ink-200 px-1 rounded num">esc</kbd> 取消
        </div>
      </aside>
      <div>
      <div className="flex items-center gap-2 text-[12px] text-ink-500 mb-3">
        <Link to={`/deal/${deal.id}`} className="hover:text-brand-700">{deal.name}</Link>
        <span>/</span>
        <span className="text-ink-900">IC Memo</span>
      </div>

      <header className="flex items-start justify-between mb-5 gap-4">
        <div>
          <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">IC Memorandum · Draft</div>
          <h1 className="text-[24px] font-semibold tracking-tight mt-1">{deal.name} · 投资委员会备忘录</h1>
          <p className="text-[12px] text-ink-500 mt-1.5">生成于 2026-04-24 10:32 GMT+8 · 基于 AI 自动聚合 + 人工校对 · <span className="text-brand-700">信念文件（Conviction Document）</span></p>
        </div>
        <div className="flex items-center gap-2 no-print">
          <button onClick={handleShare} className="px-3.5 py-2 text-[13px] rounded-lg border border-ink-200 bg-white hover:bg-ink-50 inline-flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor"><path d="M11 1.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM5 6.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zm6 5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM6.85 7.4l3.3-1.9m-3.3 4.2l3.3 1.9" stroke="currentColor" strokeWidth="1" fill="none"/></svg>
            {shareCopied ? '已复制 ✓' : '分享链接'}
          </button>
          <button onClick={handlePrint} className="px-3.5 py-2 text-[13px] rounded-lg border border-ink-200 bg-white hover:bg-ink-50 inline-flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor"><path d="M3 7V2h10v5h2a1 1 0 011 1v5a1 1 0 01-1 1h-2v-3H3v3H1a1 1 0 01-1-1V8a1 1 0 011-1h2zm10 0V3H4v4h9zm0 5v-3H4v3h9z"/></svg>
            打印 / 导出 PDF
          </button>
          <button className="px-3.5 py-2 text-[13px] rounded-lg bg-brand-700 text-white hover:bg-brand-800">提交投委会</button>
        </div>
      </header>

      <article className="bg-white border border-ink-200 rounded-xl p-10 shadow-card prose-sm">
        {/* Visual Hero — 评分 + 推荐 + 真实可比锚定 */}
        <div className="flex items-center gap-6 mb-8 pb-6 border-b border-ink-100">
          <ScoreRing score={deal.score} color={deal.accentColor} size={120} label="Scorecard" />
          <div className="flex-1">
            <div className="text-[11px] tracking-wider uppercase text-ink-500">投决建议</div>
            <div className="text-[24px] font-semibold tracking-tight mt-0.5" style={{ color: recMeta.color }}>{recMeta.label}</div>
            <p className="text-[12.5px] text-ink-700 mt-1.5 leading-relaxed">{recMeta.rationale}</p>
            {topComp && (
              <div className="mt-2.5 text-[11px] text-ink-600 bg-ink-50 rounded px-2.5 py-1.5 inline-block">
                估值锚定：<b>{topComp.name}</b> {topComp.ticker} · 营收 <span className="num">{topComp.revenue}</span> · 净利率 <span className="num">{topComp.netMargin}</span>
                <span className="text-emerald-700 ml-2 num font-medium">✓ akshare 实时</span>
              </div>
            )}
          </div>
        </div>

        <Section num="1" title="执行摘要（Executive Summary）">
          <div className="grid grid-cols-4 gap-3 mb-4 text-[12px]">
            <Kv k="公司" v={`${deal.name} / ${deal.cnName}`} />
            <Kv k="阶段" v={deal.round} />
            <Kv k="投前估值" v={deal.valuation} />
            <Kv k="本轮融资" v={deal.askAmount} />
            <Kv k="领投角色" v="本基金拟领投" />
            <Kv k="板块" v={deal.sector} />
            <Kv k="冠军合伙人" v={deal.champion || '—'} />
            <Kv k="Scorecard" v={`${deal.score} / 100`} />
          </div>
          <p>
            {deal.name}（{deal.cnName}）是一家{deal.tagline.replace(/^为/, '')}的公司。本备忘录建议基金参与其 {deal.round} 轮，投入 {deal.askAmount}。
            基于 Sequoia 10 要素框架与机构内部 Scorecard，项目综合评分 <b>{deal.score} / 100</b>，推荐 <b>{deal.recommendation === 'priority' ? '优先推进（Priority Deal）' : deal.recommendation === 'monitor' ? '持续观察（Monitor）' : deal.recommendation === 'conditional' ? '有条件跟进（Conditional）' : '建议 Pass'}</b>。
          </p>
          <h4 className="mt-4">三个核心投资论点</h4>
          <ol>
            {deal.wins.slice(0, 3).map((w, i) => <li key={i}>{w}</li>)}
          </ol>
        </Section>

        <Section num="2" title="市场分析（Market Analysis）">
          <div className="grid grid-cols-2 gap-3 mb-3 text-[12px]">
            <Kv k="TAM" v={deal.tam} />
            <Kv k="SAM" v={deal.sam} />
          </div>
          <p>
            为什么是现在（Why Now）：标的所处赛道处于 2026 年的关键窗口期 — {deal.sector === 'AI Infra' ? '企业 AI Agent 从 POC 进入生产级部署，2024–2026 是平台级玩家卡位的唯一窗口。' : deal.sector === 'Fintech' ? '东南亚 SME 金融数字化渗透率不足 28%，监管框架 2024 年落地后第一次出现可规模化的合规路径。' : deal.sector === 'HealthTech' ? 'NMPA 对 AI 影像的 III 类器械审评路径 2025 年走通，行业进入商业化起点。' : '赛道底层结构性变化正在发生，技术/政策/资本同步到位。'}
          </p>
          <h4 className="mt-4">竞争格局</h4>
          <p>
            直接竞品在 {deal.sequoia.competition >= 7 ? '产品差异化' : '产品同质化'}、{deal.sequoia.market >= 7 ? '市场规模' : '市场天花板'}、{deal.sequoia.team >= 8 ? '创始人基因' : '团队执行'} 三个维度均存在明显差距，标的在 <b>{deal.wins[0]}</b> 上形成独特护城河。
          </p>
        </Section>

        <Section num="3" title="团队评估（Team）">
          <p>五个维度评估：能力 / 行业经验 / 热情 / 团队互补 / 创业经验</p>
          <ul>
            {deal.founders.map((f) => (
              <li key={f.name}><b>{f.name}</b>（{f.role}）— {f.background}{f.highlight ? `；${f.highlight}` : ''}。</li>
            ))}
          </ul>
          <p className="mt-2">团队评分 <b>{deal.sequoia.team} / 10</b> — {deal.sequoia.team >= 8 ? '创始人-赛道契合度极高，是本次投资的核心下注。' : deal.sequoia.team >= 6 ? '团队具备执行基础，但合伙人结构仍需观察。' : '团队为主要风险项，需在尽调中重点验证。'}</p>
        </Section>

        <Section num="4" title="产品与牵引力（Product / Traction）">
          <div className="grid grid-cols-4 gap-3 mb-3 text-[12px]">
            {deal.traction.map((t) => <Kv key={t.label} k={t.label} v={t.value} />)}
          </div>
          <p>真实客户数据表明产品已找到早期 PMF 信号。Sequoia 框架中"解决方案可防御性"评分为 <b>{deal.sequoia.solution} / 10</b>。</p>
        </Section>

        <Section num="5" title="单位经济学（Unit Economics）">
          <div className="grid grid-cols-3 gap-3 mb-3 text-[12px]">
            <Kv k="ARR" v={deal.arr || '—'} />
            <Kv k="增长率" v={deal.growthRate || '—'} />
            <Kv k="LTV / CAC" v={deal.ltvCac ? `${deal.ltvCac}x` : '—'} />
            <Kv k="CAC 回收期" v={deal.cacPayback || '—'} />
            <Kv k="毛利率" v={deal.grossMargin || '—'} />
            <Kv k="NRR" v={deal.traction.find(t => t.label === 'NRR')?.value || '—'} />
          </div>
          <p>{deal.ltvCac && deal.ltvCac >= 3 ? `LTV/CAC 达 ${deal.ltvCac}x，显著高于行业成长期门槛 3x。` : 'LTV/CAC 尚未达到成长期标准，需在下一轮融资前验证。'}</p>
        </Section>

        <Section num="6" title="风险与缓释（Risks & Mitigation）">
          {deal.redFlags.length === 0 ? (
            <p>未发现结构性风险。</p>
          ) : (
            <ul>
              {deal.redFlags.map((f, i) => (
                <li key={i}>
                  <b className={f.severity === 'hard' ? 'text-rose-700' : 'text-amber-700'}>
                    [{f.severity === 'hard' ? '硬红线' : '软扣分'}] {f.label}
                  </b> — {f.detail}。缓释措施：{f.severity === 'hard' ? '已纳入 TS 条件条款，作为交割前置条件。' : '投后 90 天内纳入被投公司月度通报。'}
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section num="7" title="投资结构与退出路径">
          <ul>
            <li>投资形式：{deal.round} 优先股；领投；要求 1 席董事会席位 + 观察员 1 席</li>
            <li>估值：投前 {deal.valuation}，本轮融资 {deal.askAmount}，本基金出资占本轮 ~60%</li>
            <li>关键条款：1x 非参与型清算优先、加权平均反稀释、ROFR + Tag-Along、Board 关键事项一票</li>
            <li>退出路径：IPO（港交所 / 美股双路径）+ 被大型产业集团战略并购 + 老股 S 基金（第 5 年起可执行）</li>
          </ul>
        </Section>

        <Section num="8" title="Sequoia 10 要素评分（附录）">
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[12px]">
            {sequoiaLabels.map((s) => (
              <div key={s.key} className="flex items-center justify-between border-b border-ink-100 py-1.5">
                <span>{s.label}</span>
                <span className="num font-semibold">{deal.sequoia[s.key]} / 10</span>
              </div>
            ))}
          </div>
        </Section>

        <div className="mt-8 pt-4 border-t border-ink-200 text-[11px] text-ink-500 flex items-center justify-between">
          <span>冠军合伙人签字：{deal.champion || '—'}</span>
          <span>状态：草稿 · 待 IC 表决</span>
        </div>
      </article>
      </div>
    </div>
  )
}

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <section id={`memo-${num}`} className="mb-8 scroll-mt-6">
      <h3 className="text-[15px] font-semibold tracking-tight mb-2 flex items-center gap-2 text-ink-900">
        <span className="num w-6 h-6 rounded bg-brand-700 text-white text-[11px] flex items-center justify-center">{num}</span>
        {title}
      </h3>
      <div className="text-[13px] text-ink-700 leading-[1.8] space-y-2 [&_h4]:text-[13px] [&_h4]:font-semibold [&_h4]:text-ink-900 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1">
        {children}
      </div>
    </section>
  )
}

function Kv({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-ink-50 rounded-md px-3 py-2">
      <div className="text-[10px] text-ink-500 tracking-wider uppercase">{k}</div>
      <div className="text-[13px] font-medium num mt-0.5">{v}</div>
    </div>
  )
}
