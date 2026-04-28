import { createClient } from '@/lib/supabase/server'
import { DEFAULT_HUE, DEFAULT_THEME, type Theme } from '@/lib/settings/theme-cookie'
import type { Database } from '@/types/database'
import { ThemeRadio } from './ThemeRadio'
import { HueSlider } from './HueSlider'

type UserPreferences = Database['public']['Tables']['user_preferences']['Row']

export async function AppearanceSection() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let theme: Theme = DEFAULT_THEME
  let hue: number = DEFAULT_HUE

  if (user) {
    const { data } = await supabase
      .from('user_preferences')
      .select('appearance_settings')
      .eq('user_id', user.id)
      .maybeSingle()
    const row = data as Pick<UserPreferences, 'appearance_settings'> | null
    if (row?.appearance_settings) {
      theme = row.appearance_settings.theme ?? DEFAULT_THEME
      hue = row.appearance_settings.accent_hue ?? DEFAULT_HUE
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        padding: '22px 28px 40px',
        maxWidth: 720,
      }}
    >
      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <header>
          <h2
            style={{
              fontFamily: 'var(--jl-font-display)',
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--jl-text)',
              margin: 0,
            }}
          >
            Theme
          </h2>
          <p style={{ fontSize: 13, color: 'var(--jl-text-soft)', margin: '4px 0 0' }}>
            Choose how the app looks.
          </p>
        </header>
        <ThemeRadio initialTheme={theme} initialHue={hue} />
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <header>
          <h2
            style={{
              fontFamily: 'var(--jl-font-display)',
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--jl-text)',
              margin: 0,
            }}
          >
            Accent
          </h2>
          <p style={{ fontSize: 13, color: 'var(--jl-text-soft)', margin: '4px 0 0' }}>
            Drag to tune the warm-to-cool accent hue.
          </p>
        </header>
        <HueSlider initialHue={hue} initialTheme={theme} />
      </section>
    </div>
  )
}
