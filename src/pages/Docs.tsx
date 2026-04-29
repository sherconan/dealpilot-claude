import { Link } from 'react-router-dom'

export default function Docs() {
  return (
    <div className="px-8 py-6 max-w-[1100px] mx-auto">
      <header className="mb-6">
        <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">Methodology · Product Foundation</div>
        <h1 className="text-[28px] font-semibold tracking-tight mt-1">产品方法论白皮书</h1>
        <p className="text-[13.5px] text-ink-700 mt-2 max-w-3xl leading-relaxed">
          DealPilot 的全部评分规则、Red Flag 清单、漏斗模型、IC Memo 结构都基于全球 VC 共识方法论。
          这一页是产品的"宪法" — 任何评分 / 推荐 / 建议都可追溯回此处。
          完整 markdown 版本见 <a href="https://github.com/sherconan/dealpilot-claude/blob/main/docs/methodology.md" target="_blank" className="text-brand-700 hover:underline">github.com/sherconan/dealpilot-claude/docs/methodology.md</a>
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <Frame title="Sequoia 10 要素" subtitle="事实标准" desc="使命 / 问题 / 解决方案 / 时机 / 市场 / 竞争 / 商业模式 / 团队 / 财务 / 愿景" accent="#0f766e" />
        <Frame title="a16z 双维度" subtitle="技术 × 文化" desc="技术洞见 + 创始人 × 市场契合度 + 时机 + 网络效应" accent="#0ea5e9" />
        <Frame title="YC 极简三件" subtitle="人为先" desc="技术能力 + 市场理解 + 创始人韧性" accent="#8b5cf6" />
      </section>

      <Section title="100 分 Scorecard 设计" subtitle="四大类 12 子项 加权融合">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scoreGroups.map((g) => (
            <div key={g.name} className="bg-white border border-ink-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[14px] font-semibold tracking-tight">{g.name}</h3>
                <span className="num text-[12px] font-medium px-2 py-0.5 rounded-full text-white" style={{ background: g.color }}>{g.weight}%</span>
              </div>
              <ul className="space-y-1.5 text-[12px]">
                {g.items.map((i) => (
                  <li key={i.k} className="flex items-center justify-between">
                    <span className="text-ink-700">{i.k}</span>
                    <span className="num text-ink-900 font-medium">{i.w}%</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="总分分级 → 推荐行动" subtitle="自动决策路由">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {bands.map((b) => (
            <div key={b.range} className="border border-ink-200 rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: b.color }} />
              <div className="num text-[20px] font-semibold tracking-tight" style={{ color: b.color }}>{b.range}</div>
              <div className="text-[14px] font-semibold mt-1" style={{ color: b.color }}>{b.label}</div>
              <div className="text-[12px] text-ink-600 mt-1.5 leading-relaxed">{b.action}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Red Flag 清单" subtitle="硬红线即 Pass · 软红线扣分">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-rose-200 rounded-xl p-5">
            <h3 className="text-[14px] font-semibold tracking-tight text-rose-700 mb-2">硬 Red Flag · 命中即 Pass</h3>
            <ul className="space-y-1.5 text-[12.5px] text-ink-800 leading-relaxed">
              {hardRedFlags.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-[7px] shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white border border-amber-200 rounded-xl p-5">
            <h3 className="text-[14px] font-semibold tracking-tight text-amber-700 mb-2">软 Red Flag · 扣分项</h3>
            <ul className="space-y-1.5 text-[12.5px] text-ink-800 leading-relaxed">
              {softRedFlags.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-[7px] shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="IC Memo 8 段标准结构" subtitle="信念文件 · 不是防御性文件">
        <ol className="space-y-2 text-[13px]">
          {icMemoStructure.map((s, i) => (
            <li key={i} className="flex items-start gap-3 bg-white border border-ink-200 rounded-lg p-3">
              <div className="num w-7 h-7 rounded-full bg-brand-700 text-white text-[12px] font-medium flex items-center justify-center shrink-0">{i + 1}</div>
              <div className="flex-1">
                <div className="font-semibold text-ink-900">{s.title}</div>
                <div className="text-[12px] text-ink-600 mt-0.5 leading-relaxed">{s.desc}</div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="AI 与人类的边界" subtitle="AI 不替代判断 · AI 让判断更锐利">
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px] min-w-[600px]">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-ink-500 border-b border-ink-200">
                <th className="text-left py-2 px-2">维度</th>
                <th className="text-left py-2 px-2">AI 擅长</th>
                <th className="text-left py-2 px-2">人类必须介入</th>
              </tr>
            </thead>
            <tbody>
              {aiBoundary.map((r, i) => (
                <tr key={i} className="border-b border-ink-100">
                  <td className="py-2.5 px-2 font-medium">{r.area}</td>
                  <td className="py-2.5 px-2 text-emerald-700">{r.ai || '—'}</td>
                  <td className="py-2.5 px-2 text-amber-700">{r.human || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <div className="mt-8 p-5 bg-gradient-to-br from-brand-50 via-white to-white border border-brand-500/20 rounded-xl text-center">
        <div className="text-[11px] tracking-wider uppercase text-brand-700 font-medium">从理论到产品</div>
        <p className="text-[14px] text-ink-800 mt-2 max-w-2xl mx-auto leading-relaxed">
          上面每一条规则都对应 DealPilot 的一个真实功能。准备好用这套方法论评估你的下一个 BP 了吗？
        </p>
        <Link to="/upload" className="inline-flex items-center gap-2 mt-4 px-4 py-2 text-[13px] rounded-lg bg-brand-700 text-white hover:bg-brand-800 transition font-medium">
          上传第一份 BP →
        </Link>
      </div>
    </div>
  )
}

function Frame({ title, subtitle, desc, accent }: { title: string; subtitle: string; desc: string; accent: string }) {
  return (
    <div className="bg-white border border-ink-200 rounded-xl p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: accent }} />
      <div className="text-[10px] tracking-wider uppercase" style={{ color: accent }}>{subtitle}</div>
      <div className="text-[15px] font-semibold tracking-tight mt-1">{title}</div>
      <div className="text-[12px] text-ink-600 mt-2 leading-relaxed">{desc}</div>
    </div>
  )
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="mb-7">
      <div className="mb-3">
        <h2 className="text-[18px] font-semibold tracking-tight">{title}</h2>
        <p className="text-[12px] text-ink-500 mt-0.5">{subtitle}</p>
      </div>
      {children}
    </section>
  )
}

const scoreGroups = [
  { name: '赛道吸引力', weight: 20, color: '#0ea5e9', items: [{ k: '市场规模 TAM', w: 8 }, { k: '市场增速 CAGR', w: 7 }, { k: '政策支持度', w: 5 }] },
  { name: '团队质量', weight: 30, color: '#0f766e', items: [{ k: '创始人经验深度', w: 10 }, { k: '团队完整性', w: 8 }, { k: '历史成功记录', w: 7 }, { k: '团队稳定性', w: 5 }] },
  { name: '商业模式', weight: 23, color: '#8b5cf6', items: [{ k: '收入模型清晰度', w: 8 }, { k: '单位经济学', w: 7 }, { k: '护城河宽度', w: 8 }] },
  { name: '增长动能', weight: 15, color: '#d97706', items: [{ k: 'Traction 证据', w: 10 }, { k: '客户留存 NRR', w: 5 }] },
]

const bands = [
  { range: '80–100', label: '优先推进', action: '排入最近 IC + 锁定份额 + 启动 reference check', color: '#059669' },
  { range: '65–79', label: '持续观察', action: '季度回访 + 信号源监控 + 等待关键不确定性消除', color: '#0ea5e9' },
  { range: '50–64', label: '有条件跟进', action: '当面指出软红线，要求改进后再评', color: '#d97706' },
  { range: '< 50', label: '建议 Pass', action: '机构记忆库存档 + 创始人风险标签', color: '#dc2626' },
]

const hardRedFlags = [
  '市场规模数据无来源 / 严重夸大（差 10 倍以上）',
  '竞争分析为空白（"我们没有竞争对手"）',
  '财务数据前后矛盾（增速 vs 营收规模不对应）',
  '创始团队离职率高 / 创始人已套现离场',
  '存在未披露的诉讼 / 税务 / 知识产权纠纷',
  '商业模式依赖单一大客户（占比 > 50%）',
  '估值脱离基本面（无营收要 10 亿 +）',
  '创始人前公司有合规问题且未在 BP 披露',
]

const softRedFlags = [
  'BP 逻辑不自洽（前后模块互相矛盾）',
  '团队无相关行业背景',
  '过度依赖政策补贴',
  '产品 Demo 无法复现 BP 中的描述',
  '创始人无法清晰解释核心技术',
  '融资用途不清晰或过于分散',
  '客户集中度偏高（Top 3 > 40%）',
  '估值倍数高于同业中位 30%+',
]

const icMemoStructure = [
  { title: '执行摘要', desc: '头部信息（估值/金额/条款）+ 3 个核心投资论点 + 推荐建议' },
  { title: '市场分析', desc: '动态分析（为何现在）+ 需求信号 + 竞品格局' },
  { title: '团队评估', desc: '5 维度：能力 / 行业经验 / 热情 / 团队互补 / 创业经验' },
  { title: '产品 / 牵引力', desc: '真实客户数据 + 产品差异化' },
  { title: '单位经济学', desc: '收入模型 + 随规模改善逻辑 + 关键风险假设' },
  { title: '风险与缓释', desc: '具体可接受的缓释措施（非"团队很强"类愿望陈述）' },
  { title: '投资结构与退出路径', desc: '优先股 / 董事会席位 / 反稀释 / 退出可见度' },
  { title: '附录', desc: 'Sequoia 10 要素详细评分 + 单位经济学敏感性' },
]

const aiBoundary = [
  { area: '数据处理', ai: '快速解析、跨源验证、异常检测', human: '' },
  { area: '模式识别', ai: '基于历史成功 / 失败模式打分', human: '' },
  { area: '初步筛选', ai: '高通量过滤、优先级排序', human: '' },
  { area: '市场研究', ai: '聚合数据、竞品分析', human: '' },
  { area: '创始人评估', ai: '', human: '韧性、远见、领导力、信任感' },
  { area: '关系建立', ai: '', human: 'VC 本质是信任生意' },
  { area: '逆向创新', ai: '', human: 'AI 基于历史训练，天然低估颠覆性' },
  { area: '价值观判断', ai: '', human: '道德 / 伦理决策' },
]
