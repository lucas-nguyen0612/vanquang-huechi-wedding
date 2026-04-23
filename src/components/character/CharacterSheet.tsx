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

function getTierLabel(level: number): string {
  if (level >= 40) return 'Master'
  if (level >= 30) return 'Expert'
  if (level >= 20) return 'Adept'
  if (level >= 10) return 'Apprentice'
  return 'Novice'
}

/** XP needed for the next level using a simple quadratic curve */
function getXpForLevel(level: number): number {
  return level * level * 100
}

interface CharacterSheetProps {
  stats: CharacterStats
  characterName?: string
  characterClass?: string
  title?: string
}

export const CharacterSheet: FC<CharacterSheetProps> = ({
  stats,
  characterName = 'Adventurer',
  characterClass = 'Scholar',
  title,
}) => {
  const tier = getLevelTier(stats.level)
  const tierLabel = getTierLabel(stats.level)
  const xpForNext = getXpForLevel(stats.level + 1) - getXpForLevel(stats.level)

  return (
    <div
      className="rounded-2xl"
      style={{
        background: 'var(--jl-bg-raised)',
        border: '1px solid var(--jl-line)',
        padding: 28,
        textAlign: 'center',
      }}
    >
      {/* Avatar */}
      <div style={{ display: 'grid', placeItems: 'center', marginBottom: 14 }}>
        <Avatar level={stats.level} size={120} />
      </div>

      {/* Class label */}
      <div
        style={{
          fontSize: 11,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--jl-accent-ink)',
          fontWeight: 600,
        }}
      >
        {characterClass}
      </div>

      {/* Name */}
      <div
        style={{
          fontFamily: 'var(--jl-font-display)',
          fontSize: 24,
          marginTop: 6,
          letterSpacing: '-0.02em',
          color: 'var(--jl-text)',
          fontWeight: 500,
        }}
      >
        {characterName}
      </div>

      {/* Level + tier badges */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
          marginTop: 10,
        }}
      >
        <LevelBadge level={stats.level} size={30} />
        <RarityChip rarity={tier} />
        <span
          style={{
            fontSize: 11,
            color: 'var(--jl-text-soft)',
            fontWeight: 600,
          }}
        >
          {tierLabel}
        </span>
      </div>

      {/* XP bar */}
      <div style={{ marginTop: 18 }}>
        <XPBar
          currentXP={stats.xp_in_current_level}
          maxXP={xpForNext}
          level={stats.level}
        />
        <div
          style={{
            fontSize: 11,
            color: 'var(--jl-text-faint)',
            marginTop: 4,
          }}
        >
          {stats.xp_in_current_level.toLocaleString()} / {xpForNext.toLocaleString()} XP to Lv{' '}
          {stats.level + 1}
        </div>
      </div>

      {/* Stat pills */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'center',
          marginTop: 16,
          flexWrap: 'wrap',
        }}
      >
        <StatPill icon="🔥" label="Streak" value={`${stats.current_streak}d`} />
        <StatPill icon="⏱" label="Focus" value={`${Math.round(stats.total_focus_minutes / 60)}h`} />
      </div>

      {/* Title */}
      {title && (
        <div
          style={{
            marginTop: 22,
            padding: 14,
            borderRadius: 12,
            background: 'var(--jl-bg-sunken)',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: 'var(--jl-text-faint)',
              marginBottom: 6,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600,
            }}
          >
            Title
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--jl-text)' }}>
            &ldquo;{title}&rdquo;
          </div>
        </div>
      )}
    </div>
  )
}
