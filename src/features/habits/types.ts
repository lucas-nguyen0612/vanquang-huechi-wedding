/**
 * Habit Tracker types
 * Source: supabase/migrations/00003_create_habit_definitions.sql
 * Source: supabase/migrations/00004_create_habit_entries.sql
 */

// ============================================================
// Enums
// ============================================================

export type HabitFrequency = 'daily' | 'weekly' | 'custom'

// ============================================================
// Tables
// ============================================================

export type HabitDefinition = {
  id: string
  user_id: string
  name: string
  /** Icon key string (e.g., 'star', 'check', 'fire') — rendered as emoji in UI */
  icon: string
  color: string
  frequency: HabitFrequency
  /** Days of week: 0=Sunday..6=Saturday. null for daily/weekly */
  custom_days: number[] | null
  is_archived: boolean
  /** Application-maintained: current consecutive days completed */
  current_streak: number
  /** Application-maintained: all-time longest streak */
  longest_streak: number
  position: number
  created_at: string
  updated_at: string
}

export type HabitEntry = {
  id: string
  user_id: string
  habit_definition_id: string
  /** Date only (YYYY-MM-DD) — cannot be a future date (DB CHECK) */
  checked_at: string
  created_at: string
}

// ============================================================
// Derived / UI types
// ============================================================

// Habit with today's check-in status
export type HabitWithStatus = HabitDefinition & {
  checked_today: boolean
  checked_entry?: HabitEntry
}

// Streak fire color tiers (DB: custom_days uses 0=Sunday convention)
export type StreakTier = 'cold' | 'warm' | 'hot' | 'blazing'

export const STREAK_TIERS: Record<StreakTier, { min: number; label: string }> = {
  cold:   { min: 0,  label: 'cold' },
  warm:   { min: 3,  label: 'warm' },
  hot:    { min: 7,  label: 'hot' },
  blazing:{ min: 30, label: 'blazing' },
}

export function getStreakTier(days: number): StreakTier {
  // FIX (finding #12): Guard against negative days
  if (days < 0) {
    // Negative streak = data inconsistency; treat as 0 (cold) but signal
    console.warn('[getStreakTier] negative days received:', days)
    return 'cold'
  }
  if (days >= 30) return 'blazing'
  if (days >= 7)  return 'hot'
  if (days >= 3)  return 'warm'
  return 'cold'
}

// ============================================================
// Validation helpers
// ============================================================

/** Days of week must be 0-6 (Sunday=0 through Saturday=6) */
export function isValidCustomDays(days: number[] | null): boolean {
  if (days === null) return true
  return days.every(d => Number.isInteger(d) && d >= 0 && d <= 6)
}

// ============================================================
// Form types
// ============================================================

export type HabitFormValues = {
  name: string
  icon: string
  color: string
  frequency: HabitFrequency
  custom_days: number[] | null
}

export type HabitEntryInsert = Omit<HabitEntry, 'id' | 'created_at' | 'checked_at'> & {
  id?: string
  checked_at?: string
  created_at?: string
}
