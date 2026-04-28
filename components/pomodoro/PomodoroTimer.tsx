'use client'

interface PomodoroTimerProps {
  phase: 'work' | 'short' | 'long'
  timeLeft: number
  totalDuration: number
}

const PHASE_LABELS: Record<PomodoroTimerProps['phase'], string> = {
  work: 'Focus',
  short: 'Short break',
  long: 'Long break',
}

const R = 126
const CIRCUMFERENCE = 2 * Math.PI * R

function formatTime(seconds: number): string {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export function PomodoroTimer({ phase, timeLeft, totalDuration }: PomodoroTimerProps) {
  const progress = Math.min(1, Math.max(0, 1 - timeLeft / totalDuration))
  const dashOffset = CIRCUMFERENCE * (1 - progress)

  return (
    <div style={{ position: 'relative', width: 280, height: 280 }}>
      <svg width="280" height="280" viewBox="0 0 280 280">
        <defs>
          <linearGradient id="pgrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--jl-accent)" />
            <stop offset="100%" stopColor="var(--jl-accent-strong)" />
          </linearGradient>
        </defs>

        {/* Background track */}
        <circle
          cx="140"
          cy="140"
          r={R}
          fill="none"
          stroke="var(--jl-bg-sunken)"
          strokeWidth="14"
        />

        {/* Progress arc */}
        <circle
          cx="140"
          cy="140"
          r={R}
          fill="none"
          stroke="url(#pgrad)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 140 140)"
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>

      {/* Center overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Phase label */}
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--jl-text-faint)',
          }}
        >
          {PHASE_LABELS[phase]}
        </div>

        {/* Time display */}
        <div
          style={{
            fontFamily: 'var(--jl-font-mono)',
            fontSize: 72,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            marginTop: 8,
          }}
        >
          {formatTime(timeLeft)}
        </div>

        {/* Session count placeholder — shown via parent */}
        <div
          style={{
            fontSize: 12,
            color: 'var(--jl-text-soft)',
            marginTop: 4,
          }}
        >
          {formatTime(totalDuration - timeLeft)} elapsed
        </div>
      </div>
    </div>
  )
}
