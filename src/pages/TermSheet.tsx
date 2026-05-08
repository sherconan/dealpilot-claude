import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAllDeals } from '../lib/userDealStore'
import { REAL_DEALS } from '../data/realDeals'

interface TSConfig {
  dealId: string
  roundName: string
  totalRoundSize: string
  ourCheck: string
  preMoney: string
  postMoney: string
  liquidation: '1x-non-participating' | '1x-participating' | '2x-non-participating' | '2x-participating'
  antiDilution: 'broad-based-wa' | 'narrow-based-wa' | 'full-ratchet' | 'none'
  boardSeats: string
  observerSeats: string
  rofr: boolean
  tagAlong: boolean
  dragAlong: boolean
  autoConvertIpoSize: string
  esopPool: string
  protectiveProvisions: string[]
  closingDate: string
}

const LIQUIDATION_LABEL: Record<TSConfig['liquidation'], string> = {
  '1x-non-participating': '1x non-participating（标准早期）',
  '1x-participating': '1x participating（投资人友好）',
  '2x-non-participating': '2x non-participating（中后期偏激）',
  '2x-participating': '2x participating（投资人极度友好）',
}

const ANTI_DILUTION_LABEL: Record<TSConfig['antiDilution'], string> = {
  'broad-based-wa': 'Broad-Based Weighted Average（标准）',
  'narrow-based-wa': 'Narrow-Based Weighted Average',
  'full-ratchet': 'Full Ratchet（创始人不友好）',
  'none': '无反稀释',
}

const PROTECTIVE_OPTIONS = [
  '修改章程 / 公司治理结构',
  '增发优先股 / 普通股',
  '出售 / 合并公司',
  '债务超过 USD 5M',
  '关键高管聘任 / 解聘（CEO / CFO / CTO）',
  '年度预算审批',
  '业务方向重大变更',
  '回购 / 分红',
]

