import { sources } from '../data/sourceProofs'

const statusMeta: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  live:    { label: '已实测', color: '#059669', bg: 'bg-emerald-50', dot: '#10b981' },
  wired:   { label: '已接入', color: '#2563eb', bg: 'bg-sky-50',     dot: '#3b82f6' },
  planned: { label: '路线图', color: '#94a3b8', bg: 'bg-ink-100',    dot: '#94a3b8' },
}

export default function Sources() {
  const liveCount = sources.filter(s => s.status === 'live').length
  const wiredCount = sources.filter(s => s.status === 'wired').length

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto">
      <header className="mb-6">
        <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">Data Sources · Verification Layer</div>
        <h1 className="text-[26px] font-semibold tracking-tight mt-1">真信源接入与实测</h1>
        <p className="text-[13.5px] text-ink-700 mt-2 max-w-3xl leading-relaxed">
          这一页是产品的<b>信任凭证</b>：当前版本已对接 <span className="num font-semibold text-emerald-700">{liveCount}</span> 个<b>实测调通</b>的真信源 +
          <span className="num font-semibold text-sky-700"> {wiredCount}</span> 个<b>已接入待触发</b>的工具组。
          BP 真实上传后，对应字段会自动从下面任一信源拉真数据替换占位，所有"verified"标签必须有可追溯的 API 响应作为证据。
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <SummaryCard label="信源已实测" value={`${liveCount}/7`} accent="#059669" hint="akshare · qcc(3) · cninfo" />
        <SummaryCard label="专利记录" value={'4,475'} accent="#0f766e" hint="联影 3493 + 寒武纪 548 + 旷视 434" />
        <SummaryCard label="官方 PDF" value={'25'} accent="#7c3aed" hint="9 家 × 年报 18 + 招股书 7" />
        <SummaryCard label="可比公司" value={'9'} accent="#0ea5e9" hint="A 股 8 + 港股 1 全部带实时财报" />
        <SummaryCard label="风险扫描" value={'5'} accent="#dc2626" hint="联影/旷视/字节/拼多多/暴风（暴雷）" />
      </section>

      <div className="space-y-5">
        {sources.map((s) => {
          const m = statusMeta[s.status]
          return (
            <article key={s.id} className="bg-white border border-ink-200 rounded-xl overflow-hidden">
              <header className="flex items-start justify-between gap-3 p-5 border-b border-ink-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-ink-900 text-white text-[12px] font-semibold flex items-center justify-center shrink-0 tracking-tight">
                    {s.shortName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-[16px] font-semibold tracking-tight">{s.name}</h2>
                      <span className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full ${m.bg} font-medium`} style={{ color: m.color }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.dot }} />
                        {m.label}
                      </span>
                    </div>
                    <div className="text-[12px] text-ink-500 mt-0.5">提供方：{s.vendor} · 最近验证：{s.lastVerified}</div>
                  </div>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-5 p-5 border-r border-ink-100">
                  <div className="text-[10px] tracking-wider uppercase text-ink-500 mb-2">能力清单</div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {s.capabilities.map((c) => (
                      <span key={c} className="text-[11px] px-2 py-0.5 bg-ink-50 border border-ink-200 rounded-full text-ink-700">{c}</span>
                    ))}
                  </div>
                  <div className="text-[10px] tracking-wider uppercase text-ink-500 mb-2">已加载工具</div>
                  <ul className="space-y-1.5">
                    {s.tools.map((t) => (
                      <li key={t.name} className="text-[12px]">
                        <code className="text-[11.5px] bg-ink-100 text-ink-800 px-1.5 py-0.5 rounded font-mono">{t.name}</code>
                        <span className="text-ink-600 ml-2">— {t.useCase}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-7 p-5 bg-gradient-to-br from-ink-50/50 to-white">
                  <div className="text-[10px] tracking-wider uppercase text-emerald-700 font-medium mb-1">实测样例</div>
                  <h3 className="text-[14px] font-semibold tracking-tight">{s.proofTitle}</h3>
                  <p className="text-[12.5px] text-ink-700 mt-1 leading-relaxed">{s.proofSummary}</p>

                  {s.proofRows && s.proofRows.length > 0 && (
                    <div className="mt-3 divide-y divide-ink-100 bg-white border border-ink-200 rounded-lg">
                      {s.proofRows.map((r, i) => (
                        <div key={i} className="grid grid-cols-[160px_1fr] gap-3 px-3 py-2 text-[12px]">
                          <div className="text-ink-500">{r.k}</div>
                          <div className="text-ink-900 num font-medium">{r.v}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {s.id === 'qcc-ipr' && s.proofData && (
                    <div className="mt-3 inline-flex items-center gap-2 text-[11px] text-ink-500 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded">
                      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-amber-700" fill="currentColor"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 4.25a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 018 4.25zM8 11a1 1 0 100-2 1 1 0 000 2z"/></svg>
                      原始 API 返回 434 条专利元数据，前 100 条已归档；本卡仅展示分类聚合
                    </div>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="mt-8 p-5 bg-gradient-to-br from-brand-50 via-white to-white border border-brand-500/20 rounded-xl">
        <div className="text-[10px] tracking-wider uppercase text-brand-700 font-medium">真实工作流（BP 上传后自动触发）</div>
        <ol className="mt-2 space-y-1.5 text-[13px] text-ink-800 leading-relaxed list-decimal list-inside marker:text-brand-700 marker:font-semibold">
          <li>解析 BP PDF/PPT，提取公司名 + 创始人 + 财务数据 + 专利声明 + TAM 数字 + 对标公司</li>
          <li>对每个声明触发对应信源：公司名 → 企查查工商；专利 → 企查查 IP；对标公司 → akshare；TAM → AutoGLM Deep Research；上市同行 → 巨潮年报；创始人 → 企查查 Risk</li>
          <li>所有抓回数据 vs BP 声明，按一致 / 部分对齐 / 偏差 / 待核 自动分级</li>
          <li>触发硬红线（数据造假 / 失信 / 严重处罚）→ 直接 Pass + 创始人风险标签入机构记忆库</li>
        </ol>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, accent, hint }: { label: string; value: string | number; accent: string; hint: string }) {
  return (
    <div className="bg-white border border-ink-200 rounded-xl p-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: accent }} />
      <div className="text-[11px] text-ink-500 tracking-wider uppercase">{label}</div>
      <div className="num font-semibold text-ink-900 text-[28px] tracking-tight mt-1">{value}</div>
      <div className="text-[11px] text-ink-500 mt-1 leading-relaxed">{hint}</div>
    </div>
  )
}
