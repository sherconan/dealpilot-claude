import type { Stage, Recommendation } from '../types'

export const stageMeta: Record<Stage, { label: string; short: string; color: string; bg: string; border: string }> = {
  inbox:    { label: '初筛',   short: 'Inbox',     color: '#475569', bg: 'bg-ink-100',    border: 'border-ink-300' },
  review:   { label: '跟进',   short: 'Review',    color: '#0f766e', bg: 'bg-brand-50',   border: 'border-brand-500' },
  dd:       { label: '尽调',   short: 'DD',        color: '#0ea5e9', bg: 'bg-sky-50',     border: 'border-sky-500' },
  ic:       { label: '投委会', short: 'IC',        color: '#7c3aed', bg: 'bg-violet-50',  border: 'border-violet-500' },
  invested: { label: '已投',   short: 'Invested',  color: '#059669', bg: 'bg-emerald-50', border: 'border-emerald-500' },
  pass:     { label: '已 Pass', short: 'Pass',     color: '#94a3b8', bg: 'bg-ink-100',    border: 'border-ink-300' },
}

export const recommendationMeta: Record<Recommendation, { label: string; color: string; bg: string; rationale: string }> = {
  priority:    { label: '优先推进', color: '#0f766e', bg: 'bg-brand-50',   rationale: '80–100 分 · 满足机构核心论点，建议排入 IC' },
  monitor:     { label: '持续观察', color: '#2563eb', bg: 'bg-sky-50',     rationale: '65–79 分 · 具备潜力，缺关键验证点' },
  conditional: { label: '有条件跟进', color: '#d97706', bg: 'bg-amber-50', rationale: '50–64 分 · 存在 1–2 条软红线' },
  pass:        { label: '建议 Pass', color: '#dc2626', bg: 'bg-rose-50',   rationale: '< 50 分 · 存在硬红线或基础不成立' },
}

export const sequoiaLabels: { key: keyof import('../types').Sequoia10; label: string; desc: string }[] = [
  { key: 'mission',       label: '公司使命',    desc: '一句话定义公司的存在意义 — 清晰度、差异化' },
  { key: 'problem',       label: '问题',        desc: '客户痛点真实度 · 现有方案缺陷' },
  { key: 'solution',      label: '解决方案',    desc: '差异化 · 可防御性 · Eureka Moment' },
  { key: 'whyNow',        label: '时机',        desc: '技术 / 市场 / 政策窗口 — 为什么是现在' },
  { key: 'market',        label: '市场潜力',    desc: 'TAM / SAM / SOM — 市场天花板' },
  { key: 'competition',   label: '竞争格局',    desc: '直接 / 间接竞争 · 护城河宽度' },
  { key: 'businessModel', label: '商业模式',    desc: 'LTV/CAC · 毛利率 · 单位经济学' },
  { key: 'team',          label: '团队',        desc: '创始人背景 · 与赛道契合度 · 执行力' },
  { key: 'financials',    label: '财务数据',    desc: 'ARR · 增速 · 烧钱率' },
  { key: 'vision',        label: '愿景',        desc: '5 年后这家公司会成为什么' },
]

export const fundingFunnel = [
  { stage: '初筛',  count: 248, passRate: '2%',  color: '#94a3b8' },
  { stage: '跟进',  count: 48,  passRate: '20%', color: '#0f766e' },
  { stage: '尽调',  count: 14,  passRate: '50%', color: '#0ea5e9' },
  { stage: '投委会', count: 5,  passRate: '60%', color: '#7c3aed' },
  { stage: '已投',  count: 3,   passRate: '—',   color: '#059669' },
]

export const thesisChecks = [
  { title: 'AI Native / AI 原生能力', weight: 22, pass: true,  detail: '产品核心价值由 AI 模型直接产生，非传统软件附加 AI' },
  { title: '创始人-赛道契合', weight: 18, pass: true,  detail: '核心创始人在目标赛道 5 年+ 或 Top 10 公司背景' },
  { title: '市场规模 ≥ $5B', weight: 15, pass: true,  detail: 'SAM 有 Gartner / IDC / 艾瑞等第三方来源' },
  { title: '收入证据', weight: 14, pass: true,  detail: '有真实付费客户，非 LOI / Pilot' },
  { title: 'LTV/CAC ≥ 3', weight: 11, pass: false, detail: '当前 5.2x，满足成长期门槛' },
  { title: '退出路径 ≥ 2 种', weight: 10, pass: true,  detail: 'IPO / 大厂并购 两条路径均可想象' },
  { title: 'ESG 合规', weight: 6,  pass: true,  detail: '无高碳 / 高监管领域暴露' },
  { title: '地缘合规', weight: 4,  pass: true,  detail: '未涉及中美双向敏感技术管制清单' },
]
