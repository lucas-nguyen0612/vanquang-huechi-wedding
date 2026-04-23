'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { calculateNextReview } from '@/lib/sm2/algorithm'
import { XP_VALUES } from '@/lib/xp/constants'
import { SESSION_BONUS_THRESHOLD } from './constants'
import type { Deck, FlashCard, ReviewResult } from './types'

type ActionResult<T> =
  | { data: T; error: null }
  | { data: null; error: { message: string; code: string } }

// ──────────────────────────────────────────────────────────────────────────────
// Deck Actions
// ──────────────────────────────────────────────────────────────────────────────

export async function fetchDecks(): Promise<ActionResult<Deck[]>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Unauthorized', code: 'AUTH_REQUIRED' } }

  const { data, error } = await (supabase
    .from('flashcard_decks')
    .select('id, user_id, name, description, color, card_count, due_count, new_count, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true }) as unknown as Promise<{
      data: Deck[] | null
      error: { message: string } | null
    }>)

  if (error) return { data: null, error: { message: error.message, code: 'FETCH_ERROR' } }
  return { data: data ?? [], error: null }
}

export async function createDeck(input: {
  name: string
  description?: string
  color: string
}): Promise<ActionResult<Deck>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Unauthorized', code: 'AUTH_REQUIRED' } }

  const { data, error } = await (supabase
    .from('flashcard_decks')
    .insert({
      user_id: user.id,
      name: input.name.trim(),
      description: input.description?.trim() ?? null,
      color: input.color,
      card_count: 0,
      due_count: 0,
      new_count: 0,
      is_public: false,
    } as never)
    .select('id, user_id, name, description, color, card_count, due_count, new_count, created_at')
    .single() as unknown as Promise<{
      data: Deck | null
      error: { message: string } | null
    }>)

  if (error) return { data: null, error: { message: error.message, code: 'CREATE_ERROR' } }
  revalidatePath('/flashcards')
  return { data: data!, error: null }
}

export async function updateDeck(
  id: string,
  input: Partial<Pick<Deck, 'name' | 'description' | 'color'>>
): Promise<ActionResult<Deck>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Unauthorized', code: 'AUTH_REQUIRED' } }

  const payload: Record<string, unknown> = {}
  if (input.name !== undefined) payload.name = input.name.trim()
  if (input.description !== undefined) payload.description = input.description?.trim() ?? null
  if (input.color !== undefined) payload.color = input.color

  const { data, error } = await (supabase
    .from('flashcard_decks')
    .update(payload as never)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id, user_id, name, description, color, card_count, due_count, new_count, created_at')
    .single() as unknown as Promise<{
      data: Deck | null
      error: { message: string } | null
    }>)

  if (error) return { data: null, error: { message: error.message, code: 'UPDATE_ERROR' } }
  revalidatePath('/flashcards')
  return { data: data!, error: null }
}

export async function deleteDeck(id: string): Promise<ActionResult<null>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Unauthorized', code: 'AUTH_REQUIRED' } }

  const { error } = await (supabase
    .from('flashcard_decks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) as unknown as Promise<{
      error: { message: string } | null
    }>)

  if (error) return { data: null, error: { message: error.message, code: 'DELETE_ERROR' } }
  revalidatePath('/flashcards')
  return { data: null, error: null }
}

// ──────────────────────────────────────────────────────────────────────────────
// Card Actions
// ──────────────────────────────────────────────────────────────────────────────

function mapCardRow(row: {
  id: string
  deck_id: string
  front: string
  back: string
  tags: string[]
  ease_factor: number
  interval: number
  repetitions: number
  due_at: string
  state: string
}): FlashCard {
  return {
    id: row.id,
    deck_id: row.deck_id,
    front: row.front,
    back: row.back,
    tags: row.tags ?? [],
    ease_factor: row.ease_factor,
    interval: row.interval,
    repetitions: row.repetitions,
    due_date: row.due_at,
    state: (row.state as FlashCard['state']) || 'new',
  }
}

