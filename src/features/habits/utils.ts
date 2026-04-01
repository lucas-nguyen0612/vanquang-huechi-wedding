/**
 * Habit utility helpers
 * Pure functions for streak calculation, frequency checks, and progress
 */
import type { HabitDefinition } from './types'

/**
 * Returns today's day-of-week (0=Sunday .. 6=Saturday) using local time.
 */
export function getTodayDayOfWeek(): number {
  return new Date().getDay()
}

/**
 * Checks whether a habit is due today based on its frequency setting.
 * @param habit - habit definition
 * @returns true if the habit should be shown/checked-in today
 */
export function isHabitDueToday(habit: Pick<HabitDefinition, 'frequency' | 'custom_days'>): boolean {
  const { frequency, custom_days } = habit

  if (frequency === 'daily') return true

  if (frequency === 'weekly') {
    // Weekly habits are due once per week (default Monday)
    const todayDow = getTodayDayOfWeek()
    return todayDow === 1 // Monday = 1
  }

  if (frequency === 'custom' && Array.isArray(custom_days)) {
    const todayDow = getTodayDayOfWeek()
    return custom_days.includes(todayDow)
  }

  return false
}

/**
 * Calculates today's progress as a fraction (0–1) of habits done vs due today.
 * @param total - total habits due today
 * @param completed - habits checked in today
 * @returns progress fraction
 */
export function calculateTodayProgress(total: number, completed: number): number {
  if (total <= 0) return 0
  return Math.min(Math.max(completed / total, 0), 1)
}

/**
 * Formats streak count with an optional suffix.
 * @param streak - current streak days
 * @returns display string e.g. "7 days"
 */
export function formatStreak(streak: number): string {
  return `${streak} day${streak !== 1 ? 's' : ''}`
}
