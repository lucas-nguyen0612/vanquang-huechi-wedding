'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export function MobileBackLink() {
  return (
    <Link
      href="/settings"
      aria-label="Back to Settings"
      className="md:hidden"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '12px 20px 0',
        color: 'var(--jl-accent-strong)',
        fontSize: 13,
        fontWeight: 500,
        textDecoration: 'none',
      }}
    >
      <ChevronLeft size={16} />
      <span>Settings</span>
    </Link>
  )
}
