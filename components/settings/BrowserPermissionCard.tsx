'use client'

import { useBrowserNotificationPermission } from '@/hooks/useBrowserNotificationPermission'

export function BrowserPermissionCard() {
  const { permission, isSupported, request } = useBrowserNotificationPermission()

  function statusLabel(): string {
    if (!isSupported) return 'Not supported'
    if (permission === null) return 'Checking…'
    if (permission === 'granted') return 'Allowed'
    if (permission === 'denied') return 'Blocked'
    return 'Off'
  }

  function statusColor(): string {
    if (permission === 'granted') return 'var(--jl-success, #16a34a)'
    if (permission === 'denied') return 'var(--jl-danger, #dc2626)'
    return 'var(--jl-text-soft)'
  }

  async function handleEnable() {
    await request()
  }

  return (
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
          Browser notifications
        </h2>
        <p style={{ fontSize: 13, color: 'var(--jl-text-soft)', margin: '4px 0 0' }}>
          Allow the browser to show desktop notifications when sessions complete.
        </p>
      </header>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: statusColor(),
          }}
          aria-label={`Browser notification permission: ${statusLabel()}`}
        >
          {statusLabel()}
        </span>

        {/* Enable button — only shown when permission is `default` (promptable) */}
        {isSupported && permission === 'default' && (
          <button
            onClick={handleEnable}
            style={{
              height: 30,
              padding: '0 14px',
              background: 'var(--jl-accent-soft)',
              border: '1px solid var(--jl-accent)',
              borderRadius: 'var(--jl-r)',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--jl-accent-ink)',
            }}
          >
            Enable
          </button>
        )}
      </div>

      {/* Help text when denied */}
      {isSupported && permission === 'denied' && (
        <p style={{ fontSize: 12, color: 'var(--jl-text-faint)', margin: 0 }}>
          Open browser settings to allow notifications for this site.
        </p>
      )}

      {/* Not supported message */}
      {!isSupported && (
        <p style={{ fontSize: 12, color: 'var(--jl-text-faint)', margin: 0 }}>
          Browser notifications are not supported on this device.
        </p>
      )}
    </section>
  )
}
