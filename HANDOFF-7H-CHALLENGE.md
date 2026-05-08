# DealPilot · 7H Challenge sprint144→160 (Round 4)

Started: 2026-05-09 GMT+8 · Owner: Claude (P8 自管理) · 用户 AFK · 阿里味
Project: ~/dealpilot · sha 2547392 (sprint144 已上线)

## 目标
把 sprint144 验证的"真实公开公司决策包"模式，扩展为产品的核心叙事：
- **3 家真实公司决策包库**（Moonshot ✅ + Zhipu + DeepSeek）
- **2 个投决核心工具**（Term Sheet + Cap Table）
- **砍掉/降权所有花架子页面**（Memory / Compare / Briefings 改接真实库）

## 红线
1. 每 sprint 必 commit + push
2. 真实公开数据 + VC 经验补全（Pollinations 不稳已知，不重复踩坑）
3. 每 2 sprint 跑 tsc + 生产 curl
4. 全部完成 → Discord 汇总通知用户

## 路线图

| Hour | Sprint | 任务 | 状态 |
|---|---|---|---|
| H1 | 145 | 智谱 AI Zhipu GLM-4 决策包 | 进行中 |
| H1 | 146 | DeepSeek 决策包 | ⏳ |
| H2 | 147 | Pollinations 拆段产品化 | ⏳ |
| H2 | 148 | Print PDF CSS 实测 | ⏳ |
| H3 | 149 | Memory 改"真公司库" | ⏳ |
| H3 | 150 | Compare 接真公司互比 | ⏳ |
| H4 | 151 | Term Sheet 起草页 | ⏳ |
| H4 | 152 | Cap Table 模拟器 | ⏳ |
| H5 | 153 | 决策包页 UX 优化 | ⏳ |
| H5 | 154 | Dashboard hero 重做 | ⏳ |
| H6 | 155 | HANDOFF + Changelog | ⏳ |
| H6 | 156 | Playwright 端到端 | ⏳ |
| H7 | 157-160 | perf + bug + Discord | ⏳ |

## 决策日志
- **00:00 (起始)**: 用户 AFK 7h 不间断挑战。继续 dealpilot 第四轮 7h。
- **策略**: 跳过 Pollinations 不稳通道（sprint144 已踩坑），决策包数据走"真公开数据 + VC 经验"，速度快稳定可验。
- **registry 模式**: 用 `src/data/decisionPackRegistry.ts` 管理多家公司，让 DecisionPack.tsx 通用化。
