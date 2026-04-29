// 手写 SVG 轻量图表组件 — 不依赖 Recharts，控制 bundle 体积

interface MonthlyPoint { month: string; received: number; reviewed: number; dd: number; ic: number; invested: number }

export function MonthlyTrendChart({ data, height = 180 }: { data: MonthlyPoint[]; height?: number }) {
  const padX = 36
  const padY = 18
  const W = 720
  const H = height
  const innerW = W - padX * 2
  const innerH = H - padY * 2
  const max = Math.max(...data.map(d => d.received))
  const points = data.map((d, i) => {
    const x = padX + (i / (data.length - 1)) * innerW
    const y = padY + innerH - (d.received / max) * innerH
    return { x, y, d }
  })
  const path = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ')
  const area = `${path} L ${points[points.length - 1].x} ${padY + innerH} L ${points[0].x} ${padY + innerH} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="trendGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0f766e" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0f766e" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* y grid */}
      {[0, 0.5, 1].map((p) => (
        <line key={p} x1={padX} x2={W - padX} y1={padY + innerH * p} y2={padY + innerH * p} stroke="#e2e8f0" strokeDasharray="2 4" />
      ))}
      <path d={area} fill="url(#trendGrad)" />
      <path d={path} fill="none" stroke="#0f766e" strokeWidth="2" />
      {points.map((p) => (
        <g key={p.d.month}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="#fff" stroke="#0f766e" strokeWidth="2" />
          <text x={p.x} y={p.y - 9} textAnchor="middle" className="fill-ink-700 num" style={{ fontSize: 10, fontWeight: 600 }}>{p.d.received}</text>
          <text x={p.x} y={H - 4} textAnchor="middle" className="fill-ink-500 num" style={{ fontSize: 9 }}>{p.d.month.slice(5)}</text>
        </g>
      ))}
    </svg>
  )
}

export function DonutChart({ data, size = 180, thickness = 28 }: { data: { sector: string; count: number; color: string }[]; size?: number; thickness?: number }) {
  const total = data.reduce((s, d) => s + d.count, 0)
  const cx = size / 2
  const cy = size / 2
  const r = (size - thickness) / 2
  let cumulative = 0
  const segments = data.map((d) => {
    const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2
    cumulative += d.count
    const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2
    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0
    return {
      d: `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
      color: d.color,
      sector: d.sector,
      count: d.count,
      pct: ((d.count / total) * 100).toFixed(1),
    }
  })
  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} className="shrink-0">
        {segments.map((s, i) => (
          <path key={i} d={s.d} stroke={s.color} strokeWidth={thickness} fill="none" />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" className="fill-ink-900 num" style={{ fontSize: 22, fontWeight: 600 }}>{total}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" className="fill-ink-500" style={{ fontSize: 10, letterSpacing: 1 }}>BPs</text>
      </svg>
      <div className="flex-1 space-y-1.5 text-[11.5px]">
        {data.map((d) => (
          <div key={d.sector} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: d.color }} />
              <span className="truncate">{d.sector}</span>
            </span>
            <span className="num text-ink-700 shrink-0">{d.count} <span className="text-ink-400">{((d.count / total) * 100).toFixed(0)}%</span></span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BarChart({ data, height = 140 }: { data: { range: string; count: number; label: string; color: string }[]; height?: number }) {
  const max = Math.max(...data.map(d => d.count))
  return (
    <div className="space-y-2.5">
      {data.map((d) => {
        const w = (d.count / max) * 100
        return (
          <div key={d.range}>
            <div className="flex items-center justify-between text-[11.5px]">
              <span className="text-ink-700"><span className="num font-medium">{d.range}</span> <span className="text-ink-400">· {d.label}</span></span>
              <span className="num text-ink-900 font-medium">{d.count}</span>
            </div>
            <div className="h-2 bg-ink-100 rounded-full mt-0.5 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${w}%`, background: d.color }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function ConversionFlow({ data }: { data: { from: string; to: string; rate: number; baseline: number }[] }) {
  return (
    <div className="space-y-3">
      {data.map((c) => {
        const delta = c.rate - c.baseline
        const deltaColor = delta > 0 ? '#059669' : '#dc2626'
        return (
          <div key={c.from + c.to}>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-ink-700">{c.from} → {c.to}</span>
              <span className="flex items-center gap-2">
                <span className="num text-ink-900 font-semibold">{c.rate.toFixed(1)}%</span>
                <span className="num text-[10px]" style={{ color: deltaColor }}>{delta > 0 ? '▲' : '▼'} vs 行业 {Math.abs(delta).toFixed(1)}pp</span>
              </span>
            </div>
            <div className="relative h-2.5 bg-ink-100 rounded-full mt-1 overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full bg-ink-300" style={{ width: `${c.baseline}%` }} />
              <div className="absolute inset-y-0 left-0 rounded-full bg-brand-700" style={{ width: `${c.rate}%` }} />
            </div>
          </div>
        )
      })}
      <div className="text-[10px] text-ink-400 mt-2 flex items-center gap-3">
        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-brand-700" />本基金</span>
        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-ink-300" />行业基准</span>
      </div>
    </div>
  )
}

export function Sparkline({ values, height = 28, color = '#0f766e' }: { values: number[]; height?: number; color?: string }) {
  const W = 100
  const H = height
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * W
    const y = H - ((v - min) / range) * H
    return `${x},${y.toFixed(1)}`
  }).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  )
}
