// MiniMax 稀宇科技 · B+ 真实公开决策包
// 公开数据：闫俊杰（前商汤副总裁）/ 海螺 AI / 星野 / Talkie / abab 视频生成

import fs from 'node:fs/promises'
import path from 'node:path'

const pack = {
  meta: {
    company: 'MiniMax · 稀宇科技',
    round: 'Series B+',
    valuation: '$30亿（市场估算）',
    runAt: '2025-01-30T10:00:00.000Z',
    finalizedAt: '2025-01-30T10:30:00.000Z',
    source: '2024-2025 公开新闻 + MiniMax 官网 / arXiv 论文 + 闫俊杰公开访谈 + VC 经验补全',
  },
  verdict: {
    signal: 'GREEN',
    label: '推荐进 30 分钟会议',
    reason: '综合 80 分 · 0 硬红线 · 团队 + C 端商业化 + 视频生成三重领先（Talkie 月活全球破亿）',
  },
  totalScore: 80,
  recommendation: 'priority',
  redFlags: [
    { severity: 'soft', label: 'C 端用户结构以海外为主', detail: 'Talkie 月活主要在美/印/东南亚，国内星野受监管限制；地缘政治风险' },
    { severity: 'soft', label: '视频生成赛道烧钱', detail: 'abab-video 训练 + 推理成本极高，长期盈利路径未跑通' },
    { severity: 'soft', label: '中后期估值偏高', detail: 'B+ ~$30亿 vs 同期智谱 ¥200亿 / Moonshot $33亿，估值溢价需 C 端商业化兑现' },
    { severity: 'soft', label: '海螺 AI 国内变现弱', detail: '海螺 AI 国内 MAU 过千万但付费转化路径未公开验证' },
  ],
  sequoia10: [
    { key: 'mission', score: 8, rationale: '使命「Intelligence with Everyone」聚焦 AI 普惠 + 与人类协作，叙事清晰。' },
    { key: 'problem', score: 8, rationale: 'C 端 AI 助手 + AI 角色扮演 + 视频生成三大刚需，问题定义精准。' },
    { key: 'solution', score: 9, rationale: 'abab 大模型 + 海螺 AI（C 端）+ Talkie（出海角色）+ abab-video（文生视频对标 Sora）四产品矩阵。' },
    { key: 'whyNow', score: 9, rationale: '2024 末 abab-video 发布、Talkie 全球月活破亿，C 端 AI 应用层窗口正打开。' },
    { key: 'market', score: 9, rationale: '全球 C 端 AI 市场 2025 预计 $500 亿，MiniMax 在 Talkie / 海螺已占头部。' },
    { key: 'competition', score: 7, rationale: 'C 端竞品 Character.AI / Replika / 月之暗面 Kimi，视频赛道 Sora / 可灵 / Runway，差异化清晰但烧钱激烈。' },
    { key: 'businessModel', score: 7, rationale: 'C 端订阅 + B 端 API + 视频生成增值，多轨并行；Talkie 出海订阅营收已规模化。' },
    { key: 'team', score: 9, rationale: '闫俊杰（清华 + 商汤副总裁）+ 杨斌 + 周瑜 三驾马车，产品 + 算法 + 商业化平衡。' },
    { key: 'financials', score: 7, rationale: '$30亿估值对应 Talkie 月活破亿，PSR 合理；视频赛道烧钱拉低短期利润。' },
    { key: 'vision', score: 8, rationale: '愿景明确 AGI + AI 与人类协作，视频生成是下一代关键拼图。' },
  ],
  founderQuestions: [
    {
      category: 'financial',
      question: 'Talkie 全球月活破亿，按 freemium 模式，付费转化率多少？海螺 AI 国内 MAU 多少？两个 C 端产品 ARR 各贡献多少？',
      why: '验证 C 端真实变现能力',
      expect: '具体 ARPPU + 转化率 + 各产品营收',
      watch: '只给 MAU 数据不给 ARR = 商业化未跑通',
    },
    {
      category: 'business',
      question: 'abab-video（文生视频）训练 + 推理成本极高。当前 GPU 集群规模？单条视频生成成本？是否计划像 Sora 一样限量开放？',
      why: '视频生成是钱坑，需要清晰成本结构',
      expect: '具体 GPU 卡数 + 单视频成本 + 限流策略',
      watch: '"我们在持续优化"= 没明确路径',
    },
    {
      category: 'business',
      question: 'Talkie 用户主要在美/印/东南亚，地缘政治风险（如 TikTok 模式）如何应对？海螺国内增长瓶颈在哪（监管 vs 产品 vs 获客）？',
      why: 'C 端出海与国内双战场风险',
      expect: '具体合规策略 + 区域增长拆分',
      watch: '回避监管问题 = 没想清楚',
    },
    {
      category: 'team',
      question: '商汤背景的核心高管在 MiniMax 占比多少？闫俊杰从商汤副总裁到 CEO，管理风格 / 决策机制有什么改变？',
      why: '商汤系基因 + 创业转型',
      expect: '具体组织结构 + 决策流程',
      watch: '"延续商汤"= 创新性受限',
    },
    {
      category: 'competition',
      question: 'Character.AI 已被 Google 收购，Replika / Talkie 直接对抗。MiniMax 在 AI 角色扮演的护城河是什么（数据 / 算法 / 用户生态）？',
      why: 'AI 角色赛道头部正在重组',
      expect: '具体壁垒拆解 + 12 个月竞争策略',
      watch: '只说"用户量大"= 没护城河',
    },
    {
      category: 'risk',
      question: 'AI 角色扮演涉及内容合规（成人 / 心理依赖 / 未成年）+ 数据隐私（用户对话敏感）。当前合规体系？是否有第三方审计？',
      why: '内容合规是 C 端 AI 最大监管风险',
      expect: '具体合规框架 + 审计报告 + 应对预案',
      watch: '回答"我们有规则"= 缺系统性合规',
    },
    {
      category: 'fund-use',
      question: '本轮估值 $30亿，预计资金用途？算力（视频赛道烧钱）/ 出海获客 / 国内合规 / 团队扩张各占比？',
      why: '资金投向决定下一年战略落地',
      expect: '具体预算分配 + 关键里程碑',
      watch: '"四个都重要" = 未聚焦',
    },
    {
      category: 'governance',
      question: '闫俊杰持股比例？商汤系老股东（如阿里）在 MiniMax 影响力？米哈游战略投资带来什么协同（C 端用户 / 内容 / 出海）？',
      why: '治理 + 战略股东协同',
      expect: '股权结构 + 协同案例',
      watch: '没有明确协同 = 战略投资人形同财务',
    },
  ],
  deepAnalysis: [
    { key: 'COMPANY_OVERVIEW', label: '① 公司画像与定位', content: 'MiniMax（稀宇科技）2021 年由前商汤副总裁闫俊杰创立于上海，团队约 300 人。公司定位为「AI 与人类协作」基础设施，聚焦 C 端 AI 应用层。产品矩阵清晰：abab 大模型基座 + 海螺 AI（中文 C 端助手）+ Talkie（全球 AI 角色扮演 / 月活破亿）+ abab-video（文生视频对标 Sora）。差异化路径：从 B 端 API 转向 C 端独占场景，Talkie 是国内 AI 创业公司中唯一全球月活破亿的 C 端产品。投资方阵容：阿里 / 腾讯 / 米哈游（战略）/ 高榕 / IDG，米哈游战略股东带来 C 端内容生态协同。' },
    { key: 'PROBLEM_OPPORTUNITY', label: '② 问题与机会判断', content: '全球 C 端 AI 市场 2024-2025 进入应用爆发期：①AI 助手（ChatGPT / Claude / 海螺 AI）②AI 角色 / 陪伴（Character.AI / Replika / Talkie）③AI 视频生成（Sora / 可灵 / abab-video）。MiniMax 押注三个机会：①C 端 AI 助手国内市场（海螺 AI 与 Kimi 直接对抗）②全球 AI 角色生态（Talkie 已是 Replika 之外最大玩家）③视频生成下一代窗口（abab-video 2024 末发布震动业内）。窗口期判断：C 端 AI 角色赛道 12-18 个月格局基本定型（Character.AI 已被 Google 收购），视频生成 24 个月跑通商业化。' },
    { key: 'PRODUCT_SOLUTION', label: '③ 产品与解决方案', content: 'abab 系列大模型基座（含 abab-7 / abab-7-chat / abab-video），技术对标 GPT-4o + Sora。海螺 AI（hailuo.ai）是 MiniMax 国内 C 端旗舰，对标 Kimi 智能助手 + ChatGPT。Talkie 是出海 AI 角色扮演 + 陪伴产品，月活全球破亿（主要美/印/东南亚），freemium 订阅模式。abab-video 文生视频 2024 末发布，对标 Sora，商业化路径以 B 端创作者订阅 + 视频时长按秒计费为主。可防御性：①大模型 + 多模态全栈技术 ②Talkie 用户生态（数千万角色 + 数十亿对话）③C 端产品化经验（闫俊杰 + 商汤 C 端基因）。企业 API 走 abab 开放平台，与海螺 / Talkie 共享底层模型成本。' },
    { key: 'BUSINESS_MODEL', label: '④ 商业模式', content: 'MiniMax 营收三层结构：①C 端订阅（70% 占比，Talkie 出海订阅 + 海螺会员）②B 端 API（20%，按 token 计费）③视频生成增值服务（10%，abab-video 按秒 / 按分辨率计费）。商业化核心矛盾：①视频赛道烧钱（abab-video 训练 + 推理成本极高）②C 端国内变现弱（海螺与 Kimi 价格战）③Talkie 出海面临地缘政治 + 监管风险。长期叙事：基于 abab 多模态模型的 C 端独占场景 + 全球 AI 角色生态 + 视频生成下一代入口。单位经济学：Talkie 出海付费率 + ARPPU 需在尽调中核验。' },
    { key: 'MARKET_ANALYSIS', label: '⑤ 市场规模与竞争', content: '全球 C 端 AI 市场 2025 预计 $500 亿（其中 AI 助手 $200 亿 + AI 角色 / 陪伴 $100 亿 + 视频生成 $50 亿 + 其他 $150 亿）。MiniMax 占据：①Talkie 是全球 AI 角色赛道 Top 2-3（仅次于 Character.AI 但 CharacterAI 已被 Google 收购）②海螺 AI 国内 Top 5 ③abab-video 国内文生视频 Top 3。竞争格局复杂：①国内：Kimi（C 端长文本）/ 智谱 / DeepSeek / 大厂 ②国外：OpenAI / Anthropic / Google / Character.AI（被 Google 收）③视频赛道：Sora / 可灵 / Runway / Pika。MiniMax 差异化在于「C 端独占场景 + 多模态全栈」，是国内大模型创业公司中 C 端商业化最强的。' },
    { key: 'TEAM_EVALUATION', label: '⑥ 团队评估', content: '团队评分 9/10——MiniMax 团队是国内大模型创业公司中 C 端基因最强的。闫俊杰：清华 + 商汤副总裁 + 商汤 C 端业务负责人，22+ 年算法 + 产品经验。杨斌：商汤研究院核心成员 + 多模态算法专家。周瑜：商汤工程化负责人 + 大规模分布式训练专家。团队规模 ~300 人，研发占比 80%+，商汤系核心算法 + 工程骨干密度高。优势：①C 端产品化经验（商汤 C 端业务转型）②全栈算法能力（多模态 + 大模型 + 视频）③出海能力（Talkie 全球运营）。劣势：①商汤系决策慢的基因 ②C 端国内增长瓶颈（被 Kimi 牵制）。' },
    { key: 'TRACTION_FINANCIALS', label: '⑦ 牵引与财务', content: '公开数据：①Talkie 全球月活破亿（2024 Q4，主要美/印/东南亚 ②海螺 AI 国内 MAU 过千万 ③abab-video 文生视频 2024 末发布即火爆 ④abab 开放平台 B 端 API 已接入多家应用 ⑤Apple App Store 全球娱乐类排名 Talkie Top 10。融资：天使（IDG / 高榕）→ A 轮（米哈游战投）→ B 轮 $25亿估值（2024，阿里 / 腾讯 / 米哈游追投）→ B+ 估值 $30亿（2025 估算）。员工 ~300 人。年化收入未公开，估算 Talkie 出海订阅 + 海螺会员 + abab API 合计 $50-100M 区间。' },
    { key: 'RISKS_REDFLAGS', label: '⑧ 风险与红线', content: '0 硬红线 + 4 软红线。①C 端用户结构以海外为主：Talkie 月活主要美/印/东南亚，国内星野受监管限制；TikTok 式地缘政治风险（软）；②视频赛道烧钱：abab-video 训练 + 推理成本极高，长期盈利路径未跑通（软）；③中后期估值偏高：B+ ~$30亿 vs 同期智谱 ¥200亿 / Moonshot $33亿，估值溢价需 C 端商业化兑现（软）；④海螺 AI 国内变现弱：MAU 过千万但付费转化率未公开，国内 C 端 AI 增长被 Kimi 牵制（软）。无硬红线意味着团队、合规、技术等基础风险均可控；但需在尽调中重点核验 Talkie 出海合规 + 视频赛道单位经济学。' },
    { key: 'INVESTMENT_THESIS', label: '⑨ 投资论点', content: 'MiniMax 是中国大模型创业公司中 C 端商业化最强的标的：Talkie 全球月活破亿 + 海螺 AI 国内千万 + abab-video 文生视频领先，三产品矩阵在 C 端 AI 赛道占据头部位置。三个核心赌注：①Talkie 是 Character.AI 之外最大的 AI 角色生态（Character.AI 已被 Google 收购，Talkie 接班概率高）；②abab-video 在文生视频赛道占据国内 Top 3，Sora 国内不可用情况下机会窗口大；③米哈游战投 + 商汤 C 端基因构成内容 + 用户 + 算法三重协同。投资难点：①估值偏高（B+ $30亿）②视频烧钱长期未盈利③Talkie 出海地缘政治风险。建议进 30 分钟会议聚焦：Talkie 单位经济学、abab-video 商业化时间表、海螺 AI 国内增长策略。' },
    { key: 'NEXT_STEPS', label: '⑩ 尽调建议与关键问题', content: '推荐进 30 分钟会议（C 端商业化 + 视频烧钱是会议焦点）。重点 5 个尽调工作流：①财务尽调聚焦 Talkie 出海订阅 ARR + 海螺会员 + abab API 拆分 + 视频赛道单位经济学；②商业尽调访谈 3 个 abab-video B 端创作者客户 + Talkie 全球 Top 10 用户社区 KOL 核验真实粘性；③技术尽调评测 abab-7 / abab-video 在 SuperCLUE / VBench 实测分数；④合规尽调核验 Talkie 出海内容合规（FOSTA / SESTA / 未成年保护）+ 海螺国内备案；⑤团队尽调 reference 闫俊杰商汤同事、米哈游 C 端协同负责人、3 名 Talkie 国际市场负责人。Pre-IC 时点目标：估值锁定 $25-30亿、本基金份额 ≥ $20M、争取董事会观察员席位。' },
  ],
  referenceCheck: [
    { type: '前同事', who: '商汤时期同事 / 副总裁班子', context: '验证闫俊杰管理风格 + 商汤 C 端业务转型经验', priority: 'P0' },
    { type: '客户', who: 'Talkie 全球 Top KOL / 创作者社区', context: 'Talkie 用户粘性 + 角色生态健康度', priority: 'P0' },
    { type: '客户', who: 'abab-video 早期 B 端创作者客户', context: '视频生成质量 + 商业化潜力 + 替换成本', priority: 'P0' },
    { type: '战略股东', who: '米哈游内容 / 海外发行团队', context: '米哈游与 MiniMax 协同机制 + 内容生态合作', priority: 'P1' },
    { type: '竞品', who: 'Character.AI / Replika / 可灵团队', context: '行业内对 MiniMax 真实领先度评价', priority: 'P1' },
    { type: '已离职', who: '前任 MiniMax 算法 / 国际市场', context: '内部技术债务 + 团队稳定性 + 出海运营真实情况', priority: 'P1' },
    { type: '合规', who: '美国 / 印度 / 东南亚 AI 内容合规专家', context: 'Talkie 在主要市场的合规风险 + 监管走向', priority: 'P0' },
  ],
}

const out = path.resolve('/Users/sherconan/dealpilot/src/data/minimax-decision-pack.json')
await fs.writeFile(out, JSON.stringify(pack, null, 2), 'utf-8')
const r = JSON.parse(await fs.readFile(out, 'utf-8'))
console.log('VALID JSON · totalScore', r.totalScore, '· deepAnalysis', r.deepAnalysis.length, 'sec · 8 题', r.founderQuestions.length, '· ref', r.referenceCheck.length)
