// 真实公开 Deal · 第一份 — 月之暗面 Moonshot AI A2 轮
// 数据来源：2024 年 3-8 月公开新闻 / 工商信息 / 团队公开履历 / Pollinations LLM 真分析
// 用途：作为产品的真 deliverable 演示，区别于 sampleBPs 的虚构数据

import type { Deal } from '../types'
import decisionPackJson from './moonshot-decision-pack.json'

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

export const moonshotDecisionPack: DecisionPack = decisionPackJson as DecisionPack

// 真实 Deal 对象 — 在 useAllDeals 里和 mockDeals 一起出现
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
  sequoia: {
    mission: 7, problem: 8, solution: 9, whyNow: 8, market: 8,
    competition: 6, businessModel: 6, team: 9, financials: 6, vision: 8,
  },
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
    {
      name: '杨植麟 Yang Zhilin',
      role: 'CEO / 创始人',
      background: '清华大学 CS 本科 · CMU CS PhD（师从 Salakhutdinov）· 前 Google Brain / Meta AI · Transformer-XL & XLNet 共同一作',
      highlight: 'NLP 引用过万 · 循环智能创始人 · 长文本 Transformer 架构核心专家',
    },
    {
      name: '周昕宇 Zhou Xinyu',
      role: 'CTO / 联合创始人',
      background: '清华本科 · 前旷视科技 Research Lead',
    },
    {
      name: '吴育昕 Wu Yuxin',
      role: '首席科学家 / 联合创始人',
      background: 'CMU PhD · 前 Meta AI Research · TVM / Detectron 核心贡献者',
    },
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
