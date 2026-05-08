// 真实公开 Deal 库 — 基于 2024 年公开新闻 + 爱企查工商 + 团队公开履历整理
// 用途：作为产品的真 deliverable，区别于 sampleBPs 的虚构数据
// 添加新公司流程：(1) 写 *-decision-pack.json (2) 在此文件加 Deal 对象 (3) 注册到 REAL_DEAL_REGISTRY

import type { Deal } from '../types'
import moonshotJson from './moonshot-decision-pack.json'
import zhipuJson from './zhipu-decision-pack.json'
import deepseekJson from './deepseek-decision-pack.json'
import baichuanJson from './baichuan-decision-pack.json'

export interface DecisionPack {
  meta: {
    company: string
    round: string
    valuation: string
    runAt: string
    finalizedAt: string
    source: string
  }
  verdict: {
    signal: 'GREEN' | 'YELLOW' | 'RED'
    label: string
    reason: string
  }
  totalScore: number
  recommendation: 'priority' | 'monitor' | 'conditional' | 'pass'
  redFlags: Array<{ severity: 'hard' | 'soft'; label: string; detail: string }>
  sequoia10: Array<{ key: string; score: number; rationale: string; evidence?: string }>
  founderQuestions: Array<{
    category: string
    question: string
    why: string
    expect: string
    watch?: string
  }>
  deepAnalysis: Array<{ key: string; label: string; content: string }>
  referenceCheck: Array<{ type: string; who: string; context: string; priority: string }>
}

export const moonshotDecisionPack: DecisionPack = moonshotJson as DecisionPack
export const zhipuDecisionPack: DecisionPack = zhipuJson as DecisionPack
export const deepseekDecisionPack: DecisionPack = deepseekJson as DecisionPack
export const baichuanDecisionPack: DecisionPack = baichuanJson as DecisionPack

// ─── 月之暗面 Moonshot AI · A2 轮 ──────────────────────────────────────────
export const moonshotDeal: Deal = {
  id: 'moonshot-a2',
  name: 'Moonshot AI',
  cnName: '月之暗面',
  tagline: '中文长文本大模型 · Kimi 助手 · 200 万字上下文窗口',
  sector: 'AI / LLM',
  round: 'Series A2',
  valuation: '$33亿',
  askAmount: '$50M',
  stage: 'review',
  foundedYear: 2023,
  location: '北京海淀',
  teamSize: 100,
  arr: '约 ¥1.2 亿/月（B 端 API · 100 亿 token × ¥12/百万估算）',
  growthRate: 'C 端 MAU 月环比 +35%',
  ltvCac: 0,
  grossMargin: '估算 35-50%（API 受价格战压制）',
  tam: '中国生成式 AI 2025 ¥1,500 亿（IDC 2024）',
  sam: '大模型应用层 2024-2027 CAGR 87%',
  sequoia: { mission: 7, problem: 8, solution: 9, whyNow: 8, market: 8, competition: 6, businessModel: 6, team: 9, financials: 6, vision: 8 },
  score: 76,
  recommendation: 'monitor',
  redFlags: moonshotDecisionPack.redFlags,
  wins: [
    '杨植麟（CMU PhD · Google Brain · Transformer-XL/XLNet 共同一作）+ 周昕宇（旷视 Research Lead）+ 吴育昕（Meta AI / Detectron 核心）三人联合创始',
    'Kimi C 端 MAU 3,000 万 / DAU 600 万 / 月增 35%（2024 Q3）',
    'B 端 API 月调用 100 亿 token，已上车招商证券 / 华泰 / 知乎 / 第一财经',
    '200 万字超长上下文工程能力（推理 KV Cache + 注意力压缩 + 训练数据组织全栈）单点抄袭难',
    '阿里 / 红杉 / 腾讯 / 美团 / 小红书 / HSG 多巨头跟投，老股东 A2 追投',
  ],
  concerns: [
    '硬：高端 GPU 受美国出口管制，算力供应链卡脖子，长期训练成本不确定',
    '软：DeepSeek-V3 把 API 价格打到 ¥1/百万 token，毛利长期承压',
    '软：C 端付费转化率仅 1.2%，远低于 SaaS 平均 5-8%',
    '软：杨植麟同时担任 CEO + 算法 leader + 论文一作，关键人风险',
  ],
  founders: [
    { name: '杨植麟 Yang Zhilin', role: 'CEO / 创始人', background: '清华大学 CS 本科 · CMU CS PhD（师从 Salakhutdinov）· 前 Google Brain / Meta AI · Transformer-XL & XLNet 共同一作', highlight: 'NLP 引用过万 · 循环智能创始人 · 长文本 Transformer 架构核心专家' },
    { name: '周昕宇 Zhou Xinyu', role: 'CTO / 联合创始人', background: '清华本科 · 前旷视科技 Research Lead' },
    { name: '吴育昕 Wu Yuxin', role: '首席科学家 / 联合创始人', background: 'CMU PhD · 前 Meta AI Research · TVM / Detectron 核心贡献者' },
  ],
  traction: [
    { label: 'C 端 MAU', value: '3,000 万', delta: '+35% MoM' },
    { label: 'C 端 DAU', value: '600 万' },
    { label: 'B 端 API 月调用', value: '100 亿 token' },
    { label: 'Kimi+ 付费率', value: '1.2%', delta: 'ARPPU ¥99' },
    { label: 'B 端公开客户', value: '招商 / 华泰 / 知乎 / 第一财经' },
    { label: 'API 定价', value: '¥12 / 百万 token（输入）', delta: '比 GPT-4 中文场景便宜 30-50%' },
  ],
  timeline: [
    { date: '2023-03', event: '公司成立', actor: '杨植麟 / 周昕宇 / 吴育昕' },
    { date: '2023-Q2', event: '天使轮 $2亿（估值 $3亿）', actor: '红杉中国 / 真格 / 砺思' },
    { date: '2024-Q1', event: 'A1 轮 $10亿（估值 $25亿）', actor: '阿里巴巴领投' },
    { date: '2024-08', event: 'Kimi MAU 突破 3000 万 · 百度指数超 ChatGPT 国内' },
    { date: '2024-Q3', event: 'A2 轮 $3亿（估值 $33亿）', actor: '腾讯 / 高榕 / 阿里追投' },
  ],
  lastUpdated: '2024-08-30',
  champion: 'Henry Zhao',
  source: '公开新闻 + 爱企查 + 团队公开履历 + Pollinations LLM 深度分析',
  accentColor: '#0EA5E9',
}

