'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Target, Timer, Flame, Layers, Swords, Users, Shield } from 'lucide-react'
import { Avatar } from '@/components/rpg/Avatar'
import { XPBar } from '@/components/rpg/XPBar'

type NavItem = {
  href: string
  icon: typeof Target
  label: string
  disabled?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', icon: Target, label: 'Dashboard' },
  { href: '/pomodoro', icon: Timer, label: 'Pomodoro' },
  { href: '/habits', icon: Flame, label: 'Habits' },
  { href: '/flashcards', icon: Layers, label: 'Flashcards' },
  { href: '/quests', icon: Swords, label: 'Quests', disabled: true },
  { href: '/guild', icon: Users, label: 'Guild', disabled: true },
  { href: '/character', icon: Shield, label: 'Character' },
]

interface SideNavProps {
  level: number
  currentXP: number
  maxXP: number
  characterName: string
}

export function SideNav({ level, currentXP, maxXP, characterName }: SideNavProps) {
  const pathname = usePathname()

  return (
    <aside
      className="flex flex-col h-full"
      style={{
        width: 232,
        flexShrink: 0,
        background: 'var(--jl-bg-raised)',
        borderRight: '1px solid var(--jl-line-soft)',
        padding: '18px 12px',
        gap: 4,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '4px 8px 14px',
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: 'var(--jl-text)',
            color: 'var(--jl-bg)',
            display: 'grid',
            placeItems: 'center',
            fontFamily: 'var(--jl-font-display)',
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          J
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em' }}>
            JL-Tools
          </span>
          <span
            style={{
              fontSize: 10.5,
              color: 'var(--jl-text-faint)',
              marginTop: 2,
            }}
          >
            focus · level up
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(({ href, icon: Icon, label, disabled }) => {
          const isActive = !disabled && pathname.startsWith(href)
          const itemStyle: React.CSSProperties = {
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 10px',
            borderRadius: 10,
            background: isActive ? 'var(--jl-accent-soft)' : 'transparent',
            color: isActive
              ? 'var(--jl-accent-ink)'
              : disabled
                ? 'var(--jl-text-faint)'
                : 'var(--jl-text-soft)',
            fontSize: 13,
            fontWeight: isActive ? 600 : 500,
            border: isActive
              ? '1px solid color-mix(in oklch, var(--jl-accent) 35%, transparent)'
              : '1px solid transparent',
            textDecoration: 'none',
            opacity: disabled ? 0.55 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s, color 0.15s',
          }
          const inner = (
            <>
              <Icon size={18} />
              <span style={{ flex: 1 }}>{label}</span>
              {isActive && (
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: 'var(--jl-accent-strong)',
                  }}
                />
              )}
            </>
          )
          return disabled ? (
            <div key={href} style={itemStyle} aria-disabled="true">
              {inner}
            </div>
          ) : (
            <Link key={href} href={href} style={itemStyle}>
              {inner}
            </Link>
          )
        })}
      </div>

      <div style={{ flex: 1 }} />

      <div
        style={{
          padding: 12,
          borderRadius: 12,
          background: 'var(--jl-bg-sunken)',
          border: '1px solid var(--jl-line-soft)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <Avatar level={level} size={40} />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                lineHeight: 1.1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {characterName}
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--jl-text-faint)', marginTop: 2 }}>
              Lv {level} · Scholar
            </div>
          </div>
        </div>
        <XPBar currentXP={currentXP} maxXP={maxXP} level={level} compact showLevel={false} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 6,
            fontSize: 10,
            color: 'var(--jl-text-faint)',
          }}
        >
          <span className="jl-mono">XP</span>
          <span className="jl-mono jl-tnum">
            {currentXP}/{maxXP}
          </span>
        </div>
      </div>
    </aside>
  )
}
