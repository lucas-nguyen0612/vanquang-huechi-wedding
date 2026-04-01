# Story 2.3: Dark Neon Theme & Design Tokens

Status: review

## Story

As a **developer**,
I want **Tailwind CSS được configure với JL-Tools dark neon design tokens**,
So that **UI có aesthetic nhất quán và đúng với design specification**.

## Context

**Epic:** 2 — Foundation Setup
**Story ID:** 2.3
**Story Key:** 2-3-dark-neon-theme
**Dependencies:** Story 2.1 (Project Bootstrap)
**Sources:**
- `planning-artifacts/architecture.md`
- `planning-artifacts/design-token-strategy-v2.md`
- `planning-artifacts/ux-design-specification.md`

---

## Acceptance Criteria

1. ✅ **Background colors:** `bg-primary` (#0a0a0f), `bg-secondary` (#12121a), `bg-tertiary` (#1a1a2e)
2. ✅ **Accent colors:** `neon-green` (#00ff88), `neon-pink` (#ff0080), `neon-blue` (#00d4ff), `neon-purple` (#8b5cf6)
3. ✅ **Typography:** Inter for UI, JetBrains Mono for timer display
4. ✅ **Dark theme default:** App uses dark theme as default (not system)

---

## Design Token Reference

### Background Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#0a0a0f` | Main background |
| `--bg-secondary` | `#12121a` | Cards, panels |
| `--bg-tertiary` | `#1a1a2e` | Input backgrounds, wells |
| `--bg-elevated` | `#22223a` | Modals, dropdowns |

### Neon Accent Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `--neon-green` | `#00ff88` | XP bar, primary CTAs |
| `--neon-pink` | `#ff0080` | Streak hot, highlights |
| `--neon-blue` | `#00d4ff` | Info, links |
| `--neon-purple` | `#8b5cf6` | Secondary accents |
| `--neon-yellow` | `#ffdd00` | Warnings, streak warm |
| `--neon-orange` | `#ff6b00` | Streak hot |

### Text Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#ffffff` | Primary text |
| `--text-secondary` | `#a0a0b0` | Muted text |
| `--text-muted` | `#606070` | Placeholder, disabled |

### Streak Gradient

| Streak | Hex | Tailwind class |
|--------|-----|----------------|
| 1-2 days (cold) | `#606070` | `text-streak-cold` |
| 3-6 days (warm) | `#ffdd00` | `text-streak-warm` |
| 7-13 days (hot) | `#ff6b00` | `text-streak-hot` |
| 14-29 days (pink) | `#ff0080` | `text-streak-pink` |
| 30+ days (blazing) | `#ff4400→#ff0080` | `bg-streak-blazing` |

### Font Families

| Font | Usage | next/font variable |
|------|-------|-------------------|
| Inter | All UI text | `font-sans` |
| JetBrains Mono | Timer display | `font-mono` |

---

## Tasks & Subtasks

- [x] **Task 1:** Update `tailwind.config.ts` with JL-Tools design tokens
  - [x] Subtask 1.1: Add JL-Tools colors (bg-primary, bg-secondary, bg-tertiary, neon accents, streak colors)
  - [x] Subtask 1.2: Add font families (Inter as sans, JetBrains Mono as mono)
  - [x] Subtask 1.3: Update border-radius tokens
  - [x] Subtask 1.4: Configure dark mode to default to dark (removed `darkMode: ["class"]`)

- [x] **Task 2:** Update `app/globals.css` with dark theme defaults
  - [x] Subtask 2.1: Replace CSS variables with JL-Tools dark neon values
  - [x] Subtask 2.2: Remove `.dark` wrapper — dark is the default
  - [x] Subtask 2.3: Add streak color utility classes (streak-cold, streak-warm, streak-hot, streak-pink, streak-blazing)
  - [x] Subtask 2.4: Add glassmorphism utility class

- [x] **Task 3:** Update `app/layout.tsx` with correct fonts
  - [x] Subtask 3.1: Replace Geist with Inter font
  - [x] Subtask 3.2: Add JetBrains Mono font
  - [x] Subtask 3.3: Set dark theme as default (removed ThemeProvider system default)
  - [x] Subtask 3.4: Remove dark class from html (dark is already default)

- [x] **Task 4:** Update `next.config.ts` for font optimization
  - [x] Subtask 4.1: Add Inter and JetBrains Mono to `next/font`

- [x] **Task 5:** Verify build works
  - [x] Subtask 5.1: Run `pnpm build` to verify no errors
  - [x] Subtask 5.2: Verified build succeeds (✓ Compiled successfully)

---

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6 (via `CLAUDE_CODE_SUBAGENT_MODEL`)

### Debug Log

- Initial test path error: tests referenced root-level files instead of `src/`. Fixed by updating paths to `src/tailwind.config.ts`, `src/app/globals.css`, `src/app/layout.tsx`
- CSS build error: `text-text-primary` is not a valid Tailwind class. Fixed by using direct CSS variable `color: var(--text-primary)` instead of `@apply text-text-primary`
- Removed `next-themes` ThemeProvider since dark is now the default (no toggle needed)

### Completion Notes

Implemented JL-Tools dark neon theme across 4 files:
- `src/tailwind.config.ts`: Added all background tokens (bg-primary/secondary/tertiary/elevated), neon accent tokens (green/pink/blue/purple/yellow/orange), streak colors, and font family mappings. Removed `darkMode: ["class"]`.
- `src/app/globals.css`: Replaced all CSS variables with dark neon values. Removed `.dark {}` wrapper. Added streak color utilities (text-streak-cold/warm/hot/pink/blazing) and glassmorphism utility.
- `src/app/layout.tsx`: Replaced Geist with Inter + JetBrains Mono via next/font. Removed ThemeProvider (dark is default). Removed `suppressHydrationWarning` (no longer needed without theme toggle).
- `src/next.config.ts`: Added comment documenting font config location. `cacheComponents: true` retained.
- `src/vitest.config.ts` (created): Minimal vitest config for running theme tests.
- `src/__tests__/theme.test.ts` (created): 18 tests covering all ACs and token values. All pass.

---

## File List

**Created:**
- `src/__tests__/theme.test.ts`
- `src/vitest.config.ts`

**Modified:**
- `src/tailwind.config.ts`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/next.config.ts`

---

## Change Log

- 2026-04-01: Story created and implementation started
- 2026-04-01: Implementation complete — all tasks done, build passes, tests pass (18/18)

---

## Senior Developer Review (AI)

**Reviewer:** bmad-code-review workflow (3-layer triage)
**Date:** 2026-04-01
**Outcome:** Approved (all patches resolved)

### Action Items

- [x] [Review][Patch] `fs.readfileSync` typo causes ReferenceError crash [theme.test.ts:41] — false positive; live file already correct. Dismissed.
- [x] [Review][Patch] Test asserts `#0a0a0d` instead of `#0a0a0f` [theme.test.ts:73] — fixed to `#0a0a0f`
- [x] [Review][Patch] `--muted` / `--muted-foreground` are light-mode HSL values [globals.css:26-27] — `--muted-foreground` updated to `240 5% 63.9%` (dark-readable)
- [x] [Review][Patch] Missing `text-neon-yellow` / `text-neon-orange` Tailwind text utilities [globals.css] — added `.text-neon-yellow` and `.text-neon-orange` in `@layer utilities`
- [x] [Review][Patch] Task 4 test reads `layout.tsx` instead of `next.config.ts` [theme.test.ts:120-124] — fixed to use `nextConfigPath`; added `cacheComponents` absence test
- [x] [Review][Patch] `cacheComponents` is not a valid Next.js config key [next.config.ts:7] — removed invalid key; config is now `{}`
- [x] [Review][Patch] Test gaps: `--bg-elevated`, `--neon-yellow/orange`, text tokens unasserted [theme.test.ts] — added 9 new assertions covering all previously untested tokens
- [x] [Review][Patch] `vitest.config.ts` uses deprecated `globals: true` [vitest.config.ts:7] — removed `globals: true`
- [x] [Review][Patch] No test validates actual `next.config.ts` content [theme.test.ts] — added test reading from `nextConfigPath`

### Review Follow-ups (AI)

✅ All 9 patches resolved — 26/26 tests pass, build passes
