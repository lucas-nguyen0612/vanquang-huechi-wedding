'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFlashcardStore } from '@/store/flashcardStore'
import { useSubmitReview } from '@/hooks/useFlashcards'
import { useUserStore } from '@/store/userStore'
import { CardFlip } from './CardFlip'
import { RatingButtons } from './RatingButtons'
import { SessionProgress } from './SessionProgress'
import { SessionSummary } from './SessionSummary'
import type { Rating } from '@/lib/sm2/algorithm'

export function ReviewSession() {
  const router = useRouter()
  const {
    phase,
    queue,
    currentIndex,
    isFlipped,
    results,
    summary,
    flipCard,
    rateCard,
    resetSession,
  } = useFlashcardStore()

  const submitReview = useSubmitReview()
  const addXP = useUserStore(s => s.addXP)

  const currentCard = queue[currentIndex]

  // When session completes, submit batch to server
  useEffect(() => {
    if (phase === 'complete' && results.length > 0) {
      submitReview.mutate(results, {
        onSuccess: (result) => {
          if (result.data && result.data.xpAwarded > 0) {
            addXP(result.data.xpAwarded)
          }
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const handleRate = (rating: Rating) => {
    rateCard(rating)
  }

  const handleRestart = () => {
    resetSession()
    router.refresh()
  }

  const handleBack = () => {
    resetSession()
    router.back()
  }

  if (phase === 'complete' && summary) {
    return <SessionSummary summary={summary} onRestart={handleRestart} onBack={handleBack} />
  }

  if (!currentCard) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--jl-text-faint)', padding: 40 }}>
        No cards to review.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 w-full max-w-2xl mx-auto">
      <SessionProgress current={currentIndex} total={queue.length} />

      {/* Rating tally */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          fontSize: 11,
          color: 'var(--jl-text-soft)',
          justifyContent: 'flex-end',
        }}
      >
        {[
          { label: 'again', color: 'var(--jl-danger)', count: results.filter(r => r.rating === 0).length },
          { label: 'hard', color: 'var(--jl-warn)', count: results.filter(r => r.rating === 1).length },
          { label: 'good', color: 'var(--jl-success)', count: results.filter(r => r.rating === 2).length },
          { label: 'easy', color: 'var(--jl-info)', count: results.filter(r => r.rating === 3).length },
        ].map(item => (
          <span key={item.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: item.color,
                flexShrink: 0,
              }}
            />
            {item.count} {item.label}
          </span>
        ))}
      </div>

      <CardFlip
        front={currentCard.front}
        back={currentCard.back}
        isFlipped={isFlipped}
        onFlip={flipCard}
      />

      <RatingButtons
        onRate={handleRate}
        currentCard={currentCard}
        isFlipped={isFlipped}
      />
    </div>
  )
}
