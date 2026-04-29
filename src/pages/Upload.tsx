import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { deals } from '../data/deals'

type Stage = 'idle' | 'uploading' | 'parsing' | 'verifying' | 'done'

interface ParsedField {
  label: string
  value: string
  source: string
  status: 'extracted' | 'verified' | 'flagged'
}

export default function Upload() {
  const { t } = useApp()
  const [stage, setStage] = useState<Stage>('idle')
  const [fileName, setFileName] = useState<string>('')
  const [progress, setProgress] = useState(0)
  const [fields, setFields] = useState<ParsedField[]>([])
  const [pasted, setPasted] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const recent = deals.slice(0, 4)

  function startAnalysis(name: string) {
    setFileName(name)
    setStage('uploading')
    setProgress(0)
    setFields([])

    let p = 0
    const tick = () => {
      p += 4 + Math.random() * 6
      if (p >= 100) p = 100
      setProgress(p)
      if (p < 30) setStage('uploading')
      else if (p < 60) {
        setStage('parsing')
        if (fields.length === 0) {
          setFields([
            { label: '公司名', value: '星云智能 (NebulaAI)', source: 'PDF Heading', status: 'extracted' },
            { label: '赛道', value: 'AI Infra · Multi-Agent Platform', source: 'NLP 章节分类', status: 'extracted' },
            { label: '阶段 / 估值', value: 'Series A · 投前 $120M', source: 'BP P3 财务摘要', status: 'extracted' },
          ])
        }
      } else if (p < 90) {
        setStage('verifying')
        setFields((prev) => {
          if (prev.length < 6) {
            return [
              ...prev,
              { label: 'ARR $4.8M', value: '声称 38% MoM · 银行流水 + 合同抽查 8/47 验证年化 $4.6M（吻合 4% 范围）', source: '财务尽调 + akshare 寒武纪净利率反验证', status: 'verified' },
              { label: '8 项核心专利', value: '国知局：6 项已授权 + 2 项实质审查 — BP 措辞偏宽', source: 'qcc-ipr · 国知局公开数据', status: 'flagged' },
              { label: '团队 34 人', value: 'LinkedIn 检索 31 人，工程占比 68%（BP 70%）', source: 'qcc-company · LinkedIn', status: 'verified' },
            ]
          }
          return prev
        })
      } else if (p < 100) {
        // ramp
      } else {
        setStage('done')
        return
      }
      if (p < 100) setTimeout(tick, 280)
    }
    setTimeout(tick, 240)
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) startAnalysis(f.name)
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) startAnalysis(f.name)
  }

  function onPasteSubmit() {
    if (pasted.trim().length < 30) return
    startAnalysis('粘贴内容（无文件名）')
  }

  return (
    <div className="px-8 py-6 max-w-[1200px] mx-auto">
      <header className="mb-5">
        <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">BP Upload · Live Analysis</div>
        <h1 className="text-[26px] font-semibold tracking-tight mt-1">{t('nav.upload')}</h1>
        <p className="text-[13.5px] text-ink-700 mt-1.5 max-w-3xl leading-relaxed">
          上传一份 BP（PDF / PPT / 粘贴文本）→ 自动解析关键字段 → 调用真信源（akshare / 企查查 / 国知局）逐条核验 → 生成 Scorecard + Red Flag + IC Memo 草稿
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 space-y-4">
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            className="bg-white border-2 border-dashed border-ink-300 rounded-2xl p-10 text-center cursor-pointer hover:border-brand-600 hover:bg-brand-50/30 transition"
          >
            <input ref={inputRef} type="file" accept=".pdf,.pptx,.ppt,.docx,.txt" className="hidden" onChange={onFile} />
            <div className="w-14 h-14 mx-auto rounded-xl bg-brand-50 border border-brand-500/30 flex items-center justify-center text-brand-700">
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v12M5 11l7-7 7 7M4 20h16" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="text-[15px] font-semibold tracking-tight mt-3">拖入 BP 文件 / 点击选择</div>
            <div className="text-[12px] text-ink-500 mt-1">支持 PDF · PPTX · DOCX · TXT · 单文件 ≤ 50MB</div>
            {stage !== 'idle' && (
              <div className="mt-5 max-w-md mx-auto text-left">
                <div className="text-[12px] text-ink-700 font-medium mb-1.5">{fileName}</div>
                <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-700 transition-all" style={{ width: `${progress}%` }} />
                </div>
                <div className="text-[11px] text-ink-500 mt-1.5 num">
                  {stage === 'uploading' && '上传文件中…'}
                  {stage === 'parsing' && '⌁ AI NLP 解析章节 / 实体抽取…'}
                  {stage === 'verifying' && '⌁ 调真信源核验：akshare / qcc-ipr / qcc-company…'}
                  {stage === 'done' && '✓ 解析完成 — 进入分析报告'}
                  <span className="ml-2">{progress.toFixed(0)}%</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border border-ink-200 rounded-xl p-5">
            <div className="text-[11px] tracking-wider uppercase text-ink-500 mb-2">或粘贴 BP 文本</div>
            <textarea
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
              rows={4}
              placeholder="将 BP 关键内容直接粘贴在这里，至少 30 字符…"
              className="w-full text-[13px] bg-ink-50 border border-ink-200 rounded-lg px-3 py-2 leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={onPasteSubmit}
                disabled={pasted.trim().length < 30 || stage !== 'idle'}
                className="px-3.5 py-2 text-[13px] rounded-lg bg-brand-700 text-white hover:bg-brand-800 disabled:bg-ink-300 disabled:cursor-not-allowed transition"
              >
                开始分析
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-ink-200 rounded-xl p-5">
            <h2 className="text-[14px] font-semibold tracking-tight mb-3">实时解析与核验流</h2>
            {fields.length === 0 ? (
              <div className="text-[12px] text-ink-400 text-center py-8">等待 BP 上传…</div>
            ) : (
              <ol className="space-y-2.5">
                {fields.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] text-white shrink-0 mt-0.5 ${
                      f.status === 'verified' ? 'bg-emerald-600' :
                      f.status === 'flagged' ? 'bg-amber-600' : 'bg-ink-500'
                    }`}>
                      {f.status === 'verified' ? '✓' : f.status === 'flagged' ? '!' : '⌁'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-medium text-ink-900">{f.label}</div>
                      <div className="text-[12px] text-ink-700 leading-relaxed mt-0.5">{f.value}</div>
                      <div className="text-[10px] text-ink-500 mt-0.5">来源：{f.source}</div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
            {stage === 'done' && (
              <Link
                to="/deal/nebula-ai"
                className="mt-4 block w-full text-center px-3.5 py-2 text-[13px] rounded-lg bg-brand-700 text-white hover:bg-brand-800 transition"
              >
                进入完整分析报告 →
              </Link>
            )}
          </div>

          <div className="bg-white border border-ink-200 rounded-xl p-5">
            <h2 className="text-[14px] font-semibold tracking-tight mb-3">最近分析</h2>
            <div className="space-y-2">
              {recent.map((d) => (
                <Link key={d.id} to={`/deal/${d.id}`} className="flex items-center justify-between hover:bg-ink-50 -mx-2 px-2 py-1.5 rounded transition">
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium truncate">{d.name}</div>
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
