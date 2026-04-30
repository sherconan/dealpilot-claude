// 用户上传的 deal 持久化 + 全局订阅
// 存在 localStorage，跨页面共享，刷新保留

import type { Deal } from '../types'
import type { ExtractedFields, RedFlag } from './pdfPipeline'

const KEY = 'dp:userDeals'
const listeners = new Set<() => void>()

function load(): Deal[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

function save(arr: Deal[]) {
  localStorage.setItem(KEY, JSON.stringify(arr))
  listeners.forEach(fn => fn())
}

export function getUserDeals(): Deal[] { return load() }

export function addUserDeal(deal: Deal) {
  const cur = load()
  // 如果已存在 id 则替换
  const idx = cur.findIndex(d => d.id === deal.id)
  if (idx >= 0) cur[idx] = deal
  else cur.unshift(deal)
  save(cur)
}

export function removeUserDeal(id: string) {
  save(load().filter(d => d.id !== id))
}

export function clearUserDeals() {
  save([])
}

export function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  return () => { listeners.delete(cb) }
}

// React hook：返回 mockDeals + userDeals，自动响应变更
import { useEffect, useState } from 'react'
import { deals as mockDeals } from '../data/deals'

export function useAllDeals(): Deal[] {
  const [tick, setTick] = useState(0)
  useEffect(() => subscribe(() => setTick(x => x + 1)), [])
  void tick
  return [...load(), ...mockDeals]
}

export function useUserDeals(): Deal[] {
  const [tick, setTick] = useState(0)
  useEffect(() => subscribe(() => setTick(x => x + 1)), [])
  void tick
  return load()
}

// 把 PDF 抽取结果转成完整 Deal 对象 — 用真识别值 + 合理默认
export function buildDealFromExtraction(
  fields: ExtractedFields,
  redFlags: RedFlag[],
  score: number,
  fileName: string,
  pdfText: string,
): Deal {
  const ts = Date.now().toString(36)
  const company = fields.company || fileName.replace(/\.(pdf|pptx?|docx?|txt)$/i, '') || `项目-${ts}`
  const id = `user-${ts}-${company.slice(0, 8).replace(/[^a-z0-9一-龥]/gi, '-')}`
  const rec = score >= 80 ? 'priority' : score >= 65 ? 'monitor' : score >= 50 ? 'conditional' : 'pass'
  const accent = score >= 80 ? '#0f766e' : score >= 65 ? '#0ea5e9' : score >= 50 ? '#d97706' : '#dc2626'

  // 把 founders 转成 Founder 结构
  const founders = fields.founders.length > 0
    ? fields.founders.map((name, i) => ({
        name,
        role: i === 0 ? 'CEO / 创始人' : i === 1 ? 'CTO / 联合创始人' : '联合创始人',
        background: 'BP 中识别到的创始人 — 进入尽调后用 qcc-risk 真信源做 reference check',
      }))
    : []

  const traction = []
  if (fields.arr) traction.push({ label: 'ARR（BP 声称）', value: fields.arr })
  if (fields.growthRate) traction.push({ label: '增长率', value: fields.growthRate })
  if (fields.customers) traction.push({ label: '客户数', value: fields.customers })
  if (fields.ltvCac) traction.push({ label: 'LTV / CAC', value: fields.ltvCac })
  if (fields.patentClaim) traction.push({ label: '专利声明', value: fields.patentClaim })

  // 默认 Sequoia 评分（基于抽取字段做估值）
  const sequoia = {
    mission: fields.sector ? 6 : 4,
    problem: pdfText.includes('问题') || pdfText.includes('痛点') ? 7 : 4,
    solution: pdfText.includes('解决方案') || pdfText.includes('产品') ? 6 : 4,
    whyNow: pdfText.includes('时机') || pdfText.includes('Why Now') ? 6 : 4,
    market: fields.tam ? 7 : 4,
    competition: pdfText.includes('竞争') || pdfText.includes('竞品') ? 6 : 3,
    businessModel: fields.arr ? 7 : 4,
    team: founders.length >= 2 ? 7 : 4,
    financials: fields.arr ? 7 : 3,
    vision: pdfText.includes('愿景') ? 6 : 4,
  }

  return {
    id,
    name: company,
    cnName: company,
    tagline: `从「${fileName}」上传分析的真实项目（pdfjs 抽取 ${pdfText.length} 字符 → regex 字段提取 → 本地规则 Scorecard）`,
    sector: fields.sector || '待分类',
    round: fields.round || '阶段未识别',
    valuation: fields.valuation || '估值待确认',
    askAmount: '待补充',
    stage: 'inbox',
    foundedYear: 2024,
    location: '待补充',
    teamSize: founders.length || 0,
    arr: fields.arr,
    growthRate: fields.growthRate,
    ltvCac: fields.ltvCac ? parseFloat(fields.ltvCac) : undefined,
    cacPayback: '待 BP 财务页解析',
    grossMargin: '待补充',
    tam: fields.tam || '市场规模未抽取到',
    sam: '待 BP 市场章节深度解析',
    sequoia,
    score,
    recommendation: rec,
    redFlags: redFlags.map(f => ({
      severity: f.severity,
      label: f.label,
      detail: f.detail,
      source: 'pdfPipeline.detectRedFlags · 本地规则引擎',
    })),
    wins: fields.arr ? [`已识别真实收入 ARR ${fields.arr}`] : ['待 BP 进一步深度解析'],
    concerns: redFlags.length > 0 ? redFlags.map(f => f.label) : ['BP 抽取后未发现关键风险信号 — 进入尽调后需人工复核'],
    founders,
    traction: traction.length > 0 ? traction : [{ label: '待补充', value: '—' }],
    timeline: [
      { date: new Date().toISOString().slice(0, 10), event: `BP 上传：${fileName}` },
      { date: new Date().toISOString().slice(0, 10), event: `pdfjs 真实抽取 ${pdfText.length} 字符 / 字段提取 / Scorecard ${score}/100`, actor: 'pdfPipeline' },
      { date: new Date().toISOString().slice(0, 10), event: `推荐 ${rec} · 进入 inbox 待人工初筛`, actor: '规则引擎' },
    ],
    lastUpdated: '刚刚',
    champion: '—（自动分配中）',
    source: 'BP 直接上传',
    accentColor: accent,
  }
}
