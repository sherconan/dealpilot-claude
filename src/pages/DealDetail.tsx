import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDealById } from '../data/deals'
import { getDealExtra } from '../data/extra'
import { sequoiaLabels, recommendationMeta, thesisChecks } from '../lib/scoring'
import ScoreRing from '../components/ScoreRing'
import ThesisCanvas from '../components/ThesisCanvas'
import { StagePill, RecommendationPill } from '../components/StatusPill'
import type { Sequoia10, DataCheck, InterviewQuestion } from '../types'

export default function DealDetail() {
  const { id } = useParams()
  const deal = getDealById(id || '')
  const extra = getDealExtra(id || '')
  const [openDim, setOpenDim] = useState<string | null>(null)
  const [interviewFilter, setInterviewFilter] = useState<string>('all')

  if (!deal) {
    return (
      <div className="p-10 max-w-xl mx-auto text-center">
        <div className="text-[14px] text-ink-500">项目未找到</div>
        <Link to="/pipeline" className="text-[12px] text-brand-700 mt-2 inline-block">返回看板 →</Link>
      </div>
    )
  }

  const recMeta = recommendationMeta[deal.recommendation]
  const hardFlags = deal.redFlags.filter((f) => f.severity === 'hard')
  const softFlags = deal.redFlags.filter((f) => f.severity === 'soft')

  const interviewCategories: { key: InterviewQuestion['category'] | 'all'; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'financial', label: '财务' },
    { key: 'business', label: '业务' },
    { key: 'team', label: '团队' },
    { key: 'competition', label: '竞争' },
    { key: 'risk', label: '风险' },
    { key: 'fund-use', label: '资金用途' },
    { key: 'governance', label: '治理' },
  ]

  const filteredQuestions = extra?.interviewQuestions.filter(
    (q) => interviewFilter === 'all' || q.category === interviewFilter,
  ) || []

  const checkColor = (s: DataCheck['status']) =>
    s === 'aligned' ? { color: '#059669', bg: 'bg-emerald-50', border: 'border-emerald-200', label: '一致' }
    : s === 'partial' ? { color: '#d97706', bg: 'bg-amber-50', border: 'border-amber-200', label: '部分对齐' }
    : s === 'gap' ? { color: '#dc2626', bg: 'bg-rose-50', border: 'border-rose-200', label: '存在偏差' }
    : { color: '#64748b', bg: 'bg-ink-100', border: 'border-ink-300', label: '待核实' }

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-2 text-[12px] text-ink-500 mb-3">
        <Link to="/pipeline" className="hover:text-brand-700">看板</Link>
        <span>/</span>
        <span>{deal.sector}</span>
        <span>/</span>
        <span className="text-ink-900">{deal.name}</span>
      </div>

      <header className="flex items-start justify-between gap-4 flex-wrap mb-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-semibold text-lg tracking-tight shrink-0" style={{ background: deal.accentColor }}>
            {deal.name.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-[26px] font-semibold tracking-tight">{deal.name}</h1>
              <span className="text-ink-500 text-[14px]">{deal.cnName}</span>
              <StagePill stage={deal.stage} />
              <RecommendationPill rec={deal.recommendation} />
            </div>
            <p className="text-[14px] text-ink-700 mt-1.5 max-w-2xl leading-relaxed">{deal.tagline}</p>
            <div className="flex items-center gap-4 mt-2.5 text-[12px] text-ink-500 flex-wrap">
              <span><span className="text-ink-400">赛道</span> · {deal.sector}</span>
              <span><span className="text-ink-400">阶段</span> · {deal.round}</span>
              <span><span className="text-ink-400">估值</span> · <span className="num text-ink-800 font-medium">{deal.valuation}</span></span>
              <span><span className="text-ink-400">本轮</span> · <span className="num text-ink-800 font-medium">{deal.askAmount}</span></span>
              <span><span className="text-ink-400">成立</span> · {deal.foundedYear} · {deal.location}</span>
              <span><span className="text-ink-400">团队</span> · <span className="num">{deal.teamSize}</span> 人</span>
              <span><span className="text-ink-400">来源</span> · {deal.source}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert(`已安排合伙人会议\n\n项目：${deal.name}\n创始人：${deal.founders[0]?.name}\n邀请将通过邮件发送（演示版未实际发送）`)}
            className="px-3.5 py-2 text-[13px] rounded-lg border border-ink-200 bg-white hover:bg-ink-50">安排会议</button>
          <button
            onClick={() => {
              const ok = confirm(`将 ${deal.name} 推入「尽调」阶段？\n\n· 自动启动 5 项 reference check\n· 触发 financial DD 任务\n· 通知冠军合伙人 ${deal.champion}`)
              if (ok) {
                try {
                  const cur = JSON.parse(localStorage.getItem('dp:stageOverride') || '{}')
                  cur[deal.id] = 'dd'
                  localStorage.setItem('dp:stageOverride', JSON.stringify(cur))
                  alert(`✓ ${deal.name} 已进入尽调阶段\n（看板已自动更新，前往 Pipeline 查看）`)
                } catch (e) { alert('✓ 已记录（演示版）') }
              }
            }}
            className="px-3.5 py-2 text-[13px] rounded-lg border border-ink-200 bg-white hover:bg-ink-50">进入尽调</button>
          <Link to={`/deal/${deal.id}/brief`} className="px-3.5 py-2 text-[13px] rounded-lg border border-ink-200 bg-white hover:bg-ink-50">一页简报</Link>
          <Link to={`/deal/${deal.id}/memo`} className="px-3.5 py-2 text-[13px] rounded-lg bg-brand-700 text-white hover:bg-brand-800">生成 IC Memo</Link>
        </div>
      </header>

      {/* ─── Verdict + Red Flag + Traction（顶部 3 列）─── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        <div className="lg:col-span-4 bg-white border border-ink-200 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <ScoreRing score={deal.score} color={deal.accentColor} size={128} label="Scorecard" />
            <div className="flex-1">
              <div className={`inline-flex items-center gap-1.5 text-[12px] px-2 py-1 rounded ${recMeta.bg}`} style={{ color: recMeta.color }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: recMeta.color }} />
                {recMeta.label}
              </div>
              <div className="text-[12px] text-ink-600 mt-2 leading-relaxed">{recMeta.rationale}</div>
              <div className="text-[11px] text-ink-400 mt-2">冠军合伙人：{deal.champion}</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-ink-100">
            <div className="text-[11px] text-ink-500 mb-2">推荐行动</div>
            <ul className="space-y-1 text-[12.5px] text-ink-800">
              {deal.recommendation === 'priority' && <>
                <li>· 立即排入最近一次 IC（4/26 周日）</li>
                <li>· 锁定本轮份额 ≥ 60%</li>
                <li>· 启动 reference check（2 名前同事 + 3 名客户）</li>
              </>}
              {deal.recommendation === 'monitor' && <>
                <li>· 季度回访，跟踪关键里程碑</li>
                <li>· 监控 LinkedIn / GitHub / 招聘信号</li>
                <li>· 等待 2 个关键不确定性消除后再启动尽调</li>
              </>}
              {deal.recommendation === 'conditional' && <>
                <li>· 当面指出软红线，要求改进后再评</li>
                <li>· 不进入尽调通道，仅保留观察</li>
              </>}
              {deal.recommendation === 'pass' && <>
                <li>· 礼貌拒绝，存档机构记忆</li>
                <li>· 创始人加标签防止二次接触</li>
              </>}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-ink-200 rounded-xl p-5">
          <h2 className="text-[14px] font-semibold tracking-tight mb-3">Red Flag 扫描</h2>
          {hardFlags.length === 0 && softFlags.length === 0 && (
            <div className="text-[12px] text-ink-500 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">未发现硬红线或软扣分项</div>
          )}
          {hardFlags.length > 0 && (
            <div className="mb-3">
              <div className="text-[11px] tracking-wider uppercase text-rose-700 font-medium mb-1.5">硬 Red Flag · {hardFlags.length}</div>
              <div className="space-y-2">
                {hardFlags.map((f, i) => (
                  <div key={i} className="bg-rose-50 border border-rose-200 rounded-md px-3 py-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-[12.5px] font-semibold text-rose-800">{f.label}</div>
                      <div className="text-[10px] text-rose-600 shrink-0">{f.source}</div>
                    </div>
                    <div className="text-[12px] text-rose-700 mt-1 leading-relaxed">{f.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {softFlags.length > 0 && (
            <div>
              <div className="text-[11px] tracking-wider uppercase text-amber-700 font-medium mb-1.5">软 扣分项 · {softFlags.length}</div>
              <div className="space-y-2">
                {softFlags.map((f, i) => (
                  <div key={i} className="bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-[12.5px] font-semibold text-amber-800">{f.label}</div>
                      <div className="text-[10px] text-amber-600 shrink-0">{f.source}</div>
                    </div>
                    <div className="text-[12px] text-amber-700 mt-1 leading-relaxed">{f.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 bg-white border border-ink-200 rounded-xl p-5">
          <h2 className="text-[14px] font-semibold tracking-tight mb-3">关键指标</h2>
          <div className="grid grid-cols-2 gap-3">
            {deal.traction.map((t) => (
              <div key={t.label} className="bg-ink-50 border border-ink-200/70 rounded-lg p-2.5">
                <div className="text-[11px] text-ink-500">{t.label}</div>
                <div className="num font-semibold text-[16px] text-ink-900 mt-1">{t.value}</div>
                {t.delta && <div className="text-[10px] text-emerald-700 num mt-0.5">▲ {t.delta}</div>}
              </div>
            ))}
          </div>
          <div className="border-t border-ink-200 mt-4 pt-3 space-y-1.5 text-[12px]">
            <Row k="市场规模 TAM" v={deal.tam} />
            <Row k="可服务 SAM" v={deal.sam} />
            <Row k="ARR" v={deal.arr || '—'} />
            <Row k="增长率" v={deal.growthRate || '—'} />
            <Row k="LTV / CAC" v={deal.ltvCac ? `${deal.ltvCac}x` : '—'} />
            <Row k="CAC 回收期" v={deal.cacPayback || '—'} />
            <Row k="毛利率" v={deal.grossMargin || '—'} />
          </div>
        </div>
      </section>

      {/* ─── LLM 深度分析报告（仅用户上传项目）─── */}
      {deal.deepAnalysisRaw && (
        <section className="bg-gradient-to-br from-brand-50/50 via-white to-white border-2 border-brand-500/30 rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-brand-700 font-medium">Deep Analysis · 真 LLM 撰写</div>
              <h2 className="text-[15px] font-semibold tracking-tight mt-0.5">10 段深度分析报告</h2>
              <p className="text-[12px] text-ink-500 mt-0.5">由 Pollinations LLM 基于上传 PDF 真实内容生成 · 不是模板</p>
            </div>
          </div>
          <div className="space-y-3">
            {deal.deepAnalysisRaw.split(/===\s*SECTION\s*\d+\s*===/i).slice(1).map((section, i) => {
              const labels = ['公司画像与定位', '问题与机会判断', '产品与解决方案', '商业模式', '市场规模与竞争', '团队评估', '牵引与财务', '风险与红线', '投资论点', '尽调建议与关键问题']
              const trimmed = section.trim()
              if (!trimmed) return null
              return (
                <details key={i} className="bg-white border border-ink-200 rounded-lg p-3" open={i < 3}>
                  <summary className="cursor-pointer flex items-center gap-2 text-[13px] font-semibold tracking-tight">
                    <span className="num w-6 h-6 rounded bg-brand-700 text-white text-[11px] flex items-center justify-center">{(i + 1).toString().padStart(2, '0')}</span>
                    <span>{labels[i] || `第 ${i + 1} 段`}</span>
                  </summary>
                  <div className="mt-2 text-[12.5px] text-ink-800 leading-[1.85] whitespace-pre-wrap">
                    {trimmed.split('\n').map((line, li) => {
                      const renderedLine = line.split(/(\*\*[^*]+\*\*)/g).map((part, pi) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <b key={pi} className="text-ink-900">{part.slice(2, -2)}</b>
                        }
                        return part
                      })
                      return <p key={li} className={line.match(/^[-·•*]/) ? 'pl-2' : ''}>{renderedLine}</p>
                    })}
                  </div>
                </details>
              )
            })}
          </div>
        </section>
      )}

      {/* ─── 投资逻辑画布 ─── */}
      <ThesisCanvas deal={deal} />

      {/* ─── Sequoia 10 要素 vs 行业基准 ─── */}
      <section className="bg-white border border-ink-200 rounded-xl p-5 mb-5">
        <div className="flex items-end justify-between mb-1 flex-wrap gap-2">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight">Sequoia 10 要素 · 与行业基准对比</h2>
            <p className="text-[12px] text-ink-500 mt-0.5">{extra?.benchmarkLabel || '基准数据未配置'}</p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-ink-500">
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: deal.accentColor }} />本项目</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-ink-400" />行业中位</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-emerald-600" />头部 25%</span>
            <span className="text-ink-400">点击展开详情</span>
          </div>
        </div>

        <div className="mt-4 divide-y divide-ink-100">
          {sequoiaLabels.map((s) => {
            const v = deal.sequoia[s.key]
            const median = extra?.benchmarkMedian[s.key as keyof Sequoia10] ?? 6
            const top = extra?.benchmarkTopQuartile[s.key as keyof Sequoia10] ?? 8
            const detail = extra?.dimensionDetails[s.key]
            const isOpen = openDim === s.key
            const delta = v - median
            const deltaColor = delta > 0 ? '#059669' : delta < 0 ? '#dc2626' : '#64748b'

            return (
              <div key={s.key} className="py-3">
                <button onClick={() => setOpenDim(isOpen ? null : s.key)} className="w-full text-left hover:bg-ink-50 -mx-2 px-2 py-1 rounded transition">
                  <div className="grid grid-cols-[180px_1fr_140px_60px] gap-4 items-center">
                    <div>
                      <div className="text-[13px] font-medium text-ink-900">{s.label}</div>
                      <div className="text-[11px] text-ink-500 mt-0.5">{s.desc}</div>
                    </div>
                    <div className="relative h-7">
                      <div className="absolute inset-y-0 left-0 right-0 bg-ink-100 rounded" />
                      <div className="absolute inset-y-0 left-0 rounded" style={{ width: `${v * 10}%`, background: deal.accentColor, opacity: 0.85 }} />
                      <div className="absolute top-0 bottom-0 w-[2px] bg-ink-400" style={{ left: `${median * 10}%` }} title={`中位 ${median}`} />
                      <div className="absolute top-0 bottom-0 w-[2px] bg-emerald-600" style={{ left: `${top * 10}%` }} title={`头部 25% ${top}`} />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-white num font-medium">{v}/10</div>
                    </div>
                    <div className="text-[11px] num">
                      <span className="text-ink-500">中位 {median}</span>
                      <span className="mx-1 text-ink-300">·</span>
                      <span className="text-ink-500">Top {top}</span>
                    </div>
                    <div className="num text-[13px] font-semibold text-right" style={{ color: deltaColor }}>
                      {delta > 0 ? `+${delta}` : delta}
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-3 ml-[196px] pl-4 border-l-2 border-brand-500/30 text-[12.5px]">
                    {detail ? <>
                      <div className="text-ink-800 leading-relaxed">{detail.rationale}</div>
                      <div className="mt-2.5">
                        <div className="text-[10px] tracking-wider uppercase text-ink-500 mb-1">评分依据</div>
                        <ul className="space-y-1">
                          {detail.evidence.map((e, i) => (
                            <li key={i} className="text-ink-700 flex items-start gap-1.5"><span className="w-1 h-1 rounded-full bg-brand-700 mt-[7px] shrink-0" /><span>{e}</span></li>
                          ))}
                        </ul>
                      </div>
                      {detail.signals && detail.signals.length > 0 && (
                        <div className="mt-2.5">
                          <div className="text-[10px] tracking-wider uppercase text-ink-500 mb-1">最新信号</div>
                          <ul className="space-y-1">
                            {detail.signals.map((s, i) => (
                              <li key={i} className="text-ink-700 flex items-start gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-600 mt-[7px] shrink-0" /><span>{s}</span></li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </> : (
                      <div className="text-[12px] text-ink-400">该维度详情待补充</div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ─── BP 数据真实性核验 ─── */}
      {extra && extra.dataChecks.length > 0 && (
        <section className="bg-white border border-ink-200 rounded-xl p-5 mb-5">
          <div className="flex items-end justify-between mb-3 flex-wrap gap-2">
            <div>
              <h2 className="text-[15px] font-semibold tracking-tight flex items-center gap-2">
                BP 数据真实性核验
                <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                  <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="currentColor"><path d="M10.4 3.6L4.8 9.2 1.6 6l1.4-1.4L4.8 6.4l4.2-4.2z"/></svg>
                  实时 {extra.dataChecks.filter(c => c.verified).length}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-ink-500 bg-ink-100 border border-ink-200 px-1.5 py-0.5 rounded">演示 {extra.dataChecks.filter(c => !c.verified).length}</span>
              </h2>
              <p className="text-[12px] text-ink-500 mt-0.5">绿色「实时」= 已通过 MCP 工具实测调通；灰色「演示」= 等待真实 BP 触发对应信源调用</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-ink-500">
              <Tag color="#059669" label={`一致 ${extra.dataChecks.filter(c => c.status === 'aligned').length}`} />
              <Tag color="#d97706" label={`部分 ${extra.dataChecks.filter(c => c.status === 'partial').length}`} />
              <Tag color="#dc2626" label={`偏差 ${extra.dataChecks.filter(c => c.status === 'gap').length}`} />
              <Tag color="#64748b" label={`待核 ${extra.dataChecks.filter(c => c.status === 'unverified').length}`} />
            </div>
          </div>
          <div className="divide-y divide-ink-100">
            {extra.dataChecks.map((c, i) => {
              const m = checkColor(c.status)
              return (
                <div key={i} className={`py-3 grid grid-cols-1 lg:grid-cols-[1fr_1fr_120px_200px] gap-3 items-start ${c.verified ? 'bg-emerald-50/30 -mx-2 px-2 rounded' : ''}`}>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-ink-500 mb-1">BP 声称</div>
                    <div className="text-[13px] text-ink-900 font-medium">{c.claim}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-ink-500 mb-1">外部交叉验证</div>
                    <div className="text-[13px] text-ink-700 leading-relaxed">{c.external}</div>
                    {c.note && <div className="text-[11px] text-ink-500 mt-1 italic">{c.note}</div>}
                  </div>
                  <div>
                    <span className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full ${m.bg} font-medium`} style={{ color: m.color }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />{m.label}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {c.verified ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-700 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded">
                        <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="currentColor"><path d="M10.4 3.6L4.8 9.2 1.6 6l1.4-1.4L4.8 6.4l4.2-4.2z"/></svg>
                        实时
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-ink-500 bg-ink-100 border border-ink-200 px-1.5 py-0.5 rounded">演示</span>
                    )}
                    <div className="text-[11px] text-ink-500">{c.source}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ─── 管理层访谈问题清单 ─── */}
      {extra && extra.interviewQuestions.length > 0 && (
        <section className="bg-white border border-ink-200 rounded-xl p-5 mb-5">
          <div className="flex items-end justify-between mb-3 flex-wrap gap-2">
            <div>
              <h2 className="text-[15px] font-semibold tracking-tight">管理层访谈问题清单</h2>
              <p className="text-[12px] text-ink-500 mt-0.5">共 {extra.interviewQuestions.length} 题 · 按红线 / 评分缺口 / 关键不确定性自动生成</p>
            </div>
            <div className="flex items-center gap-1 bg-ink-50 border border-ink-200 rounded-lg p-1 flex-wrap">
              {interviewCategories.map((c) => (
                <button key={c.key} onClick={() => setInterviewFilter(c.key)} className={`px-2.5 py-1 text-[11px] rounded transition ${interviewFilter === c.key ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-white'}`}>{c.label}</button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {filteredQuestions.map((q, i) => (
              <div key={i} className="border border-ink-200 rounded-lg p-4 hover:border-brand-500/40 transition">
                <div className="flex items-start gap-3">
                  <div className="num w-7 h-7 rounded-full bg-brand-700 text-white text-[12px] font-medium flex items-center justify-center shrink-0">Q{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="text-[10px] tracking-wider uppercase font-medium text-brand-800 bg-brand-50 px-1.5 py-0.5 rounded">
                        {interviewCategories.find(c => c.key === q.category)?.label || q.category}
                      </span>
                    </div>
                    <div className="text-[13.5px] text-ink-900 font-medium leading-relaxed">{q.question}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2.5 text-[12px]">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-ink-500">为什么问</div>
                        <div className="text-ink-700 mt-0.5 leading-relaxed">{q.why}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-emerald-700">期待 / 警惕信号</div>
                        <div className="text-ink-700 mt-0.5 leading-relaxed">{q.expect}{q.watch ? ` · ${q.watch}` : ''}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── 可比上市公司（真实 API 数据） ─── */}
      {extra && (
        <section className="bg-white border border-ink-200 rounded-xl p-5 mb-5">
          <div className="flex items-end justify-between mb-3 flex-wrap gap-2">
            <div>
              <h2 className="text-[15px] font-semibold tracking-tight flex items-center gap-2">
                可比上市公司
                <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                  <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="currentColor"><path d="M10.4 3.6L4.8 9.2 1.6 6l1.4-1.4L4.8 6.4l4.2-4.2z"/></svg>
                  全部真实数据
                </span>
              </h2>
              <p className="text-[12px] text-ink-500 mt-0.5">akshare · 东方财富实时接口 · 抓取于 2026-04-24</p>
            </div>
          </div>
          {extra.publicComps.length === 0 ? (
            <div className="text-[13px] text-ink-500 bg-ink-50 border border-ink-200 rounded-lg px-4 py-6 text-center">
              本项目无合规可比上市公司
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-[12.5px] min-w-[1000px]">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-ink-500 border-b border-ink-200">
                    <th className="text-left py-2 px-2">公司 · 代码</th>
                    <th className="text-right py-2 px-2 num">股价 · 报告期</th>
                    <th className="text-right py-2 px-2 num">营收</th>
                    <th className="text-right py-2 px-2 num">净利润</th>
                    <th className="text-right py-2 px-2 num">净利率</th>
                    <th className="text-right py-2 px-2 num">总资产</th>
                    <th className="text-left py-2 px-2">相似度 / 距离</th>
                  </tr>
                </thead>
                <tbody>
                  {extra.publicComps.map((c, i) => (
                    <tr key={i} className="border-b border-ink-100 hover:bg-ink-50">
                      <td className="py-3 px-2">
                        <div className="font-medium text-ink-900 flex items-center gap-1.5">
                          {c.name}
                          {c.verified && (
                            <span title={`真实数据 from ${c.source}`} className="inline-flex items-center gap-0.5 text-[9px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 py-0.5 rounded">
                              <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="currentColor"><path d="M10.4 3.6L4.8 9.2 1.6 6l1.4-1.4L4.8 6.4l4.2-4.2z"/></svg>
                              实时
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-ink-500">{c.ticker}</div>
                        {c.verified && <div className="text-[9px] text-ink-400 mt-0.5">{c.source}</div>}
                        <div className="flex items-center gap-2 mt-0.5">
                          {c.reportUrl && (
                            <a href={c.reportUrl} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()} className="text-[9px] text-brand-700 hover:underline inline-flex items-center gap-0.5">
                              <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="currentColor"><path d="M3 1h4.5L9 2.5V11H3V1zm5 1.5V2H4v8h4V3.5H6.5v-1H8z"/></svg>
                              年报
                            </a>
                          )}
                          {c.prospectusUrl && (
                            <a href={c.prospectusUrl} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()} className="text-[9px] text-violet-700 hover:underline inline-flex items-center gap-0.5">
                              <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="currentColor"><path d="M3 1h4.5L9 2.5V11H3V1zm5 1.5V2H4v8h4V3.5H6.5v-1H8z"/></svg>
                              招股书
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right num">
                        <div className="text-ink-900 font-medium">{c.price || '—'}</div>
                        <div className="text-[10px] text-ink-400">{c.reportDate || '—'}</div>
                      </td>
                      <td className="py-3 px-2 text-right num text-brand-700 font-medium">{c.revenue || '—'}</td>
                      <td className="py-3 px-2 text-right num">{c.netIncome || '—'}</td>
                      <td className="py-3 px-2 text-right num font-medium">{c.netMargin || '—'}</td>
                      <td className="py-3 px-2 text-right num text-ink-600">{c.totalAssets || '—'}</td>
                      <td className="py-3 px-2 text-[12px] text-ink-700 max-w-[280px]">
                        <div>{c.similarity}</div>
                        <div className="text-ink-500 text-[11px] mt-0.5">{c.distance}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 p-3 bg-gradient-to-br from-brand-50 to-white border border-brand-500/20 rounded-lg">
            <div className="text-[10px] uppercase tracking-wider text-brand-700 font-medium">估值锚定结论</div>
            <div className="text-[13px] text-ink-800 mt-1 leading-relaxed">{extra.compsTakeaway}</div>
          </div>
        </section>
      )}

      {/* ─── 投资论点对齐 + 创始团队 ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        <div className="lg:col-span-7 bg-white border border-ink-200 rounded-xl p-5">
          <h2 className="text-[14px] font-semibold tracking-tight mb-3">投资论点对齐</h2>
          <div className="space-y-2">
            {thesisChecks.map((c) => (
              <div key={c.title} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded flex items-center justify-center text-white text-[10px] shrink-0 ${c.pass ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                  {c.pass ? '✓' : '✕'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-ink-900">{c.title}</span>
                    <span className="text-[11px] text-ink-400 num">权重 {c.weight}%</span>
                  </div>
                  <div className="text-[11px] text-ink-500 mt-0.5">{c.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-ink-200 rounded-xl p-5">
          <h2 className="text-[14px] font-semibold tracking-tight mb-3">创始团队</h2>
          <div className="space-y-3">
            {deal.founders.map((f) => (
              <div key={f.name} className="flex items-start gap-3 pb-3 border-b border-ink-100 last:border-0 last:pb-0">
                <div className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center text-[12px] font-semibold text-ink-700 shrink-0">
                  {f.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium">{f.name}</span>
                    <span className="text-[11px] text-ink-500">· {f.role}</span>
                  </div>
                  <div className="text-[12px] text-ink-600 mt-0.5 leading-relaxed">{f.background}</div>
                  {f.highlight && <div className="text-[11px] text-brand-700 mt-1">{f.highlight}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Wins / Concerns / Timeline ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white border border-ink-200 rounded-xl p-5">
            <h2 className="text-[14px] font-semibold tracking-tight mb-3 text-emerald-700">核心亮点</h2>
            <ul className="space-y-2">
              {deal.wins.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-ink-800 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-[7px] shrink-0" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white border border-ink-200 rounded-xl p-5">
            <h2 className="text-[14px] font-semibold tracking-tight mb-3 text-amber-700">关注问题</h2>
            <ul className="space-y-2">
              {deal.concerns.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-ink-800 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-[7px] shrink-0" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-ink-200 rounded-xl p-5">
          <h2 className="text-[14px] font-semibold tracking-tight mb-3">项目时间线</h2>
          <div className="space-y-3 relative pl-4 before:absolute before:left-[5px] before:top-1 before:bottom-1 before:w-px before:bg-ink-200">
            {deal.timeline.map((e, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-4 top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2" style={{ borderColor: deal.accentColor }} />
                <div className="text-[11px] text-ink-500 num">{e.date}</div>
                <div className="text-[13px] text-ink-900 mt-0.5">{e.event}</div>
                {e.actor && <div className="text-[11px] text-ink-400 mt-0.5">{e.actor}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-500">{k}</span>
      <span className="text-ink-900 num font-medium">{v}</span>
    </div>
  )
}

function Tag({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 num">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      <span style={{ color }}>{label}</span>
    </span>
  )
}
