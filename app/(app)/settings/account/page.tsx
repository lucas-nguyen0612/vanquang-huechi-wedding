import { TopBar } from '@/components/layout/TopBar'
import { MobileBackLink } from '@/components/settings/MobileBackLink'
import { AccountSection } from '@/components/settings/AccountSection'

export default function SettingsAccountPage() {
  return (
    <div className="flex flex-col h-full">
      <MobileBackLink />
      <TopBar title="Account" />
      <AccountSection />
    </div>
  )
}
