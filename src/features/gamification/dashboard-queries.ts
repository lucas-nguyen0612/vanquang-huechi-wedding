import { createClient } from '@/lib/supabase/server'
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns'
import type { CharacterStats } from '@/types/rpg'
import {
  fetchCharacterStats,
  fetchUserQuests,
  type BadgeWithStatus,
  type UserQuestWithQuest,
} from './queries'

export interface WeeklyData {
  pomodoros: number
  habits: number
  focusMinutes: number
  cardsReviewed: number
  /** Daily breakdown for sparklines (last 7 days) */
  dailyPomodoros: number[]
  dailyHabits: number[]
  dailyFocusMinutes: number[]
  dailyCards: number[]
}

export interface DashboardData {
  characterStats: CharacterStats | null
  quests: UserQuestWithQuest[]
  recentBadges: BadgeWithStatus[]
  thisWeek: WeeklyData
  lastWeek: WeeklyData
  pomodoroCountToday: number
  habitsDoneToday: number
  totalHabitsToday: number
  flashcardsDue: number
}

async function fetchWeeklyStats(
  userId: string,
  weekStart: Date,
  weekEnd: Date
): Promise<WeeklyData> {
  const supabase = await createClient()
  const fromDate = format(weekStart, 'yyyy-MM-dd')
  const toDate = format(weekEnd, 'yyyy-MM-dd')
  const fromISO = weekStart.toISOString()
  const toISO = new Date(weekEnd.getTime() + 86400000).toISOString() // end of day

  const [pomRes, habRes, cardRes] = await Promise.all([
    supabase
      .from('pomodoro_sessions')
      .select('duration_minutes, completed_at')
      .eq('user_id', userId)
      .gte('completed_at', fromISO)
      .lt('completed_at', toISO),
    supabase
      .from('habit_completions')
      .select('completed_date')
      .eq('user_id', userId)
      .gte('completed_date', fromDate)
      .lte('completed_date', toDate),
    supabase
      .from('flashcard_reviews')
      .select('reviewed_at')
      .eq('user_id', userId)
      .gte('reviewed_at', fromISO)
      .lt('reviewed_at', toISO),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pomRows = (pomRes.data ?? []) as any as Array<{ completed_at: string; duration_minutes: number | null }>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const habRows = (habRes.data ?? []) as any as Array<{ completed_date: string }>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cardRows = (cardRes.data ?? []) as any as Array<{ reviewed_at: string }>

  // Build daily arrays (7 days)
  const dailyPomodoros = Array(7).fill(0)
  const dailyFocusMinutes = Array(7).fill(0)
  const dailyHabits = Array(7).fill(0)
  const dailyCards = Array(7).fill(0)

  for (const row of pomRows) {
    const d = new Date(row.completed_at)
    const dayIdx = Math.floor(
      (d.getTime() - weekStart.getTime()) / 86400000
    )
    if (dayIdx >= 0 && dayIdx < 7) {
      dailyPomodoros[dayIdx]++
      dailyFocusMinutes[dayIdx] += row.duration_minutes ?? 0
    }
  }

  for (const row of habRows) {
    const d = new Date(row.completed_date)
    const dayIdx = Math.floor(
      (d.getTime() - weekStart.getTime()) / 86400000
    )
    if (dayIdx >= 0 && dayIdx < 7) {
      dailyHabits[dayIdx]++
    }
  }

  for (const row of cardRows) {
    const d = new Date(row.reviewed_at)
    const dayIdx = Math.floor(
      (d.getTime() - weekStart.getTime()) / 86400000
    )
    if (dayIdx >= 0 && dayIdx < 7) {
      dailyCards[dayIdx]++
    }
  }

  return {
    pomodoros: pomRows.length,
    habits: habRows.length,
    focusMinutes: pomRows.reduce((s, r) => s + (r.duration_minutes ?? 0), 0),
    cardsReviewed: cardRows.length,
    dailyPomodoros,
    dailyHabits,
    dailyFocusMinutes,
    dailyCards,
  }
}

export async function fetchDashboardData(userId: string): Promise<DashboardData> {
  const supabase = await createClient()
  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')
  const todayStart = new Date(todayStr + 'T00:00:00Z').toISOString()
  const todayEnd = new Date(todayStr + 'T23:59:59Z').toISOString()

  const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 })
  const thisWeekEnd = endOfWeek(today, { weekStartsOn: 1 })
  const lastWeekStart = subDays(thisWeekStart, 7)
  const lastWeekEnd = subDays(thisWeekEnd, 7)

  const [
    characterStats,
    quests,
    recentBadgesRes,
    thisWeekData,
    lastWeekData,
    pomTodayRes,
    habTodayRes,
    totalHabitsRes,
    flashcardsRes,
  ] = await Promise.all([
    fetchCharacterStats(userId),
    fetchUserQuests(userId),
    supabase
      .from('user_badges')
      .select('badge_id, earned_at, badge:badges(*)')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })
      .limit(3),
    fetchWeeklyStats(userId, thisWeekStart, thisWeekEnd),
    fetchWeeklyStats(userId, lastWeekStart, lastWeekEnd),
    supabase
      .from('pomodoro_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('completed_at', todayStart)
      .lte('completed_at', todayEnd),
    supabase
      .from('habit_completions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed_date', todayStr),
    supabase
      .from('habits')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_archived', false),
    supabase
      .from('flashcard_cards')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .lte('due_at', new Date().toISOString()),
  ])

  type BadgeRow = { badge_id: string; earned_at: string; badge: { id: string; slug: string; name: string; description: string; icon: string; rarity: string; condition_type: string; condition_value: number; created_at: string } }
  const recentBadges: BadgeWithStatus[] = (
    (recentBadgesRes.data ?? []) as BadgeRow[]
  ).map(ub => ({
    ...ub.badge,
    rarity: ub.badge.rarity as BadgeWithStatus['rarity'],
    earned: true,
    earned_at: ub.earned_at,
  }))

  return {
    characterStats,
    quests,
    recentBadges,
    thisWeek: thisWeekData,
    lastWeek: lastWeekData,
    pomodoroCountToday: pomTodayRes.count ?? 0,
    habitsDoneToday: habTodayRes.count ?? 0,
    totalHabitsToday: totalHabitsRes.count ?? 0,
    flashcardsDue: flashcardsRes.count ?? 0,
  }
}
