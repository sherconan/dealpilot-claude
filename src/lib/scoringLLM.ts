// LLM 驱动的 Sequoia 10 评分 — 替代规则引擎
// 让 LLM 基于 PDF 全文给每个维度独立打分 + 评分依据 + 改进建议

import type { ExtractedFields, RedFlag } from './pdfPipeline'
import type { Provider } from './multimodalAnalyze'
import { PROVIDER_META } from './multimodalAnalyze'

export interface DimensionScore {
  key: 'mission' | 'problem' | 'solution' | 'whyNow' | 'market' | 'competition' | 'businessModel' | 'team' | 'financials' | 'vision'
  label: string
  score: number  // 0-10
  rationale: string  // 评分依据 50-100 字
  evidence?: string  // 引用 PDF 原文片段
  recommendation?: string  // 改进建议
}

export interface LLMScoring {
  dimensions: DimensionScore[]
  totalScore: number  // 0-100
  recommendation: 'priority' | 'monitor' | 'conditional' | 'pass'
  oneLiner: string
  duration: number
}

const DIMENSION_LABELS: Record<DimensionScore['key'], string> = {
  mission: '公司使命 (Mission)',
  problem: '问题 (Problem)',
  solution: '解决方案 (Solution)',
  whyNow: '时机 (Why Now)',
  market: '市场潜力 (Market)',
  competition: '竞争格局 (Competition)',
  businessModel: '商业模式 (Business Model)',
  team: '团队 (Team)',
  financials: '财务 (Financials)',
  vision: '愿景 (Vision)',
}

const SCORING_PROMPT = `你是国内顶级 VC 投资分析师。请基于下方 BP 真实内容，按 Sequoia Capital 10 要素框架给每个维度独立打分（0-10 分）+ 评分依据（30-80 字）。

【评分标准】
- 9-10：行业最佳水平，有清晰证据
- 7-8：高于平均，有合理论证
- 5-6：达标但无亮点
- 3-4：明显不足，需要重大改进
- 0-2：严重缺失或致命缺陷

【输出格式】严格按 JSON 数组输出，不加任何解释、markdown、代码块标记：
[
  {"key":"mission","score":7,"rationale":"BP 第 2 页明确写...","evidence":"原文：xxx"},
  {"key":"problem","score":8,"rationale":"...","evidence":"..."},
  {"key":"solution","score":...},
  {"key":"whyNow","score":...},
  {"key":"market","score":...},
  {"key":"competition","score":...},
  {"key":"businessModel","score":...},
  {"key":"team","score":...},
  {"key":"financials","score":...},
  {"key":"vision","score":...}
]

【重要】
- 必须 10 个对象（key 顺序固定）
- score 是 0-10 整数
- rationale 中文，30-80 字
- evidence 引用 PDF 原文片段（30 字内），无明确出处时填空字符串
- 不要 markdown 代码块（不要 \`\`\`json）`

function buildScoringInput(text: string, fields: ExtractedFields, redFlags: RedFlag[]): string {
  const truncated = text.length > 6000 ? text.slice(0, 6000) + '\n\n…[文本截断]' : text
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

  return `【BP 真实文本（pdfjs 抽取）】\n${truncated}\n\n【已识别字段】\n${fieldsSummary || '（稀疏）'}\n\n【已触发红线】\n${redFlags.length > 0 ? redFlags.map(f => `[${f.severity}] ${f.label}`).join('\n') : '无'}\n\n现在请输出 10 个维度的评分 JSON 数组：`
}

export async function scoreWithLLM(
  provider: Provider,
  apiKey: string | null,
  text: string,
  fields: ExtractedFields,
  redFlags: RedFlag[],
): Promise<LLMScoring> {
  const meta = PROVIDER_META[provider]
  const start = Date.now()
  const needsKey = provider !== 'pollinations' && provider !== 'kimi-k26'
  if (needsKey && !apiKey) throw new Error(`${meta.label} 需要 API key`)

  const userInput = buildScoringInput(text, fields, redFlags)

  // Gemini 走特殊路径
  if (provider === 'gemini-flash') {
    const url = `${meta.endpoint}?key=${encodeURIComponent(apiKey!)}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: SCORING_PROMPT + '\n\n' + userInput }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 2500 },
      }),
    })
    const data = await res.json()
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    return parseScoring(raw, start)
  }

  // OpenAI 兼容
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`
  const body: any = {
    model: meta.model,
    messages: [
      { role: 'system', content: SCORING_PROMPT },
      { role: 'user', content: userInput },
    ],
    temperature: 0.3,
  }
  if (provider === 'pollinations') body.private = true
  else if (provider === 'kimi-k26') body.max_tokens = 4000
  else body.max_tokens = 2500

  const res = await fetch(meta.endpoint, { method: 'POST', headers, body: JSON.stringify(body) })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`LLM 评分失败 (${res.status})：${err.slice(0, 200)}`)
  }
  const data = await res.json()
  const msg = data?.choices?.[0]?.message
  const raw = msg?.content || msg?.reasoning_content || ''
  return parseScoring(raw, start)
}

function parseScoring(raw: string, startTime: number): LLMScoring {
  // LLM 可能返回带 markdown 的 JSON，清洗
  let cleaned = raw.trim()
  // 去除 ```json ... ``` 包裹
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  // 抽出第一个 [ 到最后一个 ]
  const firstBracket = cleaned.indexOf('[')
  const lastBracket = cleaned.lastIndexOf(']')
  if (firstBracket >= 0 && lastBracket > firstBracket) {
    cleaned = cleaned.slice(firstBracket, lastBracket + 1)
  }

  let arr: any[]
  try {
    arr = JSON.parse(cleaned)
  } catch (e) {
    throw new Error(`LLM 评分 JSON 解析失败 — raw: ${raw.slice(0, 300)}`)
  }
  if (!Array.isArray(arr)) throw new Error('LLM 评分返回非数组')

  const dimensions: DimensionScore[] = arr.slice(0, 10).map((d: any) => ({
    key: d.key,
    label: DIMENSION_LABELS[d.key as DimensionScore['key']] || d.key,
    score: Math.max(0, Math.min(10, parseInt(d.score, 10) || 5)),
    rationale: d.rationale || '',
    evidence: d.evidence || undefined,
    recommendation: d.recommendation || undefined,
  }))

  // 加权计算总分（参考 docs/methodology.md 的权重）
  const weights: Record<DimensionScore['key'], number> = {
    mission: 6, problem: 8, solution: 12, whyNow: 8, market: 14,
    competition: 10, businessModel: 14, team: 16, financials: 8, vision: 4,
  }
  let weighted = 0, totalWeight = 0
  for (const d of dimensions) {
    const w = weights[d.key] || 10
    weighted += (d.score / 10) * w
    totalWeight += w
  }
  const totalScore = Math.round((weighted / totalWeight) * 100)

  const recommendation: LLMScoring['recommendation'] =
    totalScore >= 80 ? 'priority' : totalScore >= 65 ? 'monitor' : totalScore >= 50 ? 'conditional' : 'pass'

  const recLabel = { priority: '优先推进', monitor: '持续观察', conditional: '有条件跟进', pass: '建议 Pass' }[recommendation]
  const oneLiner = `综合评分 ${totalScore}/100，推荐${recLabel}。强项：${dimensions.filter(d => d.score >= 8).map(d => d.label.split(' ')[0]).join('/') || '无明显强项'}；弱项：${dimensions.filter(d => d.score <= 4).map(d => d.label.split(' ')[0]).join('/') || '无明显短板'}`

  return { dimensions, totalScore, recommendation, oneLiner, duration: Date.now() - startTime }
}
