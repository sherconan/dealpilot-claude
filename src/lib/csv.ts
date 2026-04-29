import type { Deal } from '../types'
import { recommendationMeta, stageMeta } from './scoring'

const headers = [
  '项目英文名', '项目中文名', '一句话简介', '赛道', '阶段', '估值', '本轮融资', 'ARR',
  '增长率', 'LTV/CAC', 'CAC 回收期', '毛利率', 'TAM', 'SAM',
  '团队规模', '成立年份', '所在地',
  'Scorecard', '推荐', '当前阶段', '冠军合伙人', '来源',
  '硬 Red Flag 数', '软 Red Flag 数',
  'Sequoia.使命', 'Sequoia.问题', 'Sequoia.解决方案', 'Sequoia.时机', 'Sequoia.市场',
  'Sequoia.竞争', 'Sequoia.商业模式', 'Sequoia.团队', 'Sequoia.财务', 'Sequoia.愿景',
  '最后更新',
]

function escape(v: string | number | undefined): string {
  const s = (v ?? '').toString().replace(/"/g, '""')
  return /[",\n]/.test(s) ? `"${s}"` : s
}

export function dealsToCSV(deals: Deal[]): string {
  const rows = deals.map((d) => [
    d.name, d.cnName, d.tagline, d.sector, d.round, d.valuation, d.askAmount, d.arr || '',
    d.growthRate || '', d.ltvCac ? `${d.ltvCac}x` : '', d.cacPayback || '', d.grossMargin || '', d.tam, d.sam,
    d.teamSize, d.foundedYear, d.location,
    d.score, recommendationMeta[d.recommendation].label, stageMeta[d.stage].label, d.champion || '', d.source,
    d.redFlags.filter((f) => f.severity === 'hard').length,
    d.redFlags.filter((f) => f.severity === 'soft').length,
    d.sequoia.mission, d.sequoia.problem, d.sequoia.solution, d.sequoia.whyNow, d.sequoia.market,
    d.sequoia.competition, d.sequoia.businessModel, d.sequoia.team, d.sequoia.financials, d.sequoia.vision,
    d.lastUpdated,
  ])
  return [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n')
}

export function downloadCSV(filename: string, csv: string) {
  // BOM 让 Excel 识别 UTF-8
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
