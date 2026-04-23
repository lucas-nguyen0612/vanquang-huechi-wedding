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

  // Tab visibility: catch up ticks that were missed while hidden
  const hiddenAtRef = useRef<number | null>(null)
  useEffect(() => {
    function onHide() {
      if (document.hidden && usePomodoroStore.getState().isRunning) {
        hiddenAtRef.current = Date.now()
      }
    }
    function onShow() {
      if (!document.hidden && hiddenAtRef.current !== null) {
        const missedSeconds = Math.floor((Date.now() - hiddenAtRef.current) / 1000)
        hiddenAtRef.current = null
        if (missedSeconds > 0 && usePomodoroStore.getState().isRunning) {
          const store = usePomodoroStore.getState()
          const newTimeLeft = Math.max(0, store.timeLeft - missedSeconds)
          if (newTimeLeft !== store.timeLeft) {
            usePomodoroStore.setState({ timeLeft: newTimeLeft })
            // If time ran out while hidden, complete the session
            if (newTimeLeft === 0) store.tick()
          }
        }
      }
    }
    document.addEventListener('visibilitychange', onHide)
    document.addEventListener('visibilitychange', onShow)
    return () => {
      document.removeEventListener('visibilitychange', onHide)
      document.removeEventListener('visibilitychange', onShow)
    }
  }, [])
}
