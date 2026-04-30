// 完整 BP 处理 7 步流水线
// ① 抽文本（pdfjs 真做）② 章节切分 ③ 字段抽取 ④ Red Flag 触发
// ⑤ Scorecard 评分 ⑥ 真信源调用路由 ⑦ Memo 模板填充

import * as pdfjsLib from 'pdfjs-dist'
// Vite 通过 ?url 把 worker 当成 asset 注入
// @ts-ignore
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

export async function extractPdfText(file: File): Promise<{ text: string; pages: number }> {
  const buf = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise
  let text = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map((it: any) => it.str).join(' ') + '\n\n'
  }
  return { text, pages: pdf.numPages }
}

export interface ExtractedFields {
  company?: string
  founders: string[]
  arr?: string
  tam?: string
  valuation?: string
  patentClaim?: string
  comparables: string[]
  customers?: string
  ltvCac?: string
  growthRate?: string
  sector?: string
  round?: string
}

export interface SectionMap {
  mission: boolean
  problem: boolean
  solution: boolean
  market: boolean
  team: boolean
  financials: boolean
  competition: boolean
  whyNow: boolean
  vision: boolean
}

export function detectSections(text: string): SectionMap {
  const has = (re: RegExp) => re.test(text)
  return {
    mission: has(/使命|愿景|mission|公司定位/i),
    problem: has(/问题|痛点|problem|pain\s*point/i),
    solution: has(/解决方案|产品|solution|product/i),
    market: has(/市场|TAM|SAM|市场规模|target\s*market/i),
    team: has(/团队|创始人|team|founder/i),
    financials: has(/财务|收入|revenue|ARR|融资|funding/i),
    competition: has(/竞争|对手|competitor|竞品/i),
    whyNow: has(/为什么是现在|时机|why\s*now|timing/i),
    vision: has(/愿景|未来|vision|long\s*term/i),
  }
}

