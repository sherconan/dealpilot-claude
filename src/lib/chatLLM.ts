// 多轮追问对话 — 用户基于已分析的 BP 继续追问 LLM
// 注入 BP context (PDF 全文片段 + LLM 报告) 让模型有完整上下文

import type { Deal } from '../types'
import type { Provider } from './multimodalAnalyze'
import { PROVIDER_META } from './multimodalAnalyze'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  ts: number
}

const CHAT_KEY_PREFIX = 'dp:chat:'

export function loadChatHistory(dealId: string): ChatMessage[] {
  try { return JSON.parse(localStorage.getItem(CHAT_KEY_PREFIX + dealId) || '[]') } catch { return [] }
}

export function saveChatHistory(dealId: string, messages: ChatMessage[]) {
  localStorage.setItem(CHAT_KEY_PREFIX + dealId, JSON.stringify(messages.slice(-30)))  // 保最近 30 条
}

export function clearChatHistory(dealId: string) {
  localStorage.removeItem(CHAT_KEY_PREFIX + dealId)
}

function buildSystemPrompt(deal: Deal): string {
  const lines = [
    `你是国内顶级 VC 投资分析师，正在与 GP 讨论项目「${deal.name}」（${deal.cnName}）。你已经详细阅读了 BP 全文并写完了完整 10 段深度分析报告。请基于真实信息回答 GP 的追问，要求：`,
    '1. 仅基于下方"项目档案"中的真实信息回答，不要编造',
    '2. 不知道时直接说"BP 未披露 X，建议尽调中追问 / 调真信源核验"',
    '3. 回答专业、有洞察、不空泛，可用 markdown 加粗 / 列表',
    '4. 中文回答，每次 200-400 字',
    '',
    '【项目档案】',
    `公司：${deal.name} / ${deal.cnName}`,
    `赛道：${deal.sector} · 阶段：${deal.round} · 估值：${deal.valuation} · 本轮：${deal.askAmount}`,
    `ARR：${deal.arr || '—'} · 增长：${deal.growthRate || '—'} · LTV/CAC：${deal.ltvCac || '—'}`,
    `综合评分：${deal.score} / 100 · 推荐：${deal.recommendation}`,
    `创始人：${deal.founders.map(f => `${f.name}(${f.role})`).join(' / ') || '—'}`,
    '',
  ]

  if (deal.llmDimensions && deal.llmDimensions.length > 0) {
    lines.push('【Sequoia 10 维度 LLM 评分】')
    for (const d of deal.llmDimensions) {
      lines.push(`- ${d.label}：${d.score}/10 — ${d.rationale}`)
    }
    lines.push('')
  }

  if (deal.redFlags.length > 0) {
    lines.push('【Red Flags】')
    deal.redFlags.forEach(f => lines.push(`- [${f.severity === 'hard' ? '硬' : '软'}] ${f.label}：${f.detail}`))
    lines.push('')
  }

  if (deal.deepAnalysisRaw) {
    const truncated = deal.deepAnalysisRaw.length > 4000 ? deal.deepAnalysisRaw.slice(0, 4000) + '…[截断]' : deal.deepAnalysisRaw
    lines.push('【已撰深度报告（10 段）】')
    lines.push(truncated)
    lines.push('')
  }

  return lines.join('\n')
}

export async function streamChat(
  provider: Provider,
  apiKey: string | null,
  deal: Deal,
  history: ChatMessage[],
  userMessage: string,
  onChunk: (delta: string, full: string) => void,
): Promise<string> {
  const meta = PROVIDER_META[provider]
  const needsKey = provider !== 'pollinations' && provider !== 'kimi-k26'
  if (needsKey && !apiKey) throw new Error(`${meta.label} 需要 key`)

  const systemPrompt = buildSystemPrompt(deal)
  // 历史保留最近 8 轮（避免 context 爆炸）
  const recent = history.slice(-16)
  const messages = [
    { role: 'system', content: systemPrompt },
    ...recent.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ]

  // Gemini 流式 API 需要单独路径，先用非流式（简化）
  if (provider === 'gemini-flash') {
    const url = `${meta.endpoint}?key=${encodeURIComponent(apiKey!)}`
    const geminiContents = messages.filter(m => m.role !== 'system').map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))
    geminiContents.unshift({ role: 'user', parts: [{ text: systemPrompt }] })
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: geminiContents,
        generationConfig: { temperature: 0.5, maxOutputTokens: 1500 },
      }),
    })
    const data = await res.json()
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    // 模拟流式（一次性 chunk）
    onChunk(reply, reply)
    return reply
  }

  // OpenAI 兼容流式
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`
  const body: any = { model: meta.model, messages, temperature: 0.5, stream: true }
  if (provider === 'pollinations') body.private = true
  else if (provider === 'kimi-k26') body.max_tokens = 3000
  else body.max_tokens = 1500

  const res = await fetch(meta.endpoint, { method: 'POST', headers, body: JSON.stringify(body) })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Chat 失败 (${res.status})：${err.slice(0, 200)}`)
  }
  if (!res.body) throw new Error('Chat 流式无 body')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let raw = ''
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''
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
      } catch { /* ignore */ }
    }
  }
  return raw
}
