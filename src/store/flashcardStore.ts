import { create } from 'zustand'
import type { FlashCard, ReviewResult, SessionSummary } from '@/features/flashcards/types'
import type { Rating } from '@/lib/sm2/algorithm'
import { XP_PER_RATING } from '@/features/flashcards/constants'

interface FlashcardStore {
  // session state machine
  phase: 'idle' | 'reviewing' | 'complete'
  currentDeckId: string | null
  queue: FlashCard[]
  currentIndex: number
  isFlipped: boolean
  results: ReviewResult[]
  summary: SessionSummary | null

  // actions
  startSession: (deckId: string, cards: FlashCard[]) => void
  flipCard: () => void
  rateCard: (rating: Rating) => void
  finishSession: () => void
  resetSession: () => void
}

export const useFlashcardStore = create<FlashcardStore>((set, get) => ({
  phase: 'idle',
  currentDeckId: null,
  queue: [],
  currentIndex: 0,
  isFlipped: false,
  results: [],
  summary: null,

  startSession: (deckId, cards) => {
    set({
      phase: 'reviewing',
      currentDeckId: deckId,
      queue: cards,
      currentIndex: 0,
      isFlipped: false,
      results: [],
      summary: null,
    })
  },

  flipCard: () => {
    set({ isFlipped: true })
  },

  rateCard: (rating) => {
    const { currentIndex, queue, results } = get()
    const card = queue[currentIndex]
    if (!card) return

    const newResult: ReviewResult = {
      card_id: card.id,
      rating,
      reviewed_at: new Date().toISOString(),
    }

    const nextIndex = currentIndex + 1
    const isLast = nextIndex >= queue.length

    set({
      results: [...results, newResult],
      currentIndex: nextIndex,
      isFlipped: false,
    })

    if (isLast) {
      get().finishSession()
    }
  },

  finishSession: () => {
    const { results } = get()

    const again = results.filter(r => r.rating === 0).length
    const hard = results.filter(r => r.rating === 1).length
    const good = results.filter(r => r.rating === 2).length
    const easy = results.filter(r => r.rating === 3).length
    const total = results.length

    const xpEarned = results.reduce((sum, r) => sum + XP_PER_RATING[r.rating], 0)
    const retentionRate = total > 0 ? Math.round(((hard + good + easy) / total) * 100) : 0

    const summary: SessionSummary = {
      total,
      again,
      hard,
      good,
      easy,
      xpEarned,
      retentionRate,
    }

    set({ phase: 'complete', summary })
  },

  resetSession: () => {
    set({
      phase: 'idle',
      currentDeckId: null,
      queue: [],
      currentIndex: 0,
      isFlipped: false,
      results: [],
      summary: null,
    })
  },
}))
