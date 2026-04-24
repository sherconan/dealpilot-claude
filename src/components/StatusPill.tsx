import { stageMeta, recommendationMeta } from '../lib/scoring'
import type { Stage, Recommendation } from '../types'

export function StagePill({ stage }: { stage: Stage }) {
  const m = stageMeta[stage]
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full ${m.bg} font-medium`} style={{ color: m.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />
      {m.label}
    </span>
  )
}

export function RecommendationPill({ rec }: { rec: Recommendation }) {
  const m = recommendationMeta[rec]
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full ${m.bg} font-medium`} style={{ color: m.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />
      {m.label}
    </span>
  )
}
