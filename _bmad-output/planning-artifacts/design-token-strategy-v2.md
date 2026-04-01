# JL-Tools Design Token Strategy v2 — Modern 2025-2026

> **Thay the cho:** Design Token Strategy cu (flat CSS variables, sRGB-only, khong co layer architecture)
> **Upgrade chinh:** OKLCH color space, 3-layer token architecture, motion/glow/blur token systems, fluid typography, Tailwind CSS v4 native

---

## 1. Token Architecture — 3-Layer System

Thay vi flat CSS variables, su dung kien truc **Primitive → Semantic → Component** de dam bao scalability va consistency.

```
┌─────────────────────────────────────────────────┐
│  COMPONENT TOKENS (specific)                     │
│  --xp-bar-fill, --timer-digit-color              │
│  --level-up-glow, --streak-fire-gradient         │
├─────────────────────────────────────────────────┤
│  SEMANTIC TOKENS (intent-based)                  │
│  --color-surface, --color-accent-xp              │
│  --color-accent-fire, --motion-reward            │
│  --glow-accent, --blur-overlay                   │
├─────────────────────────────────────────────────┤
│  PRIMITIVE TOKENS (raw values)                   │
│  --void-1, --void-2, --neon-green-500            │
│  --duration-fast, --ease-out-expo                │
│  --blur-md, --glow-radius-lg                     │
└─────────────────────────────────────────────────┘
```

**Loi ich so voi v1:**
- Doi accent color chi can thay doi o Primitive layer → tu dong cascade xuong moi component
- Theme switching (dark/focus-mode/celebration) chi thay doi Semantic layer
- Component tokens cho phep fine-tune tung element ma khong anh huong global

---

## 2. Color System — OKLCH + P3 Wide Gamut

### Tai sao OKLCH thay vi HEX/HSL?

| Tieu chi | HEX/HSL (v1 cu) | OKLCH (v2 moi) |
|----------|-----------------|-----------------|
| **Perceptual uniformity** | Khong — cung lightness khac nhau tuy hue | Co — 50% lightness tren moi hue deu nhin giong nhau |
| **Neon vibrancy** | Bi gioi han boi sRGB gamut | P3 wide gamut → neon sang hon 25-30% tren man hinh hien dai |
| **Manipulation** | Khong de dang tinh toan shade/tint | De dang: chi thay doi L (lightness) hoac C (chroma) |
| **Gradient smoothing** | "Dead zone" o giua gradient | Gradient muot, khong bi xam o giua |
| **Browser support** | 100% | 95%+ (2025), fallback sRGB cho 5% con lai |

### 2.1 Primitive Color Tokens

```css
/* ═══════════════════════════════════════════════
   LAYER 1: PRIMITIVE TOKENS — Raw OKLCH Values
   ═══════════════════════════════════════════════ */

@layer primitives {
  :root {
    /* === VOID (Background Scale) === */
    /* OKLCH format: oklch(Lightness Chroma Hue) */
    --void-0: oklch(0.05 0.02 280);    /* #050508 — True void */
    --void-1: oklch(0.08 0.025 280);   /* ~#0a0a0f — App background */
    --void-2: oklch(0.11 0.03 280);    /* ~#12121a — Card surfaces */
    --void-3: oklch(0.15 0.035 275);   /* ~#1a1a2e — Elevated surfaces */
    --void-4: oklch(0.20 0.04 270);    /* ~#252540 — Hover surfaces */
    --void-5: oklch(0.25 0.03 270);    /* ~#2a2a3a — Active surfaces */

    /* === NEON ACCENTS (P3 Wide Gamut) === */
    /* Dung @supports (color: oklch(0 0 0)) de progressive enhance */

    /* Neon Green — XP, Success, Primary CTA */
    --neon-green-400: oklch(0.85 0.30 155);   /* Lighter — hover */
    --neon-green-500: oklch(0.80 0.35 155);   /* Primary — #00ff88 equivalent but wider gamut */
    --neon-green-600: oklch(0.70 0.30 155);   /* Darker — pressed */
    --neon-green-glow: oklch(0.80 0.35 155 / 0.4);  /* Glow variant */

    /* Neon Pink — Streak Fire, Hot States */
    --neon-pink-400: oklch(0.72 0.30 350);
    --neon-pink-500: oklch(0.65 0.35 350);    /* Primary — #ff0080 equivalent */
    --neon-pink-600: oklch(0.55 0.30 350);
    --neon-pink-glow: oklch(0.65 0.35 350 / 0.4);

    /* Neon Cyan — Timer, Info, Links */
    --neon-cyan-400: oklch(0.85 0.20 210);
    --neon-cyan-500: oklch(0.80 0.25 210);    /* Primary — #00d4ff equivalent */
    --neon-cyan-600: oklch(0.70 0.20 210);
    --neon-cyan-glow: oklch(0.80 0.25 210 / 0.4);

    /* Neon Purple — Level-up, Celebration, Special */
    --neon-purple-400: oklch(0.65 0.25 290);
    --neon-purple-500: oklch(0.55 0.30 290);  /* Primary — #8b5cf6 equivalent */
    --neon-purple-600: oklch(0.45 0.25 290);
    --neon-purple-glow: oklch(0.55 0.30 290 / 0.4);

    /* Neon Gold — Milestone, Achievement, Streak 30+ */
    --neon-gold-400: oklch(0.85 0.18 85);
    --neon-gold-500: oklch(0.80 0.22 85);
    --neon-gold-600: oklch(0.70 0.18 85);
    --neon-gold-glow: oklch(0.80 0.22 85 / 0.35);

    /* === TEXT === */
    --text-100: oklch(1.00 0 0);              /* #ffffff — Primary */
    --text-200: oklch(0.85 0 0);              /* ~#d4d4d4 — Secondary */
    --text-300: oklch(0.70 0.01 260);         /* ~#94a3b8 — Muted */
    --text-400: oklch(0.50 0.01 260);         /* ~#475569 — Disabled */
    --text-500: oklch(0.35 0.01 260);         /* ~#334155 — Ghost */

    /* === SEMANTIC STATES === */
    --state-success: oklch(0.80 0.35 155);    /* = neon-green-500 */
    --state-warning: oklch(0.82 0.20 85);     /* Warm amber */
    --state-error: oklch(0.65 0.30 25);       /* Neon red */
    --state-info: oklch(0.80 0.25 210);       /* = neon-cyan-500 */

    /* === BORDER & DIVIDER === */
    --border-subtle: oklch(0.25 0.02 280 / 0.5);
    --border-default: oklch(0.30 0.03 280 / 0.6);
    --border-accent: oklch(0.50 0.15 280 / 0.4);
    --border-glow: oklch(0.80 0.35 155 / 0.3);  /* Green glow border */
  }
}
```

