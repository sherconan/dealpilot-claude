// 真多模态 LLM 深度分析 — 支持 OpenAI GPT-4o + Moonshot Kimi vision
// BYOK 模式：用户提供 API key（仅存浏览器 localStorage，不上传任何后端）

import type { ExtractedFields, RedFlag } from './pdfPipeline'

export type Provider =
  | 'pollinations'        // 免费文本 LLM (默认)
  | 'openai-vision'       // OpenAI gpt-4o-mini vision (BYOK)
  | 'moonshot-vision'     // Moonshot Kimi vision (BYOK · 中文原生)
  | 'deepseek'            // DeepSeek (BYOK · 文本)

const KEY_STORAGE = 'dp:llm-key'
const PROVIDER_STORAGE = 'dp:llm-provider'

export const PROVIDER_META: Record<Provider, {
  label: string
  endpoint: string
  model: string
  multimodal: boolean
  free: boolean
  desc: string
}> = {
  'pollinations': {
    label: 'Pollinations (免费 / 文本)',
    endpoint: 'https://text.pollinations.ai/openai',
    model: 'openai',
    multimodal: false,
    free: true,
    desc: '免费 · GPT-OSS 20B · 不要 key · 仅文本',
  },
  'openai-vision': {
    label: 'OpenAI GPT-4o-mini (BYOK · 多模态)',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    multimodal: true,
    free: false,
    desc: '需要 OpenAI key · 真看 PDF 图像 + 文字',
  },
  'moonshot-vision': {
    label: 'Moonshot Kimi (BYOK · 多模态 · 中文原生)',
    endpoint: 'https://api.moonshot.cn/v1/chat/completions',
    model: 'moonshot-v1-32k-vision-preview',
    multimodal: true,
    free: false,
    desc: '需要 Moonshot key · 中文 BP 理解最佳 · 真看 PDF 图像',
  },
  'deepseek': {
    label: 'DeepSeek (BYOK · 文本)',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    multimodal: false,
    free: false,
    desc: '需要 DeepSeek key · 中文文本分析 · 价格极低',
  },
}

export function getApiKey(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(KEY_STORAGE)
}
export function setApiKey(key: string) { localStorage.setItem(KEY_STORAGE, key) }
export function clearApiKey() { localStorage.removeItem(KEY_STORAGE) }

export function getProvider(): Provider {
  if (typeof window === 'undefined') return 'pollinations'
  const saved = localStorage.getItem(PROVIDER_STORAGE) as Provider
  if (saved && PROVIDER_META[saved]) return saved
  return getApiKey() ? 'moonshot-vision' : 'pollinations'
}
export function setProvider(p: Provider) { localStorage.setItem(PROVIDER_STORAGE, p) }

export interface MultimodalAnalysis {
  sections: Record<string, string>
  raw: string
  duration: number
  provider: Provider
  pagesAnalyzed: number
}

const SYSTEM_PROMPT = `你是国内顶级 VC 投资分析师。我将给你一份 BP 的 PDF（每页渲染为图像）+ pdfjs 抽到的纯文本 + regex 抽到的字段。请基于真实视觉 + 文字生成 10 段深度分析报告。

【重要规则】
1. 你能直接看到 PDF 每一页的图像，包括图表、表格、配图、布局设计 — 请充分利用视觉信息（不要只看文字）。
2. 仅基于真实内容分析，不要编造。BP 没说的项目说"BP 未披露 X，建议尽调追问"。
3. 每段 250-400 字，专业、有洞察、不空泛。可用 **粗体** 重点字眼。
4. 严格按 ===SECTION 1=== 到 ===SECTION 10=== 切分，每段独占一行起始。
5. 章节固定如下：
   1. 公司画像与定位（包括 PDF 视觉风格透露的品牌定位）
   2. 问题与机会判断
   3. 产品与解决方案（如 PDF 有产品截图 / 架构图，请描述）
   4. 商业模式
   5. 市场规模与竞争（注意 PDF 中的市场图表 / 象限图）
   6. 团队评估（如 PDF 有团队照片 / 履历页，描述判断）
   7. 牵引与财务（注意 PDF 中的图表数据，与文字 cross-check）
   8. 风险与红线（你独立判断，不依赖给定的本地规则）
   9. 投资论点
   10. 尽调建议与关键问题（5 个最锐利的访谈问题）`

const SYSTEM_PROMPT_TEXT = SYSTEM_PROMPT + '\n\n（注：当前为纯文本模式，你看不到 PDF 视觉信息，仅基于文字内容分析）'

