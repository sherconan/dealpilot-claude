// 项目详情页的多轮追问对话面板
// 用户问 → 系统注入 deal context → LLM 流式回答 → 历史存 localStorage

import { useEffect, useRef, useState } from 'react'
import type { Deal } from '../types'
import { streamChat, loadChatHistory, saveChatHistory, clearChatHistory, type ChatMessage } from '../lib/chatLLM'
import { getProvider, getApiKey, PROVIDER_META } from '../lib/multimodalAnalyze'

// 通用建议问题（mock 演示项目用）
const GENERIC_QUESTIONS = [
  '团队最大风险是什么？',
  '估值合理吗？给出 3 个理由',
  '如果你是 GP，会问哪 3 个问题？',
  '12 个月内最关键的里程碑是什么？',
  '为什么不投这个项目？给我反面意见',
  '对标公司里最值得抄的是什么？',
]

// 用户上传项目的针对性建议（基于 deal 字段动态生成）
function buildSuggestedQuestions(deal: Deal): string[] {
  const out: string[] = []
  // 硬红线触发 → 引导问 risk
  if (deal.redFlags.some(f => f.severity === 'hard')) {
    out.push('硬红线触发了哪几条？尽调中怎么验证？')
  }
  // 高分 → 引导问 IC pre-read
  if (deal.score >= 80) {
    out.push('IC 表决前合伙人最该聚焦的 3 个问题')
  }
  // 没披露 ARR → 引导问 traction
  if (!deal.arr || deal.arr === '—') {
    out.push('BP 未披露具体 ARR — 怎么从其他字段反推商业进度？')
  }
  // 估值高 → 引导问 valuation
  if (deal.valuation && /\$\s*\d{2,}M|\$\s*\d+B/.test(deal.valuation)) {
    out.push(`估值 ${deal.valuation} 在同阶段同赛道是什么水平？`)
  }
  // 团队人数少 → 引导问 team
  if (deal.teamSize > 0 && deal.teamSize <= 3) {
    out.push(`团队仅 ${deal.teamSize} 人，能撑起 ${deal.round} 轮的执行节奏吗？`)
  }
  // 始终带的 4 个
  out.push('如果你是 GP，会问创始人哪 3 个问题？')
  out.push('对标公司里最值得抄的策略是什么？')
  out.push('给我反面意见 — 为什么不应该投这个项目？')
  out.push('12 个月内最关键的 3 个里程碑是什么？')
  return out.slice(0, 6)
}