### 2.2 Semantic Color Tokens

```css
/* ═══════════════════════════════════════════════
   LAYER 2: SEMANTIC TOKENS — Intent-Based
   ═══════════════════════════════════════════════ */

@layer semantic {
  :root {
    /* === SURFACES === */
    --color-bg-app: var(--void-1);
    --color-bg-card: var(--void-2);
    --color-bg-elevated: var(--void-3);
    --color-bg-hover: var(--void-4);
    --color-bg-active: var(--void-5);
    --color-bg-overlay: oklch(0.05 0.02 280 / 0.85);

    /* === ACCENT ROLES === */
    --color-accent-xp: var(--neon-green-500);           /* XP bar fill */
    --color-accent-fire: var(--neon-pink-500);           /* Streak, fire */
    --color-accent-focus: var(--neon-cyan-500);          /* Timer running */
    --color-accent-celebration: var(--neon-purple-500);  /* Level-up */
    --color-accent-milestone: var(--neon-gold-500);      /* 30+ streak, special */
    --color-accent-primary: var(--neon-green-500);       /* Primary CTA */

    /* === TEXT ROLES === */
    --color-text-heading: var(--text-100);
    --color-text-body: var(--text-200);
    --color-text-muted: var(--text-300);
    --color-text-disabled: var(--text-400);
    --color-text-ghost: var(--text-500);

    /* === INTERACTIVE STATES === */
    --color-btn-primary: var(--neon-green-500);
    --color-btn-primary-hover: var(--neon-green-400);
    --color-btn-primary-active: var(--neon-green-600);
    --color-btn-secondary: var(--void-3);
    --color-btn-destructive: var(--state-error);

    /* === BORDERS === */
    --color-border: var(--border-subtle);
    --color-border-hover: var(--border-default);
    --color-border-focus: var(--border-glow);
  }

  /* === FOCUS MODE THEME OVERRIDE === */
  [data-mode="focus"] {
    --color-bg-app: var(--void-0);        /* Even darker */
    --color-bg-card: var(--void-1);
    --color-accent-primary: var(--neon-cyan-500);  /* Timer cyan as primary */
    --color-text-body: var(--text-300);   /* Dimmer body text */
  }

  /* === CELEBRATION STATE OVERRIDE === */
  [data-state="celebration"] {
    --color-accent-primary: var(--neon-purple-500);
    --color-bg-card: oklch(0.12 0.05 290);  /* Purple-tinted card */
  }
}
```

### 2.3 Component Color Tokens

