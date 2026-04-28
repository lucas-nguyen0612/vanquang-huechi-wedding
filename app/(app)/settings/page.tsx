import { TopBar } from '@/components/layout/TopBar'
import { SettingsSectionList } from '@/components/settings/SettingsSectionList'

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full">
      <TopBar title="Settings" subtitle="Manage your profile, account, and preferences." />
      <SettingsSectionList />
    </div>
  )
}
