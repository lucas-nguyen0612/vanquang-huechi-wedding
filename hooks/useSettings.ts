'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import {
  updateProfile,
  uploadAvatar,
  removeAvatar,
} from '@/features/settings/profile'

// ── Query keys ────────────────────────────────────────────────────────────────

export const profileKeys = {
  all: ['profile'] as const,
  detail: (userId: string) => [...profileKeys.all, userId] as const,
}

// ── Profile row type (subset we care about in settings) ───────────────────────

export interface ProfileRow {
  id: string
  character_name: string
  avatar_url: string | null
  character_class: string
}

// ── useProfileQuery ───────────────────────────────────────────────────────────

export function useProfileQuery(userId: string) {
  return useQuery({
    queryKey: profileKeys.detail(userId),
    queryFn: async (): Promise<ProfileRow | null> => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('id, character_name, avatar_url, character_class')
        .eq('user_id', userId)
        .single()

      if (error) throw new Error(error.message)
      return data as ProfileRow | null
    },
    staleTime: 60_000,
    enabled: !!userId,
  })
}

// ── useUpdateProfileMutation ──────────────────────────────────────────────────

export function useUpdateProfileMutation(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { character_name: string }) => updateProfile(input),
    onSuccess: (result) => {
      if (result.error) return
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(userId) })
    },
  })
}

// ── useUploadAvatarMutation ───────────────────────────────────────────────────

export function useUploadAvatarMutation(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => uploadAvatar(formData),
    onSuccess: (result) => {
      if (result.error) return
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(userId) })
    },
  })
}

// ── useRemoveAvatarMutation ───────────────────────────────────────────────────

export function useRemoveAvatarMutation(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => removeAvatar(),
    onSuccess: (result) => {
      if (result.error) return
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(userId) })
    },
  })
}
