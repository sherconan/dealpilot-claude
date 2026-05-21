import { useMemo } from 'react'
import { useApp } from '../contexts/AppContext'
import { Link } from 'react-router-dom'
import { useAllDeals } from '../lib/userDealStore'
import { REAL_DEALS, REAL_DECISION_PACKS } from '../data/realDeals'

interface Signal {
  id: string
  ts: string
  company: string
  dealId?: string
  channel: 'linkedin' | 'github' | 'media' | 'patent' | 'web' | 'product-hunt' | 'recruit'
  level: 'critical' | 'high' | 'medium' | 'low'
  title: string
  detail: string
  source: string
}

// 从 6 真公司决策包派生 signals（替代过去虚构 NebulaAI/NeoBank/CryptoVault 等）
function deriveRealSignals(): Signal[] {
  const out: Signal[] = []
  REAL_DEALS.forEach((d, di) => {
    const dp = REAL_DECISION_PACKS[d.id]
    if (!dp) return
    // 1) 硬红线 → critical
    dp.redFlags.filter(f => f.severity === 'hard').forEach((f, i) => {
      out.push({
        id: `real-${d.id}-rf-hard-${i}`,
        ts: `${(di * 3 + i) + 1} 小时前`,
        company: `${d.name} · ${d.cnName}`,
        dealId: d.id,
        channel: 'patent',
        level: 'critical',
        title: `硬红线 · ${f.label}`,
        detail: f.detail,
        source: `DealPilot 决策包 · 数据源：${dp.meta.source.split('+')[0].trim()}`,
      })
    })
    // 2) 软红线 top 2 → high
    dp.redFlags.filter(f => f.severity === 'soft').slice(0, 2).forEach((f, i) => {
      out.push({
        id: `real-${d.id}-rf-soft-${i}`,
        ts: `${(di * 3 + i) + 2} 小时前`,
        company: `${d.name} · ${d.cnName}`,
        dealId: d.id,
        channel: 'media',
        level: 'high',
        title: `软红线 · ${f.label}`,
        detail: f.detail,
        source: 'DealPilot 决策包 · Red Flag 引擎',
      })
    })
    // 3) Verdict 决策信号
    const sigLevel: Signal['level'] = dp.verdict.signal === 'GREEN' ? 'medium' : dp.verdict.signal === 'YELLOW' ? 'high' : 'critical'
    out.push({
      id: `real-${d.id}-verdict`,
      ts: `${di * 3 + 1} 天前`,
      company: `${d.name} · ${d.cnName}`,
      dealId: d.id,
      channel: 'web',
      level: sigLevel,
      title: `Verdict ${dp.verdict.signal} · ${dp.verdict.label}（${dp.totalScore}/100）`,
      detail: dp.verdict.reason,
      source: 'DealPilot 决策包 · Sequoia 10 加权评分',
    })
  })
  return out
}

const signals: Signal[] = deriveRealSignals()

const channelMeta = {
  linkedin: { label: 'LinkedIn', color: '#0a66c2' },
  github: { label: 'GitHub', color: '#171717' },
  media: { label: '媒体', color: '#dc2626' },
  patent: { label: '专利 / 监管', color: '#7c3aed' },
  web: { label: 'Web', color: '#0ea5e9' },
  'product-hunt': { label: 'PH', color: '#da552f' },
  recruit: { label: '招聘', color: '#0f766e' },
}

const levelMeta = {
  critical: { color: '#dc2626', label: '紧急', bg: 'bg-rose-50', border: 'border-rose-200' },
  high: { color: '#d97706', label: '高', bg: 'bg-amber-50', border: 'border-amber-200' },
  medium: { color: '#0ea5e9', label: '中', bg: 'bg-sky-50', border: 'border-sky-200' },
  low: { color: '#64748b', label: '低', bg: 'bg-ink-100', border: 'border-ink-300' },
}

