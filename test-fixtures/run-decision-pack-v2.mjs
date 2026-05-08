// V2: 拆段调用绕过 Pollinations 1500 字符硬限
// 10 段 → 10 次调用 (并发 3) · 评分拆 2 次 · 问题拆 2 次
// 总耗时预计 50-80s

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const POLLINATIONS = 'https://text.pollinations.ai/openai'
const bpText = await fs.readFile(path.join(__dirname, 'moonshot-ai-bp.md'), 'utf-8')

async function call(systemPrompt, userPrompt, temp = 0.4, retries = 4) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
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
        }),
      })
      if (res.status === 429) {
        const wait = 4000 + attempt * 3000
        process.stdout.write(`(429 等${wait/1000}s)`)
        await new Promise(r => setTimeout(r, wait))
        continue
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const d = await res.json()
      const raw = d?.choices?.[0]?.message?.content || ''
      if (!raw && attempt < retries) {
        await new Promise(r => setTimeout(r, 2000))
        continue
      }
      return raw
    } catch (e) {
      if (attempt === retries) throw e
      await new Promise(r => setTimeout(r, 2000 + attempt * 1000))
    }
  }
  return ''
}

const SECTIONS = [
  { key: 'COMPANY_OVERVIEW',    label: '① 公司画像与定位' },
  { key: 'PROBLEM_OPPORTUNITY', label: '② 问题与机会判断' },
  { key: 'PRODUCT_SOLUTION',    label: '③ 产品与解决方案' },
  { key: 'BUSINESS_MODEL',      label: '④ 商业模式' },
  { key: 'MARKET_ANALYSIS',     label: '⑤ 市场规模与竞争' },
  { key: 'TEAM_EVALUATION',     label: '⑥ 团队评估' },
  { key: 'TRACTION_FINANCIALS', label: '⑦ 牵引与财务' },
  { key: 'RISKS_REDFLAGS',      label: '⑧ 风险与红线' },
  { key: 'INVESTMENT_THESIS',   label: '⑨ 投资论点' },
  { key: 'NEXT_STEPS',          label: '⑩ 尽调建议与关键问题' },
]

const truncatedBP = bpText.length > 5000 ? bpText.slice(0, 5000) : bpText
const sysAnalyst = '你是国内顶级 VC 投资分析师，专精早期项目深度评估。输出严格按指令格式，控制字数。'

// ─── Step 1: 10 段并发 (3 并发 / 批) ──
async function genSection(s) {
  const prompt = `基于下方 BP 内容，输出深度分析的「${s.label}」一段。
要求：250-400 字之间，专业洞察，不空泛、不重复 BP，含一条 actionable 判断。
直接输出段落本身，不要标题、不要前缀、不要"以下是"等过渡。

【BP 内容】
${truncatedBP}

现在输出该段：`
  const raw = await call(sysAnalyst, prompt, 0.4, 1)
  return { ...s, content: raw.trim() }
}

console.log('[step 1] 串行 10 段 LLM 调用（间隔 1.2s, 429 自动退避）...')
const t1 = Date.now()
const sectionResults = []
for (const s of SECTIONS) {
  const got = await genSection(s)
  sectionResults.push(got)
  process.stdout.write(`  ${sectionResults.length}/10 ${got.label} = ${got.content.length}字\n`)
  await new Promise(r => setTimeout(r, 1200))
}
const sectionsTime = Date.now() - t1

// ─── Step 2: 评分拆 2 次（5 维 / 次） ──
const SCORE_KEYS_A = ['mission','problem','solution','whyNow','market']
const SCORE_KEYS_B = ['competition','businessModel','team','financials','vision']
async function scoreBatch(keys, label) {
  const prompt = `基于下方 BP 真实内容，按 Sequoia 框架对【${label}】5 个维度独立打分（0-10 整数）。
输出严格 JSON 数组（无 markdown / 代码块），key 必须按下列顺序：${keys.join(',')}
[{"key":"${keys[0]}","score":N,"rationale":"30-60 字依据","evidence":"原文 30 字内"},
 ...共 5 个]

【BP 内容】
${truncatedBP}

现在输出 5 维 JSON：`
  const raw = await call(sysAnalyst, prompt, 0.3, 1)
  let cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  const a = cleaned.indexOf('['), b = cleaned.lastIndexOf(']')
  if (a >= 0 && b > a) cleaned = cleaned.slice(a, b + 1)
  try { return JSON.parse(cleaned) } catch (e) { console.error('JSON 解析失败 (', label, '):', e.message, '\n', cleaned.slice(0, 200)); return [] }
}

