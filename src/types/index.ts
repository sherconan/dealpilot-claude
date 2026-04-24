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
}
