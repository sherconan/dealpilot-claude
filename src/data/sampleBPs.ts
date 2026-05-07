// 4 个不同行业的示例 BP — 一键预填触发 LLM 真分析
// 让用户不用上传 PDF 就能完整体验 LLM 多模态分析 + Sequoia 10 + IC Memo + 创始人追问

export interface SampleBP {
  id: string
  industry: string
  emoji: string
  company: string
  tagline: string
  highlight: string
  accent: string // brand color
  text: string
}

export const SAMPLE_BPS: SampleBP[] = [
  {
    id: 'ai-infra',
    industry: 'AI Infra',
    emoji: '🧠',
    company: 'NebulaAI · 星云智能',
    tagline: '多智能体协同平台 · Series A · $120M 估值',
    highlight: 'ARR $4.8M · 38% MoM · 47 客户 · 8 项专利',
    accent: '#7c3aed',
    text: `星云智能 (NebulaAI) Series A 融资计划书

公司名称：星云智能科技（上海）有限公司
赛道：AI Infra · 多智能体协同平台
阶段：Series A
投前估值：$120M
本轮融资：$15M

【一句话定位】
为企业知识工作者打造的多智能体协同平台 — 让 AI 不只会聊天，而是能像团队一样协作完成复杂任务。

【创始团队】
- 林穆（CEO / 联合创始人）：前 Anthropic Applied Research Lead，Stanford CS PhD，多智能体 Planner 原作者
- 陈昊（CTO / 联合创始人）：前阿里云 PaaS 负责人，主导过百万级 Agent 调度系统
- Sophia Wang（COO）：前 Salesforce 大中华区客户成功总监

【市场机会】
TAM 全球 AI Agent 市场 2028 预计 $47B（Gartner 2025），中国企业 Agent SaaS $6.2B SAM。
为什么是现在：① 大模型基础能力跨过推理拐点 ② 企业从 POC 进入生产级部署窗口 ③ 国内国资云 2025-Q4 同步开放企业 Agent PaaS 接口

【关键数据】
- ARR：$4.8M（Q1 2026）
- 增长率：38% MoM 连续 6 个月
- 客户：47 家企业客户（包括 8 家 Fortune 500）
- NRR：143%
- LTV/CAC：5.2x，CAC 回收期 8 个月
- 毛利率：78%
- Daily Active Agents：8,400

【产品差异化】
- 多智能体编排为行业第一个生产级方案
- 8 项核心专利已授权（覆盖 Planner / Memory / Tool-Routing）
- 客户实测：100 Agent 并发任务成功率 91.4%（vs LangChain 78.2%）
- 已开源 agent-kernel 形成开发者社区（GitHub 2.4k stars / 4 月内）

【对标公司】
对标 Palantir（企业 AI 平台）、Snowflake（云原生数据底座）、UiPath（企业自动化）。

【风险与挑战】
- 客户集中度：Top 3 客户贡献 48% ARR，单点风险
- 美元 / 人民币双币种架构仍在设计中
- 国内大模型 API 价格战对长期毛利的影响

【融资用途】
$15M 拆分：60% 团队扩张（GPU 工程师 + GTM）、25% 自建推理基础设施、15% 国际化拓展。`
  },
  {
    id: 'fintech',
    industry: 'FinTech · 东南亚',
    emoji: '🏦',
    company: 'PesoPay · 菲律宾普惠数字银行',
    tagline: '面向蓝领工人的全栈 NeoBank · Pre-A · $40M 估值',
    highlight: '注册 320万 · MAU 86万 · 牌照 2025-Q3 拿到',
    accent: '#0ea5e9',
    text: `PesoPay · 菲律宾蓝领普惠数字银行 · Pre-A 融资 BP

【公司名】
PesoPay Digital Bank Corp（菲律宾本地法人）+ Open Source Bank Pte. Ltd.（新加坡控股）

【赛道】
FinTech · 东南亚普惠金融 · 面向蓝领工人的 NeoBank

【阶段】
Pre-A · 投前估值 $40M · 本轮 $8M

【一句话定位】
PesoPay 是菲律宾第一个以蓝领工人为核心用户的数字银行——把基础储蓄、生活支付、跨境汇款（亚洲 7 国）和小额信贷集成到一个 App 里，2 分钟完成开户。

【创始团队】
- Marco Reyes（CEO）：前 GCash COO，6 年东南亚移动支付实操
- 谭永杰（CTO）：前 Stripe Manila 工程总监，主导过百万 TPS 支付清算
- Janelle Yu（CRO）：前 BPI 风控部 VP，菲律宾本土银行 12 年经验

【市场机会】
菲律宾 1.13 亿人口，70% 无银行账户（World Bank 2024），蓝领工人海外汇款 2024 累计 $370B 流入；
为什么是现在：① 央行 2024-Q4 颁布数字银行牌照 6 张（PesoPay 持其一） ② BSP 2025-Q3 推全国 QR 联通 ③ 70% 蓝领月薪低于 ¥18,000 但持有智能机率达 89%

【关键数据】
- 注册用户：320 万（菲律宾全国）
- MAU：86 万 / 周转 ¥9.4M
- 跨境汇款 UV：14 万 / 月（亚洲 7 国 1-2 小时到账）
- ARR（手续费 + 利差）：¥48M（折合 $6.5M）
- CAC：$2.4 · LTV：$48 · LTV/CAC：20x
- 数字银行牌照：BSP 2025-Q3 拿到（牌照号 BSP-DB-2025-04）

【产品差异化】
- 唯一支持 Tagalog / Cebuano / English 三语全 AI 客服
- 跨境汇款手续费 0.6%（业界中位数 4.2%）
- 信贷模型用工资流水 + 通讯录 + GPS 工作地点等替代征信
- 已与 SM 集团（菲律宾最大零售）签 5 年独家工资发放合作

【对标公司】
菲律宾国内：GCash（蚂蚁系，估值 $5B 但聚焦 C 端钱包）、Maya Bank（PLDT 系）；
国际：印尼 SeaBank、巴西 Nubank（成立 7 年估值 $33B 上市）

【风险与挑战】
- 数字银行牌照需保持 BSP 季度合规（资本充足率 10%、风险敞口审查）
- 菲律宾比索贬值压力（2024 全年 -8.4%）
- 头部 GCash 收购阻击，可能跟进零费率战
- 政策风险：2026 大选后金融监管不确定性

【融资用途】
$8M 拆分：50% BSP 资本金补充（合规要求）、25% 技术与风控团队、15% 区域扩张到马尼拉以外、10% 储备金。`
  },
  {
    id: 'biomed',
    industry: 'BioMed · 创新药',
    emoji: '🧬',
    company: 'Synapse Therapeutics · 神经科学创新药',
    tagline: '靶向 GLP-1R/GIPR 多激动剂 · A 轮 · $80M 估值',
    highlight: '一期临床 II 期招募中 · 6 项 PCT 专利 · 上海张江',
    accent: '#dc2626',
    text: `Synapse Therapeutics · 神经科学创新药 A 轮 BP

【公司名】
诺澈生物医药（上海）有限公司 / Synapse Therapeutics, Inc.

【赛道】
创新药 · 代谢与神经科学 · 多靶点蛋白工程

【阶段】
A 轮 · 投前估值 $80M · 本轮 $25M

【一句话定位】
靶向 GLP-1R / GIPR 双激动剂的二代多肽创新药 — 减重效果对标 Mounjaro 但每周一次给药、心血管获益更显著、生产成本仅为头部一半。

【创始团队】
- 周一明（CEO / CSO）：前礼来糖尿病组首席科学家，GLP-1 论文引用过 8,000，FDA 一期 IND 主笔人
- 黄静怡（CMO）：前再鼎临床医学总监，主导过中美双地 III 期 4 项
- Dr. Aaron Kessler（联合创始人）：MIT 化学系 PI，蛋白工程平台 Genocera 创始人之一（已被默克收购）

【市场机会】
全球肥胖治疗市场 2030 预计 $130B（Allied Market Research 2024）；
中国 BMI≥28 人口 2.6 亿，糖尿病合并肥胖患者 1.2 亿；
为什么是现在：① 礼来 / 诺和诺德 GLP-1 类药物供不应求（缺口 60%） ② NMPA 加快创新药审批通道 ③ 商保覆盖减重药呼声高涨

【关键数据】
- 一期临床（中国）已完成：32 名健康志愿者，最高剂量 30mg/week 安全性 ✓
- 一期 II 期招募中（中美双地，预计 2026 Q3 完成）
- 临床前数据：DIO 小鼠模型 12 周减重 26.4%（vs 对照组 0.8%）
- 6 项 PCT 国际专利（覆盖 5 个 key amino acid 修饰位点）
- 已与 WuXi Biologics 签技术转让 MOU

【产品差异化】
- 半衰期 178 小时（vs Mounjaro 116h）— 周一次给药同等暴露量
- 体外细胞实验显示心血管线粒体保护活性显著（论文 in submission）
- 蛋白生产成本预测 $42/g（公司专有酵母平台 vs 业界 $90-180/g）

【对标公司】
礼来（Mounjaro 美国 2024 销售 $11.5B）、诺和诺德（Wegovy）、Viking Therapeutics（VK2735 临床二期）、本土 Innovent / Hansoh。

【风险与挑战】
- 临床二期失败风险（行业基准 II 期成功率 ~32%）
- 巨头礼来 / 诺和诺德专利覆盖密集（已规避 5 项核心权利要求）
- NMPA 时间线波动（一期到上市预计 60-72 月）
- A 轮后 B 轮可能需 $80M+ 启动 III 期

【融资用途】
$25M 拆分：50% 临床二期开支（中美双地 360 受试者）、25% 蛋白生产工艺放大、15% 临床前管线扩展（GLP-1R/GCGR 三激动剂）、10% 知识产权与法规事务。`
  },
  {
    id: 'consumertech',
    industry: 'Consumer · 智能硬件',
    emoji: '🍳',
    company: 'RoboCook · AI 智能厨房机器人',
    tagline: '家用全自动炒菜机 · 种子轮 · $15M 估值',
    highlight: '众筹 ¥8200万 · DAU 3.2万 · 已通过 3C 认证',
    accent: '#d97706',
    text: `RoboCook · 家用 AI 炒菜机器人 · 种子轮 BP

【公司名】
深圳萝卜厨智能科技有限公司 / RoboCook Tech Inc.

【赛道】
消费电子 · 智能家居 · AI 烹饪机器人

【阶段】
种子轮 · 投前估值 $15M · 本轮 $4M

【一句话定位】
家用全自动炒菜机器人 — 把"洗-切-炒-装"四步合一，AI 视觉识别食材自动调整火候，让做饭这件事比点外卖还简单。

【创始团队】
- 罗斌（CEO）：前小米生态链智能家居产品总监，主导过 4 款百万级爆品
- 李允（CTO）：前科沃斯算法负责人，AI 视觉与机器臂控制专家
- Chef 江一川（首席菜单师）：米其林一星主厨，米其林指南 2023 评委

【市场机会】
中国家用炒菜机 2024 销量 240 万台（Wind 数据），同比 +186%；
TAM 预测：2028 全球 $48B；
为什么是现在：① 一线城市 30+ 单身 + 双职工家庭破 8000 万 ② 食材半成品供应链成熟（盒马 / 美菜 / 叮咚一日达） ③ 端侧 AI 算力（地平线 / 寒武纪）让食材识别在 ¥3,000 价格段实现

【关键数据】
- 京东众筹首发：¥8,200 万（21 天破纪录）
- 月销：8,400 台（2026-Q1）
- DAU：3.2 万（用户每天平均启动 1.4 次）
- 复购率（菜单包）：43%
- 客单价：¥3,899（首销 ¥3,599）
- 毛利率：38%（量产后规划 48%）
- 3C / CCC / FCC 认证已通过，欧盟 CE 进行中

【产品差异化】
- 唯一带视觉识别的家用炒菜机（35 类常见食材自动识别）
- 800+ 中餐菜单（米其林主厨亲自调试）+ 用户自定义模式
- 噪音 52dB（行业平均 64dB），餐厅级油烟过滤
- 一键清洗 + 7 天免维护

【对标公司】
国内：纯米 / 苏泊尔 / 老板电器全自动炒菜锅；
国际：Suvie（美国，已 C 轮 $30M）、Moley Robotics（英国，单价 $250k 高端方向）

【风险与挑战】
- 量产爬坡：当前 SH 工厂月产能 1.2 万台，需 2 万台才达盈亏平衡
- 教育成本高：用户对"AI 厨房"概念接受度仍有 6-12 月窗口
- 巨头跟进：美的 / 九阳已立项类似产品，2026-H2 上市
- 出海合规：欧盟 CE 食品接触材料 + 美国 UL 认证为关键里程碑

【融资用途】
$4M 拆分：35% 量产爬坡（模具 + 第二家代工厂）、30% 视觉算法 + 菜单库、20% GTM（线上线下渠道）、15% 国际化合规。`
  },
]

export function getSampleById(id: string) {
  return SAMPLE_BPS.find((s) => s.id === id)
}
