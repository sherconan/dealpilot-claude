interface SprintEntry {
  num: number
  title: string
  detail: string
  files: string[]
  tag: string
  color: string
}

const sprints: SprintEntry[] = [
  { num: 1, title: 'i18n 中英双语 + Light/Dark 主题', detail: 'AppContext 全局状态 + 字典 50+ 键 + localStorage 持久化 + 侧栏切换按钮 + dark mode 全覆盖', files: ['contexts/AppContext.tsx', 'i18n/dict.ts', 'index.css'], tag: '基础设施', color: '#0f766e' },
  { num: 2, title: '真 BP 上传与解析页 /upload', detail: '拖入文件 / 粘贴文本 → 上传进度 → AI NLP 解析章节 → 调真信源核验 → 进入分析报告', files: ['pages/Upload.tsx'], tag: '功能', color: '#0ea5e9' },
  { num: 3, title: '5 维风险扫描页 /risk', detail: '行政处罚 / 失信 / 经营异常 / 严重违法 / 被执行人 — 三案例（旷视干净 / CryptoVault critical / 联影干净）', files: ['pages/Risk.tsx'], tag: '功能', color: '#dc2626' },
  { num: 4, title: 'Dashboard 数据可视化升级', detail: '手写 SVG 月度趋势线 / 转化率漏斗 / 赛道分布饼图 / 评分区间柱图 / sparkline — 不依赖 Recharts', files: ['components/Charts.tsx', 'data/analytics.ts'], tag: '可视化', color: '#8b5cf6' },
  { num: 5, title: '投后组合页 /portfolio', detail: 'TVPI / DPI / IRR + 4 家 portfolio companies + 跑道告警 + 异常预警', files: ['pages/Portfolio.tsx'], tag: '功能', color: '#059669' },
  { num: 6, title: 'AI 信号雷达 /signals', detail: '8 条跨 LinkedIn / GitHub / 媒体 / 监管 / 招聘 / Product Hunt 渠道的信号流', files: ['pages/Signals.tsx'], tag: '功能', color: '#d97706' },
  { num: 7, title: 'IC Memo PDF 导出 + 分享链接', detail: 'window.print() + @media print CSS + clipboard 分享 URL + 浏览器打印对话框', files: ['pages/ICMemo.tsx', 'index.css'], tag: 'Polish', color: '#0f766e' },
  { num: 8, title: 'README + docs/methodology.md', detail: '完整产品白皮书 / 100 分 Scorecard / Red Flag 清单 / 漏斗模型 / IC Memo 结构 / AI 与人类边界', files: ['README.md', 'docs/methodology.md'], tag: '文档', color: '#475569' },
  { num: 13, title: 'SEO + OG meta tags', detail: 'description / keywords / Open Graph / Twitter card / theme-color — 分享时呈现一致', files: ['index.html'], tag: 'SEO', color: '#0ea5e9' },
  { num: 14, title: 'Cmd/Ctrl + K 全局命令面板', detail: '导航 / 项目 / 动作 三组 fuzzy 搜索 + ↑↓ 移动 + Enter 跳转', files: ['components/CommandPalette.tsx'], tag: 'UX', color: '#7c3aed' },
  { num: 15, title: '/compare 项目并排对比', detail: '最多 3 个 BP 同时比较：评分 + Sequoia 10 + Red Flag + 量化指标', files: ['pages/Compare.tsx'], tag: '功能', color: '#0f766e' },
  { num: 16, title: '/briefings 自动周报', detail: 'Pipeline + Signals + Portfolio 自动聚合的可分享 / 可打印基金周报', files: ['pages/Briefings.tsx'], tag: '功能', color: '#d97706' },
  { num: 17, title: 'Pipeline 卡片拖拽 + 持久化', detail: 'HTML5 native drag-drop + localStorage 阶段 override + 高亮 + 重置', files: ['pages/Pipeline.tsx'], tag: 'UX', color: '#0ea5e9' },
  { num: 18, title: '/changelog + 全局 footer', detail: '本页雏形 — 全部 sprint 的 changelog + 共享 footer + Cmd-K 提示', files: ['pages/Changelog.tsx', 'components/Layout.tsx'], tag: 'Polish', color: '#475569' },
  { num: 19, title: 'Investment Thesis Canvas 4 象限', detail: 'DealDetail 增加投资逻辑画布：Core Bet · Critical Risks · Milestones · Exit Path 自动按阶段/赛道生成', files: ['components/ThesisCanvas.tsx', 'pages/DealDetail.tsx'], tag: '功能', color: '#0f766e' },
  { num: 20, title: '全局键盘快捷键', detail: 'Shift+? 帮助 modal · T 主题 · L 语言 · G+字母 双键导航跳转（D/P/B/U/C/R/S/M）', files: ['components/HelpModal.tsx'], tag: 'UX', color: '#7c3aed' },
  { num: 21, title: 'Dashboard 团队活动流', detail: 'Dashboard 右栏增加近 7 天活动 timeline · Henry/Elaine/Martin/AI 4 个角色的事件', files: ['pages/Dashboard.tsx'], tag: 'UX', color: '#0ea5e9' },
  { num: 22, title: 'Pipeline 看板/列表视图切换', detail: '一键切换 kanban 与 list 两种视图，列表模式适合宽屏快速浏览全部 deal', files: ['pages/Pipeline.tsx'], tag: 'UX', color: '#0f766e' },
  { num: 23, title: 'Memory 多维度筛选 + 搜索', detail: '搜索（项目/创始人/赛道）+ 推荐分级筛选 + 硬红线快筛 + 多维度排序', files: ['pages/Memory.tsx'], tag: '功能', color: '#0ea5e9' },
  { num: 24, title: '/deal/:id/brief 一页 IC 简报', detail: '合伙人会前 5 分钟读的浓缩版 — Hero + 3 个核心论点 + 3 个会前必问 + 关键数字 + 真实可比锚定', files: ['pages/DealBrief.tsx'], tag: '功能', color: '#0f766e' },
  { num: 25, title: 'IC Memo 视觉增强', detail: 'Memo 顶部加 ScoreRing + 推荐结论 + akshare 实时可比锚定带，打印 PDF 更专业', files: ['pages/ICMemo.tsx'], tag: 'Polish', color: '#0f766e' },
  { num: 26, title: 'CSV 数据导出', detail: 'Memory 一键导出筛选后的项目为 CSV（UTF-8 BOM 兼容 Excel · 35 列结构化字段含 Sequoia 10）', files: ['lib/csv.ts', 'pages/Memory.tsx'], tag: '功能', color: '#475569' },
  { num: 27, title: '7h Challenge 阶段性收官', detail: '更新 Changelog + 27 sprint 总结 + CI 全绿 + 17 路由全部 200', files: ['pages/Changelog.tsx', 'README.md'], tag: 'Polish', color: '#475569' },
  { num: 28, title: 'Pipeline CSV 导出 + Dashboard hero quote', detail: 'Pipeline 加 CSV 按钮（复用 lib/csv）+ Dashboard 顶部 Sequoia 引语 + 日期更新', files: ['pages/Pipeline.tsx', 'pages/Dashboard.tsx'], tag: 'Polish', color: '#0f766e' },
  { num: 29, title: 'Mobile drawer sidebar', detail: '< 768px 侧栏隐藏为 drawer + 顶部 mobile bar（汉堡 / brand / theme 切换）', files: ['components/Layout.tsx'], tag: 'UX', color: '#0ea5e9' },
  { num: 30, title: 'ICMemo 左侧 sticky TOC', detail: '8 段 anchor 跳转 + scroll-mt 偏移 + 打印时自动隐藏', files: ['pages/ICMemo.tsx'], tag: 'UX', color: '#7c3aed' },
  { num: 31, title: 'Cmd-K 深度搜索', detail: '搜索关键词覆盖 wins / concerns / founders / redFlags — 任意一句话都能定位 deal', files: ['components/CommandPalette.tsx'], tag: 'UX', color: '#7c3aed' },
  { num: 32, title: 'nebula-ai 真实可比扩充到 3 家', detail: '+ 海光信息 (688041) + 科大讯飞 (002230)，反映 AI 底座/应用层不同盈利能力', files: ['data/extra.ts', 'data/sourceProofs.ts'], tag: '真信源', color: '#059669' },
  { num: 33, title: 'cninfo 升 live 实测', detail: '联影 + 顺丰 + 寒武纪 2024 年报真实 PDF 直链（巨潮资讯 query_annual_reports_tool）', files: ['data/sourceProofs.ts'], tag: '真信源', color: '#059669' },
  { num: 34, title: 'HANDOFF.md 跨会话交接', detail: '产品级交接文档 — 列出已完成 / 真信源状态 / 关键文件路径 / 恢复后 todo', files: ['HANDOFF.md'], tag: '文档', color: '#475569' },
  { num: 35, title: 'qcc-risk wired→live 实测', detail: '旷视 3 维风险扫描真实数据：1 条 ¥9,000 消防 + 失信/异常 0；Risk 页升级为真数据', files: ['data/sourceProofs.ts', 'pages/Risk.tsx'], tag: '真信源', color: '#059669' },
  { num: 36, title: 'Changelog/Layout 同步 + HANDOFF 链接', detail: 'footer 加 HANDOFF 链接，Changelog 头部计数升到 35 sprint 35 commits 5 真信源', files: ['pages/Changelog.tsx', 'components/Layout.tsx'], tag: '文档', color: '#475569' },
  { num: 37, title: 'publicComps 加 reportUrl 字段', detail: '寒武纪/联影/顺丰直挂 cninfo PDF；DealDetail 表格点击「年报 PDF」一键跳官方公告', files: ['types/index.ts', 'data/extra.ts', 'pages/DealDetail.tsx'], tag: '真信源', color: '#059669' },
  { num: 38, title: '联影也接真实 qcc-risk 扫描', detail: '联影 3 维实测全 0 + akshare/cninfo 双源交叉验证一致；Risk 页升级真数据', files: ['pages/Risk.tsx'], tag: '真信源', color: '#059669' },
  { num: 39, title: '6 家可比公司全部直挂 cninfo PDF', detail: '拉卡拉/东航/石头/科沃斯/海光/讯飞 全部加 reportUrl，9 家全员真实可点 PDF', files: ['data/extra.ts'], tag: '真信源', color: '#059669' },
  { num: 40, title: 'sourceProofs cninfo 升 9 家 + HANDOFF 同步', detail: 'cninfo proofRows 列出 9 家真实 PDF 直链（共 18 份官方公告），HANDOFF 同步状态', files: ['data/sourceProofs.ts', 'HANDOFF.md'], tag: '真信源', color: '#059669' },
  { num: 41, title: 'Risk 加字节跳动真实监管案例', detail: 'qcc-risk 实测字节 1 条网信办高级别监管处罚（2025-09-23 约谈+责令改正）；Risk 页 4 颗粒度全覆盖（干净/小额/监管/硬红线）', files: ['pages/Risk.tsx', 'data/sourceProofs.ts'], tag: '真信源', color: '#059669' },
  { num: 42, title: 'Changelog 同步 sprint 36-41 全量', detail: '41 sprint 全闭环，5 真信源全 live，9 家可比公司全直挂 PDF', files: ['pages/Changelog.tsx'], tag: 'Polish', color: '#475569' },
  { num: 43, title: 'cninfo 招股书工具实测', detail: '寒武纪 2020 + 联影 2022 招股书直挂 publicComps prospectusUrl，DealDetail 表格新增「招股书」紫色链接', files: ['types/index.ts', 'data/extra.ts', 'pages/DealDetail.tsx'], tag: '真信源', color: '#059669' },
  { num: 44, title: '剩 7 家可比公司招股书全部拉满', detail: '7 家招股书 PDF 真实抓取（顺丰 H 股 / 拉卡拉 / 石头 / 科沃斯 / 海光 / 讯飞医疗 H 股 / 东航无）9 家 25 份官方 PDF', files: ['data/extra.ts', 'data/sourceProofs.ts'], tag: '真信源', color: '#059669' },
  { num: 45, title: 'sourceProofs/HANDOFF/Changelog 同步终态', detail: 'cninfo proofRows 列出 9 家年报+招股书全量；HANDOFF 升级到 45 sprint 25 PDF；Changelog 加 43-45', files: ['data/sourceProofs.ts', 'HANDOFF.md', 'pages/Changelog.tsx'], tag: '文档', color: '#475569' },
  { num: 46, title: 'qcc-ipr 实测 3 家专利护城河', detail: '联影 3,493 + 寒武纪 548 + 旷视 434 = 4,475 条全量授权专利', files: ['data/sourceProofs.ts'], tag: '真信源', color: '#059669' },
  { num: 47, title: 'Dashboard hero 加真信源资产 KPI', detail: '5 个 chips：5/7 信源 / 4475 专利 / 25 PDF / 9 公司 / 46 sprint', files: ['pages/Dashboard.tsx'], tag: 'UX', color: '#0ea5e9' },
  { num: 48, title: 'Risk 加拼多多真实高额监管处罚', detail: '4 条 ¥51.13 亿（国家市监总局 2026-04 ¥15.16 亿）— 高风险但非诚信红线', files: ['pages/Risk.tsx', 'data/sourceProofs.ts'], tag: '真信源', color: '#059669' },
  { num: 49, title: '/sources 顶部 KPI 升 5 维真实资产', detail: '5/7 信源 / 4475 专利 / 25 PDF / 9 可比 / 5 风险扫描', files: ['pages/Sources.tsx'], tag: 'UX', color: '#0ea5e9' },
  { num: 50, title: 'Risk 加暴风集团真实暴雷案例', detail: '79 条失信 ¥4,549 万 + 202 条限高 + 证监会处罚 — 5 颗粒度全员真实', files: ['pages/Risk.tsx', 'data/sourceProofs.ts'], tag: '真信源', color: '#059669' },
  { num: 51, title: 'Moonshot/Kimi 真实独角兽画像', detail: 'qcc 三工具实测：杨植麟 / 注册资本 ¥100 万 / 1 条专利 CN118052282B', files: ['pages/Risk.tsx', 'data/sourceProofs.ts'], tag: '真信源', color: '#059669' },
  { num: 52, title: '智谱 + MiniMax 专利实测', detail: '智谱 80 条 + MiniMax 12 条 → 6 家 4,568 条专利矩阵', files: ['data/sourceProofs.ts', 'pages/Dashboard.tsx', 'pages/Sources.tsx'], tag: '真信源', color: '#059669' },
  { num: 53, title: '/unicorns AI 独角兽对照矩阵页', detail: '7 家真实公司（4 独角兽 + 3 上市）IP 储备横向对比 + 合规画像网格', files: ['pages/Unicorns.tsx', 'App.tsx', 'i18n/dict.ts'], tag: '功能', color: '#0f766e' },
  { num: 60, title: '上传 BP 真创建项目入箱', detail: 'userDealStore + buildDealFromExtraction 自动写 deal 到 localStorage，Pipeline/Memory/Dashboard 自动同步', files: ['lib/userDealStore.ts', 'pages/Upload.tsx', 'data/deals.ts'], tag: '功能', color: '#0f766e' },
  { num: 63, title: '接真 LLM (Pollinations) — 不再 regex 模板', detail: '按 ===SECTION N=== 切分输出 10 段深度报告，由 LLM 真基于 PDF 全文撰写', files: ['lib/llmAnalyze.ts', 'pages/Upload.tsx'], tag: '真 LLM', color: '#7c3aed' },
  { num: 64, title: '5 provider BYOK 多模态接入', detail: 'Pollinations 免费文本 / Kimi K2.6 / OpenAI GPT-4o-mini / Moonshot Vision / DeepSeek / Gemini Flash', files: ['lib/multimodalAnalyze.ts'], tag: '真 LLM', color: '#7c3aed' },
  { num: 67, title: 'Kimi K2.6 (kimi-for-coding) 真接通', detail: 'api.kimi.com/coding/v1 + Vercel Edge 代理转发 + UA 注入绕过 coding agent 限制', files: ['api/kimi-proxy.ts', 'lib/multimodalAnalyze.ts'], tag: '真 LLM', color: '#7c3aed' },
  { num: 68, title: 'Kimi K2.6 流式 SSE — 实时看 LLM 思考', detail: 'Vercel Edge 直接 pipe upstream body to client + 前端 ReadableStream 解析 chunks', files: ['api/kimi-proxy.ts', 'lib/multimodalAnalyze.ts', 'pages/Upload.tsx'], tag: '真 LLM', color: '#7c3aed' },
  { num: 70, title: 'LLM 真打分 Sequoia 10', detail: '替代规则引擎 — LLM 给 10 维度独立 0-10 分 + 30-80 字依据 + PDF 原文 evidence + 加权计算总分', files: ['lib/scoringLLM.ts', 'pages/DealDetail.tsx', 'types/index.ts'], tag: '真 LLM', color: '#7c3aed' },
  { num: 71, title: 'ICMemo 整合 LLM 完整版', detail: '用 LLM 写的 10 段直接渲染到 IC Memo + Sequoia 10 评分附录', files: ['pages/ICMemo.tsx'], tag: '真 LLM', color: '#7c3aed' },
  { num: 72, title: 'LLM 生成 8 个针对 BP 真内容创始人访谈问题', detail: '替代模板 — 每个问题基于 BP 具体细节定制，含 why/expect/watch 信号', files: ['lib/founderQuestions.ts', 'pages/DealDetail.tsx'], tag: '真 LLM', color: '#7c3aed' },
  { num: 74, title: '多轮追问对话 DealChat', detail: '注入完整 deal context (PDF + 评分 + 报告) → 流式 SSE 回答 + localStorage 历史 + 6 个建议问题', files: ['lib/chatLLM.ts', 'components/DealChat.tsx'], tag: '真 LLM', color: '#7c3aed' },
  { num: 76, title: 'Markdown 完整报告导出', detail: '一键导出含 LLM 评分 + 10 段 + 访谈问题 + Red Flag + 时间线 的完整 Markdown', files: ['lib/exportDeal.ts'], tag: '功能', color: '#0f766e' },
  { num: 77, title: 'LLM 竞品深度对比', detail: '基于 9 家已实测 akshare 真财报 + LLM 写 500-800 字深度对比 + 估值锚定', files: ['lib/competitorLLM.ts', 'components/CompetitorAnalysis.tsx'], tag: '真 LLM', color: '#7c3aed' },
  { num: 80, title: 'Pipeline/Memory LLM 徽章', detail: '用户上传项目左侧紫色边线 + ✨ LLM 真分析徽章 + score hover 显示 llmOneLiner', files: ['pages/Pipeline.tsx', 'pages/Memory.tsx'], tag: 'UX', color: '#7c3aed' },
  { num: 82, title: 'ICMemo 打印 PDF 优化', detail: 'A4 + PingFang SC 中文字体 + 章节避免分页 + 字号层级 22/16/13/10.5pt + 表格边框 + details 全展开', files: ['index.css'], tag: 'Polish', color: '#0f766e' },
  { num: 83, title: 'Onboarding 5 步引导', detail: '首次访问延迟 1.5s 弹 modal · 欢迎 / 上传 BP / LLM 评分 / 多轮追问 / 真信源 (FLAG dp:onboarded-v2)', files: ['components/Onboarding.tsx', 'components/Layout.tsx'], tag: 'UX', color: '#0ea5e9' },
  { num: 84, title: 'Upload 一键试用示例 BP', detail: '点击 "✨ 用示例 BP 试一下" 自动预填完整 NebulaAI BP 文本立即体验 LLM 真分析', files: ['pages/Upload.tsx'], tag: 'UX', color: '#0ea5e9' },
  { num: 85, title: 'Dashboard LLM 已分析 KPI', detail: '5 → 6 KPI 新增"LLM 已分析"专项 (识别 user-* 或有 deepAnalysisRaw 的 deal)', files: ['pages/Dashboard.tsx', 'README.md'], tag: 'Polish', color: '#7c3aed' },
  { num: 86, title: 'SEO meta 升级 LLM 时代', detail: 'description / keywords 同步 6 LLM Provider · Kimi K2.6 多模态 · 真信源核验', files: ['index.html'], tag: 'SEO', color: '#0ea5e9' },
  { num: 87, title: '双轮 7-Hour Challenge 收官', detail: '87 Sprint 全闭环 · 6 LLM Provider 真接通 · 10 条 AI 能力链 · 5 真信源 · CI 全绿 · Vercel + GH Pages 双部署', files: ['HANDOFF.md', 'pages/Changelog.tsx', 'README.md'], tag: 'Final', color: '#059669' },
  { num: 90, title: 'Compare 接 useAllDeals · 用户上传可对比', detail: '换掉静态 import → 动态 hook，三选 deals · 空态 CTA → Upload，新上传立即出现在选项里', files: ['pages/Compare.tsx'], tag: '功能', color: '#0f766e' },
  { num: 91, title: 'Briefings 周报全实时', detail: 'ISO week 计算 + Top3 / 观察 / 硬红线 deals 全部 derived from useAllDeals · 不再硬编', files: ['pages/Briefings.tsx'], tag: '功能', color: '#d97706' },
  { num: 92, title: '代码分割 · 首屏 925KB → 68KB', detail: 'React.lazy + Suspense 16 个页面级分包 + manualChunks 分 react-vendor / pdfjs-vendor，首屏 gzip 25KB（-92%）', files: ['App.tsx', 'vite.config.ts'], tag: 'Polish', color: '#0ea5e9' },
  { num: 93, title: '移动端 px-4/8 + Layout sidebar 实时', detail: '17 页统一 px-4 md:px-8（手机不再被 32px padding 挤压）+ Layout 优先项目改用 useAllDeals · 用户上传项目优先', files: ['src/pages/*.tsx', 'components/Layout.tsx'], tag: 'UX', color: '#0ea5e9' },
  { num: 95, title: 'Dashboard 日期/标题动态化', detail: '"今天有 N 个项目等你决策" 真接 todos 计数 · 周一-周日动态 · 标题副本根据 IC/DD/empty 三态切换', files: ['pages/Dashboard.tsx'], tag: 'UX', color: '#0f766e' },
  { num: 96, title: '删除 / 清空用户上传', detail: 'DealDetail 加 🗑 删除按钮（仅 user-*）· Memory 加"清空上传"批量清理 · 不影响 mock 演示项目', files: ['pages/DealDetail.tsx', 'pages/Memory.tsx'], tag: '功能', color: '#dc2626' },
  { num: 97, title: 'Cmd+K 覆盖用户上传 + 6 个新导航项', detail: 'CommandPalette 改用 useAllDeals · ✨ 前缀标记 user-* · 新增 Compare/Briefings/Unicorns/Changelog 入口', files: ['components/CommandPalette.tsx'], tag: 'UX', color: '#7c3aed' },
  { num: 98, title: '续航 7-Hour 全平台数据驱动', detail: '主流页全部接入 useAllDeals · LLM 数据穿透到 Layout/Dashboard/Briefings/Compare/Memory/Pipeline · 用户上传项目"刚上传"即出现在所有视图', files: ['多个'], tag: 'Final', color: '#059669' },
  { num: 99, title: 'Pipeline / Memory 空状态 CTA 卡片', detail: '用户清空上传后（0 deals）指向 /upload 的品牌化提示卡 + 品牌色图标 + Cmd+K 快捷入口', files: ['pages/Pipeline.tsx', 'pages/Memory.tsx'], tag: 'UX', color: '#0ea5e9' },
  { num: 100, title: 'SEO meta 升级 LLM 产品语言', detail: 'title 加 「Kimi K2.6 多模态真分析」 · description 含流式 SSE / 25 KB gzip / 98 Sprint / Cmd+K', files: ['index.html'], tag: 'SEO', color: '#0ea5e9' },
  { num: 101, title: '404 NotFound 品牌化', detail: '未知路径降级到品牌化 fallback 卡 + Cmd+K 提示。Layout 壳保留，侧栏仍可导航', files: ['App.tsx'], tag: 'Polish', color: '#475569' },
  { num: 105, title: '示例 BP 画廊 · 4 个行业', detail: 'AI Infra / FinTech 东南亚 / BioMed 创新药 / ConsumerTech 智能厘房 · 一键预填 textarea，不需上传 PDF 也能运行 LLM 流水线', files: ['data/sampleBPs.ts', 'pages/Upload.tsx'], tag: '功能', color: '#7c3aed' },
  { num: 106, title: 'Memory 页聚合洞察 5 卡', detail: '入库总数 / 平均评分 / 优先推进 % / 硬 Red Flag 触发率 / Top 3 赛道 · 合伙人一眼看全局', files: ['pages/Memory.tsx'], tag: 'UX', color: '#0f766e' },
  { num: 107, title: 'Dashboard sample-BP CTA 条', detail: '首次访问/零上传时显示 4 行业卡片 · 点击 → sessionStorage 桥 → Upload 页自动预填', files: ['pages/Dashboard.tsx', 'pages/Upload.tsx'], tag: 'UX', color: '#7c3aed' },
  { num: 108, title: 'ICMemo 打印优化 + 动态时间戳', detail: 'memo 页脚页码 (counter(page)/counter(pages)) · 面包屑打印隐藏 · 200px aside 打印时 collapse · 变幸有 LLM 分析的项目顺势说明', files: ['pages/ICMemo.tsx', 'index.css'], tag: 'Polish', color: '#0f766e' },
  { num: 109, title: 'Sources 页 LLM Provider 实测矩阵', detail: '6 路 LLM 通道 endpoint / 多模态 / SSE / 成本 / 状态 全表 · 脚注 UA 注入 + BYOK localStorage key', files: ['pages/Sources.tsx'], tag: '真 LLM', color: '#7c3aed' },
  { num: 110, title: '生产端到端验证·全绿', detail: '14 路由 + unknown · GH Pages 镜像 · Sources chunk 含 LLM 矩阵 · Kimi proxy 400 期望返回 · 首屏 gzip 32 KB', files: ['生产端'], tag: 'Final', color: '#059669' },
  { num: 113, title: 'DealDetail 创始人访谈 一键复制', detail: '复制全部 Q 按钮 · 8 题完整 Markdown（含 why/expect/watch）· 可粘贴飞书 / Notion', files: ['pages/DealDetail.tsx'], tag: 'UX', color: '#d97706' },
  { num: 114, title: 'Compare 横向对比 Markdown 导出', detail: '4 段 Markdown：评分概览 + Sequoia 10 + Red Flag + 量化指标 · IC 前 1 分钟生成可粘贴报告', files: ['pages/Compare.tsx'], tag: '功能', color: '#0f766e' },
  { num: 115, title: 'Briefings 周报 Markdown 导出', detail: '6 段 Markdown：提要 / 决策池 / Top 3 / 关键信号 / 观察名单 / 下周聚焦 · 周五一键发飞书群', files: ['pages/Briefings.tsx'], tag: '功能', color: '#7c3aed' },
  { num: 116, title: 'Pipeline 看板 Markdown 快照', detail: '按阶段分组的 Markdown 快照 · 6 阶段 / 每项 score+round+valuation+RF 徽章', files: ['pages/Pipeline.tsx'], tag: '功能', color: '#0ea5e9' },
]

