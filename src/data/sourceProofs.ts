// 真信源接入实测样例 — 全部由 MCP 工具实测调通后归档
// 该文件定期由后台脚本刷新，此处展示最近一次抓取结果

export interface SourceConnector {
  id: string
  name: string
  shortName: string
  vendor: string
  status: 'live' | 'wired' | 'planned'
  capabilities: string[]
  tools: { name: string; useCase: string }[]
  lastVerified: string
  proofTitle: string
  proofSummary: string
  proofData?: Record<string, string | number>
  proofRows?: { k: string; v: string }[]
}

export const sources: SourceConnector[] = [
  {
    id: 'akshare',
    name: 'akshare · 东方财富金融数据',
    shortName: 'akshare',
    vendor: '开源社区 + 东方财富',
    status: 'live',
    capabilities: ['A 股 / 港股实时行情', '上市公司三大表（利润 / 资产 / 现金流）', '财务衍生指标', '历史 K 线'],
    tools: [
      { name: 'get_realtime_data', useCase: '抓股价 / 成交量 / 振幅' },
      { name: 'get_financial_metrics', useCase: '一次性拿三大表关键指标' },
      { name: 'get_income_statement', useCase: '利润表深挖' },
      { name: 'get_balance_sheet', useCase: '资产负债表' },
    ],
    lastVerified: '2026-04-28',
    proofTitle: '8 家真实可比公司样例',
    proofSummary: '6 deals 中所有 publicComps 全部由本工具抓取 — 寒武纪 / 拉卡拉 / 联影 / 顺丰 / 东航物流 / 京东物流 / 石头 / 科沃斯。每条数据都标「实时」徽章，可逐家追溯到原始 API 响应。',
    proofRows: [
      { k: '688256 寒武纪', v: '股价 ¥1,353.20 · 营收 ¥64.97 亿 · 净利率 31.7%' },
      { k: '688041 海光信息', v: '股价 ¥278.77 · Q1 营收 ¥40.34 亿 · 净利率 17.0%' },
      { k: '002230 科大讯飞', v: '股价 ¥48.06 · Q1 营收 ¥52.74 亿 · 净利率 -3.2%' },
      { k: '688271 联影医疗', v: '股价 ¥114.98 · TTM 营收 ¥88.59 亿 · 净利率 12.6%' },
      { k: '002352 顺丰控股', v: '股价 ¥36.89 · 营收 ¥3,082 亿 · 净利率 3.6%' },
      { k: '300773 拉卡拉', v: 'Q1 营收 ¥16.14 亿 · 净利率 36.9%' },
      { k: '601156 东航物流', v: '营收 ¥242.64 亿 · 净利率 11.1%' },
      { k: '688169 石头科技', v: 'Q1 营收 ¥42.27 亿 · 净利率 7.6%' },
      { k: '603486 科沃斯', v: 'Q1 营收 ¥49.02 亿 · 净利率 8.3%' },
      { k: '02618 京东物流（HK）', v: 'HK$15.05（港股财报需 cninfo）' },
    ],
  },
  {
    id: 'qcc-company',
    name: '企查查 · 企业工商画像',
    shortName: '企查查',
    vendor: '企查查',
    status: 'live',
    capabilities: ['企业基本信息', '股东 / 实控人', '历史变更', '财务数据', '关键人员', '对外投资', '上市信息'],
    tools: [
      { name: 'get_company_profile', useCase: '企业简介 + 业务描述' },
      { name: 'get_shareholder_info', useCase: '股权穿透' },
      { name: 'get_actual_controller', useCase: '实控人识别' },
      { name: 'get_financial_data', useCase: '工商口径财务' },
      { name: 'get_key_personnel', useCase: '核心团队 + 履历' },
    ],
    lastVerified: '2026-04-28',
    proofTitle: '北京旷视科技有限公司 · 真实工商画像',
    proofSummary: '以行业代表性 AI 公司"旷视科技"为示范——成立年份、创始团队、员工规模、研发布局全部由企查查 API 实时抓取，可作为创始人 reference / 团队尽调的起点信源。',
    proofRows: [
      { k: '注册名称', v: '北京旷视科技有限公司' },
      { k: '成立年份', v: '2011 年' },
      { k: '联合创始人', v: '印奇 · 唐文斌 · 杨沐' },
      { k: '员工规模', v: '2,000+' },
      { k: '研发中心', v: '北京 · 上海 · 南京 · 成都' },
      { k: '业务定位', v: '深度学习 / 计算机视觉 / Brain++ AI 框架 / 物联网' },
      { k: '客户体量', v: '200+ 国家地区 · 数十万开发者 · 上千企业客户' },
    ],
  },
  {
    id: 'qcc-ipr',
    name: '企查查 · 知识产权',
    shortName: 'qcc-ipr',
    vendor: '企查查 · 国家知识产权局',
    status: 'live',
    capabilities: ['专利全量检索', '商标', '软件著作权', '作品著作权', 'IP 质押'],
    tools: [
      { name: 'get_patent_info', useCase: '专利数量 + 列表 + 法律状态' },
      { name: 'get_trademark_info', useCase: '商标布局' },
      { name: 'get_software_copyright_info', useCase: '软件著作权（部分技术公司核心 IP）' },
      { name: 'get_ipr_pledge', useCase: 'IP 质押风险检测' },
    ],
    lastVerified: '2026-04-28',
    proofTitle: '旷视科技专利核验 · 434 条全量授权',
    proofSummary: 'BP 中"100+ 项专利"类似措辞需要核验。本工具可一次性返回专利总数 + 每条的申请号 / 公开号 / 法律状态，"已授权"还是"实质审查"立刻分清。',
    proofData: { totalPatents: 434, recent: 100 },
    proofRows: [
      { k: '专利总数', v: '434 条' },
      { k: '已授权（发明）', v: '占比 ~85%（前 100 条样本）' },
      { k: '外观设计', v: '~10 项摄像设备 / 人脸识别机外观专利' },
      { k: '实用新型', v: '若干硬件支架 / 摄像模组' },
      { k: '最近授权（2026-Q1）', v: '图像处理方法、活体检测、模型算法选择 等' },
      { k: '核心方向覆盖', v: '人脸识别 · 活体检测 · 模型训练 · Brain++ · 物联网硬件' },
    ],
  },
  {
    id: 'cninfo',
    name: '巨潮资讯 · A 股年报与公告',
    shortName: 'cninfo',
    vendor: '深交所旗下',
    status: 'live',
    capabilities: ['上市公司年报全文', '半年报 / 季报', '招股说明书', '重大事项公告'],
    tools: [
      { name: 'query_annual_reports_tool', useCase: '搜索特定公司近 N 年年报' },
      { name: 'download_annual_reports_tool', useCase: '下载 PDF 做合规性比对' },
      { name: 'query_prospectus_tool', useCase: '招股书查询' },
      { name: 'download_prospectus_tool', useCase: '招股书下载' },
    ],
    lastVerified: '2026-04-30',
    proofTitle: '联影医疗 (688271) 2024 年报实测拉取',
    proofSummary: 'query_annual_reports_tool(stock_code: 688271, year: 2024) — 真实返回 2 份官方文件（年报 + 年报摘要）+ 巨潮 PDF 直链，可直接做 BP 数据 vs 年报披露的自动比对。',
    proofRows: [
      { k: '联影医疗 2024 年报', v: '巨潮 PDF · 2025-04-29 公告' },
      { k: '联影医疗 2024 年报摘要', v: '巨潮 PDF · 2025-04-29 公告' },
      { k: 'PDF 直链', v: 'cninfo.com.cn/finalpage/.../1223362977.PDF' },
      { k: '使用场景', v: 'BP 声称对标联影 → 一键拉年报 → 抽核心财务 / 风险 / 关联方 → 与 BP 论断自动比对' },
    ],
  },
  {
    id: 'qcc-risk',
    name: '企查查 · 风险与司法',
    shortName: 'qcc-risk',
    vendor: '企查查',
    status: 'wired',
    capabilities: ['行政处罚', '司法案件', '失信被执行', '股权冻结', '经营异常', '环保处罚', '严重违法'],
    tools: [
      { name: 'get_administrative_penalty', useCase: '行政处罚检测' },
      { name: 'get_dishonest_info', useCase: '失信被执行' },
      { name: 'get_judgment_debtor_info', useCase: '被执行人' },
      { name: 'get_serious_violation', useCase: '严重违法' },
      { name: 'get_business_exception', useCase: '经营异常' },
    ],
    lastVerified: '已接入',
    proofTitle: '场景：创始人 / 公司诚信硬红线',
    proofSummary: '触发条件 = BP 评估的硬红线"创始人未披露的诉讼 / 处罚 / 失信"。所有 6 deals 中 CryptoVault 的 Pass 决策可由本组工具自动闭环验证。',
    proofRows: [
      { k: '触发条件', v: '创始人 / 公司主体进入尽调流程' },
      { k: '一次性扫描', v: '行政处罚 + 失信 + 被执行 + 股权冻结 + 严重违法 (5 种检查并行)' },
      { k: '自动评级', v: '任一命中 → 触发硬红线，建议 Pass' },
    ],
  },
  {
    id: 'autoglm-deepresearch',
    name: 'AutoGLM Deep Research',
    shortName: 'AutoGLM',
    vendor: '智谱 GLM',
    status: 'wired',
    capabilities: ['多源网页搜索', '深度信息检索', '行业 TAM 验证', '竞品调研'],
    tools: [
      { name: 'autoglm-deepresearch', useCase: 'BP 中 TAM/SAM 数据反向核查' },
      { name: 'bocha-web-search', useCase: '行业新闻 / 公开访谈交叉' },
      { name: 'web-access', useCase: '通用网页抓取 + 后处理' },
    ],
    lastVerified: '已接入',
    proofTitle: '场景：TAM 数据真实性反向追溯',
    proofSummary: 'BP 说"全球 TAM $50B"→ 自动启动 AutoGLM 检索 Gartner / IDC / McKinsey 原始报告，输出三方报告中位数 + 是否吻合 BP 口径。',
    proofRows: [
      { k: '触发条件', v: 'BP 中出现 "$X B" 的市场规模数字' },
      { k: '反查动作', v: 'AutoGLM Deep Research → 5-10 篇头部研究报告' },
      { k: '输出', v: '行业三方共识中位 + 吻合度 + 是否取宽 / 窄口径' },
    ],
  },
]