export default function DealChat({ deal }: { deal: Deal }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [streamBuf, setStreamBuf] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const provider = getProvider()
  const apiKey = getApiKey()
  const meta = PROVIDER_META[provider]

  useEffect(() => {
    setMessages(loadChatHistory(deal.id))
  }, [deal.id])

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, streamBuf])

  async function send(question: string) {
    if (!question.trim() || streaming) return
    setErrorMsg(null)
    const userMsg: ChatMessage = { role: 'user', content: question.trim(), ts: Date.now() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setStreaming(true)
    setStreamBuf('')

    try {
      let acc = ''
      const reply = await streamChat(
        provider,
        apiKey,
        deal,
        messages,
        question,
        (_delta, full) => {
          acc = full
          setStreamBuf(full)
        },
      )
      const finalReply = reply || acc
      const updated = [...newMessages, { role: 'assistant' as const, content: finalReply, ts: Date.now() }]
      setMessages(updated)
      saveChatHistory(deal.id, updated)
      setStreamBuf('')
    } catch (e: any) {
      setErrorMsg(e?.message || 'Chat 失败')
      // 把已有的 streamBuf 也存到历史（避免丢）
      if (streamBuf) {
        const updated = [...newMessages, { role: 'assistant' as const, content: streamBuf + '\n\n[流被中断]', ts: Date.now() }]
        setMessages(updated)
        saveChatHistory(deal.id, updated)
      }
    } finally {
      setStreaming(false)
    }
  }

  function reset() {
    if (!confirm('清空本项目的对话历史？')) return
    clearChatHistory(deal.id)
    setMessages([])
    setStreamBuf('')
  }

  return (
    <section className="bg-white border-2 border-brand-500/30 rounded-xl p-5 mb-5">
      <header className="mb-3 flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-brand-700 font-medium">追问 LLM · 已注入 BP 全文 + 评分 + 报告 context</div>
          <h2 className="text-[15px] font-semibold tracking-tight mt-0.5">和 {meta.label.split(' (')[0]} 聊聊这个项目</h2>
          <p className="text-[12px] text-ink-500 mt-0.5">每条回答都基于该项目的真实数据 · 历史保存在浏览器</p>
        </div>
        {messages.length > 0 && (
          <button onClick={reset} className="text-[11px] text-rose-700 hover:underline">清空对话</button>
        )}
      </header>

      {/* 推荐问题（首次访问时显示）— user-* deal 显示动态生成的针对性问题 */}
      {messages.length === 0 && !streaming && (
        <div className="mb-3">
          <div className="text-[10px] uppercase tracking-wider text-ink-500 mb-2">
            {deal.id.startsWith('user-') ? '✨ 基于本 BP 内容的针对性建议' : '建议追问 · 点击直接发送'}
          </div>
          <div className="flex flex-wrap gap-2">
            {(deal.id.startsWith('user-') ? buildSuggestedQuestions(deal) : GENERIC_QUESTIONS).map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-[11.5px] px-2.5 py-1 rounded-full bg-brand-50 text-brand-800 border border-brand-500/30 hover:bg-brand-100 transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 消息流 */}
      {(messages.length > 0 || streaming) && (
        <div ref={containerRef} className="bg-ink-50 border border-ink-200 rounded-lg p-3 max-h-[480px] overflow-y-auto scrollbar-thin space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg px-3 py-2 text-[12.5px] leading-[1.7] ${
                m.role === 'user' ? 'bg-brand-700 text-white' : 'bg-white border border-ink-200 text-ink-900'
              }`}>
                {m.role === 'assistant' ? renderMarkdown(m.content) : m.content}
              </div>
            </div>
          ))}
          {streaming && streamBuf && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-lg px-3 py-2 text-[12.5px] leading-[1.7] bg-white border-2 border-brand-500 text-ink-900">
                {renderMarkdown(streamBuf)}
                <span className="inline-block w-1.5 h-3.5 bg-brand-700 animate-pulse ml-0.5 align-middle" />
              </div>
            </div>
          )}
          {streaming && !streamBuf && (
            <div className="flex justify-start">
              <div className="rounded-lg px-3 py-2 text-[12px] bg-white border border-ink-200 text-ink-500">
                LLM 思考中...
              </div>
            </div>
          )}
        </div>
      )}

      {errorMsg && <div className="mt-2 text-[12px] text-rose-700 bg-rose-50 border border-rose-200 rounded p-2">{errorMsg}</div>}

      {/* 输入框 */}
      <div className="mt-3 flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(input) }
          }}
          rows={2}
          placeholder={`继续追问 ${deal.name} 的任何问题...（Ctrl/⌘+Enter 发送）`}
          disabled={streaming}
          className="flex-1 text-[13px] bg-ink-50 border border-ink-200 rounded-lg px-3 py-2 leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-50"
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || streaming}
          className="px-4 py-2 text-[13px] rounded-lg bg-brand-700 text-white hover:bg-brand-800 disabled:bg-ink-300 disabled:cursor-not-allowed transition self-stretch"
        >
          {streaming ? '生成中…' : '发送'}
        </button>
      </div>
      <div className="mt-1 text-[10px] text-ink-400">
        Provider: <code className="bg-ink-100 px-1 rounded">{meta.label}</code> · {messages.length} 条历史
      </div>
    </section>
  )
}

function renderMarkdown(text: string): React.ReactNode {
  return text.split('\n').map((line, li) => (
    <p key={li} className={line.match(/^[-·•*]/) ? 'pl-2' : ''}>
      {line.split(/(\*\*[^*]+\*\*)|(`[^`]+`)/g).filter(Boolean).map((part, pi) => {
        if (!part) return null
        if (part.startsWith('**') && part.endsWith('**')) return <b key={pi}>{part.slice(2, -2)}</b>
        if (part.startsWith('`') && part.endsWith('`')) return <code key={pi} className="text-[11px] bg-ink-100 px-1 rounded">{part.slice(1, -1)}</code>
        return part
      })}
    </p>
  ))
}
