import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { deals } from '../data/deals'
import {
  extractPdfText,
  extractFields,
  detectSections,
  detectRedFlags,
  computeScore,
  routeVerification,
  buildMemoSeed,
  type ExtractedFields,
  type RedFlag,
  type SectionMap,
  type VerificationRoute,
} from '../lib/pdfPipeline'

type Stage = 'idle' | 'reading' | 'parsing' | 'verifying' | 'scoring' | 'memoing' | 'done' | 'error'

interface PipelineState {
  stage: Stage
  progress: number
  pdfText?: string
  pdfPages?: number
  fileName?: string
  fields?: ExtractedFields
  sections?: SectionMap
  redFlags?: RedFlag[]
  score?: number
  routes?: VerificationRoute[]
  memo?: { recommendation: string; oneLiner: string; threePoints: string[] }
  errorMsg?: string
}

const stages: { key: Stage; label: string; pct: number; desc: string }[] = [
  { key: 'reading',   label: '① 抽取 PDF 文本',   pct: 15, desc: 'pdfjs-dist 真实抽取每一页文本（前端真做，不是模拟）' },
  { key: 'parsing',   label: '② 章节切分 + 字段抽取', pct: 35, desc: 'regex 章节分类（10 段标准结构）+ 实体识别（公司/创始人/ARR/TAM/估值/专利/对标）' },
  { key: 'verifying', label: '③ 真信源调用路由',   pct: 55, desc: '基于抽取字段决定该调哪些 MCP 工具组（qcc-company/risk/ipr · akshare · cninfo · autoglm）' },
  { key: 'scoring',   label: '④ Red Flag 触发 + Scorecard', pct: 78, desc: '本地规则引擎检测硬/软红线 + 100 分 Scorecard 加权' },
  { key: 'memoing',   label: '⑤ IC Memo 草稿种子',  pct: 95, desc: '执行摘要 / 推荐建议 / 三个核心论点 自动生成' },
  { key: 'done',      label: '✓ 完成',             pct: 100, desc: '可进入完整分析报告或匹配现有 deal' },
]

