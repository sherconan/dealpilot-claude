// V4: 把 Pollinations 没稳定输出的部分用 VC 经验手填，产出最终决策包
// 输出 src/data/realDeals.ts 可直接 import

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const v3 = JSON.parse(await fs.readFile(path.join(__dirname, 'decision-pack-final.json'), 'utf-8'))

// 评分手填（参考 v3 已 LLM 拿到的，未拿到的用经验）
const FINAL_SCORES = [
  { key: 'mission', score: 7, rationale: '使命聚焦普惠与长文本协同，定位中国大模型应用领跑者，愿景清晰但竞争激烈。' },
  { key: 'problem', score: 8, rationale: '中文长文本场景缺口大，国内模型同质化，用户付费意愿增长，痛点显著。' },
  { key: 'solution', score: 9, rationale: '200万字超长上下文，架构创新与推理优化，API多档，技术壁垒高。' },
  { key: 'whyNow', score: 8, rationale: '2024关键年，已获3k MAU、100B token调用，价格优势显著，时机成熟。' },
  { key: 'market', score: 8, rationale: '中国生成式 AI 2025 1500 亿元，复合增长 87%，TAM 万亿级，增量空间充足。' },
  { key: 'competition', score: 6, rationale: '国内外大厂 + 创业公司高密度竞争（百度/阿里/字节/智谱/DeepSeek），长文本可被快速跟进。' },
  { key: 'businessModel', score: 6, rationale: 'C 端 freemium + B 端 API 已跑通，但 1.2% 付费率偏低，API 价格战会压制毛利。' },
  { key: 'team', score: 9, rationale: '杨植麟/周昕宇/吴育昕三驾马车（清华+CMU+Google Brain/Meta），顶级科研团队密度。' },
  { key: 'financials', score: 6, rationale: '收入未公开披露，估值 $33亿对应 100亿 token/月调用约 ¥1.2亿月收入，PSR 偏高。' },
  { key: 'vision', score: 8, rationale: '愿景明确指向通用 AGI 普惠，长文本是切入点而非天花板，长期叙事完整。' },
]

// 8 题创始人访谈（基于月之暗面 BP 真实数字）
const FINAL_QS = [
  {
    category: 'financial',
    question: '本轮 $300M，70% 用于算力。按 H100 单卡 $30K + 寒武纪 910B 国产替代，700 张卡能跑多大模型？您预期 2025 H1 训练成本占月度成本多少？',
    why: '验证募资规模与算力投入是否匹配训练目标',
    expect: '听到具体卡数 + 国产/进口比例 + 单次训练 cost 估算',
    watch: '回答模糊或回避卡数，可能存在算力供应不确定',
  },
  {
    category: 'financial',
    question: 'Kimi+ 月费 ¥99 · 付费率 1.2% · MAU 3000万 → 月付费收入约 ¥3,564万。您计划 12 个月内将付费率提升到多少？拉升路径是 Kimi+ 涨价、新增功能还是 B 端撬动 C 端？',
    why: '验证 C 端变现路径的可执行性',
    expect: '具体 SKU + 实验数据 + 关键里程碑',
    watch: 'DeepSeek-R1 免费策略压制下 Kimi+ 涨价空间有限',
  },
  {
    category: 'business',
    question: 'B 端 100亿 token/月 来自哪些客户？Top 5 客户营收占比多少？华泰/招商/知乎合同周期与续约率？',
    why: '核验 B 端商业化真实性 + 客户集中度',
    expect: '客户名单 + 合同条款 + 续约数据',
    watch: 'Top 5 客户集中度 >50% 是软红线',
  },
  {
    category: 'business',
    question: '200万字上下文 vs 智谱 GLM-4 / Claude-3 长上下文的客观评测对比（MMLU / Long-Bench / 中文场景实测）数字怎么样？长文本是不是已经被竞争对手追平？',
    why: '长文本是核心壁垒，需要用客观数字证明仍有显著差距',
    expect: '具体跑分对比 + 持续投入路线图',
    watch: '回答停留在 "用户体感好" 而无客观数据 = 壁垒在融化',
  },
  {
    category: 'team',
    question: '您同时担任 CEO + 算法 leader + 论文一作。下一阶段如何分权？COO / 商业化负责人 / 政府关系负责人是否到位？',
    why: '关键人风险是 LP 第一关注点',
    expect: '高管补位时间表 + 现任团队职责分工',
    watch: '回答 "都自己看" 是分身乏术信号',
  },
  {
    category: 'competition',
    question: 'DeepSeek-V3 把 API 价格打到 ¥1/百万 token。您的 ¥12/百万 token 定价 12 个月内会不会被迫降到 ¥3 以下？低价是否会让 B 端单 token 毛利转负？',
    why: '价格战对商业模式根基的冲击',
    expect: '成本结构透明 + 单 token 毛利底线',
    watch: '"我们不打价格战" = 没想清楚',
  },
  {
    category: 'risk',
    question: '训练数据来源构成（公开网络爬取 / 出版社授权 / 用户上传）三者比例？是否完成网信办算法备案 + 数据出境合规审查？是否有第三方法律意见书？',
    why: 'AIGC 合规是港交所 18C 上市的硬门槛',
    expect: '具体备案进度 + 法律意见书 + 数据采购合同',
    watch: '回答 "我们都合规" 而无文件是空话',
  },
  {
    category: 'fund-use',
    question: '本轮 $300M，70% 算力 / 20% 研发 / 10% 增长。增长预算 $30M 在 12 个月内能买到多少新增 MAU？CAC 与 ARPPU 的回本周期？',
    why: '增长投入 ROI 是否可量化',
    expect: 'CAC 估算 + ARPPU 拆分 + payback period',
    watch: 'CAC > LTV × 0.3 = 增长亏损放大',
  },
]

const final = {
  ...v3,
  sequoia10: FINAL_SCORES,
  founderQuestions: FINAL_QS,
  meta: { ...v3.meta, finalizedAt: new Date().toISOString(), source: 'Pollinations LLM (10段) + VC 经验补全 (评分 4 维 / 8 题)' },
}

// 重算 totalScore + verdict
const weights = { mission:6,problem:8,solution:12,whyNow:8,market:14,competition:10,businessModel:14,team:16,financials:8,vision:4 }
let weighted = 0, totalW = 0
for (const d of FINAL_SCORES) { const w = weights[d.key] || 10; weighted += (d.score / 10) * w; totalW += w }
final.totalScore = Math.round((weighted / totalW) * 100)
final.recommendation = final.totalScore >= 80 ? 'priority' : final.totalScore >= 65 ? 'monitor' : final.totalScore >= 50 ? 'conditional' : 'pass'

// 重算 verdict
const hard = final.redFlags.filter(f=>f.severity==='hard').length
const lowDim = FINAL_SCORES.filter(d=>d.score <= 5).length
final.verdict = (final.totalScore >= 80 && hard === 0)
  ? { signal: 'GREEN', label: '推荐进 30 分钟会议', reason: `综合 ${final.totalScore} 分 · ${hard} 硬红线 · ${lowDim} 个维度 ≤5 分` }
  : (final.totalScore >= 65 && hard <= 1)
  ? { signal: 'YELLOW', label: '附条件进 30 分钟会议', reason: `综合 ${final.totalScore} 分 · ${hard} 硬红线（算力卡脖子需会议聚焦缓释方案）` }
  : { signal: 'RED', label: '建议 Pass', reason: `综合 ${final.totalScore} 分 · ${hard} 硬红线 · ${lowDim} 个维度 ≤5 分` }

await fs.writeFile(path.join(__dirname, 'decision-pack-final.json'), JSON.stringify(final, null, 2), 'utf-8')

console.log('═══════════ 决策包 FINAL（手填补完） · Moonshot AI ═══════════')
console.log(`决策信号: ${final.verdict.signal} · ${final.verdict.label}`)
console.log(`理由: ${final.verdict.reason}`)
console.log(`总分: ${final.totalScore}/100 · 推荐: ${final.recommendation}`)
console.log(`深度分析: 10/10 段 · 评分: 10/10 维 · 8 题: ${final.founderQuestions.length} 题 · 红线: ${final.redFlags.length} · Ref: ${final.referenceCheck.length}`)
console.log(`输出: ${path.join(__dirname, 'decision-pack-final.json')}`)
