'use client'

import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'

interface TimerControlsProps {
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip: () => void
}

const iconButtonStyle: React.CSSProperties = {
  height: 46,
  width: 46,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--jl-bg-sunken)',
  border: '1px solid var(--jl-line)',
  borderRadius: 'var(--jl-r)',
  cursor: 'pointer',
  color: 'var(--jl-text-soft)',
  flexShrink: 0,
}

export function TimerControls({
  isRunning,
  onStart,
  onPause,
  onReset,
  onSkip,
}: TimerControlsProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {/* Primary Start / Pause button */}
      <button
        onClick={isRunning ? onPause : onStart}
        style={{
          height: 46,
          padding: '0 22px',
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--jl-accent-strong)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--jl-r)',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        {isRunning ? (
          <>
            <Pause size={15} />
            Pause
          </>
        ) : (
          <>
            <Play size={15} />
            Start
          </>
        )}
      </button>

      {/* Reset button */}
      <button
        onClick={onReset}
        aria-label="Reset timer"
        style={iconButtonStyle}
      >
        <RotateCcw size={14} />
      </button>

      {/* Skip button */}
      <button
        onClick={onSkip}
        aria-label="Skip to next phase"
        style={iconButtonStyle}
      >
        <SkipForward size={14} />
      </button>
    </div>
  )
}
