'use client'
import { useEffect, useState } from 'react'
import { Target, Settings } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { usePomodoroStore } from '@/store/pomodoroStore'
import { useTimer } from '@/hooks/useTimer'
import { PomodoroTimer } from '@/components/pomodoro/PomodoroTimer'
import { ModeSelector } from '@/components/pomodoro/ModeSelector'
import { TimerControls } from '@/components/pomodoro/TimerControls'
import { SessionDots } from '@/components/pomodoro/SessionDots'
import { FocusModeOverlay } from '@/components/pomodoro/FocusModeOverlay'
import { TaskList } from '@/components/pomodoro/TaskList'
import { SoundscapeSelector } from '@/components/pomodoro/SoundscapeSelector'
import { FocusBlocker } from '@/components/pomodoro/FocusBlocker'
import { XPTickerPanel } from '@/components/pomodoro/XPTickerPanel'
import { SessionHistoryChart } from '@/components/pomodoro/SessionHistoryChart'

const cardStyle: React.CSSProperties = {
  background: 'var(--jl-bg-raised)',
  border: '1px solid var(--jl-line-soft)',
  borderRadius: 'var(--jl-r-lg)',
  padding: 20,
}

export default function PomodoroPage() {
  // Activate RAF timer hook
  useTimer()

  const phase = usePomodoroStore(s => s.phase)
  const timeLeft = usePomodoroStore(s => s.timeLeft)
  const isRunning = usePomodoroStore(s => s.isRunning)
  const sessionCount = usePomodoroStore(s => s.sessionCount)
  const tasks = usePomodoroStore(s => s.tasks)
  const activeTaskId = usePomodoroStore(s => s.activeTaskId)
  const settings = usePomodoroStore(s => s.settings)
  const startTimer = usePomodoroStore(s => s.startTimer)
  const pauseTimer = usePomodoroStore(s => s.pauseTimer)
  const resetTimer = usePomodoroStore(s => s.resetTimer)
  const skipPhase = usePomodoroStore(s => s.skipPhase)

  const activeTask = tasks.find(t => t.id === activeTaskId) ?? null

  const totalDuration =
    phase === 'work'
      ? settings.workDuration
      : phase === 'short'
        ? settings.shortDuration
        : settings.longDuration

  const [focusMode, setFocusMode] = useState(false)

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === ' ') {
        e.preventDefault()
        isRunning ? pauseTimer() : startTimer()
      }
      if (e.key === 'r' || e.key === 'R') resetTimer()
      if (e.key === 'f' || e.key === 'F') setFocusMode(m => !m)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isRunning, startTimer, pauseTimer, resetTimer])

  // Notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Desktop notification when session completes
  useEffect(() => {
    function onXP() {
      if (Notification.permission === 'granted') {
        new Notification('JL Tools · Session Complete 🍅', {
          body: 'Nice work! Take a break and earn your XP.',
          icon: '/favicon.ico',
        })
      }
    }
    window.addEventListener('jl:xp-gain', onXP)
    return () => window.removeEventListener('jl:xp-gain', onXP)
  }, [])

  // BroadcastChannel cross-tab sync
  useEffect(() => {
    const bc = new BroadcastChannel('jl-pomodoro')
    bc.onmessage = (e) => {
      if (e.data.type === 'sync') {
        usePomodoroStore.setState(e.data.state)
      }
    }
    const unsub = usePomodoroStore.subscribe(state => {
      bc.postMessage({
        type: 'sync',
        state: { timeLeft: state.timeLeft, isRunning: state.isRunning, phase: state.phase },
      })
    })
    return () => {
      unsub()
      bc.close()
    }
  }, [])

  // Phase selector handler
  function handlePhaseSelect(p: 'work' | 'short' | 'long') {
    pauseTimer()
    usePomodoroStore.setState({
      phase: p,
      timeLeft:
        p === 'work'
          ? settings.workDuration
          : p === 'short'
            ? settings.shortDuration
            : settings.longDuration,
      isRunning: false,
    })
  }

  return (
    <>
      {focusMode && <FocusModeOverlay onClose={() => setFocusMode(false)} />}

      <div className="flex flex-col h-full">
        <TopBar
          title="Pomodoro"
          subtitle="Focus block · +10 XP per session"
          rightSlot={
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setFocusMode(m => !m)}
                title="Focus mode (F)"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  height: 32,
                  padding: '0 12px',
                  background: focusMode ? 'var(--jl-accent-soft)' : 'var(--jl-bg-sunken)',
                  border: `1px solid ${focusMode ? 'var(--jl-accent)' : 'var(--jl-line)'}`,
                  borderRadius: 'var(--jl-r)',
                  cursor: 'pointer',
                  fontSize: 12,
                  color: focusMode ? 'var(--jl-accent-ink)' : 'var(--jl-text-soft)',
                  fontWeight: 500,
                }}
              >
                <Target size={13} />
                Focus Mode
              </button>

              <button
                title="Settings"
                style={{
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--jl-bg-sunken)',
                  border: '1px solid var(--jl-line)',
                  borderRadius: 'var(--jl-r)',
                  cursor: 'pointer',
                  color: 'var(--jl-text-soft)',
                }}
              >
                <Settings size={14} />
              </button>
            </div>
          }
        />

        <div className="flex-1 overflow-auto" style={{ padding: '22px 28px 40px' }}>
          <div className="grid grid-cols-[1fr_360px] gap-[22px]">

            {/* ── Left column ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

              {/* Timer card */}
              <div style={cardStyle}>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 36, alignItems: 'center' }}>
                  {/* Circular timer */}
                  <PomodoroTimer phase={phase} timeLeft={timeLeft} totalDuration={totalDuration} />

                  {/* Right side of timer card */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <ModeSelector phase={phase} onSelect={handlePhaseSelect} disabled={isRunning} />

                    {/* Active task display */}
                    {activeTask ? (
                      <div>
                        <div
                          style={{
                            fontSize: 11,
                            color: 'var(--jl-text-faint)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            marginBottom: 6,
                          }}
                        >
                          Working on
                        </div>
                        <div
                          style={{
                            fontSize: 22,
                            fontFamily: 'var(--jl-font-display)',
                            letterSpacing: '-0.02em',
                          }}
                        >
                          {activeTask.title}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--jl-text-soft)', marginTop: 4 }}>
                          {activeTask.pomodorosDone}/{activeTask.pomodorosEstimated} pomodoros
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 14, color: 'var(--jl-text-faint)' }}>
                        No task selected — click a task below to focus
                      </div>
                    )}

                    <TimerControls
                      isRunning={isRunning}
                      onStart={startTimer}
                      onPause={pauseTimer}
                      onReset={resetTimer}
                      onSkip={skipPhase}
                    />

                    <SessionDots
                      sessionCount={sessionCount % settings.sessionsUntilLong}
                      total={settings.sessionsUntilLong}
                      xpEarned={sessionCount * 10}
                    />

                    {/* Keyboard hint */}
                    <div style={{ fontSize: 11, color: 'var(--jl-text-faint)' }}>
                      <kbd style={{ padding: '1px 5px', background: 'var(--jl-bg-sunken)', borderRadius: 3, border: '1px solid var(--jl-line)', fontSize: 10 }}>Space</kbd> start/pause ·{' '}
                      <kbd style={{ padding: '1px 5px', background: 'var(--jl-bg-sunken)', borderRadius: 3, border: '1px solid var(--jl-line)', fontSize: 10 }}>R</kbd> reset ·{' '}
                      <kbd style={{ padding: '1px 5px', background: 'var(--jl-bg-sunken)', borderRadius: 3, border: '1px solid var(--jl-line)', fontSize: 10 }}>F</kbd> focus mode
                    </div>
                  </div>
                </div>
              </div>

              {/* Task list card */}
              <div style={cardStyle}>
                <TaskList />
              </div>
            </div>

            {/* ── Right column ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Soundscape */}
              <div style={cardStyle}>
                <SoundscapeSelector />
              </div>

              {/* Focus Blocker */}
              <div style={cardStyle}>
                <FocusBlocker />
              </div>

              {/* XP Ticker */}
              <div style={cardStyle}>
                <XPTickerPanel />
              </div>

              {/* Session History */}
              <div style={cardStyle}>
                <SessionHistoryChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