```css
/* ═══════════════════════════════════════════════
   LAYER 3: COMPONENT TOKENS — Specific Elements
   ═══════════════════════════════════════════════ */

@layer components {
  :root {
    /* === XP BAR === */
    --xp-bar-track: var(--void-3);
    --xp-bar-fill: var(--color-accent-xp);
    --xp-bar-glow: var(--neon-green-glow);
    --xp-bar-delta-bg: oklch(0.80 0.35 155 / 0.15);
    --xp-bar-delta-text: var(--neon-green-400);

    /* === TIMER === */
    --timer-digit: var(--text-100);
    --timer-digit-running: var(--neon-cyan-500);
    --timer-digit-break: var(--neon-purple-400);
    --timer-ring-track: var(--void-4);
    --timer-ring-fill: var(--neon-cyan-500);
    --timer-ring-glow: var(--neon-cyan-glow);

    /* === STREAK === */
    --streak-cold: var(--text-400);                      /* 0-2 days */
    --streak-warm: oklch(0.82 0.20 85);                  /* 3-6 days */
    --streak-hot: oklch(0.75 0.25 55);                   /* 7-13 days */
    --streak-fire: var(--neon-pink-500);                  /* 14-29 days */
    --streak-blaze: var(--neon-gold-500);                 /* 30+ days */

    /* === HABIT CHECK-IN === */
    --habit-unchecked: var(--void-3);
    --habit-checked: var(--neon-green-500);
    --habit-checked-bg: oklch(0.80 0.35 155 / 0.1);
    --habit-missed: oklch(0.50 0.10 25 / 0.3);

    /* === LEVEL-UP MODAL === */
    --levelup-bg: oklch(0.10 0.06 290);
    --levelup-title: var(--neon-purple-400);
    --levelup-glow: var(--neon-purple-glow);
    --levelup-confetti-1: var(--neon-green-500);
    --levelup-confetti-2: var(--neon-pink-500);
    --levelup-confetti-3: var(--neon-cyan-500);
    --levelup-confetti-4: var(--neon-gold-500);

    /* === SIDEBAR / NAV === */
    --nav-bg: var(--void-2);
    --nav-item-active: oklch(0.80 0.35 155 / 0.1);
    --nav-item-hover: var(--void-4);
    --nav-indicator: var(--neon-green-500);

    /* === SYNC STATUS === */
    --sync-ok: var(--neon-green-500);
    --sync-pending: var(--neon-gold-500);
    --sync-failed: var(--state-error);
  }
}
```

### 2.4 P3 Wide Gamut Progressive Enhancement

```css
/* sRGB fallback cho browsers khong ho tro OKLCH */
:root {
  --neon-green-500-fallback: #00ff88;
  --neon-pink-500-fallback: #ff0080;
  --neon-cyan-500-fallback: #00d4ff;
  --neon-purple-500-fallback: #8b5cf6;
}

/* Progressive enhance khi browser ho tro */
@supports (color: oklch(0.8 0.35 155)) {
  :root {
    /* Override voi OKLCH values — wider gamut, brighter neons */
    /* Cac neon colors trong OKLCH co the reach beyond sRGB */
    /* tren P3 displays → sang hon ~25% so voi HEX equivalents */
  }
}

/* P3 display enhancement */
@media (color-gamut: p3) {
  :root {
    /* Boost chroma cho P3 displays */
    --neon-green-500: oklch(0.82 0.38 155);   /* Even brighter green */
    --neon-pink-500: oklch(0.67 0.38 350);    /* Even brighter pink */
    --neon-cyan-500: oklch(0.82 0.28 210);    /* Even brighter cyan */
  }
}
```

---

## 3. Glow & Neon Effect Token System

Day la diem khac biet lon nhat cho dark gaming UI — thay vi hardcode glow values, tokenize thanh system.

### 3.1 Glow Primitives

```css
@layer primitives {
  :root {
    /* === GLOW RADIUS SCALE === */
    --glow-xs: 4px;
    --glow-sm: 8px;
    --glow-md: 16px;
    --glow-lg: 24px;
    --glow-xl: 40px;
    --glow-2xl: 64px;     /* Level-up burst */

    /* === GLOW INTENSITY (Opacity multiplier) === */
    --glow-intensity-subtle: 0.15;
    --glow-intensity-medium: 0.3;
    --glow-intensity-strong: 0.5;
    --glow-intensity-intense: 0.7;   /* Celebrations only */

    /* === GLOW SPREAD === */
    --glow-spread-tight: 0px;
    --glow-spread-normal: 4px;
    --glow-spread-wide: 8px;
    --glow-spread-burst: 16px;       /* Level-up */
  }
}
```

### 3.2 Semantic Glow Tokens

```css
@layer semantic {
  :root {
    /* === BOX GLOW PRESETS === */
    --glow-xp:
      0 0 var(--glow-md) oklch(0.80 0.35 155 / var(--glow-intensity-medium)),
      0 0 var(--glow-xl) oklch(0.80 0.35 155 / var(--glow-intensity-subtle));

    --glow-fire:
      0 0 var(--glow-md) oklch(0.65 0.35 350 / var(--glow-intensity-medium)),
      0 0 var(--glow-xl) oklch(0.65 0.35 350 / var(--glow-intensity-subtle));

    --glow-focus:
      0 0 var(--glow-sm) oklch(0.80 0.25 210 / var(--glow-intensity-medium)),
      0 0 var(--glow-lg) oklch(0.80 0.25 210 / var(--glow-intensity-subtle));

    --glow-celebration:
      0 0 var(--glow-lg) oklch(0.55 0.30 290 / var(--glow-intensity-strong)),
      0 0 var(--glow-2xl) oklch(0.55 0.30 290 / var(--glow-intensity-medium));

    --glow-milestone:
      0 0 var(--glow-lg) oklch(0.80 0.22 85 / var(--glow-intensity-strong)),
      0 0 var(--glow-2xl) oklch(0.80 0.22 85 / var(--glow-intensity-medium));

    /* === TEXT GLOW PRESETS === */
    --text-glow-xp:
      0 0 var(--glow-sm) oklch(0.80 0.35 155 / 0.6);

    --text-glow-fire:
      0 0 var(--glow-sm) oklch(0.65 0.35 350 / 0.6);

    --text-glow-timer:
      0 0 var(--glow-md) oklch(0.80 0.25 210 / 0.4);

    --text-glow-levelup:
      0 0 var(--glow-md) oklch(0.55 0.30 290 / 0.5),
      0 0 var(--glow-xl) oklch(0.55 0.30 290 / 0.2);

    /* === FOCUS RING (Accessibility) === */
    --focus-ring:
      0 0 0 2px var(--void-1),
      0 0 0 4px var(--neon-green-500),
      0 0 var(--glow-sm) var(--neon-green-glow);
  }
}
```