function buildMultimodalContent(images: string[], text: string, fields: ExtractedFields, redFlags: RedFlag[]): any[] {
  const truncated = text.length > 5000 ? text.slice(0, 5000) + '\n\n…[文本截断]' : text
  const fieldsSummary = formatFields(fields)
  const flagsSummary = redFlags.length > 0
    ? redFlags.map(f => `[${f.severity}] ${f.label}`).join('\n')
    : '本地规则未触发（你应独立判断）'

  const content: any[] = [
    { type: 'text', text: `【BP 共 ${images.length} 页（图像 + 文字）】请基于视觉 + 文字生成 10 段深度分析报告。` },
  ]
  images.forEach((img, i) => {
    content.push({
      type: 'image_url',
      image_url: { url: img, detail: i < 3 ? 'high' : 'low' },
    })
  })
  content.push({
    type: 'text',
    text: `\n【pdfjs 抽到的全文】\n${truncated}\n\n【regex 字段】\n${fieldsSummary || '（字段稀疏）'}\n\n【本地规则触发的红线】\n${flagsSummary}\n\n现在请输出 10 段深度报告（严格 ===SECTION N=== 分隔）：`,
  })
  return content
}

function buildTextContent(text: string, fields: ExtractedFields, redFlags: RedFlag[]): string {
  const truncated = text.length > 8000 ? text.slice(0, 8000) + '\n\n…[文本截断]' : text
  return `【BP 抽取真实文本】\n${truncated}\n\n【regex 字段】\n${formatFields(fields)}\n\n【本地规则红线】\n${redFlags.length > 0 ? redFlags.map(f => `[${f.severity}] ${f.label}`).join('\n') : '未触发'}\n\n请输出 10 段深度报告（严格 ===SECTION N=== 分隔）：`
}

function formatFields(f: ExtractedFields): string {
  return [
    f.company && `公司：${f.company}`,
    f.sector && `赛道：${f.sector}`,
    f.round && `轮次：${f.round}`,
    f.valuation && `估值：${f.valuation}`,
    f.arr && `ARR：${f.arr}`,
    f.tam && `TAM：${f.tam}`,
    f.growthRate && `增长：${f.growthRate}`,
    f.customers && `客户：${f.customers}`,
    f.patentClaim && `专利：${f.patentClaim}`,
    f.founders.length > 0 && `创始人：${f.founders.join(' / ')}`,
    f.comparables.length > 0 && `对标：${f.comparables.slice(0, 5).join(' / ')}`,
  ].filter(Boolean).join('\n')
}

export async function analyzeWithProvider(
  provider: Provider,
  apiKey: string | null,
  images: string[],
  text: string,
  fields: ExtractedFields,
  redFlags: RedFlag[],
  onProgress?: (msg: string) => void,
): Promise<MultimodalAnalysis> {
  const meta = PROVIDER_META[provider]
  const start = Date.now()

  if (!meta.free && !apiKey) {
    throw new Error(`${meta.label} 需要 API key — 请在顶部"分析模式"区域填入 key`)
  }

  onProgress?.(`调用 ${meta.label} 分析中...`)

  const useImages = meta.multimodal && images.length > 0
  let messages: any[]
  if (useImages) {
    messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildMultimodalContent(images, text, fields, redFlags) },
    ]
  } else {
    messages = [
      { role: 'system', content: SYSTEM_PROMPT_TEXT },
      { role: 'user', content: buildTextContent(text, fields, redFlags) },
    ]
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`

  const body: any = {
    model: meta.model,
    messages,
    temperature: 0.4,
  }
  if (provider === 'pollinations') {
    body.private = true
  } else {
    body.max_tokens = 4000
  }

  const res = await fetch(meta.endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`${meta.label} API 失败 (${res.status})：${err.slice(0, 300)}`)
  }

  const data = await res.json()
  const raw = data?.choices?.[0]?.message?.content || ''
  if (!raw) throw new Error(`${meta.label} 返回为空`)

  return {
    sections: parseSections(raw),
    raw,
    duration: Date.now() - start,
    provider,
    pagesAnalyzed: useImages ? images.length : 0,
  }
}

function parseSections(raw: string): Record<string, string> {
  const out: Record<string, string> = {}
  const SECTION_KEYS = ['COMPANY_OVERVIEW', 'PROBLEM_OPPORTUNITY', 'PRODUCT_SOLUTION', 'BUSINESS_MODEL', 'MARKET_ANALYSIS', 'TEAM_EVALUATION', 'TRACTION_FINANCIALS', 'RISKS_REDFLAGS', 'INVESTMENT_THESIS', 'NEXT_STEPS']
  const splitRegex = /===\s*SECTION\s*(\d+)\s*===/gi
  const parts = raw.split(splitRegex)
  for (let i = 1; i < parts.length; i += 2) {
    const num = parseInt(parts[i], 10)
    if (num >= 1 && num <= SECTION_KEYS.length) {
      out[SECTION_KEYS[num - 1]] = (parts[i + 1] || '').trim()
    }
  }
  return out
}

// 兼容旧调用
export async function analyzeMultimodal(
  images: string[],
  text: string,
  fields: ExtractedFields,
  redFlags: RedFlag[],
  apiKey: string,
  _model = 'gpt-4o-mini',
  onProgress?: (msg: string) => void,
): Promise<MultimodalAnalysis> {
  return analyzeWithProvider('openai-vision', apiKey, images, text, fields, redFlags, onProgress)
}
