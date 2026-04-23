'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useCreateDeck, useUpdateDeck } from '@/hooks/useFlashcards'
import { DECK_COLORS, DECK_COLOR_MAP } from '@/features/flashcards/constants'
import type { Deck } from '@/features/flashcards/types'

const deckSchema = z.object({
  name: z.string().min(1, 'Name is required').max(80, 'Name too long'),
  description: z.string().max(200, 'Description too long').optional(),
  color: z.string().min(1, 'Color is required'),
})

interface DeckEditorProps {
  deck?: Deck
  open: boolean
  onClose: () => void
}

export function DeckEditor({ deck, open, onClose }: DeckEditorProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState<string>(DECK_COLORS[0])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const createDeck = useCreateDeck()
  const updateDeck = useUpdateDeck()

  const isEdit = !!deck
  const isPending = createDeck.isPending || updateDeck.isPending

  useEffect(() => {
    if (open) {
      setName(deck?.name ?? '')
      setDescription(deck?.description ?? '')
      setColor(deck?.color ?? DECK_COLORS[0])
      setErrors({})
    }
  }, [open, deck])

  const handleSubmit = async () => {
    const parsed = deckSchema.safeParse({ name, description: description || undefined, color })
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as string
        fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    if (isEdit && deck) {
      await updateDeck.mutateAsync({ id: deck.id, data: { name, description: description || null, color } })
    } else {
      await createDeck.mutateAsync({ name, description: description || undefined, color })
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={open => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Deck' : 'New Deck'}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="deck-name">Name</Label>
            <input
              id="deck-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="OS · Chapter 4"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                border: `1px solid ${errors.name ? '#ef4444' : 'var(--jl-border)'}`,
                background: 'var(--jl-bg-sunken)',
                color: 'var(--jl-text)',
                fontSize: 14,
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
            {errors.name && <p style={{ fontSize: 12, color: '#ef4444' }}>{errors.name}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="deck-description">Description (optional)</Label>
            <input
              id="deck-description"
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What this deck covers..."
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--jl-border)',
                background: 'var(--jl-bg-sunken)',
                color: 'var(--jl-text)',
                fontSize: 14,
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Color</Label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {DECK_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: DECK_COLOR_MAP[c] ?? c,
                    border: color === c ? '3px solid var(--jl-text)' : '2px solid transparent',
                    cursor: 'pointer',
                    flexShrink: 0,
                    outline: 'none',
                  }}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            style={{ background: 'var(--jl-accent-strong)', color: '#fff', border: 'none' }}
          >
            {isPending ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Deck'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
