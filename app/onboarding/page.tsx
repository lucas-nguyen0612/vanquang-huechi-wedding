'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

const GOALS = [
  { id: 'learning', label: 'Học tập', emoji: '📚' },
  { id: 'work', label: 'Công việc', emoji: '💼' },
  { id: 'habits', label: 'Thói quen', emoji: '✅' },
  { id: 'memory', label: 'Ghi nhớ', emoji: '🧠' },
]

const TOOLS = [
  { id: 'pomodoro', label: 'Pomodoro', desc: 'Focus timer & task list', emoji: '🍅', href: '/pomodoro' },
  { id: 'habits', label: 'Habit Tracker', desc: 'Daily check-ins & streaks', emoji: '🔥', href: '/habits' },
  { id: 'flashcards', label: 'Flashcards', desc: 'Spaced repetition review', emoji: '📇', href: '/flashcards' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [characterName, setCharacterName] = useState('')
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleGoal(id: string) {
    setSelectedGoals(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  async function selectTool(toolId: string, href: string) {
    setLoading(true)
    setError(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/sign-in'); return }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('profiles')
      .update({
        character_name: characterName.trim() || 'Adventurer',
        goals: selectedGoals,
        first_tool: toolId,
        onboarding_completed: true,
      })
      .eq('user_id', user.id)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(href)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div
        className="w-full max-w-md p-8 rounded-xl space-y-6"
        style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
      >
        {/* Progress */}
        <div className="flex gap-2">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className="h-1 flex-1 rounded-full"
              style={{ background: s <= step ? 'var(--neon-green)' : 'var(--bg-elevated)' }}
            />
          ))}
        </div>

        {/* Step 1: Character name */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                Name your character
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                This is how you&apos;ll appear in the RPG system
              </p>
            </div>
            <input
              type="text"
              placeholder="Adventurer"
              value={characterName}
              onChange={e => setCharacterName(e.target.value)}
              maxLength={32}
              className="w-full px-3.5 py-2.5 rounded-lg text-base outline-none"
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'var(--text-primary)',
              }}
            />
            <Button
              onClick={() => setStep(2)}
              className="w-full"
              style={{ background: 'var(--neon-green)', color: '#0a0a0f', fontWeight: 600 }}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Goals */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                What are your goals?
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Select all that apply
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {GOALS.map(goal => {
                const selected = selectedGoals.includes(goal.id)
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className="p-4 rounded-lg text-left transition-colors"
                    style={{
                      border: `2px solid ${selected ? 'var(--neon-green)' : 'rgba(255,255,255,0.12)'}`,
                      background: selected ? 'rgba(0,255,136,0.1)' : 'var(--bg-tertiary)',
                      cursor: 'pointer',
                    }}
                  >
                    <div className="text-2xl">{goal.emoji}</div>
                    <div className="font-medium text-sm mt-1" style={{ color: 'var(--text-primary)' }}>
                      {goal.label}
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={selectedGoals.length === 0}
                className="flex-1"
                style={{ background: 'var(--neon-green)', color: '#0a0a0f', fontWeight: 600 }}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: First tool */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                Choose your first tool
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                You can use all tools anytime
              </p>
            </div>
            <div className="space-y-3">
              {TOOLS.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => selectTool(tool.id, tool.href)}
                  disabled={loading}
                  className="w-full p-4 rounded-lg text-left flex items-center gap-3.5 transition-colors hover:opacity-90"
                  style={{
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'var(--bg-tertiary)',
                    cursor: 'pointer',
                  }}
                >
                  <span className="text-3xl">{tool.emoji}</span>
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{tool.label}</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{tool.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            {error && (
              <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>
            )}
            <Button variant="outline" onClick={() => setStep(2)} className="w-full">
              Back
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
