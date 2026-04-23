import { TopBar } from '@/components/layout/TopBar'

export default function CharacterPage() {
  return (
    <div className="flex flex-col h-full">
      <TopBar title="Character" subtitle="Your RPG profile & achievements" />
      <div className="flex-1 flex items-center justify-center" style={{ color: 'var(--text-secondary)' }}>
        <div className="text-center space-y-2">
          <div style={{ fontSize: 48 }}>⚔️</div>
          <p className="text-lg" style={{ color: 'var(--text-primary)' }}>
            Character Sheet
          </p>
          <p className="text-sm">Coming in Sprint 4</p>
        </div>
      </div>
    </div>
  )
}
