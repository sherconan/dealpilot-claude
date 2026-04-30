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
    proofTitle: '3 家公司专利护城河实测 · 共 4,475 条全量授权',
    proofSummary: '产品已实测的 3 家代表公司 IP 资产量化：① 旷视 (AI 视觉) 434 条 ② 寒武纪 (AI 算力) 548 条 ③ 联影 (医学影像) 3,493 条。BP 中"100+ 项专利"类似措辞可一键反查得真实数字。',
    proofData: { totalPatents: 4475, companies: 3 },
    proofRows: [
      { k: '联影医疗 (688271)', v: '3,493 条 · 医学影像 + 磁共振 + CT + PET 全栈 IP' },
      { k: '寒武纪 (688256)', v: '548 条 · 神经网络计算 + 加速器 + 板卡 IP' },
      { k: '旷视科技', v: '434 条 · 人脸识别 + 活体检测 + Brain++ 框架' },
      { k: '总量', v: '4,475 条专利 · 全部从国知局公开数据实测拉取' },
      { k: '颗粒度', v: '每条返回申请号 / 公开号 / 申请日 / 公告日 / 法律状态 / 专利类型' },
      { k: '使用场景', v: 'BP 声称"100+ 专利" → 一键调用 → 立刻看真实数字 + 已授权 vs 实质审查中' },
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
    proofTitle: '9 家真实可比公司 · 25 份官方 PDF（年报 18 + 招股书 7）',
    proofSummary: 'cninfo 双工具实测：query_annual_reports（9/9 全覆盖）+ query_prospectus（7/9 — 东航分拆上市无招股书 / 顺丰挂 H 股 / 讯飞挂讯飞医疗 H 股）。DealDetail 表格点击「年报」「招股书」直跳官方原文。',
    proofRows: [
      { k: '寒武纪 (688256)', v: '年报 2024 + 招股书 2020-07-14（科创板 IPO）' },
      { k: '联影医疗 (688271)', v: '年报 2024 + 招股书 2022-08-16（科创板 IPO）' },
      { k: '海光信息 (688041)', v: '年报 2024 + 招股书 2022-08-09（科创板 IPO）' },
      { k: '石头科技 (688169)', v: '年报 2024 + 招股书 2020-02-17（科创板 IPO）' },
      { k: '科沃斯 (603486)', v: '年报 2024 + 招股书 2018-05-15（沪市主板 IPO）' },
      { k: '拉卡拉 (300773)', v: '年报 2024 + 招股书 2019-04-15（创业板 IPO）' },
      { k: '顺丰控股 (002352)', v: '年报 2024 + 招股书 2024-11-19（H 股二次上市）' },
      { k: '科大讯飞 (002230)', v: '年报 2024 + 招股书 2024-12-19（讯飞医疗 H 股分拆）' },
      { k: '东航物流 (601156)', v: '年报 2024 · 招股书无（重组分拆上市方式）' },
      { k: '资产合计', v: '25 份官方 PDF（年报 18 + 招股书 7）· 9 家公司 · 5 个上市板块' },
    ],
  },
  {
    id: 'qcc-risk',
    name: '企查查 · 风险与司法',
    shortName: 'qcc-risk',
    vendor: '企查查',
    status: 'live',
    capabilities: ['行政处罚', '司法案件', '失信被执行', '股权冻结', '经营异常', '环保处罚', '严重违法'],
    tools: [
      { name: 'get_administrative_penalty', useCase: '行政处罚检测' },
      { name: 'get_dishonest_info', useCase: '失信被执行' },
      { name: 'get_judgment_debtor_info', useCase: '被执行人' },
      { name: 'get_serious_violation', useCase: '严重违法' },
      { name: 'get_business_exception', useCase: '经营异常' },
    ],
    lastVerified: '2026-04-30',
    proofTitle: '5 家公司多维风险扫描实测（联影/旷视/字节/拼多多/暴风）',
    proofSummary: '产品识别 5 种风险颗粒度真实样例：① 全干净（联影）② 小额合规（旷视 ¥9k 消防）③ 监管处罚（字节网信办约谈）④ 高额监管（拼多多 ¥51.13 亿）⑤ 硬红线暴雷（暴风 79 条失信 + 202 条限高 + 证监会处罚）。任一硬红线触发 → 直接 Pass。',
    proofRows: [
      { k: '联影 · 6 维全干净', v: '处罚 / 失信 / 经营异常 全部 0 条 — 完美合规画像' },
      { k: '旷视 · 小额事件', v: '1 条 ¥9,000 消防（顺义）2023-10 — 披露但不影响投资' },
      { k: '字节 · 监管处罚', v: '1 条 国家网信办 2025-09 约谈 + 责令限期改正 — 平台型监管常态化' },
      { k: '拼多多 · 高额监管', v: '4 条累计 ¥51.13 亿（国家市监总局 2026-04 ¥15.16 亿）— 高风险但非诚信红线' },
      { k: '暴风 · 硬红线暴雷', v: '79 条失信 ¥4,549.65 万 + 202 条限高 + 证监会处罚 — 直接 Pass + 永久标签' },
      { k: '5 工具统一接口', v: 'get_administrative_penalty / get_dishonest_info / get_business_exception / get_serious_violation / get_judgment_debtor_info' },
      { k: '机构判定', v: '0 条干净 → 优先 · 小额 → 披露 · 监管 → 量化拖累 · 硬红线 → 直接 Pass' },
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
