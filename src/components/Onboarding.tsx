// 首次访问引导 — 5 步快速带过产品核心能力
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const FLAG_KEY = 'dp:onboarded-v2'

const STEPS = [
  {
    title: '欢迎使用 DealPilot',
    body: 'VC BP 智能筛选驾驶舱 — 上传 BP，AI 真分析，自动入箱机构记忆。',
    icon: '🚀',
  },
  {
    title: 'Step 1 · 上传 BP',
    body: 'pdfjs 真读 PDF 全文 → 选择 LLM provider（Kimi K2.6 / Gemini Flash / OpenAI 等）→ 60-90 秒流式生成 10 段深度分析。',
    icon: '📄',
    cta: { text: '去上传 BP', path: '/upload' },
  },
  {
    title: 'Step 2 · LLM 真打分',
    body: 'Sequoia 10 维度由 LLM 独立打分，每个维度有评分依据 + PDF 原文 evidence。100 分 Scorecard + 推荐分级（优先 / 观察 / 跟进 / Pass）。',
    icon: '🎯',
  },
  {
    title: 'Step 3 · 多轮追问 + 竞品对比',
    body: '项目详情页和 LLM 对话 — 已注入完整 BP context，可问"团队风险 / 估值合理性 / 12 月里程碑"等。竞品基于 9 家 akshare 真财报锚定。',
    icon: '💬',
  },
  {
    title: 'Step 4 · 真信源 + 完整导出',
    body: '5 真信源已 live（akshare / 企查查 / 巨潮）+ 6 LLM Provider + 一键导出 Markdown 完整报告 + 浏览器打印 PDF。',
    icon: '🔌',
    cta: { text: '看完整功能列表', path: '/sources' },
  },
]

export default function Onboarding() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const done = localStorage.getItem(FLAG_KEY)
    if (!done) {
      // 延迟 1.5s 弹，让用户先看到主页
      const t = setTimeout(() => setOpen(true), 1500)
      return () => clearTimeout(t)
    }
  }, [])

  function close() {
    localStorage.setItem(FLAG_KEY, '1')
    setOpen(false)
  }

  function next() {
    if (step >= STEPS.length - 1) close()
    else setStep(step + 1)
  }

  if (!open) return null
  const cur = STEPS[step]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-ink-900/40 backdrop-blur-sm" onClick={close}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white border border-ink-200 rounded-2xl shadow-pop max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-br from-brand-50 via-white to-violet-50 p-6 text-center">
          <div className="text-[40px] mb-2">{cur.icon}</div>
          <h2 className="text-[20px] font-semibold tracking-tight">{cur.title}</h2>
        </div>
        <div className="p-5 text-[13.5px] text-ink-700 leading-[1.85]">
          {cur.body}
        </div>
        <div className="px-5 pb-5">
          <div className="flex items-center justify-center gap-1.5 mb-4">
            {STEPS.map((_, i) => (
              <span key={i} className={`h-1 rounded-full transition-all ${i === step ? 'w-8 bg-brand-700' : i < step ? 'w-2 bg-brand-700' : 'w-2 bg-ink-200'}`} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={close} className="flex-1 px-3 py-2 text-[12px] rounded-lg border border-ink-200 hover:bg-ink-50 transition">跳过</button>
            {cur.cta && (
              <button
                onClick={() => { localStorage.setItem(FLAG_KEY, '1'); setOpen(false); navigate(cur.cta!.path) }}
                className="flex-1 px-3 py-2 text-[12px] rounded-lg border border-brand-700 text-brand-700 hover:bg-brand-50 transition font-medium"
              >
                {cur.cta.text}
              </button>
            )}
            <button onClick={next} className="flex-1 px-3 py-2 text-[12px] rounded-lg bg-brand-700 text-white hover:bg-brand-800 transition font-medium">
              {step >= STEPS.length - 1 ? '完成 →' : `下一步 (${step + 1}/${STEPS.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
