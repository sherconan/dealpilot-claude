# DealPilot · 7-Hour Challenge 交接文档

> 本文用于跨会话恢复时快速对齐当前状态。每次重要 Sprint 完成后更新。

---

## 当前状态（最后更新 · 2026-04-30 · Sprint 40）

- **线上主站**：https://sherconan.github.io/dealpilot-claude/
- **Vercel 镜像**：https://dealpilot-claude.vercel.app/
- **GitHub Repo**：https://github.com/sherconan/dealpilot-claude
- **CI**：全绿 · 17 路由全部 200
- **进度**：Sprint 40 闭环（5 真信源全部 live · 9 家可比公司全部直挂 cninfo PDF · 旷视 qcc-risk 真实扫描）

## 已交付清单（33 Sprints）

### 基础设施
- 1. i18n 中英双语 + Light/Dark 主题（AppContext + 字典 + localStorage）
- 13. SEO + OG meta tags（社交分享一致）
- 14. Cmd-K 全局命令面板（深度搜索 deals + 动作）
- 20. Shift+? 帮助 modal + G+letter 快捷导航
- 27. README + docs/methodology.md + 全局 footer
- 29. Mobile drawer sidebar + 顶部 bar
- 30. ICMemo sticky TOC + 段落 anchor

### 核心功能页（17 路由）
- `/` Dashboard（KPI + 月度趋势 + 转化漏斗 + 赛道饼 + 评分柱图 + 活动流 + AI 信号）
- `/pipeline` Kanban + 列表双视图 + HTML5 拖拽 + CSV 导出
- `/upload` BP 上传 → 解析 → 真信源核验 模拟流程
- `/compare` 最多 3 个 BP 并排对比
- `/risk` 5 维风险扫描（旷视干净 / CryptoVault critical / 联影干净）
- `/portfolio` 投后 KPI（TVPI/DPI/IRR + 4 家 + 跑道告警）
- `/signals` AI 信号雷达（LinkedIn/GitHub/媒体/监管/招聘 8 条）
- `/briefings` 自动周报（聚合 Pipeline+Signals+Portfolio）
- `/sources` 真信源接入凭证（7 类）
- `/docs` 方法论白皮书
- `/changelog` 7-Hour Challenge 实战日志
- `/thesis` 投资论点设置
- `/memory` 机构记忆库（搜索+筛选+CSV 导出）
- `/deal/:id` Deal 详情（投资逻辑画布+10 要素 vs 行业基准+数据核验+访谈+真实可比）
- `/deal/:id/memo` IC Memo（视觉 hero + TOC + 打印 PDF + 分享链接）
- `/deal/:id/brief` 一页 IC 简报（5 分钟会前读本）

## 真信源接入实战清单（7 类）

| 信源 | 状态 | 实测数据 |
|---|---|---|
| **akshare · 东方财富** | ✅ live | 9 家真实可比公司财报（寒武纪 / 海光 / 讯飞 / 联影 / 顺丰 / 拉卡拉 / 东航物流 / 石头 / 科沃斯 / 京东物流） |
| **企查查 · 工商画像** | ✅ live | 旷视科技工商画像（2011 / 印奇唐文斌杨沐 / 2000+ 员工） |
| **企查查 · 知识产权** | ✅ live | 旷视 434 条专利全量 |
| **巨潮资讯 · 年报** | ✅ live | 9 家公司 2024 年报全部抓取（联影 / 顺丰 / 寒武纪 / 拉卡拉 / 东航 / 石头 / 科沃斯 / 海光 / 讯飞）共 18 份 PDF 直链 |
| **企查查 · 风险与司法** | ✅ live | 旷视 + 联影 6 维实测（旷视 ¥9,000 消防小额 / 联影全 0）|
| **AutoGLM Deep Research** | 🔵 wired | TAM 反向核查 / 多源研报 |
| **Bocha 通用搜索** | 🔵 wired | 行业新闻 / 公开访谈 |

## 关键文件路径

```
src/
├── App.tsx                    # 路由入口（17 routes）
├── main.tsx                   # AppProvider 包裹
├── contexts/AppContext.tsx    # i18n + theme
├── i18n/dict.ts               # 50+ keys
├── components/
│   ├── Layout.tsx             # 侧栏 + 顶部 bar + footer + drawer
│   ├── CommandPalette.tsx     # Cmd-K
│   ├── HelpModal.tsx          # Shift+? + 快捷键
│   ├── Charts.tsx             # SVG MonthlyTrend/Donut/Bar/Sparkline/ConversionFlow
│   ├── ThesisCanvas.tsx       # 投资逻辑 4 象限
│   └── (DealCard/ScoreRing/StatusPill/MetricCard)
├── pages/                     # 17 页面
├── data/
│   ├── deals.ts               # 6 deals 主数据
│   ├── extra.ts               # benchmark + dimension + dataCheck + interview + comps
│   ├── analytics.ts           # Dashboard 历史趋势
│   └── sourceProofs.ts        # 7 信源真数据归档
└── lib/
    ├── scoring.ts             # Stage / Recommendation / Sequoia 标签
    └── csv.ts                 # 通用 CSV 导出
```

## 恢复后下一步建议

1. **Sprint 34**: 单调一次 qcc-risk 试看权限是否能通（之前 batch 5 个并发 stream closed）
2. **Sprint 35**: 加一个 /api 文档页展示如何接入 DealPilot 自身（虚拟，作产品扩展演示）
3. **Sprint 36**: 给 IC Memo 嵌入 ThesisCanvas（真正打通可视化）
4. **Sprint 37+**: 视用户实际反馈优化

## P8 自检清单（每个 Sprint 闭环动作）

每次 ship 都必须 ① 写代码 ② 自查 build ③ git commit ④ git push ⑤ 等 CI 绿 ⑥ verify URL 200。
**对结果负责的闭环 — 不是 commit 一把就完事。**
