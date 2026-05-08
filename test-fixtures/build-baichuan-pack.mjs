// 百川智能 Baichuan AI · A2 轮真实公开决策包
// 公开数据：王小川（前搜狗 CEO）/ Baichuan-2/3/4 系列 / 千亿+ 参数 / 医疗 + 通用双轮驱动

import fs from 'node:fs/promises'
import path from 'node:path'

const pack = {
  meta: {
    company: '百川智能 · Baichuan AI',
    round: 'Series A2',
    valuation: '$28亿（市场估算 ¥200亿）',
    runAt: '2024-12-30T10:00:00.000Z',
    finalizedAt: '2024-12-30T10:30:00.000Z',
    source: '2023-2024 公开新闻 + 百川官网 / arXiv / GitHub + 王小川公开访谈 + VC 经验补全',
  },
  verdict: {
    signal: 'YELLOW',
    label: '附条件进 30 分钟会议',
    reason: '综合 73 分 · 0 硬红线 · 团队评分高（王小川 + 搜狗班底）但商业化路径正在转换（医疗 + 通用并行未聚焦）',
  },
  totalScore: 73,
  recommendation: 'monitor',
  redFlags: [
    { severity: 'soft', label: '战略聚焦度低（医疗 + 通用并行）', detail: '2024 年从「全力做医疗」回摆到「医疗 + 通用并行」，资源分散风险' },
    { severity: 'soft', label: '通用大模型同质化', detail: '在通用赛道与四小龙 + 大厂正面对抗，无明显差异化壁垒' },
    { severity: 'soft', label: '医疗赛道商业化未跑通', detail: '医疗 AI Care 产品仍在早期，PoC 转付费转化路径未公开验证' },
    { severity: 'soft', label: '王小川搜狗背景', detail: '上一段创业（搜狗）虽 IPO 但 C 端心智弱，百川 C 端能力存疑' },
  ],
  sequoia10: [
    { key: 'mission', score: 8, rationale: '使命「帮助人类探索更广阔的世界」具备宏大叙事，但缺少差异化定位。' },
    { key: 'problem', score: 7, rationale: '通用大模型 + 医疗 AI 双轨切入，问题方向都成立但聚焦度不够。' },
    { key: 'solution', score: 7, rationale: 'Baichuan-3/4 在 SuperCLUE 国内 Top 5，技术合格但非领先；百川 AI Care 医疗模型差异化清晰。' },
    { key: 'whyNow', score: 7, rationale: '医疗 AI 的政策窗口（医疗大模型试点）+ 国产化替代窗口都在；但同质化竞争激烈。' },
    { key: 'market', score: 8, rationale: '中国 AI 医疗 2025 ¥800 亿 + 通用 AI ¥1500 亿，TAM 充足。' },
    { key: 'competition', score: 5, rationale: '通用赛道国内四小龙 + 大厂 + DeepSeek 价格战夹击，医疗赛道与医联 / 春雨 + 推想等正面对抗。' },
    { key: 'businessModel', score: 6, rationale: 'B 端 API + ToG 智算 + 医疗 SaaS 三轨模式，但每条都在早期，未跑通规模化路径。' },
    { key: 'team', score: 9, rationale: '王小川（清华 + 搜狗 IPO + 22 年互联网经验）+ 茹立云（前搜狗 CTO）+ 周韬（前搜狗 AI 负责人）三驾马车，产品化经验最丰富。' },
    { key: 'financials', score: 7, rationale: 'A 轮 ¥30 亿 + A1 轮 ¥50 亿（2023）+ A2 轮 $300M 估值 ¥200 亿（2024 中），融资节奏稳但收入规模未公开。' },
    { key: 'vision', score: 7, rationale: '愿景明确 AGI + 医疗 AI 双轨，但战略反复（"全力医疗" → "医疗+通用"）让市场困惑。' },
  ],
  founderQuestions: [
    {
      category: 'business',
      question: '2023 末百川公开宣称"全力做医疗"，2024 年中又调整为"医疗 + 通用并行"。这个战略调整的真实原因是什么？通用大模型业务的最低毛利门槛是多少？',
      why: '战略反复是 LP 关注的核心问题，需要清晰解释',
      expect: '具体战略框架 + 资源分配比例 + 各业务线毛利目标',
      watch: '"两手都要抓" = 战略不清晰，资源分散',
    },
    {
      category: 'financial',
      question: 'A2 ¥200 亿估值对应当前年化收入多少？通用 API 收入 / ToG 智算 / 医疗 SaaS 各占比？2025 年规划达到多少收入？',
      why: '估值倍数 vs 真实营收的合理性',
      expect: '具体收入拆分 + 12 个月增长目标',
      watch: '回避具体数字 = 营收不够支撑估值',
    },
    {
      category: 'team',
      question: '搜狗背景的核心高管在百川占比多少？非搜狗系的关键工程师 / 业务负责人比例？团队文化是搜狗延续还是新创业体？',
      why: '搜狗系 vs 创业基因的平衡',
      expect: '组织架构 + 关键岗位招聘策略',
      watch: '"延续搜狗团队"= 创新性受限；"完全新组建"= 王小川管控弱',
    },
    {
      category: 'business',
      question: '百川 AI Care（医疗模型）已经签了哪些三甲医院 / 医药企业 / 保险公司？年度合同规模？医疗 AI 的合规备案进度（NMPA / 国家药监局算法备案）？',
      why: '医疗赛道商业化真实进度',
      expect: '具体客户名单 + 合同规模 + 监管审批阶段',
      watch: '"在洽谈中" = 还没签真合同',
    },
    {
      category: 'competition',
      question: '通用赛道与月之暗面 / 智谱 / DeepSeek 直接对抗，百川的差异化到底在哪？医疗赛道与医联 / 春雨 / 推想的正面竞争，技术 + 数据壁垒是什么？',
      why: '没有明确护城河 = 估值天花板低',
      expect: '具体技术差异化 + 数据获取优势',
      watch: '"我们更全面" = 没护城河',
    },
    {
      category: 'risk',
      question: '医疗大模型监管极其严格（数据脱敏 + 临床应用 + 责任划分）。NMPA 备案预计什么时候完成？医疗错误判断的法律责任如何划分（公司 vs 医生）？',
      why: '医疗 AI 合规风险是赛道天花板',
      expect: '具体监管路径 + 法律意见书 + 保险方案',
      watch: '"合规没问题" = 没真正面对监管',
    },
    {
      category: 'fund-use',
      question: '本轮 $300M，预算分配到通用大模型训练 / 医疗 AI 商业化 / 算力 / 团队各多少比例？医疗团队规模目标？通用 API 价格策略（跟 DeepSeek ¥1 还是高价）？',
      why: '资金投向决定下一年战略落地',
      expect: '具体预算分布 + 关键里程碑',
      watch: '回答模糊 = 战略未对齐',
    },
    {
      category: 'governance',
      question: '王小川作为创始人 + CEO 的实际持股比例？搜狗老股东（如腾讯）在百川的影响力？董事会构成 + 决策权分配？',
      why: '治理结构决定 deal 的可执行性',
      expect: '具体股权 + 董事席位结构',
      watch: '王小川持股 < 30% = 创始人控制力弱',
    },
  ],
  deepAnalysis: [
    { key: 'COMPANY_OVERVIEW', label: '① 公司画像与定位', content: '百川智能（Baichuan AI）2023 年 4 月由前搜狗 CEO 王小川创立于北京，团队约 300 人。公司定位为"中国大模型四小龙"之一（与月之暗面 / 智谱 / 零一万物并列），主打通用大模型 + 医疗 AI 双轨战略。技术路线：Baichuan-2/3/4 系列千亿+参数大模型，开源 7B/13B 版本在 HuggingFace 累计下载数百万。商业化：通用 API + ToG 智算项目 + 百川 AI Care 医疗模型三层。融资节奏：天使 → A 轮 ¥30 亿 → A1 ¥50 亿 → A2 估值 ¥200 亿（2024 中），阿里 / 腾讯 / 小米 / 红杉跟投。' },
    { key: 'PROBLEM_OPPORTUNITY', label: '② 问题与机会判断', content: '中国大模型行业 2024 进入"应用爆发 + 价格战 + 国产替代"三重窗口。百川押注两个机会：①通用大模型的国产替代（与四小龙 + 大厂同台竞技）；②医疗 AI 的政策窗口（医疗大模型试点 + 三甲医院数字化）。机会成立但执行难度大：通用赛道同质化严重，医疗赛道监管极其严格（NMPA / 国家药监局 / 医疗责任划分）。窗口期判断：通用赛道 12 个月内格局基本定型，医疗赛道 24-36 个月才能真正商业化。' },
    { key: 'PRODUCT_SOLUTION', label: '③ 产品与解决方案', content: 'Baichuan-3/4 系列在中文 SuperCLUE / C-Eval / MMLU 国内 Top 5，技术合格但非领先（落后 GPT-4o / Claude-3.5 / DeepSeek-V3）。开源 Baichuan-7B/13B 在 HuggingFace 下载累计数百万，国内开源生态 Top 5。百川 AI Care 是医疗大模型旗舰产品，覆盖问诊辅助 + 病历整理 + 临床决策支持，已与多家三甲医院开展 PoC。技术差异化：医疗领域专项数据 + 医生专家网络。可防御性：医疗数据 + 医生专家网络在通用大模型对手处难复制；但通用大模型本身对手太多，差异化弱。' },
    { key: 'BUSINESS_MODEL', label: '④ 商业模式', content: '三层营收结构：①通用 API（按 token 计费，应对 DeepSeek 价格战压力）②ToG 智算项目（市级智算中心 + 央国企国产替代）③百川 AI Care（医疗 SaaS + 私有化部署）。商业化矛盾：通用 API 受价格战压制毛利低，ToG 项目应收账款长，医疗 SaaS 客户决策周期长（6-12 个月）。三条路径都在早期，未跑通规模化路径。长期叙事：医疗 + 通用双引擎驱动，但需要决定哪个是主战场。' },
    { key: 'MARKET_ANALYSIS', label: '⑤ 市场规模与竞争', content: '中国通用 AI 市场 2025 ¥1,500 亿（IDC）+ AI 医疗 2025 ¥800 亿（IDC + 头豹）。竞争格局：①通用赛道：月之暗面（C 端 / 长文本）/ 智谱（学术派 ToG）/ DeepSeek（价格屠夫）/ 大厂（百度 / 阿里 / 字节 / 华为）；②医疗赛道：医联 / 春雨 / 推想 / 鹰瞳 / 微医 + 互联网医院。百川在通用赛道处于 Top 6 位置，医疗赛道处于 Top 3 位置但未占主导。市场份额角度：通用 API ~5% 份额，ToG 智算 ~10%，医疗 AI 早期。' },
    { key: 'TEAM_EVALUATION', label: '⑥ 团队评估', content: '团队评分 9/10——百川的团队是国内大模型创业公司中产品化经验最丰富的。王小川：清华 / 搜狗 22 年（搜狗 IPO 创始人 / CEO）/ 转型 AGI。茹立云：前搜狗 CTO / 搜狗搜索技术架构师。周韬：前搜狗 AI 负责人 / 老搜狗 NLP 团队。团队规模约 300 人，研发占比 80%+，搜狗系核心技术骨干密度高。优势：产品化经验丰富 + 大厂背景的工程纪律 + 王小川行业资源（互联网圈深耕 22 年）。劣势：搜狗系 C 端心智本来就弱（C 端搜索市场份额一直低于百度 + 360），转型 AGI 的 C 端能力存疑；搜狗 IPO 后股价表现一般，资本市场认可度待验证。' },
    { key: 'TRACTION_FINANCIALS', label: '⑦ 牵引与财务', content: '公开数据有限：①Baichuan-2 7B/13B 开源在 HuggingFace 下载累计数百万 ②Baichuan-3/4 闭源主打 ToG 与 B 端 ③百川 AI Care 已与多家三甲医院开展 PoC ④通用 API 接入百度 / 阿里 / 腾讯生态合作伙伴。融资：天使（启明 / 真格 / 红杉）→ A 轮 ¥30 亿（2023 上半年）→ A1 ¥50 亿（2023 末，阿里 / 腾讯 / 小米 / 美团领投）→ A2 估值 ¥200 亿（$28 亿，2024 中）。员工 ~300 人。年化收入未公开披露，估算 ¥1-3 亿（基于 ToG + 医疗 PoC 推测）。' },
    { key: 'RISKS_REDFLAGS', label: '⑧ 风险与红线', content: '0 硬红线 + 4 软红线。①战略聚焦度低：2024 年中从"全力医疗"回摆到"医疗 + 通用并行"，资源分散风险（软）；②通用大模型同质化：在通用赛道无明显差异化壁垒，被 DeepSeek 价格战 + 月之暗面 C 端 + 智谱 ToG 三面夹击（软）；③医疗赛道商业化早期：百川 AI Care 仍在 PoC 转付费转化阶段，NMPA 备案路径漫长（软）；④王小川搜狗背景：上一段创业 C 端心智弱，AGI 时代的 C 端能力存疑（软）。无硬红线意味着团队、合规、法律等基础风险均可控，但战略反复需在尽调中重点核验。' },
    { key: 'INVESTMENT_THESIS', label: '⑨ 投资论点', content: '百川是中国大模型四小龙中战略最复杂的标的：团队产品化经验最丰富（王小川搜狗背景），但战略聚焦度最低（医疗 + 通用并行）。三个核心赌注：①王小川的产品化能力 + 搜狗班底的工程纪律可在 24 个月内跑出独占场景；②医疗 AI 政策窗口（NMPA 试点 + 三甲医院数字化）让百川 AI Care 占据国产医疗大模型 Top 1 位置；③通用大模型 + 医疗双引擎的协同（通用做品牌 + 医疗做收入）建立差异化护城河。投资难点：通用赛道同质化严重，医疗赛道商业化早期，估值 ¥200 亿的 multiple 偏高；建议以"附条件进会"姿态，会议聚焦战略聚焦度 + 医疗商业化进度 + 通用赛道差异化三大核心问题。' },
    { key: 'NEXT_STEPS', label: '⑩ 尽调建议与关键问题', content: '推荐附条件进 30 分钟会议（战略聚焦度 + 医疗商业化是会议焦点）。重点 5 个尽调工作流：①财务尽调聚焦各业务线收入 + 毛利 + 运营成本拆分；②商业尽调实地调研 3 个百川 AI Care 三甲医院 PoC 项目（建议北大医院 + 协和 + 复旦中山）核验商业化进度；③技术尽调评测 Baichuan-4 在 SuperCLUE / C-Eval / MMLU / Long-Bench 实测分数 vs DeepSeek-V3 / Kimi / GLM-4-Plus；④合规尽调核验百川 AI Care 的 NMPA / 国家药监局算法备案 + 医疗错误责任划分方案；⑤团队尽调 reference 王小川搜狗同事、茹立云前同事、3 名 ToG 客户技术负责人。Pre-IC 时点目标：估值锁定 ¥180-200 亿、本基金份额 ≥ ¥1.5 亿、明确战略聚焦度 + 关键里程碑。' },
  ],
  referenceCheck: [
    { type: '前同事', who: '搜狗时期同事 / 茹立云老团队', context: '验证王小川管理风格 + 搜狗班底的真实战斗力', priority: 'P0' },
    { type: '客户', who: '百川 AI Care 三甲医院 PoC 负责人', context: '医疗模型实际效果 + 商业化转化意愿 + 替换成本', priority: 'P0' },
    { type: '客户', who: 'B 端 API 客户（百度生态 / 央企 PoC）', context: 'Baichuan-3/4 真实使用体验 + 续约率', priority: 'P1' },
    { type: '竞品', who: '月之暗面 / 智谱 / DeepSeek 团队', context: '行业内对百川技术 + 商业化能力客观评价', priority: 'P1' },
    { type: '已离职', who: '前任百川算法工程师 / 业务负责人', context: '内部技术债务 + 战略反复内幕 + 团队稳定性', priority: 'P0' },
    { type: '投资方', who: '阿里 / 腾讯 / 小米 A1 老股东', context: '老股东对百川战略调整态度 + 追加投资意愿', priority: 'P2' },
    { type: '医疗专家', who: 'NMPA / 三甲医院信息化主任', context: '医疗 AI 监管现状 + 百川 AI Care 合规进度', priority: 'P0' },
  ],
}

const out = path.resolve('/Users/sherconan/dealpilot/src/data/baichuan-decision-pack.json')
await fs.writeFile(out, JSON.stringify(pack, null, 2), 'utf-8')
const r = JSON.parse(await fs.readFile(out, 'utf-8'))
console.log('VALID JSON · totalScore', r.totalScore, '· deepAnalysis', r.deepAnalysis.length, 'sec · 8 题', r.founderQuestions.length, '· ref', r.referenceCheck.length)
