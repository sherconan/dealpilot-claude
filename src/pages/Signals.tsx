import { useApp } from '../contexts/AppContext'
import { Link } from 'react-router-dom'

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

const signals: Signal[] = [
  { id: '1', ts: '12 分钟前', company: 'NebulaAI', dealId: 'nebula-ai', channel: 'github', level: 'high', title: 'agent-kernel repo 新增 multi-agent planner 模块', detail: 'CTO Chen Hao 提交 1,247 行核心代码，标签 v0.4.0 即将发布 — 疑似为 Series A close 前的产品里程碑信号', source: 'GitHub Webhook · sherconan/agent-kernel' },
  { id: '2', ts: '34 分钟前', company: 'Lumen AI（已投）', channel: 'recruit', level: 'high', title: 'LinkedIn 新增 2 名前 Anthropic 工程师', detail: '其中 1 位曾是 Claude RLHF 团队 Tech Lead — 招聘强度反映 Series B 提速', source: 'LinkedIn People Search · 监控订阅' },
  { id: '3', ts: '1 小时前', company: 'NeoBank Digital', dealId: 'neobank-digital', channel: 'media', level: 'medium', title: '印尼 OJK 牌照进入实质审查最后阶段', detail: 'Bisnis.com 报道 NeoBank 印尼牌照已通过初审，预计 Q3 正式获批 — 与 BP 时间线吻合', source: 'autoglm + Bocha Search' },
  { id: '4', ts: '2 小时前', company: 'CryptoVault', dealId: 'crypto-vault', channel: 'patent', level: 'critical', title: '创始人前公司被 SFC 公告确认未持牌经营', detail: '香港 SFC 公告 No. 2024/091 列名前公司，CryptoVault 创始人 Alex Zhou 在前公司任 CEO — 强化诚信红线', source: 'qcc-risk · SFC 公告抓取' },
  { id: '5', ts: '3 小时前', company: 'MetaMed Health', dealId: 'metamed-health', channel: 'patent', level: 'medium', title: 'NMPA 注册文件进入第二轮补正', detail: 'III 类医疗器械注册公示进度更新 — 时间线略晚于 BP 预测的 2026-Q4', source: 'NMPA 公开排期' },
  { id: '6', ts: '5 小时前', company: 'GreenLogistics', dealId: 'green-logistics', channel: 'media', level: 'high', title: 'Top 1 客户菜鸟招标新增 2 家供应商', detail: '菜鸟冷链 2026-04 供应商扩容公告，可能稀释 GreenLogistics Top 1 客户份额 — 集中度风险加剧', source: 'autoglm + 招标网' },
  { id: '7', ts: '昨天', company: '寒武纪（行业）', channel: 'media', level: 'low', title: '2026-Q1 国产 AI 芯片招投标份额突破 60%', detail: '行业信号：国产替代叙事进入兑现期，对所有 AI Infra 标的估值利好', source: 'autoglm Deep Research' },
  { id: '8', ts: '昨天', company: 'Pulse Finance（已投）', channel: 'product-hunt', level: 'medium', title: 'Product Hunt 当日 Top 3', detail: 'Pulse Finance v3.0 在 Product Hunt 当日热度排名第 3，新增 12k 注册用户 — Lead Q2 增长', source: 'producthunt.com webhook' },
]

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
  const stats = {
    total: signals.length,
    critical: signals.filter(s => s.level === 'critical').length,
    high: signals.filter(s => s.level === 'high').length,
    last24h: signals.length,
  }

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto">
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
              const count = signals.filter(s => s.level === lv).length
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
          {signals.map((s) => {
            const cm = channelMeta[s.channel]
            const lm = levelMeta[s.level]
            return (
              <article key={s.id} className="px-5 py-4 hover:bg-ink-50 transition">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[10px] font-semibold shrink-0" style={{ background: cm.color }}>{cm.label.slice(0, 2)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] tracking-wider uppercase text-ink-400 num">{s.ts}</span>
                      <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded`} style={{ color: lm.color, background: lm.color + '14' }}>{lm.label}</span>
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
