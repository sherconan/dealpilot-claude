// LLM 生成针对 PDF 真实内容的创始人访谈问题
// 不再是模板，每个问题都基于 BP 具体内容定制

import type { ExtractedFields, RedFlag } from './pdfPipeline'
import type { Provider } from './multimodalAnalyze'
import { PROVIDER_META } from './multimodalAnalyze'

export interface FounderQuestion {
  category: 'financial' | 'business' | 'team' | 'competition' | 'risk' | 'fund-use' | 'governance'
  question: string
  why: string
  expect: string
  watch?: string
}

const QUESTION_PROMPT = `你是国内顶级 VC 合伙人，正在准备与下面这家 BP 公司的创始人会面。请基于 BP 真实内容生成 8 个最锐利的访谈问题。

【输出格式】严格 JSON 数组，不加 markdown 代码块：
[
  {
    "category": "financial|business|team|competition|risk|fund-use|governance 之一",
    "question": "完整问题（直接可问）",
    "why": "为什么问这个（30-50 字）",
    "expect": "期待听到什么样的回答（30-50 字）",
    "watch": "警惕信号（可选，30 字内）"
  },
  ...共 8 个对象
]

【要求】
1. 必须基于 BP **具体内容**问，不是通用模板（例如 BP 提到 ARR $4.8M，问题就要问"如何在 12 个月内做到 $20M"）
2. 8 个问题分布：财务 2 + 业务 2 + 团队 1 + 竞争 1 + 风险 1 + 资金用途 1
3. 问题要让创始人无法用模板话术敷衍 — 必须有量化、具体细节
4. 警惕信号必填高风险题（红线相关、估值相关）
5. 不要 markdown，纯 JSON 数组`

export async function generateFounderQuestions(
  provider: Provider,
  apiKey: string | null,
  text: string,
  fields: ExtractedFields,
  redFlags: RedFlag[],
): Promise<FounderQuestion[]> {
  const meta = PROVIDER_META[provider]
  const needsKey = provider !== 'pollinations' && provider !== 'kimi-k26'
  if (needsKey && !apiKey) throw new Error(`${meta.label} 需要 API key`)

  const truncated = text.length > 5000 ? text.slice(0, 5000) + '…' : text
  const userInput = `【BP 真实文本】\n${truncated}\n\n【字段】公司=${fields.company || '未识别'} 赛道=${fields.sector || ''} 估值=${fields.valuation || ''} ARR=${fields.arr || ''} 创始人=${fields.founders.join('/')} 对标=${fields.comparables.slice(0, 3).join('/')}\n\n【红线】${redFlags.map(f => f.label).join(', ') || '无'}\n\n现在输出 8 个针对性访谈问题 JSON 数组：`

  // Gemini 路径
  if (provider === 'gemini-flash') {
    const url = `${meta.endpoint}?key=${encodeURIComponent(apiKey!)}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: QUESTION_PROMPT + '\n\n' + userInput }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 2000 },
      }),
    })
    const data = await res.json()
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    return parseQuestions(raw)
  }

  // OpenAI 兼容
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`
  const body: any = {
    model: meta.model,
    messages: [
      { role: 'system', content: QUESTION_PROMPT },
      { role: 'user', content: userInput },
    ],
    temperature: 0.5,
  }
  if (provider === 'pollinations') body.private = true
  else if (provider === 'kimi-k26') body.max_tokens = 4000
  else body.max_tokens = 2000

  const res = await fetch(meta.endpoint, { method: 'POST', headers, body: JSON.stringify(body) })
  if (!res.ok) throw new Error(`访谈问题生成失败 (${res.status})`)
  const data = await res.json()
  const msg = data?.choices?.[0]?.message
  const raw = msg?.content || msg?.reasoning_content || ''
  return parseQuestions(raw)
}

function parseQuestions(raw: string): FounderQuestion[] {
  let cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  const first = cleaned.indexOf('[')
  const last = cleaned.lastIndexOf(']')
  if (first >= 0 && last > first) cleaned = cleaned.slice(first, last + 1)
  try {
    const arr = JSON.parse(cleaned)
    if (!Array.isArray(arr)) return []
    return arr.slice(0, 10).map((q: any) => ({
      category: q.category || 'business',
      question: q.question || '',
      why: q.why || '',
      expect: q.expect || '',
      watch: q.watch,
    })).filter(q => q.question)
  } catch {
    return []
  }
}
