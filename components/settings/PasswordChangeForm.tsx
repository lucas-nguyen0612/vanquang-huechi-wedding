'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updatePassword } from '@/features/settings/account'
import {
  passwordUpdateSchema,
  type PasswordUpdateInput,
} from '@/features/settings/account-schemas'

type SuccessState = {
  passwordUpdated: boolean
  signedOutOtherDevices: boolean
}

export function PasswordChangeForm() {
  const [success, setSuccess] = useState<SuccessState | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PasswordUpdateInput>({
    resolver: zodResolver(passwordUpdateSchema),
  })

  const onSubmit = async (values: PasswordUpdateInput) => {
    setServerError(null)
    setSuccess(null)

    const result = await updatePassword(values)
    if (result.error) {
      if (result.error.code === 'INVALID_CREDENTIALS') {
        setError('current_password', {
          type: 'server',
          message: 'Current password is incorrect',
        })
      } else {
        setServerError(result.error.message)
      }
    } else {
      setSuccess({ passwordUpdated: true, signedOutOtherDevices: true })
      reset()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Current password */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Label htmlFor="current_password">Current password</Label>
        <Input
          id="current_password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.current_password}
          {...register('current_password')}
        />
        {errors.current_password && (
          <p role="alert" style={{ fontSize: 12, color: 'var(--jl-danger, #ef4444)', margin: 0 }}>
            {errors.current_password.message}
          </p>
        )}
      </div>

      {/* New password */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Label htmlFor="new_password">New password</Label>
        <Input
          id="new_password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.new_password}
          {...register('new_password')}
        />
        {errors.new_password && (
          <p role="alert" style={{ fontSize: 12, color: 'var(--jl-danger, #ef4444)', margin: 0 }}>
            {errors.new_password.message}
          </p>
        )}
      </div>

      {/* Confirm new password */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Label htmlFor="confirm_password">Confirm new password</Label>
        <Input
          id="confirm_password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.confirm_password}
          {...register('confirm_password')}
        />
        {errors.confirm_password && (
          <p role="alert" style={{ fontSize: 12, color: 'var(--jl-danger, #ef4444)', margin: 0 }}>
            {errors.confirm_password.message}
          </p>
        )}
      </div>

      {serverError && (
        <p role="alert" style={{ fontSize: 13, color: 'var(--jl-danger, #ef4444)', margin: 0 }}>
          {serverError}
        </p>
      )}

      {success && (
        <div
          role="status"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            padding: '10px 14px',
            background: 'var(--jl-surface-alt, #f3f4f6)',
            borderRadius: 8,
            fontSize: 13,
          }}
        >
          <span>Password updated.</span>
          <span style={{ color: 'var(--jl-text-soft)' }}>
            For security, we signed you out on other devices.
          </span>
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} style={{ alignSelf: 'flex-start' }}>
        {isSubmitting ? 'Updating…' : 'Update password'}
      </Button>
    </form>
  )
}
