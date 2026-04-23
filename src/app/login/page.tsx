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
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
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
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    })
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
            JL-Tools
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Sign in to continue your journey
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors"
              style={{
                background: 'var(--bg-tertiary)',
                border: `1px solid ${errors.email ? '#ef4444' : 'rgba(255,255,255,0.12)'}`,
                color: 'var(--text-primary)',
              }}
            />
            {errors.email && (
              <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors"
              style={{
                background: 'var(--bg-tertiary)',
                border: `1px solid ${errors.password ? '#ef4444' : 'rgba(255,255,255,0.12)'}`,
                color: 'var(--text-primary)',
              }}
            />
            {errors.password && (
              <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
                {errors.password.message}
              </p>
            )}
          </div>

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
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="relative">
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />
          <span
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 text-xs"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
          >
            or
          </span>
        </div>

        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
          style={{
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium hover:underline" style={{ color: 'var(--neon-green)' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
