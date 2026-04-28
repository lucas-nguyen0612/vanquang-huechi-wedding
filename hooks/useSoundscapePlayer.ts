'use client'

import { useEffect, useRef } from 'react'
import { usePomodoroStore } from '@/store/pomodoroStore'
import { useSoundscapesQuery } from '@/hooks/useSoundscapes'

const PRESET_IDS = new Set(['silent', 'rain', 'cafe', 'forest', 'space', 'lofi'])

/**
 * Plays the selected soundscape during work-phase Pomodoro sessions.
 *
 * Built-in presets (rain/cafe/...) are kept as quick-select labels but have
 * no audio assets bundled — only custom uploaded soundscapes actually play.
 * Picking a preset is treated as silent for now.
 */
export function useSoundscapePlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const soundscapeId = usePomodoroStore(s => s.settings.soundscape)
  const volume = usePomodoroStore(s => s.settings.volume)
  const isRunning = usePomodoroStore(s => s.isRunning)
  const phase = usePomodoroStore(s => s.phase)

  const { data: soundscapes } = useSoundscapesQuery()

  // Lazily create the audio element on the client only.
  useEffect(() => {
    const audio = new Audio()
    audio.loop = true
    audio.preload = 'auto'
    audioRef.current = audio
    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [])

  // Sync the audio element's src to the selected soundscape.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const isPreset = PRESET_IDS.has(soundscapeId)
    const custom = soundscapes?.find(s => s.id === soundscapeId)

    if (isPreset || !custom) {
      // No playable audio — make sure nothing is playing.
      if (!audio.paused) audio.pause()
      if (audio.src) audio.removeAttribute('src')
      return
    }

    if (audio.src !== custom.fileUrl) {
      audio.src = custom.fileUrl
      audio.load()
    }
  }, [soundscapeId, soundscapes])

  // Sync volume.
  useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.volume = Math.max(0, Math.min(1, volume))
  }, [volume])

  // Play during running work phase, pause otherwise.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !audio.src) return

    const shouldPlay = isRunning && phase === 'work'
    if (shouldPlay) {
      // play() returns a promise that may reject if the user hasn't
      // interacted with the page yet; swallow that case quietly.
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [isRunning, phase, soundscapeId, soundscapes])
}