### 3.3 Reduced Motion Glow Override

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    /* Giu static glow, tat animated glow */
    --glow-intensity-intense: var(--glow-intensity-medium);
    --glow-2xl: var(--glow-lg);   /* Reduce burst size */
  }
}
```

---

## 4. Gradient Token System

### 4.1 Gradient Primitives

```css
@layer primitives {
  :root {
    /* === GRADIENT ANGLES === */
    --gradient-to-r: 90deg;
    --gradient-to-b: 180deg;
    --gradient-to-br: 135deg;
    --gradient-radial: radial-gradient;

    /* === STREAK FIRE GRADIENTS (Escalating Intensity) === */
    --gradient-streak-cold: linear-gradient(
      var(--gradient-to-r),
      oklch(0.50 0.01 260),
      oklch(0.40 0.01 260)
    );

    --gradient-streak-warm: linear-gradient(
      var(--gradient-to-r),
      oklch(0.82 0.20 85),
      oklch(0.78 0.22 65)
    );

    --gradient-streak-hot: linear-gradient(
      var(--gradient-to-r),
      oklch(0.78 0.22 65),
      oklch(0.72 0.28 40)
    );

    --gradient-streak-fire: linear-gradient(
      var(--gradient-to-r),
      oklch(0.72 0.28 40),
      oklch(0.65 0.35 350)
    );

    --gradient-streak-blaze: linear-gradient(
      var(--gradient-to-r),
      oklch(0.80 0.22 85),
      oklch(0.65 0.35 350),
      oklch(0.72 0.28 40)
    );

    /* === XP BAR GRADIENT === */
    --gradient-xp-fill: linear-gradient(
      var(--gradient-to-r),
      oklch(0.75 0.30 160),
      oklch(0.80 0.35 155),
      oklch(0.85 0.30 150)
    );

    /* === LEVEL-UP GRADIENT === */
    --gradient-levelup: linear-gradient(
      var(--gradient-to-br),
      oklch(0.55 0.30 290),
      oklch(0.50 0.35 320),
      oklch(0.55 0.30 260)
    );

    /* === AMBIENT MESH GRADIENT (Background Decoration) === */
    --gradient-ambient-xp: radial-gradient(
      ellipse at 20% 50%,
      oklch(0.80 0.35 155 / 0.06) 0%,
      transparent 60%
    );

    --gradient-ambient-fire: radial-gradient(
      ellipse at 80% 30%,
      oklch(0.65 0.35 350 / 0.05) 0%,
      transparent 50%
    );

    /* === GLASSMORPHISM SURFACE GRADIENT === */
    --gradient-glass: linear-gradient(
      var(--gradient-to-br),
      oklch(1 0 0 / 0.05),
      oklch(1 0 0 / 0.02)
    );
  }
}
```

---

## 5. Blur & Elevation Token System

Thay vi box-shadow truyen thong, su dung **Layered Blur + Border** system phu hop dark UI.

### 5.1 Blur Tokens

```css
@layer primitives {
  :root {
    /* === BACKDROP BLUR SCALE === */
    --blur-none: 0px;
    --blur-xs: 4px;
    --blur-sm: 8px;
    --blur-md: 12px;
    --blur-lg: 20px;
    --blur-xl: 40px;       /* Overlay/modal backdrop */

    /* === SURFACE BLUR PRESETS === */
    --surface-glass: blur(var(--blur-md));
    --surface-frosted: blur(var(--blur-lg));
    --surface-deep: blur(var(--blur-xl));
  }
}
```

### 5.2 Elevation System (Dark UI Adapted)

Trong dark UI, shadow khong hieu qua. Thay vao do, su dung **border lightness + backdrop blur + subtle glow**.

```css
@layer semantic {
  :root {
    /* === ELEVATION LEVELS === */
    /* Level 0: Flat on background */
    --elevation-0-bg: var(--void-1);
    --elevation-0-border: none;
    --elevation-0-blur: none;

    /* Level 1: Card surfaces */
    --elevation-1-bg: var(--void-2);
    --elevation-1-border: 1px solid oklch(1 0 0 / 0.06);
    --elevation-1-blur: none;

    /* Level 2: Elevated cards, popovers */
    --elevation-2-bg: var(--void-3);
    --elevation-2-border: 1px solid oklch(1 0 0 / 0.08);
    --elevation-2-blur: var(--surface-glass);

    /* Level 3: Sheets, dropdowns */
    --elevation-3-bg: oklch(0.13 0.03 280 / 0.90);
    --elevation-3-border: 1px solid oklch(1 0 0 / 0.10);
    --elevation-3-blur: var(--surface-frosted);

    /* Level 4: Modal, level-up celebration */
    --elevation-4-bg: oklch(0.10 0.04 280 / 0.95);
    --elevation-4-border: 1px solid oklch(1 0 0 / 0.12);
    --elevation-4-blur: var(--surface-deep);
    --elevation-4-shadow:
      0 24px 48px oklch(0 0 0 / 0.5),
      0 0 var(--glow-lg) oklch(0.55 0.30 290 / 0.1);
  }
}
```

---

## 6. Motion Token System

Tokenize moi animation value de dam bao consistency va respect reduced-motion.

### 6.1 Duration Tokens

```css
@layer primitives {
  :root {
    /* === DURATIONS === */
    --duration-instant: 0ms;
    --duration-micro: 100ms;       /* Tap feedback */
    --duration-fast: 150ms;        /* Hover, toggle */
    --duration-normal: 250ms;      /* Most transitions */
    --duration-slow: 400ms;        /* Page/modal enter */
    --duration-reward: 500ms;      /* XP animation, celebration */
    --duration-celebration: 800ms; /* Level-up burst */

    /* === EASING CURVES === */
    /* Modern spring-inspired curves thay vi cubic-bezier truyen thong */
    --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);     /* Primary — moi UI transition */
    --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);  /* Bounce — reward moments */
    --ease-in-expo: cubic-bezier(0.7, 0, 0.84, 0);       /* Exit — modal close */
    --ease-in-out-sine: cubic-bezier(0.37, 0, 0.63, 1);  /* Subtle — background ambient */
    --ease-spring: linear(                                 /* CSS Spring — most natural */
      0, 0.006, 0.025 2.8%, 0.101 6.1%, 0.539 18.9%,
      0.721 25.3%, 0.849 31.5%, 0.937 38.1%,
      0.968 41.8%, 0.991 45.7%, 1.006 50.1%,
      1.015 55%, 1.017 63.9%, 1.001
    );

    /* === SPRING PHYSICS (Framer Motion) === */
    --spring-snappy: 300 30;       /* stiffness damping — UI transitions */
    --spring-bouncy: 400 20;       /* stiffness damping — reward pop */
    --spring-gentle: 200 25;       /* stiffness damping — modal enter */
    --spring-stiff: 500 35;        /* stiffness damping — quick snap */
  }
}
```

### 6.2 Semantic Motion Tokens

```css
@layer semantic {
  :root {
    /* === UI TRANSITIONS === */
    --motion-hover: var(--duration-fast) var(--ease-out-expo);
    --motion-press: var(--duration-micro) var(--ease-out-expo);
    --motion-toggle: var(--duration-normal) var(--ease-out-expo);
    --motion-expand: var(--duration-slow) var(--ease-out-expo);

    /* === REWARD TRANSITIONS === */
    --motion-xp-fill: var(--duration-reward) var(--ease-out-back);
    --motion-xp-delta: var(--duration-normal) var(--ease-spring);
    --motion-streak-pulse: var(--duration-normal) var(--ease-out-back);
    --motion-levelup-enter: var(--duration-celebration) var(--ease-spring);
    --motion-confetti: var(--duration-celebration) var(--ease-out-expo);

    /* === NAVIGATION === */
    --motion-page-enter: var(--duration-slow) var(--ease-out-expo);
    --motion-page-exit: var(--duration-normal) var(--ease-in-expo);
    --motion-modal-enter: var(--duration-slow) var(--ease-spring);
    --motion-modal-exit: var(--duration-normal) var(--ease-in-expo);

    /* === SCALE FEEDBACK === */
    --scale-press: 0.97;
    --scale-hover: 1.02;
    --scale-pop: 1.05;       /* Reward moments */
    --scale-bounce: 1.15;    /* Level-up burst */
  }
}

