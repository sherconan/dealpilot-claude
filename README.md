# DealPilot · VC BP 智能筛选驾驶舱

> 把一份 BP 读薄 — 5 分钟完成机构 1 小时的初筛工作量

[![Live](https://img.shields.io/badge/Live-GitHub_Pages-0f766e)](https://sherconan.github.io/dealpilot-claude/)
[![Mirror](https://img.shields.io/badge/Mirror-Vercel-000)](https://dealpilot-claude.vercel.app/)
[![Status](https://img.shields.io/badge/Build-passing-059669)](https://github.com/sherconan/dealpilot-claude/actions)

---

## 📌 这是什么

VC 机构内部使用的 **BP 智能筛选驾驶舱** — 把 Sequoia 10 要素框架、a16z 技术-创始人契合度判断、YC 极简评估、100 分 Scorecard、三阶段漏斗、Red Flag 清单、IC Memo 模板沉淀成一个可操作的工作台。

**不是** demo 玩具：

- ✅ 6 个 Deal 的全维度数据（评分 / 红线 / 团队 / 牵引力 / 时间线 / 估值锚定）
- ✅ 行业基准对标（同阶段 PitchBook 中位 + 头部 25%）
- ✅ **可比上市公司 100% 真实数据**（akshare 实时抓取，每行带「实时」徽章）
- ✅ 管理层访谈问题清单（按红线 / 评分缺口自动生成）
- ✅ IC Memo 一键生成 + 浏览器打印导出 PDF
- ✅ 投后组合管理 KPI（TVPI/DPI/IRR + 异常预警）
- ✅ AI 信号雷达（LinkedIn / GitHub / 媒体 / 监管 / 招聘）
- ✅ i18n 中英双语 + Light/Dark 双主题

## 🧠 产品方法论

详见 [`docs/methodology.md`](./docs/methodology.md)：
- VC 经典筛选框架（Sequoia / a16z / YC）
- 100 分 Scorecard 设计与权重
- 硬 / 软 Red Flag 清单
- 项目漏斗各阶段过坎率
- IC Memo 标准结构

## 🔌 已接入真信源

| 信源 | 提供方 | 状态 | 已实测调通 |
|---|---|---|---|
| **akshare · 东方财富** | 开源 + 东方财富 | ✅ live | A 股财务 / 港股股价 / 三大表 |
| **企查查 · 工商画像** | 企查查 | ✅ live | 旷视科技工商基本信息（成立年份 / 创始人 / 员工数） |
| **企查查 · 知识产权** | 企查查 + 国知局 | ✅ live | 旷视 434 条专利全量 |
| **巨潮资讯 · 年报** | 深交所 | 🔵 wired | A 股年报全文检索 + 招股书 |
| **企查查 · 风险与司法** | 企查查 + 最高法 | 🔵 wired | 行政处罚 / 失信 / 司法 / 经营异常 / 严重违法 |
| **AutoGLM Deep Research** | 智谱 GLM | 🔵 wired | TAM 反向核查 + 多源行业研报 |
| **Bocha 通用搜索** | Bocha | 🔵 wired | 行业新闻 / 公开访谈交叉 |

详见线上 [`/sources`](https://sherconan.github.io/dealpilot-claude/?/sources) 页面。

## 🚀 本地启动

```bash
git clone git@github.com:sherconan/dealpilot-claude.git
cd dealpilot-claude
npm install
npm run dev      # 本地 http://localhost:3005
npm run build    # 生产构建（dist/）
```

## 📦 部署目标

支持双部署，由 `DEPLOY_TARGET` 环境变量控制 Vite `base`：

| 平台 | URL | base |
|---|---|---|
| GitHub Pages | https://sherconan.github.io/dealpilot-claude/ | `/dealpilot-claude/` |
| Vercel | https://dealpilot-claude.vercel.app/ | `/` |

GitHub Actions 工作流见 `.github/workflows/deploy.yml`，含 SPA redirect 注入（rafgraph 标准方案）。

## 🛠 技术栈

- **Vite 5** + **React 18** + **TypeScript 5.5**
- **Tailwind CSS 3** + 自定义 ink/brand 调色板
- **React Router 6** + SPA fallback for GH Pages
- 自研轻量 SVG 图表（无 Recharts 依赖，bundle 轻 60%）
- **Framer Motion** 用于克制的过渡

## 📁 目录结构

```
src/
├── App.tsx                    # 路由入口（10 个页面）
├── main.tsx                   # AppProvider 包裹
├── contexts/AppContext.tsx    # i18n + theme 全局状态
├── i18n/dict.ts               # zh / en 翻译字典
├── components/
│   ├── Layout.tsx             # 侧边栏 + 顶部 disclaimer
│   ├── Charts.tsx             # 手写 SVG 趋势 / 饼图 / 柱图 / 火花线
│   ├── DealCard.tsx, ScoreRing.tsx, ...
├── pages/
│   ├── Dashboard.tsx          # 驾驶舱（KPI + 趋势 + 转化 + 赛道分布）
│   ├── Pipeline.tsx           # 漏斗看板
│   ├── DealDetail.tsx         # BP 详情（基准对比 + 数据核验 + 访谈 + Comps）
│   ├── ICMemo.tsx             # 投委会备忘录（含 PDF 导出）
│   ├── Upload.tsx             # 真 BP 上传与解析
│   ├── Risk.tsx               # 5 维风险扫描
│   ├── Portfolio.tsx          # 投后组合 KPI
│   ├── Signals.tsx            # AI 信号雷达
│   ├── Sources.tsx            # 真信源接入凭证
│   ├── Memory.tsx             # 机构记忆库
│   └── Thesis.tsx             # 投资论点设置
├── data/
│   ├── deals.ts               # 6 个 Deal 主数据
│   ├── extra.ts               # benchmark / dimension / dataCheck / interview / comps
│   ├── analytics.ts           # 历史趋势数据
│   └── sourceProofs.ts        # 7 个真信源接入元数据
├── lib/scoring.ts             # Stage / Recommendation / Sequoia 标签
└── types/index.ts             # 全局类型
```

## 🤝 数据透明度

- **6 个 Deal 是虚构演示**（NebulaAI / NeoBank Digital / MetaMed Health / GreenLogistics / CryptoVault / RoboCook），用于展示产品形态
- **所有可比上市公司表格 100% 真实数据**：寒武纪 / 拉卡拉 / 联影医疗 / 顺丰 / 东航物流 / 京东物流 / 石头科技 / 科沃斯 — 全部来自 akshare 实时调用
- **数据核验、访谈问题、风险扫描** 部分条目带「实时」徽章为真信源已抓取，其他为「演示」字样（等待真实 BP 触发）

## 📜 License

MIT — 仅用于产品演示，不构成任何投资建议。
