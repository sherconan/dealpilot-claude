// V3: 在 V2 基础上把评分 / 问题进一步拆细 + 复用 V2 已拿到的段落
// 评分 5 维 → 每次 2 维（5 次调用），8 题 → 每次 2 题（4 次调用）
// 输入：v2 JSON（已有 10 段）+ BP fixture
// 输出：完整 decision-pack-final.json

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const POLLINATIONS = 'https://text.pollinations.ai/openai'
const bpText = await fs.readFile(path.join(__dirname, 'moonshot-ai-bp.md'), 'utf-8')
const v2 = JSON.parse(await fs.readFile(path.join(__dirname, 'decision-pack-v2.json'), 'utf-8'))
const truncatedBP = bpText.slice(0, 4500)

async function call(systemPrompt, userPrompt, temp = 0.4, retries = 5) {
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
        const wait = 5000 + attempt * 3000
        process.stdout.write(`(429:${wait/1000}s)`)
        await new Promise(r => setTimeout(r, wait))
        continue
      }
      if (!res.ok) {
        if (attempt === retries) throw new Error(`HTTP ${res.status}`)
        await new Promise(r => setTimeout(r, 2000))
        continue
      }
      const d = await res.json()
      const raw = d?.choices?.[0]?.message?.content || ''
      if (!raw && attempt < retries) {
        await new Promise(r => setTimeout(r, 1500))
        continue
      }
      return raw
    } catch (e) {
      if (attempt === retries) throw e
      await new Promise(r => setTimeout(r, 2000))
    }
  }
  return ''
}

function parseJsonArr(raw) {
  let c = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  const a = c.indexOf('['), b = c.lastIndexOf(']')
  if (a >= 0 && b > a) c = c.slice(a, b + 1)
  try { return JSON.parse(c) } catch { return null }
}

const SCORE_KEYS = ['mission','problem','solution','whyNow','market','competition','businessModel','team','financials','vision']
const SCORE_LABEL = { mission:'公司使命', problem:'问题', solution:'解决方案', whyNow:'时机', market:'市场潜力', competition:'竞争格局', businessModel:'商业模式', team:'团队', financials:'财务', vision:'愿景' }

// 复用 V2 已有的评分（前 5 维），补 5 个未有
const haveScores = new Map(v2.sequoia10.filter(d=>d.score!=null).map(d=>[d.key, d]))
const missingKeys = SCORE_KEYS.filter(k => !haveScores.has(k))
console.log(`[score] V2 已有: ${[...haveScores.keys()].join(',')} · 待补: ${missingKeys.join(',')}`)

async function scorePair(k1, k2) {
  const prompt = `基于 BP，对【${SCORE_LABEL[k1]}】+【${SCORE_LABEL[k2]}】2 个 Sequoia 维度打分（0-10 整数）。
极简输出（每个 rationale 控制 30-50 字）：
[{"key":"${k1}","score":N,"rationale":"30-50 字"},{"key":"${k2}","score":N,"rationale":"30-50 字"}]
不要 markdown，不要 evidence 字段。

【BP】
${truncatedBP}

输出 2 维 JSON：`
  return parseJsonArr(await call('你是顶级 VC 投资分析师，输出严格 JSON。', prompt, 0.3))
}

console.log('[step 2 redo] 评分补齐：每次 2 维...')
const newScores = []
for (let i = 0; i < missingKeys.length; i += 2) {
  const pair = missingKeys.slice(i, i + 2)
  if (pair.length === 1) {
    // 单独一个，复用 pair 接口但 k2 = k1 然后过滤
    const arr = await scorePair(pair[0], pair[0])
    if (arr) newScores.push(arr[0])
  } else {
    const arr = await scorePair(pair[0], pair[1])
    if (arr) newScores.push(...arr)
  }
  process.stdout.write(`  +${newScores.length} (last batch ${pair.join('+')})\n`)
  await new Promise(r => setTimeout(r, 1500))
}

