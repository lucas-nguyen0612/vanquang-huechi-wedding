import { TopBar } from '@/components/layout/TopBar'
import { MobileBackLink } from '@/components/settings/MobileBackLink'
import { AboutSection } from '@/components/settings/AboutSection'

export default function SettingsAboutPage() {
  return (
    <div className="flex flex-col h-full">
      <MobileBackLink />
      <TopBar title="About" />
      <AboutSection />
    </div>
  )
}
