import Link from 'next/link'

const NAV_LINKS = ['Tools', 'Progression', 'Guild', 'Pricing', 'Changelog'] as const

export function LandingNav() {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '18px 48px',
        borderBottom: '1px solid var(--jl-line-soft)',
        position: 'sticky',
        top: 0,
        background: 'color-mix(in oklch, var(--jl-bg) 85%, transparent)',
        backdropFilter: 'blur(10px)',
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: 'var(--jl-text)',
            color: 'var(--jl-bg)',
            display: 'grid',
            placeItems: 'center',
            fontFamily: 'var(--jl-font-display)',
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          J
        </div>
        <span style={{ fontWeight: 600, fontSize: 15 }}>JL-Tools</span>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          gap: 22,
          justifyContent: 'center',
          fontSize: 13,
          color: 'var(--jl-text-soft)',
        }}
      >
        {NAV_LINKS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          padding: 3,
          background: 'var(--jl-bg-sunken)',
          border: '1px solid var(--jl-line-soft)',
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        <span
          style={{
            padding: '4px 10px',
            borderRadius: 999,
            background: 'var(--jl-bg-raised)',
            color: 'var(--jl-text)',
            boxShadow: 'var(--jl-shadow-sm)',
          }}
        >
          EN
        </span>
        <span style={{ padding: '4px 10px', color: 'var(--jl-text-faint)' }}>VI</span>
      </div>

      <Link
        href="/login"
        style={{
          padding: '8px 16px',
          borderRadius: 'var(--jl-r)',
          border: '1px solid var(--jl-line)',
          background: 'var(--jl-bg-raised)',
          color: 'var(--jl-text)',
          fontSize: 13,
          fontWeight: 500,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          boxShadow: 'var(--jl-shadow-sm)',
        }}
      >
        Sign in
      </Link>

      <Link
        href="/signup"
        style={{
          padding: '8px 16px',
          borderRadius: 'var(--jl-r)',
          background: 'var(--jl-accent-strong)',
          color: 'white',
          fontSize: 13,
          fontWeight: 600,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        Start free
      </Link>
    </nav>
  )
}