/* === REDUCED MOTION === */
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-micro: 0ms;
    --duration-fast: 0ms;
    --duration-normal: 0ms;
    --duration-slow: 100ms;          /* Keep minimal transition */
    --duration-reward: 100ms;
    --duration-celebration: 100ms;
    --scale-press: 1;
    --scale-hover: 1;
    --scale-pop: 1;
    --scale-bounce: 1;
    /* Glow/color changes van giu nguyen — chi tat motion */
  }
}
```

---

## 7. Fluid Typography System

Thay vi fixed px values, su dung `clamp()` cho fluid scaling tu mobile → desktop.

### 7.1 Font Stack (Updated)

| Usage | Primary | Fallback | Weights |
|-------|---------|----------|---------|
| **Display/Heading** | Inter | system-ui, sans-serif | 600, 700 |
| **Body** | Inter | system-ui, sans-serif | 400, 500 |
| **Timer/Data** | JetBrains Mono | ui-monospace, monospace | 400, 700 |
| **Level Titles** | Orbitron (optional) | Inter, sans-serif | 700, 900 |

> **Ghi chu:** Orbitron dung cho level-up modal titles va XP milestones de tao "gaming feel" cho screenshot-worthy moments. Khong dung cho body text.

### 7.2 Fluid Type Scale

```css
@layer primitives {
  :root {
    /* === FLUID TYPOGRAPHY — clamp(min, preferred, max) === */
    /* Thay vi breakpoint-specific sizes, fluid scale tu 375px → 1440px */

    --text-xs: clamp(0.6875rem, 0.65rem + 0.1vw, 0.75rem);      /* 11-12px */
    --text-sm: clamp(0.75rem, 0.7rem + 0.15vw, 0.875rem);       /* 12-14px */
    --text-base: clamp(0.875rem, 0.82rem + 0.2vw, 1rem);        /* 14-16px */
    --text-lg: clamp(1rem, 0.92rem + 0.3vw, 1.125rem);          /* 16-18px */
    --text-xl: clamp(1.125rem, 1rem + 0.4vw, 1.5rem);           /* 18-24px */
    --text-2xl: clamp(1.5rem, 1.2rem + 0.8vw, 2rem);            /* 24-32px */
    --text-3xl: clamp(2rem, 1.5rem + 1.5vw, 3rem);              /* 32-48px */

    /* === TIMER DISPLAY (Special Scale) === */
    --text-timer-mobile: clamp(2.5rem, 2rem + 3vw, 3rem);       /* 40-48px */
    --text-timer-desktop: clamp(4rem, 3rem + 4vw, 6rem);        /* 64-96px */

    /* === LINE HEIGHTS === */
    --leading-none: 1;
    --leading-tight: 1.2;
    --leading-snug: 1.35;
    --leading-normal: 1.5;
    --leading-relaxed: 1.65;

    /* === LETTER SPACING === */
    --tracking-tighter: -0.03em;   /* Large display */
    --tracking-tight: -0.015em;    /* Headings */
    --tracking-normal: 0;          /* Body */
    --tracking-wide: 0.05em;       /* Labels, uppercase */
    --tracking-wider: 0.1em;       /* XP delta, small caps */
    --tracking-widest: 0.15em;     /* Level titles (Orbitron) */

    /* === FONT WEIGHTS === */
    --weight-regular: 400;
    --weight-medium: 500;
    --weight-semibold: 600;
    --weight-bold: 700;
    --weight-black: 900;
  }
}
```

### 7.3 Semantic Type Tokens

```css
@layer semantic {
  :root {
    /* === TYPE ROLES === */
    --type-page-title: var(--weight-bold) var(--text-2xl) / var(--leading-tight);
    --type-section-heading: var(--weight-semibold) var(--text-xl) / var(--leading-snug);
    --type-body: var(--weight-regular) var(--text-base) / var(--leading-normal);
    --type-label: var(--weight-medium) var(--text-sm) / var(--leading-snug);
    --type-caption: var(--weight-regular) var(--text-xs) / var(--leading-snug);

    /* === GAMIFICATION TYPE === */
    --type-timer-digit: var(--weight-bold) var(--text-timer-mobile) / var(--leading-none);
    --type-xp-number: var(--weight-bold) var(--text-sm) / var(--leading-none);
    --type-level-title: var(--weight-black) var(--text-xl) / var(--leading-tight);
    --type-streak-count: var(--weight-bold) var(--text-lg) / var(--leading-none);
    --type-xp-delta: var(--weight-bold) var(--text-sm) / var(--leading-none);
  }
}
```

---

## 8. Spacing & Sizing Tokens

### 8.1 Spacing Scale (4px base)

```css
@layer primitives {
  :root {
    /* === SPACING SCALE === */
    --space-0: 0;
    --space-px: 1px;
    --space-0.5: 0.125rem;  /* 2px */
    --space-1: 0.25rem;     /* 4px */
    --space-1.5: 0.375rem;  /* 6px */
    --space-2: 0.5rem;      /* 8px */
    --space-3: 0.75rem;     /* 12px */
    --space-4: 1rem;        /* 16px */
    --space-5: 1.25rem;     /* 20px */
    --space-6: 1.5rem;      /* 24px */
    --space-8: 2rem;        /* 32px */
    --space-10: 2.5rem;     /* 40px */
    --space-12: 3rem;       /* 48px */
    --space-16: 4rem;       /* 64px */
    --space-20: 5rem;       /* 80px */
    --space-24: 6rem;       /* 96px */

    /* === RADIUS SCALE === */
    --radius-none: 0;
    --radius-sm: 0.375rem;   /* 6px — Small badges */
    --radius-md: 0.5rem;     /* 8px — Buttons, inputs */
    --radius-lg: 0.75rem;    /* 12px — Cards */
    --radius-xl: 1rem;       /* 16px — Modals */
    --radius-2xl: 1.5rem;    /* 24px — Large cards (glassmorphism) */
    --radius-full: 9999px;   /* Pill, circular */

    /* === SIZING === */
    --size-icon-sm: 1rem;    /* 16px */
    --size-icon-md: 1.25rem; /* 20px */
    --size-icon-lg: 1.5rem;  /* 24px */
    --size-icon-xl: 2rem;    /* 32px */
    --size-touch-min: 2.75rem; /* 44px — Minimum touch target */
    --size-sidebar: 17.5rem;   /* 280px */
    --size-sidebar-collapsed: 4rem; /* 64px */
    --size-bottom-nav: 3.5rem; /* 56px */
  }
}
```

### 8.2 Container Query Tokens

```css
/* === CONTAINER QUERIES (Modern alternative to media queries) === */
/* Dung cho components can responsive theo parent, khong theo viewport */