console.log('\n[step 2] 评分串行 2 次（前 5 维 + 后 5 维）...')
const t2 = Date.now()
const scoreA = await scoreBatch(SCORE_KEYS_A, '使命/问题/方案/时机/市场')
await new Promise(r => setTimeout(r, 1500))
const scoreB = await scoreBatch(SCORE_KEYS_B, '竞争/商业模式/团队/财务/愿景')
const scoreArr = [...scoreA, ...scoreB]
const scoreTime = Date.now() - t2
console.log(`  ✔ 拿到 ${scoreArr.length}/10 维度`)

// ─── Step 3: 问题 2 次（4 题 / 次） ──
async function questionBatch(label, themes) {
  const prompt = `你是国内顶级 VC 合伙人，准备与下方 BP 公司创始人面谈。生成 4 个【${label}】维度最锐利的访谈问题。
输出严格 JSON 数组（无 markdown）：
[{"category":"...","question":"完整问题，含 BP 具体数字","why":"为什么问 30-50 字","expect":"期望听到 30-50 字","watch":"警惕信号 30 字内可选"},
 ...共 4 个]
themes: ${themes}

【BP 内容】
${truncatedBP}

现在输出 4 题 JSON：`
  const raw = await call(sysAnalyst, prompt, 0.5, 1)
  let cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  const a = cleaned.indexOf('['), b = cleaned.lastIndexOf(']')
  if (a >= 0 && b > a) cleaned = cleaned.slice(a, b + 1)
  try { return JSON.parse(cleaned) } catch (e) { console.error('JSON 解析失败 (', label, '):', e.message); return [] }
}

console.log('\n[step 3] 问题串行 2 次（财务+业务 / 团队+竞争+风险+资金）...')
const t3 = Date.now()
const qsA = await questionBatch('财务+业务', '财务 2 题 + 业务 2 题')
await new Promise(r => setTimeout(r, 1500))
const qsB = await questionBatch('团队+竞争+风险+资金', '团队 1 + 竞争 1 + 风险 1 + 资金用途 1')
const qArr = [...qsA, ...qsB]
const qTime = Date.now() - t3
console.log(`  ✔ 拿到 ${qArr.length} 题`)

// ─── 计算 ──
const weights = { mission:6,problem:8,solution:12,whyNow:8,market:14,competition:10,businessModel:14,team:16,financials:8,vision:4 }
let weighted = 0, totalW = 0
for (const d of scoreArr) {
  const w = weights[d.key] || 10
  weighted += (Number(d.score) / 10) * w
  totalW += w
}
const totalScore = totalW > 0 ? Math.round((weighted / totalW) * 100) : 0
const recommendation = totalScore >= 80 ? 'priority' : totalScore >= 65 ? 'monitor' : totalScore >= 50 ? 'conditional' : 'pass'

// ─── 红线扫描（本地规则） ──
function detectRedFlags(text) {
  const flags = []
  if (/价格战|¥1\/百万|低价竞争/.test(text)) flags.push({ severity:'soft', label:'行业价格战风险', detail:'国内大模型 API 价格战，毛利受压' })
  if (/受美国出口管制|高端 GPU/.test(text)) flags.push({ severity:'hard', label:'算力供应链卡脖子', detail:'高端 GPU 受美国出口管制' })
  if (/付费转化率仍偏低|转化率约 1\.\d%/.test(text)) flags.push({ severity:'soft', label:'C 端变现率偏低', detail:'付费转化率 1.2% 显著低于 SaaS 平均' })
  if (/创始人.*分身|同时担任 CEO \+ 算法/.test(text)) flags.push({ severity:'soft', label:'创始人精力分散', detail:'CEO 兼任算法 leader' })
  return flags
}
const redFlags = detectRedFlags(bpText)

