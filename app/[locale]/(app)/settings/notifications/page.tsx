import { TopBar } from '@/components/layout/TopBar'
import { MobileBackLink } from '@/components/settings/MobileBackLink'
import { NotificationsSection } from '@/components/settings/NotificationsSection'

export default function SettingsNotificationsPage() {
  return (
    <div className="flex flex-col h-full">
      <MobileBackLink />
      <TopBar title="Notifications" />
      <NotificationsSection />
    </div>
  )
}
