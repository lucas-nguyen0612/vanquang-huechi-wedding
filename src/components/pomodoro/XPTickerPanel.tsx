'use client'
import { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface XPEntry {
  id: number
  amount: number
  ts: number
}

export function XPTickerPanel() {
  const [entries, setEntries] = useState<XPEntry[]>([])
  const [totalSession, setTotalSession] = useState(0)

  useEffect(() => {
    let counter = 0
    function onXP(e: Event) {
      const { amount } = (e as CustomEvent<{ amount: number }>).detail
      setTotalSession(prev => prev + amount)
      setEntries(prev => [
        { id: counter++, amount, ts: Date.now() },
        ...prev.slice(0, 4),
      ])
    }
    window.addEventListener('jl:xp-gain', onXP)
    return () => window.removeEventListener('jl:xp-gain', onXP)
  }, [])

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Zap size={14} color="var(--jl-text-faint)" />
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--jl-text-faint)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          XP Earned
        </span>
        {totalSession > 0 && (
          <span
            style={{
              marginLeft: 'auto',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--jl-accent)',
            }}
          >
            +{totalSession} today
          </span>
        )}
      </div>

      <AnimatePresence initial={false}>
        {entries.map(entry => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 0',
              borderBottom: '1px solid var(--jl-line-soft)',
              fontSize: 13,
            }}
          >
            <span style={{ color: 'var(--jl-text-soft)' }}>Session complete</span>
            <span style={{ fontWeight: 700, color: 'var(--jl-accent)' }}>+{entry.amount} XP</span>
          </motion.div>
        ))}
      </AnimatePresence>

      {entries.length === 0 && (
        <div style={{ fontSize: 12, color: 'var(--jl-text-faint)', textAlign: 'center', padding: '16px 0' }}>
          Complete a focus session to earn XP
        </div>
      )}
    </div>
  )
}
