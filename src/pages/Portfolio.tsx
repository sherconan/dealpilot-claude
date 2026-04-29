import { useApp } from '../contexts/AppContext'

interface PortfolioCo {
  id: string
  name: string
  cnName: string
  sector: string
  round: string
  invested: string
  ownership: string
  entryDate: string
  initialValuation: string
  currentValuation: string
  multiple: string
  arrAtEntry: string
  arrCurrent: string
  arrGrowth: string
  runwayMonths: number
  health: 'strong' | 'on-track' | 'watch' | 'concern'
  lastReport: string
  champion: string
  accent: string
}

const portfolio: PortfolioCo[] = [
  {
    id: 'lumen-ai',
    name: 'Lumen AI',
    cnName: '流明智能',
    sector: 'AI Infra',
    round: 'Series A',
    invested: '$10M',
    ownership: '12.4%',
    entryDate: '2024-03',
    initialValuation: '$80M',
    currentValuation: '$340M',
    multiple: '4.25x',
    arrAtEntry: '$1.2M',
    arrCurrent: '$18.4M',
    arrGrowth: '+1,433%',
    runwayMonths: 38,
    health: 'strong',
    lastReport: '2026-Q1 季报',
    champion: 'Henry Zhao',
    accent: '#0f766e',
  },
  {
    id: 'pulse-finance',
    name: 'Pulse Finance',
    cnName: '脉冲金融',
    sector: 'Fintech',
    round: 'Series B',
    invested: '$22M',
    ownership: '8.1%',
    entryDate: '2023-09',
    initialValuation: '$240M',
    currentValuation: '$520M',
    multiple: '2.17x',
    arrAtEntry: '$8.5M',
    arrCurrent: '$32M',
    arrGrowth: '+276%',
    runwayMonths: 24,
    health: 'on-track',
    lastReport: '2026-Q1 月报',
    champion: 'Elaine Xu',
    accent: '#0ea5e9',
  },
  {
    id: 'helix-bio',
    name: 'Helix Bio',
    cnName: '螺旋生物',
    sector: 'BioTech',
    round: 'Seed',
    invested: '$3M',
    ownership: '14.0%',
    entryDate: '2024-11',
    initialValuation: '$18M',
    currentValuation: '$22M',
    multiple: '1.22x',
    arrAtEntry: '—',
    arrCurrent: '$0.4M',
    arrGrowth: 'pre-PMF',
    runwayMonths: 18,
    health: 'watch',
    lastReport: '2026-Q1 季报',
    champion: 'Martin Li',
    accent: '#8b5cf6',
  },
  {
    id: 'orbit-logistics',
    name: 'Orbit Logistics',
    cnName: '轨道物流',
    sector: 'Logistics',
    round: 'Series A',
    invested: '$8M',
    ownership: '9.2%',
    entryDate: '2023-06',
    initialValuation: '$70M',
    currentValuation: '$58M',
    multiple: '0.83x',
    arrAtEntry: '$3.2M',
    arrCurrent: '$4.1M',
    arrGrowth: '+28%',
    runwayMonths: 9,
    health: 'concern',
    lastReport: '2026-Q1 月报 + 紧急 GP 介入',
    champion: 'Henry Zhao',
    accent: '#dc2626',
  },
]

const healthMeta = {
  strong: { color: '#059669', bg: 'bg-emerald-50', label: '强劲增长' },
  'on-track': { color: '#0ea5e9', bg: 'bg-sky-50', label: '正常推进' },
  watch: { color: '#d97706', bg: 'bg-amber-50', label: '需要关注' },
  concern: { color: '#dc2626', bg: 'bg-rose-50', label: '紧急介入' },
}

