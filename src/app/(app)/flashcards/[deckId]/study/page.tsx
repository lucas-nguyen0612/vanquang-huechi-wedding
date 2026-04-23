'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { TopBar } from '@/components/layout/TopBar'
import { ReviewSession } from '@/components/flashcard/ReviewSession'
import { useFlashcardStore } from '@/store/flashcardStore'
import { useDueCards, useDecks } from '@/hooks/useFlashcards'
import { Skeleton } from '@/components/ui/skeleton'

export default function StudyPage() {
  const params = useParams()
  const router = useRouter()
  const deckId = params.deckId as string

  const { data: dueCards, isLoading } = useDueCards(deckId)
  const { data: decks } = useDecks()
  const { startSession, phase, currentDeckId } = useFlashcardStore()

  const deck = decks?.find(d => d.id === deckId)

  // Load cards into store when due cards arrive
  useEffect(() => {
    if (!dueCards || dueCards.length === 0) return
    // Only start if not already reviewing this deck
    if (phase === 'idle' || currentDeckId !== deckId) {
      startSession(deckId, dueCards)
    }
  }, [dueCards, deckId, phase, currentDeckId, startSession])

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <TopBar title="Study" subtitle="Loading cards..." />
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-4 max-w-2xl mx-auto">
            <Skeleton className="h-8 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  const hasDue = dueCards && dueCards.length > 0

  if (!hasDue && phase === 'idle') {
    return (
      <div className="flex flex-col h-full">
        <TopBar
          title={deck?.name ?? 'Study'}
          subtitle="All caught up"
        />
        <div className="flex-1 flex items-center justify-center p-4">
          <div
            className="rounded-xl p-8 flex flex-col items-center gap-4 max-w-sm w-full"
            style={{
              background: 'var(--jl-bg-elevated)',
              border: '1px solid var(--jl-border)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 48 }}>🎉</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--jl-text)', margin: 0 }}>
              All caught up!
            </p>
            <p style={{ fontSize: 13, color: 'var(--jl-text-faint)', margin: 0 }}>
              Next review: tomorrow ({deck?.due_count ?? 0} cards due)
            </p>
            <button
              onClick={() => router.back()}
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                background: 'var(--jl-accent-strong)',
                color: '#fff',
                border: 'none',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: 4,
              }}
            >
              Back to Decks
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <TopBar
        title={deck?.name ?? 'Study'}
        subtitle={`${dueCards?.length ?? 0} cards due`}
      />
      <div className="flex-1 overflow-y-auto p-4">
        <ReviewSession />
      </div>
    </div>
  )
}
