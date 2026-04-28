export function LandingFooter() {
  return (
    <footer
      style={{
        padding: '28px 48px 40px',
        borderTop: '1px solid var(--jl-line-soft)',
        display: 'flex',
        gap: 24,
        fontSize: 12,
        color: 'var(--jl-text-faint)',
        alignItems: 'center',
      }}
    >
      <span>© 2026 JL-Tools</span>
      <span>Privacy</span>
      <span>Terms</span>
      <span>Changelog</span>
      <span style={{ marginLeft: 'auto', fontFamily: 'var(--jl-font-mono)' }}>v0.4.2 · mvp</span>
    </footer>
  )
}
