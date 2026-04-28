'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Timer, Flame, BookOpen, User, Settings } from 'lucide-react'

export const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/pomodoro', icon: Timer, label: 'Pomodoro' },
  { href: '/habits', icon: Flame, label: 'Habits' },
  { href: '/flashcards', icon: BookOpen, label: 'Flashcards' },
  { href: '/character', icon: User, label: 'Character' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 grid"
      style={{
        gridTemplateColumns: 'repeat(6, 1fr)',
        borderTop: '1px solid var(--jl-line-soft)',
        background: 'var(--jl-bg-raised)',
        padding: '8px 8px 18px',
        zIndex: 50,
      }}
    >
      {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
        const isActive = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1"
            style={{
              padding: 6,
              borderRadius: 10,
              color: isActive ? 'var(--jl-accent-strong)' : 'var(--jl-text-faint)',
              textDecoration: 'none',
            }}
          >
            <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 600 : 500,
              }}
            >
              {label}
            </span>
            {isActive && (
              <span
                className="rounded-full"
                style={{
                  width: 4,
                  height: 4,
                  background: 'var(--jl-accent-strong)',
                  marginTop: -2,
                }}
              />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
