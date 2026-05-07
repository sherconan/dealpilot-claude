// LLM 驱动的竞品深度对比 — 按需触发，流式呈现
import { useState } from 'react'
import type { Deal } from '../types'
import { generateCompetitorAnalysis } from '../lib/competitorLLM'
import { getProvider, getApiKey, PROVIDER_META } from '../lib/multimodalAnalyze'

const STORAGE_PREFIX = 'dp:comp-analysis:'

export default function CompetitorAnalysis({ deal }: { deal: Deal }) {
  const [analysis, setAnalysis] = useState<string>(() => localStorage.getItem(STORAGE_PREFIX + deal.id) || '')
  const [running, setRunning] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const provider = getProvider()
  const apiKey = getApiKey()
  const meta = PROVIDER_META[provider]

  async function run() {
    setRunning(true)
    setErrorMsg(null)
    setAnalysis('')
    try {
      const result = await generateCompetitorAnalysis(provider, apiKey, deal, (full) => setAnalysis(full))
      localStorage.setItem(STORAGE_PREFIX + deal.id, result || analysis)
    } catch (e: any) {
      setErrorMsg(e?.message || '竞品分析失败')
    } finally {
      setRunning(false)
    }
  }

  return (
    <section className="bg-gradient-to-br from-sky-50/50 via-white to-white border-2 border-sky-500/30 rounded-xl p-5 mb-5">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-sky-700 font-medium">LLM + 真信源 · 竞品深度对比</div>
          <h2 className="text-[15px] font-semibold tracking-tight mt-0.5">已上市可比公司估值锚定（akshare 实测财报）</h2>
          <p className="text-[12px] text-ink-500 mt-0.5">基于该项目赛道，匹配真实 A 股 / 港股可比，让 LLM 写深度对比</p>
        </div>
        <button
          onClick={run}
          disabled={running}
          className="px-3.5 py-2 text-[13px] rounded-lg bg-sky-700 text-white hover:bg-sky-800 disabled:bg-ink-300 transition"
        >
          {running ? '生成中…' : analysis ? '重新生成' : '生成竞品对比'}
        </button>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 rounded p-2 text-[12px] text-rose-800 mb-3">
          {errorMsg}
        </div>
      )}

      {!analysis && !running && (
        <div className="text-[12px] text-ink-500 bg-ink-50 border border-ink-200 rounded-lg p-4 text-center">
          点击上方"生成竞品对比" → LLM 用真实可比公司财报锚定该项目估值
        </div>
      )}

      {(analysis || running) && (
        <div className="text-[13px] text-ink-800 leading-[1.85] whitespace-pre-wrap">
          {analysis.split('\n').map((line, i) => (
            <p key={i} className={`${line.match(/^#{1,3}\s/) ? 'font-semibold mt-2 text-ink-900' : ''} ${line.match(/^[-·•*]/) ? 'pl-2' : ''}`}>
              {line.replace(/^#+\s*/, '').split(/(\*\*[^*]+\*\*)/g).map((part, pi) =>
                part.startsWith('**') && part.endsWith('**')
                  ? <b key={pi} className="text-ink-900">{part.slice(2, -2)}</b>
                  : part
              )}
            </p>
          ))}
          {running && (
            <span className="inline-block w-1.5 h-3.5 bg-sky-700 animate-pulse ml-0.5 align-middle" />
          )}
        </div>
      )}

      <div className="mt-3 text-[10px] text-ink-400">Provider: <code className="bg-ink-100 px-1 rounded">{meta.label}</code></div>
    </section>
  )
}
