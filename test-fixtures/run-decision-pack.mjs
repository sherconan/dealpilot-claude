// Phase B: 用真实公开 BP 跑产品的 LLM pipeline，验证端到端可用性
// 模仿 src/lib/{llmAnalyze,scoringLLM,founderQuestions}.ts 的 prompt
// 直接调 Pollinations 免费通道
//
// node test-fixtures/run-decision-pack.mjs

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const POLLINATIONS = 'https://text.pollinations.ai/openai'

const bpText = await fs.readFile(path.join(__dirname, 'moonshot-ai-bp.md'), 'utf-8')
console.log(`[bp] loaded ${bpText.length} chars`)

// ─── 抄 src/lib/pdfPipeline.ts 的字段抽取 ──────────────────────────────────
function extractFields(text, hint) {
  const f = { founders: [], comparables: [] }
  const m = (re) => (text.match(re)?.[1] || '').trim()
  f.company = m(/公司全称[：:]\s*([^\n（(]+)/) || m(/公司[：:]\s*([^\n]+)/) || hint
  f.sector = m(/赛道[：:]\s*([^\n]+)/)
  f.round = m(/轮次性质[：:]\s*([^\n]+)/) || m(/A2|Series\s*[A-Z]\d?/i)
  f.valuation = m(/投后估值[：:]\s*([^\n（]+)/)
  f.arr = m(/月调用量[：:]?\s*([^\n]+)/)
  f.tam = m(/TAM[：:]?\s*([^\n]+)/)
  f.growthRate = m(/月环比增长\s*(\d+%)/)
  f.customers = m(/B 端公开案例[^\n]*[:：]\s*([^\n]+)/) || m(/客户[：:]\s*([^\n]+)/)
  f.patentClaim = m(/已申请大模型相关专利[^\n]*?约\s*(\d+)/)
  // 创始人粗抽
  const founderRe = /(\S{2,4})\s*·\s*(创始人|联合创始人|CEO|CTO|首席科学家)/g
  let mm
  while ((mm = founderRe.exec(text))) f.founders.push(`${mm[1]}(${mm[2]})`)
  // 对标
  const comp = text.match(/对标公司[\s\S]*?(?=\n##|\n---)/)
  if (comp) {
    const lines = comp[0].split('\n').filter(l => l.startsWith('- **'))
    f.comparables = lines.map(l => (l.match(/\*\*([^*]+)\*\*/)?.[1] || '').trim()).filter(Boolean)
  }
  return f
}

function detectRedFlags(text, fields) {
  const flags = []
  if (/价格战|价格已经被打到|¥1\/百万|低价竞争/.test(text))
    flags.push({ severity: 'soft', label: '行业价格战风险', detail: '国内大模型 API 价格战，可能压制毛利' })
  if (/受美国出口管制|高端 GPU/.test(text))
    flags.push({ severity: 'hard', label: '算力供应链卡脖子', detail: '高端 GPU 受美国出口管制' })
  if (/付费转化率仍偏低|付费转化率约 1\.\d%/.test(text))
    flags.push({ severity: 'soft', label: 'C 端变现率偏低', detail: '付费转化率 1.2% 显著低于 SaaS 平均' })
  if (/创始人.*分身乏术|同时担任/.test(text))
    flags.push({ severity: 'soft', label: '创始人精力分散', detail: 'CEO 同时承担算法 leader，关键人风险' })
  return flags
}

const fields = extractFields(bpText, 'Moonshot AI')
const redFlags = detectRedFlags(bpText, fields)
console.log('[fields]', JSON.stringify(fields, null, 2))
console.log('[redFlags]', JSON.stringify(redFlags, null, 2))

// ─── Prompt 1: 10 段深度分析 ──────────────────────────────────────────────
const SECTION_KEYS = [
  'COMPANY_OVERVIEW','PROBLEM_OPPORTUNITY','PRODUCT_SOLUTION','BUSINESS_MODEL',
  'MARKET_ANALYSIS','TEAM_EVALUATION','TRACTION_FINANCIALS','RISKS_REDFLAGS',
  'INVESTMENT_THESIS','NEXT_STEPS'
]

function buildDeepPrompt(text, fields, flags) {
  const truncated = text.length > 8000 ? text.slice(0, 8000) + '\n…[截断]' : text
  const fieldsSummary = Object.entries(fields).filter(([_,v])=>v && v.length).map(([k,v])=>`${k}：${v}`).join('\n')
  const flagsSummary = flags.length ? flags.map(f=>`[${f.severity==='hard'?'硬':'软'}] ${f.label}：${f.detail}`).join('\n') : '本地未触发红线'
  return `你是国内顶级 VC 投资分析师，为投委会撰写 BP 深度分析。基于真实 BP 内容生成完整 10 段。

【规则】
1. 只基于下方真实内容分析，不要编造数据。
2. 每段 250-400 字，专业、有洞察。
3. 必须用 ===SECTION 1=== ... ===SECTION 10=== 严格分隔。
4. 章节顺序：①公司画像 ②问题与机会 ③产品方案 ④商业模式 ⑤市场竞争 ⑥团队 ⑦牵引财务 ⑧风险红线 ⑨投资论点 ⑩尽调建议

【BP 内容】
${truncated}

【字段】
${fieldsSummary}

【红线】
${flagsSummary}

现在按 ===SECTION N=== 输出 10 段：`
}

// ─── Prompt 2: Sequoia 10 评分 ────────────────────────────────────────────
const SCORING_PROMPT = `你是国内顶级 VC 投资分析师。基于 BP 真实内容按 Sequoia 10 要素打分（0-10）+ 评分依据（30-80 字）。

输出严格 JSON 数组，无 markdown：
[{"key":"mission","score":N,"rationale":"...","evidence":"..."},...共 10 个]
key 顺序：mission,problem,solution,whyNow,market,competition,businessModel,team,financials,vision`

// ─── Prompt 3: 创始人 8 题 ────────────────────────────────────────────────
const QUESTION_PROMPT = `你是国内顶级 VC 合伙人，准备与 BP 公司的创始人面谈。基于 BP 真实内容生成 8 个最锐利的访谈问题。

输出严格 JSON 数组，无 markdown：
[{"category":"financial|business|team|competition|risk|fund-use|governance","question":"...","why":"...","expect":"...","watch":"..."},...共 8 个]

要求：基于 BP 具体数字提问，不通用模板；分布：财务 2 / 业务 2 / 团队 1 / 竞争 1 / 风险 1 / 资金用途 1`

// ─── Pollinations 调用 ────────────────────────────────────────────────────
async function callPollinations(systemPrompt, userPrompt, temp = 0.4, maxTokens = 8000) {
  const start = Date.now()
  const res = await fetch(POLLINATIONS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'openai',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      private: true,
      temperature: temp,
      max_tokens: maxTokens,
    }),
  })
  if (!res.ok) throw new Error(`Pollinations HTTP ${res.status}: ${await res.text()}`)
  const data = await res.json()
  const raw = data?.choices?.[0]?.message?.content || ''
  return { raw, duration: Date.now() - start }
}

