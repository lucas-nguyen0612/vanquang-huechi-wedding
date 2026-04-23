'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import type { Deck } from '@/features/flashcards/types'
import { DECK_COLOR_MAP } from '@/features/flashcards/constants'

interface DeckCardProps {
  deck: Deck
  onStudy: () => void
  onEdit: () => void
  onDelete: () => void
}

export function DeckCard({ deck, onStudy, onEdit, onDelete }: DeckCardProps) {
  const colorHex = DECK_COLOR_MAP[deck.color] ?? deck.color
  const hasDue = deck.due_count > 0

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'var(--jl-bg-elevated)',
        border: '1px solid var(--jl-border)',
        position: 'relative',
      }}
    >
      {/* Color strip */}
      <div
        style={{
          height: 4,
          background: colorHex,
          width: '100%',
        }}
      />

      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--jl-text)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginBottom: 2,
              }}
            >
              {deck.name}
            </div>
            {deck.description && (
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--jl-text-soft)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {deck.description}
              </div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                style={{
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--jl-text-faint)',
                  cursor: 'pointer',
                  fontSize: 18,
                  flexShrink: 0,
                }}
                aria-label="Deck options"
              >
                ···
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                style={{ color: '#ef4444' }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div
          style={{
            fontSize: 11,
            color: 'var(--jl-text-faint)',
            marginTop: 8,
            marginBottom: 10,
          }}
        >
          {deck.card_count} cards · {deck.new_count} new
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          {hasDue ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: 20,
                padding: '0 7px',
                borderRadius: 10,
                fontSize: 10,
                fontWeight: 600,
                background: colorHex,
                color: '#fff',
                border: `1px solid ${colorHex}`,
              }}
            >
              {deck.due_count} due
            </span>
          ) : (
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--jl-success)',
              }}
            >
              All caught up
            </span>
          )}

          <Button
            onClick={onStudy}
            disabled={!hasDue}
            size="sm"
            style={{
              background: hasDue ? 'var(--jl-accent-strong)' : 'var(--jl-bg-sunken)',
              color: hasDue ? '#fff' : 'var(--jl-text-faint)',
              border: 'none',
              fontSize: 12,
              height: 28,
              padding: '0 12px',
            }}
          >
            Study
          </Button>
        </div>
      </div>
    </div>
  )
}
