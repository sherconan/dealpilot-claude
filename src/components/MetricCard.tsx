interface MetricCardProps {
  label: string
  value: string | number
  delta?: string
  deltaPositive?: boolean
  hint?: string
  accent?: string
}

export default function MetricCard({ label, value, delta, deltaPositive = true, hint, accent }: MetricCardProps) {
  return (
    <div className="bg-white border border-ink-200 rounded-xl p-4 relative overflow-hidden">
      {accent && <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: accent }} />}
      <div className="text-[11px] text-ink-500 tracking-wider uppercase">{label}</div>
      <div className="flex items-end justify-between mt-2">
        <div className="num font-semibold text-ink-900 text-2xl tracking-tight">{value}</div>
        {delta && (
          <span className={`text-[11px] num font-medium ${deltaPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
            {deltaPositive ? '▲' : '▼'} {delta}
          </span>
        )}
      </div>
      {hint && <div className="text-[11px] text-ink-400 mt-1">{hint}</div>}
    </div>
  )
}
