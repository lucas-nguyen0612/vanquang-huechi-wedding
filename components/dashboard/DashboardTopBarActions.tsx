'use client'

import Link from 'next/link'
import { Play } from 'lucide-react'
import { SearchDropdown } from '@/components/dashboard/SearchDropdown'
import { NotificationPanel } from '@/components/dashboard/NotificationPanel'
import type { Notification } from '@/features/gamification/notifications'

/**
 * Right-slot action group for the dashboard TopBar.
 *
 * Phase A renders the "Start focus" accent button.
 * Phase B adds the inline ⌘K Search dropdown.
 * Phase C adds the Notification Bell beside Search.
 */
export function DashboardTopBarActions({
  userId,
  notifications,
}: {
  userId: string
  notifications: Notification[]
}) {
  return (
    <div className="flex items-center gap-2.5">
      <SearchDropdown userId={userId} />
      <NotificationPanel notifications={notifications} />
      <Link href="/pomodoro" className="jl-btn jl-btn-accent">
        <Play size={14} /> Start focus
      </Link>
    </div>
  )
}