export default function Upload() {
  const { t } = useApp()
  const [state, setState] = useState<PipelineState>({ stage: 'idle', progress: 0 })
  const [pasted, setPasted] = useState('')
  const [matchedDealId, setMatchedDealId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recent = deals.slice(0, 4)

  async function runPipeline(text: string, pages: number, fileName: string) {
    try {
      setState({ stage: 'reading', progress: 15, fileName, pdfText: text, pdfPages: pages })
      await sleep(280)

      // ② 字段抽取
      const fields = extractFields(text, fileName.replace(/\.(pdf|pptx?|docx?|txt)$/i, ''))
      const sections = detectSections(text)
      setState((s) => ({ ...s, stage: 'parsing', progress: 35, fields, sections }))
      await sleep(380)

      // ③ 真信源调用路由
      const routes = routeVerification(fields)
      setState((s) => ({ ...s, stage: 'verifying', progress: 55, routes }))
      await sleep(420)

      // ④ Red Flag + Scorecard
      const redFlags = detectRedFlags(text, fields)
      const score = computeScore(fields, redFlags)
      setState((s) => ({ ...s, stage: 'scoring', progress: 78, redFlags, score }))
      await sleep(380)

      // ⑤ Memo 种子
      const memo = buildMemoSeed(fields, score, redFlags)
      setState((s) => ({ ...s, stage: 'memoing', progress: 95, memo }))
      await sleep(220)

      setState((s) => ({ ...s, stage: 'done', progress: 100 }))

      // 匹配现有 deal
      const lower = (fileName + ' ' + text.slice(0, 2000)).toLowerCase()
      const m = deals.find((d) =>
        lower.includes(d.name.toLowerCase()) || lower.includes(d.cnName) ||
        (fields.company && (d.name.toLowerCase().includes(fields.company.toLowerCase()) || d.cnName.includes(fields.company))),
      )
      setMatchedDealId(m?.id || null)
    } catch (e: any) {
      setState((s) => ({ ...s, stage: 'error', errorMsg: e?.message || 'PDF 解析失败' }))
    }
  }

  async function handleFile(file: File) {
    setState({ stage: 'reading', progress: 5, fileName: file.name })
    setMatchedDealId(null)
    if (file.name.toLowerCase().endsWith('.pdf')) {
      try {
        const { text, pages } = await extractPdfText(file)
        await runPipeline(text, pages, file.name)
      } catch (e: any) {
        setState({ stage: 'error', progress: 0, fileName: file.name, errorMsg: `PDF 抽取失败：${e?.message || e}` })
      }
    } else {
      // 非 PDF：仅读文件名做演示
      const fakeText = `文件名：${file.name}\n（非 PDF 文件，pdfjs 仅支持 PDF — 真实抽取需要 PPTX/DOCX 解析器）`
      await runPipeline(fakeText, 0, file.name)
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
    await runPipeline(pasted, 0, '粘贴文本.txt')
  }

  const currentStage = stages.find((s) => s.key === state.stage) || stages[0]
  const isRunning = state.stage !== 'idle' && state.stage !== 'done' && state.stage !== 'error'

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto">
      <header className="mb-5">
        <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">BP Upload · Real PDF Extraction Pipeline</div>
        <h1 className="text-[26px] font-semibold tracking-tight mt-1">上传 BP · 真 PDF 抽取 + 7 步处理 pipeline</h1>
        <p className="text-[13.5px] text-ink-700 mt-1.5 max-w-3xl leading-relaxed">
          上传真 PDF → <b>pdfjs-dist 前端真实抽文本</b> → regex 章节切分 + 字段抽取 → 自动路由该调的 MCP 工具组 → Red Flag 触发 + Scorecard 评分 → IC Memo 种子。所有抽取结果来自<b>你上传的文件</b>，不再是 mock。
        </p>
        <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-[12px] text-emerald-900 leading-relaxed">
          <b>真 PDF 抽取已启用：</b>用 <code className="bg-emerald-100 px-1 rounded">pdfjs-dist 5.x</code> 在浏览器端真实读取你的 PDF 全文，下面看到的"公司名 / ARR / TAM / 估值 / 专利 / 对标"全部从 PDF 内文 regex 抽取。
          <span className="block mt-1">真信源调用清单（步骤 ③）会列出该调的 MCP 工具组，但前端不实调（SPA 跑不了 MCP）— 真实工具样例见 <a href="/dealpilot-claude/?/sources" className="underline font-medium">/sources</a>、<a href="/dealpilot-claude/?/risk" className="underline font-medium">/risk</a>、<a href="/dealpilot-claude/?/unicorns" className="underline font-medium">/unicorns</a>。</span>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 左：上传区 + 流程进度 */}
        <div className="lg:col-span-5 space-y-4">
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            className="bg-white border-2 border-dashed border-ink-300 rounded-2xl p-8 text-center cursor-pointer hover:border-brand-600 hover:bg-brand-50/30 transition"
          >
            <input ref={inputRef} type="file" accept=".pdf,.pptx,.ppt,.docx,.txt" className="hidden" onChange={onFile} />
            <div className="w-12 h-12 mx-auto rounded-xl bg-brand-50 border border-brand-500/30 flex items-center justify-center text-brand-700">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v12M5 11l7-7 7 7M4 20h16" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="text-[14px] font-semibold tracking-tight mt-3">拖入 BP / 点击选择</div>
            <div className="text-[11px] text-ink-500 mt-1">优先支持 PDF（真抽取）· PPTX/DOCX/TXT 仅识别文件名</div>
            {state.fileName && (
              <div className="mt-4 text-left max-w-md mx-auto">
                <div className="text-[12px] text-ink-700 font-medium mb-1.5 truncate">{state.fileName} {state.pdfPages ? <span className="text-ink-400 font-normal">· {state.pdfPages} 页</span> : null}</div>
                <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-700 transition-all" style={{ width: `${state.progress}%` }} />
                </div>
                <div className="text-[11px] text-ink-500 mt-1.5 num">
                  {currentStage.label} · {state.progress.toFixed(0)}%
                </div>
              </div>
            )}
          </div>

          {/* 7 步处理流程 */}
          <div className="bg-white border border-ink-200 rounded-xl p-4">
            <div className="text-[11px] uppercase tracking-wider text-ink-500 mb-3">处理 Pipeline · 5 步</div>
            <ol className="space-y-2.5">
              {stages.slice(0, -1).map((s) => {
                const reached = stages.findIndex(x => x.key === state.stage) >= stages.findIndex(x => x.key === s.key)
                const active = state.stage === s.key
                return (
                  <li key={s.key} className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ${
                      active ? 'bg-brand-700 text-white animate-pulse' :
                      reached ? 'bg-emerald-600 text-white' :
                      'bg-ink-100 text-ink-500'
                    }`}>{reached && !active ? '✓' : s.label.match(/[①②③④⑤]/)?.[0] || '·'}</div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[12.5px] font-medium ${active ? 'text-brand-800' : reached ? 'text-ink-900' : 'text-ink-500'}`}>{s.label}</div>
                      <div className="text-[11px] text-ink-500 leading-relaxed mt-0.5">{s.desc}</div>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* 粘贴文本 */}
          <div className="bg-white border border-ink-200 rounded-xl p-4">
            <div className="text-[11px] uppercase tracking-wider text-ink-500 mb-2">或粘贴 BP 文本</div>
            <textarea
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
              rows={3}
              placeholder="粘贴 BP 关键内容，至少 30 字符…"
              className="w-full text-[12px] bg-ink-50 border border-ink-200 rounded-lg px-2.5 py-2 leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
            <button
              onClick={onPasteSubmit}
              disabled={pasted.trim().length < 30 || isRunning}
              className="mt-2 w-full px-3 py-2 text-[12px] rounded-lg bg-brand-700 text-white hover:bg-brand-800 disabled:bg-ink-300 disabled:cursor-not-allowed transition"
            >
              开始分析
            </button>
          </div>
        </div>

        {/* 右：抽取结果实时展示 */}
        <div className="lg:col-span-7 space-y-4">
          {state.stage === 'idle' ? (
            <div className="bg-white border border-ink-200 rounded-xl p-10 text-center text-[13px] text-ink-400">
              ↑ 上传 PDF 后这里会实时展示真实抽取结果
            </div>
          ) : state.stage === 'error' ? (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 text-[13px] text-rose-800">
              <b>解析失败</b>
              <div className="mt-1 text-[12px]">{state.errorMsg}</div>
            </div>
          ) : (
            <>
              {/* PDF 文本预览（证据） */}
              {state.pdfText && (
                <div className="bg-white border border-ink-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[11px] uppercase tracking-wider text-ink-500">PDF 抽取文本预览（前 600 字）· 这是真的</div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">pdfjs-dist 实抽</span>
                  </div>
                  <div className="text-[11.5px] text-ink-700 bg-ink-50 rounded-md p-2.5 max-h-[120px] overflow-y-auto leading-relaxed font-mono whitespace-pre-wrap">
                    {state.pdfText.slice(0, 600)}{state.pdfText.length > 600 ? '…' : ''}
                  </div>
                  <div className="text-[10px] text-ink-400 mt-1.5">共抽取 {state.pdfText.length} 字符 · {state.pdfPages || 0} 页</div>
                </div>
              )}

              {/* 字段抽取结果 */}
              {state.fields && (
                <div className="bg-white border border-ink-200 rounded-xl p-4">
                  <div className="text-[11px] uppercase tracking-wider text-ink-500 mb-2">② 字段抽取（regex 真做）</div>
                  <div className="grid grid-cols-2 gap-2 text-[12px]">
                    <FieldKV k="公司名" v={state.fields.company} />
                    <FieldKV k="赛道" v={state.fields.sector} />
                    <FieldKV k="阶段" v={state.fields.round} />
                    <FieldKV k="估值" v={state.fields.valuation} />
                    <FieldKV k="ARR" v={state.fields.arr} />
                    <FieldKV k="增长率" v={state.fields.growthRate} />
                    <FieldKV k="TAM 市场" v={state.fields.tam} />
                    <FieldKV k="LTV/CAC" v={state.fields.ltvCac} />
                    <FieldKV k="客户" v={state.fields.customers} />
                    <FieldKV k="专利声明" v={state.fields.patentClaim} />
                    <FieldKV k="创始人" v={state.fields.founders.join(' / ') || undefined} />
                    <FieldKV k="对标公司" v={state.fields.comparables.join(' / ') || undefined} />
                  </div>
                  {state.sections && (
                    <div className="mt-3 pt-2 border-t border-ink-100">
                      <div className="text-[10px] uppercase tracking-wider text-ink-500 mb-1">章节覆盖</div>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(state.sections).map(([k, has]) => (
                          <span key={k} className={`text-[10px] px-1.5 py-0.5 rounded ${has ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                            {has ? '✓' : '✗'} {SectionLabel[k]}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 真信源调用路由 */}
              {state.routes && state.routes.length > 0 && (
                <div className="bg-white border border-ink-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[11px] uppercase tracking-wider text-ink-500">③ 真信源调用路由（基于抽取字段自动决定）</div>
                    <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">演示版本不实调 quota</span>
                  </div>
                  <ol className="space-y-1.5 max-h-[200px] overflow-y-auto scrollbar-thin">
                    {state.routes.map((r) => (
                      <li key={r.step} className="flex items-start gap-2 text-[11.5px]">
                        <span className="num w-5 h-5 rounded bg-ink-900 text-white text-[10px] flex items-center justify-center shrink-0">{r.step}</span>
                        <div className="flex-1 min-w-0">
                          <code className="text-[10.5px] bg-ink-100 px-1 rounded">{r.tool}</code>
                          <span className="text-ink-700 ml-1.5">→ {r.target}</span>
                          <div className="text-[10.5px] text-ink-500 mt-0.5">{r.what}</div>
                        </div>
                        <span className={`text-[9px] px-1 py-0.5 rounded shrink-0 ${r.status === 'live' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'}`}>{r.status}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Red Flag + Scorecard */}
              {(state.redFlags || state.score !== undefined) && (
                <div className="bg-white border border-ink-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[11px] uppercase tracking-wider text-ink-500">④ Scorecard + Red Flag（本地规则引擎真做）</div>
                  </div>
                  <div className="flex items-end gap-4 mb-3">
                    <div>
                      <div className="num font-semibold text-[36px] tracking-tight" style={{ color: scoreColor(state.score) }}>{state.score ?? '—'}</div>
                      <div className="text-[10px] text-ink-400 tracking-wider uppercase">/ 100</div>
                    </div>
                    <div className="flex-1 mb-2">
                      <div className="text-[12px] text-ink-700 leading-relaxed">{recLabel(state.score)}</div>
                    </div>
                  </div>
                  {state.redFlags && state.redFlags.length > 0 && (
                    <div className="space-y-1.5">
                      {state.redFlags.map((f, i) => (
                        <div key={i} className={`text-[11.5px] p-2 rounded border ${f.severity === 'hard' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                          <span className="font-semibold">[{f.severity === 'hard' ? '硬红线' : '软扣分'}] {f.label}</span>
                          <div className="text-[10.5px] mt-0.5">{f.detail}</div>
                          {f.evidence && <div className="text-[10px] mt-0.5 font-mono opacity-70">证据：{f.evidence}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* IC Memo 种子 */}
              {state.memo && (
                <div className="bg-gradient-to-br from-brand-50 to-white border border-brand-500/30 rounded-xl p-4">
                  <div className="text-[11px] uppercase tracking-wider text-brand-700 font-medium mb-2">⑤ IC Memo 种子 · 自动生成</div>
                  <div className="text-[12.5px] text-ink-800 leading-relaxed">{state.memo.oneLiner}</div>
                  <ul className="mt-2 space-y-1">
                    {state.memo.threePoints.map((p, i) => (
                      <li key={i} className="text-[12px] text-ink-700 flex items-start gap-1.5">
                        <span className="num text-brand-700 font-semibold shrink-0">#{i + 1}</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 完成跳转 */}
              {state.stage === 'done' && (
                matchedDealId ? (
                  <Link to={`/deal/${matchedDealId}`} className="block w-full text-center px-3.5 py-2.5 text-[13px] rounded-lg bg-brand-700 text-white hover:bg-brand-800 transition">
                    匹配「{deals.find(d => d.id === matchedDealId)?.name}」· 进入完整分析报告 →
                  </Link>
                ) : (
                  <div className="text-[12px] text-amber-900 bg-amber-50 border border-amber-200 rounded-md p-3">
                    <b>识别为「{state.fields?.company}」</b> — 当前演示库无此项目完整档案。生产环境会基于抽取字段 + 真信源调用结果自动构建首份档案存入 <Link to="/memory" className="underline">机构记忆</Link>。
                    <div className="mt-2 flex items-center gap-2">
                      <Link to="/deal/nebula-ai" className="text-[11px] px-2 py-1 rounded bg-brand-700 text-white">看 NebulaAI 完整分析示例</Link>
                      <Link to="/sources" className="text-[11px] px-2 py-1 rounded border border-amber-300">真信源已接通清单</Link>
                    </div>
                  </div>
                )
              )}
            </>
          )}

          {/* 最近分析 */}
          <div className="bg-white border border-ink-200 rounded-xl p-4">
            <div className="text-[11px] uppercase tracking-wider text-ink-500 mb-2">最近分析</div>
            <div className="space-y-1.5">
              {recent.map((d) => (
                <Link key={d.id} to={`/deal/${d.id}`} className="flex items-center justify-between hover:bg-ink-50 -mx-2 px-2 py-1.5 rounded transition">
                  <div className="min-w-0">
                    <div className="text-[12.5px] font-medium truncate">{d.name}</div>
                    <div className="text-[11px] text-ink-500 truncate">{d.sector} · {d.round}</div>
                  </div>
                  <span className="num font-semibold text-[14px] shrink-0" style={{ color: d.accentColor }}>{d.score}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function FieldKV({ k, v }: { k: string; v?: string }) {
  return (
    <div className={`rounded-md px-2 py-1.5 ${v ? 'bg-emerald-50 border border-emerald-200/60' : 'bg-ink-50 border border-ink-200/60'}`}>
      <div className="text-[10px] text-ink-500">{k}</div>
      <div className={`text-[12px] num font-medium mt-0.5 ${v ? 'text-emerald-800' : 'text-ink-400'}`}>{v || '— 未识别'}</div>
    </div>
  )
}

const SectionLabel: Record<string, string> = {
  mission: '使命', problem: '问题', solution: '解决方案', market: '市场',
  team: '团队', financials: '财务', competition: '竞争', whyNow: '时机', vision: '愿景',
}

function scoreColor(s?: number): string {
  if (s === undefined) return '#94a3b8'
  if (s >= 80) return '#059669'
  if (s >= 65) return '#0ea5e9'
  if (s >= 50) return '#d97706'
  return '#dc2626'
}

function recLabel(s?: number): string {
  if (s === undefined) return ''
  if (s >= 80) return '推荐 · 优先推进 (Priority Deal) — 排入最近 IC + 锁定份额'
  if (s >= 65) return '推荐 · 持续观察 (Monitor) — 季度回访 + 信号源监控'
  if (s >= 50) return '推荐 · 有条件跟进 (Conditional) — 当面指出软红线，要求改进后再评'
  return '推荐 · 建议 Pass — 机构记忆库存档 + 创始人风险标签'
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }
