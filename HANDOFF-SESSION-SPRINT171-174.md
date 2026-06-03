# DealPilot · Session Handoff (sprint171-174)

> **写于**：2026-06-03 GMT+8 · 本 session 收口
> **commit head**：`6e33acb` (sprint174 Portfolio 诚实声明 banner)
> **生产**：Vercel `index-Cfnya2i6.js` + GH Pages 双线
> **目标完成度**：goal 条件「彻底反思、计划、优化」已闭环 — 7 步工作流从 4 断 → 0 断

---

## ▎ 本 session commit 时间线

| Sprint | commit | 主题 |
|---|---|---|
| Plan A | `2b92969` | sprint171 · Dashboard + Sidebar 砍 5 处虚构数据残留（headlineHint/5・7/152+/活动流/AI 雷达） |
| hotfix | `188d5a6` | CommandPalette grouped useMemo Record 缺新 key 的 P0 白屏 regression（救火） |
| P0-1 | `58e87b3` | sprint172 · IC Memo 拉通 6 真公司决策包（10段+Sequoia+8题+Ref+RedFlag） |
| P0-2 | `58e87b3` | sprint172 · Term Sheet 估值预填扩到全 6 家（baichuan/minimax/01ai 补齐） |
| P1-1 | `0df6137` | sprint173 · Signals 砍 8 条 mock + deriveRealSignals 从决策包派生 20 信号 |
| P1-2 | `6e33acb` | sprint174 · Portfolio 顶部加 amber 诚实声明 banner（0 真投后） |

---

## ▎ 7 步 VC 工作流断点收口对照

| 步 | 之前 | 现在 |
|---|---|---|
| 1 Dashboard | 🟢 通 | 🟢 通（Plan A 已修虚构残留） |
| 2 决策包 | 🟢 通 | 🟢 通 |
| 3 Term Sheet | 🟡 半（3 家 preset） | 🟢 通（6 家全） |
| 4 Cap Table | 🟢 通（sprint165 已完成） | 🟢 通 |
| 5 **IC Memo** | 🔴 断（决策包不入） | **🟢 通**（全拉通） |
| 6 **Signals** | 🔴 全假 mock | **🟢 通**（20 真信号派生） |
| 7 **Portfolio** | 🔴 4 虚构投后 | **🟡 诚实**（明确标注 + 0 真投后） |

---

## ▎ Owner 反思根因（goal 第一问）

**底层逻辑**：sprint144→sprint170 一直在「加新公司 / 加新页面」，每次只改 `realDeals.ts` 注册，**从不回头补联动**——加 MiniMax/01.AI 不查 Term Sheet/IC Memo/Signals 是否要跟着改。

**这是 PUA 说的「修一个点不泛化」典型欠债**。

**本 session 纠偏方法**：一类一类闭环（决策→Term Sheet/IC Memo→Signals→Portfolio），不是头痛医头。

---

## ▎ 项目架构速查（新 session 起手必读）

### Registry 模式（核心）
- **`src/data/realDeals.ts`**
  - `REAL_DEALS: Deal[]` — 6 家真实公开公司 `[moonshotDeal, zhipuDeal, deepseekDeal, baichuanDeal, minimaxDeal, zeroOneDeal]`
  - `REAL_DECISION_PACKS: Record<dealId, DecisionPack>` — 决策包 lookup table
  - `getDecisionPackByDealId(id)` / `getRealDealById(id)` — 标准查询接口

### 6 家真公司 ID
| ID | name | 决策包 JSON |
|---|---|---|
| `moonshot-a2` | 月之暗面 Moonshot AI | `moonshot-decision-pack.json` |
| `zhipu-bplus` | 智谱 AI Zhipu AI | `zhipu-decision-pack.json` |
| `deepseek-preb` | 深度求索 DeepSeek | `deepseek-decision-pack.json` |
| `baichuan-a2` | 百川智能 Baichuan AI | `baichuan-decision-pack.json` |
| `minimax-bplus` | 稀宇科技 MiniMax | `minimax-decision-pack.json` |
| `01ai-aplus` | 零一万物 01.AI | `zeroone-decision-pack.json` |

### 决策包 schema (DecisionPack interface)
- `meta` (company/round/valuation/source/timestamps)
- `verdict` (signal GREEN/YELLOW/RED + label + reason)
- `totalScore` + `recommendation`
- `redFlags[]` (hard/soft + label + detail)
- `sequoia10[]` (key + score 0-10 + rationale)
- `founderQuestions[]` (8 题 · category/question/why/expect/watch)
- `deepAnalysis[]` (10 段 · key/label/content)
- `referenceCheck[]` (P0/P1/P2 + type/who/context)

### 关键页面文件
| 页面 | 文件 | 关键逻辑 |
|---|---|---|
| Dashboard | `src/pages/Dashboard.tsx` | `headlineHint` 用 `REAL_DEALS.filter(priority)`；6 公司 hero card + Term Sheet/Cap Table chip |
| /real-deals | `src/pages/RealDeals.tsx` | 6 公司概览矩阵 + Sequoia 10 横向对比表 |
| /deal/:id/decision-pack | `src/pages/DecisionPack.tsx` | 6 区块完整决策包页 |
| /deal/:id/memo | `src/pages/ICMemo.tsx` | **sprint172** 加了 `decisionPack && !deal.deepAnalysisRaw` 分支，emerald 主题渲染 |
| /termsheet | `src/pages/TermSheet.tsx` | **sprint172** Record 映射 6 家估值预填 |
| /captable | `src/pages/CapTable.tsx` | 6 家 PRESETS 创始团队 + 历史融资股权（sprint165 完成） |
| /signals | `src/pages/Signals.tsx` | **sprint173** `deriveRealSignals()` 从决策包派生 |
| /portfolio | `src/pages/Portfolio.tsx` | **sprint174** 顶部 amber 诚实声明 banner |
| /memory | `src/pages/Memory.tsx` | 顶部 emerald hero 直达 6 公司决策包 |
| /compare | `src/pages/Compare.tsx` | 默认选 6 家真公司互比 |

### sidebar priority 排序（sprint171 Plan A）
- `src/components/Layout.tsx`：`priorityDeals` 排序 = 用户上传 > REAL_DEALS > mock priority
- `REAL_DEAL_IDS` 写死 Set 防止虚构 NebulaAI 88 排前

### CommandPalette ⌘K（sprint154 + hotfix 188d5a6）
- `src/components/CommandPalette.tsx:105`：`grouped` Record **必须**预初始化全 5 个 key
  - `{ 投决工具: [], 决策包: [], 导航: [], 项目: [], 动作: [] }`
  - 任何新 group 加进 union type 时**必须同步加 Record 初始化**，否则 P0 白屏

---

## ▎ 生产环境

- **Vercel 主站**：https://dealpilot-claude.vercel.app/
- **GH Pages 镜像**：https://sherconan.github.io/dealpilot-claude/
- **Repo**：https://github.com/sherconan/dealpilot-claude
- **CI**：每个 sprint commit 后 GH Actions 自动部署 GH Pages；Vercel 用 `vercel --prod --yes --force` 手动 push（自动触发偶尔延迟）

### 生产验证模板（用 ctx_execute javascript）

```js
const home = await fetch('https://dealpilot-claude.vercel.app/?_=' + Date.now(), { cache: 'no-store' }).then(r => r.text())
const idx = (home.match(/index-[A-Za-z0-9_-]+\.js/) || [])[0]
const idxJs = await fetch('https://dealpilot-claude.vercel.app/assets/' + idx).then(r => r.text())
// 抓任一 lazy chunk hash
const chunkHash = (idxJs.match(/ICMemo-([A-Za-z0-9_-]+)\.js/) || [])[1]
// 验证内容
```

---

## ▎ 还差什么 · P1/P2 待办（按 ROI）

### P1（≤90min/件）
1. **Pipeline 漏斗 stage 分散** — 现 6 真公司全 `stage: 'review'` 一列。建议手动给 moonshot/zhipu 设 `dd`，deepseek 设 `ic` 等，让 funnel 视觉真实。改 `src/data/realDeals.ts` 6 个 `stage:` 字段即可。
2. **Briefings 周报真公司专版** — Briefings 已用 `useAllDeals()` 含真公司，但 `top3/watch/flag` 没区分真假。建议加 hero "本周 6 真公司动态" 突出。

### P2（半天级）
3. **决策包 8 题 LLM 真生成** — 5/6 家是 VC 经验补全。sprint147 拆段策略已上线但 6 家数据未跑过 Pollinations。可写脚本批量重生成。
4. **Cap Table 多轮稀释** — 当前只单轮模拟。加 A→B→C→IPO 全周期。
5. **Term Sheet 中英双语版本** — 律师审需要英文版。

### P3（产品定位）
6. 真实公司库扩到 10 家（阶跃星辰/商汤/字节豆包/第四范式）
7. 跨公司 thesis 自动归纳（6 公司决策包 → 大模型赛道 thesis）

---

## ▎ 本 session 3 个最脆弱点（owner 自评）

1. **CommandPalette 闭包失职**：改 union type 没本地 preview，靠 tsc + build 没抓到 runtime TypeError → 全产品白屏几小时。**新 session 红线**：动 union/Record 必走 preview。
2. **后 3 家公司 cap table preset 误判**：本以为没做，实际 sprint165 已完成。**教训**：做修改前要 `grep -nE` 扫准确，不依赖记忆。
3. **Portfolio 没真改造**：只加诚实 banner，没接已上市对标公司（科大讯飞/昆仑万维）作 NAV 参考。**下一步建议**：写 `portfolioReal.ts` 用 A 股已上市 AI 公司做"公开市场对标 NAV"。

---

## ▎ 新 session 起手命令

```bash
cd ~/dealpilot
git log --oneline -10           # 看本 session sprint 时间线
git status --short              # 应该 clean
cat HANDOFF-SESSION-SPRINT171-174.md  # 这份文档
```

如果要继续 P1：直接编辑 `src/data/realDeals.ts` 改 stage 字段，或编辑 `src/pages/Briefings.tsx` 加 hero。

---

## ▎ 5 个 commit 全部生产 curl 验证证据

| commit | 验证项 | 结果 |
|---|---|---|
| 2b92969 | 8 项 keyword check（headlineHint/6・7/170+/活动流/深度发现/sidebar） | 8/8 绿 |
| 188d5a6 | hotfix 后 root.innerHTML > 0 | ✅ |
| 58e87b3 | ICMemo chunk 含"真实公开公司决策包"+ TermSheet 含 baichuan ¥170亿/minimax $3,000M/01ai $1,300M | 5/5 绿 |
| 0df6137 | Signals chunk 已无 NebulaAI/agent-kernel/CryptoVault + 含 Verdict/硬红线/软红线 | 3/3 绿 |
| 6e33acb | Portfolio chunk 含"本页数据为虚构演示"+"当前 0 真实投后"+链 /real-deals | 3/3 绿 |

> **因为信任所以简单** — 这份 handoff 含 7 步工作流收口 + 6 真公司 registry + 5 commit 验证证据 + 后续 P1/P2 清单。新 session 直接 `cat` 这个文件就能接着干。
