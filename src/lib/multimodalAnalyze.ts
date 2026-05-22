// 真多模态 LLM 深度分析 — 支持 OpenAI GPT-4o + Moonshot Kimi vision
// BYOK 模式：用户提供 API key（仅存浏览器 localStorage，不上传任何后端）

import type { ExtractedFields, RedFlag } from './pdfPipeline'

export type Provider =
  | 'pollinations'        // 免费文本 LLM (默认 · 已实测调通)
  | 'kimi-k26'            // Kimi K2.6 (本产品已配 · 真多模态 · 256K context · 走 Vercel 代理)
  | 'gemini-flash'        // Google Gemini 1.5 Flash (BYOK · 真多模态 · 免费 tier)
  | 'moonshot-vision'     // Moonshot Kimi vision (BYOK · 中文原生)
  | 'openai-vision'       // OpenAI gpt-4o-mini vision (BYOK)
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
    desc: '免费 · GPT-OSS 20B · 不要 key · 仅文本（已实测调通）',
  },
  'kimi-k26': {
    label: 'Kimi K2.6 (产品已配 · 真多模态)',
    endpoint: '/api/kimi-proxy',
    model: 'kimi-for-coding',
    multimodal: true,
    free: true,
    desc: 'Kimi K2.6 · 256K context · 真看图 + 视频 · 走 Vercel 代理（仅 Vercel 镜像可用）',
  },
  'gemini-flash': {
    label: 'Gemini 1.5 Flash (免费多模态)',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    model: 'gemini-1.5-flash',
    multimodal: true,
    free: true,
    desc: 'Google 免费 tier · 真多模态 · 中英文都行 · key 去 aistudio.google.com 免费拿',
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
    label: 'DeepSeek V4 PRO (BYOK · 文本 · 推荐)',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-v4-pro',
    multimodal: false,
    free: false,
    desc: '需要 DeepSeek key · 中文文本分析 · sage-jury 同款 stack',
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
  // Default → DeepSeek V4 PRO (sage-jury stack) if key present
  return getApiKey() ? 'deepseek' : 'pollinations'
}
export function setProvider(p: Provider) { localStorage.setItem(PROVIDER_STORAGE, p) }

