import { TopBar } from '@/components/layout/TopBar'

export default function HabitsPage() {
  return (
    <div className="flex flex-col h-full">
      <TopBar title="Habits" subtitle="Daily check-ins & streaks" />
      <div className="flex-1 flex items-center justify-center" style={{ color: 'var(--text-secondary)' }}>
        <div className="text-center space-y-2">
          <div style={{ fontSize: 48 }}>🔥</div>
          <p className="text-lg" style={{ color: 'var(--text-primary)' }}>
            Habit Tracker
          </p>
          <p className="text-sm">Coming in Sprint 3</p>
        </div>
      </div>
    </div>
  )
}