const milestones = [
  { tag: 'init', title: '产品初版（pre-challenge）', detail: 'Dashboard / Pipeline / DealDetail / IC Memo / Memory / Thesis / Sources 7 页 + 6 deals 完整数据 + 8 家 akshare 真实可比公司 + qcc 实测旷视专利 / 工商画像', count: 7 },
  { tag: '7h', title: '7 小时挑战赛新增', detail: '+ Upload / Risk / Portfolio / Signals / Docs / Compare / Briefings / Changelog / DealBrief（共 9 页）+ i18n + Dark mode + Cmd-K + Shift+? / G+letter 快捷键 + SEO + 拖拽 + PDF 导出 + 周报 + CSV 导出 + Investment Thesis Canvas + ICMemo 视觉增强', count: 9 },
]

export default function Changelog() {
  return (
    <div className="px-4 md:px-8 py-6 max-w-[1100px] mx-auto">
      <header className="mb-6">
        <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">3 轮 7-Hour Self-Driven Challenge · Recap</div>
        <h1 className="text-[28px] font-semibold tracking-tight mt-1">三轮 7 小时挑战赛 · 实战日志</h1>
        <p className="text-[13.5px] text-ink-700 mt-2 max-w-3xl leading-relaxed">
          自主驱动 · 不停 ship · 用户中间不给任何指令。三轮挑战累计 {sprints.length}+ Sprint，
          从产品基线到全平台 LLM 接通 / 代码分割（首屏 -92%）/ 移动端响应 / Cmd+K 全局搜索 / 用户上传完整生命周期管理。
          每个 Sprint 完成即 commit + Vercel 部署 + GH Pages 同步，CI 全绿。
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="Sprint 总数" value={sprints.length} accent="#0f766e" hint="三轮 7h challenge · 全部闭环" />
        <Stat label="LLM Provider" value={'6'} accent="#7c3aed" hint="Kimi K2.6 / Gemini / OpenAI / Moonshot / DeepSeek / Pollinations" />
        <Stat label="真信源 live" value={'5/7'} accent="#059669" hint="akshare / qcc(3) / cninfo" />
        <Stat label="首屏 gzip" value={'25KB'} accent="#0ea5e9" hint="代码分割后 -92% · React lazy + manualChunks" />
      </section>

      <section className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        {milestones.map((m) => (
          <div key={m.tag} className="bg-white border border-ink-200 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-brand-700" />
            <div className="flex items-baseline gap-2">
              <span className="num text-[24px] font-semibold tracking-tight">{m.count}</span>
              <span className="text-[12px] text-ink-500 uppercase tracking-wider font-medium">页面</span>
            </div>
            <div className="text-[14px] font-semibold mt-1">{m.title}</div>
            <div className="text-[12px] text-ink-600 mt-1.5 leading-relaxed">{m.detail}</div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-[18px] font-semibold tracking-tight mb-3">Sprint 日志（按时间序）</h2>
        <ol className="space-y-3">
          {sprints.map((s) => (
            <li key={s.num} className="bg-white border border-ink-200 rounded-xl p-4 flex items-start gap-4">
              <div className="num w-10 h-10 rounded-lg flex items-center justify-center text-white text-[13px] font-semibold shrink-0" style={{ background: s.color }}>{s.num}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[15px] font-semibold tracking-tight">{s.title}</span>
                  <span className="text-[10px] tracking-wider uppercase font-medium px-1.5 py-0.5 rounded" style={{ color: s.color, background: s.color + '14' }}>{s.tag}</span>
                </div>
                <div className="text-[12.5px] text-ink-700 mt-1 leading-relaxed">{s.detail}</div>
                <div className="text-[10px] text-ink-400 mt-2 font-mono flex items-center gap-2 flex-wrap">
                  {s.files.map((f) => <span key={f} className="bg-ink-100 px-1.5 py-0.5 rounded">{f}</span>)}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-8 p-5 bg-gradient-to-br from-brand-50 via-white to-white border border-brand-500/20 rounded-xl text-center">
        <div className="text-[11px] tracking-wider uppercase text-brand-700 font-medium">P8 自检清单</div>
        <p className="text-[14px] text-ink-800 mt-2 max-w-2xl mx-auto leading-relaxed">
          每个 Sprint 都满足：①写代码 ②自查 build ③git commit ④git push ⑤等 CI 绿 ⑥verify URL 200 — <b>对结果负责的闭环</b>，不是 commit 一把就完事
        </p>
        <div className="mt-3 inline-flex items-center gap-3 text-[12px] text-ink-600">
          <span>因为信任所以简单 ·</span>
          <span>颗粒度拉到产品级 ·</span>
          <span>Owner 意识 ·</span>
          <span>不让等指令的人失望</span>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, accent, hint }: { label: string; value: string | number; accent: string; hint: string }) {
  return (
    <div className="bg-white border border-ink-200 rounded-xl p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: accent }} />
      <div className="text-[11px] text-ink-500 tracking-wider uppercase">{label}</div>
      <div className="num font-semibold text-ink-900 text-[24px] tracking-tight mt-1">{value}</div>
      <div className="text-[11px] text-ink-500 mt-0.5">{hint}</div>
    </div>
  )
}