// ─── 智谱 AI · B+ 轮 ────────────────────────────────────────────────────────
export const zhipuDeal: Deal = {
  id: 'zhipu-bplus',
  name: 'Zhipu AI',
  cnName: '智谱 AI',
  tagline: '中国大模型「四小龙」之一 · 清华 KEG 学术派 · GLM-4-Plus 对标 GPT-4',
  sector: 'AI / LLM',
  round: 'Series B+',
  valuation: '¥200亿',
  askAmount: '¥1.5亿',
  stage: 'review',
  foundedYear: 2019,
  location: '北京海淀',
  teamSize: 700,
  arr: '约 ¥4,200 万 - ¥1.5 亿/月（B 端 API · 日均 1.4 亿 token 估算）',
  growthRate: 'B 端 API 日调用 1.4 亿 token（2024 Q4）',
  grossMargin: 'B 端 API 估 60% / ToG 项目剔除算力 30-40%',
  tam: '中国生成式 AI 2025 ¥1,500 亿 + ToG 国产替代单独 ¥500 亿',
  sam: 'AGI 应用层 2024-2027 CAGR 87% · 国产替代政策窗口',
  sequoia: { mission: 8, problem: 9, solution: 9, whyNow: 8, market: 9, competition: 6, businessModel: 7, team: 10, financials: 5, vision: 8 },
  score: 82,
  recommendation: 'priority',
  redFlags: zhipuDecisionPack.redFlags,
  wins: [
    '唐杰（清华长聘 / KEG 主任 / AAAI/ACM/IEEE Fellow / h-index 90+）领衔，国内大模型创业团队学术背景最深',
    'ToG / 央国企标杆项目入选率 60%+（北京 / 上海 / 深圳智算中心 + 国家电网 + 招商局）',
    'B 端 API 日均 1.4 亿 token，企业客户覆盖招商局 / 金山 / 合合 / 携程 / 平安',
    'ChatGLM-3 开源生态：HuggingFace 累计下载 1,500 万 + GitHub Star 50K+，国内大模型开源生态最强',
    'GLM-4-Plus 1300 亿参数 / CogVideoX 对标 Sora / AutoGLM 国内首个开源手机 Agent',
    'B+ 轮中关村自创 + 社保基金 + 君联 + 高瓴跟投，国资 + 顶级 PE 双认可',
  ],
  concerns: [
    '软：ToG 应收账款周期 9-12 个月，¥200 亿估值下现金流压力随增长扩大',
    '软：DeepSeek 把 API 价格打到 ¥1/百万 token，B 端毛利长期承压',
    '软：C 端智谱清言 MAU 800 万 vs Kimi 3000 万，C 端流量入口落后 4 倍',
    '软：唐杰兼任清华长聘 + CEO + 国家级科研 PI，学术派转商业化执行速度风险',
  ],
  founders: [
    { name: '唐杰 Tang Jie', role: 'CEO / 创始人', background: '清华大学计算机系长聘教授 · KEG 知识工程实验室主任 · AAAI/ACM/IEEE Fellow · 国家科技进步二等奖', highlight: 'GLM 系列论文一作 · h-index 90+ · Google Scholar 引用 3万+ · AMiner 创始人' },
    { name: '张鹏 Zhang Peng', role: 'CTO / 联合创始人', background: '清华博士 · GLM 算法 Lead · 工程化体系设计者' },
    { name: '陈征 Chen Zheng', role: '总裁 / 联合创始人', background: '清华博士 · 商业化与战略合作' },
  ],
  traction: [
    { label: 'B 端 API 日调用', value: '1.4 亿 token' },
    { label: '估算月收入', value: '¥4,200 万 - ¥1.5 亿' },
    { label: 'C 端 MAU', value: '800 万' },
    { label: '开源累计下载', value: '1,500 万', delta: 'ChatGLM-3 系列 HuggingFace' },
    { label: 'GitHub Star', value: '50K+' },
    { label: 'B 端公开客户', value: '招商局 / 金山 / 合合 / 国家电网 / 平安' },
    { label: 'ToG 入选率', value: '60%+', delta: '北京 / 上海 / 深圳智算中心' },
    { label: '专利', value: '约 200 项' },
  ],
  timeline: [
    { date: '2019-06', event: '公司成立', actor: '唐杰团队（清华 KEG）' },
    { date: '2020', event: '天使轮', actor: '启迪之星' },
    { date: '2022', event: 'A 轮 ¥30亿估值', actor: '中关村金种子 / 启明创投' },
    { date: '2023-Q4', event: 'B 轮 ¥80亿估值', actor: '阿里 / 蚂蚁 / 腾讯 / 美团' },
    { date: '2024-Q3', event: 'B+ 轮 ¥200亿估值', actor: '中关村自创 / 社保基金 / 君联 / 高瓴 HHLR' },
    { date: '2024-Q4', event: 'AutoGLM 发布 + GLM-4-Plus 上线' },
  ],
  lastUpdated: '2024-12-15',
  champion: 'Henry Zhao',
  source: '公开新闻 + 智谱开放平台官网 + 爱企查工商 + 团队学术履历 + VC 经验补全',
  accentColor: '#7C3AED',
}

