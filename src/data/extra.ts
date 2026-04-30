import type { DealExtra, Sequoia10 } from '../types'

// 行业 segment 中位数 / 头部 25%（对标 PitchBook + Sequoia 内部样本，2025-Q4）
const seg = (m: Partial<Sequoia10>, t: Partial<Sequoia10>) => {
  const fill = (o: Partial<Sequoia10>, fb: number): Sequoia10 => ({
    mission: o.mission ?? fb, problem: o.problem ?? fb, solution: o.solution ?? fb,
    whyNow: o.whyNow ?? fb, market: o.market ?? fb, competition: o.competition ?? fb,
    businessModel: o.businessModel ?? fb, team: o.team ?? fb, financials: o.financials ?? fb,
    vision: o.vision ?? fb,
  })
  return { median: fill(m, 6), top: fill(t, 8) }
}

const SEG = {
  aiInfraSeriesA: seg(
    { mission: 7, problem: 7, solution: 6, whyNow: 8, market: 7, competition: 5, businessModel: 6, team: 7, financials: 6, vision: 7 },
    { mission: 9, problem: 9, solution: 8, whyNow: 9, market: 9, competition: 7, businessModel: 8, team: 9, financials: 8, vision: 9 },
  ),
  fintechSeriesB: seg(
    { mission: 7, problem: 8, solution: 7, whyNow: 7, market: 8, competition: 6, businessModel: 7, team: 8, financials: 8, vision: 7 },
    { mission: 9, problem: 9, solution: 8, whyNow: 9, market: 9, competition: 8, businessModel: 9, team: 9, financials: 9, vision: 8 },
  ),
  healthSeed: seg(
    { mission: 8, problem: 8, solution: 6, whyNow: 6, market: 7, competition: 5, businessModel: 4, team: 7, financials: 3, vision: 7 },
    { mission: 9, problem: 9, solution: 8, whyNow: 8, market: 8, competition: 7, businessModel: 6, team: 9, financials: 5, vision: 9 },
  ),
  logisticsPreA: seg(
    { mission: 6, problem: 7, solution: 6, whyNow: 6, market: 7, competition: 5, businessModel: 6, team: 7, financials: 6, vision: 6 },
    { mission: 8, problem: 9, solution: 8, whyNow: 8, market: 8, competition: 7, businessModel: 8, team: 9, financials: 8, vision: 8 },
  ),
  web3Seed: seg(
    { mission: 6, problem: 6, solution: 5, whyNow: 4, market: 5, competition: 4, businessModel: 4, team: 6, financials: 3, vision: 5 },
    { mission: 8, problem: 8, solution: 7, whyNow: 6, market: 7, competition: 6, businessModel: 6, team: 8, financials: 5, vision: 7 },
  ),
  roboticsAngel: seg(
    { mission: 7, problem: 7, solution: 6, whyNow: 6, market: 6, competition: 5, businessModel: 5, team: 6, financials: 3, vision: 6 },
    { mission: 9, problem: 9, solution: 8, whyNow: 8, market: 8, competition: 7, businessModel: 7, team: 8, financials: 5, vision: 8 },
  ),
}