.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .habit-check-in {
    /* Switch tu stack → inline layout */
    flex-direction: row;
    gap: var(--space-4);
  }
}

@container card (min-width: 600px) {
  .daily-momentum {
    /* Switch tu 1 col → 2 col grid */
    grid-template-columns: 1fr 1fr;
  }
}
```

---

## 9. Z-Index Token System

```css
@layer primitives {
  :root {
    --z-base: 0;
    --z-dropdown: 10;
    --z-sticky: 20;
    --z-sidebar: 30;
    --z-overlay: 40;
    --z-modal: 50;
    --z-toast: 60;
    --z-celebration: 70;    /* Level-up above everything */
    --z-tooltip: 80;
    --z-max: 9999;
  }
}
```

---

## 10. Tailwind CSS v4 Implementation

### 10.1 CSS-First Configuration

Tailwind v4 su dung `@theme` directive thay vi `tailwind.config.js`. Tat ca tokens duoc define truc tiep trong CSS.

```css
/* === app/globals.css === */

@import "tailwindcss";

@theme {
  /* === COLORS (Map to OKLCH tokens) === */
  --color-void-0: oklch(0.05 0.02 280);
  --color-void-1: oklch(0.08 0.025 280);
  --color-void-2: oklch(0.11 0.03 280);
  --color-void-3: oklch(0.15 0.035 275);
  --color-void-4: oklch(0.20 0.04 270);
  --color-void-5: oklch(0.25 0.03 270);

  --color-neon-green: oklch(0.80 0.35 155);
  --color-neon-pink: oklch(0.65 0.35 350);
  --color-neon-cyan: oklch(0.80 0.25 210);
  --color-neon-purple: oklch(0.55 0.30 290);
  --color-neon-gold: oklch(0.80 0.22 85);

  /* === FONT FAMILIES === */
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --font-display: "Orbitron", "Inter", sans-serif;

  /* === FLUID FONT SIZES === */
  --text-xs: clamp(0.6875rem, 0.65rem + 0.1vw, 0.75rem);
  --text-sm: clamp(0.75rem, 0.7rem + 0.15vw, 0.875rem);
  --text-base: clamp(0.875rem, 0.82rem + 0.2vw, 1rem);
  --text-lg: clamp(1rem, 0.92rem + 0.3vw, 1.125rem);
  --text-xl: clamp(1.125rem, 1rem + 0.4vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.2rem + 0.8vw, 2rem);
  --text-3xl: clamp(2rem, 1.5rem + 1.5vw, 3rem);
  --text-timer: clamp(2.5rem, 2rem + 3vw, 6rem);

  /* === ANIMATIONS === */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-in-expo: cubic-bezier(0.7, 0, 0.84, 0);

  /* === RADIUS === */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;

  /* === BLUR === */
  --blur-xs: 4px;
  --blur-sm: 8px;
  --blur-md: 12px;
  --blur-lg: 20px;
  --blur-xl: 40px;
}

