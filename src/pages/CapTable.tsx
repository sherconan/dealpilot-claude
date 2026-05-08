import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAllDeals } from '../lib/userDealStore'
import { REAL_DEALS } from '../data/realDeals'

interface Holder {
  id: string
  name: string
  type: 'founder' | 'employee' | 'investor' | 'esop' | 'fund'
  preShares: number
  invested?: string
}

interface NewRound {
  name: string
  amountUSDm: number      // 本轮募资金额（百万 USD）
  preMoneyUSDm: number    // 投前估值
  fundCheckUSDm: number   // 本基金出资
  esopTopUpPct: number    // 本轮前 ESOP 池扩到多少（%）
}

const PRESETS: Record<string, { holders: Holder[]; round: NewRound }> = {
  'moonshot-a2': {
    holders: [
      { id: 'f-yang', name: '杨植麟（CEO）', type: 'founder', preShares: 28000000, invested: '原始' },
      { id: 'f-zhou', name: '周昕宇（CTO）', type: 'founder', preShares: 11000000, invested: '原始' },
      { id: 'f-wu', name: '吴育昕（首席科学家）', type: 'founder', preShares: 11000000, invested: '原始' },
      { id: 'esop-existing', name: 'ESOP（现有）', type: 'esop', preShares: 10000000 },
      { id: 'inv-seed', name: '红杉中国 / 真格 / 砺思（天使）', type: 'investor', preShares: 8000000, invested: '$2亿' },
      { id: 'inv-a1', name: '阿里 / 红杉 / 小红书 / 美团（A1）', type: 'investor', preShares: 22000000, invested: '$10亿' },
      { id: 'inv-a2-existing', name: '老股东 A2 追投', type: 'investor', preShares: 0, invested: '$2.5亿（A2 部分）' },
    ],
    round: { name: 'A2 优先股', amountUSDm: 50, preMoneyUSDm: 3000, fundCheckUSDm: 50, esopTopUpPct: 12 },
  },
  'zhipu-bplus': {
    holders: [
      { id: 'f-tang', name: '唐杰（CEO）', type: 'founder', preShares: 24000000, invested: '原始 + 学校转让' },
      { id: 'f-zhang', name: '张鹏（CTO）', type: 'founder', preShares: 8000000 },
      { id: 'f-chen', name: '陈征（总裁）', type: 'founder', preShares: 6000000 },
      { id: 'esop-existing', name: 'ESOP（现有 10%）', type: 'esop', preShares: 10000000 },
      { id: 'inv-tsinghua', name: '清华校友 / 启迪之星（天使）', type: 'investor', preShares: 5000000 },
      { id: 'inv-a', name: '中关村金种子 / 启明（A 轮）', type: 'investor', preShares: 12000000, invested: '¥30亿估值' },
      { id: 'inv-b', name: '阿里 / 蚂蚁 / 腾讯 / 美团（B 轮）', type: 'investor', preShares: 20000000, invested: '¥80亿估值' },
      { id: 'inv-bplus-existing', name: '中关村自创 / 社保 / 君联 / 高瓴（B+）', type: 'investor', preShares: 0, invested: '¥30亿（本轮）' },
    ],
    round: { name: 'B+ 优先股', amountUSDm: 42, preMoneyUSDm: 2380, fundCheckUSDm: 21, esopTopUpPct: 12 },
  },
  'deepseek-preb': {
    holders: [
      { id: 'f-liang', name: '梁文锋（CEO）', type: 'founder', preShares: 35000000, invested: '原始 + 幻方关联' },
      { id: 'f-other', name: '其他联合创始团队', type: 'founder', preShares: 15000000 },
      { id: 'esop-existing', name: 'ESOP（现有）', type: 'esop', preShares: 8000000 },
      { id: 'inv-fan', name: '幻方量化（关联）', type: 'investor', preShares: 35000000, invested: '资金 + 算力' },
      { id: 'inv-secondary', name: '本基金（建议老股 / 战略股）', type: 'fund', preShares: 0, invested: '$30M（建议）' },
    ],
    round: { name: 'Pre-B（老股 / 战略）', amountUSDm: 30, preMoneyUSDm: 5000, fundCheckUSDm: 30, esopTopUpPct: 8 },
  },
}

function fmtPct(n: number) { return `${(n * 100).toFixed(2)}%` }
function fmtNum(n: number) { return n.toLocaleString() }

