import { useState } from 'react'
import { Link } from 'react-router-dom'
import { deals } from '../data/deals'

export default function Briefings() {
  const [shared, setShared] = useState(false)
  const top3 = [...deals].sort((a, b) => b.score - a.score).slice(0, 3)
  const passed = deals.filter((d) => d.recommendation === 'pass').length
  const onIC = deals.filter((d) => d.stage === 'ic').length

  function copyLink() {
    navigator.clipboard.writeText(window.location.href)
    setShared(true)
    setTimeout(() => setShared(false), 2200)
  }

  return (
    <div className="px-8 py-6 max-w-[1100px] mx-auto">
      <header className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">Weekly Brief · 2026 W17</div>
          <h1 className="text-[26px] font-semibold tracking-tight mt-1">基金周报</h1>
          <p className="text-[13.5px] text-ink-700 mt-1.5 max-w-3xl leading-relaxed">
            2026-04-22 至 2026-04-28 · 自动汇总 Pipeline + Signals + Portfolio + Memory
          </p>
        </div>
        <div className="flex items-center gap-2 no-print">
          <button onClick={copyLink} className="px-3.5 py-2 text-[13px] rounded-lg border border-ink-200 bg-white hover:bg-ink-50">
            {shared ? '已复制 ✓' : '分享链接'}
          </button>
          <button onClick={() => window.print()} className="px-3.5 py-2 text-[13px] rounded-lg bg-brand-700 text-white hover:bg-brand-800">导出 PDF</button>
        </div>
      </header>

      <article className="bg-white border border-ink-200 rounded-2xl p-8 shadow-card space-y-7">
        <Section num="1" title="一句话提要">
          <p className="text-[14.5px] text-ink-800 leading-relaxed">
            本周 NebulaAI 进入 IC（4/26 待表决），同期监控到 <b>1 项硬红线</b>（CryptoVault 创始人前公司被 SFC 公告）和 <b>2 项软扣分项</b>（GreenLogistics 客户集中度上升、MetaMed NMPA 进度滞后）；投后组合 Lumen AI MoM 38% 维持强劲，Orbit Logistics 跑道告急（9 月）需立即 GP 介入。
          </p>
        </Section>

        <Section num="2" title="本周决策池">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="新入箱" value="14" delta="+2 vs 上周" pos />
            <Stat label="进入跟进" value="3" delta="+1" pos />
            <Stat label="进入 IC" value={`${onIC}`} delta="本周新增 1" pos />
            <Stat label="已 Pass" value={`${passed}`} delta="标准化存档" />
          </div>
        </Section>

        <Section num="3" title="Top 3 优先项目">
          <div className="space-y-3">
            {top3.map((d, i) => (
              <Link key={d.id} to={`/deal/${d.id}`} className="flex items-start gap-3 p-3 border border-ink-200 rounded-xl hover:bg-ink-50 transition">
                <div className="num w-7 h-7 rounded-full bg-brand-700 text-white text-[12px] font-medium flex items-center justify-center shrink-0">#{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[14px]">{d.name}</span>
                    <span className="text-[11px] text-ink-500">{d.cnName} · {d.sector} · {d.round}</span>
                    <span className="num text-[13px] font-semibold ml-auto" style={{ color: d.accentColor }}>{d.score}</span>
                  </div>
                  <div className="text-[12px] text-ink-700 mt-1 line-clamp-2">{d.tagline}</div>
                  <div className="text-[11px] text-ink-500 mt-1">推荐：{d.wins[0]}</div>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        <Section num="4" title="本周关键信号">
          <ul className="space-y-2 text-[13px] text-ink-800 leading-relaxed">
            <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-[7px] shrink-0" /><span><b>[紧急]</b> CryptoVault 创始人 Alex Zhou 前公司被 SFC 公告确认未持牌经营，强化诚信硬红线 — 已写入机构记忆库创始人风险标签</span></li>
            <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-[7px] shrink-0" /><span><b>[高]</b> NebulaAI 创始人本周新增 2 名前 Anthropic 工程师 + GitHub agent-kernel repo 新版 — 疑似 Series A close 前的产品里程碑</span></li>
            <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-[7px] shrink-0" /><span><b>[高]</b> 菜鸟冷链供应商扩容公告 — GreenLogistics Top 1 客户份额可能稀释，集中度风险加剧</span></li>
            <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-[7px] shrink-0" /><span><b>[中]</b> NeoBank 印尼 OJK 牌照进入实质审查最后阶段，与 BP 时间线吻合</span></li>
            <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-[7px] shrink-0" /><span><b>[中]</b> MetaMed NMPA 注册进入第二轮补正，时间线略晚于 BP 预测</span></li>
          </ul>
        </Section>

        <Section num="5" title="投后组合健康度">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <KPI label="累计 TVPI" value="2.56x" hint="账面 + 已分配 / 投入" color="#0f766e" />
            <KPI label="季度 IRR" value="38.4%" hint="年化" color="#059669" />
            <KPI label="跑道告急" value="1 家" hint="< 12 月" color="#dc2626" />
          </div>
          <ul className="space-y-1.5 text-[13px] text-ink-800 leading-relaxed">
            <li>· <b>Lumen AI</b>（已投）MoM 38% 持续 6 个月，建议在 Series B 启动前协调 LP 加注配额</li>
            <li>· <b>Pulse Finance</b>（已投）Product Hunt 当日 Top 3 + 12k 注册增长</li>
            <li>· <b>Orbit Logistics</b>（已投）跑道剩余 9 个月，建议本周内召开紧急 GP 会议讨论桥贷或战略并购</li>
          </ul>
        </Section>

        <Section num="6" title="下周聚焦">
          <ol className="list-decimal list-inside marker:text-brand-700 marker:font-semibold space-y-1.5 text-[13px] text-ink-800 leading-relaxed">
            <li>4/30 IC 表决 NebulaAI — 主要辩论估值与硬件成本规模化曲线</li>
            <li>5/2 Orbit Logistics GP 紧急会议 — 决定桥贷 vs 战略退出</li>
            <li>5/3 MetaMed 合伙人会议 — 第二轮 NMPA 补正方案讨论</li>
            <li>本周完成 4 家创始人 reference check（Lumen AI Series B 准备）</li>
            <li>更新 Thesis Alignment 评分模型 — 加入 ESG 合规权重 6%</li>
          </ol>
        </Section>

        <div className="text-[11px] text-ink-400 pt-4 border-t border-ink-100 flex items-center justify-between">
          <span>由 DealPilot 自动生成 · 数据来源：Pipeline + Signals + Portfolio + Memory</span>
          <span>Henry Zhao · Partner</span>
        </div>
      </article>
    </div>
  )
}

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-[16px] font-semibold tracking-tight mb-3 flex items-center gap-2 text-ink-900">
        <span className="num w-6 h-6 rounded bg-brand-700 text-white text-[11px] flex items-center justify-center">{num}</span>
        {title}
      </h3>
      {children}
    </section>
  )
}

function Stat({ label, value, delta, pos }: { label: string; value: string; delta: string; pos?: boolean }) {
  return (
    <div className="bg-ink-50 border border-ink-200/70 rounded-xl p-3">
      <div className="text-[10px] text-ink-500 tracking-wider uppercase">{label}</div>
      <div className="num font-semibold text-[20px] tracking-tight mt-1">{value}</div>
      <div className={`text-[10px] num mt-0.5 ${pos ? 'text-emerald-700' : 'text-ink-500'}`}>{delta}</div>
    </div>
  )
}

function KPI({ label, value, hint, color }: { label: string; value: string; hint: string; color: string }) {
  return (
    <div className="bg-white border border-ink-200 rounded-xl p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: color }} />
      <div className="text-[10px] text-ink-500 tracking-wider uppercase">{label}</div>
      <div className="num font-semibold text-[20px] tracking-tight mt-1" style={{ color }}>{value}</div>
      <div className="text-[10px] text-ink-500 mt-0.5">{hint}</div>
    </div>
  )
}
