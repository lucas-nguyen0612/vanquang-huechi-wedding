'use client'

import { type FC, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  HABIT_CATEGORIES,
  TIME_OF_DAY_OPTIONS,
  type HabitFormValues,
  type HabitWithStatus,
} from '@/features/habits/types'

const HABIT_COLOR_PALETTE = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280',
]

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const DAY_VALUES = [1, 2, 3, 4, 5, 6, 0]

const habitSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Max 100 characters'),
  category: z.enum(['health', 'fitness', 'learning', 'productivity', 'mindfulness', 'other']),
  time_of_day: z.enum(['morning', 'afternoon', 'evening', 'anytime']),
  color: z.string(),
  target_days: z.array(z.number()).default([]),
  reminder_time: z.string().nullable().default(null),
})

interface HabitFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: HabitFormValues) => Promise<void>
  initialValues?: Partial<HabitWithStatus>
  isLoading: boolean
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid var(--jl-line)',
  background: 'var(--jl-bg-sunken)',
  color: 'var(--jl-text)',
  fontSize: 14,
  fontFamily: 'inherit',
  outline: 'none',
}

export const HabitForm: FC<HabitFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  isLoading,
}) => {
  const isEditing = !!initialValues?.id

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: '',
      category: 'health',
      time_of_day: 'anytime',
      color: '#3b82f6',
      target_days: [],
      reminder_time: null,
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: initialValues?.name ?? '',
        category: (initialValues?.category as HabitFormValues['category']) ?? 'health',
        time_of_day: (initialValues?.time_of_day as HabitFormValues['time_of_day']) ?? 'anytime',
        color: initialValues?.color ?? '#3b82f6',
        target_days: initialValues?.target_days ?? [],
        reminder_time: initialValues?.reminder_time ?? null,
      })
    }
  }, [open, initialValues, reset])

  const selectedColor = watch('color')
  const targetDays = watch('target_days')

  const toggleDay = (dayVal: number) => {
    const current = targetDays ?? []
    if (current.includes(dayVal)) {
      setValue('target_days', current.filter(d => d !== dayVal))
    } else {
      setValue('target_days', [...current, dayVal])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Habit' : 'New Habit'}</DialogTitle>
        </DialogHeader>

        <form id="habit-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 py-2">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="habit-name">Name</Label>
            <input
              id="habit-name"
              type="text"
              placeholder="e.g. Morning run"
              {...register('name')}
              style={{
                ...inputStyle,
                borderColor: errors.name ? '#ef4444' : 'var(--jl-line)',
              }}
            />
            {errors.name && (
              <span style={{ color: '#ef4444', fontSize: 12 }}>{errors.name.message}</span>
            )}
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="habit-category">Category</Label>
            <select id="habit-category" {...register('category')} style={inputStyle}>
              {HABIT_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Time of day */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="habit-time">Time of Day</Label>
            <select id="habit-time" {...register('time_of_day')} style={inputStyle}>
              {TIME_OF_DAY_OPTIONS.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Color picker */}
          <div className="flex flex-col gap-1.5">
            <Label>Color</Label>
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {HABIT_COLOR_PALETTE.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => field.onChange(c)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: c,
                        border: selectedColor === c ? '3px solid var(--jl-text)' : '2px solid transparent',
                        cursor: 'pointer',
                        outline: 'none',
                        flexShrink: 0,
                      }}
                      aria-label={`Color ${c}`}
                    />
                  ))}
                </div>
              )}
            />
          </div>

          {/* Target days */}
          <div className="flex flex-col gap-1.5">
            <Label>
              Target Days{' '}
              <span style={{ color: 'var(--jl-text-soft)', fontWeight: 400, fontSize: 12 }}>
                (empty = daily)
              </span>
            </Label>
            <div className="flex gap-1.5">
              {DAY_LABELS.map((label, i) => {
                const dayVal = DAY_VALUES[i]
                const active = (targetDays ?? []).includes(dayVal)
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleDay(dayVal)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'background 0.15s, color 0.15s',
                      background: active ? selectedColor : 'var(--jl-bg-sunken)',
                      color: active ? '#fff' : 'var(--jl-text-soft)',
                      border: active ? 'none' : '1px solid var(--jl-line)',
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Reminder time */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="habit-reminder">
              Reminder{' '}
              <span style={{ color: 'var(--jl-text-soft)', fontWeight: 400, fontSize: 12 }}>(optional)</span>
            </Label>
            <input
              id="habit-reminder"
              type="time"
              {...register('reminder_time')}
              style={{ ...inputStyle, colorScheme: 'light dark' }}
            />
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="habit-form"
            disabled={isLoading}
            style={{ background: 'var(--jl-accent-strong)', color: '#fff', border: 'none' }}
          >
            {isLoading ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Habit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
