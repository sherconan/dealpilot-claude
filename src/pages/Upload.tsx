import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { deals } from '../data/deals'
import {
  extractPdfText,
  extractFields,
  detectRedFlags,
  computeScore,
  routeVerification,
  type ExtractedFields,
  type RedFlag,
  type VerificationRoute,
} from '../lib/pdfPipeline'
import { ANALYSIS_STEPS, type AnalysisContext, type StepStatus } from '../lib/analysisSteps'
import { addUserDeal, buildDealFromExtraction } from '../lib/userDealStore'

interface StepRun {
  id: string
  status: StepStatus
  shownInsight: string  // typewriter 已显示的部分
  fullInsight: string   // 完整内容
  card?: { title: string; rows: { k: string; v: string }[] }
  startedAt?: number
}

export default function Upload() {
  const { t } = useApp()
  const navigate = useNavigate()
  const [fileName, setFileName] = useState('')
  const [pdfText, setPdfText] = useState('')
  const [pdfPages, setPdfPages] = useState(0)
  const [fields, setFields] = useState<ExtractedFields | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [redFlags, setRedFlags] = useState<RedFlag[]>([])
  const [routes, setRoutes] = useState<VerificationRoute[]>([])
  const [running, setRunning] = useState(false)
  const [runs, setRuns] = useState<StepRun[]>([])
  const [completedAll, setCompletedAll] = useState(false)
  const [createdDealId, setCreatedDealId] = useState<string | null>(null)
  const [matchedDealId, setMatchedDealId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [pasted, setPasted] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  // typewriter 动效
  function typewriter(stepId: string, text: string, speed = 18) {
    return new Promise<void>((resolve) => {
      let i = 0
      const tick = () => {
        i = Math.min(text.length, i + Math.ceil(text.length / 80))
        setRuns((rs) => rs.map(r => r.id === stepId ? { ...r, shownInsight: text.slice(0, i) } : r))
        if (i < text.length) setTimeout(tick, speed)
        else resolve()
      }
      tick()
    })
  }

  async function runFullAnalysis(text: string, pages: number, name: string) {
    setRunning(true)
    setCompletedAll(false)
    setErrorMsg(null)

    // 第一阶段：抽取字段（在所有 step 之前完成，作为 context）
    const f = extractFields(text, name.replace(/\.(pdf|pptx?|docx?|txt)$/i, ''))
    const flags = detectRedFlags(text, f)
    const sc = computeScore(f, flags)
    const rt = routeVerification(f)
    setFields(f); setRedFlags(flags); setScore(sc); setRoutes(rt)

    const ctx: AnalysisContext = { fileName: name, text, pdfPages: pages, fields: f, redFlags: flags, routes: rt, score: sc }

    // 初始化所有 step 为 pending
    setRuns(ANALYSIS_STEPS.map((s) => ({
      id: s.id,
      status: 'pending',
      shownInsight: '',
      fullInsight: s.insight(ctx),
      card: s.card?.(ctx),
    })))

    // 逐步执行
    for (const step of ANALYSIS_STEPS) {
      // 标记 running
      setRuns((rs) => rs.map(r => r.id === step.id ? { ...r, status: 'running', startedAt: Date.now() } : r))

      // 滚动到当前阶段
      setTimeout(() => {
        const el = document.getElementById(`step-${step.id}`)
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)

      // typewriter 流式打字
      const insight = step.insight(ctx)
      const typewriterDuration = Math.min(step.durationMs * 0.7, insight.length * 30)
      const speed = Math.max(8, typewriterDuration / insight.length)
      await typewriter(step.id, insight, speed)

      // 模拟剩余处理时间
      const remaining = step.durationMs - typewriterDuration
      if (remaining > 0) await sleep(remaining)

      // 标记 done
      setRuns((rs) => rs.map(r => r.id === step.id ? { ...r, status: 'done' } : r))
    }

    // 全部完成 → 创建项目
    const lower = (name + ' ' + text.slice(0, 2000)).toLowerCase()
    const m = deals.find((d) =>
      lower.includes(d.name.toLowerCase()) || lower.includes(d.cnName) ||
      (f.company && (d.name.toLowerCase().includes(f.company.toLowerCase()) || d.cnName.includes(f.company))),
    )
    setMatchedDealId(m?.id || null)
    if (!m) {
      const newDeal = buildDealFromExtraction(f, flags, sc, name, text)
      addUserDeal(newDeal)
      setCreatedDealId(newDeal.id)
    }

    setCompletedAll(true)
    setRunning(false)
  }

  async function handleFile(file: File) {
    try {
      setFileName(file.name)
      setRuns([])
      if (file.name.toLowerCase().endsWith('.pdf')) {
        const { text, pages } = await extractPdfText(file)
        setPdfText(text); setPdfPages(pages)
        await runFullAnalysis(text, pages, file.name)
      } else {
        const fakeText = `文件名：${file.name}\n（非 PDF 文件，pdfjs 仅支持 PDF — 真实抽取需要 PPTX/DOCX 解析器）`
        setPdfText(fakeText); setPdfPages(0)
        await runFullAnalysis(fakeText, 0, file.name)
      }
    } catch (e: any) {
      setErrorMsg(`PDF 抽取失败：${e?.message || e}`)
      setRunning(false)
    }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }
  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }
  async function onPasteSubmit() {
    if (pasted.trim().length < 30) return
    setFileName('粘贴文本.txt'); setPdfText(pasted); setPdfPages(0); setRuns([])
    await runFullAnalysis(pasted, 0, '粘贴文本.txt')
  }

  const totalDuration = ANALYSIS_STEPS.reduce((s, x) => s + x.durationMs, 0)
  const doneCount = runs.filter(r => r.status === 'done').length
  const overallProgress = runs.length > 0 ? (doneCount / runs.length) * 100 : 0

  return (
    <div className="px-8 py-6 max-w-[1280px] mx-auto">
      <header className="mb-5">
        <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">BP Deep Analysis · Long-Running Pipeline</div>
        <h1 className="text-[26px] font-semibold tracking-tight mt-1">深度分析你的 BP</h1>
        <p className="text-[13.5px] text-ink-700 mt-1.5 max-w-3xl leading-relaxed">
          上传 PDF → pdfjs 真读全文 → 启动 <b>12 阶段深度分析任务</b>（约 60-90 秒）→ 流式逐步呈现：章节结构 / 工商核查 / 风险扫描 / 专利量化 / 可比锚定 / TAM 反查 / Red Flag / Scorecard / IC Memo 草稿 / 机构记忆比对 → <b>自动创建项目入箱</b>。
        </p>
      </header>

      {/* 上传区 */}
      {!running && !completedAll && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            className="lg:col-span-2 bg-white border-2 border-dashed border-ink-300 rounded-2xl p-10 text-center cursor-pointer hover:border-brand-600 hover:bg-brand-50/30 transition"
          >
            <input ref={inputRef} type="file" accept=".pdf,.pptx,.ppt,.docx,.txt" className="hidden" onChange={onFile} />
            <div className="w-14 h-14 mx-auto rounded-xl bg-brand-50 border border-brand-500/30 flex items-center justify-center text-brand-700">
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v12M5 11l7-7 7 7M4 20h16" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="text-[15px] font-semibold tracking-tight mt-3">拖入 BP 文件 · 启动深度分析</div>
            <div className="text-[12px] text-ink-500 mt-1">优先支持 PDF（pdfjs 真抽全文）· 预计耗时 60-90 秒 · 12 阶段流式呈现</div>
          </div>
          <div className="bg-white border border-ink-200 rounded-2xl p-5">
            <div className="text-[11px] uppercase tracking-wider text-ink-500 mb-2">或粘贴 BP 文本</div>
            <textarea
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
              rows={5}
              placeholder="粘贴 BP 内容…"
              className="w-full text-[12px] bg-ink-50 border border-ink-200 rounded-lg px-2.5 py-2 leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
            <button
              onClick={onPasteSubmit}
              disabled={pasted.trim().length < 30}
              className="mt-2 w-full px-3 py-2 text-[12px] rounded-lg bg-brand-700 text-white hover:bg-brand-800 disabled:bg-ink-300 disabled:cursor-not-allowed transition"
            >
              开始深度分析
            </button>
          </div>
        </section>
      )}

      {/* 错误 */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-5 text-[13px] text-rose-800">
          <b>解析失败</b><div className="mt-1 text-[12px]">{errorMsg}</div>
        </div>
      )}

      {/* 进行中 / 完成时的 sticky 进度条 */}
      {(running || completedAll) && (
        <div ref={stickyRef} className="sticky top-2 z-30 bg-white/95 backdrop-blur-sm border border-ink-200 rounded-xl p-4 mb-5 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
            <div>
              <div className="text-[12px] font-medium">{fileName} {pdfPages ? <span className="text-ink-400 font-normal">· {pdfPages} 页 · {pdfText.length.toLocaleString()} 字符</span> : null}</div>
              <div className="text-[11px] text-ink-500 num">
                {running ? `分析中 · ${doneCount} / ${ANALYSIS_STEPS.length} 阶段已完成` : `✓ 全部 ${ANALYSIS_STEPS.length} 阶段完成（约 ${(totalDuration / 1000).toFixed(0)}s）`}
              </div>
            </div>
            <div className="text-[10px] text-ink-400">总进度 {overallProgress.toFixed(0)}%</div>
          </div>
          <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-700 transition-all" style={{ width: `${overallProgress}%` }} />
          </div>

          {completedAll && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {matchedDealId ? (
                <Link to={`/deal/${matchedDealId}`} className="px-3 py-1.5 text-[12px] rounded-lg bg-brand-700 text-white hover:bg-brand-800">
                  匹配现有「{deals.find(d => d.id === matchedDealId)?.name}」 →
                </Link>
              ) : createdDealId ? (
                <>
                  <button onClick={() => navigate(`/deal/${createdDealId}`)} className="px-3 py-1.5 text-[12px] rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 font-medium">
                    ✓ 进入项目「{fields?.company || fileName}」详情
                  </button>
                  <Link to="/pipeline" className="px-3 py-1.5 text-[12px] rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50">看 Pipeline</Link>
                  <Link to={`/deal/${createdDealId}/memo`} className="px-3 py-1.5 text-[12px] rounded-lg border border-ink-200 hover:bg-ink-50">生成 IC Memo</Link>
                  <Link to={`/deal/${createdDealId}/brief`} className="px-3 py-1.5 text-[12px] rounded-lg border border-ink-200 hover:bg-ink-50">一页简报</Link>
                </>
              ) : null}
              <span className="text-[10px] text-ink-500 ml-auto">综合评分 <b className="num text-ink-900">{score}</b> / 100</span>
            </div>
          )}
        </div>
      )}

      {/* 12 阶段流式展示 */}
      {runs.length > 0 && (
        <section className="space-y-4">
          {runs.map((r, idx) => {
            const meta = ANALYSIS_STEPS[idx]
            const showCard = r.status === 'done' || (r.status === 'running' && r.shownInsight.length > 0.6 * r.fullInsight.length)
            return (
              <article
                key={r.id}
                id={`step-${r.id}`}
                className={`bg-white border-2 rounded-xl p-5 transition-all ${
                  r.status === 'running' ? 'border-brand-600 shadow-lg' :
                  r.status === 'done' ? 'border-ink-200' :
                  'border-ink-200 opacity-50'
                }`}
              >
                <header className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-[13px] font-semibold shrink-0 num ${
                    r.status === 'running' ? 'bg-brand-700 text-white animate-pulse' :
                    r.status === 'done' ? 'bg-emerald-600 text-white' :
                    'bg-ink-100 text-ink-500'
                  }`}>{r.status === 'done' ? '✓' : meta.num}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[15px] font-semibold tracking-tight">{meta.title}</h3>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${r.status === 'running' ? 'bg-brand-50 text-brand-700' : r.status === 'done' ? 'bg-emerald-50 text-emerald-700' : 'bg-ink-100 text-ink-500'}`}>
                        {r.status === 'running' ? '分析中…' : r.status === 'done' ? '已完成' : '待执行'}
                      </span>
                    </div>
                    <div className="text-[11px] text-ink-500 mt-0.5">{meta.subtitle} · 数据源：{meta.source}</div>
                  </div>
                  <div className="text-[10px] text-ink-400 num shrink-0">{(meta.durationMs / 1000).toFixed(1)}s</div>
                </header>

                {/* typewriter 流式 */}
                {(r.status === 'running' || r.status === 'done') && (
                  <div className="text-[13px] text-ink-800 leading-[1.85] whitespace-pre-wrap pl-13">
                    {r.shownInsight.split('\n').map((line, li) => (
                      <p key={li} className={`${line.startsWith('· ') || line.startsWith('✓') || line.startsWith('✗') || line.startsWith('🚨') || line.startsWith('⚠️') ? 'pl-2' : ''}`}>
                        {renderRichLine(line)}
                      </p>
                    ))}
                    {r.status === 'running' && r.shownInsight.length < r.fullInsight.length && (
                      <span className="inline-block w-1.5 h-3.5 bg-brand-700 animate-pulse ml-0.5 align-middle" />
                    )}
                  </div>
                )}

                {/* 数据卡 */}
                {showCard && r.card && (
                  <div className="mt-4 bg-ink-50 border border-ink-200 rounded-lg p-3">
                    <div className="text-[10px] uppercase tracking-wider text-ink-500 font-medium mb-2">{r.card.title}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                      {r.card.rows.map((row, i) => (
                        <div key={i} className="flex items-center justify-between text-[12px] py-0.5">
                          <span className="text-ink-600">{row.k}</span>
                          <span className="text-ink-900 num font-medium ml-2 truncate max-w-[60%]">{row.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </section>
      )}
    </div>
  )
}

function renderRichLine(line: string): React.ReactNode {
  // 简单 markdown bold + code
  const parts: React.ReactNode[] = []
  let rest = line
  let key = 0
  while (rest.length > 0) {
    const bold = rest.match(/\*\*([^*]+)\*\*/)
    const code = rest.match(/`([^`]+)`/)
    const first = [bold, code].filter(Boolean).sort((a, b) => (a!.index || 0) - (b!.index || 0))[0]
    if (!first) { parts.push(rest); break }
    const idx = first.index || 0
    if (idx > 0) parts.push(rest.slice(0, idx))
    if (first === bold) parts.push(<b key={key++} className="text-ink-900">{first[1]}</b>)
    else parts.push(<code key={key++} className="text-[11.5px] bg-ink-100 px-1 py-0.5 rounded">{first[1]}</code>)
    rest = rest.slice(idx + first[0].length)
  }
  return parts
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }
