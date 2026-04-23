import { createClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Dashboard" subtitle="Your RPG productivity hub" />
      <div
        className="flex-1 flex items-center justify-center"
        style={{ color: 'var(--text-secondary)' }}
      >
        <div className="text-center space-y-2">
          <div style={{ fontSize: 48 }}>⚔️</div>
          <p className="text-lg" style={{ color: 'var(--text-primary)' }}>
            Welcome back, {user?.email?.split('@')[0]}
          </p>
          <p className="text-sm">Dashboard coming in Sprint 4</p>
        </div>
      </div>
    </div>
  )
}
