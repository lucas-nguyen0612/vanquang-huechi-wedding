import { getUser } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { ToolErrorBoundary } from '@/components/errors/ToolErrorBoundary'
import { HeroCard } from '@/components/dashboard/HeroCard'
import { QuestList } from '@/components/dashboard/QuestList'
import { ToolGrid } from '@/components/dashboard/ToolGrid'
import { WeeklyStats } from '@/components/dashboard/WeeklyStats'
import { RecentBadges } from '@/components/dashboard/RecentBadges'
import { StreakCard } from '@/components/dashboard/StreakCard'
import { fetchDashboardData } from '@/features/gamification/dashboard-queries'
import { DashboardTopBarActions } from '@/components/dashboard/DashboardTopBarActions'
import type { CharacterStats } from '@/types/rpg'

export const revalidate = 60

function getTimeOfDayGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 17) return 'Good afternoon'
  if (hour >= 17 && hour < 22) return 'Good evening'
  return 'Working late'
}

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    return (
      <ToolErrorBoundary toolName="Dashboard">
        <div className="flex flex-col h-full">
          <TopBar
            title="Dashboard"
            subtitle="Your RPG productivity hub"
          />
          <div
            className="flex-1 flex items-center justify-center"
            style={{ color: 'var(--jl-text-faint)' }}
          >
            <p>Please sign in to view your dashboard.</p>
          </div>
        </div>
      </ToolErrorBoundary>
    )
  }

  const data = await fetchDashboardData(user.id)

  const fallbackStats: CharacterStats = data.characterStats ?? {
    id: '',
    user_id: user.id,
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
    last_badges_seen_at: null,
    last_level_seen: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const dowMondayBased = (new Date().getDay() + 6) % 7
  const todayFocusMinutes = data.thisWeek.dailyFocusMinutes[dowMondayBased] ?? 0

  // Build dynamic TopBar greeting + status line
  const greeting = getTimeOfDayGreeting(new Date().getHours())
  const trimmedName = data.characterName?.trim() ?? ''
  const greetingTitle = trimmedName ? `${greeting}, ${trimmedName}.` : `${greeting}.`

  const xpToNext = Math.max(
    0,
    data.xpForNextLevel - fallbackStats.xp_in_current_level
  )
  const nextLevel = fallbackStats.level + 1
  const questsRemaining = data.quests.filter(q => !q.is_completed).length
  const questsPart =
    questsRemaining === 0
      ? 'All quests done today!'
      : `${questsRemaining} ${questsRemaining === 1 ? 'quest' : 'quests'} remaining today.`
  const greetingSubtitle = `You're ${xpToNext} XP away from Level ${nextLevel}. ${questsPart}`

  return (
    <ToolErrorBoundary toolName="Dashboard">
      <div className="flex flex-col h-full">
        <TopBar
          title={greetingTitle}
          subtitle={greetingSubtitle}
          rightSlot={
            <DashboardTopBarActions
              userId={user.id}
              notifications={data.notifications}
            />
          }
        />
        <div
          className="flex-1 overflow-y-auto"
          style={{
            padding: '22px 28px 40px',
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: 22,
            alignContent: 'start',
          }}
        >
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, minWidth: 0 }}>
            <HeroCard
              stats={fallbackStats}
              xpForNextLevel={data.xpForNextLevel}
              characterName={data.characterName}
              characterClass={data.characterClass}
              nextUnlock={data.nextUnlock}
              todayFocusMinutes={todayFocusMinutes}
              habitsToday={data.habitsDoneToday}
              totalHabitsToday={data.totalHabitsToday}
              cardsReviewedToday={data.cardsReviewedToday}
              flashcardsDue={data.flashcardsDue}
            />
            <ToolGrid
              pomodoroCount={data.pomodoroCountToday}
              habitsDoneToday={data.habitsDoneToday}
              totalHabits={data.totalHabitsToday}
              flashcardsDue={data.flashcardsDue}
            />
            <QuestList quests={data.quests} />
            <WeeklyStats
              thisWeek={data.thisWeek}
              lastWeek={data.lastWeek}
              weeklyXP={data.weeklyXP}
            />
          </div>

          {/* Right rail */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <StreakCard
              currentStreak={fallbackStats.current_streak}
              longestStreak={fallbackStats.longest_streak}
              activity={data.dailyActivity}
            />
            <RecentBadges earned={data.recentBadges} locked={data.unearnedBadges} />
          </aside>
        </div>
      </div>
    </ToolErrorBoundary>
  )
}