function buildMarkdown(d: any, c: TSConfig): string {
  const lines = [
    `# Term Sheet · 投资条款书`,
    ``,
    `**项目**：${d.name} · ${d.cnName}`,
    `**轮次**：${c.roundName}`,
    `**目标 Closing Date**：${c.closingDate}`,
    `**生成日期**：${new Date().toLocaleDateString('zh-CN')}`,
    ``,
    `> ⚠️ 本 Term Sheet 为协商起点（non-binding letter of intent except for sections marked binding），仅 No Shop / Confidentiality / Expense / Governing Law 条款具有约束力。`,
    ``,
    `## 1. 估值与出资（Valuation & Investment）`,
    ``,
    `| 项目 | 数额 |`,
    `|---|---|`,
    `| 本轮募资总额 | ${c.totalRoundSize} |`,
    `| 本基金出资 | ${c.ourCheck} |`,
    `| 投前估值（Pre-money） | ${c.preMoney} |`,
    `| 投后估值（Post-money） | ${c.postMoney} |`,
    `| 本基金本轮持股比例 | 按出资 / 投后估值算 |`,
    `| ESOP 期权池 | ${c.esopPool}（投前已扩） |`,
    ``,
    `## 2. 优先股权利（Preferred Stock Rights）`,
    ``,
    `### 2.1 清算优先权（Liquidation Preference）`,
    ``,
    `**${LIQUIDATION_LABEL[c.liquidation]}**`,
    ``,
    c.liquidation.includes('non-participating')
      ? `- 清算 / 出售 / 退出时，优先股投资人可选择：(a) 收回 ${c.liquidation.startsWith('1x') ? '1.0x' : '2.0x'} 投资本金后退出 OR (b) 按比例转换为普通股参与剩余分配，二者取其高。`
      : `- 清算 / 出售 / 退出时，优先股投资人先收回 ${c.liquidation.startsWith('1x') ? '1.0x' : '2.0x'} 投资本金，剩余金额再按比例与普通股共享分配。`,
    ``,
    `### 2.2 反稀释保护（Anti-Dilution）`,
    ``,
    `**${ANTI_DILUTION_LABEL[c.antiDilution]}**`,
    ``,
    c.antiDilution === 'broad-based-wa'
      ? `- 后续轮次 down round 时按"广义加权平均"调整转股价，公式涵盖所有已发行普通股 + 优先股 + 已授予期权。`
      : c.antiDilution === 'narrow-based-wa'
      ? `- 后续轮次 down round 时按"狭义加权平均"调整转股价，公式仅涵盖已发行优先股。`
      : c.antiDilution === 'full-ratchet'
      ? `- 后续轮次 down round 时优先股转股价直接重置为新轮发行价（创始人不友好）。`
      : `- 无反稀释保护。`,
    ``,
    `### 2.3 优先购买权（Pre-emptive Right / ROFR）`,
    ``,
    c.rofr ? `- 本基金对未来轮次按比例享有 First Refusal 权利，可优先按比例认购避免稀释。` : `- 无 ROFR 条款。`,
    ``,
    `### 2.4 共同出售权（Tag-Along） / 强制随售权（Drag-Along）`,
    ``,
    c.tagAlong ? `- **Tag-Along**：创始人转让股份时，本基金可按比例参与。` : `- 无 Tag-Along。`,
    ``,
    c.dragAlong ? `- **Drag-Along**：经持有 ≥ 50% 优先股的投资人 + 持有 ≥ 50% 普通股的创始人共同书面同意的并购 / IPO，可强制少数股东 / 创始人参与。` : `- 无 Drag-Along。`,
    ``,
    `### 2.5 自动转换条款（Auto Conversion）`,
    ``,
    `- 在以下情况下，优先股自动转为普通股：`,
    `  - **Qualified IPO**：IPO 募资规模 ≥ ${c.autoConvertIpoSize}（合格 IPO 自动触发）`,
    `  - 持有 ≥ 50% 优先股的投资人书面同意`,
    ``,
    `## 3. 公司治理（Corporate Governance）`,
    ``,
    `### 3.1 董事会`,
    ``,
    `- 董事会席位：本基金 ${c.boardSeats}` + ` 席${c.observerSeats ? ` + 观察员 ${c.observerSeats} 席` : ''}`,
    `- 董事会会议至少每季度召开一次。`,
    ``,
    `### 3.2 保护性条款（Protective Provisions）`,
    ``,
    `下述事项需经持有 ≥ 50% 优先股投资人书面同意：`,
    ``,
    ...c.protectiveProvisions.map(p => `- ${p}`),
    ``,
    `## 4. 信息权（Information Rights）`,
    ``,
    `- 月度财务报表（未审计）`,
    `- 季度财务 + 经营简报（含 KPI / 现金跑道）`,
    `- 年度审计财报 + 次年预算（每年 1 月）`,
    `- 任何时点：现场 / 远程访问公司账簿、合同、会议纪要的权利`,
    ``,
    `## 5. 创始人 / 关键员工锁定（Founder Vesting & Lock-up）`,
    ``,
    `- 创始人现有股份按 4 年 vesting + 1 年 cliff 重新归属（IPO 前未 vest 部分公司可回购）`,
    `- ESOP 期权池 ${c.esopPool}（投前已扩，给现有团队使用）`,
    `- 关键员工 (CTO / VP Eng / VP Sales) 服务期 ≥ 3 年，离职附 6 个月竞业限制`,
    ``,
    `## 6. 排他性 / 保密 / 费用（Exclusivity / Confidentiality / Expenses）`,
    ``,
    `- **No Shop（具有约束力）**：自签署起 60 日内，公司不得与第三方开展融资接触。`,
    `- **Confidentiality（具有约束力）**：双方对本 Term Sheet 内容及尽调材料保密。`,
    `- **Expenses（具有约束力）**：法律 / 尽调 / 财务顾问费用上限 USD 100,000，由公司承担。`,
    `- **Governing Law（具有约束力）**：${c.dealId.includes('moonshot') || c.dealId.includes('zhipu') || c.dealId.includes('deepseek') ? '中国法律 / 北京 / CIETAC 仲裁' : '英国法律 / 香港 / HKIAC 仲裁'}（视具体交易设计）`,
    ``,
    `---`,
    ``,
    `> 本 Term Sheet 由 DealPilot 自动起草，基于 ${d.name}（${d.cnName}）${d.round} 轮基础信息。`,
    `> 实际签署前请由律师审核所有条款，特别是估值、清算、董事会、保护性条款的精确措辞。`,
  ]
  return lines.join('\n')
}

