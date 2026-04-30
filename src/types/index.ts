export type Stage = 'inbox' | 'review' | 'dd' | 'ic' | 'pass' | 'invested'
export type Recommendation = 'priority' | 'monitor' | 'conditional' | 'pass'
export type FlagSeverity = 'hard' | 'soft'

export interface Sequoia10 {
  mission: number
  problem: number
  solution: number
  whyNow: number
  market: number
  competition: number
  businessModel: number
  team: number
  financials: number
  vision: number
}

export interface RedFlag {
  severity: FlagSeverity
  label: string
  detail: string
  source?: string
}

export interface Founder {
  name: string
  role: string
  background: string
  highlight?: string
}

export interface Traction {
  label: string
  value: string
  delta?: string
}

export interface TimelineEvent {
  date: string
  event: string
  actor?: string
}

export interface DimensionDetail {
  rationale: string
  evidence: string[]
  signals?: string[]
}

export interface DataCheck {
  claim: string
  external: string
  status: 'aligned' | 'partial' | 'gap' | 'unverified'
  source: string
  note?: string
  verified?: boolean   // true = 信源真实接通；false = 演示占位
}

export interface InterviewQuestion {
  category: 'financial' | 'business' | 'team' | 'competition' | 'fund-use' | 'risk' | 'governance'
  question: string
  why: string
  expect: string
  watch?: string
}

export interface PublicComp {
  name: string
  ticker: string
  // 真实 API 抓取字段
  price?: string              // 股价（含币种）
  reportDate?: string         // 财报期
  revenue?: string            // 营收（含口径）
  netIncome?: string          // 净利润
  netMargin?: string          // 净利率（衍生）
  totalAssets?: string        // 总资产
  similarity: string
  distance: string
  verified?: boolean
  source?: string
  lastFetched?: string
  reportUrl?: string         // cninfo 年报 PDF 直链
  prospectusUrl?: string     // cninfo 招股说明书 PDF 直链
  // 旧字段（保留兼容，逐步弃用）
  marketCap?: string
  evRevenue?: string
  evEbitda?: string
  growth?: string
  grossMargin?: string
}


export interface DealExtra {
  benchmarkLabel: string
  benchmarkMedian: Sequoia10
  benchmarkTopQuartile: Sequoia10
  dimensionDetails: Partial<Record<keyof Sequoia10, DimensionDetail>>
  dataChecks: DataCheck[]
  interviewQuestions: InterviewQuestion[]
  publicComps: PublicComp[]
  compsTakeaway: string
}

export interface Deal {
  id: string
  name: string
  cnName: string
  tagline: string
  sector: string
  round: string
  valuation: string
  askAmount: string
  stage: Stage
  foundedYear: number
  location: string
  teamSize: number
  arr?: string
  growthRate?: string
  ltvCac?: number
  cacPayback?: string
  grossMargin?: string
  tam: string
  sam: string
  sequoia: Sequoia10
  score: number
  recommendation: Recommendation
  redFlags: RedFlag[]
  wins: string[]
  concerns: string[]
  founders: Founder[]
  traction: Traction[]
  timeline: TimelineEvent[]
  lastUpdated: string
  champion?: string
  source: string
  accentColor: string
  deepAnalysisRaw?: string  // LLM 真分析返回的 10 段完整报告（含 ===SECTION 1=== 等分隔符）
}
