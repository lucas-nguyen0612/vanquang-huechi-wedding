import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { ToolErrorBoundary } from '@/components/errors/ToolErrorBoundary'
import { DeckDetailClient } from './DeckDetailClient'

interface DeckPageProps {
  params: Promise<{ deckId: string }>
}

export default async function DeckPage({ params }: DeckPageProps) {
  const user = await getUser()
  if (!user) redirect('/login')

  const { deckId } = await params

  return (
    <ToolErrorBoundary toolName="Flashcards">
      <div className="flex flex-col h-full">
        <TopBar
          title="Deck Detail"
          subtitle="Cards, stats & forecast"
          rightSlot={
            <Link
              href={`/flashcards/${deckId}/study`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 8,
                background: 'var(--jl-accent-strong)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Start Study
            </Link>
          }
        />
        <div className="flex-1 overflow-y-auto p-4">
          <DeckDetailClient deckId={deckId} />
        </div>
      </div>
    </ToolErrorBoundary>
  )
}