const allScores = []
for (const k of SCORE_KEYS) {
  const v2Have = haveScores.get(k)
  const newHave = newScores.find(d=>d.key===k)
  allScores.push(v2Have || newHave || { key: k, score: 5, rationale: '（LLM 未返回，规则降级 5/10）' })
}
console.log(`[score] 最终: ${allScores.map(d=>`${d.key}=${d.score}`).join(' ')}`)

// 8 题：拆 4 次，每次 2 题
const QUESTION_BATCHES = [
  { theme: '财务', topics: '收入规模 / 单位经济学' },
  { theme: '业务', topics: '增长路径 / 客户留存' },
  { theme: '竞争+团队', topics: '竞争壁垒 / 创始人精力分配' },
  { theme: '风险+资金用途', topics: '硬红线缓释 / 募资 70% 算力分配合理性' },
]
async function genTwoQs(b) {
  const prompt = `你是 VC 合伙人，准备与该 BP 公司创始人面谈。生成 2 个【${b.theme}】维度的访谈问题，主题：${b.topics}。
极简 JSON 输出（每题字段控制在 50 字内）：
[{"category":"${b.theme.includes('+')?b.theme.split('+')[0]:b.theme}","question":"含 BP 具体数字 50-100 字","why":"30 字","expect":"30 字"},
 {"category":"...","question":"...","why":"...","expect":"..."}]
不要 markdown，不要 watch 字段，不要其他解释。

【BP】
${truncatedBP}

输出 2 题 JSON：`
  return parseJsonArr(await call('你是顶级 VC 合伙人，输出严格 JSON。', prompt, 0.5))
}

console.log('\n[step 3 redo] 8 题拆 4 批，每批 2 题...')
const allQs = []
for (const b of QUESTION_BATCHES) {
  const arr = await genTwoQs(b)
  if (arr && arr.length) allQs.push(...arr.slice(0, 2))
  process.stdout.write(`  ${b.theme}: +${arr?.length||0} (累计 ${allQs.length})\n`)
  await new Promise(r => setTimeout(r, 1500))
}
console.log(`[questions] 最终: ${allQs.length} 题`)

// 计算最终
const weights = { mission:6,problem:8,solution:12,whyNow:8,market:14,competition:10,businessModel:14,team:16,financials:8,vision:4 }
let weighted = 0, totalW = 0
for (const d of allScores) { const w = weights[d.key] || 10; weighted += (Number(d.score) / 10) * w; totalW += w }
const totalScore = Math.round((weighted / totalW) * 100)
const recommendation = totalScore >= 80 ? 'priority' : totalScore >= 65 ? 'monitor' : totalScore >= 50 ? 'conditional' : 'pass'

const final = {
  ...v2,
  totalScore, recommendation,
  sequoia10: allScores,
  founderQuestions: allQs.length ? allQs : v2.founderQuestions,
  meta: { ...v2.meta, finalizedAt: new Date().toISOString() }
}

const outPath = path.join(__dirname, 'decision-pack-final.json')
await fs.writeFile(outPath, JSON.stringify(final, null, 2), 'utf-8')

console.log('\n═══════════ 决策包 FINAL · Moonshot AI ═══════════')
console.log(`决策信号: ${final.verdict.signal} · ${final.verdict.label}`)
console.log(`总分: ${totalScore}/100 · 推荐: ${recommendation}`)
console.log(`Sequoia 10:`)
for (const d of allScores) console.log(`  ${d.key.padEnd(15)} ${d.score}/10  ${(d.rationale||'').slice(0,40)}`)
console.log(`深度分析: ${final.deepAnalysis.length}/10 段 · 总字数 ${final.deepAnalysis.reduce((a,s)=>a+s.content.length,0)}`)
console.log(`8 题访谈: ${allQs.length} · Reference Check: ${final.referenceCheck.length} 人 · 红线: ${final.redFlags.length}`)
console.log(`输出: ${outPath}`)
