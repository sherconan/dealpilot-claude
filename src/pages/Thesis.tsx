import { useState } from 'react'
import { thesisChecks } from '../lib/scoring'

const gates = [
  { title: '市场规模阈值', value: 'SAM ≥ $5B（第三方数据源）', active: true, kind: 'hard' },
  { title: '技术壁垒', value: '有可验证的专利 / 数据 / 网络效应护城河', active: true, kind: 'hard' },
  { title: '收入证据', value: '有真实付费客户（非 LOI / Pilot）', active: true, kind: 'hard' },
  { title: 'AI 原生', value: '产品核心价值由 AI 直接产生', active: true, kind: 'hard' },
  { title: 'ESG 合规', value: '无高碳、高监管领域暴露', active: true, kind: 'hard' },
  { title: '地缘合规', value: '不涉及中美双向管制清单', active: true, kind: 'hard' },
]

const scoringWeights = [
  { group: '赛道吸引力', items: [
    { k: '市场规模 TAM', w: 8 },
    { k: '市场增速 CAGR', w: 7 },
    { k: '政策支持度', w: 5 },
  ]},
  { group: '团队质量', items: [
    { k: '创始人经验深度', w: 10 },
    { k: '团队完整性', w: 8 },
    { k: '历史成功记录', w: 7 },
    { k: '团队稳定性', w: 5 },
  ]},
  { group: '商业模式', items: [
    { k: '收入模型清晰度', w: 8 },
    { k: '单位经济学', w: 7 },
    { k: '护城河宽度', w: 8 },
  ]},
  { group: '增长动能', items: [
    { k: 'Traction 证据', w: 10 },
    { k: '客户留存 NRR', w: 5 },
  ]},
  { group: '估值与条款', items: [
    { k: '估值合理性', w: 7 },
    { k: '退出可见度', w: 5 },
  ]},
]

export default function Thesis() {
  const [editing, setEditing] = useState(false)

  return (
    <div className="px-8 py-6 max-w-[1200px] mx-auto">
      <header className="flex items-end justify-between mb-5 gap-4 flex-wrap">
        <div>
          <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">Investment Thesis · Alignment Engine</div>
          <h1 className="text-[24px] font-semibold tracking-tight mt-1">投资论点与评分模型</h1>
          <p className="text-[13px] text-ink-600 mt-1.5">定义机构投资偏好，AI 依据此对所有 BP 进行 Thesis Alignment 打分</p>
        </div>
        <button onClick={() => setEditing(!editing)} className="px-3.5 py-2 text-[13px] rounded-lg bg-brand-700 text-white hover:bg-brand-800">
          {editing ? '保存变更' : '编辑论点'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="bg-white border border-ink-200 rounded-xl p-5">
          <h2 className="text-[15px] font-semibold tracking-tight mb-1">一、机构投资信念（One-Liner）</h2>
          <p className="text-[12px] text-ink-500 mb-3">这一段会出现在每份 IC Memo 的开头</p>
          <div className="bg-gradient-to-br from-brand-50 to-white border border-brand-500/20 rounded-lg p-4 text-[13px] leading-relaxed text-ink-800">
            <b>我们相信：</b>AI 原生的、具备深度领域 know-how 的创始人，将在 2026–2030 年重写企业软件 / 金融科技 / 医疗 / 物流 的价值链。我们偏爱能把"分布式模型能力"组织成可规模化、可收费、可形成数据飞轮的团队，<b>早期赌人，成长期验证单位经济学</b>。
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-[12px]">
            <div className="border border-ink-200 rounded-md px-3 py-2">
              <div className="text-ink-500 text-[11px]">阶段</div>
              <div className="font-medium mt-0.5">Seed – Series B</div>
            </div>
            <div className="border border-ink-200 rounded-md px-3 py-2">
              <div className="text-ink-500 text-[11px]">单笔金额</div>
              <div className="font-medium mt-0.5 num">$3M – $40M</div>
            </div>
            <div className="border border-ink-200 rounded-md px-3 py-2">
              <div className="text-ink-500 text-[11px]">目标回报</div>
              <div className="font-medium mt-0.5 num">10x+ MOIC</div>
            </div>
          </div>
        </section>

        <section className="bg-white border border-ink-200 rounded-xl p-5">
          <h2 className="text-[15px] font-semibold tracking-tight mb-1">二、硬性门槛（Hard Gates）</h2>
          <p className="text-[12px] text-ink-500 mb-3">不满足直接淘汰 · 不参与评分</p>
          <div className="space-y-2">
            {gates.map((g) => (
              <div key={g.title} className="flex items-center gap-3 border border-ink-200 rounded-md px-3 py-2.5">
                <div className="w-5 h-5 rounded bg-rose-600 flex items-center justify-center text-white text-[10px] shrink-0">H</div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium">{g.title}</div>
                  <div className="text-[11px] text-ink-500 mt-0.5">{g.value}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" defaultChecked={g.active} className="sr-only peer" />
                  <div className="w-9 h-5 bg-ink-200 peer-checked:bg-brand-700 rounded-full transition relative after:absolute after:top-0.5 after:left-0.5 after:bg-white after:w-4 after:h-4 after:rounded-full after:transition peer-checked:after:translate-x-4" />
                </label>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-2 bg-white border border-ink-200 rounded-xl p-5">
          <h2 className="text-[15px] font-semibold tracking-tight mb-1">三、Scorecard 评分权重（100 分制）</h2>
          <p className="text-[12px] text-ink-500 mb-3">基于 VC 通用框架 · 可按需调整各维度权重</p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {scoringWeights.map((g) => {
              const total = g.items.reduce((s, i) => s + i.w, 0)
              return (
                <div key={g.group} className="bg-ink-50 border border-ink-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[13px] font-semibold">{g.group}</div>
                    <div className="num text-[11px] text-brand-700 font-medium">{total}%</div>
                  </div>
                  <div className="space-y-2">
                    {g.items.map((it) => (
                      <div key={it.k}>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-ink-700">{it.k}</span>
                          <span className="num text-ink-900 font-medium">{it.w}%</span>
                        </div>
                        <div className="h-1 bg-white rounded-full mt-1 overflow-hidden">
                          <div className="h-full rounded-full bg-brand-700" style={{ width: `${it.w * 5}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="lg:col-span-2 bg-white border border-ink-200 rounded-xl p-5">
          <h2 className="text-[15px] font-semibold tracking-tight mb-1">四、分级判定规则</h2>
          <p className="text-[12px] text-ink-500 mb-3">总分区间 → 推荐行动</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              { range: '80 – 100', label: '优先推进', action: '排入最近 IC / 锁定份额', color: '#0f766e', bg: 'bg-brand-50' },
              { range: '65 – 79', label: '持续观察', action: '深度行研 + 季度回访', color: '#2563eb', bg: 'bg-sky-50' },
              { range: '50 – 64', label: '有条件跟进', action: '指出关键门槛，让团队改进再评', color: '#d97706', bg: 'bg-amber-50' },
              { range: '< 50', label: '建议 Pass', action: '机构记忆库存档 + 创始人标签', color: '#dc2626', bg: 'bg-rose-50' },
            ].map((r) => (
              <div key={r.label} className={`border border-ink-200 rounded-lg p-4 ${r.bg}`}>
                <div className="num text-[18px] font-semibold" style={{ color: r.color }}>{r.range}</div>
                <div className="text-[13px] font-semibold mt-1" style={{ color: r.color }}>{r.label}</div>
                <div className="text-[11px] text-ink-600 mt-1 leading-relaxed">{r.action}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
