'use client'

import type { FlashCard } from '@/features/flashcards/types'

interface ForecastChartProps {
  cards: FlashCard[]
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function ForecastChart({ cards }: ForecastChartProps) {
  // Build a map: date string -> count
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const days: Array<{ label: string; date: string; count: number; isToday: boolean }> = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    days.push({
      label: DAY_LABELS[d.getDay()],
      date: dateStr,
      count: 0,
      isToday: i === 0,
    })
  }

  for (const card of cards) {
    const dueDate = card.due_date?.split('T')[0]
    const slot = days.find(d => d.date === dueDate)
    if (slot) slot.count++
  }

  const maxCount = Math.max(...days.map(d => d.count), 1)

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: 'var(--jl-bg-elevated)',
        border: '1px solid var(--jl-border)',
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--jl-text)',
          marginBottom: 12,
        }}
      >
        Forecast · next 7 days
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 6,
          height: 80,
        }}
      >
        {days.map(day => {
          const heightPct = maxCount > 0 ? (day.count / maxCount) * 100 : 0
          return (
            <div
              key={day.date}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                height: '100%',
                justifyContent: 'flex-end',
              }}
            >
              <div
                title={`${day.count} cards`}
                style={{
                  width: '100%',
                  height: `${Math.max(heightPct, 4)}%`,
                  background: day.isToday
                    ? 'var(--jl-accent-strong)'
                    : 'color-mix(in oklch, var(--jl-accent) 30%, var(--jl-bg-sunken))',
                  borderRadius: 4,
                  transition: 'height 0.3s ease',
                }}
              />
              <span
                style={{
                  fontSize: 9,
                  color: day.isToday ? 'var(--jl-accent-strong)' : 'var(--jl-text-faint)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: day.isToday ? 700 : 400,
                }}
              >
                {day.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
