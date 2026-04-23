'use client'
import { useState, KeyboardEvent } from 'react'
import { Plus, X, ShieldCheck } from 'lucide-react'
import { usePomodoroStore } from '@/store/pomodoroStore'

export function FocusBlocker() {
  const settings = usePomodoroStore(s => s.settings)
  const updateSettings = usePomodoroStore(s => s.updateSettings)
  const [input, setInput] = useState('')

  function addSite() {
    const site = input.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '')
    if (!site || settings.blockedSites.includes(site)) return
    updateSettings({ blockedSites: [...settings.blockedSites, site] })
    setInput('')
  }

  function removeSite(site: string) {
    updateSettings({ blockedSites: settings.blockedSites.filter(s => s !== site) })
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') addSite()
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck size={14} color="var(--jl-text-faint)" />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--jl-text-faint)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Focus Blocker
          </span>
        </div>

        {/* Toggle */}
        <button
          role="switch"
          aria-checked={settings.focusBlockerEnabled}
          onClick={() => updateSettings({ focusBlockerEnabled: !settings.focusBlockerEnabled })}
          style={{
            width: 36,
            height: 20,
            borderRadius: 999,
            background: settings.focusBlockerEnabled ? 'var(--jl-accent)' : 'var(--jl-bg-sunken)',
            border: `1px solid ${settings.focusBlockerEnabled ? 'var(--jl-accent)' : 'var(--jl-line)'}`,
            cursor: 'pointer',
            position: 'relative',
            transition: 'background 0.2s',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 2,
              left: settings.focusBlockerEnabled ? 18 : 2,
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: 'white',
              transition: 'left 0.2s',
            }}
          />
        </button>
      </div>

      <p style={{ fontSize: 12, color: 'var(--jl-text-faint)', marginBottom: 10 }}>
        During focus sessions, these sites will be blocked.
      </p>

      {/* Blocked sites list */}
      {settings.blockedSites.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {settings.blockedSites.map(site => (
            <div
              key={site}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 8px',
                background: 'var(--jl-bg-sunken)',
                border: '1px solid var(--jl-line-soft)',
                borderRadius: 999,
                fontSize: 12,
                color: 'var(--jl-text-soft)',
              }}
            >
              {site}
              <button
                onClick={() => removeSite(site)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: 'var(--jl-text-faint)' }}
                aria-label={`Remove ${site}`}
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add site input */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="twitter.com, reddit.com…"
          style={{
            flex: 1,
            height: 32,
            padding: '0 10px',
            background: 'var(--jl-bg-sunken)',
            border: '1px solid var(--jl-line-soft)',
            borderRadius: 'var(--jl-r)',
            fontSize: 12,
            color: 'var(--jl-text)',
            outline: 'none',
          }}
        />
        <button
          onClick={addSite}
          style={{
            height: 32,
            width: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--jl-bg-sunken)',
            border: '1px solid var(--jl-line)',
            borderRadius: 'var(--jl-r)',
            cursor: 'pointer',
            color: 'var(--jl-text-soft)',
            flexShrink: 0,
          }}
          aria-label="Add blocked site"
        >
          <Plus size={13} />
        </button>
      </div>
    </div>
  )
}
