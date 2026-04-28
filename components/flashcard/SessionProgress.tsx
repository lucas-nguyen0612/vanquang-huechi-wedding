'use client'

interface SessionProgressProps {
  current: number
  total: number
}

export function SessionProgress({ current, total }: SessionProgressProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className="w-full">
      <div
        className="flex justify-between"
        style={{ fontSize: 11, color: 'var(--jl-text-soft)', marginBottom: 6 }}
      >
        <span>Session progress</span>
        <span className="font-mono tabular-nums">
          {current} / {total} · {pct}%
        </span>
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 999,
          background: 'var(--jl-bg-sunken)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: 'var(--jl-accent-strong)',
            transition: 'width 0.3s ease',
            borderRadius: 999,
          }}
        />
      </div>
    </div>
  )
}