/* === SEMANTIC LAYER (CSS custom properties) === */
:root {
  color-scheme: dark;

  /* Surfaces */
  --color-surface-app: var(--color-void-1);
  --color-surface-card: var(--color-void-2);
  --color-surface-elevated: var(--color-void-3);

  /* Accents */
  --color-accent-xp: var(--color-neon-green);
  --color-accent-fire: var(--color-neon-pink);
  --color-accent-focus: var(--color-neon-cyan);
  --color-accent-celebrate: var(--color-neon-purple);
  --color-accent-milestone: var(--color-neon-gold);
}

/* === FOCUS MODE VARIANT === */
[data-mode="focus"] {
  --color-surface-app: var(--color-void-0);
  --color-accent-xp: var(--color-neon-cyan);
}
```

### 10.2 Utility Usage Examples

```html
<!-- XP Bar -->
<div class="h-2 rounded-full bg-void-3">
  <div class="h-full rounded-full bg-neon-green
              shadow-[0_0_16px_oklch(0.80_0.35_155/0.3)]
              transition-all duration-500 ease-out-back">
  </div>
</div>

<!-- Timer Digit -->
<span class="font-mono text-timer text-white
             [text-shadow:0_0_16px_oklch(0.80_0.25_210/0.4)]">
  25:00
</span>

<!-- Streak Fire Badge -->
<div class="inline-flex items-center gap-1.5 px-3 py-1
            rounded-full bg-neon-pink/10 text-neon-pink
            shadow-[0_0_16px_oklch(0.65_0.35_350/0.3)]">
  <FireIcon class="size-4" />
  <span class="font-mono font-bold text-sm">7</span>
