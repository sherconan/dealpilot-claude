// 真 LLM 深度分析 — 走 Pollinations 免费通道（OpenAI 兼容）
// 一次调用生成 10 段完整报告，前端按 ===SECTION N=== 切分，逐段 typewriter

import type { ExtractedFields, RedFlag } from './pdfPipeline'

const POLLINATIONS_ENDPOINT = 'https://text.pollinations.ai/openai'

export interface DeepAnalysis {
  sections: Record<string, string>
  raw: string
  duration: number
}

const SECTION_KEYS = [
  'COMPANY_OVERVIEW',     // 公司画像与定位
  'PROBLEM_OPPORTUNITY',  // 问题与机会判断
  'PRODUCT_SOLUTION',     // 产品与解决方案
  'BUSINESS_MODEL',       // 商业模式
  'MARKET_ANALYSIS',      // 市场规模与竞争
  'TEAM_EVALUATION',      // 团队评估
  'TRACTION_FINANCIALS',  // 牵引与财务
  'RISKS_REDFLAGS',       // 风险与红线
  'INVESTMENT_THESIS',    // 投资论点
  'NEXT_STEPS',           // 尽调建议与关键问题
] as const

export type SectionKey = typeof SECTION_KEYS[number]

const SECTION_LABEL: Record<SectionKey, string> = {
  COMPANY_OVERVIEW: '① 公司画像与定位',
  PROBLEM_OPPORTUNITY: '② 问题与机会判断',
  PRODUCT_SOLUTION: '③ 产品与解决方案',
  BUSINESS_MODEL: '④ 商业模式',
  MARKET_ANALYSIS: '⑤ 市场规模与竞争',
  TEAM_EVALUATION: '⑥ 团队评估',
  TRACTION_FINANCIALS: '⑦ 牵引与财务',
  RISKS_REDFLAGS: '⑧ 风险与红线',
  INVESTMENT_THESIS: '⑨ 投资论点',
  NEXT_STEPS: '⑩ 尽调建议与关键问题',
}

export function getSectionLabel(k: SectionKey): string { return SECTION_LABEL[k] }

function buildPrompt(text: string, fields: ExtractedFields, redFlags: RedFlag[]): string {
  const truncated = text.length > 8000 ? text.slice(0, 8000) + '\n\n…[文本已截断，原文共 ' + text.length.toLocaleString() + ' 字符]' : text

  const fieldsSummary = [
    fields.company && `公司：${fields.company}`,
    fields.sector && `赛道：${fields.sector}`,
    fields.round && `轮次：${fields.round}`,
    fields.valuation && `估值：${fields.valuation}`,
    fields.arr && `ARR：${fields.arr}`,
    fields.tam && `TAM：${fields.tam}`,
    fields.growthRate && `增长：${fields.growthRate}`,
    fields.customers && `客户：${fields.customers}`,
    fields.patentClaim && `专利：${fields.patentClaim}`,
    fields.founders.length > 0 && `创始人：${fields.founders.join(' / ')}`,
    fields.comparables.length > 0 && `对标：${fields.comparables.slice(0, 5).join(' / ')}`,
  ].filter(Boolean).join('\n')

  const flagsSummary = redFlags.length > 0
    ? redFlags.map(f => `[${f.severity === 'hard' ? '硬' : '软'}] ${f.label}：${f.detail}`).join('\n')
    : '本地规则引擎未触发显式 Red Flag（但 LLM 应在第 8 节深度独立判断）'

  return `你是国内顶级 VC 投资分析师，正在为投委会撰写一份 BP 深度分析报告。请基于下面真实抽取的 BP 内容，生成完整的 10 段分析。

【重要规则】
1. **只基于下方 BP 真实内容分析，不要编造数据**。如果某项没在 BP 提到，直接说"BP 未披露 X，建议尽调中追问"。
2. 每段 250-400 字，专业、有洞察、不空泛、不写废话。
3. 用 markdown，可加 **粗体** 重点字眼，必要处用列表。
4. 必须用以下分隔符严格切分（每段开头独占一行）：
   ===SECTION 1=== ... ===SECTION 2=== ... 直到 ===SECTION 10===
5. 章节顺序固定如下：
   1. 公司画像与定位
   2. 问题与机会判断（这家公司想解决什么核心问题，市场窗口为何是现在）
   3. 产品与解决方案（产品本质是什么，差异化在哪）
   4. 商业模式（怎么赚钱，单位经济学）
   5. 市场规模与竞争（TAM/SAM 真实性 + 竞争格局判断）
   6. 团队评估（创始人背景、团队完整度、与赛道契合度）
   7. 牵引与财务（ARR/增长/客户/留存 真实可信度）
   8. 风险与红线（独立判断 BP 没说的硬/软风险）
   9. 投资论点（为什么投/为什么不投，3 个核心赌注）
   10. 尽调建议与关键问题（5 个最锐利的管理层访谈问题）

【BP 抽取真实文本】
${truncated}

【本地 regex 已抽到的字段】
${fieldsSummary || '（字段稀疏，建议你从原文挖掘更多）'}

【本地规则引擎触发的红线】
${flagsSummary}

现在开始输出 10 段分析（严格按 ===SECTION N=== 分隔）：`
}

export function parseSections(raw: string): Record<string, string> {
  const out: Record<string, string> = {}
  const splitRegex = /===\s*SECTION\s*(\d+)\s*===/gi
  const parts = raw.split(splitRegex)
  // parts: [前置文本, '1', section1 文本, '2', section2 文本, ...]
  for (let i = 1; i < parts.length; i += 2) {
    const num = parseInt(parts[i], 10)
    if (num >= 1 && num <= SECTION_KEYS.length) {
      const key = SECTION_KEYS[num - 1]
      out[key] = (parts[i + 1] || '').trim()
    }
  }
  return out
}

export async function deepAnalyzeBP(
  text: string,
  fields: ExtractedFields,
  redFlags: RedFlag[],
  onProgress?: (msg: string) => void,
): Promise<DeepAnalysis> {
  const start = Date.now()
  onProgress?.('正在调用 LLM（Pollinations · 免费通道）...')

  const prompt = buildPrompt(text, fields, redFlags)

  const res = await fetch(POLLINATIONS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'openai',
      messages: [
        { role: 'system', content: '你是国内顶级 VC 投资分析师，专精早期项目深度评估。输出严格按指令格式。' },
        { role: 'user', content: prompt },
      ],
      private: true,
      temperature: 0.4,
    }),
  })

  if (!res.ok) {
    throw new Error(`Pollinations API 失败：HTTP ${res.status}`)
  }

  const data = await res.json()
  const raw = data?.choices?.[0]?.message?.content || ''
  if (!raw) throw new Error('LLM 返回为空')

  const sections = parseSections(raw)
  return { sections, raw, duration: Date.now() - start }
}

export const SECTION_ORDER = SECTION_KEYS
