'use client'
import { usePomodoroStore } from '@/store/pomodoroStore'

const SOUNDSCAPES = [
  { id: 'silent', label: 'Silent', emoji: '🔇' },
  { id: 'rain', label: 'Rain', emoji: '🌧️' },
  { id: 'cafe', label: 'Café', emoji: '☕' },
  { id: 'forest', label: 'Forest', emoji: '🌲' },
  { id: 'space', label: 'Space', emoji: '🌌' },
  { id: 'lofi', label: 'Lo-Fi', emoji: '🎵' },
]

export function SoundscapeSelector() {
  const settings = usePomodoroStore(s => s.settings)
  const updateSettings = usePomodoroStore(s => s.updateSettings)

  return (
    <div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--jl-text-faint)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 12,
        }}
      >
        Soundscape
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 14 }}>
        {SOUNDSCAPES.map(s => {
          const isActive = settings.soundscape === s.id
          return (
            <button
              key={s.id}
              onClick={() => updateSettings({ soundscape: s.id })}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: '10px 6px',
                borderRadius: 'var(--jl-r)',
                background: isActive ? 'var(--jl-accent-soft)' : 'var(--jl-bg-sunken)',
                border: `1px solid ${isActive ? 'var(--jl-accent)' : 'var(--jl-line-soft)'}`,
                cursor: 'pointer',
                transition: 'background 0.15s, border-color 0.15s',
              }}
            >
              <span style={{ fontSize: 18 }}>{s.emoji}</span>
              <span
                style={{
                  fontSize: 11,
                  color: isActive ? 'var(--jl-accent-ink)' : 'var(--jl-text-soft)',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {s.label}
              </span>
            </button>
          )
        })}
      </div>

      {settings.soundscape !== 'silent' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: 'var(--jl-text-faint)', flexShrink: 0 }}>Volume</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.volume}
            onChange={e => updateSettings({ volume: Number(e.target.value) })}
            style={{ flex: 1, accentColor: 'var(--jl-accent)' }}
          />
          <span style={{ fontSize: 11, color: 'var(--jl-text-faint)', width: 28, textAlign: 'right' }}>
            {Math.round(settings.volume * 100)}%
          </span>
        </div>
      )}
    </div>
  )
}
