'use client'

import type { ReactNode } from 'react'
import { Sparkles } from 'lucide-react'
import type { HabitWithStatus } from '@/features/habits/types'

interface AiInsightCardProps {
  habits: HabitWithStatus[]
}

function buildInsightNode(habits: HabitWithStatus[]): ReactNode {
  const total = habits.length
  const doneToday = habits.filter(h => h.checked_today).length

  const streak7 = habits.find(h => h.current_streak >= 7)
  if (streak7) {
    return (
      <>
        Your <strong>{streak7.name}</strong> habit is on a{' '}
        <strong>{streak7.current_streak}-day streak</strong> — keep the momentum!
      </>
    )
  }

  const streak3 = habits.find(h => h.current_streak >= 3)
  if (streak3) {
    return (
      <>
        <strong>{streak3.name}</strong> is building momentum at{' '}
        <strong>{streak3.current_streak} days</strong>. Don&apos;t break the chain!
      </>
    )
  }

  const morningHabits = habits.filter(h => h.time_of_day === 'morning')
  const eveningHabits = habits.filter(h => h.time_of_day === 'evening')
  if (morningHabits.length > 0 && eveningHabits.length > 0) {
    const morningRate = morningHabits.filter(h => h.checked_today).length / morningHabits.length
    const eveningRate = eveningHabits.filter(h => h.checked_today).length / eveningHabits.length
    if (morningRate > 0 && eveningRate > 0 && morningRate > eveningRate) {
      const ratio = (morningRate / eveningRate).toFixed(1)
      return (
        <>
          You complete morning habits <strong>{ratio}× more reliably</strong> than evening ones.
          Try scheduling more habits in the morning.
        </>
      )
    }
  }

  if (doneToday === total && total > 0) {
    return (
      <>
        <strong>All {total} habits done today!</strong> You&apos;re building an unstoppable routine.
        🎉
      </>
    )
  }

  return <>Check in daily to build streaks and unlock insights about your habits.</>
}

export const AiInsightCard = ({ habits }: AiInsightCardProps) => {
  return (
    <div
      className="jl-card"
      style={{
        padding: 20,
        background: 'color-mix(in oklch, var(--jl-accent-soft) 50%, var(--jl-bg-raised))',
        borderColor: 'color-mix(in oklch, var(--jl-accent) 30%, transparent)',
      }}
    >
      <div className="flex items-center" style={{ gap: 8, marginBottom: 10 }}>
        <Sparkles size={14} color="var(--jl-accent-strong)" />
        <span
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 600,
            color: 'var(--jl-accent-ink)',
          }}
        >
          Insight
        </span>
      </div>
      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: 'var(--jl-text)' }}>
        {buildInsightNode(habits)}
      </p>
    </div>
  )
}
