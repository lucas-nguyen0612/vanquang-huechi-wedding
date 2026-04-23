'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { format, subDays } from 'date-fns'
import { XP_VALUES } from '@/lib/xp/constants'
import type { Habit, HabitCompletion, HabitFormValues, ToggleResult } from './types'

export async function createHabit(
  userId: string,
  data: HabitFormValues
): Promise<{ id: string } | { error: string }> {
  const supabase = await createClient()

  // Check habit limit (max 10)
  const { count } = await (supabase
    .from('habits')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_archived', false) as unknown as Promise<{ count: number | null }>)

  if ((count ?? 0) >= 10) {
    return { error: 'Maximum 10 habits allowed' }
  }

  // Get next sort_order
  const { data: maxSort } = await (supabase
    .from('habits')
    .select('sort_order')
    .eq('user_id', userId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single() as unknown as Promise<{ data: Pick<Habit, 'sort_order'> | null }>)

  const sortOrder = (maxSort?.sort_order ?? -1) + 1

  const { data: habit, error } = await (supabase
    .from('habits')
    .insert({
      user_id: userId,
      name: data.name.trim(),
      category: data.category,
      time_of_day: data.time_of_day,
      color: data.color,
      target_days: data.target_days ?? [],
      reminder_time: data.reminder_time ?? null,
      sort_order: sortOrder,
    } as never)
    .select('id')
    .single() as unknown as Promise<{ data: Pick<Habit, 'id'> | null; error: { message: string } | null }>)

  if (error) return { error: error.message }
  revalidatePath('/habits')
  return { id: habit!.id }
}

export async function updateHabit(
  habitId: string,
  userId: string,
  data: Partial<HabitFormValues>
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const updatePayload: Partial<Habit> = {}
  if (data.name) updatePayload.name = data.name.trim()
  if (data.category) updatePayload.category = data.category
  if (data.time_of_day) updatePayload.time_of_day = data.time_of_day
  if (data.color) updatePayload.color = data.color
  if (data.target_days !== undefined) updatePayload.target_days = data.target_days
  if (data.reminder_time !== undefined) updatePayload.reminder_time = data.reminder_time

  const { error } = await (supabase
    .from('habits')
    .update(updatePayload as never)
    .eq('id', habitId)
    .eq('user_id', userId) as unknown as Promise<{ error: { message: string } | null }>)

  if (error) return { error: error.message }
  revalidatePath('/habits')
  return {}
}

export async function archiveHabit(
  habitId: string,
  userId: string
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const { error } = await (supabase
    .from('habits')
    .update({ is_archived: true } as never)
    .eq('id', habitId)
    .eq('user_id', userId) as unknown as Promise<{ error: { message: string } | null }>)

  if (error) return { error: error.message }
  revalidatePath('/habits')
  return {}
}

export async function toggleHabitCompletion(
  habitId: string,
  userId: string,
  date: string  // YYYY-MM-DD in user's local timezone
): Promise<ToggleResult> {
  const supabase = await createClient()

  // Check if already completed today
  const { data: existing } = await (supabase
    .from('habit_completions')
    .select('id')
    .eq('habit_id', habitId)
    .eq('user_id', userId)
    .eq('completed_date', date)
    .single() as unknown as Promise<{ data: Pick<HabitCompletion, 'id'> | null }>)

  if (existing) {
    // Uncheck: delete completion
    const { error } = await (supabase
      .from('habit_completions')
      .delete()
      .eq('id', existing.id) as unknown as Promise<{ error: { message: string } | null }>)

    if (error) return { checked: true, xpAwarded: 0, allDoneBonus: false, error: error.message }
    revalidatePath('/habits')
    return { checked: false, xpAwarded: 0, allDoneBonus: false }
  }

  // Check: insert completion
  const { error: insertError } = await (supabase
    .from('habit_completions')
    .insert({ habit_id: habitId, user_id: userId, completed_date: date } as never) as unknown as Promise<{ error: { message: string } | null }>)

  if (insertError) return { checked: false, xpAwarded: 0, allDoneBonus: false, error: insertError.message }

  // Award XP for check-in
  await (supabase.from('xp_transactions').insert({
    user_id: userId,
    amount: XP_VALUES.HABIT_CHECKIN,
    source: 'habit',
    source_id: habitId,
    description: 'Habit check-in',
  } as never) as unknown as Promise<unknown>)

  // Update character_stats.total_habits_completed (best-effort)
  try {
    const { data: stats } = await (supabase
      .from('character_stats')
      .select('total_habits_completed')
      .eq('user_id', userId)
      .single() as unknown as Promise<{ data: { total_habits_completed: number } | null }>)

    if (stats) {
      await (supabase
        .from('character_stats')
        .update({ total_habits_completed: stats.total_habits_completed + 1 } as never)
        .eq('user_id', userId) as unknown as Promise<unknown>)
    }
  } catch {
    // best-effort: ignore errors
  }

  // Update streak on the habit
  const { data: habit } = await (supabase
    .from('habits')
    .select('current_streak, longest_streak, last_completed_date')
    .eq('id', habitId)
    .single() as unknown as Promise<{ data: Pick<Habit, 'current_streak' | 'longest_streak' | 'last_completed_date'> | null }>)

  const STREAK_MILESTONE_XP: Record<number, number> = { 7: 50, 14: 100, 30: 200 }
  let milestoneXp = 0

  if (habit) {
    const prevDate = format(subDays(new Date(date), 1), 'yyyy-MM-dd')
    const wasConsecutive = habit.last_completed_date === prevDate
    const newStreak = wasConsecutive ? habit.current_streak + 1 : 1
    const newLongest = Math.max(habit.longest_streak, newStreak)

    await (supabase
      .from('habits')
      .update({
        current_streak: newStreak,
        longest_streak: newLongest,
        last_completed_date: date,
      } as never)
      .eq('id', habitId) as unknown as Promise<unknown>)

    milestoneXp = STREAK_MILESTONE_XP[newStreak] ?? 0
    if (milestoneXp > 0) {
      await (supabase.from('xp_transactions').insert({
        user_id: userId,
        amount: milestoneXp,
        source: 'streak_milestone',
        source_id: habitId,
        description: `${newStreak}-day streak milestone!`,
      } as never) as unknown as Promise<unknown>)
    }
  }

  // Check if all habits done today → bonus XP
  const { data: allHabits } = await (supabase
    .from('habits')
    .select('id')
    .eq('user_id', userId)
    .eq('is_archived', false) as unknown as Promise<{ data: Pick<Habit, 'id'>[] | null }>)

  const { data: todayCompletions } = await (supabase
    .from('habit_completions')
    .select('habit_id')
    .eq('user_id', userId)
    .eq('completed_date', date) as unknown as Promise<{ data: Pick<HabitCompletion, 'habit_id'>[] | null }>)

  const allDone =
    allHabits &&
    todayCompletions &&
    allHabits.length > 0 &&
    allHabits.every(h => todayCompletions.some(c => c.habit_id === h.id))

  if (allDone) {
    await (supabase.from('xp_transactions').insert({
      user_id: userId,
      amount: XP_VALUES.HABIT_ALL_DONE_BONUS,
      source: 'habit_all_done',
      source_id: null,
      description: 'All habits done today!',
    } as never) as unknown as Promise<unknown>)
  }

  revalidatePath('/habits')
  return {
    checked: true,
    xpAwarded: XP_VALUES.HABIT_CHECKIN + (allDone ? XP_VALUES.HABIT_ALL_DONE_BONUS : 0),
    allDoneBonus: !!allDone,
    milestoneXp: milestoneXp || undefined,
  }
}

export async function reorderHabits(
  userId: string,
  habitIds: string[]
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const updates = habitIds.map((id, index) =>
    supabase
      .from('habits')
      .update({ sort_order: index } as never)
      .eq('id', id)
      .eq('user_id', userId) as unknown as Promise<unknown>
  )

  await Promise.all(updates)
  revalidatePath('/habits')
  return {}
}