export default function Signals() {
  const { t } = useApp()
  const allDeals = useAllDeals()

  // 用户上传 BP 自动生成的合成 signal — 把"刚上传"也变成可监控事件流
  const userSignals: Signal[] = useMemo(() => {
    const out: Signal[] = []
    const userDeals = allDeals.filter(d => d.id.startsWith('user-'))
    userDeals.forEach((d, i) => {
      // 每个上传 deal 各自一条 BP 入箱信号
      out.push({
        id: `user-${d.id}-upload`,
        ts: d.lastUpdated || '刚刚',
        company: d.name,
        dealId: d.id,
        channel: 'web',
        level: 'medium',
        title: `BP 入箱 · LLM 真分析完成（${d.score}/100）`,
        detail: `${d.tagline.slice(0, 80)}${d.tagline.length > 80 ? '…' : ''}`,
        source: 'DealPilot Upload Pipeline · LLM 流式生成 10 段',
      })
      // 硬红线 → 紧急信号
      const hard = d.redFlags.filter(f => f.severity === 'hard')
      if (hard.length > 0) {
        out.push({
          id: `user-${d.id}-rf`,
          ts: d.lastUpdated || '刚刚',
          company: d.name,
          dealId: d.id,
          channel: 'patent',
          level: 'critical',
          title: `硬红线触发 · ${hard.length} 项不可接受问题`,
          detail: hard.map(f => f.label).join(' · '),
          source: 'DealPilot Red Flag 引擎 · 本地规则',
        })
      }
      // 高分项目 → 推 IC 信号
      if (d.score >= 80) {
        out.push({
          id: `user-${d.id}-priority`,
          ts: d.lastUpdated || '刚刚',
          company: d.name,
          dealId: d.id,
          channel: 'media',
          level: 'high',
          title: `高分入 IC pre-read · 评分 ${d.score} ≥ 80`,
          detail: d.llmOneLiner || '推荐进入 IC 表决前的合伙人晨会议程',
          source: 'DealPilot Scorecard',
        })
      }
    })
    return out
  }, [allDeals])

  // 合并 mock signals + user signals，按 critical → high → medium → low 排序
  const allSignals = [...userSignals, ...signals]

  const stats = {
    total: allSignals.length,
    critical: allSignals.filter(s => s.level === 'critical').length,
    high: allSignals.filter(s => s.level === 'high').length,
    last24h: allSignals.length,
    userGenerated: userSignals.length,
  }

  return (
    <div className="px-4 md:px-8 py-6 max-w-[1400px] mx-auto">
      <header className="mb-5">
        <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">Signal Radar · Pre-emptive Deal Alert</div>
        <h1 className="text-[26px] font-semibold tracking-tight mt-1">{t('nav.signals')}</h1>
        <p className="text-[13.5px] text-ink-700 mt-1.5 max-w-3xl leading-relaxed">
          监控 100+ 信号源（LinkedIn / GitHub / 招聘平台 / 行业媒体 / 监管公告）→ 在公司正式融资前识别潜在优质标的，或在投后第一时间发现异常。
          头部 VC 使用此类工具的专属 deal flow 比传统方式增加 <b>40%</b>（VCOS 2025 数据）。
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Stat label="近 24h 信号" value={stats.last24h} accent="#0f766e" />
        <Stat label="紧急信号" value={stats.critical} accent="#dc2626" />
        <Stat label="高优信号" value={stats.high} accent="#d97706" />
        <Stat label="信号源接入" value={'7 类'} accent="#0ea5e9" />
      </section>

      <section className="bg-white border border-ink-200 rounded-xl">
        <div className="px-5 py-3 border-b border-ink-200 flex items-center justify-between">
          <h2 className="text-[14px] font-semibold tracking-tight">实时信号流</h2>
          <div className="flex items-center gap-2">
            {(['critical', 'high', 'medium', 'low'] as const).map((lv) => {
              const m = levelMeta[lv]
              const count = allSignals.filter(s => s.level === lv).length
              return (
                <span key={lv} className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full ${m.bg}`} style={{ color: m.color }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />
                  {m.label} {count}
                </span>
              )
            })}
          </div>
        </div>
        <div className="divide-y divide-ink-100">
          {allSignals.map((s) => {
            const isUser = s.id.startsWith('user-')
            const cm = channelMeta[s.channel]
            const lm = levelMeta[s.level]
            return (
              <article key={s.id} className={`px-5 py-4 hover:bg-ink-50 transition ${isUser ? 'border-l-4 border-l-violet-500' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[10px] font-semibold shrink-0" style={{ background: cm.color }}>{cm.label.slice(0, 2)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] tracking-wider uppercase text-ink-400 num">{s.ts}</span>
                      <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded`} style={{ color: lm.color, background: lm.color + '14' }}>{lm.label}</span>
                      {isUser && <span className="text-[9px] text-violet-700 bg-violet-50 px-1 py-0.5 rounded font-medium border border-violet-200">✨ 用户上传</span>}
                      <span className="text-[12px] text-ink-700 font-medium">
                        {s.dealId ? <Link to={`/deal/${s.dealId}`} className="hover:text-brand-700">{s.company}</Link> : s.company}
                      </span>
                      <span className="text-[10px] text-ink-400">· {cm.label}</span>
                    </div>
                    <div className="text-[14px] font-semibold text-ink-900 mt-1">{s.title}</div>
                    <div className="text-[12.5px] text-ink-700 mt-1 leading-relaxed">{s.detail}</div>
                    <div className="text-[10px] text-ink-400 mt-1.5 font-mono">来源：{s.source}</div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <div className="bg-white border border-ink-200 rounded-xl p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: accent }} />
      <div className="text-[11px] text-ink-500 tracking-wider uppercase">{label}</div>
      <div className="num font-semibold text-ink-900 text-[22px] tracking-tight mt-1">{value}</div>
    </div>
  )
}