</div>

<!-- Glass Card (Elevation 2) -->
<div class="rounded-xl bg-void-3/90
            border border-white/8
            backdrop-blur-md
            shadow-lg shadow-black/20">
  <!-- content -->
</div>

<!-- Level-Up Modal -->
<dialog class="rounded-2xl bg-void-3/95
               border border-white/12
               backdrop-blur-xl
               shadow-[0_0_40px_oklch(0.55_0.30_290/0.2)]
               animate-in fade-in zoom-in-95
               duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
</dialog>
```

---

## 11. color-mix() Dynamic Theming

CSS `color-mix()` cho phep tao shade/tint tu 1 accent color ma khong can define tung variant.

```css
:root {
  --accent: var(--neon-green-500);

  /* Tu dong generate states tu 1 accent */
  --accent-hover: color-mix(in oklch, var(--accent) 85%, white);
  --accent-active: color-mix(in oklch, var(--accent) 85%, black);
  --accent-muted: color-mix(in oklch, var(--accent) 20%, var(--void-2));
  --accent-ghost: color-mix(in oklch, var(--accent) 10%, transparent);
  --accent-glow: color-mix(in oklch, var(--accent) 40%, transparent);
}

/* User co the override accent → toan bo states tu update */
[data-accent="fire"] {
  --accent: var(--neon-pink-500);
}

[data-accent="focus"] {
  --accent: var(--neon-cyan-500);
}
```

---

## 12. @property Typed Tokens (Animation Enhancement)

`@property` cho phep animate CSS custom properties — dieu ma truoc day khong the.

```css
/* Cho phep animate glow intensity */
@property --glow-opacity {
  syntax: "<number>";
  initial-value: 0.3;
  inherits: false;
}

@property --xp-progress {
  syntax: "<percentage>";
  initial-value: 0%;
  inherits: false;
}

@property --hue-rotate {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

/* Bay gio co the animate token values truc tiep */
.xp-bar-fill {
  --xp-progress: 0%;
  background: var(--gradient-xp-fill);
  width: var(--xp-progress);
  transition: --xp-progress var(--duration-reward) var(--ease-out-back);
}

/* Celebration hue cycle */
.celebration-active {
  animation: hue-cycle 3s var(--ease-in-out-sine) infinite;
}

@keyframes hue-cycle {
  0% { --hue-rotate: 0deg; }
  100% { --hue-rotate: 360deg; }
}
```

---

## 13. So sanh v1 vs v2

| Tieu chi | v1 (Cu) | v2 (Moi) |
|----------|---------|----------|
| **Color space** | sRGB HEX only | OKLCH + P3 wide gamut + sRGB fallback |
| **Token layers** | Flat (1 layer) | 3 layers: Primitive → Semantic → Component |
| **Neon brightness** | Limited by sRGB gamut | 25-30% brighter on P3 displays |
| **Gradient quality** | Potential gray dead zones | Perceptually smooth (OKLCH interpolation) |
| **Glow system** | Hardcoded per component | Tokenized scale (radius, intensity, spread) |
| **Elevation** | Khong co | 5-level system (border + blur + glow) |
| **Motion** | Khong co | Full duration + easing + spring + scale tokens |
| **Typography** | Fixed px | Fluid `clamp()` tu mobile → desktop |
| **Theme switching** | Manual override | `data-mode` / `data-state` attribute switching |
| **Dynamic theming** | Khong co | `color-mix()` auto-generate states |
| **Animated tokens** | Khong co | `@property` typed CSS variables |
| **Reduced motion** | Khong co | Full reduced-motion overrides |
| **Tailwind version** | v3 config file | v4 CSS-first `@theme` |
| **Container queries** | Khong co | Supported cho responsive components |
| **Accessibility** | Basic contrast check | Focus ring tokens + glow a11y + motion a11y |

---

## 14. Migration Notes

**Tu v1 sang v2:**

1. **Colors:** Map HEX → OKLCH equivalents (da cung cap o tren)
2. **Tailwind config:** Migrate `tailwind.config.js` → `@theme` directive (Tailwind v4)
3. **Glow effects:** Replace hardcoded `box-shadow` → semantic glow tokens
4. **Animations:** Replace inline `transition` values → motion tokens
5. **Typography:** Replace fixed `text-*` → fluid `clamp()` values
6. **Theme:** Add `data-mode` attributes cho Focus Mode / Celebration states

**Breaking changes:**
- Tailwind v4 khong con dung `tailwind.config.js` — tat ca trong CSS
- OKLCH can fallback cho Safari < 15.4 (< 2% users, 2025)
- `@property` can fallback cho Firefox < 128 (released 2024, da support)

**Recommended migration order:**
1. Upgrade Tailwind v3 → v4
2. Add OKLCH color tokens voi sRGB fallback
3. Implement 3-layer token architecture
4. Add motion token system
5. Add glow/blur/elevation tokens
6. Add fluid typography
7. Add `@property` animations
8. Add container queries
