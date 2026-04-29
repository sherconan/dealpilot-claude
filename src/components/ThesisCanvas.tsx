import type { Deal } from '../types'

export default function ThesisCanvas({ deal }: { deal: Deal }) {
  const coreBets = deal.wins.slice(0, 3)
  const risks = [
    ...deal.redFlags.filter((f) => f.severity === 'hard').map((f) => `[硬] ${f.label}`),
    ...deal.redFlags.filter((f) => f.severity === 'soft').map((f) => `[软] ${f.label}`),
    ...deal.concerns.slice(0, 2),
  ].slice(0, 4)

  const milestones = generateMilestones(deal)
  const exitPaths = generateExits(deal)

  return (
    <section className="bg-white border border-ink-200 rounded-xl p-5 mb-5">
      <div className="mb-3">
        <h2 className="text-[15px] font-semibold tracking-tight">投资逻辑画布（Investment Thesis Canvas）</h2>
        <p className="text-[12px] text-ink-500 mt-0.5">4 象限可视化 — 一页看清核心赌注、关键风险、里程碑、退出路径</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Quadrant tag="为什么投" title="Core Bet · 核心赌注" tone="emerald" items={coreBets} icon="✓" />
        <Quadrant tag="可能挂在哪" title="Critical Risks · 关键风险" tone="rose" items={risks} icon="!" />
        <Quadrant tag="12/24/36 月" title="Milestones · 里程碑" tone="brand" items={milestones} icon="◆" />
        <Quadrant tag="何时退" title="Exit Path · 退出路径" tone="amber" items={exitPaths} icon="↗" />
      </div>
    </section>
  )
}

const tones: Record<string, { color: string; bg: string; border: string }> = {
  emerald: { color: '#059669', bg: 'bg-emerald-50/60', border: 'border-emerald-200' },
  rose:    { color: '#dc2626', bg: 'bg-rose-50/60',    border: 'border-rose-200' },
  brand:   { color: '#0f766e', bg: 'bg-brand-50/60',   border: 'border-brand-500/30' },
  amber:   { color: '#d97706', bg: 'bg-amber-50/60',   border: 'border-amber-200' },
}

function Quadrant({ tag, title, tone, items, icon }: { tag: string; title: string; tone: string; items: string[]; icon: string }) {
  const t = tones[tone]
  return (
    <div className={`rounded-xl border ${t.border} ${t.bg} p-4 min-h-[140px]`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[12px] font-semibold shrink-0" style={{ background: t.color }}>{icon}</span>
          <div>
            <div className="text-[10px] tracking-wider uppercase font-medium" style={{ color: t.color }}>{tag}</div>
            <div className="text-[13px] font-semibold tracking-tight">{title}</div>
          </div>
        </div>
      </div>
      {items.length === 0 ? (
        <div className="text-[12px] text-ink-400 italic">—</div>
      ) : (
        <ul className="space-y-1.5 mt-2">
          {items.map((it, i) => (
            <li key={i} className="text-[12.5px] text-ink-800 leading-relaxed flex items-start gap-2">
              <span className="w-1 h-1 rounded-full mt-[7px] shrink-0" style={{ background: t.color }} />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function generateMilestones(d: Deal): string[] {
  const round = d.round
  const sector = d.sector
  if (round.includes('Angel') || round.includes('Seed')) {
    return [
      '12 月：达成首批付费客户 + ARR ≥ $1M',
      '24 月：完成 Pre-A，估值 2-3x，PMF 信号清晰',
      '36 月：单位经济学跑通（LTV/CAC ≥ 3、回收期 ≤ 18 月）',
    ]
  }
  if (round.includes('Pre-A') || round.includes('Series A')) {
    return [
      '12 月：ARR ≥ $10M，MoM ≥ 20%',
      '24 月：完成 Series B，估值 3-5x，进入 50 家+ 客户',
      sector.includes('AI') ? '36 月：建立数据飞轮 / Agent 标准卡位' : '36 月：成为细分赛道 Top 3',
    ]
  }
  if (round.includes('Series B')) {
    return [
      '12 月：ARR ≥ $50M，准备 Series C / Pre-IPO',
      '24 月：跨地理区域扩展（至少 3 国本地化）',
      '36 月：上市路径明确（A/H/美股三选一）',
    ]
  }
  return [
    '12 月：完成下一轮融资，估值翻倍',
    '24 月：核心 KPI（ARR / 客户数 / NRR）达成 BP 中位预测',
    '36 月：成为细分赛道公认的头部 1-3 名',
  ]
}

function generateExits(d: Deal): string[] {
  const sector = d.sector
  const v = d.valuation
  const items: string[] = []

  if (sector.includes('AI') || sector.includes('Fintech')) {
    items.push('IPO：港交所 18C / 美股双路径，预计 5-7 年')
    items.push('战略并购：被云厂商 / 头部 SaaS 收购，预计 3-5 年（参考 OpenAI 并购 Rockset）')
  } else if (sector.includes('Health')) {
    items.push('IPO：科创板 / 港股 18A 路径，监管获批后启动')
    items.push('并购：被联影 / 万东 / 推想 等头部医疗 AI 收购')
  } else if (sector.includes('Robot')) {
    items.push('IPO：科创板硬科技路径，硬件成熟期较长')
    items.push('战略并购：被海尔 / 美的 / 大疆 等收购')
  } else {
    items.push('IPO：A 股主板 / 港股，预计 5-8 年')
    items.push('战略并购：行业整合者收购')
  }
  items.push(`老股 S 基金：第 5 年起可执行（当前估值 ${v}）`)
  return items
}
