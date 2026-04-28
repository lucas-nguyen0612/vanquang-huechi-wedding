import Link from 'next/link'

export function AboutSection() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION ?? '0.0.0'
  const buildDate = process.env.NEXT_PUBLIC_BUILD_DATE ?? 'unknown'
  const feedbackSubject = encodeURIComponent(`JL Tools Feedback - v${version}`)
  const feedbackHref = `mailto:dat.t.nguyen.works@gmail.com?subject=${feedbackSubject}`

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
      {/* App identity */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h2
          style={{
            fontFamily: 'var(--jl-font-display)',
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--jl-text)',
            margin: 0,
          }}
        >
          JL Tools
        </h2>
        <p style={{ fontSize: 13, color: 'var(--jl-text-soft)', margin: 0 }}>
          Your personal productivity and learning companion.
        </p>
      </section>

      {/* Version + build date */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <p style={{ fontSize: 14, color: 'var(--jl-text)', margin: 0 }}>
          <span style={{ color: 'var(--jl-text-soft)', marginRight: 8 }}>Version</span>
          {`v${version}`}
        </p>
        <p style={{ fontSize: 14, color: 'var(--jl-text)', margin: 0 }}>
          <span style={{ color: 'var(--jl-text-soft)', marginRight: 8 }}>Built</span>
          {buildDate}
        </p>
      </section>

      {/* Feedback */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h3
          style={{
            fontFamily: 'var(--jl-font-display)',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--jl-text)',
            margin: 0,
          }}
        >
          Feedback
        </h3>
        <a
          href={feedbackHref}
          style={{
            fontSize: 14,
            color: 'var(--jl-accent)',
            textDecoration: 'none',
          }}
        >
          Send feedback
        </a>
      </section>

      {/* Legal */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h3
          style={{
            fontFamily: 'var(--jl-font-display)',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--jl-text)',
            margin: 0,
          }}
        >
          Legal
        </h3>
        <Link
          href="/legal/terms"
          style={{ fontSize: 14, color: 'var(--jl-accent)', textDecoration: 'none' }}
        >
          Terms of Service
        </Link>
        <Link
          href="/legal/privacy"
          style={{ fontSize: 14, color: 'var(--jl-accent)', textDecoration: 'none' }}
        >
          Privacy Policy
        </Link>
      </section>
    </div>
  )
}