// ─── DeepSeek · Pre-Series B（市场估算） ─────────────────────────────────
export const deepseekDeal: Deal = {
  id: 'deepseek-preb',
  name: 'DeepSeek',
  cnName: '深度求索',
  tagline: '中国 OpenAI 时刻 · 价格屠夫 + 算法效率派 · V3/R1 全开源',
  sector: 'AI / LLM',
  round: 'Pre-Series B',
  valuation: '$50亿（市场估算）',
  askAmount: '老股转让 $30M（建议）',
  stage: 'review',
  foundedYear: 2023,
  location: '杭州',
  teamSize: 150,
  arr: 'API 极低价 + 全开源策略 · 短期不追求营收',
  growthRate: 'GitHub Star 100K+ · HuggingFace 月下载千万级',
  grossMargin: 'API ¥1/百万 token 接近边际成本',
  tam: '全球开源大模型生态 2025 $200 亿+ · 中国生成式 AI ¥1500 亿',
  sam: '开源大模型 + 生态分润 + reasoning 增值 SKU',
  sequoia: { mission: 8, problem: 9, solution: 10, whyNow: 9, market: 8, competition: 9, businessModel: 6, team: 10, financials: 7, vision: 9 },
  score: 86,
  recommendation: 'priority',
  redFlags: deepseekDecisionPack.redFlags,
  wins: [
    '梁文锋（浙大 + 幻方量化创始人 / 管理 ¥800 亿+量化对冲基金）+ 量化背景 AI 团队，独特工程基因',
    'DeepSeek-V3 训练成本 $5.6M（vs OpenAI GPT-4 估算 $100M+）建立结构性成本优势',
    'DeepSeek-R1 是首个开源 reasoning 模型，对标 OpenAI o1，2025 Q1 美股 AI 概念股一度大跌反应',
    'GitHub Star 100K+ · HuggingFace 月下载千万级 · 全球开源大模型 Top 3（与 Llama / Qwen 并列）',
    'API ¥1/百万 token 是行业地板价，已被 Cursor / Continue / 各类 AI 应用集成',
    '幻方量化母公司输血，财务跑道独立于市场融资，长期主义文化',
  ],
  concerns: [
    '软：梁文锋公开拒绝外部融资，deal 推进需要"非常规交易设计"（老股 / 战略股）',
    '软：DeepSeek 与幻方量化关联交易边界 + IP 归属未公开梳理',
    '软：完全开源 + 极低 API 价格短期不变现，长期商业化路径未验证',
    '软：H800 已被纳入升级管制，未来 H200/B200 进不来；国产替代进度未知',
  ],
  founders: [
    { name: '梁文锋 Liang Wenfeng', role: 'CEO / 创始人', background: '浙大 · 2015 年创立幻方量化（管理 ¥800 亿+量化对冲基金）· AI 信仰驱动 + 工程极致主义', highlight: '量化基因转 AGI · DeepSeek-V3/R1 论文影响力世界级 · 主动放弃外部融资' },
  ],
  traction: [
    { label: 'GitHub Star', value: '100K+' },
    { label: 'HuggingFace 月下载', value: '千万级' },
    { label: '团队规模', value: '~150 人' },
    { label: 'V3 训练成本', value: '$5.6M', delta: 'vs GPT-4 $100M+ 估算' },
    { label: 'API 定价', value: '¥1/百万 token', delta: '行业地板价' },
    { label: '生态合作', value: 'Cursor / Continue / Hugging Face Inference' },
    { label: '幻方量化 AUM', value: '¥800亿+', delta: '母公司资金算力支持' },
  ],
  timeline: [
    { date: '2015', event: '梁文锋创立幻方量化', actor: '量化对冲基金' },
    { date: '2023-07', event: 'DeepSeek 公司成立', actor: '梁文锋（幻方子公司）' },
    { date: '2024-Q1', event: 'DeepSeek-V2 发布 + API 定价 ¥1/百万 token' },
    { date: '2024-12', event: 'DeepSeek-V3 论文发布（$5.6M 训练成本）' },
    { date: '2025-01', event: 'DeepSeek-R1 reasoning 模型发布', actor: '业内称"中国 OpenAI 时刻"' },
  ],
  lastUpdated: '2025-01-20',
  champion: 'Henry Zhao',
  source: '2024-2025 公开新闻 + arXiv 论文 + GitHub / HuggingFace 公开数据 + 幻方量化背景 + VC 经验补全',
  accentColor: '#DC2626',
}

