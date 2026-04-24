interface ScoreRingProps {
  score: number
  size?: number
  stroke?: number
  color?: string
  label?: string
  sublabel?: string
}

export default function ScoreRing({ score, size = 132, stroke = 10, color = '#0f766e', label, sublabel }: ScoreRingProps) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.max(0, Math.min(100, score))
  const offset = circumference * (1 - pct / 100)

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 800ms cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="num font-semibold text-ink-900" style={{ fontSize: size * 0.32, lineHeight: 1 }}>{score}</div>
        {label && <div className="text-[10px] tracking-wider text-ink-500 mt-1 uppercase">{label}</div>}
        {sublabel && <div className="text-[10px] text-ink-400 mt-0.5">{sublabel}</div>}
      </div>
    </div>
  )
}