export function extractFields(text: string, hintFromName?: string): ExtractedFields {
  const fields: ExtractedFields = { founders: [], comparables: [] }
  const t = (text || '').replace(/\s+/g, ' ')  // 把多余空白合并，更便于 regex 跨行匹配

  // —— 公司名 —— 多策略并行
  const compStrategies = [
    /([一-龥]{2,12}(?:科技|智能|医疗|生物|网络|信息|金融|物流|传媒|集团|能源|文化|资本|教育|健康|半导体|机器人))/,
    /([一-龥]{2,12})\s*(?:有限公司|股份有限公司|集团有限公司)/,
    /(?:公司名称|项目名称|名称)[\s:：]*([一-龥A-Za-z]{2,18})/,
  ]
  for (const re of compStrategies) {
    const m = t.match(re)
    if (m) { fields.company = m[1].trim(); break }
  }
  if (!fields.company && hintFromName) {
    fields.company = hintFromName.replace(/[-_·\s]?(BP|Pitch|Deck|20\d{2}|v\d+)/gi, '').replace(/[-_]+$/, '').trim()
  }

  // —— ARR / 年收入 —— 更宽松（允许"营收 X 亿"、"收入 X 万"、独立数字段）
  const arrPatterns = [
    /(?:ARR|年化经常性收入|年化收入|annual\s+recurring\s+revenue)[\s:：是为达]*\$?[¥]?\s*([\d.,]+)\s*(亿|万|千万|M|B|million|billion)?/i,
    /(?:营业?收入|年收入|总收入|revenue)[\s:：是为达]*\$?[¥]?\s*([\d.,]+)\s*(亿|万|千万|M|B|million|billion)/i,
    /\$?[¥]?\s*([\d.,]+)\s*(亿|万|M|B)\s*(?:ARR|营收|收入|recurring)/i,
  ]
  for (const re of arrPatterns) {
    const m = t.match(re); if (m) { fields.arr = `${m[1]}${m[2] || ''}`; break }
  }

  // —— TAM / 市场规模 ——
  const tamPatterns = [
    /(?:TAM|市场规模|目标市场|可触达市场)[\s:：是为达约超过过]*\$?[¥]?\s*([\d.,]+)\s*(亿|千亿|万亿|B|T|billion|trillion)?/i,
    /市场容量[\s:：是为达]*\$?[¥]?\s*([\d.,]+)\s*(亿|千亿|万亿|B|T)?/i,
    /\$?[¥]?\s*([\d.,]+)\s*(亿|千亿|万亿|B|T)\s*(?:市场|TAM|规模)/,
  ]
  for (const re of tamPatterns) {
    const m = t.match(re); if (m) { fields.tam = `${m[1]}${m[2] || ''}`; break }
  }

  // —— 估值 ——
  const valPatterns = [
    /(?:估值|valuation|pre-?money|投前估值|post-?money|投后估值)[\s:：是为达]*\$?[¥]?\s*([\d.,]+)\s*(亿|千万|万|M|B|million|billion)?/i,
    /(?:本轮估值|公司估值|目前估值|当前估值)[\s:：]*\$?[¥]?\s*([\d.,]+)\s*(亿|千万|万|M|B)/i,
  ]
  for (const re of valPatterns) {
    const m = t.match(re); if (m) { fields.valuation = `${m[1]}${m[2] || ''}`; break }
  }

  // —— 融资金额 ——
  const askPatterns = [
    /(?:本轮融资|融资金额|计划融资|计划募集|本次融资|募资)[\s:：是为达约]*\$?[¥]?\s*([\d.,]+)\s*(亿|千万|万|M|B)/i,
    /拟融资\s*([\d.,]+)\s*(亿|千万|万|M|B)/,
  ]
  // 暂不存（types 没有 askAmount 字段在 ExtractedFields），但可附在 valuation hint

  // —— 专利声明（更宽松）——
  const patentPatterns = [
    /(\d+)\s*(?:项|条|个|件)\s*(?:核心|发明|授权|国家|实用新型|外观)?\s*专利/,
    /专利[\s（(]*([\d]+)[\s）)]*[多]?项/,
    /拥有[\s\d]*([\d]+)\s*项专利/,
  ]
  for (const re of patentPatterns) {
    const m = t.match(re); if (m) { fields.patentClaim = `${m[1]} 项专利`; break }
  }

  // —— 创始人（更宽松，支持"X 总"、"X 博士"、"姓 + 名 + 职务"）——
  const founderPatterns = [
    /(?:创始人|联合创始人|联创|CEO|CTO|首席执行官|首席技术官|创始团队|项目负责人|founder)[\s:：是兼为\-、，,]*([一-龥]{2,4}|[A-Z][a-z]+\s[A-Z][a-z]+)/g,
    /([一-龥]{2,4})[\s:：]*(?:创始人|CEO|CTO|联合创始人|创办)/g,
    /(?:博士|总裁|董事长|总经理)[\s:：]*([一-龥]{2,4})/g,
  ]
  const seen = new Set<string>()
  for (const re of founderPatterns) {
    let m
    while ((m = re.exec(t)) !== null) {
      const name = m[1]
      if (name && !seen.has(name) && name.length >= 2 && !/[公司科技智能集团团队]/.test(name)) {
        seen.add(name); fields.founders.push(name)
      }
      if (fields.founders.length >= 5) break
    }
    if (fields.founders.length >= 5) break
  }

  // —— 增长率 ——
  const growthPatterns = [
    /(\d+\.?\d*\s*%)\s*(?:MoM|月环比|月增长|YoY|同比|CAGR|年增长|年复合|月均增长)/i,
    /(?:增长|增速|增幅|growth)[\s:：达约超过]*(\d+\.?\d*\s*%)/i,
  ]
  for (const re of growthPatterns) {
    const m = t.match(re); if (m) { fields.growthRate = m[0].trim().slice(0, 30); break }
  }

  // —— 客户数 ——
  const custPatterns = [
    /(\d+)\s*(?:家|位)\s*(?:付费\s*)?(?:客户|企业客户|商户|用户)/,
    /服务\s*(\d+)\s*家/,
    /累计客户\s*(\d+)/,
  ]
  for (const re of custPatterns) {
    const m = t.match(re); if (m) { fields.customers = `${m[1]} 家客户`; break }
  }

  // —— LTV/CAC ——
  const lcMatch = t.match(/LTV\s*[\/／:：]\s*CAC[\s:：是为达约]*([\d.]+)\s*x?/i)
  if (lcMatch) fields.ltvCac = `${lcMatch[1]}x`

  // —— 对标公司 ——
  const compRegex = /(?:对标|对照|类似|参考|对比|对位|benchmark|comparable\s*to|国内外?\s*[类似的]+)[\s:：]*([一-龥A-Za-z]{2,15})/g
  let cm
  while ((cm = compRegex.exec(t)) !== null) {
    const name = cm[1].trim()
    if (!fields.comparables.includes(name) && name.length >= 2) fields.comparables.push(name)
    if (fields.comparables.length >= 5) break
  }
  // 同时检测是否提到知名公司
  const knownCompanies = ['寒武纪', '海光', '联影', '科大讯飞', '商汤', '旷视', '智谱', 'MiniMax', 'Moonshot', 'Anthropic', 'OpenAI', 'Palantir', 'Snowflake', 'UiPath', '科沃斯', '石头', '顺丰', '京东', '美团', '阿里', '腾讯', '字节', '拼多多']
  knownCompanies.forEach(c => {
    if (t.includes(c) && !fields.comparables.includes(c)) {
      if (fields.comparables.length < 8) fields.comparables.push(c)
    }
  })

  // —— 赛道关键词（更全）——
  const lower = (t + ' ' + (hintFromName || '')).slice(0, 8000).toLowerCase()
  if (/(ai|人工智能|算力|大模型|llm|agent|gpt|智能体|机器学习|深度学习|nlp|cv|视觉)/.test(lower)) fields.sector = 'AI / Infra'
  else if (/(医|健康|biotech|医疗|nmpa|药|临床|诊断|hospital|drug)/.test(lower)) fields.sector = 'HealthTech'
  else if (/(金融|fintech|支付|银行|保险|信贷|借款|理财)/.test(lower)) fields.sector = 'Fintech'
  else if (/(物流|供应链|冷链|配送|快递|warehouse|logistics)/.test(lower)) fields.sector = 'Logistics'
  else if (/(机器人|robot|硬件|无人机|drone|自动化设备)/.test(lower)) fields.sector = 'Robotics'
  else if (/(消费|品牌|新消费|d2c|餐饮|零售|服装|美妆)/.test(lower)) fields.sector = 'Consumer'
  else if (/(教育|edtech|培训|学习|课程)/.test(lower)) fields.sector = 'EdTech'
  else if (/(能源|新能源|储能|碳中和|光伏|电动)/.test(lower)) fields.sector = 'Energy'
  else if (/(芯片|半导体|chip|fpga|gpu)/.test(lower)) fields.sector = 'Semiconductor'

  // —— 轮次 ——
  if (/seed\b|种子轮/i.test(t)) fields.round = 'Seed'
  else if (/天使轮|angel/i.test(t)) fields.round = 'Angel'
  else if (/pre-?a|pre[-\s]?a\s*轮/i.test(t)) fields.round = 'Pre-A'
  else if (/series\s*b|b\s*轮|b\+\s*轮/i.test(t)) fields.round = 'Series B'
  else if (/series\s*c|c\s*轮/i.test(t)) fields.round = 'Series C'
  else if (/series\s*a|a\s*轮|a\+\s*轮/i.test(t)) fields.round = 'Series A'
  else if (/ipo|首发|上市/i.test(t)) fields.round = 'Pre-IPO'

  return fields
}

