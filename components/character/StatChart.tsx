import { type FC } from 'react'

interface StatChartProps {
  stats: {
    focus: number
    discipline: number
    knowledge: number
    endurance: number
  }
}

const STATS = [
  { key: 'focus' as const, label: 'Focus', color: 'var(--jl-accent)', desc: 'Hours of deep work' },
  { key: 'discipline' as const, label: 'Discipline', color: '#f59e0b', desc: 'Habit consistency' },
  { key: 'knowledge' as const, label: 'Knowledge', color: '#8b5cf6', desc: 'Cards mastered' },
  { key: 'endurance' as const, label: 'Endurance', color: '#10b981', desc: 'Streak strength' },
]

export const StatChart: FC<StatChartProps> = ({ stats }) => (
  <div
    className="rounded-2xl"
    style={{
      background: 'var(--jl-bg-raised)',
      border: '1px solid var(--jl-line)',
      padding: 22,
    }}
  >
    <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600, color: 'var(--jl-text)' }}>
      Stats
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
      {STATS.map(s => (
        <div
          key={s.key}
          style={{
            padding: 14,
            borderRadius: 12,
            background: 'var(--jl-bg-sunken)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--jl-text-soft)',
              fontSize: 11,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 600,
                color: s.color,
              }}
            >
              {s.label}
            </span>
          </div>
          <div
            style={{
              fontFamily: 'var(--jl-font-display)',
              fontSize: 28,
              lineHeight: 1,
              color: 'var(--jl-text)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {stats[s.key]}
          </div>
          <div
            style={{
              height: 5,
              background: 'var(--jl-bg-raised)',
              borderRadius: 3,
              marginTop: 8,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${Math.min(100, stats[s.key])}%`,
                height: '100%',
                background: s.color,
                borderRadius: 3,
                transition: 'width 0.5s ease',
              }}
            />
          </div>
          <div
            style={{ fontSize: 10, color: 'var(--jl-text-faint)', marginTop: 5 }}
          >
            {s.desc}
          </div>
        </div>
      ))}
    </div>
  </div>
)
