// 真实公开 Deal 库 — 基于 2024 年公开新闻 + 爱企查工商 + 团队公开履历整理
// 用途：作为产品的真 deliverable，区别于 sampleBPs 的虚构数据
// 添加新公司流程：(1) 写 *-decision-pack.json (2) 在此文件加 Deal 对象 (3) 注册到 REAL_DEAL_REGISTRY

import type { Deal } from '../types'
import moonshotJson from './moonshot-decision-pack.json'
import zhipuJson from './zhipu-decision-pack.json'

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

// ─── 真实公开公司库 registry（决策包 lookup） ─────────────────────────────
export const REAL_DEALS: Deal[] = [moonshotDeal, zhipuDeal]
export const REAL_DECISION_PACKS: Record<string, DecisionPack> = {
  'moonshot-a2': moonshotDecisionPack,
  'zhipu-bplus': zhipuDecisionPack,
}

export function getDecisionPackByDealId(id: string): DecisionPack | undefined {
  return REAL_DECISION_PACKS[id]
}

export function getRealDealById(id: string): Deal | undefined {
  return REAL_DEALS.find(d => d.id === id)
}