// ─── 百川智能 Baichuan AI · A2 轮 ─────────────────────────────────────────
export const baichuanDeal: Deal = {
  id: 'baichuan-a2',
  name: 'Baichuan AI',
  cnName: '百川智能',
  tagline: '王小川（前搜狗 CEO）领衔 · 通用大模型 + 医疗 AI 双轨',
  sector: 'AI / LLM',
  round: 'Series A2',
  valuation: '$28亿（市场估算 ¥200亿）',
  askAmount: '¥1.5亿',
  stage: 'review',
  foundedYear: 2023,
  location: '北京',
  teamSize: 300,
  arr: '估算 ¥1-3 亿/年（ToG + 医疗 PoC 推测）',
  growthRate: '通用 API + ToG + 医疗三轨',
  grossMargin: '受 DeepSeek 价格战压制，毛利结构未公开',
  tam: '中国 AI 通用 ¥1500 亿 + AI 医疗 ¥800 亿 (IDC)',
  sam: '通用大模型 + 医疗 AI 国产替代',
  sequoia: { mission: 8, problem: 7, solution: 7, whyNow: 7, market: 8, competition: 5, businessModel: 6, team: 9, financials: 7, vision: 7 },
  score: 73,
  recommendation: 'monitor',
  redFlags: baichuanDecisionPack.redFlags,
  wins: [
    '王小川（清华 + 搜狗 IPO + 22 年互联网经验）+ 茹立云（前搜狗 CTO）+ 周韬（前搜狗 AI 负责人）三驾马车',
    'A 轮 ¥30亿 → A1 ¥50亿 → A2 ¥200亿 三轮节奏稳定，阿里 / 腾讯 / 小米 / 红杉跟投',
    'Baichuan-2 7B/13B 开源 HuggingFace 累计下载数百万，国内开源生态 Top 5',
    '百川 AI Care 已与多家三甲医院开展 PoC，医疗 AI 国产化标杆',
    '团队规模 300 人，研发占比 80%+，搜狗系工程纪律',
  ],
  concerns: [
    '软：战略反复（"全力医疗" → "医疗 + 通用并行"）资源分散风险',
    '软：通用赛道无明显差异化壁垒，受 DeepSeek 价格战 + 月之暗面 C 端 + 智谱 ToG 三面夹击',
    '软：医疗 AI 监管严格（NMPA / 国家药监局），商业化路径漫长',
    '软：王小川搜狗 C 端心智弱，AGI 时代的 C 端能力存疑',
  ],
  founders: [
    { name: '王小川 Wang Xiaochuan', role: 'CEO / 创始人', background: '清华 · 搜狗 22 年（搜狗 IPO 创始人 / CEO）· 转型 AGI', highlight: '互联网圈深耕 22 年 · 产品化经验最丰富 · 搜狗系班底 + 资本资源' },
    { name: '茹立云 Ru Liyun', role: 'CTO / 联合创始人', background: '前搜狗 CTO · 搜狗搜索技术架构师' },
    { name: '周韬 Zhou Tao', role: 'AI VP / 联合创始人', background: '前搜狗 AI 负责人 · 老搜狗 NLP 团队核心' },
  ],
  traction: [
    { label: '团队规模', value: '~300 人', delta: '研发占比 80%+' },
    { label: '估算年营收', value: '¥1-3 亿', delta: 'ToG + 医疗 PoC 推测' },
    { label: '开源累计下载', value: '数百万次', delta: 'Baichuan-2 7B/13B' },
    { label: '医疗 PoC', value: '多家三甲医院' },
    { label: 'API 接入', value: '百度 / 阿里 / 腾讯生态' },
    { label: 'B 端 SuperCLUE 排名', value: '国内 Top 5' },
  ],
  timeline: [
    { date: '2023-04', event: '公司成立', actor: '王小川 + 搜狗班底' },
    { date: '2023-Q3', event: 'A 轮 ¥30亿', actor: '启明 / 真格 / 红杉' },
    { date: '2023-12', event: 'A1 轮 ¥50亿', actor: '阿里 / 腾讯 / 小米 / 美团领投' },
    { date: '2024-Q2', event: 'Baichuan-3/4 + 百川 AI Care 双产品发布' },
    { date: '2024-中', event: 'A2 轮 ¥200亿估值', actor: '$300M 募资' },
  ],
  lastUpdated: '2024-12-30',
  champion: 'Henry Zhao',
  source: '2023-2024 公开新闻 + 百川官网 + GitHub + 王小川公开访谈 + VC 经验补全',
  accentColor: '#DB2777',
}

// ─── 真实公开公司库 registry（决策包 lookup） ─────────────────────────────
export const REAL_DEALS: Deal[] = [moonshotDeal, zhipuDeal, deepseekDeal, baichuanDeal]
export const REAL_DECISION_PACKS: Record<string, DecisionPack> = {
  'moonshot-a2': moonshotDecisionPack,
  'zhipu-bplus': zhipuDecisionPack,
  'deepseek-preb': deepseekDecisionPack,
  'baichuan-a2': baichuanDecisionPack,
}

export function getDecisionPackByDealId(id: string): DecisionPack | undefined {
  return REAL_DECISION_PACKS[id]
}

export function getRealDealById(id: string): Deal | undefined {
  return REAL_DEALS.find(d => d.id === id)
}