// ─── Reference Check 名单（基于团队/客户字段） ──
const refList = [
  { type: '前同事', who: 'Google Brain 同期', context: '验证杨植麟 NLP 方向研究风格 + 工程能力 + 团队管理潜力', priority: 'P0' },
  { type: '前同事', who: 'CMU 博士同实验室', context: '了解学术诚信、长项与盲点', priority: 'P0' },
  { type: '客户', who: '招商证券 / 华泰证券技术 PoC 负责人', context: '验证 B 端 API 实际效果 + 续约意愿 + 替换成本', priority: 'P0' },
  { type: '客户', who: '知乎 / 第一财经接入团队', context: '了解 200 万字 context 的真实使用场景与 ROI', priority: 'P1' },
  { type: '竞品', who: '智谱 / DeepSeek 模型团队', context: '行业内对 Moonshot 长文本能力的客观评价', priority: 'P1' },
  { type: '已离职', who: '前任算法工程师', context: '内部技术债务 / 训练数据来源 / 团队稳定性', priority: 'P1' },
  { type: '投资方', who: '阿里资本 / 红杉对接人', context: '老股东对追加投资的态度信号', priority: 'P2' },
]

// ─── 决策建议（Go / No-Go） ──
const verdict = (() => {
  const hard = redFlags.filter(f=>f.severity==='hard').length
  const lowDim = scoreArr.filter(d=>Number(d.score) <= 5).length
  if (totalScore >= 80 && hard === 0) return { signal: 'GREEN', label: '推荐进 30 分钟会议', reason: `综合 ${totalScore} 分 · ${hard} 硬红线 · ${lowDim} 个维度 ≤5 分` }
  if (totalScore >= 65 && hard <= 1) return { signal: 'YELLOW', label: '附条件进 30 分钟会议', reason: `综合 ${totalScore} 分 · ${hard} 硬红线，会议聚焦解决红线` }
  return { signal: 'RED', label: '建议 Pass', reason: `综合 ${totalScore} 分 · ${hard} 硬红线 · ${lowDim} 个维度 ≤5 分` }
})()

const output = {
  meta: { company: 'Moonshot AI · 月之暗面', round: 'Series A2', valuation: '$33亿 · 投后', runAt: new Date().toISOString(), totalLLMms: sectionsTime + scoreTime + qTime, breakdown: { sectionsTime, scoreTime, qTime } },
  verdict,
  totalScore, recommendation,
  redFlags,
  sequoia10: scoreArr.sort((a,b)=>['mission','problem','solution','whyNow','market','competition','businessModel','team','financials','vision'].indexOf(a.key) - ['mission','problem','solution','whyNow','market','competition','businessModel','team','financials','vision'].indexOf(b.key)),
  founderQuestions: qArr,
  deepAnalysis: sectionResults,
  referenceCheck: refList,
}

const outPath = path.join(__dirname, 'decision-pack-v2.json')
await fs.writeFile(outPath, JSON.stringify(output, null, 2), 'utf-8')

console.log('\n═══════════ 决策包 V2 (Moonshot AI) ═══════════')
console.log(`决策信号: ${verdict.signal} · ${verdict.label}`)
console.log(`理由: ${verdict.reason}`)
console.log(`总分 ${totalScore}/100 · 推荐 ${recommendation}`)
console.log(`Sequoia 10:`)
for (const d of output.sequoia10) console.log(`  ${d.key.padEnd(15)} ${d.score}/10  ${(d.rationale||'').slice(0,40)}`)
console.log(`深度分析: ${sectionResults.length}/10 段 · 总字数 ${sectionResults.reduce((a,s)=>a+s.content.length,0)} (耗时 ${sectionsTime}ms)`)
console.log(`8 题访谈: ${qArr.length} 题`)
console.log(`Reference Check: ${refList.length} 人`)
console.log(`总 LLM 时间: ${(output.meta.totalLLMms/1000).toFixed(1)}s`)
console.log(`输出: ${outPath}`)
