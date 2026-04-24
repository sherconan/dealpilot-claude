import { deals } from '../data/deals'
import { Link } from 'react-router-dom'
import { StagePill, RecommendationPill } from '../components/StatusPill'

export default function Memory() {
  const sorted = [...deals].sort((a, b) => b.score - a.score)

  return (
    <div className="px-8 py-6 max-w-[1400px] mx-auto">
      <header className="mb-5">
        <div className="text-[11px] tracking-[0.16em] text-ink-500 uppercase">Institutional Memory</div>
        <h1 className="text-[24px] font-semibold tracking-tight mt-1">机构记忆库</h1>
        <p className="text-[13px] text-ink-600 mt-1.5">所有评估过的项目结构化存档，创始人再次出现时自动提醒，避免信息断层错过二次机会</p>
      </header>

      <div className="bg-white border border-ink-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[120px_1fr_100px_100px_140px_140px_100px_120px] gap-3 px-5 py-3 text-[11px] tracking-wider uppercase text-ink-500 bg-ink-50 border-b border-ink-200">
          <div>评分</div>
          <div>项目</div>
          <div>阶段</div>
          <div>本轮</div>
          <div>赛道</div>
          <div>冠军 / 来源</div>
          <div>Red Flag</div>
          <div>最后更新</div>
        </div>
        <div className="divide-y divide-ink-100">
          {sorted.map((d) => (
            <Link key={d.id} to={`/deal/${d.id}`} className="grid grid-cols-[120px_1fr_100px_100px_140px_140px_100px_120px] gap-3 px-5 py-3 text-[13px] hover:bg-ink-50 transition items-center">
              <div className="flex items-center gap-2">
                <div className="num font-semibold text-[15px]" style={{ color: d.accentColor }}>{d.score}</div>
                <RecommendationPill rec={d.recommendation} />
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate">{d.name}<span className="text-ink-500 font-normal ml-1.5">{d.cnName}</span></div>
                <div className="text-[11px] text-ink-500 truncate">{d.tagline}</div>
              </div>
              <div><StagePill stage={d.stage} /></div>
              <div className="num text-ink-800">{d.askAmount}</div>
              <div className="text-ink-700">{d.sector}</div>
              <div className="text-ink-700 text-[12px]">{d.champion || '—'}<div className="text-[10px] text-ink-400">{d.source}</div></div>
              <div>
                {d.redFlags.filter(f => f.severity === 'hard').length > 0
                  ? <span className="text-[11px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">硬 · {d.redFlags.filter(f => f.severity === 'hard').length}</span>
                  : d.redFlags.length > 0
                  ? <span className="text-[11px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">软 · {d.redFlags.length}</span>
                  : <span className="text-[11px] text-emerald-700">干净</span>}
              </div>
              <div className="text-[11px] text-ink-400">{d.lastUpdated}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4 text-[11px] text-ink-500 flex items-center gap-4">
        <span>共 {deals.length} 条记录</span>
        <span>· 结构化字段：公司名、创始人、赛道、拒绝原因、评分、时间戳</span>
        <span>· 创始人二次出现自动召回</span>
      </div>
    </div>
  )
}