export default function Portfolio() {
  const { t } = useApp()
  const totalInvested = '$43M'
  const totalCurrentValue = '$110M'
  const tvpi = '2.56x'
  const dpi = '0.12x'
  const irr = '38.4%'

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto">
      <header className="mb-5">
        <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">Portfolio · Post-Investment</div>
        <h1 className="text-[26px] font-semibold tracking-tight mt-1">{t('nav.portfolio')}</h1>
        <p className="text-[13.5px] text-ink-700 mt-1.5 max-w-3xl leading-relaxed">
          已投项目跟踪 · 季度估值更新 · ARR / 跑道 / 异常预警 · 投后管理一体化看板
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        <Kpi label="累计投资" value={totalInvested} hint="基金 II 期" accent="#0f766e" />
        <Kpi label="当前公允价值" value={totalCurrentValue} hint="2026-Q1" accent="#0ea5e9" />
        <Kpi label="TVPI" value={tvpi} hint="账面 + 已分配 / 投入" accent="#0f766e" />
        <Kpi label="DPI" value={dpi} hint="已分配 / 投入" accent="#94a3b8" />
        <Kpi label="IRR" value={irr} hint="季度年化" accent="#059669" />
      </section>

      <section className="bg-white border border-ink-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1.4fr_120px_120px_140px_120px_140px_120px_140px] gap-3 px-5 py-3 text-[10px] tracking-wider uppercase text-ink-500 bg-ink-50 border-b border-ink-200">
          <div>项目</div>
          <div className="text-right">投入 / 占股</div>
          <div className="text-right">入场 / 当前</div>
          <div className="text-right">回报倍数</div>
          <div className="text-right">ARR 当前</div>
          <div className="text-right">ARR 增长</div>
          <div className="text-right">跑道</div>
          <div>状态</div>
        </div>
        <div className="divide-y divide-ink-100">
          {portfolio.map((p) => {
            const m = healthMeta[p.health]
            return (
              <div key={p.id} className="grid grid-cols-[1.4fr_120px_120px_140px_120px_140px_120px_140px] gap-3 px-5 py-3 text-[12.5px] hover:bg-ink-50 transition items-center">
                <div className="min-w-0">
                  <div className="font-medium text-ink-900 truncate">{p.name}<span className="text-ink-500 font-normal ml-1.5">{p.cnName}</span></div>
                  <div className="text-[11px] text-ink-500 truncate">{p.sector} · {p.round} · 入场 {p.entryDate} · {p.champion}</div>
                </div>
                <div className="text-right num">
                  <div className="font-medium">{p.invested}</div>
                  <div className="text-[11px] text-ink-500">{p.ownership}</div>
                </div>
                <div className="text-right num">
                  <div className="text-[11px] text-ink-500">{p.initialValuation}</div>
                  <div className="font-medium">{p.currentValuation}</div>
                </div>
                <div className="text-right num font-semibold" style={{ color: p.accent }}>{p.multiple}</div>
                <div className="text-right num">{p.arrCurrent}</div>
                <div className="text-right num text-emerald-700 font-medium">{p.arrGrowth}</div>
                <div className="text-right">
                  <div className="num font-medium">{p.runwayMonths} 月</div>
                  <div className="h-1 bg-ink-100 rounded-full mt-0.5 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, (p.runwayMonths / 36) * 100)}%`, background: p.runwayMonths > 18 ? '#059669' : p.runwayMonths > 10 ? '#d97706' : '#dc2626' }} />
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full ${m.bg}`} style={{ color: m.color }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />
                    {m.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mt-5 bg-white border border-rose-200 rounded-xl p-5">
        <h2 className="text-[14px] font-semibold tracking-tight text-rose-700 flex items-center gap-2">
          <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM7.25 5a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0V5zM8 12a1 1 0 110-2 1 1 0 010 2z"/></svg>
          投后异常预警
        </h2>
        <ul className="mt-3 space-y-2 text-[13px] text-ink-800 leading-relaxed">
          <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-[7px] shrink-0" /><span><b>Orbit Logistics</b>：现金跑道 9 个月，低于警戒线（12 月）。建议本周内召开紧急 GP 会议，讨论桥贷或战略并购选项。</span></li>
          <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-[7px] shrink-0" /><span><b>Helix Bio</b>：FDA 临床 II 期入组延迟 3 个月，跑道剩余 18 月需要在 Q3 启动 Bridge 轮 / 战略 LP 沟通。</span></li>
          <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-[7px] shrink-0" /><span><b>Lumen AI</b>：MoM 38% 持续 6 个月，建议在 Series B 启动前协调 LP 加注配额。</span></li>
        </ul>
      </section>
    </div>
  )
}

function Kpi({ label, value, hint, accent }: { label: string; value: string; hint: string; accent: string }) {
  return (
    <div className="bg-white border border-ink-200 rounded-xl p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: accent }} />
      <div className="text-[11px] text-ink-500 tracking-wider uppercase">{label}</div>
      <div className="num font-semibold text-ink-900 text-[22px] tracking-tight mt-1">{value}</div>
      <div className="text-[11px] text-ink-500 mt-1">{hint}</div>
    </div>
  )
}
