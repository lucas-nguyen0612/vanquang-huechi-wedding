import { TopBar } from '@/components/layout/TopBar'
import { MobileBackLink } from '@/components/settings/MobileBackLink'
import { AppearanceSection } from '@/components/settings/AppearanceSection'

export default function SettingsAppearancePage() {
  return (
    <div className="flex flex-col h-full">
      <MobileBackLink />
      <TopBar title="Appearance" />
      <AppearanceSection />
    </div>
  )
}
