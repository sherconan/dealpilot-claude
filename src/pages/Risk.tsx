import { useState } from 'react'
import { useApp } from '../contexts/AppContext'

interface ScanResult {
  category: string
  shortName: string
  count: number
  status: 'clean' | 'low' | 'medium' | 'high'
  detail: string
  source: string
}

interface CompanyScan {
  name: string
  cnName: string
  results: ScanResult[]
  overall: 'clean' | 'caution' | 'critical'
  notes: string
}

const cases: CompanyScan[] = [
  {
    name: '北京旷视科技有限公司',
    cnName: '旷视 Megvii · 真实数据',
    overall: 'clean',
    notes: 'qcc-risk 实测（2026-04-30）：仅 1 条 9,000 元消防小额处罚（2023-10），失信 / 经营异常均为 0。整体合规画像优秀，小额事件需在 IC Memo 中如实披露。',
    results: [
      { category: '行政处罚', shortName: '处罚', count: 1, status: 'low', detail: '¥9,000 · 顺义区消防救援支队 · 2023-10-07 · 文号 顺(一)消行罚决字〔2023〕第100127号 · 小额合规事件，不影响投资', source: 'qcc-risk · get_administrative_penalty · 实测' },
      { category: '失信被执行', shortName: '失信', count: 0, status: 'clean', detail: '不在最高人民法院失信被执行人名单 · 同步排查限高 / 被执行均无', source: 'qcc-risk · get_dishonest_info · 实测' },
      { category: '被执行人案件', shortName: '被执', count: 0, status: 'clean', detail: '无被执行人记录', source: 'qcc-risk · get_judgment_debtor_info' },
      { category: '经营异常名录', shortName: '异常', count: 0, status: 'clean', detail: '工商正常经营状态', source: 'qcc-risk · get_business_exception · 实测' },
      { category: '严重违法失信名单', shortName: '严重', count: 0, status: 'clean', detail: '不在市监总局严重违法失信名单', source: 'qcc-risk · get_serious_violation' },
    ],
  },
  {
    name: '虚构案例 · CryptoVault',
    cnName: 'CryptoVault · 链库（虚构）',
    overall: 'critical',
    notes: '触发 4 项硬红线 — 创始人前公司 2024 年因合规问题被关停未披露、TAM 数据造假 50 倍、估值脱离基本面 7-10 倍、合规路径空白。建议直接 Pass 并存档机构记忆库创始人风险标签。',
    results: [
      { category: '行政处罚', shortName: '处罚', count: 1, status: 'high', detail: '前公司 2024-Q3 被香港 SFC 命令停止"未持牌经营"', source: '演示数据 · 真实查询模板' },
      { category: '失信被执行', shortName: '失信', count: 0, status: 'clean', detail: '当前主体未列入失信名单', source: '演示数据' },
      { category: '诚信披露', shortName: '披露', count: 1, status: 'high', detail: 'BP 未披露前公司被关停事实', source: 'Reference Check 3/3 前同事提及' },
      { category: 'TAM 真实性', shortName: 'TAM', count: 1, status: 'high', detail: 'BP 声称 $4.2T，实际行业规模约 $80B（差 50 倍）', source: 'autoglm 反向核查 + Galaxy/Coinbase' },
      { category: '估值合理性', shortName: '估值', count: 1, status: 'high', detail: '无收入要 $80M 估值，行业中位 $8-12M', source: 'PitchBook seed 估值' },
    ],
  },
  {
    name: '上海寻梦信息技术有限公司（拼多多运营主体）',
    cnName: '拼多多 · 高额监管处罚案例',
    overall: 'critical',
    notes: 'qcc-risk 实测（2026-04-30）：累计 4 条行政处罚，罚没合计 ¥51.13 亿（含国家市监总局 2026-04-17 ¥15.16 亿 + 历史 ¥35.97 亿食品安全处罚）。证明产品对"超大额监管处罚"的真实识别能力 — 即使行业龙头也存在系统性合规风险。',
    results: [
      { category: '行政处罚', shortName: '处罚', count: 4, status: 'high', detail: '累计 ¥51.13 亿罚没（最新 2026-04-17 国家市监总局 ¥15.16 亿 · 蛋糕店资质审查 + 消保不力 + 暂停新增蛋糕店 9 月）', source: 'qcc-risk · get_administrative_penalty · 实测' },
      { category: '处罚累计金额', shortName: '金额', count: 0, status: 'high', detail: '¥51.13 亿（5,113,380,000 元）— 行业最高级别监管', source: 'qcc-risk' },
      { category: '处罚机关', shortName: '机关', count: 0, status: 'high', detail: '国家市监总局 (2 次) + 长宁税务局 + 长宁市监局', source: 'qcc-risk' },
      { category: '机构判定', shortName: '判定', count: 0, status: 'high', detail: '高风险但非诚信红线 — 巨型平台监管常态化，需在 IC Memo 风险章节专项分析、量化对增长拖累', source: '产品规则引擎' },
      { category: '失信被执行', shortName: '失信', count: 0, status: 'clean', detail: '未列入失信名单（处罚已执行）', source: 'qcc-risk · get_dishonest_info' },
    ],
  },
  {
    name: '北京抖音信息服务有限公司（曾用名：字节跳动）',
    cnName: '字节跳动 · 真实监管案例',
    overall: 'caution',
    notes: 'qcc-risk 实测（2026-04-30）：识别到 1 条网信办高级别监管处罚（2025-09-23 约谈 + 责令限期改正 + 警告 + 从严处理责任人）。证明产品能识别"超大型公司也存在的合规事件"，颗粒度区分硬红线 vs 中等监管事件。',
    results: [
      { category: '行政处罚', shortName: '处罚', count: 1, status: 'medium', detail: '国家网信办 2025-09-23 对今日头条平台采取约谈、责令限期改正、警告、从严处理责任人等处置处罚措施 — 平台型监管事件，多见于头部公司，需在 IC Memo 中专项分析监管常态化对估值的影响', source: 'qcc-risk · get_administrative_penalty · 实测' },
      { category: '失信被执行', shortName: '失信', count: 0, status: 'clean', detail: '无失信被执行人记录，限高 / 被执行均无', source: 'qcc-risk · get_dishonest_info · 实测' },
      { category: '工商画像', shortName: '工商', count: 0, status: 'clean', detail: '成立 2012，曾用名"字节跳动"，AI + 移动互联网，旗下今日头条 / 抖音 / 西瓜视频等', source: 'qcc-company · get_company_profile · 实测' },
      { category: '业务体量', shortName: '体量', count: 0, status: 'clean', detail: '全球化战略 + 技术出海，估值 / 用户体量超大型', source: 'qcc-company' },
      { category: '机构判定', shortName: '判定', count: 0, status: 'medium', detail: '中等风险：监管事件存在但属赛道常态，不构成投资硬红线 — 需在尽调中量化监管时间线对增长的拖累', source: '产品规则引擎' },
    ],
  },
  {
    name: '上海联影医疗科技股份有限公司',
    cnName: '联影医疗 · 真实数据',
    overall: 'clean',
    notes: 'qcc-risk 实测（2026-04-30）：行政处罚 / 失信 / 经营异常 全部 0 条 — 科创板上市公司合规画像完美。akshare 财务数据 + cninfo 2024 年报 PDF 双源交叉一致。',
    results: [
      { category: '行政处罚', shortName: '处罚', count: 0, status: 'clean', detail: '主体在此维度经营表现良好，无历史遗留违规', source: 'qcc-risk · get_administrative_penalty · 实测 2026-04-30' },
      { category: '失信被执行', shortName: '失信', count: 0, status: 'clean', detail: '不在最高人民法院失信名单 · 同步排查限高 / 被执行均无', source: 'qcc-risk · get_dishonest_info · 实测' },
      { category: '经营异常', shortName: '异常', count: 0, status: 'clean', detail: '工商正常经营状态，未列入异常名录', source: 'qcc-risk · get_business_exception · 实测' },
      { category: '财务数据真实性', shortName: '财务', count: 0, status: 'clean', detail: 'akshare 抓取的 ¥88.59 亿营收与 cninfo 2024 年报 PDF 披露口径一致', source: 'akshare + cninfo 双源交叉 · 实测' },
      { category: '专利护城河', shortName: '专利', count: 0, status: 'clean', detail: '专利授权率正常，无 IP 质押风险', source: 'qcc-ipr' },
    ],
  },
]