function parseSections(raw) {
  const out = {}
  const splitRe = /===\s*SECTION\s*(\d+)\s*===/gi
  const parts = raw.split(splitRe)
  for (let i = 1; i < parts.length; i += 2) {
    const num = parseInt(parts[i], 10)
    if (num >= 1 && num <= 10) out[SECTION_KEYS[num - 1]] = (parts[i + 1] || '').trim()
  }
  return out
}

function parseJsonArray(raw) {
  let cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  const a = cleaned.indexOf('['), b = cleaned.lastIndexOf(']')
  if (a >= 0 && b > a) cleaned = cleaned.slice(a, b + 1)
  return JSON.parse(cleaned)
}

// ─── 跑流水线 ──────────────────────────────────────────────────────────────
console.log('\n[step 1] 调 Pollinations · 10 段深度分析（约 30-60 秒）...')
const sysAnalyst = '你是国内顶级 VC 投资分析师，专精早期项目深度评估。输出严格按指令格式。'
const deep = await callPollinations(sysAnalyst, buildDeepPrompt(bpText, fields, redFlags), 0.4)
const sections = parseSections(deep.raw)
console.log(`  ✔ ${deep.duration}ms · 切到 ${Object.keys(sections).length}/10 段`)

console.log('\n[step 2] 调 Pollinations · Sequoia 10 维度真评分...')
const truncated = bpText.length > 6000 ? bpText.slice(0, 6000) : bpText
const scoreInput = `【BP 真实文本】\n${truncated}\n\n【公司】${fields.company}\n【红线】${redFlags.map(f=>f.label).join(', ') || '无'}\n\n现在输出 10 维度 JSON 数组：`
const score = await callPollinations(SCORING_PROMPT, scoreInput, 0.3, 3000)
let scoreArr = []
try { scoreArr = parseJsonArray(score.raw) } catch (e) { console.error('[!] 评分 JSON 解析失败:', e.message, '\nraw:', score.raw.slice(0, 400)) }
console.log(`  ✔ ${score.duration}ms · 解析到 ${scoreArr.length}/10 维度`)

