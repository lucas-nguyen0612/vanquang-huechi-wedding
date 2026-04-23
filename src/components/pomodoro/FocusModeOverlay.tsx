'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X, Play, Pause } from 'lucide-react'

interface FocusModeOverlayProps {
  isOpen: boolean
  onClose: () => void
  phase: 'work' | 'short' | 'long'
  timeLeft: number
  totalDuration: number
  activeTaskTitle: string | null
  isRunning: boolean
  onStart: () => void
  onPause: () => void
}

const PHASE_LABELS: Record<FocusModeOverlayProps['phase'], string> = {
  work: 'Focus',
  short: 'Short Break',
  long: 'Long Break',
}

function formatTime(seconds: number): string {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export function FocusModeOverlay({
  isOpen,
  onClose,
  phase,
  timeLeft,
  totalDuration,
  activeTaskTitle,
  isRunning,
  onStart,
  onPause,
}: FocusModeOverlayProps) {
  const sessionNumber = Math.floor((totalDuration - timeLeft) / totalDuration) + 1

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="focus-overlay"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background:
              'radial-gradient(ellipse at top, oklch(0.22 0.02 60), oklch(0.12 0.01 60))',
            color: 'white',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {/* Exit focus button — top right */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              height: 36,
              padding: '0 14px',
              background: 'rgba(255,255,255,0.08)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 'var(--jl-r)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            <X size={14} />
            Exit focus
          </button>

          {/* Center content */}
          <div style={{ textAlign: 'center' }}>
            {/* Session label */}
            <div
              style={{
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                opacity: 0.6,
                marginBottom: 20,
              }}
            >
              Session {sessionNumber} · {PHASE_LABELS[phase]}
            </div>

            {/* Giant time display */}
            <div
              style={{
                fontFamily: 'var(--jl-font-mono)',
                fontSize: 200,
                lineHeight: 1,
                letterSpacing: '-0.05em',
                margin: '0 0 20px',
              }}
            >
              {formatTime(timeLeft)}
            </div>

            {/* Active task title */}
            {activeTaskTitle && (
              <div
                style={{
                  fontSize: 16,
                  opacity: 0.75,
                  marginBottom: 26,
                }}
              >
                {activeTaskTitle}
              </div>
            )}

            {/* Start / Pause button */}
            <button
              onClick={isRunning ? onPause : onStart}
              style={{
                height: 54,
                padding: '0 28px',
                fontSize: 15,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--jl-accent-strong)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--jl-r)',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {isRunning ? (
                <>
                  <Pause size={16} />
                  Pause
                </>
              ) : (
                <>
                  <Play size={16} />
                  Resume
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