const statusMeta = {
  clean: { color: '#059669', bg: 'bg-emerald-50', label: '干净', icon: '✓' },
  low: { color: '#0ea5e9', bg: 'bg-sky-50', label: '低', icon: 'i' },
  medium: { color: '#d97706', bg: 'bg-amber-50', label: '中', icon: '!' },
  high: { color: '#dc2626', bg: 'bg-rose-50', label: '高', icon: '✕' },
}

const overallMeta = {
  clean: { color: '#059669', label: '通过 · 无重大风险', desc: '所有 5 类风险扫描通过，可作为机构合格创始人 / 公司参考' },
  caution: { color: '#d97706', label: '观察 · 存在软扣分项', desc: '部分维度命中扣分项，建议尽调中重点核实' },
  critical: { color: '#dc2626', label: '触发硬红线', desc: '存在不可接受的合规 / 诚信问题，建议 Pass + 创始人风险标签' },
}

export default function Risk() {
  const { t } = useApp()
  const [selected, setSelected] = useState(0)
  const c = cases[selected]
  const m = overallMeta[c.overall]

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto">
      <header className="mb-5">
        <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">Risk Scanner · 5 维合规扫描</div>
        <h1 className="text-[26px] font-semibold tracking-tight mt-1">{t('nav.risk')}</h1>
        <p className="text-[13.5px] text-ink-700 mt-1.5 max-w-3xl leading-relaxed">
          一键并行调用 <code className="text-[11px] bg-ink-100 px-1 rounded">qcc-risk</code> 五个工具：行政处罚 / 失信被执行 / 被执行人 / 经营异常 / 严重违法 → 任一命中触发硬红线 → 自动建议 Pass + 标记创始人风险
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <aside className="lg:col-span-4 space-y-3">
          <div className="bg-white border border-ink-200 rounded-xl p-4">
            <div className="text-[11px] tracking-wider uppercase text-ink-500 mb-2">扫描公司</div>
            <input
              type="text"
              placeholder="输入公司全称（演示版预填案例）"
              className="w-full text-[13px] bg-ink-50 border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              readOnly
              value={c.name}
            />
          </div>
          <div className="bg-white border border-ink-200 rounded-xl p-4">
            <div className="text-[11px] tracking-wider uppercase text-ink-500 mb-2">演示案例</div>
            <div className="space-y-1.5">
              {cases.map((cc, i) => {
                const om = overallMeta[cc.overall]
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition ${
                      selected === i ? 'bg-brand-50 border border-brand-500/40' : 'hover:bg-ink-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium truncate">{cc.cnName}</span>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: om.color }} />
                    </div>
                    <div className="text-[11px] text-ink-500 mt-0.5">{om.label}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-ink-200 rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-[16px] font-semibold tracking-tight">{c.cnName}</h2>
                <div className="text-[12px] text-ink-500 mt-0.5">{c.name}</div>
              </div>
              <span className="inline-flex items-center gap-2 text-[12.5px] font-medium px-3 py-1.5 rounded-full" style={{ color: m.color, background: m.color + '14' }}>
                <span className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                {m.label}
              </span>
            </div>
            <p className="text-[13px] text-ink-700 mt-3 leading-relaxed">{m.desc}</p>
            <p className="text-[12.5px] text-ink-600 mt-2 leading-relaxed border-l-2 border-brand-500/40 pl-3">{c.notes}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {c.results.map((r) => {
              const sm = statusMeta[r.status]
              return (
                <div key={r.category} className="bg-white border border-ink-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[10px] tracking-wider uppercase text-ink-500">{r.category}</div>
                      <div className="text-[18px] font-semibold tracking-tight mt-1 num" style={{ color: sm.color }}>
                        {r.count} <span className="text-[11px] text-ink-500 font-normal">{sm.label}</span>
                      </div>
                    </div>
                    <div className={`w-7 h-7 rounded-md flex items-center justify-center text-white text-[12px] font-semibold shrink-0`} style={{ background: sm.color }}>{sm.icon}</div>
                  </div>
                  <div className="text-[12px] text-ink-700 mt-2 leading-relaxed">{r.detail}</div>
                  <div className="text-[10px] text-ink-400 mt-2 font-mono">{r.source}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