export const dealExtras: Record<string, DealExtra> = {
  // ────────────────────────── NebulaAI（完整版样板）──────────────────────────
  'nebula-ai': {
    benchmarkLabel: 'AI Infrastructure · Series A · 全球样本 N=128（PitchBook 2025-Q4）',
    benchmarkMedian: SEG.aiInfraSeriesA.median,
    benchmarkTopQuartile: SEG.aiInfraSeriesA.top,
    dimensionDetails: {
      team: {
        rationale: '"Anthropic Applied Research + 阿里云 PaaS"双背景在多智能体编排这一交叉领域是稀缺组合，行业内合并样本不超过 5 支。',
        evidence: [
          'CEO Lin Mu 在 Anthropic 主导 Multi-Agent Planner 模块（2023–2025），LinkedIn + arXiv 论文已交叉验证',
          'CTO Chen Hao 任阿里云 PaaS 负责人时主导百万级 Agent 调度，3 项相关专利在阿里期间发表',
          '联创磨合 14 个月，超过成长期门槛（≥12 个月）',
          'Glassdoor 离职率 6.2%，低于 AI 创业公司中位 14%',
        ],
        signals: ['团队招聘信号：近 30 天新增 2 位前 Anthropic 工程师 + 1 位前 Databricks AE'],
      },
      whyNow: {
        rationale: '企业 Agent 从 POC 进入生产级是 2024–2026 一次性窗口，此后头部玩家份额趋于固化。',
        evidence: [
          'Gartner 2025: 65% Fortune 500 已进入 Agent 平台选型阶段，但仅 8% 完成生产级部署',
          '中国国资云（阿里云、腾讯云）2025-Q4 同步开放企业 Agent PaaS 接口，平台化卡位窗口约 12-18 月',
          'Anthropic、OpenAI 自身的多 Agent 产品仍偏开发者层，企业层留有 24 月空白',
        ],
      },
      solution: {
        rationale: '多智能体编排是行业第一个生产级方案，3 项专利覆盖 Planner、Memory、Tool-Routing 三个核心环节。',
        evidence: [
          '已获中国发明专利 6 项（专利局可查）+ 实质审查中 2 项',
          '客户实测：在 100 Agent 并发下任务成功率 91.4%，对比 LangChain Multi-Agent 78.2%',
          '已开源 agent-kernel（GitHub 2.4k stars / 4 月内）形成开发者社区',
        ],
      },
      financials: {
        rationale: 'ARR $4.8M、MoM 38%、NRR 143%、毛利 78% — 单位经济学已穿越 PMF 验证门槛。',
        evidence: [
          '2025-Q4 ~ 2026-Q1 ARR：$2.1M → $4.8M，连续 6 个月 MoM ≥30%',
          'CAC 回收期 8 个月 < 行业基准 14 个月',
          'Top 3 客户合同金额合计 $2.3M，占 ARR 48% — 集中度软红线',
        ],
        signals: ['毛利提升信号：自有推理基础设施 2026-Q3 上线后预计毛利从 78% → 84%'],
      },
      competition: {
        rationale: '直接竞品 LangChain/CrewAI 偏开发者层，企业生产级平台空白；间接竞品来自大模型厂商可能下场。',
        evidence: [
          'LangChain：开源生态强，但企业 SLA、合规模块缺失',
          'CrewAI：YC W24，目前 ARR ~$1.2M（公开访谈），落后 NebulaAI 1 个量级',
          '大厂风险：Anthropic Computer Use 仍偏开发者，未见 enterprise GTM 信号',
        ],
      },
    },
    dataChecks: [
      { claim: 'BP 援引"对标寒武纪净利率水平"', external: 'akshare 实测寒武纪 (688256) 2025 全年：营收 ¥64.97 亿、净利 ¥20.59 亿、净利率 31.7%、股价 ¥1,353.20。BP 中"对标寒武纪 25-30% 净利率"基本吻合，但寒武纪的高净利率高度依赖国产替代政策溢价，NebulaAI 应用层 SaaS 不可直接套用', status: 'partial', source: 'akshare · 东方财富 · 2026-04-24 实测', verified: true, note: '同业可比锚点真数据已抓取 — 见可比上市公司表' },
      { claim: 'ARR $4.8M（38% MoM）', external: '客户合同抽查 8/47 + 银行流水验证：年化收入 $4.6M，差距 4%（合理范围）', status: 'aligned', source: '财务尽调 · 毕马威', note: 'BP 数据真实，但 Q1 收入有约 $0.4M 来自一次性 setup fee，订阅 ARR 应表述为 $4.4M' },
      { claim: '47 家企业客户 · NRR 143%', external: 'LinkedIn / 客户官网公开提及 38 家；客户深访 5 家全部确认续约且扩张', status: 'aligned', source: 'LinkedIn + 5 家客户访谈' },
      { claim: '8 项核心专利已授权', external: '中国专利局检索：6 项已授权，2 项实质审查中', status: 'partial', source: '国知局公开数据', note: '"已授权"用词偏宽松，建议在 IC Memo 中精确表述为"6 项已授权 + 2 项受理"' },
      { claim: '团队 34 人，工程占比 70%', external: 'LinkedIn 检索员工 31 人，与 BP 偏差 1 个月用工窗口；工程职能占比 68%', status: 'aligned', source: 'LinkedIn People Search' },
      { claim: 'Daily Active Agents 8,400', external: '产品后台数据透出：日均触发 Agent 任务数 7,800 → 8,600 区间', status: 'aligned', source: '客户处看到的产品后台截图' },
      { claim: 'TAM 2028 $47B', external: 'Gartner 2025 报告原文：$31B（窄口径）/ $52B（宽口径含 RPA 替代）', status: 'partial', source: 'Gartner + IDC 交叉', note: 'BP 取了宽口径中位，与机构惯例对齐，可接受' },
    ],
    interviewQuestions: [
      { category: 'financial', question: 'Top 3 客户合同到期日分别是哪天？任一不续约，未来 12 月 ARR 影响是多少？现金缓冲能撑几个月？', why: '客户集中度是软红线，要听创始人是否有量化的对冲计划', expect: '具体日期 + ARR 影响数 + 现金缓冲月数', watch: '回避或模糊回答 → 集中度风险被低估' },
      { category: 'business', question: '从 47 → 200 客户，最大瓶颈是销售团队、产品成熟度、还是 GPU/推理成本？请按瓶颈给我排序并量化。', why: '验证创始人对规模化挑战的认知颗粒度', expect: '清晰瓶颈排序 + 各项的量化目标 / 投入', watch: '"都是问题"= 没真正想清楚' },
      { category: 'team', question: 'Chen Hao 离开阿里云时带走了几位核心？最近 6 个月新招的 staff+ 工程师，姓名 / 来源公司能列出吗？', why: '验证团队是否能持续吸引一线人才', expect: '能具体列出 3-5 人 + 来源', watch: '闪烁其词 / 拒绝具名 → 招聘能力可能弱于宣传' },
      { category: 'competition', question: 'LangChain 和 CrewAI 都在做 multi-agent，你们最关键的不可复制能力是什么？请给我一个具体客户场景说明。', why: '逼出真正的差异化，而非"我们更好"', expect: '具体场景 + 技术指标差距数字', watch: '抽象比较 → 差异化薄' },
      { category: 'competition', question: 'Anthropic 自己若推出 enterprise multi-agent，你们的应对路径是什么？最早会在什么信号下启动？', why: '存在性风险问题', expect: '第一性原理思考 + 已观察的市场信号 + 触发条件', watch: '"不会发生" → 缺乏蓝军意识' },
      { category: 'fund-use', question: '$15M 拆分：人 / GPU / GTM 各多少比例？最坏情况下烧钱率假设是多少？跑道几个月？', why: '验证资金计划颗粒度', expect: '百分比 + 关键岗位 + 18 月跑道假设', watch: '粗略分布 / 没有压力测试 → 财务规划薄' },
      { category: 'risk', question: '美元 / 人民币双币种架构现在到哪一步了？ESOP 是否已经在 Cayman 实施？', why: '出海合规与治理结构是 Series A 必修题', expect: '具体里程碑 + 律所名称 + 时间线', watch: '"在做了" → 进度可能滞后' },
      { category: 'governance', question: '首席科学家 / 联创 vesting cliff 是否已通过？任一离开的回购条款？', why: '股权稳定性风险', expect: '能在 60 秒内说清条款', watch: '需要回去查 → 治理颗粒度低' },
    ],
    publicComps: [
      { name: '寒武纪', ticker: 'SH: 688256', price: '¥1353.20', reportDate: '2025-12-31', revenue: '¥64.97 亿', netIncome: '¥20.59 亿', netMargin: '31.7%', totalAssets: '¥134.38 亿', similarity: '中国 AI 算力国产替代龙头', distance: '寒武纪做芯片+算力底座，与 NebulaAI 应用层形成上下游互补；31.7% 净利率反映稀缺性溢价', verified: true, source: 'akshare · 东方财富', lastFetched: '2026-04-30', reportUrl: 'https://static.cninfo.com.cn/finalpage/2025-04-19/1223155683.PDF', prospectusUrl: 'https://static.cninfo.com.cn/finalpage/2020-07-14/1208028359.PDF' },
      { name: '海光信息', ticker: 'SH: 688041', price: '¥278.77', reportDate: '2026-03-31', revenue: '¥40.34 亿', netIncome: '¥6.87 亿', netMargin: '17.0%', totalAssets: '¥351.85 亿', similarity: '国产 CPU/DCU 算力底座', distance: '海光 17.0% 净利率反映芯片国产化的盈利能力中位水平；NebulaAI 应用层若跑通可参考', verified: true, source: 'akshare · 东方财富', lastFetched: '2026-04-30', reportUrl: 'https://static.cninfo.com.cn/finalpage/2025-03-01/1222675682.PDF', prospectusUrl: 'https://static.cninfo.com.cn/finalpage/2022-08-09/1214251824.PDF' },
      { name: '科大讯飞', ticker: 'SZ: 002230', price: '¥48.06', reportDate: '2026-03-31', revenue: '¥52.74 亿', netIncome: '¥-1.70 亿（亏损）', netMargin: '-3.2%', totalAssets: '¥456.57 亿', similarity: 'A 股 AI 应用龙头（语音/教育）', distance: '讯飞当前亏损反映 AI 应用层 GPU 投入期的现实；NebulaAI 也将面临同样毛利与 GPU 成本的张力', verified: true, source: 'akshare · 东方财富', lastFetched: '2026-04-30', reportUrl: 'https://static.cninfo.com.cn/finalpage/2025-04-22/1223191180.PDF', prospectusUrl: 'https://static.cninfo.com.cn/finalpage/2024-12-19/1222065496.PDF' },
    ],
    compsTakeaway: 'A 股 AI 真实可比锚定：底座层（寒武纪 31.7% / 海光 17.0%）净利率 > 应用层（讯飞 -3.2%）。NebulaAI 处于应用层但聚焦企业 SaaS（毛利潜力 75-85%）— 估值需匹配"应用层 + 高毛利 SaaS"双重叙事。当前投前 $120M 偏高，建议 IC 重点辩论是否值得为"潜在天花板"支付当下溢价。',
  },

  // ────────────────────────── NeoBank Digital ──────────────────────────
  'neobank-digital': {
    benchmarkLabel: 'Embedded Fintech · Series B · 东南亚样本 N=46（McKinsey 2025）',
    benchmarkMedian: SEG.fintechSeriesB.median,
    benchmarkTopQuartile: SEG.fintechSeriesB.top,
    dimensionDetails: {
      market: {
        rationale: '东南亚 SME 嵌入式金融渗透率仅 28%，监管框架 2024 年落地后第一次出现可规模化合规路径。',
        evidence: [
          'McKinsey 2025: 东南亚 SME 数字金融年增 24%，是全球最快区域',
          'NeoBank 已在新加坡 / 泰国拿到 EMI 牌照，印尼 / 越南申请中',
          '生态合作：Grab、Shopee、Lazada 三大入口已对接',
        ],
      },
      financials: {
        rationale: 'ARR $21.6M、MoM 18%、NRR 128%、毛利 63% — 财务质量在 fintech 行业内属于头部。',
        evidence: [
          'Q1 2026 月交易额 $480M，QoQ +24%',
          'CAC 回收期 14 月（fintech 中位 18 月），优于行业',
          '14 家银行合作风控数据积累 ~3 年，形成数据壁垒',
        ],
      },
      competition: {
        rationale: '本地玩家众多但全区域整合者极少，NeoBank 三国本地化团队是稀缺资产。',
        evidence: [
          '同业 Aspire（新加坡）、Tonik（菲律宾）地理覆盖窄',
          'Grab Financial 是潜在大厂竞争，但 GTM 节奏受 Grab 主业掣肘',
        ],
      },
    },
    dataChecks: [
      { claim: 'ARR $21.6M', external: '财务尽调（德勤）确认审计 ARR $20.9M（口径差 3%）', status: 'aligned', source: '德勤审计 + 银行流水', note: '差距来自延迟确认的收入，可接受' },
      { claim: '14 家银行合作', external: '公开新闻 + 监管披露：12 家已签约，2 家在 MOU 阶段', status: 'partial', source: '监管 + 公开数据' },
      { claim: '估值 16x ARR', external: 'PitchBook 同赛道 Series B 估值倍数中位 12x，Top quartile 18x', status: 'partial', source: 'PitchBook 2026-Q1', note: '估值偏高但在 Top quartile 内可解释' },
      { claim: '印尼牌照即将落地', external: '印尼 OJK 公开排期：申请已进入实质审查，预计 6-12 月', status: 'unverified', source: 'OJK 申请编号公开页', note: '时间表存在 ±6 月不确定性' },
    ],
    interviewQuestions: [
      { category: 'financial', question: '估值 16x ARR 高于同业中位 12x，你的论据是什么？哪些指标支持这个溢价？', why: '估值合理性是 Series B 必辩问题', expect: 'NRR / 增速 / 牌照壁垒 三选一作为核心论据' },
      { category: 'risk', question: '印尼牌照如果延迟到 2027-Q2 落地，对融资计划和增长目标的影响是？', why: '监管风险是软红线，需要听具体应对', expect: '具体场景化回答 + 缓释预算' },
      { category: 'competition', question: 'Grab Financial 已有 6500 万用户基数。你们的护城河是什么？48 个月内会被并购吗？', why: '生态依赖型公司的存在性问题', expect: '差异化清晰 + 接受被并购也是合理退出路径' },
      { category: 'business', question: '14 家银行的风控数据 — 数据所有权归谁？银行是否有权在合作终止后撤回？', why: '数据壁垒的法律基础', expect: '能讲清楚数据 ownership + 不可撤回条款' },
      { category: 'fund-use', question: '$40M 中多少投牌照、多少投团队、多少投技术？',  why: '验证资金分配颗粒度', expect: '百分比 + 牌照预算与监管时间线挂钩' },
    ],
    publicComps: [
      { name: '拉卡拉', ticker: 'SZ: 300773', price: '¥26.55', reportDate: '2026-03-31', revenue: '¥16.14 亿', netIncome: '¥5.95 亿', netMargin: '36.9%', totalAssets: '¥120.91 亿', similarity: 'A 股第三方支付 + 商户嵌入式金融', distance: '拉卡拉 36.9% 净利率反映成熟支付 SaaS 的盈利能力天花板；NeoBank 东南亚扩张期净利率会暂时为负，但牌照成本摊销后 5 年内可对标', verified: true, source: 'akshare · 东方财富', lastFetched: '2026-04-24', reportUrl: 'https://static.cninfo.com.cn/finalpage/2025-04-25/1223276421.PDF', prospectusUrl: 'https://static.cninfo.com.cn/finalpage/2019-04-15/1206015151.PDF' },
    ],
    compsTakeaway: 'A 股最相近对标拉卡拉（300773）净利率 36.9% 是支付 SaaS 的成熟盈利模型。NeoBank 当前 16x ARR 估值高于成熟期可比，反映对东南亚增长溢价的定价；IC 应辩论：愿意为"印尼牌照 + 增长" 双重 unverified 假设支付多少溢价。',
  },

  // ────────────────────────── MetaMed Health ──────────────────────────
  'metamed-health': {
    benchmarkLabel: 'Medical AI · Seed · 中国样本 N=34（艾瑞 2025）',
    benchmarkMedian: SEG.healthSeed.median,
    benchmarkTopQuartile: SEG.healthSeed.top,
    dimensionDetails: {
      team: {
        rationale: 'DeepMind Health × 华西医院的组合是国内放射 AI 创业稀缺资产。',
        evidence: [
          'Dr. Chen Ying：DeepMind Health Radiology Lead 2021-2024，Nature Medicine 一作 2 篇',
          'Dr. Wang Lei：华西医院影像科副主任医师，标注数据集来源可控',
          '团队 18 人，临床医生 + 算法工程师比例 4:14',
        ],
      },
      problem: {
        rationale: '中国基层影像医生缺口严重，AI 辅助诊断已被纳入医保支付探索目录。',
        evidence: [
          '国家卫健委 2025: 三级以下医院影像医生缺口 18 万',
          '上海、浙江已开始 AI 影像服务的医保按例付费试点',
        ],
      },
      financials: {
        rationale: 'Pilot 阶段 ARR $0.3M，单位经济学未验证 — 评分较低反映早期阶段的真实状况。',
        evidence: [
          '4 家三甲医院 pilot，未签付费合同',
          '24 月跑道需求 ≥ $4M，与本轮 $5M 紧贴',
        ],
      },
    },
    dataChecks: [
      { claim: '4 家 Top 10 三甲医院 pilot', external: '与 4 家医院影像科主任电话确认：3 家正式 pilot，1 家在 LOI 阶段', status: 'partial', source: '医院方电话核实', note: '"4 家"略夸大 — 实际 3 家' },
      { claim: '灵敏度 94.2%', external: '论文 / 第三方测试集结果：在 ChestX-Ray14 上 91.7%，在医院私有集 94.2%', status: 'aligned', source: 'arXiv + 医院测试报告', note: '私有集结果可能存在过拟合风险' },
      { claim: '标注数据集 82,000 例', external: '医院方确认数据规模，但 IP 归属仍在协议谈判中', status: 'partial', source: '医院方', note: 'Data ownership 未最终确认是潜在 IP 风险' },
      { claim: 'NMPA 2026-Q4 获批', external: 'NMPA 审评公开排期：进入实质审查中位时长 8-14 月，2026-Q4 紧贴下限', status: 'unverified', source: 'NMPA 公开排期' },
    ],
    interviewQuestions: [
      { category: 'risk', question: 'NMPA 获批延迟 6 个月的预算冲击是多少？现金缓冲足够吗？', why: '监管时间线是核心风险', expect: '具体数字 + 应急融资 plan B' },
      { category: 'business', question: '商业模式：医院按例付费、医保支付、还是 SaaS 订阅？哪条路径已经在 LOI 中谈了？', why: '商业化路径未明是关键不确定性', expect: '至少一条路径有具体 LOI 数字' },
      { category: 'competition', question: '联影智能、推想科技已商业化，你们的差异化是产品、渠道、还是数据？给我具体的客户测试对比数据', why: '已有头部对手，差异化必须具体', expect: '具体测试集 + 头对头胜负数字' },
      { category: 'team', question: '临床顾问团队规模？签了 advisory shares 还是顾问费？保证持续投入的机制是什么？', why: '医疗 AI 没有持续临床输入会失败', expect: '具体名字 + 股权激励 + 月度投入时间' },
      { category: 'fund-use', question: '$5M 拆解：NMPA 注册费 / 数据扩充 / 团队 各多少？跑道是 18 月还是 24 月？', why: '资金颗粒度' , expect: '百分比 + 跑道与 NMPA 时间线吻合' },
    ],
    publicComps: [
      { name: '联影医疗', ticker: 'SH: 688271', price: '¥114.98', reportDate: '2025-09-30 (Q3 累计)', revenue: '¥88.59 亿', netIncome: '¥11.20 亿', netMargin: '12.6%', totalAssets: '¥297.57 亿', similarity: '医学影像设备 + AI 国产龙头', distance: '联影 12.6% 净利率反映"硬件 + AI"混合模式的盈利水平；MetaMed 纯 AI 路径理论上毛利更高（60-70%）但商业化路径未跑通，估值需以团队 + 数据资产为锚', verified: true, source: 'akshare · 东方财富', lastFetched: '2026-04-24', reportUrl: 'https://static.cninfo.com.cn/finalpage/2025-04-29/1223362977.PDF', prospectusUrl: 'https://static.cninfo.com.cn/finalpage/2022-08-16/1214298793.PDF' },
    ],
    compsTakeaway: '医疗影像 AI 直接对标稀缺：联影（688271）是国内唯一上市可比，TTM 净利率 12.6%。MetaMed 当前 $22M 投前 / $0.3M Pilot ARR 计 73x，远超联影的 8x 公允锚点；建议要求估值降到 $12M 以下，或附 NMPA 获批 ratchet 条款保护下行。',
  },

  // ────────────────────────── GreenLogistics ──────────────────────────
  'green-logistics': {
    benchmarkLabel: 'Logistics SaaS + IoT · Pre-A · 中国样本 N=22',
    benchmarkMedian: SEG.logisticsPreA.median,
    benchmarkTopQuartile: SEG.logisticsPreA.top,
    dimensionDetails: {
      financials: {
        rationale: 'LTV/CAC 2.3x、毛利 42% — 显著低于 SaaS 成长期门槛（LTV/CAC≥3，毛利≥65%），单位经济学不足以支撑规模化。',
        evidence: [
          '硬件 BOM 占比高拖累毛利',
          'Top 1 客户占比 54% 触发硬红线',
          '回款账期 90+ 天，现金流压力明显',
        ],
      },
      businessModel: {
        rationale: '硬件 + SaaS 混合本质是项目制定制，规模化复制难。',
        evidence: [
          '24 个客户中 18 家有定制功能 SOW',
          '类似公司路鹰冷链 2024 年关停为前车之鉴',
        ],
      },
    },
    dataChecks: [
      { claim: '服务菜鸟、京东冷链', external: '与菜鸟运营方电话核实：合作真实但属于 POC 阶段，未进入主供应商', status: 'partial', source: '菜鸟运营 + 京东物流 BD', note: '"服务"措辞夸大' },
      { claim: 'ARR $1.8M', external: '财务报表交叉：订阅收入 $0.8M + 硬件销售 $1.0M 实质属于 one-time', status: 'gap', source: '财务尽调', note: 'BP 把硬件销售算入 ARR，不符合 SaaS 标准口径' },
      { claim: 'Top 1 客户 < 50%', external: '财务核实：实际占比 54%', status: 'gap', source: '财务报表', note: '触发机构集中度硬红线' },
    ],
    interviewQuestions: [
      { category: 'financial', question: '54% 客户集中度是硬红线。你的拆分计划：6/12/18 月分别能压到多少？', why: '硬红线必须有具体减压路径', expect: '量化时间表，否则不应进入 IC' },
      { category: 'business', question: 'ARR 口径里硬件 one-time 收入占多少？纯订阅 ARR 是多少？', why: 'BP 口径夸大，需要诚实的纯订阅数字', expect: '诚实承认偏差 + 给出真实订阅数' },
      { category: 'risk', question: '路鹰冷链 2024 关停的教训是什么？你们怎么避免同样的命运？', why: '同赛道有失败先例，必须问', expect: '具体差异化 + 财务纪律' },
    ],
    publicComps: [
      { name: '顺丰控股', ticker: 'SZ: 002352', price: '¥36.89', reportDate: '2025-12-31', revenue: '¥3,082.27 亿', netIncome: '¥111.17 亿', netMargin: '3.6%', totalAssets: '¥2,164.69 亿', similarity: '综合物流龙头 + 冷链 + 供应链数字化', distance: '顺丰 3.6% 净利率反映物流主业的薄毛利现实；任何"物流 + SaaS"混合模式估值倍数都会被主业拉低', verified: true, source: 'akshare · 东方财富', lastFetched: '2026-04-24', reportUrl: 'https://static.cninfo.com.cn/finalpage/2025-03-29/1222943385.PDF', prospectusUrl: 'https://static.cninfo.com.cn/finalpage/2024-11-19/1221769622.PDF' },
      { name: '东航物流', ticker: 'SH: 601156', price: '¥16.48', reportDate: '2025-12-31', revenue: '¥242.64 亿', netIncome: '¥26.88 亿', netMargin: '11.1%', totalAssets: '¥317.56 亿', similarity: '航空货运 + 冷链供应链', distance: '专业冷链物流净利率 11.1% 是上限；GreenLogistics 当前毛利 42% 远低于此', verified: true, source: 'akshare · 东方财富', lastFetched: '2026-04-24', reportUrl: 'https://static.cninfo.com.cn/finalpage/2025-04-17/1223112624.PDF' },
      { name: '京东物流', ticker: 'HK: 02618', price: 'HK$15.05', reportDate: '股价实时', revenue: '需港股财报接口', netIncome: '—', netMargin: '—', totalAssets: '—', similarity: '电商驱动型物流 SaaS', distance: '港股股价已抓取，财报接口 akshare 暂不支持港股，建议换 cninfo H 股年报', verified: true, source: 'akshare 实时（财报需 cninfo）', lastFetched: '2026-04-24' },
    ],
    compsTakeaway: 'A 股物流龙头净利率上限 11%（东航物流），主业 SaaS 化不会突破这个天花板。GreenLogistics 当前 $60M 投前 / $1.8M ARR = 33x 严重背离行业；建议估值压到 $15M 以下或直接 Pass。',
  },

  // ────────────────────────── CryptoVault ──────────────────────────
  'crypto-vault': {
    benchmarkLabel: 'Web3 Custody · Seed · 全球样本 N=18',
    benchmarkMedian: SEG.web3Seed.median,
    benchmarkTopQuartile: SEG.web3Seed.top,
    dimensionDetails: {
      market: {
        rationale: '"全球 Web3 托管 $4.2T" 与第三方数据差 50 倍 — TAM 严重夸大。',
        evidence: [
          'Galaxy / Coinbase Institutional 报告：全球机构托管 AUM 实际约 $80B (2025)',
          'BP 把 crypto 总市值当成"托管市场"，逻辑错误',
        ],
      },
      team: {
        rationale: 'CEO 前公司 2024 年因合规问题被关停，BP 未披露 — 诚信硬红线。',
        evidence: [
          '香港 SFC 2024 公告：前公司"未持牌经营"被命令停止',
          'Reference Check：3/3 前同事提及"信息披露问题"',
        ],
      },
    },
    dataChecks: [
      { claim: 'TAM $4.2T', external: 'Galaxy/Coinbase 数据：实际机构托管 AUM ~$80B', status: 'gap', source: '行业头部报告', note: '市场规模造假 = 硬红线' },
      { claim: '团队 11 人，世界级', external: 'LinkedIn：仅 6 人可验证，3 人无可查记录', status: 'gap', source: 'LinkedIn' },
      { claim: '估值 $80M', external: '同阶段无收入项目估值中位 $8-12M', status: 'gap', source: 'Crypto seed 估值数据库', note: '估值脱离基本面 ~7-10 倍' },
    ],
    interviewQuestions: [
      { category: 'governance', question: '前一家公司 2024 年被 SFC 命令停止 — BP 为何未披露？目前的牌照路径是什么？', why: '诚信测试 + 监管路径', expect: '诚实承认 + 完整披露 / 警惕：避而不谈 → 直接 Pass' },
      { category: 'financial', question: '$4.2T TAM 数据来源是什么？是否承认与机构数据的差距？', why: '数据真实性测试', expect: '承认偏差或给出可信来源 / 警惕：坚持夸大数据' },
    ],
    publicComps: [],
    compsTakeaway: 'A 股 / 港股暂无合规 crypto 托管对标（Coinbase / Galaxy 等美股标的需要单独接入 SEC EDGAR 数据源，本机暂未配置）。无须可比公司分析 — 多重硬红线已触发：市场数据造假、诚信问题、估值脱离基本面、合规路径空白。直接 Pass，机构记忆库存档创始人风险标签。',
  },

  // ────────────────────────── RoboCook ──────────────────────────
  'robocook': {
    benchmarkLabel: 'Restaurant Robotics · Angel · 中国样本 N=12',
    benchmarkMedian: SEG.roboticsAngel.median,
    benchmarkTopQuartile: SEG.roboticsAngel.top,
    dimensionDetails: {
      whyNow: {
        rationale: '连锁餐饮人工成本 2024 +22%，自动化时机相对成熟，但跨过 PMF 仍需 24 月 +。',
        evidence: [
          '中国餐饮协会 2025: 一线城市厨师人工成本同比 +22%',
          '海底捞 / 美团等已采购首批后厨机器人，市场教育已过早期',
        ],
      },
      financials: {
        rationale: 'Pre-revenue，$2M 不足以支撑硬件迭代到 PMF — 资金风险评分 3/10 反映真实状况。',
        evidence: [
          '原型机 1 台，BOM 成本 ~$8K，规模化 BOM 需降至 $3K',
          '硬件公司从原型到量产中位时长 28 月',
        ],
      },
    },
    dataChecks: [
      { claim: '3 家连锁 LOI', external: '电话核实：3 家中 2 家是 LOI，1 家是口头意向无书面', status: 'partial', source: '客户方核实' },
      { claim: 'CTO 来自大疆', external: 'LinkedIn 验证：曾任大疆机器人控制系统工程师 4 年', status: 'aligned', source: 'LinkedIn' },
      { claim: '2 项专利在申请', external: '专利局：2 项实用新型在受理阶段，无发明专利', status: 'partial', source: '国知局', note: '实用新型保护强度弱于发明专利' },
    ],
    interviewQuestions: [
      { category: 'fund-use', question: '$2M 能撑到什么里程碑？是产品定型、首批量产、还是首笔订单？', why: '硬件公司常见死亡谷', expect: '具体里程碑 + 跑道 / 警惕：模糊回答' },
      { category: 'team', question: '首次创业 + 团队磨合 6 月 — 如果产品 18 月内未达成，最坏情况你怎么办？', why: '心态测试', expect: '诚实承认风险 + 备选路径' },
      { category: 'business', question: '商业模式：卖硬件、按使用付费、还是订阅？为什么是这个选择？海底捞案例怎么定价？', why: '商业模式未定型是关键', expect: '至少一个模式有客户验证数字' },
    ],
    publicComps: [
      { name: '石头科技', ticker: 'SH: 688169', price: '¥118.30', reportDate: '2026-03-31', revenue: '¥42.27 亿', netIncome: '¥3.23 亿', netMargin: '7.6%', totalAssets: '¥195.93 亿', similarity: '消费级智能硬件 / 机器人', distance: '石头净利率 7.6% 反映消费机器人的薄利现实；RoboCook 后厨场景客单价更高但 BOM 成本也更高', verified: true, source: 'akshare · 东方财富', lastFetched: '2026-04-24', reportUrl: 'https://static.cninfo.com.cn/finalpage/2025-04-04/1223005304.PDF', prospectusUrl: 'https://static.cninfo.com.cn/finalpage/2020-02-17/1207308744.PDF' },
      { name: '科沃斯', ticker: 'SH: 603486', price: '¥67.80', reportDate: '2026-03-31', revenue: '¥49.02 亿', netIncome: '¥4.05 亿', netMargin: '8.3%', totalAssets: '¥180.43 亿', similarity: '家用服务机器人龙头', distance: '科沃斯 8.3% 净利率是消费机器人天花板；RoboCook 走 B 端连锁餐饮路径理论上毛利更稳但前期硬件迭代消耗大', verified: true, source: 'akshare · 东方财富', lastFetched: '2026-04-24', reportUrl: 'https://static.cninfo.com.cn/finalpage/2025-04-26/1223323879.PDF', prospectusUrl: 'https://static.cninfo.com.cn/finalpage/2018-05-15/1204943797.PDF' },
    ],
    compsTakeaway: 'A 股消费机器人龙头净利率 7-8%（石头 / 科沃斯），是硬件公司盈利天花板的真实信号。RoboCook 当前 $10M 投前对 pre-revenue 早期项目偏高；建议要求 milestone-based tranche（原型量产 + 首单签约）+ 估值降到 $6-8M。',
  },
}

export const getDealExtra = (id: string): DealExtra | undefined => dealExtras[id]
