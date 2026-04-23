import { type FC } from 'react'

type Tier = 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythic'

function getTier(level: number): Tier {
  if (level >= 50) return 'mythic'
  if (level >= 30) return 'legendary'
  if (level >= 15) return 'rare'
  if (level >= 5) return 'uncommon'
  return 'common'
}

interface AvatarProps {
  level?: number
  size?: number
}

export const Avatar: FC<AvatarProps> = ({ level = 1, size = 72 }) => {
  const tier = getTier(level)
  const tierColor = `var(--jl-${tier})`
  const glow = tier === 'mythic' || tier === 'legendary'

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        borderRadius: '50%',
        background: `radial-gradient(circle at 50% 35%, var(--jl-accent-soft), var(--jl-bg-sunken))`,
        border: `2px solid ${tierColor}`,
        boxShadow: glow
          ? `0 0 0 4px color-mix(in oklch, ${tierColor} 20%, transparent), 0 0 28px color-mix(in oklch, ${tierColor} 30%, transparent)`
          : 'var(--jl-shadow-sm)',
        overflow: 'hidden',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <svg viewBox="0 0 72 72" width={size} height={size}>
        <path
          d="M10 72 C 12 54, 22 46, 36 46 C 50 46, 60 54, 62 72 Z"
          fill={tierColor}
          opacity="0.85"
        />
        <path
          d="M20 40 C 22 24, 28 18, 36 18 C 44 18, 50 24, 52 40 L 50 46 C 46 42, 40 40, 36 40 C 32 40, 26 42, 22 46 Z"
          fill="var(--jl-text)"
          opacity="0.88"
        />
        <ellipse cx="36" cy="34" rx="8" ry="6" fill="var(--jl-bg-sunken)" opacity="0.9" />
        <circle cx="33" cy="34" r="1.2" fill={tierColor} />
        <circle cx="39" cy="34" r="1.2" fill={tierColor} />
        <path
          d="M22 46 C 28 44, 44 44, 50 46"
          stroke="var(--jl-bg-raised)"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
      </svg>
      {(tier === 'legendary' || tier === 'mythic') && (
        <svg
          style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)' }}
          width={size * 0.36}
          height={size * 0.22}
          viewBox="0 0 36 22"
        >
          <path
            d="M2 20 L6 6 L12 14 L18 2 L24 14 L30 6 L34 20 Z"
            fill={tierColor}
            stroke="var(--jl-bg)"
            strokeWidth="1.2"
          />
        </svg>
      )}
    </div>
  )
}