export async function fetchDeckCards(deckId: string): Promise<ActionResult<FlashCard[]>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Unauthorized', code: 'AUTH_REQUIRED' } }

  const { data, error } = await (supabase
    .from('flashcard_cards')
    .select('id, deck_id, front, back, tags, ease_factor, interval, repetitions, due_at, state')
    .eq('deck_id', deckId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: true }) as unknown as Promise<{
      data: Array<{
        id: string; deck_id: string; front: string; back: string
        tags: string[]; ease_factor: number; interval: number
        repetitions: number; due_at: string; state: string
      }> | null
      error: { message: string } | null
    }>)

  if (error) return { data: null, error: { message: error.message, code: 'FETCH_ERROR' } }
  return { data: (data ?? []).map(mapCardRow), error: null }
}

export async function createCard(input: {
  deck_id: string
  front: string
  back: string
  tags?: string[]
}): Promise<ActionResult<FlashCard>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Unauthorized', code: 'AUTH_REQUIRED' } }

  const now = new Date().toISOString()

  const { data, error } = await (supabase
    .from('flashcard_cards')
    .insert({
      deck_id: input.deck_id,
      user_id: user.id,
      front: input.front.trim(),
      back: input.back.trim(),
      tags: input.tags ?? [],
      ease_factor: 2.5,
      interval: 0,
      repetitions: 0,
      due_at: now,
      state: 'new',
    } as never)
    .select('id, deck_id, front, back, tags, ease_factor, interval, repetitions, due_at, state')
    .single() as unknown as Promise<{
      data: {
        id: string; deck_id: string; front: string; back: string
        tags: string[]; ease_factor: number; interval: number
        repetitions: number; due_at: string; state: string
      } | null
      error: { message: string } | null
    }>)

  if (error) return { data: null, error: { message: error.message, code: 'CREATE_ERROR' } }
  revalidatePath(`/flashcards/${input.deck_id}`)
  return { data: mapCardRow(data!), error: null }
}

export async function updateCard(
  id: string,
  input: Partial<Pick<FlashCard, 'front' | 'back' | 'tags'>>
): Promise<ActionResult<FlashCard>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Unauthorized', code: 'AUTH_REQUIRED' } }

  const payload: Record<string, unknown> = {}
  if (input.front !== undefined) payload.front = input.front.trim()
  if (input.back !== undefined) payload.back = input.back.trim()
  if (input.tags !== undefined) payload.tags = input.tags

  const { data, error } = await (supabase
    .from('flashcard_cards')
    .update(payload as never)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id, deck_id, front, back, tags, ease_factor, interval, repetitions, due_at, state')
    .single() as unknown as Promise<{
      data: {
        id: string; deck_id: string; front: string; back: string
        tags: string[]; ease_factor: number; interval: number
        repetitions: number; due_at: string; state: string
      } | null
      error: { message: string } | null
    }>)

  if (error) return { data: null, error: { message: error.message, code: 'UPDATE_ERROR' } }
  return { data: mapCardRow(data!), error: null }
}

export async function deleteCard(id: string): Promise<ActionResult<null>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Unauthorized', code: 'AUTH_REQUIRED' } }

  const { error } = await (supabase
    .from('flashcard_cards')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) as unknown as Promise<{
      error: { message: string } | null
    }>)

  if (error) return { data: null, error: { message: error.message, code: 'DELETE_ERROR' } }
  return { data: null, error: null }
}

export async function fetchDueCards(deckId: string): Promise<ActionResult<FlashCard[]>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Unauthorized', code: 'AUTH_REQUIRED' } }

  const now = new Date().toISOString()

  const { data, error } = await (supabase
    .from('flashcard_cards')
    .select('id, deck_id, front, back, tags, ease_factor, interval, repetitions, due_at, state')
    .eq('deck_id', deckId)
    .eq('user_id', user.id)
    .lte('due_at', now)
    .order('due_at', { ascending: true }) as unknown as Promise<{
      data: Array<{
        id: string; deck_id: string; front: string; back: string
        tags: string[]; ease_factor: number; interval: number
        repetitions: number; due_at: string; state: string
      }> | null
      error: { message: string } | null
    }>)

  if (error) return { data: null, error: { message: error.message, code: 'FETCH_ERROR' } }
  return { data: (data ?? []).map(mapCardRow), error: null }
}

// ──────────────────────────────────────────────────────────────────────────────
// Review batch
// ──────────────────────────────────────────────────────────────────────────────

