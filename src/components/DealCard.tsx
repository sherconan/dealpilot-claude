import { Link } from 'react-router-dom'
import type { Deal } from '../types'
import { StagePill, RecommendationPill } from './StatusPill'

export default function DealCard({ deal, compact = false }: { deal: Deal; compact?: boolean }) {
  const scoreColor =
    deal.score >= 80 ? '#0f766e' : deal.score >= 65 ? '#2563eb' : deal.score >= 50 ? '#d97706' : '#dc2626'

  return (
    <Link
      to={`/deal/${deal.id}`}
      className="group block bg-white border border-ink-200 rounded-xl p-4 hover:shadow-pop hover:border-brand-500/40 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-[15px] tracking-tight text-ink-900 truncate">{deal.name}</h3>
            <span className="text-[12px] text-ink-500">{deal.cnName}</span>
          </div>
          <p className="text-[13px] text-ink-600 mt-1 line-clamp-2">{deal.tagline}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="num text-2xl font-semibold" style={{ color: scoreColor }}>{deal.score}</div>
          <div className="text-[10px] text-ink-400 tracking-widest uppercase">/ 100</div>
        </div>
      </div>

      {!compact && (
        <div className="mt-3 grid grid-cols-3 gap-3 text-[11px]">
          <div>
            <div className="text-ink-400">赛道 / 阶段</div>
            <div className="text-ink-800 font-medium mt-0.5 truncate">{deal.sector} · {deal.round}</div>
          </div>
          <div>
            <div className="text-ink-400">估值 / 融资</div>
            <div className="text-ink-800 font-medium mt-0.5 num truncate">{deal.valuation} · {deal.askAmount}</div>
          </div>
          <div>
            <div className="text-ink-400">ARR / 增长</div>
            <div className="text-ink-800 font-medium mt-0.5 num truncate">{deal.arr || '—'}</div>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <StagePill stage={deal.stage} />
          <RecommendationPill rec={deal.recommendation} />
          {deal.redFlags.some((f) => f.severity === 'hard') && (
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600" /> 硬 Red Flag
            </span>
          )}
        </div>
        <div className="text-[11px] text-ink-400 shrink-0">{deal.lastUpdated}</div>
      </div>
    </Link>
  )
}
