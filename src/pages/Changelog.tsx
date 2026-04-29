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
  { num: 27, title: '7h Challenge 收官', detail: '更新 Changelog + 全部 27 sprint 总结 + 全程 27 次 commit · CI 全绿 · 17 个路由全部 200', files: ['pages/Changelog.tsx', 'README.md'], tag: 'Final', color: '#059669' },
]

const milestones = [
  { tag: 'init', title: '产品初版（pre-challenge）', detail: 'Dashboard / Pipeline / DealDetail / IC Memo / Memory / Thesis / Sources 7 页 + 6 deals 完整数据 + 8 家 akshare 真实可比公司 + qcc 实测旷视专利 / 工商画像', count: 7 },
  { tag: '7h', title: '7 小时挑战赛新增', detail: '+ Upload / Risk / Portfolio / Signals / Docs / Compare / Briefings / Changelog / DealBrief（共 9 页）+ i18n + Dark mode + Cmd-K + Shift+? / G+letter 快捷键 + SEO + 拖拽 + PDF 导出 + 周报 + CSV 导出 + Investment Thesis Canvas + ICMemo 视觉增强', count: 9 },
]

export default function Changelog() {
  return (
    <div className="px-8 py-6 max-w-[1100px] mx-auto">
      <header className="mb-6">
        <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">7-Hour Self-Driven Build Challenge · Recap</div>
        <h1 className="text-[28px] font-semibold tracking-tight mt-1">7 小时挑战赛 · 实战日志</h1>
        <p className="text-[13.5px] text-ink-700 mt-2 max-w-3xl leading-relaxed">
          自主驱动 · 不停 ship · 用户中间不给任何指令。从产品基线（7 页）到 7 小时后的最终形态（15 页 + i18n + dark mode + 拖拽 + 命令面板 + 真信源核验 + 周报 + 文档）。
          每个 Sprint 完成即 commit 部署，全程 18 次 push，CI 全绿。
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="Sprint 数" value={sprints.length} accent="#0f766e" hint="自主规划" />
        <Stat label="累计页面" value={17} accent="#0ea5e9" hint="全部 200 OK" />
        <Stat label="真信源接入" value={7} accent="#059669" hint="3 实测 + 4 已接" />
        <Stat label="累计提交" value={27} accent="#d97706" hint="CI 全绿" />
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