// Provider 健康度 ping — 发一个最小请求验证 endpoint + key 可达
// 返回 { ok, latencyMs, model, message }
export async function testProvider(provider: Provider, apiKey: string | null): Promise<{ ok: boolean; latencyMs: number; model?: string; message: string }> {
  const meta = PROVIDER_META[provider]
  const needsKey = !meta.free
  if (needsKey && !apiKey) return { ok: false, latencyMs: 0, message: '缺少 API key' }

  const start = performance.now()
  try {
    if (provider === 'gemini-flash') {
      const url = `${meta.endpoint}?key=${encodeURIComponent(apiKey!)}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'ping' }] }], generationConfig: { maxOutputTokens: 10 } }),
      })
      const ms = Math.round(performance.now() - start)
      if (!res.ok) return { ok: false, latencyMs: ms, message: `${res.status} ${(await res.text()).slice(0, 100)}` }
      return { ok: true, latencyMs: ms, model: meta.model, message: `已连通（${ms} ms）` }
    }

    // OpenAI 兼容
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`
    const body: any = { model: meta.model, messages: [{ role: 'user', content: 'ping' }], max_tokens: 10, stream: false }
    if (provider === 'pollinations') body.private = true
    const res = await fetch(meta.endpoint, { method: 'POST', headers, body: JSON.stringify(body) })
    const ms = Math.round(performance.now() - start)
    if (!res.ok) {
      const txt = await res.text()
      return { ok: false, latencyMs: ms, message: `${res.status} ${txt.slice(0, 100)}` }
    }
    return { ok: true, latencyMs: ms, model: meta.model, message: `已连通（${ms} ms）` }
  } catch (err: any) {
    const ms = Math.round(performance.now() - start)
    return { ok: false, latencyMs: ms, message: err?.message || String(err) }
  }
}

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

  // 哪些 provider 需要前端传 key（kimi-k26 走代理，key 在 Vercel env / 前端可选传）
  const needsKey = provider !== 'pollinations' && provider !== 'kimi-k26'
  if (needsKey && !apiKey) {
    throw new Error(`${meta.label} 需要 API key — 请在顶部"分析模式"区域填入 key`)
  }

  onProgress?.(`调用 ${meta.label} 分析中...`)
  const useImages = meta.multimodal && images.length > 0

  // —— Gemini Flash 用 Google 自己的 API 格式 ——
  if (provider === 'gemini-flash') {
    const parts: any[] = [
      { text: SYSTEM_PROMPT + '\n\n' + buildTextContent(text, fields, redFlags) },
    ]
    if (useImages) {
      images.forEach((img) => {
        // img is data URL like "data:image/jpeg;base64,..."
        const m = img.match(/^data:(.+);base64,(.+)$/)
        if (m) parts.push({ inline_data: { mime_type: m[1], data: m[2] } })
      })
    }
    const url = `${meta.endpoint}?key=${encodeURIComponent(apiKey!)}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 4000 },
      }),
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`${meta.label} API 失败 (${res.status})：${err.slice(0, 300)}`)
    }
    const data = await res.json()
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    if (!raw) throw new Error(`${meta.label} 返回为空：${JSON.stringify(data).slice(0, 200)}`)
    return { sections: parseSections(raw), raw, duration: Date.now() - start, provider, pagesAnalyzed: useImages ? images.length : 0 }
  }

  // —— OpenAI 兼容（Pollinations / Moonshot / OpenAI / DeepSeek）——
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
  const body: any = { model: meta.model, messages, temperature: 0.4 }
  if (provider === 'pollinations') { body.private = true; body.max_tokens = 8000 }
  else if (provider === 'kimi-k26') body.max_tokens = 8000  // K2.6 是 reasoning model，给充足 budget
  else body.max_tokens = 4000

  const res = await fetch(meta.endpoint, { method: 'POST', headers, body: JSON.stringify(body) })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`${meta.label} API 失败 (${res.status})：${err.slice(0, 300)}`)
  }
  const data = await res.json()
  const msg = data?.choices?.[0]?.message
  // Kimi K2.6 / DeepSeek-R1 等 reasoning model 可能把内容放在 reasoning_content
  const raw = msg?.content || msg?.reasoning_content || ''
  if (!raw) throw new Error(`${meta.label} 返回为空：${JSON.stringify(data).slice(0, 200)}`)
  return { sections: parseSections(raw), raw, duration: Date.now() - start, provider, pagesAnalyzed: useImages ? images.length : 0 }
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

// 流式版本 — 实时接收 LLM tokens，每个 chunk 触发 onChunk
// 仅当前 provider 是 OpenAI 兼容（包括 kimi-k26 走 Vercel 代理）才能流式
export async function streamWithProvider(
  provider: Provider,
  apiKey: string | null,
  images: string[],
  text: string,
  fields: ExtractedFields,
  redFlags: RedFlag[],
  onChunk: (delta: string, full: string) => void,
  onProgress?: (msg: string) => void,
): Promise<MultimodalAnalysis> {
  const meta = PROVIDER_META[provider]
  const start = Date.now()

  const needsKey = provider !== 'pollinations' && provider !== 'kimi-k26'
  if (needsKey && !apiKey) {
    throw new Error(`${meta.label} 需要 API key`)
  }

  // Gemini Flash 流式格式不一样 — 暂用非流式 fallback
  if (provider === 'gemini-flash') {
    onProgress?.('Gemini Flash 暂不支持流式，回退非流式...')
    const r = await analyzeWithProvider(provider, apiKey, images, text, fields, redFlags, onProgress)
    onChunk(r.raw, r.raw)
    return r
  }

  onProgress?.(`流式调用 ${meta.label}...`)
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

  const body: any = { model: meta.model, messages, temperature: 0.4, stream: true }
  if (provider === 'pollinations') { body.private = true; body.max_tokens = 8000 }
  else if (provider === 'kimi-k26') body.max_tokens = 8000
  else body.max_tokens = 4000

  const res = await fetch(meta.endpoint, { method: 'POST', headers, body: JSON.stringify(body) })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`${meta.label} 流式 API 失败 (${res.status})：${err.slice(0, 300)}`)
  }
  if (!res.body) throw new Error('流式响应无 body')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let raw = ''
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    // SSE 格式：data: {...}\n\n  + 最后 data: [DONE]
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''  // 留最后一个不完整行
    for (const line of lines) {
      if (!line.startsWith('data:')) continue
      const payload = line.slice(5).trim()
      if (!payload || payload === '[DONE]') continue
      try {
        const json = JSON.parse(payload)
        const delta = json?.choices?.[0]?.delta
        const piece = delta?.content || delta?.reasoning_content || ''
        if (piece) {
          raw += piece
          onChunk(piece, raw)
        }
      } catch { /* ignore parse error on partial chunks */ }
    }
  }

  return {
    sections: parseSections(raw),
    raw,
    duration: Date.now() - start,
    provider,
    pagesAnalyzed: useImages ? images.length : 0,
  }
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
