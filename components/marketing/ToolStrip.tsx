import { Timer, Flame, BookOpen, ArrowRight } from 'lucide-react'
import { type ReactNode } from 'react'

const TOOLS: { icon: ReactNode; title: string; desc: string }[] = [
  {
    icon: <Timer size={22} />,
    title: 'Pomodoro',
    desc: 'RPG focus timer with tasks, ambient soundscapes and distraction blocker.',
  },
  {
    icon: <Flame size={22} />,
    title: 'Habit Tracker',
    desc: 'Streaks, heatmap, weekly insights. One dopamine hit per check.',
  },
  {
    icon: <BookOpen size={22} />,
    title: 'Flashcards',
    desc: 'SM-2 spaced repetition, cloze deletion, image occlusion — Anki-grade.',
  },
]

export function ToolStrip() {
  return (
    <section style={{ padding: '8px 48px 64px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {TOOLS.map((tool) => (
          <div
            key={tool.title}
            style={{
              padding: 24,
              borderRadius: 'var(--jl-r-lg)',
              background: 'var(--jl-bg-raised)',
              border: '1px solid var(--jl-line-soft)',
              boxShadow: 'var(--jl-shadow-sm)',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'var(--jl-accent-soft)',
                color: 'var(--jl-accent-ink)',
                display: 'grid',
                placeItems: 'center',
                marginBottom: 18,
              }}
            >
              {tool.icon}
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--jl-text)' }}>{tool.title}</h3>
            <p
              style={{
                fontSize: 13.5,
                color: 'var(--jl-text-soft)',
                marginTop: 8,
                lineHeight: 1.55,
              }}
            >
              {tool.desc}
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                marginTop: 14,
                color: 'var(--jl-accent-ink)',
                fontWeight: 500,
              }}
            >
              Open tool <ArrowRight size={12} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
