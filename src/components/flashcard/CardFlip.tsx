'use client'

interface CardFlipProps {
  front: string
  back: string
  isFlipped: boolean
  onFlip: () => void
}

export function CardFlip({ front, back, isFlipped, onFlip }: CardFlipProps) {
  return (
    <div
      onClick={onFlip}
      style={{
        perspective: 1500,
        height: 380,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.55s cubic-bezier(0.3, 0.8, 0.4, 1.2)',
          transform: isFlipped ? 'rotateX(180deg)' : 'none',
        }}
      >
        {/* Front face */}
        <div
          className="rounded-xl"
          style={{
            position: 'absolute',
            inset: 0,
            padding: 40,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--jl-bg-elevated)',
            border: '1px solid var(--jl-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--jl-accent-strong)',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 10, color: 'var(--jl-text-faint)', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>
              FRONT · click to flip
            </span>
          </div>

          <div
            style={{
              flex: 1,
              display: 'grid',
              placeItems: 'center',
              textAlign: 'center',
              padding: '0 40px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--jl-text-faint)',
                  marginBottom: 14,
                }}
              >
                Question
              </div>
              <div
                style={{
                  fontSize: 28,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.3,
                  color: 'var(--jl-text)',
                  fontWeight: 600,
                }}
              >
                {front}
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: 11,
              color: 'var(--jl-text-faint)',
              textAlign: 'center',
            }}
          >
            Click to reveal answer
          </div>
        </div>

        {/* Back face */}
        <div
          className="rounded-xl"
          style={{
            position: 'absolute',
            inset: 0,
            padding: 40,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateX(180deg)',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--jl-bg-elevated)',
            border: '1px solid var(--jl-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--jl-success)',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 10, color: 'var(--jl-text-faint)', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>
              BACK
            </span>
          </div>

          <div
            style={{
              flex: 1,
              display: 'grid',
              placeItems: 'center',
              textAlign: 'center',
              padding: '0 40px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--jl-text-faint)',
                  marginBottom: 14,
                }}
              >
                Answer
              </div>
              <div
                style={{
                  fontSize: 20,
                  lineHeight: 1.5,
                  color: 'var(--jl-text)',
                  maxWidth: 560,
                  margin: '0 auto',
                }}
              >
                {back}
              </div>
            </div>
          </div>

          <div style={{ fontSize: 11, color: 'var(--jl-text-faint)', textAlign: 'center' }}>
            Rate your recall below · keyboard 1–4
          </div>
        </div>
      </div>
    </div>
  )
}
