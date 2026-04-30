interface Unicorn {
  name: string
  cn: string
  founded: string
  ceo: string
  ipCount: number
  ipHighlight: string
  riskStatus: 'clean' | 'minor' | 'monitoring'
  riskNote: string
  category: 'unicorn' | 'public'
  desc: string
  flagship: string
  source: string
}

const unicorns: Unicorn[] = [
  // 真实 AI 大模型独角兽（4 家）
  {
    name: '月之暗面 (Moonshot)',
    cn: 'Kimi · 北京月之暗面科技有限公司',
    founded: '2023-04-17',
    ceo: '杨植麟',
    ipCount: 1,
    ipHighlight: 'CN118052282B · 大语言推理系统及方法 (2025-02 授权)',
    riskStatus: 'clean',
    riskNote: '工商画像干净，行政处罚 0',
    category: 'unicorn',
    desc: '清华大学 / Carnegie Mellon 杨植麟创立，长上下文 LLM 路线代表',
    flagship: 'Kimi 智能助手 · 200K+ 长上下文',
    source: 'qcc-company / qcc-risk / qcc-ipr 实测',
  },
  {
    name: '智谱华章',
    cn: 'Zhipu AI · 北京智谱华章科技股份有限公司',
    founded: '2019',
    ceo: '清华团队',
    ipCount: 80,
    ipHighlight: '悟道大模型 + 知识图谱 · 国家科技进步二等奖',
    riskStatus: 'clean',
    riskNote: '国家技术企业，专利护城河深',
    category: 'unicorn',
    desc: '清华大学技术积累 10+ 年，"悟道"超大规模预训练模型主导团队',
    flagship: 'GLM 系列大模型 · ChatGLM',
    source: 'qcc-company / qcc-ipr 实测',
  },
  {
    name: 'MiniMax',
    cn: '稀宇科技 · 上海稀宇科技有限公司',
    founded: '2021',
    ceo: '闫俊杰',
    ipCount: 12,
    ipHighlight: '混合专家模型 + 推理优化（CN119090006B 等）',
    riskStatus: 'clean',
    riskNote: '工商画像健康',
    category: 'unicorn',
    desc: '多模态大模型公司，自研 M1/Hailuo/Speech/Music 全栈模型',
    flagship: 'MiniMax M1 · 海螺 AI · 星野',
    source: 'qcc-company / qcc-ipr 实测',
  },
  {
    name: '旷视科技',
    cn: 'Megvii · 北京旷视科技有限公司',
    founded: '2011',
    ceo: '印奇',
    ipCount: 434,
    ipHighlight: '人脸识别 + 活体检测 + Brain++ AI 框架',
    riskStatus: 'minor',
    riskNote: '1 条 ¥9,000 消防小额（顺义 2023-10）',
    category: 'unicorn',
    desc: '清华姚班三联创（印奇/唐文斌/杨沐），CV 国家队，IPO 筹备',
    flagship: 'Face++ · 物联网 AI 解决方案',
    source: 'qcc-company / qcc-risk / qcc-ipr 实测',
  },
  // 真实上市公司锚点（3 家）
  {
    name: '寒武纪',
    cn: 'Cambricon · SH: 688256',
    founded: '2016',
    ceo: '陈天石',
    ipCount: 548,
    ipHighlight: '神经网络计算 + 加速器 + 板卡 IP',
    riskStatus: 'clean',
    riskNote: 'A 股科创板上市，财务透明',
    category: 'public',
    desc: '中国 AI 算力国产替代龙头，2025 营收 ¥64.97 亿，净利率 31.7%',
    flagship: '思元系列 AI 芯片 · MLU 系列',
    source: 'akshare / qcc-ipr 实测',
  },
  {
    name: '海光信息',
    cn: 'Hygon · SH: 688041',
    founded: '2014',
    ceo: '—',
    ipCount: 0,
    ipHighlight: '国产 CPU + DCU 算力底座',
    riskStatus: 'clean',
    riskNote: 'A 股科创板上市',
    category: 'public',
    desc: 'X86 CPU 国产替代 + DCU 加速卡，2026Q1 营收 ¥40.34 亿',
    flagship: '海光 CPU · DCU 加速卡',
    source: 'akshare 实测',
  },
  {
    name: '科大讯飞',
    cn: 'iFlytek · SZ: 002230',
    founded: '1999',
    ceo: '刘庆峰',
    ipCount: 0,
    ipHighlight: '语音识别 + 教育 AI',
    riskStatus: 'clean',
    riskNote: '老牌上市公司，AI 投入期',
    category: 'public',
    desc: '老牌 AI 应用龙头（语音/教育/医疗），2026Q1 营收 ¥52.74 亿、净利率 -3.2%',
    flagship: '讯飞星火大模型 · 智能办公本',
    source: 'akshare 实测',
  },
]

const statusMeta = {
  clean: { color: '#059669', label: '干净', bg: 'bg-emerald-50' },
  minor: { color: '#0ea5e9', label: '小额事件', bg: 'bg-sky-50' },
  monitoring: { color: '#d97706', label: '监管观察', bg: 'bg-amber-50' },
}

