import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LandingNav } from '@/components/marketing/LandingNav'
import { HeroSection } from '@/components/marketing/HeroSection'
import { ToolStrip } from '@/components/marketing/ToolStrip'
import { XPBand } from '@/components/marketing/XPBand'
import { LandingFooter } from '@/components/marketing/LandingFooter'

export default async function RootPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        overflowX: 'hidden',
        background: 'var(--jl-bg)',
      }}
    >
      <LandingNav />
      <HeroSection />
      <ToolStrip />
      <XPBand />
      <LandingFooter />
    </div>
  )
}
