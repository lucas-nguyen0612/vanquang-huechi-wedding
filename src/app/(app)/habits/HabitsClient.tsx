'use client'

import { type FC, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { HabitCard } from '@/components/habits/HabitCard'
import { HabitForm } from '@/components/habits/HabitForm'
import { HeatmapView } from '@/components/habits/HeatmapView'
import { InsightPanel } from '@/components/habits/InsightPanel'
import { WeeklyGrid } from '@/components/habits/WeeklyGrid'
import { RemindersPanel } from '@/components/habits/RemindersPanel'
import {
  useHabitsQuery,
  useToggleHabit,
  useCreateHabit,
  useUpdateHabit,
  useArchiveHabit,
  useHeatmapQuery,
} from '@/hooks/useHabits'
import type { HabitWithStatus, HabitFormValues } from '@/features/habits/types'

interface HabitsClientProps {
  userId: string
}

type BottomTab = 'heatmap' | 'insights' | 'reminders' | 'weekly'

interface XpNotification {
  id: number
  amount: number
}

export const HabitsClient: FC<HabitsClientProps> = ({ userId }) => {
  const now = new Date()
  const today = now.toLocaleDateString('sv-SE') // YYYY-MM-DD local
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toLocaleDateString('sv-SE')
  // Allow retroactive check-in for yesterday between 00:00–06:00
  const isRetroWindow = now.getHours() < 6

  const { data: habits, isLoading } = useHabitsQuery(userId)
  const { data: heatmapData, isLoading: heatmapLoading } = useHeatmapQuery(userId)

  const toggleMutation = useToggleHabit(userId)
  const createMutation = useCreateHabit(userId)
  const updateMutation = useUpdateHabit(userId)
  const archiveMutation = useArchiveHabit(userId)

  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [togglingYesterdayId, setTogglingYesterdayId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<HabitWithStatus | undefined>(undefined)
  const [bottomTab, setBottomTab] = useState<BottomTab>('heatmap')
  const [xpNotifications, setXpNotifications] = useState<XpNotification[]>([])
  const [nextNotifId, setNextNotifId] = useState(0)

  const habitList = habits ?? []
  const totalHabits = habitList.length
  const doneToday = habitList.filter(h => h.checked_today).length
  const progressPct = totalHabits > 0 ? Math.round((doneToday / totalHabits) * 100) : 0
  const atLimit = totalHabits >= 10
  const nearLimit = totalHabits >= 8 && !atLimit

  const showXpNotification = useCallback((amount: number) => {
    const id = nextNotifId
    setNextNotifId(n => n + 1)
    setXpNotifications(prev => [...prev, { id, amount }])
    setTimeout(() => {
      setXpNotifications(prev => prev.filter(n => n.id !== id))
    }, 2000)
  }, [nextNotifId])

  const handleToggle = useCallback(
    async (habitId: string, date: string) => {
      const isYesterday = date === yesterdayStr
      if (isYesterday) {
        if (togglingYesterdayId) return
        setTogglingYesterdayId(habitId)
      } else {
        if (togglingId) return
        setTogglingId(habitId)
      }
      try {
        const result = await toggleMutation.mutateAsync({ habitId, date })
        const total = (result.xpAwarded ?? 0) + (result.milestoneXp ?? 0)
        if (total > 0) showXpNotification(total)
      } finally {
        if (isYesterday) setTogglingYesterdayId(null)
        else setTogglingId(null)
      }
    },
    [togglingId, togglingYesterdayId, toggleMutation, showXpNotification, yesterdayStr]
  )

  const handleEdit = useCallback((habit: HabitWithStatus) => {
    setEditingHabit(habit)
    setFormOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (habitId: string) => {
      await archiveMutation.mutateAsync(habitId)
    },
    [archiveMutation]
  )

  const handleFormOpen = () => {
    setEditingHabit(undefined)
    setFormOpen(true)
  }

  const handleFormSubmit = async (data: HabitFormValues) => {
    if (editingHabit) {
      await updateMutation.mutateAsync({ habitId: editingHabit.id, data })
    } else {
      await createMutation.mutateAsync(data)
    }
    setFormOpen(false)
    setEditingHabit(undefined)
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto relative">
      {/* XP Notifications */}
      <div
        style={{
          position: 'fixed',
          top: 80,
          right: 24,
          zIndex: 100,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <AnimatePresence>
          {xpNotifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'var(--jl-accent-strong)',
                color: '#fff',
                borderRadius: 20,
                padding: '4px 12px',
                fontSize: 13,
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              +{n.amount} XP
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Progress summary */}
      <div
        className="rounded-xl p-4 flex flex-col gap-2"
        style={{
          background: 'var(--jl-bg-elevated)',
          border: '1px solid var(--jl-border)',
        }}
      >
        <div className="flex items-center justify-between">
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--jl-text)' }}>
            Today&apos;s Habits
          </span>
          <span style={{ fontSize: 13, color: 'var(--jl-accent-strong)', fontWeight: 600 }}>
            {doneToday} / {totalHabits} done
          </span>
        </div>
        <Progress value={progressPct} className="h-2" />
        {doneToday === totalHabits && totalHabits > 0 && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 12, color: 'var(--jl-accent-strong)', margin: 0 }}
          >
            🎉 All done for today!
          </motion.p>
        )}
      </div>

      {/* Habit list */}
      <div className="flex flex-col gap-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))
        ) : habitList.length === 0 ? (
          <div
            className="rounded-xl p-8 flex flex-col items-center gap-3"
            style={{
              background: 'var(--jl-bg-elevated)',
              border: '1px solid var(--jl-border)',
            }}
          >
            <span style={{ fontSize: 40 }}>🌱</span>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--jl-text)', margin: 0 }}>
              No habits yet
            </p>
            <p style={{ fontSize: 13, color: 'var(--jl-text-faint)', margin: 0, textAlign: 'center' }}>
              Build a streak by adding your first daily habit
            </p>
            <Button
              onClick={handleFormOpen}
              style={{
                background: 'var(--jl-accent-strong)',
                color: '#fff',
                border: 'none',
                marginTop: 4,
              }}
            >
              Add your first habit
            </Button>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {habitList.map(habit => (
              <motion.div
                key={habit.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <HabitCard
                  habit={habit}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isToggling={togglingId === habit.id}
                  date={today}
                  yesterdayDate={yesterdayStr}
                  isRetroWindow={isRetroWindow}
                  isTogglingYesterday={togglingYesterdayId === habit.id}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Near-limit warning */}
      {nearLimit && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{
            background: 'color-mix(in oklch, var(--jl-warn) 15%, transparent)',
            border: '1px solid color-mix(in oklch, var(--jl-warn) 40%, transparent)',
          }}
        >
          <span style={{ fontSize: 16 }}>⚠️</span>
          <p style={{ fontSize: 13, color: 'var(--jl-text)', margin: 0 }}>
            <strong>{totalHabits}/10 habits</strong> — you&apos;re approaching the limit.
          </p>
        </motion.div>
      )}

      {/* Add habit button */}
      {habitList.length > 0 && (
        <div className="flex items-center gap-2">
          <Button
            onClick={handleFormOpen}
            disabled={atLimit}
            style={{
              background: atLimit ? 'var(--jl-bg-sunken)' : 'var(--jl-accent-strong)',
              color: atLimit ? 'var(--jl-text-faint)' : '#fff',
              border: 'none',
              flex: 1,
            }}
          >
            {atLimit ? 'Max 10 habits reached' : '+ Add Habit'}
          </Button>
        </div>
      )}

      {/* Bottom tabs: Heatmap | Insights */}
      {!isLoading && (
        <>
          {/* Tab bar */}
          <div
            className="flex rounded-lg overflow-hidden"
            style={{
              border: '1px solid var(--jl-border)',
              background: 'var(--jl-bg-sunken)',
            }}
          >
            {([
              { id: 'heatmap',   label: '📅 Heatmap' },
              { id: 'weekly',    label: '🗓 Weekly' },
              { id: 'reminders', label: '⏰ Schedule' },
              { id: 'insights',  label: '📊 Insights' },
            ] as { id: BottomTab; label: string }[]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setBottomTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  outline: 'none',
                  background: bottomTab === tab.id ? 'var(--jl-bg-elevated)' : 'transparent',
                  color: bottomTab === tab.id ? 'var(--jl-text)' : 'var(--jl-text-faint)',
                  borderRadius: 6,
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={bottomTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {bottomTab === 'heatmap' && (
                <HeatmapView data={heatmapData ?? []} isLoading={heatmapLoading} />
              )}
              {bottomTab === 'weekly' && (
                <WeeklyGrid habits={habitList} />
              )}
              {bottomTab === 'reminders' && (
                <RemindersPanel habits={habitList} />
              )}
              {bottomTab === 'insights' && (
                <InsightPanel habits={habitList} />
              )}
            </motion.div>
          </AnimatePresence>
        </>
      )}

      {/* Habit form dialog */}
      <HabitForm
        open={formOpen}
        onOpenChange={open => {
          setFormOpen(open)
          if (!open) setEditingHabit(undefined)
        }}
        onSubmit={handleFormSubmit}
        initialValues={editingHabit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}
