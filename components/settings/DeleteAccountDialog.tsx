'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { deleteAccount } from '@/features/settings/account'

interface DeleteAccountDialogProps {
  characterName: string
}

export function DeleteAccountDialog({ characterName }: DeleteAccountDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  // Both fields must match before button enables
  const isConfirmed =
    nameInput === characterName && passwordInput.length >= 8

  const reset = () => {
    setNameInput('')
    setPasswordInput('')
    setServerError(null)
  }

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) reset()
  }

  const handleDelete = async () => {
    if (!isConfirmed) return
    setIsSubmitting(true)
    setServerError(null)

    const result = await deleteAccount({
      character_name_confirm: nameInput,
      password: passwordInput,
    })

    if (result.error) {
      setServerError(result.error.message)
      setIsSubmitting(false)
    } else {
      // Server cleared cookies and signed out; redirect to landing
      router.push('/')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          style={{
            alignSelf: 'flex-start',
            borderColor: 'var(--jl-danger, #ef4444)',
            color: 'var(--jl-danger, #ef4444)',
          }}
        >
          Delete account
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete your account</DialogTitle>
          <DialogDescription>
            This is permanent. All your data will be deleted and cannot be recovered.
          </DialogDescription>
        </DialogHeader>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
          {/* Display name confirmation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Label htmlFor="delete_name_confirm">
              Type your display name{' '}
              <strong style={{ fontFamily: 'monospace' }}>{characterName}</strong> to confirm
            </Label>
            <Input
              id="delete_name_confirm"
              type="text"
              autoComplete="off"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder={characterName}
              aria-label="Display name confirmation"
            />
          </div>

          {/* Password confirmation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Label htmlFor="delete_password">Current password</Label>
            <Input
              id="delete_password"
              type="password"
              autoComplete="current-password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              aria-label="Password for account deletion"
            />
          </div>

          {serverError && (
            <p
              role="alert"
              style={{ fontSize: 13, color: 'var(--jl-danger, #ef4444)', margin: 0 }}
            >
              {serverError}
            </p>
          )}
        </div>

        <DialogFooter showCloseButton>
          <Button
            onClick={handleDelete}
            disabled={!isConfirmed || isSubmitting}
            aria-disabled={!isConfirmed || isSubmitting}
            style={{
              background: 'var(--jl-danger, #ef4444)',
              color: '#fff',
              opacity: !isConfirmed || isSubmitting ? 0.5 : 1,
            }}
          >
            {isSubmitting ? 'Deleting…' : 'Delete my account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
