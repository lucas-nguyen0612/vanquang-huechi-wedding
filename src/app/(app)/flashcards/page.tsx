import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { ToolErrorBoundary } from '@/components/errors/ToolErrorBoundary'
import { DeckListClient } from './DeckListClient'

export default async function FlashcardsPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  return (
    <ToolErrorBoundary toolName="Flashcards">
      <div className="flex flex-col h-full">
        <TopBar
          title="Flashcards"
          subtitle="SM-2 spaced repetition · +2 XP per card"
        />
        <div className="flex-1 overflow-y-auto p-4">
          <DeckListClient />
        </div>
      </div>
    </ToolErrorBoundary>
  )
}
