'use client'

import { Button } from '@/components/ui/button'
import type { SessionSummary as SessionSummaryType } from '@/features/flashcards/types'

interface SessionSummaryProps {
  summary: SessionSummaryType
  onRestart: () => void
  onBack: () => void
}

export function SessionSummary({ summary, onRestart, onBack }: SessionSummaryProps) {
  return (
    <div
      className="rounded-xl p-8 flex flex-col items-center gap-6"
      style={{
        background: 'var(--jl-bg-elevated)',
        border: '1px solid var(--jl-border)',
        maxWidth: 480,
        margin: '0 auto',
        width: '100%',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--jl-text-faint)', marginBottom: 8 }}>
          Session complete
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: 'var(--jl-accent-strong)',
            lineHeight: 1,
            fontFamily: 'var(--font-display)',
          }}
        >
          {summary.retentionRate}%
        </div>
        <div style={{ fontSize: 13, color: 'var(--jl-text-soft)', marginTop: 6 }}>retention rate</div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 16px',
          borderRadius: 20,
          background: 'color-mix(in oklch, var(--jl-accent-strong) 15%, transparent)',
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--jl-accent-strong)',
        }}
      >
        +{summary.xpEarned} XP earned
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          width: '100%',
        }}
      >
        {[
          { label: 'Again', count: summary.again, color: 'var(--jl-danger)' },
          { label: 'Hard', count: summary.hard, color: 'var(--jl-warn)' },
          { label: 'Good', count: summary.good, color: 'var(--jl-success)' },
          { label: 'Easy', count: summary.easy, color: 'var(--jl-info)' },
        ].map(item => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '10px 8px',
              borderRadius: 10,
              background: 'var(--jl-bg-sunken)',
              border: '1px solid var(--jl-border)',
            }}
          >
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: item.color,
                fontFamily: 'var(--font-mono)',
                lineHeight: 1,
              }}
            >
              {item.count}
            </span>
            <span style={{ fontSize: 10, color: 'var(--jl-text-faint)' }}>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 13, color: 'var(--jl-text-soft)' }}>
        {summary.total} cards reviewed in total
      </div>

      <div className="flex gap-3 w-full">
        <Button
          onClick={onRestart}
          style={{
            flex: 1,
            background: 'var(--jl-accent-strong)',
            color: '#fff',
            border: 'none',
          }}
        >
          Study Again
        </Button>
        <Button
          onClick={onBack}
          variant="outline"
          style={{ flex: 1 }}
        >
          Back to Decks
        </Button>
      </div>
    </div>
  )
}
