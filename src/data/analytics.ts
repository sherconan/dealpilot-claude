// 历史分析数据（基金内部统计 + 行业基准）

export const monthlyInbound = [
  { month: '2025-11', received: 174, reviewed: 38, dd: 9, ic: 3, invested: 1 },
  { month: '2025-12', received: 198, reviewed: 42, dd: 11, ic: 4, invested: 2 },
  { month: '2026-01', received: 156, reviewed: 31, dd: 8, ic: 2, invested: 1 },
  { month: '2026-02', received: 212, reviewed: 47, dd: 14, ic: 5, invested: 2 },
  { month: '2026-03', received: 234, reviewed: 52, dd: 13, ic: 4, invested: 1 },
  { month: '2026-04', received: 248, reviewed: 48, dd: 14, ic: 5, invested: 1 },
]

export const sectorMix = [
  { sector: 'AI / Infra', count: 78, color: '#0f766e' },
  { sector: 'Fintech', count: 52, color: '#0ea5e9' },
  { sector: 'HealthTech', count: 34, color: '#8b5cf6' },
  { sector: 'Consumer', count: 28, color: '#d97706' },
  { sector: 'Logistics', count: 22, color: '#dc2626' },
  { sector: 'Robotics', count: 18, color: '#f59e0b' },
  { sector: 'Web3 / Other', count: 16, color: '#64748b' },
]

export const scoreDistribution = [
  { range: '< 40', count: 42, label: 'Pass', color: '#dc2626' },
  { range: '40–55', count: 78, label: 'Conditional', color: '#d97706' },
  { range: '55–70', count: 64, label: 'Monitor', color: '#0ea5e9' },
  { range: '70–85', count: 48, label: 'Review', color: '#0f766e' },
  { range: '> 85', count: 16, label: 'Priority', color: '#059669' },
]

export const conversionRates = [
  { from: '初筛', to: '跟进', rate: 19.4, baseline: 18.0 },
  { from: '跟进', to: '尽调', rate: 27.8, baseline: 24.5 },
  { from: '尽调', to: 'IC', rate: 35.7, baseline: 32.0 },
  { from: 'IC', to: '已投', rate: 60.0, baseline: 55.0 },
]

export const avgScoreTrend = [62, 65, 64, 67, 68, 66]
