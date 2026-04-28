import { TopBar } from '@/components/layout/TopBar'
import { MobileBackLink } from '@/components/settings/MobileBackLink'

export default function SettingsProfilePage() {
  return (
    <div className="flex flex-col h-full">
      <MobileBackLink />
      <TopBar title="Profile" />
      <div style={{ padding: '22px 28px', color: 'var(--jl-text-soft)', fontSize: 14 }}>
        <p>Coming soon.</p>
      </div>
    </div>
  )
}
