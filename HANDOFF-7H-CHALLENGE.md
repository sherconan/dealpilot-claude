# DealPilot · 第 4 轮 7H Challenge sprint144→154 ✅

Started: 2026-05-09 GMT+8 · Owner: Claude (P8 自管理) · 用户 AFK · 阿里味
Project: ~/dealpilot

## 完成状态（截至最后 sprint）

✅ **真实公司库扩到 3 家**：Moonshot AI（76/YELLOW）+ 智谱 AI（82/GREEN）+ DeepSeek（86/GREEN）
✅ **2 个投决核心工具上线**：Term Sheet 起草 + Cap Table 模拟器
✅ **3 页改造接入真实库**：Memory / Compare / Dashboard
✅ **全站入口拉通**：⌘K + sidebar + DealDetail 顶栏

## 完成的 sprint

| Sprint | 主题 | commit |
|---|---|---|
| 144 | 30 分钟决策包 · Moonshot AI 端到端 | 2547392 |
| 145 | Zhipu AI 决策包 + registry 模式 | b298114 |
| 146 | DeepSeek 决策包 | 8a94ca4 |
| 149+150 | Memory + Compare 接真实库 | 36ed464 |
| 151+152 | Term Sheet + Cap Table 投决工具 | c946b78 |
| 153+154 | Dashboard hero 重做 + 全站入口 | e9f4dd6 |

## 跳过的 sprint（决策记录）

- **147**: Pollinations 拆段调用产品化 → 决策包数据走"真公开 + VC 经验"路径，Pollinations 不稳已知，产品化收益低
- **148**: Print PDF CSS 实测 → sprint144 已加 no-print 标记，浏览器原生打印对话框直接可用

## 核心成果

### 1. 真实公司库（3 家公开公司）
- **Moonshot AI · A2 ($33亿)**: 杨植麟 / 周昕宇 / 吴育昕 · Kimi 助手 · 200 万字上下文 · YELLOW 76 分附条件进会
- **智谱 AI · B+ (¥200亿)**: 唐杰团队 · 清华 KEG · GLM-4-Plus · ToG 60% 入选率 · GREEN 82 分推荐进会
- **DeepSeek · Pre-B ($50亿估算)**: 梁文锋 / 幻方量化 · V3 训练 $5.6M · R1 reasoning · GREEN 86 分强烈推荐

### 2. 决策包结构（统一 schema）
- Verdict 信号灯（GREEN / YELLOW / RED）+ 5 秒摘要 KPI 6 格
- Sequoia 10 维度真评分（含 rationale）
- 8 题创始人深度访谈（基于 BP 真实数字 + 警惕信号）
- 7 人 Reference Check 名单（P0/P1/P2 优先级）
- Red Flag 扫描（硬 + 软，含缓释）
- 10 段深度分析（公司画像 → 尽调建议）
- 数据来源透明（页脚标注公开新闻 / 工商 / 团队履历 / VC 经验）

### 3. 投决工具（NVCA 标准）
- **Term Sheet 起草** (/termsheet): 4 档清算 + 3 档反稀释 + ROFR/Tag/Drag + 8 项保护性条款 + Qualified IPO 自动转换 + ESOP top-up + Closing Date · 实时生成 + 复制 + 下载 .md
- **Cap Table 模拟器** (/captable): 3 家 preset 创始团队 + 历史融资 · NVCA 标准 ESOP top-up 公式 · stacked bar + 完整 Cap Table 表 · 创始人合计稀释

### 4. 砍花架子的颗粒度
- Memory 不再是"6 个虚构记忆"——顶部 hero 主推 3 家真实公司
- Compare 默认选 3 家真实公司互比（替换 deals.slice(0,3) mock 默认）
- Dashboard 主标题改为"N 家真实公司决策包 · X 个项目待决"
- 各页面真实公司用 emerald 配色 + 🟢 真实公开 badge 与虚构区分

## 上线状态

- 主站: https://dealpilot-claude.vercel.app/
- GH Pages: https://sherconan.github.io/dealpilot-claude/
- Repo: https://github.com/sherconan/dealpilot-claude
- CI: GitHub Actions + Vercel 自动部署，每个 sprint commit 后 ~2-3min 上线

## 用户访问推荐路径

1. **Dashboard** → 看 3 家真实公司库 hero（绿色 banner）
2. 点任一公司 → **30 分钟决策包**（Verdict + KPI + Sequoia + 8 题 + Ref + 红线 + 10 段）
3. 决策包页打印 / 导出 PDF
4. **Term Sheet** 起草 → 选公司 → 配条款 → 下载 .md
5. **Cap Table** 模拟 → 选公司 preset → 输入本轮 → 看稀释表

## 下一步建议（用户回来后讨论）

- 真公司库扩到 5-7 家（百川 / 零一 / MiniMax / 阶跃 / 字节豆包等）
- 决策包 LLM 真生成（Pollinations 拆段策略产品化，sprint147 重启）
- Term Sheet 中英文双版本
- Playwright 端到端测试覆盖 3 家决策包 / Term Sheet / Cap Table
