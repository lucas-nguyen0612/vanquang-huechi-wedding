import { Suspense } from 'react'
import { getUser, createClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { ToolErrorBoundary } from '@/components/errors/ToolErrorBoundary'
import { CharacterSheet } from '@/components/character/CharacterSheet'
import { StatChart } from '@/components/character/StatChart'
import { BadgeGrid } from '@/components/character/BadgeGrid'
import { ActivityTimeline } from '@/components/character/ActivityTimeline'
import {
  fetchCharacterStats,
  fetchAllBadges,
  fetchXPTimeline,
} from '@/features/gamification/queries'
import type { CharacterStats, XPTransaction } from '@/types/rpg'
import type { BadgeWithStatus } from '@/features/gamification/queries'

function ColumnSkeleton({ height }: { height?: number }) {
  return (
    <div
      className="rounded-2xl animate-pulse"
      style={{
        background: 'var(--jl-bg-raised)',
        border: '1px solid var(--jl-line)',
        height: height ?? 400,
      }}
    />
  )
}

async function CharacterContent({ userId }: { userId: string }) {
  const supabase = await createClient()

  const [stats, allBadges, timeline, profileRes] = await Promise.all([
    fetchCharacterStats(userId),
    fetchAllBadges(userId),
    fetchXPTimeline(userId, 20),
    supabase
      .from('profiles')
      .select('character_name, character_class')
      .eq('id', userId)
      .single(),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile = profileRes.data as any as { character_name: string; character_class: string } | null
  const characterName = profile?.character_name ?? 'Adventurer'
  const characterClass = profile?.character_class ?? 'Scholar'

  const fallbackStats: CharacterStats = stats ?? {
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
        gridTemplateColumns: '340px 1fr',
        gap: 22,
      }}
    >
      {/* Left column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <CharacterSheet
          stats={fallbackStats}
          characterName={characterName}
          characterClass={characterClass}
        />
        <StatChart
          stats={{
            focus: fallbackStats.focus_stat,
            discipline: fallbackStats.discipline_stat,
            knowledge: fallbackStats.knowledge_stat,
            endurance: fallbackStats.endurance_stat,
          }}
        />
      </div>

      {/* Right column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <BadgeGrid badges={allBadges as BadgeWithStatus[]} />
        <ActivityTimeline transactions={timeline as XPTransaction[]} />
      </div>
    </div>
  )
}

export default async function CharacterPage() {
  const user = await getUser()

  return (
    <ToolErrorBoundary toolName="Character">
      <div className="flex flex-col h-full">
        <TopBar
          title="Character"
          subtitle="Your progress across every tool, collected into one adventurer sheet."
        />
        {!user ? (
          <div
            className="flex-1 flex items-center justify-center"
            style={{ color: 'var(--jl-text-faint)' }}
          >
            <p>Please sign in to view your character.</p>
          </div>
        ) : (
          <Suspense
            fallback={
              <div
                style={{
                  padding: '22px 28px 40px',
                  display: 'grid',
                  gridTemplateColumns: '340px 1fr',
                  gap: 22,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                  <ColumnSkeleton height={480} />
                  <ColumnSkeleton height={260} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                  <ColumnSkeleton height={340} />
                  <ColumnSkeleton height={320} />
                </div>
              </div>
            }
          >
            <CharacterContent userId={user.id} />
          </Suspense>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
