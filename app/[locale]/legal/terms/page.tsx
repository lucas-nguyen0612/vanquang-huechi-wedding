import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — JL Tools',
}

export default function TermsPage() {
  return (
    <article style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Terms of Service</h1>
      <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0, opacity: 0.7 }}>
        Coming soon.
      </p>
      <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0, opacity: 0.6 }}>
        Our full Terms of Service are being drafted. In the meantime, if you have any
        questions please contact us at{' '}
        <a
          href="mailto:dat.t.nguyen.works@gmail.com"
          style={{ color: 'var(--jl-accent, #6366f1)' }}
        >
          dat.t.nguyen.works@gmail.com
        </a>
        .
      </p>
    </article>
  )
}