console.log('\n[step 3] 调 Pollinations · 8 题创始人访谈生成...')
const qInput = `【BP】\n${bpText.slice(0, 5000)}\n\n【公司】${fields.company} 【创始人】${fields.founders.join('/')}\n\n现在输出 8 题 JSON 数组：`
const qs = await callPollinations(QUESTION_PROMPT, qInput, 0.5, 2500)
let qArr = []
try { qArr = parseJsonArray(qs.raw) } catch (e) { console.error('[!] 问题 JSON 解析失败:', e.message, '\nraw:', qs.raw.slice(0, 400)) }
console.log(`  ✔ ${qs.duration}ms · 解析到 ${qArr.length} 题`)

// ─── 计算 Sequoia 加权总分 ───────────────────────────────────────────────
const weights = { mission:6,problem:8,solution:12,whyNow:8,market:14,competition:10,businessModel:14,team:16,financials:8,vision:4 }
let weighted = 0, totalW = 0
for (const d of scoreArr) {
  const w = weights[d.key] || 10
  weighted += (Number(d.score) / 10) * w
  totalW += w
}
const totalScore = Math.round((weighted / totalW) * 100)
const recommendation = totalScore >= 80 ? 'priority' : totalScore >= 65 ? 'monitor' : totalScore >= 50 ? 'conditional' : 'pass'

// ─── 输出综合 ────────────────────────────────────────────────────────────
const output = {
  meta: {
    company: fields.company,
    runAt: new Date().toISOString(),
    bpLength: bpText.length,
    pollinationsTotalMs: deep.duration + score.duration + qs.duration,
  },
  fields, redFlags,
  totalScore, recommendation,
  sequoia10: scoreArr,
  founderQuestions: qArr,
  deepAnalysisSections: sections,
  rawDebug: { deepLen: deep.raw.length, scoreLen: score.raw.length, qsLen: qs.raw.length, deepRaw: deep.raw, scoreRaw: score.raw, qsRaw: qs.raw }
}
const outPath = path.join(__dirname, 'decision-pack-moonshot.json')
await fs.writeFile(outPath, JSON.stringify(output, null, 2), 'utf-8')

console.log('\n═══════════ 决策包结果 ═══════════')
console.log(`公司: ${fields.company} · ${fields.round} · ${fields.valuation}`)
console.log(`总分: ${totalScore}/100 · 推荐: ${recommendation}`)
console.log(`Sequoia 10: ${scoreArr.map(d=>`${d.key}=${d.score}`).join(', ')}`)
console.log(`深度分析: ${Object.keys(sections).length}/10 段 · 总字数 ${Object.values(sections).join('').length}`)
console.log(`8 题访谈: ${qArr.length} 个 · 平均长度 ${Math.round(qArr.reduce((a,q)=>a+(q.question||'').length,0)/Math.max(1,qArr.length))} 字`)
console.log(`\n输出: ${outPath}`)