export default function CapTable() {
  const allDeals = useAllDeals()
  const [dealId, setDealId] = useState<string>('moonshot-a2')
  const preset = PRESETS[dealId] || PRESETS['moonshot-a2']
  const [holders, setHolders] = useState<Holder[]>(preset.holders)
  const [round, setRound] = useState<NewRound>(preset.round)

  useEffect(() => {
    document.title = 'Cap Table 模拟器 · DealPilot'
    const p = PRESETS[dealId]
    if (p) {
      setHolders(p.holders)
      setRound(p.round)
    }
  }, [dealId])

  const calc = useMemo(() => {
    const totalPreShares = holders.reduce((s, h) => s + h.preShares, 0) || 1
    const pricePerShare = (round.preMoneyUSDm * 1_000_000) / totalPreShares
    const newRoundShares = (round.amountUSDm * 1_000_000) / pricePerShare
    const fundShares = (round.fundCheckUSDm * 1_000_000) / pricePerShare
    const otherInvestorShares = newRoundShares - fundShares

    // ESOP top-up：本轮前把 ESOP 扩到目标百分比
    // 目标后：esop / postTotal = esopTopUpPct/100
    // ESOP 池数 = (esopExisting + topUpShares) → 解 topUpShares
    const esopExistingShares = holders.filter(h => h.type === 'esop').reduce((s, h) => s + h.preShares, 0)
    // 投后总股数（含新轮 + topUp）
    // postTotal = totalPre + newRoundShares + topUpShares
    // (esopExisting + topUpShares) / postTotal = pct
    // pct * postTotal = esopExisting + topUpShares
    // pct * (totalPre + newRoundShares + topUpShares) = esopExisting + topUpShares
    // pct*totalPre + pct*newRoundShares + pct*topUp = esopExisting + topUp
    // topUp * (1 - pct) = esopExisting - pct*(totalPre + newRoundShares)
    // topUp = (esopExisting - pct*(totalPre + newRoundShares)) / (pct - 1)
    const targetEsopPct = round.esopTopUpPct / 100
    let topUpShares = 0
    if (targetEsopPct > 0 && targetEsopPct < 1) {
      topUpShares = Math.max(
        0,
        (targetEsopPct * (totalPreShares + newRoundShares) - esopExistingShares) / (1 - targetEsopPct),
      )
    }

    const postTotalShares = totalPreShares + newRoundShares + topUpShares

    const rows = [
      ...holders.map(h => ({
        ...h,
        prePct: h.preShares / totalPreShares,
        postShares: h.type === 'esop' ? h.preShares + topUpShares : h.preShares,
        postPct: (h.type === 'esop' ? h.preShares + topUpShares : h.preShares) / postTotalShares,
      })),
      // 本基金行（占用 fundShares）
      {
        id: 'new-fund',
        name: '✨ 本基金（本轮）',
        type: 'fund' as const,
        preShares: 0,
        prePct: 0,
        postShares: fundShares,
        postPct: fundShares / postTotalShares,
        invested: `$${round.fundCheckUSDm}M`,
      },
      // 其他新投资人
      ...(otherInvestorShares > 0
        ? [{
            id: 'new-others',
            name: '其他新投资人（本轮）',
            type: 'investor' as const,
            preShares: 0,
            prePct: 0,
            postShares: otherInvestorShares,
            postPct: otherInvestorShares / postTotalShares,
            invested: `$${(round.amountUSDm - round.fundCheckUSDm).toFixed(0)}M`,
          }]
        : []),
    ]

    // 按 postPct 倒序
    rows.sort((a, b) => b.postPct - a.postPct)

    const founderPostPct = rows.filter(r => r.type === 'founder').reduce((s, r) => s + r.postPct, 0)
    const esopPostPct = rows.filter(r => r.type === 'esop').reduce((s, r) => s + r.postPct, 0)
    const investorPostPct = rows.filter(r => r.type === 'investor' || r.type === 'fund').reduce((s, r) => s + r.postPct, 0)
    const founderPrePct = rows.filter(r => r.type === 'founder').reduce((s, r) => s + r.prePct, 0)
    const founderDilution = founderPrePct - founderPostPct

    return {
      totalPreShares, postTotalShares,
      pricePerShare, newRoundShares, fundShares, otherInvestorShares, topUpShares,
      rows, founderPostPct, esopPostPct, investorPostPct, founderPrePct, founderDilution,
    }
  }, [holders, round])

  const colorByType: Record<Holder['type'], string> = {
    founder: '#0EA5E9',
    employee: '#14B8A6',
    investor: '#A855F7',
    esop: '#F59E0B',
    fund: '#10B981',
  }

  return (
    <div className="px-4 md:px-8 py-6 max-w-[1400px] mx-auto">
      <header className="mb-5">
        <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">Cap Table · Dilution Simulator</div>
        <h1 className="text-[26px] font-semibold tracking-tight mt-1">Cap Table 模拟器</h1>
        <p className="text-[13.5px] text-ink-700 mt-1.5 max-w-3xl leading-relaxed">
          基于真实公开公司 + 本轮交易设计，模拟创始人 / 投资人 / ESOP 投前投后股权分布与稀释。
          ESOP 池按"本轮前扩到目标比例"计算（标准 NVCA 实践）。
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 控制 */}
        <section className="lg:col-span-4 bg-white border border-ink-200 rounded-xl p-4 space-y-4">
          <h2 className="text-[14px] font-semibold text-ink-900">参数</h2>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-ink-500 block mb-1.5">选择 Deal</label>
            <select value={dealId} onChange={(e) => setDealId(e.target.value)} className="w-full text-[13px] bg-white border border-ink-200 rounded-lg px-3 py-2">
              {Object.keys(PRESETS).map(id => {
                const d = REAL_DEALS.find(x => x.id === id) || allDeals.find(x => x.id === id)
                return <option key={id} value={id}>🟢 {d?.name || id} · {d?.cnName || ''} ({d?.round || ''})</option>
              })}
            </select>
            <div className="text-[10.5px] text-ink-400 mt-1">仅真实公开公司有 preset；其他 deal 走 termsheet 页起草</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-ink-500 block mb-1">本轮募资 ($M)</label>
              <input type="number" value={round.amountUSDm} onChange={(e) => setRound(r => ({ ...r, amountUSDm: parseFloat(e.target.value) || 0 }))} className="w-full text-[13px] bg-white border border-ink-200 rounded-lg px-3 py-1.5" />
            </div>
            <div>
              <label className="text-[11px] text-ink-500 block mb-1">投前估值 ($M)</label>
              <input type="number" value={round.preMoneyUSDm} onChange={(e) => setRound(r => ({ ...r, preMoneyUSDm: parseFloat(e.target.value) || 0 }))} className="w-full text-[13px] bg-white border border-ink-200 rounded-lg px-3 py-1.5" />
            </div>
            <div>
              <label className="text-[11px] text-ink-500 block mb-1">本基金出资 ($M)</label>
              <input type="number" value={round.fundCheckUSDm} onChange={(e) => setRound(r => ({ ...r, fundCheckUSDm: parseFloat(e.target.value) || 0 }))} className="w-full text-[13px] bg-white border border-ink-200 rounded-lg px-3 py-1.5" />
            </div>
            <div>
              <label className="text-[11px] text-ink-500 block mb-1">ESOP 目标 (%)</label>
              <input type="number" value={round.esopTopUpPct} onChange={(e) => setRound(r => ({ ...r, esopTopUpPct: parseFloat(e.target.value) || 0 }))} className="w-full text-[13px] bg-white border border-ink-200 rounded-lg px-3 py-1.5" />
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-emerald-700 font-medium">本轮交易关键数字</div>
            <div className="text-[12px] text-ink-800">投后估值 <b className="num">${(round.preMoneyUSDm + round.amountUSDm).toLocaleString()}M</b></div>
            <div className="text-[12px] text-ink-800">单股价格 <b className="num">${calc.pricePerShare.toFixed(4)}</b></div>
            <div className="text-[12px] text-ink-800">新轮发行股数 <b className="num">{Math.round(calc.newRoundShares).toLocaleString()}</b></div>
            <div className="text-[12px] text-ink-800">本基金股数 <b className="num">{Math.round(calc.fundShares).toLocaleString()}</b> · 占投后 <b className="num">{fmtPct(calc.fundShares / calc.postTotalShares)}</b></div>
            <div className="text-[12px] text-ink-800">ESOP top-up 股数 <b className="num">{Math.round(calc.topUpShares).toLocaleString()}</b></div>
            <div className="text-[12px] text-ink-800">创始人合计稀释 <b className="num text-rose-700">−{fmtPct(calc.founderDilution)}</b></div>
          </div>
        </section>

        {/* 结果 */}
        <section className="lg:col-span-8 space-y-5">
          {/* 三大 group 投后占比 stacked bar */}
          <div className="bg-white border border-ink-200 rounded-xl p-4">
            <div className="text-[11px] uppercase tracking-wider text-ink-500 mb-3">投后股权结构（按角色聚合）</div>
            <div className="flex h-8 rounded-lg overflow-hidden">
              <div style={{ width: `${calc.founderPostPct * 100}%`, background: '#0EA5E9' }} className="flex items-center justify-center text-[11px] text-white font-medium" title="创始人">
                {fmtPct(calc.founderPostPct)}
              </div>
              <div style={{ width: `${calc.esopPostPct * 100}%`, background: '#F59E0B' }} className="flex items-center justify-center text-[11px] text-white font-medium" title="ESOP">
                {fmtPct(calc.esopPostPct)}
              </div>
              <div style={{ width: `${calc.investorPostPct * 100}%`, background: '#A855F7' }} className="flex items-center justify-center text-[11px] text-white font-medium" title="投资人">
                {fmtPct(calc.investorPostPct)}
              </div>
            </div>
            <div className="flex items-center justify-around mt-3 text-[11px]">
              <span><span className="inline-block w-2.5 h-2.5 rounded-sm mr-1.5" style={{ background: '#0EA5E9' }} />创始人</span>
              <span><span className="inline-block w-2.5 h-2.5 rounded-sm mr-1.5" style={{ background: '#F59E0B' }} />ESOP</span>
              <span><span className="inline-block w-2.5 h-2.5 rounded-sm mr-1.5" style={{ background: '#A855F7' }} />全部投资人</span>
            </div>
          </div>

          {/* 详细表 */}
          <div className="bg-white border border-ink-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-ink-100 flex items-center justify-between">
              <div className="text-[14px] font-semibold text-ink-900">完整 Cap Table</div>
              <div className="text-[10px] text-ink-400">投前 → 投后 · 总股数 {fmtNum(calc.totalPreShares)} → {fmtNum(Math.round(calc.postTotalShares))}</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead className="bg-ink-50">
                  <tr className="text-left text-ink-500">
                    <th className="px-3 py-2 font-medium">持有方</th>
                    <th className="px-3 py-2 font-medium">类型</th>
                    <th className="px-3 py-2 font-medium text-right">投前股数</th>
                    <th className="px-3 py-2 font-medium text-right">投前 %</th>
                    <th className="px-3 py-2 font-medium text-right">投后股数</th>
                    <th className="px-3 py-2 font-medium text-right">投后 %</th>
                    <th className="px-3 py-2 font-medium text-right">变化</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {calc.rows.map(r => {
                    const change = r.postPct - r.prePct
                    return (
                      <tr key={r.id} className="hover:bg-ink-50/40">
                        <td className="px-3 py-2 font-medium text-ink-900">
                          {r.id.startsWith('new-') && <span className="mr-1">✨</span>}
                          {r.name}
                          {(r as any).invested && <span className="text-[10px] text-ink-400 ml-2">{(r as any).invested}</span>}
                        </td>
                        <td className="px-3 py-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: colorByType[r.type] + '22', color: colorByType[r.type] }}>{r.type}</span>
                        </td>
                        <td className="px-3 py-2 text-right num text-ink-600">{r.preShares > 0 ? fmtNum(r.preShares) : '—'}</td>
                        <td className="px-3 py-2 text-right num text-ink-600">{r.preShares > 0 ? fmtPct(r.prePct) : '—'}</td>
                        <td className="px-3 py-2 text-right num text-ink-900">{fmtNum(Math.round(r.postShares))}</td>
                        <td className="px-3 py-2 text-right num font-semibold text-ink-900">{fmtPct(r.postPct)}</td>
                        <td className={`px-3 py-2 text-right num ${change > 0 ? 'text-emerald-700' : change < 0 ? 'text-rose-700' : 'text-ink-400'}`}>
                          {change > 0 ? '+' : ''}{fmtPct(change)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-6 text-[11px] text-ink-500 leading-relaxed">
        <div>⚠️ Cap Table 模拟器基于公开估值 + VC 行业经验估算各方持股 → 真实股权结构以公司章程为准。</div>
        <div className="mt-1">数据来源：3 家真实公开公司决策包 · 配合 <Link to="/termsheet" className="text-brand-700 hover:underline">/termsheet 起草</Link> 完成投决前置准备。</div>
      </footer>
    </div>
  )
}
