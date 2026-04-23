import { type FC } from 'react'
import { Avatar } from '@/components/rpg/Avatar'
import { LevelBadge } from '@/components/rpg/LevelBadge'
import { RarityChip } from '@/components/rpg/RarityChip'
import { XPBar } from '@/components/rpg/XPBar'
import { StatPill } from '@/components/rpg/StatPill'
import type { CharacterStats } from '@/types/rpg'
import type { Tier } from '@/types/rpg'

function getLevelTier(level: number): Tier {
  if (level >= 40) return 'mythic'
  if (level >= 30) return 'legendary'
  if (level >= 20) return 'rare'
  if (level >= 10) return 'uncommon'
  return 'common'
}

function getXpForLevel(level: number): number {
  return level * level * 100
}

interface HeroCardProps {
  stats: CharacterStats
  characterName?: string
  characterClass?: string
  nextUnlock?: string
  nextUnlockLevel?: number
}

export const HeroCard: FC<HeroCardProps> = ({
  stats,
  characterName = 'Adventurer',
  characterClass = 'Scholar',
  nextUnlock,
  nextUnlockLevel,
}) => {
  const tier = getLevelTier(stats.level)
  const xpForNext = getXpForLevel(stats.level + 1) - getXpForLevel(stats.level)

  return (
    <div
      className="rounded-2xl"
      style={{
        background: 'var(--jl-bg-raised)',
        border: '1px solid var(--jl-line)',
        padding: 24,
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        gap: 20,
        alignItems: 'center',
      }}
    >
      <Avatar level={stats.level} size={88} />

      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <LevelBadge level={stats.level} size={28} />
          <span
            style={{
              fontFamily: 'var(--jl-font-display)',
              fontSize: 20,
              color: 'var(--jl-text)',
              fontWeight: 500,
            }}
          >
            {characterName} · {characterClass}
          </span>
          <RarityChip rarity={tier} />
        </div>

        <div style={{ marginTop: 14 }}>
          <XPBar
            currentXP={stats.xp_in_current_level}
            maxXP={xpForNext}
            level={stats.level}
          />
        </div>

        <div
          style={{
            display: 'flex',
            gap: 10,
            marginTop: 12,
            flexWrap: 'wrap',
          }}
        >
          <StatPill icon="🔥" label="Streak" value={`${stats.current_streak}d`} />
          <StatPill
            icon="⏱"
            label="Focus"
            value={`${Math.round(stats.total_focus_minutes / 60)}h total`}
          />
          <StatPill icon="✅" label="Habits" value={stats.total_habits_completed.toLocaleString()} />
          <StatPill icon="🃏" label="Cards" value={stats.total_cards_reviewed.toLocaleString()} />
        </div>
      </div>

      {nextUnlock && (
        <div
          style={{
            alignSelf: 'start',
            padding: 14,
            borderRadius: 12,
            background: 'var(--jl-accent-soft)',
            color: 'var(--jl-accent-ink)',
            minWidth: 150,
            textAlign: 'center',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Next unlock
          </div>
          <div
            style={{
              fontFamily: 'var(--jl-font-display)',
              fontSize: 15,
              margin: '6px 0',
              fontWeight: 500,
            }}
          >
            {nextUnlock}
          </div>
          {nextUnlockLevel && (
            <div style={{ fontSize: 11 }}>at Level {nextUnlockLevel}</div>
          )}
        </div>
      )}
    </div>
  )
}
