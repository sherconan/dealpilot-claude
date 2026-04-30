import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { deals } from '../data/deals'
import {
  extractPdfText,
  extractFields,
  detectRedFlags,
  computeScore,
  renderPdfPagesAsImages,
  type ExtractedFields,
  type RedFlag,
} from '../lib/pdfPipeline'
import { SECTION_ORDER, getSectionLabel, type SectionKey } from '../lib/llmAnalyze'
import { analyzeWithProvider, getApiKey, setApiKey, clearApiKey, getProvider, setProvider, PROVIDER_META, type Provider } from '../lib/multimodalAnalyze'
import { addUserDeal, buildDealFromExtraction } from '../lib/userDealStore'

type Stage = 'idle' | 'reading' | 'extracting' | 'llm-calling' | 'streaming' | 'creating' | 'done' | 'error'

interface SectionState {
  key: SectionKey
  label: string
  status: 'pending' | 'streaming' | 'done'
  shown: string
  full: string
}

export default function Upload() {
  const { t } = useApp()
  const navigate = useNavigate()
  const [stage, setStage] = useState<Stage>('idle')
  const [fileName, setFileName] = useState('')
  const [pdfText, setPdfText] = useState('')
  const [pdfPages, setPdfPages] = useState(0)
  const [fields, setFields] = useState<ExtractedFields | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [redFlags, setRedFlags] = useState<RedFlag[]>([])
  const [sections, setSections] = useState<SectionState[]>([])
  const [llmDuration, setLlmDuration] = useState<number>(0)
  const [createdDealId, setCreatedDealId] = useState<string | null>(null)
  const [matchedDealId, setMatchedDealId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [progressMsg, setProgressMsg] = useState<string>('')
  const [pasted, setPasted] = useState('')
  const [provider, setProviderState] = useState<Provider>(getProvider())
  const [apiKey, setApiKeyState] = useState<string>(getApiKey() || '')
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [pageImages, setPageImages] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  function typewriter(key: SectionKey, full: string, speed = 14): Promise<void> {
    return new Promise((resolve) => {
      let i = 0
      const step = Math.max(2, Math.ceil(full.length / 80))
      const tick = () => {
        i = Math.min(full.length, i + step)
        setSections((arr) => arr.map(s => s.key === key ? { ...s, shown: full.slice(0, i) } : s))
        if (i < full.length) setTimeout(tick, speed)
        else resolve()
      }
      tick()
    })
  }

  async function run(text: string, pages: number, name: string, pdfFile?: File) {
    try {
      setErrorMsg(null)
      setStage('reading')
      setPdfText(text); setPdfPages(pages); setFileName(name)
      await sleep(200)

      // ① 字段抽取
      setStage('extracting')
      setProgressMsg('regex 抽取关键字段...')
      const f = extractFields(text, name.replace(/\.(pdf|pptx?|docx?|txt)$/i, ''))
      const flags = detectRedFlags(text, f)
      const sc = computeScore(f, flags)
      setFields(f); setRedFlags(flags); setScore(sc)
      await sleep(500)

      // ② 调 LLM 真分析
      setStage('llm-calling')
      setSections(SECTION_ORDER.map((k) => ({ key: k, label: getSectionLabel(k), status: 'pending', shown: '', full: '' })))

      const providerMeta = PROVIDER_META[provider]
      let images: string[] = []
      if (providerMeta.multimodal && pdfFile && name.toLowerCase().endsWith('.pdf')) {
        setProgressMsg(`渲染 PDF 前 ${Math.min(pages, 8)} 页为图像（多模态模型将真看 PDF 视觉）...`)
        images = await renderPdfPagesAsImages(pdfFile, 8, 1.4, 0.7)
        setPageImages(images)
      }
      setProgressMsg(`调用 ${providerMeta.label} 分析中（${providerMeta.multimodal ? `${images.length} 页图像 + 文本` : '纯文本'}，预计 30-90 秒）...`)
      const analysis = await analyzeWithProvider(provider, apiKey || null, images, text, f, flags, (msg) => setProgressMsg(msg))
      setLlmDuration(analysis.duration)

      // ③ 流式 typewriter 10 段
      setStage('streaming')
      for (const key of SECTION_ORDER) {
        const full = analysis.sections[key]
        if (!full) {
          setSections((arr) => arr.map(s => s.key === key ? { ...s, full: '（LLM 未生成此段）', status: 'done', shown: '（LLM 未生成此段）' } : s))
          continue
        }
        setSections((arr) => arr.map(s => s.key === key ? { ...s, full, status: 'streaming' } : s))
        // 滚动到当前段
        setTimeout(() => document.getElementById(`sec-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80)
        await typewriter(key, full)
        setSections((arr) => arr.map(s => s.key === key ? { ...s, status: 'done' } : s))
      }

      // ④ 创建项目
      setStage('creating')
      setProgressMsg('创建项目并入箱机构记忆...')
      const lower = (name + ' ' + text.slice(0, 2000)).toLowerCase()
      const m = deals.find((d) =>
        lower.includes(d.name.toLowerCase()) || lower.includes(d.cnName) ||
        (f.company && (d.name.toLowerCase().includes(f.company.toLowerCase()) || d.cnName.includes(f.company))),
      )
      setMatchedDealId(m?.id || null)
      if (!m) {
        const newDeal = buildDealFromExtraction(f, flags, sc, name, text, analysis.raw)
        addUserDeal(newDeal)
        setCreatedDealId(newDeal.id)
      }

      setStage('done')
    } catch (e: any) {
      console.error(e)
      setErrorMsg(`深度分析失败：${e?.message || e}`)
      setStage('error')
    }
  }

  async function handleFile(file: File) {
    setStage('reading')
    setSections([]); setFields(null); setRedFlags([]); setScore(null)
    setCreatedDealId(null); setMatchedDealId(null); setErrorMsg(null)
    setFileName(file.name)

    if (file.name.toLowerCase().endsWith('.pdf')) {
      try {
        setProgressMsg('pdfjs 抽取 PDF 全文中...')
        const { text, pages } = await extractPdfText(file)
        await run(text, pages, file.name, file)
      } catch (e: any) {
        setErrorMsg(`PDF 抽取失败：${e?.message || e}`)
        setStage('error')
      }
    } else {
      const txt = `文件名：${file.name}\n（非 PDF · pdfjs 不支持，仅识别文件名）`
      await run(txt, 0, file.name)
    }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (f) handleFile(f)
  }
  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]; if (f) handleFile(f)
  }
  async function onPasteSubmit() {
    if (pasted.trim().length < 30) return
    setSections([]); setFields(null); setRedFlags([]); setScore(null)
    setCreatedDealId(null); setMatchedDealId(null); setErrorMsg(null)
    setFileName('粘贴文本.txt'); setPdfText(pasted); setPdfPages(0)
    await run(pasted, 0, '粘贴文本.txt')
  }

  const isRunning = stage !== 'idle' && stage !== 'done' && stage !== 'error'

  return (
    <div className="px-8 py-6 max-w-[1280px] mx-auto">
      <header className="mb-5">
        <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">BP Deep Analysis · Real LLM Pipeline</div>
        <h1 className="text-[26px] font-semibold tracking-tight mt-1">真 LLM 深度分析你的 BP</h1>
        <p className="text-[13.5px] text-ink-700 mt-1.5 max-w-3xl leading-relaxed">
          上传 PDF → <b>pdfjs 真读全文</b> → regex 抽字段 → <b>调 Pollinations LLM 写完整 10 段深度报告</b>（约 30-60 秒）→ 流式 typewriter 呈现 → 自动创建项目入箱。报告由模型基于你 PDF 真实内容生成，不再是 regex 模板。
        </p>
      </header>

      {/* Provider 选择 + BYOK */}
      <section className="bg-white border border-ink-200 rounded-xl p-4 mb-5">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div>
            <div className="text-[12.5px] font-semibold tracking-tight">分析模式</div>
            <div className="text-[11px] text-ink-500 mt-0.5">免费文本 LLM 默认开启 · 想要真多模态请填 key（仅存浏览器，不上传）</div>
          </div>
          <div className="text-[10px] text-ink-400">key 存储：<code className="bg-ink-100 px-1 rounded">localStorage / dp:llm-key</code></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {(Object.keys(PROVIDER_META) as Provider[]).map((p) => {
            const meta = PROVIDER_META[p]
            const active = provider === p
            const needsKey = !meta.free && !apiKey
            return (
              <button
                key={p}
                onClick={() => { setProvider(p); setProviderState(p); if (!meta.free) setShowKeyInput(true) }}
                className={`text-left p-3 rounded-lg border-2 transition ${
                  active ? 'border-brand-600 bg-brand-50/50' : 'border-ink-200 hover:bg-ink-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-semibold tracking-tight">{meta.label.split(' (')[0]}</span>
                  {meta.multimodal && <span className="text-[9px] text-violet-700 bg-violet-50 px-1 py-0.5 rounded font-medium">视觉</span>}
                  {meta.free && <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-medium">免费</span>}
                </div>
                <div className="text-[10.5px] text-ink-600 leading-snug">{meta.desc}</div>
                {needsKey && <div className="text-[10px] text-amber-700 mt-1">⚠️ 需要 API key</div>}
                {active && !meta.free && apiKey && <div className="text-[10px] text-emerald-700 mt-1">✓ key 已配置</div>}
              </button>
            )
          })}
        </div>
        {(showKeyInput || (!PROVIDER_META[provider].free && !apiKey)) && (
          <div className="mt-3 flex items-center gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKeyState(e.target.value)}
              placeholder={
                provider === 'gemini-flash' ? '粘贴 Google Gemini key，去 aistudio.google.com/app/apikey 免费拿（30 秒）' :
                provider === 'moonshot-vision' ? '粘贴 Moonshot API key (sk-...)，去 platform.moonshot.cn 申请（注册送 ¥15）' :
                provider === 'openai-vision' ? '粘贴 OpenAI API key (sk-...)' :
                provider === 'deepseek' ? '粘贴 DeepSeek API key' : ''
              }
              className="flex-1 text-[12px] bg-ink-50 border border-ink-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/30 font-mono"
            />
            <button
              onClick={() => {
                if (apiKey) { setApiKey(apiKey); setShowKeyInput(false) }
                else { clearApiKey(); setShowKeyInput(false) }
              }}
              className="px-3 py-1.5 text-[12px] rounded bg-brand-700 text-white hover:bg-brand-800"
            >保存</button>
            {apiKey && (
              <button onClick={() => { setApiKeyState(''); clearApiKey() }} className="text-[11px] text-rose-700 hover:underline">清除</button>
            )}
          </div>
        )}
        <div className="mt-2 text-[10.5px] text-ink-500 leading-relaxed">
          {PROVIDER_META[provider].multimodal ?
            '✓ 此模式下系统会渲染 PDF 每页为图像，连同 pdfjs 抽到的文字一起喂给多模态模型 — 模型能真看到 BP 的图表、产品截图、视觉布局。' :
            'ⓘ 此模式下仅把 pdfjs 抽到的文字喂给文本 LLM — 看不到 PDF 里的图表/截图/布局。如要真多模态请选 Moonshot Kimi 或 OpenAI GPT-4o。'}
        </div>
      </section>

      {/* 上传区 */}
      {stage === 'idle' && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
          <div onDrop={onDrop} onDragOver={(e) => e.preventDefault()} onClick={() => inputRef.current?.click()}
            className="lg:col-span-2 bg-white border-2 border-dashed border-ink-300 rounded-2xl p-10 text-center cursor-pointer hover:border-brand-600 hover:bg-brand-50/30 transition">
            <input ref={inputRef} type="file" accept=".pdf,.pptx,.ppt,.docx,.txt" className="hidden" onChange={onFile} />
            <div className="w-14 h-14 mx-auto rounded-xl bg-brand-50 border border-brand-500/30 flex items-center justify-center text-brand-700">
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v12M5 11l7-7 7 7M4 20h16" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="text-[15px] font-semibold tracking-tight mt-3">拖入 BP PDF · 启动真 LLM 深度分析</div>
            <div className="text-[12px] text-ink-500 mt-1">pdfjs 真读 PDF + Pollinations LLM 真写 10 段报告 · 约 30-60 秒</div>
          </div>
          <div className="bg-white border border-ink-200 rounded-2xl p-5">
            <div className="text-[11px] uppercase tracking-wider text-ink-500 mb-2">或粘贴 BP 文本</div>
            <textarea value={pasted} onChange={(e) => setPasted(e.target.value)} rows={5}
              placeholder="粘贴 BP 内容…"
              className="w-full text-[12px] bg-ink-50 border border-ink-200 rounded-lg px-2.5 py-2 leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
            <button onClick={onPasteSubmit} disabled={pasted.trim().length < 30}
              className="mt-2 w-full px-3 py-2 text-[12px] rounded-lg bg-brand-700 text-white hover:bg-brand-800 disabled:bg-ink-300 disabled:cursor-not-allowed transition">
              开始深度分析
            </button>
          </div>
        </section>
      )}

      {/* 错误 */}
      {stage === 'error' && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-5 text-[13px] text-rose-800">
          <b>分析失败</b>
          <div className="mt-1 text-[12px]">{errorMsg}</div>
          <button onClick={() => setStage('idle')} className="mt-2 px-3 py-1 text-[12px] rounded bg-rose-700 text-white">重新上传</button>
        </div>
      )}

      {/* PDF 真文本 + 字段 — 第一秒立即显示 */}
      {pdfText && (
        <div className="bg-white border border-ink-200 rounded-xl p-4 mb-5">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <div>
              <div className="text-[12.5px] font-semibold tracking-tight">PDF 抽取真文本（前 1500 字）</div>
              <div className="text-[11px] text-ink-500 num">
                {pdfPages > 0 ? `${pdfPages} 页 · ` : ''}共 <b className="text-ink-800">{pdfText.length.toLocaleString()}</b> 字符 · {fileName}
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">pdfjs 真抽</span>
          </div>
          {pdfText.length < 100 ? (
            <div className="bg-rose-50 border border-rose-200 rounded p-3 text-[12px] text-rose-800">
              <b>⚠️ PDF 抽取内容过少</b>（{pdfText.length} 字符）— 极可能是图片型扫描件，pdfjs 无法识别，需要 OCR。
            </div>
          ) : (
            <div className="text-[11.5px] text-ink-700 bg-ink-50 rounded-md p-3 max-h-[150px] overflow-y-auto leading-relaxed font-mono whitespace-pre-wrap scrollbar-thin">
              {pdfText.slice(0, 1500)}{pdfText.length > 1500 ? '…' : ''}
            </div>
          )}
          {fields && (
            <div className="mt-3 pt-3 border-t border-ink-100">
              <div className="text-[10px] uppercase tracking-wider text-ink-500 mb-2">regex 抽到的字段（这只是基线，下面 10 段由 LLM 真写）</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 text-[11.5px]">
                <FieldKV k="公司名" v={fields.company} />
                <FieldKV k="赛道" v={fields.sector} />
                <FieldKV k="轮次" v={fields.round} />
                <FieldKV k="估值" v={fields.valuation} />
                <FieldKV k="ARR" v={fields.arr} />
                <FieldKV k="增长" v={fields.growthRate} />
                <FieldKV k="TAM" v={fields.tam} />
                <FieldKV k="LTV/CAC" v={fields.ltvCac} />
                <FieldKV k="客户" v={fields.customers} />
                <FieldKV k="专利" v={fields.patentClaim} />
                <FieldKV k="创始人" v={fields.founders.join(' / ') || undefined} />
                <FieldKV k="对标" v={fields.comparables.slice(0, 3).join(' / ') || undefined} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* LLM 调用中 loading 状态 */}
      {(stage === 'llm-calling' || stage === 'extracting' || stage === 'reading') && (
        <div className="bg-gradient-to-br from-brand-50 to-white border-2 border-brand-500 rounded-xl p-6 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-brand-700 animate-pulse" />
            <div className="text-[14px] font-semibold tracking-tight text-brand-800">{progressMsg || 'LLM 分析中...'}</div>
          </div>
          <div className="text-[12px] text-ink-700 mt-2 leading-relaxed">
            {stage === 'llm-calling' && '正在把 PDF 全文 + regex 字段送给 Pollinations LLM（OpenAI-compatible 免费通道），让模型生成 10 段深度报告。预计 30-60 秒。'}
            {stage === 'extracting' && '本地 regex 抽取中（极快）...'}
            {stage === 'reading' && 'pdfjs 浏览器端真读 PDF...'}
          </div>
          <div className="mt-3 h-1.5 bg-ink-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-700 animate-pulse" style={{ width: stage === 'llm-calling' ? '60%' : stage === 'extracting' ? '25%' : '10%' }} />
          </div>
        </div>
      )}

      {/* sticky 完成进度 */}
      {(stage === 'streaming' || stage === 'done' || stage === 'creating') && (
        <div className="sticky top-2 z-30 bg-white/95 backdrop-blur-sm border border-ink-200 rounded-xl p-4 mb-5 shadow-sm">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="text-[12px] font-medium">{fileName}</div>
              <div className="text-[11px] text-ink-500 num">
                LLM 真分析完成 · {llmDuration > 0 ? `耗时 ${(llmDuration / 1000).toFixed(1)}s` : ''} · {sections.filter(s => s.status === 'done').length} / {sections.length} 段已渲染
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {stage === 'done' && (matchedDealId ? (
                <Link to={`/deal/${matchedDealId}`} className="px-3 py-1.5 text-[12px] rounded-lg bg-brand-700 text-white hover:bg-brand-800">
                  匹配「{deals.find(d => d.id === matchedDealId)?.name}」 →
                </Link>
              ) : createdDealId ? (
                <>
                  <button onClick={() => navigate(`/deal/${createdDealId}`)} className="px-3 py-1.5 text-[12px] rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 font-medium">
                    ✓ 进入项目「{fields?.company || fileName}」
                  </button>
                  <Link to={`/deal/${createdDealId}/memo`} className="px-3 py-1.5 text-[12px] rounded-lg border border-ink-200 hover:bg-ink-50">IC Memo</Link>
                </>
              ) : null)}
              {score !== null && <span className="text-[10px] text-ink-500">评分 <b className="num text-ink-900 text-[14px]">{score}</b>/100</span>}
            </div>
          </div>
        </div>
      )}

      {/* 10 段 LLM 深度分析 */}
      {sections.length > 0 && (
        <section className="space-y-4">
          {sections.map((s, idx) => (
            <article key={s.key} id={`sec-${s.key}`}
              className={`bg-white border-2 rounded-xl p-5 transition-all ${
                s.status === 'streaming' ? 'border-brand-600 shadow-lg' :
                s.status === 'done' ? 'border-ink-200' : 'border-ink-200 opacity-50'
              }`}>
              <header className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-[13px] font-semibold shrink-0 num ${
                  s.status === 'streaming' ? 'bg-brand-700 text-white animate-pulse' :
                  s.status === 'done' ? 'bg-emerald-600 text-white' : 'bg-ink-100 text-ink-500'
                }`}>{s.status === 'done' ? '✓' : (idx + 1).toString().padStart(2, '0')}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-[15px] font-semibold tracking-tight">{s.label}</h3>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${s.status === 'streaming' ? 'bg-brand-50 text-brand-700' : s.status === 'done' ? 'bg-emerald-50 text-emerald-700' : 'bg-ink-100 text-ink-500'}`}>
                      {s.status === 'streaming' ? 'LLM 流式输出中…' : s.status === 'done' ? '完成' : '等待 LLM'}
                    </span>
                  </div>
                  <div className="text-[11px] text-ink-500 mt-0.5">由 Pollinations LLM 基于你 PDF 真实内容生成</div>
                </div>
              </header>
              {(s.status === 'streaming' || s.status === 'done') && (
                <div className="text-[13.5px] text-ink-800 leading-[1.85] whitespace-pre-wrap">
                  {renderMarkdown(s.shown)}
                  {s.status === 'streaming' && s.shown.length < s.full.length && (
                    <span className="inline-block w-1.5 h-3.5 bg-brand-700 animate-pulse ml-0.5 align-middle" />
                  )}
                </div>
              )}
            </article>
          ))}
        </section>
      )}
    </div>
  )
}

function FieldKV({ k, v }: { k: string; v?: string }) {
  return (
    <div className={`rounded px-2 py-1 ${v ? 'bg-emerald-50 border border-emerald-200/60' : 'bg-ink-50 border border-ink-200/60'}`}>
      <div className="text-[10px] text-ink-500">{k}</div>
      <div className={`text-[12px] num font-medium mt-0.5 truncate ${v ? 'text-emerald-800' : 'text-ink-400'}`}>{v || '— 未抽到'}</div>
    </div>
  )
}

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n')
  return lines.map((line, li) => (
    <p key={li} className={`${line.match(/^[-·•*]/) ? 'pl-2' : ''} ${line.match(/^#{1,3}\s/) ? 'font-semibold mt-2 text-ink-900' : ''}`}>
      {renderRichLine(line.replace(/^#+\s*/, ''))}
    </p>
  ))
}

function renderRichLine(line: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let rest = line; let key = 0
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
