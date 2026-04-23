'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/onboarding')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div
        className="w-full max-w-sm space-y-6 p-8 rounded-xl"
        style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
      >
        <div className="text-center">
          <h1
            className="text-2xl font-semibold"
            style={{ color: 'var(--neon-green)' }}
          >
            Create Account
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Begin your productivity journey
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {(['email', 'password', 'confirmPassword'] as const).map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                {field === 'confirmPassword' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                id={field}
                type={field.includes('assword') ? 'password' : 'email'}
                autoComplete={field === 'email' ? 'email' : 'new-password'}
                {...register(field)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: `1px solid ${errors[field] ? '#ef4444' : 'rgba(255,255,255,0.12)'}`,
                  color: 'var(--text-primary)',
                }}
              />
              {errors[field] && (
                <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
                  {errors[field]?.message}
                </p>
              )}
            </div>
          ))}

          {error && (
            <div
              className="px-4 py-2.5 rounded-lg text-sm"
              style={{
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444',
              }}
            >
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
            style={{ background: 'var(--neon-green)', color: '#0a0a0f', fontWeight: 600 }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link href="/login" className="font-medium hover:underline" style={{ color: 'var(--neon-green)' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
