'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Timer, CheckSquare, BookOpen, LayoutDashboard, User } from 'lucide-react'
import { Avatar } from '@/components/rpg/Avatar'
import { XPBar } from '@/components/rpg/XPBar'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/pomodoro', icon: Timer, label: 'Pomodoro' },
  { href: '/habits', icon: CheckSquare, label: 'Habits' },
  { href: '/flashcards', icon: BookOpen, label: 'Flashcards' },
  { href: '/character', icon: User, label: 'Character' },
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
    <nav
      className="flex flex-col h-full"
      style={{
        width: 220,
        background: 'var(--jl-bg-raised)',
        borderRight: '1px solid var(--jl-line)',
        padding: '20px 12px',
        gap: 4,
      }}
    >
      {/* Logo */}
      <div className="mb-4 px-3">
        <span
          style={{
            fontFamily: 'var(--jl-font-display)',
            fontSize: 20,
            fontWeight: 600,
            color: 'var(--jl-accent-strong)',
          }}
        >
          JL-Tools
        </span>
      </div>

      {/* Avatar + XP */}
      <div
        className="mb-4 p-3 rounded-jl"
        style={{ background: 'var(--jl-bg-sunken)' }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Avatar level={level} size={40} />
          <div className="flex-1 min-w-0">
            <div
              className="font-medium text-sm truncate"
              style={{ color: 'var(--jl-text)' }}
            >
              {characterName}
            </div>
            <div className="text-xs" style={{ color: 'var(--jl-text-faint)' }}>
              Level {level}
            </div>
          </div>
        </div>
        <XPBar currentXP={currentXP} maxXP={maxXP} level={level} compact />
      </div>

      {/* Nav links */}
      <div className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 'var(--jl-r)',
                color: isActive ? 'var(--jl-accent-strong)' : 'var(--jl-text-soft)',
                background: isActive ? 'var(--jl-accent-soft)' : 'transparent',
                fontWeight: isActive ? 500 : 400,
                fontSize: 14,
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