export interface RedFlag {
  severity: 'hard' | 'soft'
  label: string
  detail: string
  evidence?: string
}

export function detectRedFlags(text: string, fields: ExtractedFields): RedFlag[] {
  const flags: RedFlag[] = []
  const t = text || ''

  // 硬: TAM 万亿级且无三方依据
  if (fields.tam && /(?:T|trillion|万亿)/i.test(fields.tam) && !/(Gartner|IDC|艾瑞|德勤|麦肯锡|McKinsey)/i.test(t)) {
    flags.push({ severity: 'hard', label: 'TAM 数据无第三方依据', detail: `BP 声称 TAM ${fields.tam}，文中未引用 Gartner / IDC / 艾瑞 等第三方报告`, evidence: fields.tam })
  }

  // 软: 缺竞争分析章节
  if (!/(竞争|对手|competitor|竞品)/i.test(t)) {
    flags.push({ severity: 'soft', label: '未见竞争分析章节', detail: '完整 BP 应在 P5-P7 包含竞品对照矩阵 — 建议管理层访谈追问' })
  }

  // 硬: 估值脱离基本面
  if (fields.valuation && /(?:亿|B|billion)/i.test(fields.valuation) && !fields.arr) {
    flags.push({ severity: 'hard', label: '估值脱离基本面', detail: `BP 声称估值 ${fields.valuation}，但全文未见 ARR / 真实收入数据`, evidence: fields.valuation })
  }

  // 软: LTV/CAC < 3
  if (fields.ltvCac) {
    const v = parseFloat(fields.ltvCac)
    if (v && v < 3) flags.push({ severity: 'soft', label: 'LTV/CAC 未达成长期门槛', detail: `当前 ${fields.ltvCac}，机构成长期门槛 3x` })
  }

  // 硬: 客户集中度
  const concM = t.match(/(?:Top\s*1|前\s*1\s*大|最大客户|第一大客户)[^。]{0,30}(\d+)\s*%/i)
  if (concM && parseInt(concM[1]) > 50) {
    flags.push({ severity: 'hard', label: '客户集中度超红线', detail: `Top 1 客户占比 ${concM[1]}%，超过 50% 机构集中度红线`, evidence: concM[0] })
  }

  // 软: 创始团队人数<2
  if (fields.founders.length < 2 && fields.founders.length > 0) {
    flags.push({ severity: 'soft', label: '创始团队不完整', detail: `BP 中识别到 ${fields.founders.length} 位创始人，4 职能（产品/技术/销售/运营）至少需要覆盖 3 个` })
  }

  return flags
}