export default function TermSheet() {
  const allDeals = useAllDeals()
  const today = new Date()
  const closingDefault = new Date(today.getTime() + 60 * 86400000).toISOString().slice(0, 10)

  const [config, setConfig] = useState<TSConfig>({
    dealId: 'moonshot-a2',
    roundName: 'Series A2 优先股',
    totalRoundSize: '$300M',
    ourCheck: '$50M',
    preMoney: '$3,000M',
    postMoney: '$3,300M',
    liquidation: '1x-non-participating',
    antiDilution: 'broad-based-wa',
    boardSeats: '1',
    observerSeats: '1',
    rofr: true,
    tagAlong: true,
    dragAlong: true,
    autoConvertIpoSize: 'USD 100M',
    esopPool: '12%',
    protectiveProvisions: [...PROTECTIVE_OPTIONS],
    closingDate: closingDefault,
  })

  // 当 deal 切换时自动同步关键字段
  useEffect(() => {
    const d = allDeals.find(x => x.id === config.dealId)
    if (!d) return
    setConfig(c => ({
      ...c,
      roundName: `${d.round} 优先股`,
      totalRoundSize: d.id === 'moonshot-a2' ? '$300M' : d.id === 'zhipu-bplus' ? '¥30亿' : d.id === 'deepseek-preb' ? '$300M（建议老股）' : d.askAmount,
      ourCheck: d.askAmount,
      preMoney: d.id === 'moonshot-a2' ? '$3,000M' : d.id === 'zhipu-bplus' ? '¥170亿' : d.id === 'deepseek-preb' ? '$4,700M' : d.valuation,
      postMoney: d.id === 'moonshot-a2' ? '$3,300M' : d.id === 'zhipu-bplus' ? '¥200亿' : d.id === 'deepseek-preb' ? '$5,000M' : d.valuation,
    }))
  }, [config.dealId, allDeals])

  useEffect(() => { document.title = 'Term Sheet 起草 · DealPilot' }, [])

  const deal = allDeals.find(d => d.id === config.dealId)
  const md = useMemo(() => deal ? buildMarkdown(deal, config) : '', [deal, config])

  function copy() {
    navigator.clipboard.writeText(md)
  }
  function download() {
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `term-sheet-${config.dealId}-${new Date().toISOString().slice(0, 10)}.md`
    a.click()
    URL.revokeObjectURL(url)
  }
  function toggleProtective(p: string) {
    setConfig(c => ({
      ...c,
      protectiveProvisions: c.protectiveProvisions.includes(p)
        ? c.protectiveProvisions.filter(x => x !== p)
        : [...c.protectiveProvisions, p],
    }))
  }

  return (
    <div className="px-4 md:px-8 py-6 max-w-[1400px] mx-auto">
      <header className="mb-5">
        <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">Term Sheet · Drafting</div>
        <h1 className="text-[26px] font-semibold tracking-tight mt-1">Term Sheet 起草</h1>
        <p className="text-[13.5px] text-ink-700 mt-1.5 max-w-3xl leading-relaxed">
          基于真实公开公司决策包数据，自动起草标准 NVCA 早期 Series 优先股 Term Sheet 草稿。
          含估值 / 清算 / 反稀释 / 董事会 / 保护性条款 / vesting 完整体例 — 实际签署需律师审核。
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 配置区 */}
        <section className="bg-white border border-ink-200 rounded-xl p-5 space-y-4">
          <h2 className="text-[14px] font-semibold text-ink-900">配置条款</h2>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-ink-500 block mb-1.5">选择 Deal</label>
            <select
              value={config.dealId}
              onChange={(e) => setConfig(c => ({ ...c, dealId: e.target.value }))}
              className="w-full text-[13px] bg-white border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            >
              <optgroup label="🟢 真实公开公司">
                {REAL_DEALS.map(d => (
                  <option key={d.id} value={d.id}>{d.name} · {d.cnName} ({d.round} · {d.valuation})</option>
                ))}
              </optgroup>
              <optgroup label="演示项目（虚构）">
                {allDeals.filter(d => !REAL_DEALS.some(r => r.id === d.id)).map(d => (
                  <option key={d.id} value={d.id}>{d.name} · {d.cnName} ({d.round})</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-ink-500 block mb-1.5">轮次名称</label>
              <input value={config.roundName} onChange={(e) => setConfig(c => ({ ...c, roundName: e.target.value }))} className="w-full text-[13px] bg-white border border-ink-200 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-ink-500 block mb-1.5">本轮总额</label>
              <input value={config.totalRoundSize} onChange={(e) => setConfig(c => ({ ...c, totalRoundSize: e.target.value }))} className="w-full text-[13px] bg-white border border-ink-200 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-ink-500 block mb-1.5">本基金出资</label>
              <input value={config.ourCheck} onChange={(e) => setConfig(c => ({ ...c, ourCheck: e.target.value }))} className="w-full text-[13px] bg-white border border-ink-200 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-ink-500 block mb-1.5">ESOP 池</label>
              <input value={config.esopPool} onChange={(e) => setConfig(c => ({ ...c, esopPool: e.target.value }))} className="w-full text-[13px] bg-white border border-ink-200 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-ink-500 block mb-1.5">投前估值</label>
              <input value={config.preMoney} onChange={(e) => setConfig(c => ({ ...c, preMoney: e.target.value }))} className="w-full text-[13px] bg-white border border-ink-200 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-ink-500 block mb-1.5">投后估值</label>
              <input value={config.postMoney} onChange={(e) => setConfig(c => ({ ...c, postMoney: e.target.value }))} className="w-full text-[13px] bg-white border border-ink-200 rounded-lg px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-ink-500 block mb-1.5">清算优先权</label>
            <select value={config.liquidation} onChange={(e) => setConfig(c => ({ ...c, liquidation: e.target.value as TSConfig['liquidation'] }))} className="w-full text-[13px] bg-white border border-ink-200 rounded-lg px-3 py-2">
              {Object.entries(LIQUIDATION_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-ink-500 block mb-1.5">反稀释</label>
            <select value={config.antiDilution} onChange={(e) => setConfig(c => ({ ...c, antiDilution: e.target.value as TSConfig['antiDilution'] }))} className="w-full text-[13px] bg-white border border-ink-200 rounded-lg px-3 py-2">
              {Object.entries(ANTI_DILUTION_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-ink-500 block mb-1.5">董事席位</label>
              <input value={config.boardSeats} onChange={(e) => setConfig(c => ({ ...c, boardSeats: e.target.value }))} className="w-full text-[13px] bg-white border border-ink-200 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-ink-500 block mb-1.5">观察员</label>
              <input value={config.observerSeats} onChange={(e) => setConfig(c => ({ ...c, observerSeats: e.target.value }))} className="w-full text-[13px] bg-white border border-ink-200 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-ink-500 block mb-1.5">合格 IPO 规模</label>
              <input value={config.autoConvertIpoSize} onChange={(e) => setConfig(c => ({ ...c, autoConvertIpoSize: e.target.value }))} className="w-full text-[13px] bg-white border border-ink-200 rounded-lg px-3 py-2" />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-[12px]">
            <label className="inline-flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={config.rofr} onChange={(e) => setConfig(c => ({ ...c, rofr: e.target.checked }))} /> ROFR 优先购买权</label>
            <label className="inline-flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={config.tagAlong} onChange={(e) => setConfig(c => ({ ...c, tagAlong: e.target.checked }))} /> Tag-Along 共同出售</label>
            <label className="inline-flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={config.dragAlong} onChange={(e) => setConfig(c => ({ ...c, dragAlong: e.target.checked }))} /> Drag-Along 强制随售</label>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-ink-500 block mb-1.5">保护性条款（投资人需同意才可执行）</label>
            <div className="space-y-1">
              {PROTECTIVE_OPTIONS.map(p => (
                <label key={p} className="flex items-center gap-2 text-[12px] cursor-pointer">
                  <input type="checkbox" checked={config.protectiveProvisions.includes(p)} onChange={() => toggleProtective(p)} />
                  {p}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-ink-500 block mb-1.5">目标 Closing Date</label>
            <input type="date" value={config.closingDate} onChange={(e) => setConfig(c => ({ ...c, closingDate: e.target.value }))} className="w-full text-[13px] bg-white border border-ink-200 rounded-lg px-3 py-2" />
          </div>
        </section>

        {/* 预览区 */}
        <section className="bg-white border border-ink-200 rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-semibold text-ink-900">Term Sheet 预览（Markdown）</h2>
            <div className="flex items-center gap-2">
              <button onClick={copy} className="px-3 py-1.5 text-[12px] rounded-lg border border-ink-200 hover:bg-ink-50">📋 复制</button>
              <button onClick={download} className="px-3 py-1.5 text-[12px] rounded-lg bg-brand-700 text-white hover:bg-brand-800">⬇ 下载 .md</button>
            </div>
          </div>
          {!deal && <div className="text-[12px] text-rose-600">未找到 deal，请重新选择</div>}
          {deal && (
            <pre className="flex-1 text-[11.5px] leading-relaxed bg-ink-50 border border-ink-100 rounded-lg p-4 overflow-auto max-h-[800px] whitespace-pre-wrap font-mono text-ink-800">
              {md}
            </pre>
          )}
        </section>
      </div>

      <footer className="mt-6 text-[11px] text-ink-500 leading-relaxed">
        <div>⚠️ 本 Term Sheet 起草工具基于 NVCA 标准模板适配 + 中国早期股权交易实践。</div>
        <div>所有条款均为协商起点，签署前必须由律师审核。DealPilot 不承担法律责任。</div>
        <div className="mt-2">
          数据来源：<Link to={`/deal/${config.dealId}`} className="text-brand-700 hover:underline">{deal?.name} 项目详情</Link> / <Link to={`/deal/${config.dealId}/decision-pack`} className="text-emerald-700 hover:underline">30 分钟决策包</Link>
        </div>
      </footer>
    </div>
  )
}
