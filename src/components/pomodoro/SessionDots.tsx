'use client'

interface SessionDotsProps {
  sessionCount: number
  total?: number
  xpEarned?: number
}

export function SessionDots({ sessionCount, total = 4, xpEarned }: SessionDotsProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {/* "Today" label */}
      <span style={{ fontSize: 11, color: 'var(--jl-text-faint)' }}>Today</span>

      {/* Session dots */}
      {Array.from({ length: total }).map((_, i) => {
        const isCompleted = i < sessionCount
        const isCurrent = i === sessionCount

        return (
          <div
            key={i}
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: isCompleted
                ? 'var(--jl-accent-strong)'
                : isCurrent
                  ? 'var(--jl-accent-soft)'
                  : 'var(--jl-bg-sunken)',
              border: `1px solid ${
                isCurrent
                  ? 'var(--jl-accent)'
                  : isCompleted
                    ? 'transparent'
                    : 'var(--jl-line-soft)'
              }`,
              transition: 'background 0.2s, border-color 0.2s',
            }}
          />
        )
      })}

      {/* XP earned label */}
      {xpEarned !== undefined && xpEarned > 0 && (
        <span
          style={{
            marginLeft: 10,
            fontSize: 11,
            color: 'var(--jl-text-faint)',
          }}
        >
          +{xpEarned} XP earned
        </span>
      )}
    </div>
  )
}
