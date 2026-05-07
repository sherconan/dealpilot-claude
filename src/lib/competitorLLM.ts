// LLM 生成竞品深度对比
// 基于 PDF 真内容 + 已识别对标 + 已抓取的 9 家真实 A 股可比公司财报数据

import type { Deal } from '../types'
import type { Provider } from './multimodalAnalyze'
import { PROVIDER_META } from './multimodalAnalyze'

// 已实测的 A 股可比公司财报（与 sourceProofs.ts 同源）
const REAL_COMPS = [
  { name: '寒武纪 (688256)', sector: 'AI Infra', revenue: '¥64.97 亿', netMargin: '31.7%', narrative: 'AI 算力国产替代龙头' },
  { name: '联影医疗 (688271)', sector: 'HealthTech', revenue: '¥88.59 亿', netMargin: '12.6%', narrative: '医学影像 + AI 国产龙头' },
  { name: '海光信息 (688041)', sector: 'AI Infra', revenue: '¥40.34 亿', netMargin: '17.0%', narrative: 'CPU + DCU 国产算力底座' },
  { name: '科大讯飞 (002230)', sector: 'AI', revenue: '¥52.74 亿', netMargin: '-3.2%', narrative: 'A 股 AI 应用龙头（亏损投入期）' },
  { name: '顺丰控股 (002352)', sector: 'Logistics', revenue: '¥3,082.27 亿', netMargin: '3.6%', narrative: '综合物流龙头' },
  { name: '拉卡拉 (300773)', sector: 'Fintech', revenue: '¥16.14 亿', netMargin: '36.9%', narrative: '第三方支付 + 嵌入金融' },
  { name: '东航物流 (601156)', sector: 'Logistics', revenue: '¥242.64 亿', netMargin: '11.1%', narrative: '航空货运 + 冷链' },
  { name: '石头科技 (688169)', sector: 'Robotics', revenue: '¥42.27 亿', netMargin: '7.6%', narrative: '消费机器人' },
  { name: '科沃斯 (603486)', sector: 'Robotics', revenue: '¥49.02 亿', netMargin: '8.3%', narrative: '家用服务机器人' },
]

const COMP_PROMPT = `你是国内顶级 VC 投资分析师，正在为一家 BP 公司做竞品深度对比。请基于：
1. BP 真实内容（含已识别对标）
2. 真实 A 股 / 港股可比公司财报（akshare 实测）

生成一份**深度竞品对比分析**（500-800 字），包含：
- 直接对标公司选择理由（为什么选这几家）
- 量化对比（估值倍数 / 净利率 / 增长率 / 客户结构）
- 关键差异化（这家 BP 公司能不能跑出来 vs 已上市的标杆）
- 估值锚定结论（基于真实可比，BP 当前估值合理 / 偏高 / 偏低）
- 投资风险提示

中文输出，markdown 格式（可用 **粗体** / 列表 / 表格）。`

export async function generateCompetitorAnalysis(
  provider: Provider,
  apiKey: string | null,
  deal: Deal,
  onChunk?: (full: string) => void,
): Promise<string> {
  const meta = PROVIDER_META[provider]
  const needsKey = provider !== 'pollinations' && provider !== 'kimi-k26'
  if (needsKey && !apiKey) throw new Error(`${meta.label} 需要 key`)

  // 按 deal 赛道筛选最相关的真实可比
  const sectorComps = REAL_COMPS.filter(c => {
    if (!deal.sector) return false
    return c.sector === deal.sector || (deal.sector.includes('AI') && c.sector.includes('AI'))
  })
  const usedComps = sectorComps.length > 0 ? sectorComps : REAL_COMPS.slice(0, 4)

  const userInput = `【BP 项目】
公司：${deal.name} / ${deal.cnName}
赛道：${deal.sector} · 阶段：${deal.round} · 估值：${deal.valuation}
ARR：${deal.arr || '—'} · 增长：${deal.growthRate || '—'}
BP 一句话：${deal.tagline}

【BP 中识别到的对标】
${deal.deepAnalysisRaw ? deal.deepAnalysisRaw.slice(0, 2000) + '…' : '（无深度报告，直接用 BP 字段）'}

【真实 A 股 / 港股可比公司财报（akshare 实测）】
${usedComps.map(c => `- ${c.name}：${c.sector} · 营收 ${c.revenue} · 净利率 ${c.netMargin} · ${c.narrative}`).join('\n')}

请输出 500-800 字深度竞品对比分析：`

  // Gemini 路径
  if (provider === 'gemini-flash') {
    const url = `${meta.endpoint}?key=${encodeURIComponent(apiKey!)}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: COMP_PROMPT + '\n\n' + userInput }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 2500 },
      }),
    })
    const data = await res.json()
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    onChunk?.(reply)
    return reply
  }

  // OpenAI 兼容流式
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`
  const body: any = {
    model: meta.model,
    messages: [
      { role: 'system', content: COMP_PROMPT },
      { role: 'user', content: userInput },
    ],
    temperature: 0.4,
    stream: true,
  }
  if (provider === 'pollinations') body.private = true
  else if (provider === 'kimi-k26') body.max_tokens = 3000
  else body.max_tokens = 2500

  const res = await fetch(meta.endpoint, { method: 'POST', headers, body: JSON.stringify(body) })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`竞品对比失败 (${res.status})：${err.slice(0, 200)}`)
  }
  if (!res.body) throw new Error('竞品对比流式无 body')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let raw = ''
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''
    for (const line of lines) {
      if (!line.startsWith('data:')) continue
      const payload = line.slice(5).trim()
      if (!payload || payload === '[DONE]') continue
      try {
        const json = JSON.parse(payload)
        const piece = json?.choices?.[0]?.delta?.content || json?.choices?.[0]?.delta?.reasoning_content || ''
        if (piece) { raw += piece; onChunk?.(raw) }
      } catch { /* ignore */ }
    }
  }
  return raw
}
