import { createClient } from '@/lib/supabase/server'
import { EmailChangeForm } from './EmailChangeForm'
import { PasswordChangeForm } from './PasswordChangeForm'
import { DeleteAccountDialog } from './DeleteAccountDialog'

export async function AccountSection() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // cast required: supabase type inference falls through to never on this schema version
  const { data: profileData } = await (supabase
    .from('profiles')
    .select('character_name')
    .eq('id', user.id)
    .maybeSingle() as unknown as Promise<{
      data: { character_name: string } | null
      error: { message: string } | null
    }>)

  const email = user.email ?? ''
  const characterName = profileData?.character_name ?? ''

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        padding: '22px 28px 40px',
        maxWidth: 720,
      }}
    >
      {/* Email */}
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
            Email address
          </h2>
          <p style={{ fontSize: 13, color: 'var(--jl-text-soft)', margin: '4px 0 0' }}>
            Current: <strong>{email}</strong>. A confirmation email will be sent to the new address.
          </p>
        </header>
        <EmailChangeForm currentEmail={email} />
      </section>

      {/* Password */}
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
            Password
          </h2>
          <p style={{ fontSize: 13, color: 'var(--jl-text-soft)', margin: '4px 0 0' }}>
            Minimum 8 characters. Changing your password signs you out on other devices.
          </p>
        </header>
        <PasswordChangeForm />
      </section>

      {/* Danger zone */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          borderTop: '1px solid var(--jl-border)',
          paddingTop: 24,
        }}
      >
        <header>
          <h2
            style={{
              fontFamily: 'var(--jl-font-display)',
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--jl-danger, #ef4444)',
              margin: 0,
            }}
          >
            Danger zone
          </h2>
          <p style={{ fontSize: 13, color: 'var(--jl-text-soft)', margin: '4px 0 0' }}>
            Permanently delete your account and all associated data. This cannot be undone.
          </p>
        </header>
        <DeleteAccountDialog characterName={characterName} />
      </section>
    </div>
  )
}