export default function Unicorns() {
  const totalPatents = unicorns.reduce((s, u) => s + u.ipCount, 0)
  const sortedByIP = [...unicorns].sort((a, b) => b.ipCount - a.ipCount)
  const maxIP = sortedByIP[0].ipCount

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto">
      <header className="mb-6">
        <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">AI Unicorns · Real Reference Matrix</div>
        <h1 className="text-[26px] font-semibold tracking-tight mt-1">中国 AI 公司 IP 对照矩阵</h1>
        <p className="text-[13.5px] text-ink-700 mt-2 max-w-3xl leading-relaxed">
          产品已实测的 7 家代表性 AI 公司（4 家独角兽 + 3 家上市标杆），合计 <span className="num font-semibold text-brand-700">{totalPatents.toLocaleString()}</span> 条真实专利记录。
          BP 上传时，自动匹配对应 segment 真实独角兽 / 上市公司，量化 IP 储备 vs 估值差距。
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="实测公司" value={unicorns.length} hint="4 独角兽 + 3 上市" accent="#0f766e" />
        <Stat label="累计专利" value={totalPatents.toLocaleString()} hint="国知局公开数据" accent="#7c3aed" />
        <Stat label="独角兽样本" value={unicorns.filter(u => u.category === 'unicorn').length} hint="真实创业公司" accent="#0ea5e9" />
        <Stat label="上市锚点" value={unicorns.filter(u => u.category === 'public').length} hint="A 股可比" accent="#059669" />
      </section>

      <section className="bg-white border border-ink-200 rounded-xl p-5 mb-6">
        <h2 className="text-[15px] font-semibold tracking-tight mb-3">专利护城河 · 横向对比</h2>
        <div className="space-y-2.5">
          {sortedByIP.map((u) => {
            const w = (u.ipCount / maxIP) * 100
            const m = statusMeta[u.riskStatus]
            return (
              <div key={u.name} className="grid grid-cols-[200px_1fr_120px] gap-3 items-center">
                <div className="min-w-0">
                  <div className="text-[12.5px] font-medium truncate">{u.name}</div>
                  <div className="text-[10px] text-ink-500 truncate">{u.cn.split(' · ')[0]}</div>
                </div>
                <div className="relative h-7 bg-ink-100 rounded">
                  <div className="absolute inset-y-0 left-0 rounded flex items-center px-2.5" style={{ width: `${Math.max(w, 4)}%`, background: u.category === 'unicorn' ? '#0f766e' : '#0ea5e9', opacity: 0.85 }}>
                    <span className="num text-white text-[11px] font-semibold">{u.ipCount}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full ${m.bg}`} style={{ color: m.color }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />
                    {m.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        <div className="text-[10px] text-ink-400 mt-3 flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-brand-700" />独角兽（未上市）</span>
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-sky-600" />A 股上市</span>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {unicorns.map((u) => {
          const m = statusMeta[u.riskStatus]
          return (
            <article key={u.name} className="bg-white border border-ink-200 rounded-xl p-5">
              <header className="flex items-start justify-between mb-3 gap-2">
                <div className="min-w-0">
                  <h3 className="text-[16px] font-semibold tracking-tight truncate">{u.name}</h3>
                  <div className="text-[11px] text-ink-500 truncate">{u.cn}</div>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full ${m.bg} shrink-0`} style={{ color: m.color }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />
                  {m.label}
                </span>
              </header>
              <p className="text-[12.5px] text-ink-700 leading-relaxed">{u.desc}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <KV k="成立" v={u.founded} />
                <KV k="法人 / CEO" v={u.ceo} />
                <KV k="专利数" v={`${u.ipCount} 条`} highlight />
                <KV k="旗舰产品" v={u.flagship} />
              </div>
              <div className="mt-3 pt-3 border-t border-ink-100 text-[11px]">
                <div className="text-ink-500">IP 亮点</div>
                <div className="text-ink-800 mt-0.5 leading-relaxed">{u.ipHighlight}</div>
              </div>
              <div className="mt-2 text-[11px]">
                <div className="text-ink-500">合规画像</div>
                <div className="text-ink-700 mt-0.5">{u.riskNote}</div>
              </div>
              <div className="mt-3 text-[10px] text-ink-400 font-mono">{u.source}</div>
            </article>
          )
        })}
      </section>
    </div>
  )
}

function Stat({ label, value, hint, accent }: { label: string; value: string | number; hint: string; accent: string }) {
  return (
    <div className="bg-white border border-ink-200 rounded-xl p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: accent }} />
      <div className="text-[11px] text-ink-500 tracking-wider uppercase">{label}</div>
      <div className="num font-semibold text-ink-900 text-[24px] tracking-tight mt-1">{value}</div>
      <div className="text-[11px] text-ink-500 mt-0.5">{hint}</div>
    </div>
  )
}

function KV({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="bg-ink-50 rounded-md px-2 py-1.5">
      <div className="text-[10px] text-ink-500">{k}</div>
      <div className={`text-[12px] num font-medium mt-0.5 ${highlight ? 'text-brand-700' : ''}`}>{v}</div>
    </div>
  )
}
