'use client'
import { useEffect } from 'react'
import { X } from 'lucide-react'
import { usePomodoroStore } from '@/store/pomodoroStore'
import { PomodoroTimer } from './PomodoroTimer'
import { TimerControls } from './TimerControls'

interface FocusModeOverlayProps {
  onClose: () => void
}

export function FocusModeOverlay({ onClose }: FocusModeOverlayProps) {
  const phase = usePomodoroStore(s => s.phase)
  const timeLeft = usePomodoroStore(s => s.timeLeft)
  const isRunning = usePomodoroStore(s => s.isRunning)
  const settings = usePomodoroStore(s => s.settings)
  const activeTaskId = usePomodoroStore(s => s.activeTaskId)
  const tasks = usePomodoroStore(s => s.tasks)
  const startTimer = usePomodoroStore(s => s.startTimer)
  const pauseTimer = usePomodoroStore(s => s.pauseTimer)
  const resetTimer = usePomodoroStore(s => s.resetTimer)
  const skipPhase = usePomodoroStore(s => s.skipPhase)

  const activeTask = tasks.find(t => t.id === activeTaskId)

  const totalDuration =
    phase === 'work'
      ? settings.workDuration
      : phase === 'short'
        ? settings.shortDuration
        : settings.longDuration

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--jl-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
      }}
    >
      <button
        onClick={onClose}
        aria-label="Exit focus mode"
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          background: 'var(--jl-bg-raised)',
          border: '1px solid var(--jl-line)',
          borderRadius: 'var(--jl-r)',
          padding: '6px 14px',
          cursor: 'pointer',
          color: 'var(--jl-text-soft)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
        }}
      >
        <X size={14} /> Exit Focus Mode
      </button>

      <PomodoroTimer phase={phase} timeLeft={timeLeft} totalDuration={totalDuration} />

      {activeTask && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--jl-text-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            Working on
          </div>
          <div style={{ fontSize: 24, fontFamily: 'var(--jl-font-display)', letterSpacing: '-0.02em' }}>
            {activeTask.title}
          </div>
          <div style={{ fontSize: 12, color: 'var(--jl-text-soft)', marginTop: 4 }}>
            {activeTask.pomodorosDone}/{activeTask.pomodorosEstimated} pomodoros
          </div>
        </div>
      )}

      <TimerControls
        isRunning={isRunning}
        onStart={startTimer}
        onPause={pauseTimer}
        onReset={resetTimer}
        onSkip={skipPhase}
      />

      <div style={{ fontSize: 12, color: 'var(--jl-text-faint)' }}>
        Press <kbd style={{ padding: '2px 6px', background: 'var(--jl-bg-sunken)', borderRadius: 4, border: '1px solid var(--jl-line)' }}>Space</kbd> to start/pause · <kbd style={{ padding: '2px 6px', background: 'var(--jl-bg-sunken)', borderRadius: 4, border: '1px solid var(--jl-line)' }}>Esc</kbd> to exit
      </div>
    </div>
  )
}
