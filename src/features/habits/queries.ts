/**
 * Habits TanStack Query keys and fetch function stubs
 * Real implementations will be added in Epic 4
 */

/**
 * Query key factory for habits
 */
export const habitsKeys = {
  all: ['habits'] as const,
  /** All habit definitions for the current user */
  definitions: () => [...habitsKeys.all, 'definitions'] as const,
  /** A specific habit definition by ID */
  definition: (id: string) => [...habitsKeys.all, 'definition', id] as const,
  /** Check-in entries for a habit */
  entries: (habitId: string) => [...habitsKeys.all, 'entries', habitId] as const,
  /** Today's habit entries */
  todayEntries: () => [...habitsKeys.all, 'today-entries'] as const,
} as const
