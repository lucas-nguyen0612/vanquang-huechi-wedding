import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/server'
import { ToolErrorBoundary } from '@/components/errors/ToolErrorBoundary'
import { FlashcardsClient } from './FlashcardsClient'

export default async function FlashcardsPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  return (
    <ToolErrorBoundary toolName="Flashcards">
      <FlashcardsClient />
    </ToolErrorBoundary>
  )
}