export async function submitReviewBatch(
  results: ReviewResult[]
): Promise<ActionResult<{ xpAwarded: number; cardsReviewed: number }>> {
  if (results.length === 0) {
    return { data: { xpAwarded: 0, cardsReviewed: 0 }, error: null }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'Unauthorized', code: 'AUTH_REQUIRED' } }

  let totalXp = 0

  // Process each review
  for (const result of results) {
    // Fetch current card state
    const { data: cardRow } = await (supabase
      .from('flashcard_cards')
      .select('deck_id, ease_factor, interval, repetitions, state')
      .eq('id', result.card_id)
      .eq('user_id', user.id)
      .single() as unknown as Promise<{
        data: {
          deck_id: string
          ease_factor: number
          interval: number
          repetitions: number
          state: string
        } | null
      }>)

    if (!cardRow) continue

    const sm2Result = calculateNextReview(
      {
        ease_factor: cardRow.ease_factor,
        interval: cardRow.interval,
        repetitions: cardRow.repetitions,
      },
      result.rating
    )

    // Determine new state
    let newState: string
    if (result.rating === 0) {
      newState = 'learning'
    } else if (sm2Result.repetitions <= 1) {
      newState = 'learning'
    } else if (sm2Result.interval < 21) {
      newState = 'young'
    } else {
      newState = 'mature'
    }

    const xpForCard = XP_VALUES[(['FLASHCARD_AGAIN', 'FLASHCARD_HARD', 'FLASHCARD_GOOD', 'FLASHCARD_EASY'] as const)[result.rating]]
    totalXp += xpForCard

    // Update card SM-2 fields
    await (supabase
      .from('flashcard_cards')
      .update({
        ease_factor: sm2Result.ease_factor,
        interval: sm2Result.interval,
        repetitions: sm2Result.repetitions,
        due_at: sm2Result.due_date.toISOString(),
        state: newState,
      } as never)
      .eq('id', result.card_id)
      .eq('user_id', user.id) as unknown as Promise<unknown>)

    // Insert xp_transaction for this card
    if (xpForCard > 0) {
      await (supabase
        .from('xp_transactions')
        .insert({
          user_id: user.id,
          amount: xpForCard,
          source: 'flashcard',
          source_id: result.card_id,
          description: `Flashcard review (${(['Again', 'Hard', 'Good', 'Easy'] as const)[result.rating]})`,
        } as never) as unknown as Promise<unknown>)
    }

    // Insert review record
    await (supabase
      .from('flashcard_reviews')
      .insert({
        card_id: result.card_id,
        user_id: user.id,
        deck_id: cardRow.deck_id,
        rating: result.rating,
        ease_factor_before: cardRow.ease_factor,
        interval_before: cardRow.interval,
        ease_factor_after: sm2Result.ease_factor,
        interval_after: sm2Result.interval,
        xp_awarded: xpForCard,
        reviewed_at: result.reviewed_at,
      } as never) as unknown as Promise<unknown>)
  }

  // Session bonus if ≥ 50 cards
  if (results.length >= SESSION_BONUS_THRESHOLD) {
    totalXp += XP_VALUES.FLASHCARD_SESSION_BONUS
    await (supabase
      .from('xp_transactions')
      .insert({
        user_id: user.id,
        amount: XP_VALUES.FLASHCARD_SESSION_BONUS,
        source: 'flashcard_session_bonus',
        source_id: null,
        description: `Session bonus: reviewed ${results.length} cards`,
      } as never) as unknown as Promise<unknown>)
  }

  // Update character_stats.total_cards_reviewed
  try {
    const { data: stats } = await (supabase
      .from('character_stats')
      .select('total_cards_reviewed')
      .eq('user_id', user.id)
      .single() as unknown as Promise<{
        data: { total_cards_reviewed: number } | null
      }>)

    if (stats) {
      await (supabase
        .from('character_stats')
        .update({ total_cards_reviewed: stats.total_cards_reviewed + results.length } as never)
        .eq('user_id', user.id) as unknown as Promise<unknown>)
    }
  } catch {
    // best-effort
  }

  revalidatePath('/flashcards')
  return { data: { xpAwarded: totalXp, cardsReviewed: results.length }, error: null }
}
