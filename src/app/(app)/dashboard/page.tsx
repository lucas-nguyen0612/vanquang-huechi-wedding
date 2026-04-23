import { Suspense } from 'react'
import { getUser } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { ToolErrorBoundary } from '@/components/errors/ToolErrorBoundary'
import { HeroCard } from '@/components/dashboard/HeroCard'
import { QuestList } from '@/components/dashboard/QuestList'
import { ToolGrid } from '@/components/dashboard/ToolGrid'
import { WeeklyStats } from '@/components/dashboard/WeeklyStats'
import { RecentBadges } from '@/components/dashboard/RecentBadges'
import { fetchDashboardData } from '@/features/gamification/dashboard-queries'
import type { CharacterStats } from '@/types/rpg'

export const revalidate = 60

function SkeletonBlock({ height }: { height?: number }) {
  return (
    <div
      className="rounded-2xl animate-pulse"
      style={{
        background: 'var(--jl-bg-raised)',
        border: '1px solid var(--jl-line)',
        height: height ?? 120,
      }}
    />
  )
}

async function DashboardContent({ userId }: { userId: string }) {
  const data = await fetchDashboardData(userId)

  const fallbackStats: CharacterStats = data.characterStats ?? {
    id: '',
    user_id: userId,
    level: 1,
    total_xp: 0,
    xp_in_current_level: 0,
    focus_stat: 0,
    discipline_stat: 0,
    knowledge_stat: 0,
    endurance_stat: 0,
    total_pomodoros: 0,
    total_focus_minutes: 0,
    total_habits_completed: 0,
    total_cards_reviewed: 0,
    current_streak: 0,
    longest_streak: 0,
    last_activity_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return (
    <div
      style={{
        padding: '22px 28px 40px',
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: 22,
      }}
    >
      {/* Left column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, minWidth: 0 }}>
        <HeroCard stats={fallbackStats} />
        <ToolGrid
          pomodoroCount={data.pomodoroCountToday}
          habitsDoneToday={data.habitsDoneToday}
          totalHabits={data.totalHabitsToday}
          flashcardsDue={data.flashcardsDue}
        />
        <QuestList quests={data.quests} />
        <WeeklyStats thisWeek={data.thisWeek} lastWeek={data.lastWeek} />
      </div>

      {/* Right rail */}
      <aside style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <RecentBadges badges={data.recentBadges} />
      </aside>
    </div>
  )
}

export default async function DashboardPage() {
  const user = await getUser()

  return (
    <ToolErrorBoundary toolName="Dashboard">
      <div className="flex flex-col h-full">
        <TopBar
          title="Dashboard"
          subtitle="Your RPG productivity hub"
        />
        {!user ? (
          <div
            className="flex-1 flex items-center justify-center"
            style={{ color: 'var(--jl-text-faint)' }}
          >
            <p>Please sign in to view your dashboard.</p>
          </div>
        ) : (
          <Suspense
            fallback={
              <div
                style={{
                  padding: '22px 28px 40px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 340px',
                  gap: 22,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                  <SkeletonBlock height={160} />
                  <SkeletonBlock height={200} />
                  <SkeletonBlock height={280} />
                  <SkeletonBlock height={220} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                  <SkeletonBlock height={180} />
                </div>
              </div>
            }
          >
            <DashboardContent userId={user.id} />
          </Suspense>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
