import { TopBar } from '@/components/layout/TopBar'
import { MobileBackLink } from '@/components/settings/MobileBackLink'
import { ProfileSection } from '@/components/settings/ProfileSection'

export const metadata = {
  title: 'Profile — JL-Tools',
}

export default function ProfileSettingsPage() {
  return (
    <div className="flex flex-col h-full">
      <MobileBackLink />
      <TopBar
        title="Profile"
        subtitle="Manage your display name and avatar."
      />
      <div
        className="flex-1 overflow-y-auto"
        style={{ padding: '24px 28px 40px' }}
      >
        <ProfileSection />
      </div>
    </div>
  )
}
