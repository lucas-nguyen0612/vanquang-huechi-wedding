/**
 * Gamification TanStack Query keys and fetch function stubs
 * Real implementations will be added in Epic 6
 */

/**
 * Query key factory for gamification / XP
 */
export const gamificationKeys = {
  all: ['gamification'] as const,
  /** User's current XP and level (from profiles table) */
  xp: (userId: string) => [...gamificationKeys.all, 'xp', userId] as const,
  /** XP transaction history */
  transactions: (userId: string) => [...gamificationKeys.all, 'transactions', userId] as const,
  /** All gamification levels */
  levels: () => [...gamificationKeys.all, 'levels'] as const,
} as const