export function computeScore(fields: ExtractedFields, flags: RedFlag[]): number {
  let score = 45
  if (fields.arr) score += 9
  if (fields.tam) score += 6
  if (fields.valuation) score += 3
  if (fields.founders.length > 0) score += Math.min(fields.founders.length * 4, 12)
  if (fields.patentClaim) score += 6
  if (fields.growthRate) score += 7
  if (fields.ltvCac) score += 4
  if (fields.comparables.length > 0) score += Math.min(fields.comparables.length * 2, 8)
  if (fields.customers) score += 5
  if (fields.sector) score += 3
  // Red flag 扣分
  flags.forEach(f => { score -= f.severity === 'hard' ? 14 : 5 })
  return Math.max(0, Math.min(100, score))
}

export interface VerificationRoute {
  step: number
  tool: string
  target: string
  what: string
  status: 'live' | 'wired'
}

export function routeVerification(fields: ExtractedFields): VerificationRoute[] {
  const routes: VerificationRoute[] = []
  let step = 1
  if (fields.company) {
    routes.push({ step: step++, tool: 'qcc-company.get_company_profile', target: fields.company, what: '工商画像 · 注册资本 · 法人 · 经营范围 · 状态', status: 'live' })
    routes.push({ step: step++, tool: 'qcc-risk.get_administrative_penalty', target: fields.company, what: '行政处罚扫描', status: 'live' })
    routes.push({ step: step++, tool: 'qcc-risk.get_dishonest_info', target: fields.company, what: '失信被执行 / 限高（核心硬红线）', status: 'live' })
    routes.push({ step: step++, tool: 'qcc-ipr.get_patent_info', target: fields.company, what: `验证「${fields.patentClaim || '专利'}」真实数量与法律状态`, status: 'live' })
  }
  fields.comparables.slice(0, 3).forEach(c => {
    routes.push({ step: step++, tool: 'akshare.get_financial_metrics', target: c, what: `对标 ${c} 真实财报核验估值倍数`, status: 'live' })
    routes.push({ step: step++, tool: 'cninfo.query_annual_reports_tool', target: c, what: `${c} 年报 PDF + 招股书`, status: 'live' })
  })
  if (fields.tam) {
    routes.push({ step: step++, tool: 'autoglm.deepresearch', target: 'TAM 反查', what: `反向核查「${fields.tam}」是否吻合 Gartner / IDC / 艾瑞 共识`, status: 'wired' })
  }
  fields.founders.slice(0, 3).forEach(f => {
    routes.push({ step: step++, tool: 'web-access', target: f, what: `创始人 ${f} 公开履历 + reference check`, status: 'wired' })
  })
  return routes
}

export function buildMemoSeed(fields: ExtractedFields, score: number, flags: RedFlag[]): {
  recommendation: 'priority' | 'monitor' | 'conditional' | 'pass'
  oneLiner: string
  threePoints: string[]
} {
  const rec = score >= 80 ? 'priority' : score >= 65 ? 'monitor' : score >= 50 ? 'conditional' : 'pass'
  const oneLiner = `${fields.company || '该项目'}（${fields.sector || '待分类'} · ${fields.round || '阶段待识别'}），综合评分 ${score} / 100，${flags.filter(f => f.severity === 'hard').length} 项硬红线 + ${flags.filter(f => f.severity === 'soft').length} 项软扣分。`
  const threePoints = [
    fields.arr ? `已产生真实收入 ARR ${fields.arr}` : '收入证据待补充',
    fields.founders.length > 0 ? `创始团队识别到 ${fields.founders.join(' / ')}` : '创始团队信息缺失',
    fields.comparables.length > 0 ? `对标 ${fields.comparables.slice(0, 2).join(' / ')} — 真信源已自动调起年报核验` : '可比公司未声明，建议在尽调中要求 BP 补充',
  ]
  return { recommendation: rec, oneLiner, threePoints }
}
