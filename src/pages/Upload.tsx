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
  const [matchedDealId, setMatchedDealId] = useState<string | null>(null)
  const [parsedCompany, setParsedCompany] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  const recent = deals.slice(0, 4)

  // 从文件名/文本中派生公司名（演示用，真实路径需 pdfjs-dist 抽全文）
  function derive(input: string): { company: string; sector: string; round: string } {
    // 去扩展名 + BP/Pitch/Deck/年份/月份等 noise
    let n = input.replace(/\.(pdf|pptx?|docx?|txt)$/i, '')
                 .replace(/[-_·]?(BP|Pitch|Deck|Pitchdeck|Deck20\d{2}|20\d{2}-?\d*|v\d+(\.\d+)?)/gi, '')
                 .replace(/[-_]+$/g, '').trim()
    if (!n) n = input.slice(0, 40) || '未命名 BP'
    // 简单赛道关键词检测
    const lower = (input + ' ' + n).toLowerCase()
    let sector = '待 AI 二次分类'
    if (/(ai|算力|大模型|llm|agent|gpt|智能)/.test(lower)) sector = 'AI / Infra（关键词识别）'
    else if (/(医|健康|biotech|生物|医疗|nmpa)/.test(lower)) sector = 'HealthTech（关键词识别）'
    else if (/(金融|fintech|支付|银行|保险|信贷)/.test(lower)) sector = 'Fintech（关键词识别）'
    else if (/(物流|供应链|冷链|配送)/.test(lower)) sector = 'Logistics（关键词识别）'
    else if (/(机器人|robot|硬件)/.test(lower)) sector = 'Robotics（关键词识别）'
    else if (/(消费|品牌|新消费|d2c)/.test(lower)) sector = 'Consumer（关键词识别）'
    let round = 'Series A（默认占位）'
    if (/seed|种子/.test(lower)) round = 'Seed'
    else if (/天使|angel/.test(lower)) round = 'Angel'
    else if (/pre-?a/.test(lower)) round = 'Pre-A'
    else if (/series\s*b|b轮/.test(lower)) round = 'Series B'
    return { company: n, sector, round }
  }

  function startAnalysis(name: string) {
    setFileName(name)
    setStage('uploading')
    setProgress(0)
    setFields([])
    const { company, sector, round } = derive(name)
    setParsedCompany(company)
    // 检查是否匹配现有 6 个 deal — 不匹配则不跳，诚实说明
    const lower = (name + ' ' + company).toLowerCase()
    const m = deals.find((d) =>
      lower.includes(d.name.toLowerCase()) ||
      lower.includes(d.cnName) ||
      d.name.toLowerCase().includes(company.toLowerCase()) ||
      d.cnName.includes(company),
    )
    setMatchedDealId(m?.id || null)

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
            { label: '公司名（从文件名识别）', value: company, source: '文件名解析（演示版 · 真实 PDF 抽取需后端 pdfjs + NLP）', status: 'extracted' },
            { label: '赛道', value: sector, source: '关键词匹配（演示）· 生产环境走 NLP 章节分类器', status: 'extracted' },
            { label: '阶段 / 估值', value: `${round} · 估值待 BP 财务页解析`, source: '生产环境走 financial section parser（演示版未接）', status: 'extracted' },
          ])
        }
      } else if (p < 90) {
        setStage('verifying')
        setFields((prev) => {
          if (prev.length < 6) {
            return [
              ...prev,
              { label: '工商画像 · qcc-company', value: `「${company}」如已注册可直接调 qcc-company.get_company_profile 拉成立年份 / 法人 / 经营范围 / 状态 — 真信源已接通`, source: 'qcc-company · 实接通（演示模式不实际调用以省 quota）', status: 'verified' },
              { label: '专利护城河 · qcc-ipr', value: `自动调 get_patent_info("${company}") 返回真实专利数 — 例如旷视 434 / 寒武纪 548 / 联影 3,493`, source: 'qcc-ipr · 国知局公开数据 · 实接通', status: 'verified' },
              { label: '风险扫描 · qcc-risk', value: '自动 5 维并行扫描：行政处罚 / 失信 / 经营异常 / 严重违法 / 被执行 — 任一硬命中触发 Pass', source: 'qcc-risk · 5 工具组 · 实接通', status: 'flagged' },
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
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-[12px] text-amber-900 leading-relaxed">
          <b>演示模式说明：</b>当前页面从文件名/粘贴文本派生公司名 + 赛道 + 阶段（关键词匹配），不真实抽取 PDF 内文。
          <b className="mx-1">真实生产路径</b>需要：① 后端 pdfjs-dist 抽 PDF 全文 ② NLP 章节分类器 ③ 实时调企查查/国知局/akshare 工具组（这些工具已在产品里实接通，见 <a href="/dealpilot-claude/?/sources" className="underline">/sources</a>）。
          要看真实信源调通示范请去 <a href="/dealpilot-claude/?/risk" className="underline">/risk</a> 看 6 家真实公司风险扫描数据，或 <a href="/dealpilot-claude/?/unicorns" className="underline">/unicorns</a> 看 7 家公司真实专利对照矩阵。
        </div>
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
              matchedDealId ? (
                <Link
                  to={`/deal/${matchedDealId}`}
                  className="mt-4 block w-full text-center px-3.5 py-2 text-[13px] rounded-lg bg-brand-700 text-white hover:bg-brand-800 transition"
                >
                  匹配到现有项目「{deals.find(d => d.id === matchedDealId)?.name}」· 进入完整分析 →
                </Link>
              ) : (
                <div className="mt-4 text-[12px] text-amber-900 bg-amber-50 border border-amber-200 rounded-md p-3 leading-relaxed">
                  <b>识别到「{parsedCompany}」</b> — 当前演示库无此项目完整档案（生产环境会通过工商画像、专利核验、信号雷达等真信源自动构建首份档案）。
                  <div className="mt-2 flex items-center gap-2">
                    <Link to="/deal/nebula-ai" className="text-[11px] px-2 py-1 rounded bg-brand-700 text-white hover:bg-brand-800">看 NebulaAI 完整分析示例</Link>
                    <Link to="/sources" className="text-[11px] px-2 py-1 rounded border border-amber-300 hover:bg-amber-100">看真信源接入清单</Link>
                  </div>
                </div>
              )
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
