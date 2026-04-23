'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useHabitsStore } from '@/features/habits/store'
import { habitsKeys, fetchHabitsWithStatus, fetchHeatmapData } from '@/features/habits/queries'
import {
  createHabit,
  updateHabit,
  archiveHabit,
  toggleHabitCompletion,
} from '@/features/habits/actions'
import type { HabitFormValues, HabitWithStatus } from '@/features/habits/types'

export function useHabitsQuery(userId: string) {
  const setTodayHabits = useHabitsStore(s => s.setTodayHabits)

  return useQuery({
    queryKey: habitsKeys.withStatus(userId),
    queryFn: async () => {
      const habits = await fetchHabitsWithStatus(userId)
      setTodayHabits(habits)
      return habits
    },
    staleTime: 30_000,
    enabled: !!userId,
  })
}

export function useHeatmapQuery(userId: string) {
  return useQuery({
    queryKey: habitsKeys.heatmap(userId),
    queryFn: () => fetchHeatmapData(userId),
    staleTime: 5 * 60_000,
    enabled: !!userId,
  })
}

export function useToggleHabit(userId: string) {
  const queryClient = useQueryClient()
  const { optimisticCheckIn, rollbackCheckIn, confirmCheckIn } = useHabitsStore()

  return useMutation({
    mutationFn: ({
      habitId,
      date,
    }: {
      habitId: string
      date: string
    }) => toggleHabitCompletion(habitId, userId, date),

    onMutate: async ({ habitId, date }) => {
      const today = new Date().toLocaleDateString('sv-SE')
      const isToday = date === today
      await queryClient.cancelQueries({ queryKey: habitsKeys.withStatus(userId) })
      const previous = queryClient.getQueryData<HabitWithStatus[]>(habitsKeys.withStatus(userId))
      if (isToday) optimisticCheckIn(habitId)
      return { previous, isToday }
    },

    onError: (_err, { habitId }, context) => {
      if (context?.isToday) rollbackCheckIn(habitId)
      if (context?.previous) {
        queryClient.setQueryData(habitsKeys.withStatus(userId), context.previous)
      }
    },

    onSuccess: (result, { habitId, date }) => {
      const today = new Date().toLocaleDateString('sv-SE')
      if (date === today) confirmCheckIn(habitId, result.checked)
      queryClient.invalidateQueries({ queryKey: habitsKeys.withStatus(userId) })
      queryClient.invalidateQueries({ queryKey: habitsKeys.heatmap(userId) })
    },
  })
}

export function useCreateHabit(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: HabitFormValues) => createHabit(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitsKeys.withStatus(userId) })
    },
  })
}

export function useUpdateHabit(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ habitId, data }: { habitId: string; data: Partial<HabitFormValues> }) =>
      updateHabit(habitId, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitsKeys.withStatus(userId) })
    },
  })
}

export function useArchiveHabit(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (habitId: string) => archiveHabit(habitId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitsKeys.withStatus(userId) })
    },
  })
}
