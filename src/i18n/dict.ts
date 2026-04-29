export type Lang = 'zh' | 'en'

type Dict = Record<string, { zh: string; en: string }>

export const dict: Dict = {
  // Nav
  'nav.dashboard': { zh: '驾驶舱', en: 'Cockpit' },
  'nav.dashboard.hint': { zh: '今日概览', en: 'Today' },
  'nav.pipeline': { zh: '漏斗看板', en: 'Pipeline' },
  'nav.pipeline.hint': { zh: '全部阶段', en: 'All stages' },
  'nav.thesis': { zh: '投资论点', en: 'Thesis' },
  'nav.thesis.hint': { zh: 'Thesis 对齐', en: 'Alignment' },
  'nav.memory': { zh: '机构记忆', en: 'Memory' },
  'nav.memory.hint': { zh: '历史项目', en: 'History' },
  'nav.sources': { zh: '真信源', en: 'Sources' },
  'nav.sources.hint': { zh: '7 类已接入', en: '7 connected' },
  'nav.upload': { zh: '上传 BP', en: 'Upload BP' },
  'nav.upload.hint': { zh: '实战分析', en: 'Live analysis' },
  'nav.risk': { zh: '风险扫描', en: 'Risk' },
  'nav.risk.hint': { zh: '工商 / 司法', en: 'Compliance' },
  'nav.portfolio': { zh: '投后组合', en: 'Portfolio' },
  'nav.portfolio.hint': { zh: '已投跟踪', en: 'Tracking' },
  'nav.signals': { zh: 'AI 信号雷达', en: 'Signals' },
  'nav.signals.hint': { zh: '招聘 / 代码', en: 'Hiring / Code' },
  'nav.docs': { zh: '方法论', en: 'Docs' },
  'nav.docs.hint': { zh: '产品宪法', en: 'Foundation' },
  'nav.compare': { zh: '项目对比', en: 'Compare' },
  'nav.compare.hint': { zh: '并排比较', en: 'Side-by-side' },
  'nav.briefings': { zh: '基金周报', en: 'Briefings' },
  'nav.briefings.hint': { zh: '自动聚合', en: 'Auto roll-up' },
  'nav.workspace': { zh: '工作台', en: 'Workspace' },
  'nav.priority': { zh: '优先推进', en: 'Priority' },
  'nav.tools': { zh: '尽调工具', en: 'DD Tools' },

  // Brand
  'brand.title': { zh: 'DealPilot', en: 'DealPilot' },
  'brand.tagline': { zh: 'VC 筛选驾驶舱', en: 'VC Screening Cockpit' },

  // Disclaimer
  'disclaimer.title': { zh: '演示版本 · 数据透明声明', en: 'Demo · Data Transparency' },
  'disclaimer.body': { zh: '6 个项目本身为虚构演示；所有可比上市公司表格 100% 真实数据（akshare 实时财报 + 东方财富股价）。', en: '6 deals are fictional demos; ALL public comparable companies are 100% real data (akshare + EastMoney live).' },
  'disclaimer.sources': { zh: '已接入真信源', en: 'Live data sources' },

  // Common
  'btn.export': { zh: '导出本周简报', en: 'Export weekly brief' },
  'btn.uploadBP': { zh: '上传 BP', en: 'Upload BP' },
  'btn.scheduleMeeting': { zh: '安排会议', en: 'Schedule meeting' },
  'btn.startDD': { zh: '进入尽调', en: 'Start DD' },
  'btn.generateMemo': { zh: '生成 IC Memo', en: 'Generate IC Memo' },
  'btn.viewKanban': { zh: '进入看板', en: 'Open Kanban' },
  'btn.viewAll': { zh: '查看全部', en: 'View all' },
  'btn.next': { zh: '下一步', en: 'Next' },
  'btn.back': { zh: '上一步', en: 'Back' },
  'btn.cancel': { zh: '取消', en: 'Cancel' },
  'btn.save': { zh: '保存', en: 'Save' },

  // Stage / Recommendation labels
  'stage.inbox': { zh: '初筛', en: 'Inbox' },
  'stage.review': { zh: '跟进', en: 'Review' },
  'stage.dd': { zh: '尽调', en: 'DD' },
  'stage.ic': { zh: '投委会', en: 'IC' },
  'stage.invested': { zh: '已投', en: 'Invested' },
  'stage.pass': { zh: '已 Pass', en: 'Passed' },

  'rec.priority': { zh: '优先推进', en: 'Priority' },
  'rec.monitor': { zh: '持续观察', en: 'Monitor' },
  'rec.conditional': { zh: '有条件跟进', en: 'Conditional' },
  'rec.pass': { zh: '建议 Pass', en: 'Pass' },

  // Theme
  'theme.light': { zh: '浅色', en: 'Light' },
  'theme.dark': { zh: '深色', en: 'Dark' },
}

export function tr(key: string, lang: Lang): string {
  const item = dict[key]
  if (!item) return key
  return item[lang] || item.zh || key
}
