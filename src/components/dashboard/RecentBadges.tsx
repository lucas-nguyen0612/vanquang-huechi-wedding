import { type FC } from 'react'
import type { BadgeWithStatus } from '@/features/gamification/queries'
import type { Tier } from '@/types/rpg'

const RARITY_COLOR: Record<Tier, string> = {
  common: '#9ca3af',
  uncommon: '#22c55e',
  rare: '#3b82f6',
  legendary: '#f59e0b',
  mythic: '#a855f7',
}

const BADGE_ICONS: Record<string, string> = {
  timer: '⏱',
  flame: '🔥',
  brain: '🧠',
  star: '⭐',
  trophy: '🏆',
  target: '🎯',
  book: '📚',
  cards: '🃏',
  sparkle: '✨',
  check: '✅',
  shield: '🛡',
  sword: '⚔',
}

function getIcon(iconSlug: string): string {
  return BADGE_ICONS[iconSlug.toLowerCase()] ?? '🏅'
}

interface RecentBadgesProps {
  badges: BadgeWithStatus[]
}

export const RecentBadges: FC<RecentBadgesProps> = ({ badges }) => {
  if (badges.length === 0) {
    return (
      <div
        className="rounded-2xl"
        style={{
          background: 'var(--jl-bg-raised)',
          border: '1px solid var(--jl-line)',
          padding: 20,
        }}
      >
        <h3
          style={{
            margin: '0 0 12px',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--jl-text)',
          }}
        >
          Recent Badges
        </h3>
        <div
          style={{
            textAlign: 'center',
            padding: '16px 0',
            color: 'var(--jl-text-faint)',
            fontSize: 12,
          }}
        >
          Earn your first badge by completing a Pomodoro session!
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl"
      style={{
        background: 'var(--jl-bg-raised)',
        border: '1px solid var(--jl-line)',
        padding: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <h3
          style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--jl-text)' }}
        >
          Recent Badges
        </h3>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: 11,
            color: 'var(--jl-text-faint)',
          }}
        >
          {badges.filter(b => b.earned).length} earned
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
        }}
      >
        {badges.slice(0, 3).map(badge => {
          const rarity = badge.rarity as Tier
          const color = RARITY_COLOR[rarity] ?? RARITY_COLOR.common

          return (
            <div
              key={badge.id}
              title={`${badge.name} — ${badge.description}`}
              style={{
                aspectRatio: '1',
                borderRadius: 12,
                display: 'grid',
                placeItems: 'center',
                flexDirection: 'column' as const,
                background: `color-mix(in oklch, ${color} 15%, var(--jl-bg-raised))`,
                color,
                border: `1px solid color-mix(in oklch, ${color} 35%, transparent)`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <span style={{ fontSize: 22, lineHeight: 1 }}>{getIcon(badge.icon)}</span>
              <span
                style={{
                  position: 'absolute',
                  bottom: 4,
                  fontSize: 8,
                  color: 'var(--jl-text-faint)',
                  fontWeight: 500,
                  width: '100%',
                  textAlign: 'center',
                  padding: '0 4px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {badge.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
