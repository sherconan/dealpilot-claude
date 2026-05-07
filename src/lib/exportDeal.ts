// 导出 deal 为完整 Markdown 报告
// 包含所有 LLM 生成内容 + 评分 + 访谈问题 + 时间线

import type { Deal } from '../types'

export function dealToMarkdown(deal: Deal): string {
  const lines: string[] = []
  const date = new Date().toISOString().slice(0, 10)

  lines.push(`# ${deal.name} · 投资分析报告`)
  lines.push(`> ${deal.cnName} · ${deal.tagline}`)
  lines.push('')
  lines.push(`**生成日期**：${date} · **冠军合伙人**：${deal.champion || '—'} · **来源**：${deal.source}`)
  lines.push('')

  // 摘要
  lines.push('## 一、项目摘要')
  lines.push('')
  lines.push(`| 字段 | 内容 |`)
  lines.push(`|---|---|`)
  lines.push(`| 公司 | ${deal.name} / ${deal.cnName} |`)
  lines.push(`| 赛道 | ${deal.sector} |`)
  lines.push(`| 阶段 | ${deal.round} |`)
  lines.push(`| 估值 | ${deal.valuation} |`)
  lines.push(`| 本轮融资 | ${deal.askAmount} |`)
  lines.push(`| ARR | ${deal.arr || '—'} |`)
  lines.push(`| 增长率 | ${deal.growthRate || '—'} |`)
  lines.push(`| LTV/CAC | ${deal.ltvCac ? deal.ltvCac + 'x' : '—'} |`)
  lines.push(`| 团队规模 | ${deal.teamSize} 人 |`)
  lines.push(`| 综合评分 | **${deal.score} / 100** |`)
  lines.push(`| 推荐 | ${deal.recommendation} |`)
  lines.push('')
  if (deal.llmOneLiner) {
    lines.push('### 一句话总结')
    lines.push('')
    lines.push(`> ${deal.llmOneLiner}`)
    lines.push('')
  }

  // 创始团队
  if (deal.founders.length > 0) {
    lines.push('## 二、创始团队')
    lines.push('')
    deal.founders.forEach((f, i) => {
      lines.push(`### ${i + 1}. ${f.name} · ${f.role}`)
      lines.push(f.background)
      if (f.highlight) lines.push(`**亮点**：${f.highlight}`)
      lines.push('')
    })
  }

  // LLM 评分
  if (deal.llmDimensions && deal.llmDimensions.length > 0) {
    lines.push('## 三、Sequoia 10 维度 LLM 评分')
    lines.push('')
    lines.push('| 维度 | 评分 | 评分依据 | PDF 原文 |')
    lines.push('|---|---:|---|---|')
    deal.llmDimensions.forEach(d => {
      lines.push(`| ${d.label} | ${d.score}/10 | ${d.rationale.replace(/\|/g, '\\|')} | ${(d.evidence || '—').replace(/\|/g, '\\|')} |`)
    })
    lines.push('')
  }

  // LLM 完整深度报告
  if (deal.deepAnalysisRaw) {
    lines.push('## 四、深度分析报告（LLM 真撰 · 10 段）')
    lines.push('')
    const sectionLabels = ['公司画像与定位', '问题与机会判断', '产品与解决方案', '商业模式', '市场规模与竞争', '团队评估', '牵引与财务', '风险与红线', '投资论点', '尽调建议与关键问题']
    const sections = deal.deepAnalysisRaw.split(/===\s*SECTION\s*\d+\s*===/i).slice(1)
    sections.forEach((sec, i) => {
      const trimmed = sec.trim()
      if (!trimmed) return
      lines.push(`### 4.${i + 1} ${sectionLabels[i] || `第 ${i + 1} 段`}`)
      lines.push('')
      lines.push(trimmed)
      lines.push('')
    })
  }

  // Red Flags
  if (deal.redFlags.length > 0) {
    lines.push('## 五、Red Flag 扫描')
    lines.push('')
    const hard = deal.redFlags.filter(f => f.severity === 'hard')
    const soft = deal.redFlags.filter(f => f.severity === 'soft')
    if (hard.length > 0) {
      lines.push(`### 硬红线（${hard.length} 项 · 命中即 Pass）`)
      lines.push('')
      hard.forEach(f => {
        lines.push(`- **${f.label}** — ${f.detail}`)
        if (f.source) lines.push(`  *来源：${f.source}*`)
      })
      lines.push('')
    }
    if (soft.length > 0) {
      lines.push(`### 软扣分（${soft.length} 项）`)
      lines.push('')
      soft.forEach(f => {
        lines.push(`- **${f.label}** — ${f.detail}`)
        if (f.source) lines.push(`  *来源：${f.source}*`)
      })
      lines.push('')
    }
  }

  // 创始人访谈问题
  if (deal.llmFounderQuestions && deal.llmFounderQuestions.length > 0) {
    lines.push('## 六、创始人访谈关键问题（LLM 针对 BP 真内容生成）')
    lines.push('')
    deal.llmFounderQuestions.forEach((q, i) => {
      lines.push(`### Q${i + 1}. [${q.category}] ${q.question}`)
      lines.push(`- **为什么问**：${q.why}`)
      lines.push(`- **期待信号**：${q.expect}`)
      if (q.watch) lines.push(`- **⚠️ 警惕**：${q.watch}`)
      lines.push('')
    })
  }

  // Wins / Concerns
  if (deal.wins.length > 0) {
    lines.push('## 七、核心亮点')
    lines.push('')
    deal.wins.forEach(w => lines.push(`- ${w}`))
    lines.push('')
  }
  if (deal.concerns.length > 0) {
    lines.push('## 八、关注问题')
    lines.push('')
    deal.concerns.forEach(c => lines.push(`- ${c}`))
    lines.push('')
  }

  // 时间线
  if (deal.timeline.length > 0) {
    lines.push('## 九、项目时间线')
    lines.push('')
    deal.timeline.forEach(e => {
      lines.push(`- **${e.date}** — ${e.event}${e.actor ? `（${e.actor}）` : ''}`)
    })
    lines.push('')
  }

  // 牵引指标
  if (deal.traction.length > 0) {
    lines.push('## 十、关键指标')
    lines.push('')
    deal.traction.forEach(t => {
      lines.push(`- **${t.label}**：${t.value}${t.delta ? `（${t.delta}）` : ''}`)
    })
    lines.push('')
  }

  // Footer
  lines.push('---')
  lines.push('')
  lines.push(`*由 DealPilot 生成 · ${date} · 仅用于产品演示，不构成投资建议*`)
  lines.push(`*[在线查看完整版](https://dealpilot-claude.vercel.app/?/deal/${deal.id})*`)

  return lines.join('\n')
}

export function downloadMarkdown(deal: Deal) {
  const md = dealToMarkdown(deal)
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${deal.name}-投资分析-${new Date().toISOString().slice(0, 10)}.md`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function copyMarkdownToClipboard(deal: Deal): Promise<boolean> {
  const md = dealToMarkdown(deal)
  try {
    await navigator.clipboard.writeText(md)
    return true
  } catch {
    return false
  }
}
