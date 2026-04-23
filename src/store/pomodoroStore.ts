import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Phase = 'work' | 'short' | 'long'

export interface PomodoroTask {
  id: string
  title: string
  completed: boolean
  pomodorosDone: number
  pomodorosEstimated: number
}

export interface PomodoroSettings {
  workDuration: number
  shortDuration: number
  longDuration: number
  sessionsUntilLong: number
  soundscape: string
  volume: number
  blockedSites: string[]
  focusBlockerEnabled: boolean
}

interface PomodoroStore {
  phase: Phase
  timeLeft: number
  isRunning: boolean
  sessionCount: number
  tasks: PomodoroTask[]
  activeTaskId: string | null
  settings: PomodoroSettings
  startedAt: number | null
  pausedAt: number | null
  interruptions: number

  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  skipPhase: () => void
  addTask: (title: string, estimated?: number) => void
  removeTask: (id: string) => void
  toggleTask: (id: string) => void
  setActiveTask: (id: string | null) => void
  reorderTasks: (activeId: string, overId: string) => void
  updateSettings: (s: Partial<PomodoroSettings>) => void
  tick: () => void
  onSessionComplete: () => Promise<void>
}

function durationForPhase(phase: Phase, settings: PomodoroSettings): number {
  if (phase === 'work') return settings.workDuration
  if (phase === 'short') return settings.shortDuration
  return settings.longDuration
}

function nextPhase(
  current: Phase,
  sessionCount: number,
  sessionsUntilLong: number
): Phase {
  if (current === 'work') {
    // After completing a work session, pick break type
    const nextSession = sessionCount + 1
    return nextSession % sessionsUntilLong === 0 ? 'long' : 'short'
  }
  return 'work'
}

const defaultSettings: PomodoroSettings = {
  workDuration: 1500,
  shortDuration: 300,
  longDuration: 900,
  sessionsUntilLong: 4,
  soundscape: 'silent',
  volume: 0.5,
  blockedSites: [],
  focusBlockerEnabled: false,
}

export const usePomodoroStore = create<PomodoroStore>()(
  persist(
    (set, get) => ({
      phase: 'work',
      timeLeft: defaultSettings.workDuration,
      isRunning: false,
      sessionCount: 0,
      tasks: [],
      activeTaskId: null,
      settings: defaultSettings,
      startedAt: null,
      pausedAt: null,
      interruptions: 0,

      startTimer: () => {
        set({ isRunning: true, startedAt: Date.now(), pausedAt: null })
      },

      pauseTimer: () => {
        set(s => ({
          isRunning: false,
          pausedAt: Date.now(),
          interruptions: s.interruptions + 1,
        }))
      },

      resetTimer: () => {
        const { phase, settings } = get()
        set({
          timeLeft: durationForPhase(phase, settings),
          isRunning: false,
          startedAt: null,
          pausedAt: null,
        })
      },

      skipPhase: () => {
        const { phase, sessionCount, settings } = get()
        const wasWork = phase === 'work'
        const newSessionCount = wasWork ? sessionCount + 1 : sessionCount
        const newPhase = nextPhase(phase, sessionCount, settings.sessionsUntilLong)
        set({
          phase: newPhase,
          timeLeft: durationForPhase(newPhase, settings),
          isRunning: false,
          sessionCount: newSessionCount,
          startedAt: null,
          pausedAt: null,
          interruptions: 0,
        })
      },

      addTask: (title, estimated = 1) => {
        set(s => ({
          tasks: [
            ...s.tasks,
            {
              id: crypto.randomUUID(),
              title,
              completed: false,
              pomodorosDone: 0,
              pomodorosEstimated: estimated,
            },
          ],
        }))
      },

      removeTask: (id) => {
        set(s => ({
          tasks: s.tasks.filter(t => t.id !== id),
          activeTaskId: s.activeTaskId === id ? null : s.activeTaskId,
        }))
      },

      toggleTask: (id) => {
        set(s => ({
          tasks: s.tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        }))
      },

      setActiveTask: (id) => {
        set({ activeTaskId: id })
      },

      reorderTasks: (activeId, overId) => {
        set(s => {
          const tasks = [...s.tasks]
          const activeIdx = tasks.findIndex(t => t.id === activeId)
          const overIdx = tasks.findIndex(t => t.id === overId)
          if (activeIdx === -1 || overIdx === -1) return {}
          const [removed] = tasks.splice(activeIdx, 1)
          tasks.splice(overIdx, 0, removed)
          return { tasks }
        })
      },

      updateSettings: (s) => {
        set(state => ({
          settings: { ...state.settings, ...s },
        }))
      },

      tick: () => {
        const { timeLeft, phase } = get()
        if (timeLeft <= 1) {
          // Time's up
          if (phase === 'work') {
            get().onSessionComplete()
          } else {
            get().skipPhase()
          }
        } else {
          set({ timeLeft: timeLeft - 1 })
        }
      },

      onSessionComplete: async () => {
        const state = get()
        const xpBase = 10
        const cleanBonus = state.interruptions === 0 ? 5 : 0
        const xpAwarded = xpBase + cleanBonus

        // Update active task pomodorosDone
        if (state.activeTaskId) {
          set(s => ({
            tasks: s.tasks.map(t =>
              t.id === s.activeTaskId
                ? { ...t, pomodorosDone: t.pomodorosDone + 1 }
                : t
            ),
          }))
        }
        set({ interruptions: 0 })

        // Post to API
        try {
          const res = await fetch('/api/pomodoro/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              taskId: state.activeTaskId,
              durationMinutes: Math.round(state.settings.workDuration / 60),
              interruptions: state.interruptions,
              isClean: state.interruptions === 0,
            }),
          })
          const data = await res.json()
          window.dispatchEvent(
            new CustomEvent('jl:xp-gain', {
              detail: { amount: data.xpAwarded ?? xpAwarded },
            })
          )
          if (data.leveledUp) window.dispatchEvent(new Event('jl:levelup'))
        } catch {
          window.dispatchEvent(
            new CustomEvent('jl:xp-gain', { detail: { amount: xpAwarded } })
          )
        }

        // Advance to next phase
        get().skipPhase()
      },
    }),
    {
      name: 'jl-pomodoro',
      partialize: (state) => ({
        phase: state.phase,
        timeLeft: state.timeLeft,
        sessionCount: state.sessionCount,
        tasks: state.tasks,
        activeTaskId: state.activeTaskId,
        settings: state.settings,
        interruptions: state.interruptions,
        // isRunning, startedAt, pausedAt are intentionally excluded
      }),
    }
  )
)
