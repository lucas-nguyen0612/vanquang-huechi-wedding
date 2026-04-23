'use client'
import { useEffect, useRef } from 'react'
import { usePomodoroStore } from '@/store/pomodoroStore'

export function useTimer() {
  const isRunning = usePomodoroStore(s => s.isRunning)
  const tick = usePomodoroStore(s => s.tick)
  const startedAt = usePomodoroStore(s => s.startedAt)

  // RAF-based 1-second ticker
  const lastTickRef = useRef<number>(Date.now())
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
      return
    }
    lastTickRef.current = Date.now()

    function loop() {
      const now = Date.now()
      if (now - lastTickRef.current >= 1000) {
        tick()
        lastTickRef.current = now
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
    }
  }, [isRunning, tick])

  // Tab visibility: catch up when tab becomes active
  useEffect(() => {
    function handleVisibilityChange() {
      if (!document.hidden && isRunning && startedAt) {
        const store = usePomodoroStore.getState()
        const elapsed = Math.floor((Date.now() - startedAt) / 1000)
        const newTimeLeft = Math.max(0, store.settings.workDuration - elapsed)
        if (Math.abs(newTimeLeft - store.timeLeft) > 2) {
          usePomodoroStore.setState({ timeLeft: newTimeLeft })
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isRunning, startedAt])
}
