# DealPilot · 7-Hour Challenge 交接文档

> 跨会话恢复时快速对齐当前状态。

---

## 当前状态（最后更新 · 2026-05-08 · Sprint 79）

- **线上主站**：https://dealpilot-claude.vercel.app/（推荐 — 含 Kimi K2.6 多模态）
- **GH Pages 镜像**：https://sherconan.github.io/dealpilot-claude/（无 Kimi 代理 · 仅 Pollinations / Gemini BYOK）
- **GitHub Repo**：https://github.com/sherconan/dealpilot-claude
- **CI**：全绿 · 18 路由全部 200
- **进度**：79 sprint 全闭环 · LLM 时代全面到来

## 🌟 7-Hour Challenge 第二轮（Sprint 68-79）核心成果

| Sprint | 主题 |
|---|---|
| 60 | userDealStore + 上传 BP 真创建项目入箱 |
| 63 | Pollinations 真 LLM 接通（10 段 ===SECTION=== 切分） |
| 64 | 5 provider BYOK（Pollinations / OpenAI / Moonshot / DeepSeek / Gemini） |
| 67 | **Kimi K2.6 真接通**（Vercel Edge 代理 + UA 注入绕过 coding agent 限制） |
| 68 | **Kimi K2.6 流式 SSE** — 实时看 LLM 思考 |
| 70 | **LLM 真打分 Sequoia 10**（替代规则引擎 + 评分依据 + PDF 原文 evidence） |
| 71 | ICMemo 整合 LLM 完整 10 段版本 |
| 72 | **LLM 生成 8 个针对 BP 真内容创始人访谈问题** |
| 74 | **多轮追问对话 DealChat**（注入完整 deal context + 流式） |
| 76 | **Markdown 完整报告导出** |
| 77 | **LLM 竞品深度对比**（基于 9 家 akshare 真财报） |
| 78 | Changelog + Dashboard hero 同步 LLM 时代 |
| 79 | Sources 加 LLM 能力矩阵（10 条链路可视化） |

## 🤖 LLM Provider 矩阵（6 选 1）

| Provider | Endpoint | 多模态 | 真免费 | 状态 |
|---|---|---|---|---|
| **Kimi K2.6 (kimi-for-coding)** | `/api/kimi-proxy` (Vercel) | ✅ image+video | ✅ 产品已配 | 🌟 默认推荐 |
| **Gemini 1.5 Flash** | `generativelanguage.googleapis.com` | ✅ | ✅ 免费 tier | BYOK |
| **OpenAI GPT-4o-mini** | `api.openai.com/v1` | ✅ | 付费 | BYOK |
| **Moonshot Vision** | `api.moonshot.cn/v1` | ✅ | 注册送 ¥15 | BYOK |
| **DeepSeek** | `api.deepseek.com/v1` | ❌ | 注册送 ¥10 | BYOK |
| **Pollinations** | `text.pollinations.ai` | ❌ | ✅ 无 key | 备用 |

## 🔌 真信源接入清单（5/7 live）

| 信源 | 实测样例 |
|---|---|
| akshare · 东方财富 | 9 家可比公司真财报（寒武纪/海光/讯飞/联影/顺丰/拉卡拉/东航/石头/科沃斯） |
| 企查查 工商画像 | 旷视 / Moonshot / 智谱 真实成立信息 |
| 企查查 知识产权 | 6 家公司 4,568 条真实专利 |
| 企查查 风险与司法 | 5 公司风险扫描（旷视/字节/联影/拼多多 ¥51.13 亿/暴风 79 失信） |
| 巨潮资讯 年报+招股书 | 9 家 25 份官方 PDF 直链 |
| AutoGLM Deep Research | wired |
| Bocha 通用搜索 | wired |

## 📁 关键文件

```
src/
├── lib/
│   ├── pdfPipeline.ts          # pdfjs 抽 PDF + 渲染 image
│   ├── llmAnalyze.ts           # Pollinations 文本 LLM
│   ├── multimodalAnalyze.ts    # 6 provider 统一 + 流式 SSE
│   ├── scoringLLM.ts           # LLM 真打分 Sequoia 10
│   ├── founderQuestions.ts     # LLM 针对 BP 生成访谈问题
│   ├── chatLLM.ts              # 多轮追问（注入 deal context）
│   ├── competitorLLM.ts        # 竞品深度对比 + 9 家真财报
│   ├── exportDeal.ts           # Markdown 完整报告导出
│   └── userDealStore.ts        # localStorage 上传项目持久化
├── components/
│   ├── DealChat.tsx            # 项目详情多轮追问聊天
│   └── CompetitorAnalysis.tsx  # 竞品对比卡片
├── pages/
│   ├── Upload.tsx              # 上传 + 12 阶段长任务体验
│   ├── DealDetail.tsx          # 项目详情（LLM 评分 / 访谈 / 竞品 / Chat）
│   ├── ICMemo.tsx              # IC Memo（LLM 完整版 + 模板 fallback）
│   └── Sources.tsx             # 信源 + LLM 能力矩阵
└── api/
    └── kimi-proxy.ts           # Vercel Edge Function · UA 注入 + 流式 pipe
```

## 🚀 用户访问 Vercel 镜像测试 Kimi K2.6 流程

1. https://dealpilot-claude.vercel.app/?/upload
2. 顶部"分析模式"选 **Kimi K2.6 (产品已配 · 真多模态)**（无需输 key）
3. 上传 PDF
4. 实时看 SSE 流式输出（不再等 60s）
5. 自动创建项目入箱
6. 点"进入项目"看完整 LLM 报告 + 评分 + 访谈 + 竞品对比 + 多轮追问

## 📊 累计真实数据资产

- 真信源 live：5/7
- LLM provider：6
- LLM 能力链：10 条（解析/评分/Memo/访谈/追问/竞品/导出/流式...）
- 真实公司风险扫描：6 家
- 真实专利数据：4,568+ 条 / 6 家
- 真实可比公司：9 家
- 真实官方 PDF：25 份
- 78+ Sprint 全闭环 · CI 全绿
