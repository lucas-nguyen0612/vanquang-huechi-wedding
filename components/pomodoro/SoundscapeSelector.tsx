'use client'
import { useRef, useState } from 'react'
import { Trash2, Upload } from 'lucide-react'
import { usePomodoroStore } from '@/store/pomodoroStore'
import {
  useSoundscapesQuery,
  useUploadSoundscape,
  useDeleteSoundscape,
  SOUNDSCAPE_MAX_BYTES,
} from '@/hooks/useSoundscapes'

const SOUNDSCAPES = [
  { id: 'silent', label: 'Silent', emoji: '🔇' },
  { id: 'rain', label: 'Rain', emoji: '🌧️' },
  { id: 'cafe', label: 'Café', emoji: '☕' },
  { id: 'forest', label: 'Forest', emoji: '🌲' },
  { id: 'space', label: 'Space', emoji: '🌌' },
  { id: 'lofi', label: 'Lo-Fi', emoji: '🎵' },
]

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--jl-text-faint)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
}

export function SoundscapeSelector() {
  const settings = usePomodoroStore(s => s.settings)
  const updateSettings = usePomodoroStore(s => s.updateSettings)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [pendingName, setPendingName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { data: customSoundscapes = [], isLoading } = useSoundscapesQuery()
  const uploadMutation = useUploadSoundscape()
  const deleteMutation = useDeleteSoundscape()

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setPendingFile(file)
    // Default name = file name without extension
    const dot = file.name.lastIndexOf('.')
    setPendingName(dot > 0 ? file.name.slice(0, dot) : file.name)
    e.target.value = ''
  }

  async function handleConfirmUpload() {
    if (!pendingFile) return
    setError(null)
    try {
      const result = await uploadMutation.mutateAsync({
        file: pendingFile,
        name: pendingName.trim() || pendingFile.name,
      })
      // Auto-select the just-uploaded soundscape so the user hears it.
      updateSettings({ soundscape: result.id })
      setPendingFile(null)
      setPendingName('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload thất bại')
    }
  }

  function handleCancelUpload() {
    setPendingFile(null)
    setPendingName('')
    setError(null)
  }

  async function handleDelete(id: string) {
    if (settings.soundscape === id) {
      // Falling back to silent so the player stops cleanly.
      updateSettings({ soundscape: 'silent' })
    }
    try {
      await deleteMutation.mutateAsync(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xóa thất bại')
    }
  }

  return (
    <div>
      <div style={{ ...labelStyle, marginBottom: 12 }}>Soundscape</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 14 }}>
        {SOUNDSCAPES.map(s => {
          const isActive = settings.soundscape === s.id
          return (
            <button
              key={s.id}
              onClick={() => updateSettings({ soundscape: s.id })}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: '10px 6px',
                borderRadius: 'var(--jl-r)',
                background: isActive ? 'var(--jl-accent-soft)' : 'var(--jl-bg-sunken)',
                border: `1px solid ${isActive ? 'var(--jl-accent)' : 'var(--jl-line-soft)'}`,
                cursor: 'pointer',
                transition: 'background 0.15s, border-color 0.15s',
              }}
            >
              <span style={{ fontSize: 18 }}>{s.emoji}</span>
              <span
                style={{
                  fontSize: 11,
                  color: isActive ? 'var(--jl-accent-ink)' : 'var(--jl-text-soft)',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {s.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Custom uploads section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={labelStyle}>My uploads</div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending || !!pendingFile}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 8px',
            fontSize: 11,
            background: 'var(--jl-bg-sunken)',
            border: '1px solid var(--jl-line-soft)',
            borderRadius: 'var(--jl-r)',
            color: 'var(--jl-text-soft)',
            cursor: uploadMutation.isPending || pendingFile ? 'not-allowed' : 'pointer',
            opacity: uploadMutation.isPending || pendingFile ? 0.5 : 1,
          }}
        >
          <Upload size={11} />
          Upload
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/webm"
          style={{ display: 'none' }}
          onChange={handleFilePick}
        />
      </div>

      {/* Pending-upload form */}
      {pendingFile && (
        <div
          style={{
            padding: 10,
            marginBottom: 10,
            background: 'var(--jl-bg-sunken)',
            border: '1px solid var(--jl-line-soft)',
            borderRadius: 'var(--jl-r)',
          }}
        >
          <div style={{ fontSize: 11, color: 'var(--jl-text-faint)', marginBottom: 6 }}>
            {pendingFile.name} · {(pendingFile.size / 1024 / 1024).toFixed(1)} MB
          </div>
          <input
            type="text"
            value={pendingName}
            onChange={e => setPendingName(e.target.value)}
            placeholder="Đặt tên cho bài nhạc..."
            maxLength={80}
            style={{
              width: '100%',
              padding: '6px 8px',
              fontSize: 12,
              background: 'var(--jl-bg-raised)',
              border: '1px solid var(--jl-line)',
              borderRadius: 'var(--jl-r)',
              color: 'var(--jl-text)',
              marginBottom: 6,
            }}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={handleConfirmUpload}
              disabled={uploadMutation.isPending}
              style={{
                flex: 1,
                padding: '6px 10px',
                fontSize: 11,
                background: 'var(--jl-accent)',
                color: 'var(--jl-accent-ink)',
                border: 'none',
                borderRadius: 'var(--jl-r)',
                cursor: uploadMutation.isPending ? 'wait' : 'pointer',
                fontWeight: 600,
              }}
            >
              {uploadMutation.isPending ? 'Đang tải lên...' : 'Tải lên'}
            </button>
            <button
              onClick={handleCancelUpload}
              disabled={uploadMutation.isPending}
              style={{
                padding: '6px 10px',
                fontSize: 11,
                background: 'transparent',
                color: 'var(--jl-text-soft)',
                border: '1px solid var(--jl-line)',
                borderRadius: 'var(--jl-r)',
                cursor: 'pointer',
              }}
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            fontSize: 11,
            color: '#dc2626',
            padding: '6px 8px',
            marginBottom: 8,
            background: 'rgba(220, 38, 38, 0.08)',
            borderRadius: 'var(--jl-r)',
          }}
        >
          {error}
        </div>
      )}

      {/* Custom soundscapes list */}
      {isLoading ? (
        <div style={{ fontSize: 11, color: 'var(--jl-text-faint)', padding: '6px 0' }}>
          Đang tải...
        </div>
      ) : customSoundscapes.length === 0 ? (
        <div style={{ fontSize: 11, color: 'var(--jl-text-faint)', padding: '6px 0' }}>
          Chưa có nhạc tự tải lên. Tối đa {SOUNDSCAPE_MAX_BYTES / 1024 / 1024} MB / file.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
          {customSoundscapes.map(s => {
            const isActive = settings.soundscape === s.id
            return (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 10px',
                  background: isActive ? 'var(--jl-accent-soft)' : 'var(--jl-bg-sunken)',
                  border: `1px solid ${isActive ? 'var(--jl-accent)' : 'var(--jl-line-soft)'}`,
                  borderRadius: 'var(--jl-r)',
                  transition: 'background 0.15s, border-color 0.15s',
                }}
              >
                <button
                  onClick={() => updateSettings({ soundscape: s.id })}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: 0,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 14 }}>🎶</span>
                  <span
                    style={{
                      fontSize: 12,
                      color: isActive ? 'var(--jl-accent-ink)' : 'var(--jl-text)',
                      fontWeight: isActive ? 600 : 400,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {s.name}
                  </span>
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  disabled={deleteMutation.isPending}
                  title="Xóa"
                  style={{
                    padding: 4,
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--jl-text-faint)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {settings.soundscape !== 'silent' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: 'var(--jl-text-faint)', flexShrink: 0 }}>Volume</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.volume}
            onChange={e => updateSettings({ volume: Number(e.target.value) })}
            style={{ flex: 1, accentColor: 'var(--jl-accent)' }}
          />
          <span style={{ fontSize: 11, color: 'var(--jl-text-faint)', width: 28, textAlign: 'right' }}>
            {Math.round(settings.volume * 100)}%
          </span>
        </div>
      )}
    </div>
  )
}
