# Story 2.4: Feature Folder Structure & Indexes

Status: review

## Story

As a **developer**,
I want **project được tổ chức theo feature-based structure**,
So that **codebase dễ navigate và maintain khi scale**.

## Context

**Epic:** 2 — Foundation Setup
**Story ID:** 2.4
**Story Key:** 2-4-feature-folder-structure
**Dependencies:** Story 2.1 (Project Bootstrap)
**Preceding Story:** 2.3 (Dark Neon Theme) — same epic, same sprint
**Outputs to:** Epic 3 (Pomodoro), Epic 4 (Habits), Epic 5 (Navigation), Epic 6 (Gamification)
**Role:** Developer

---

## Acceptance Criteria

### AC-1: Pomodoro Feature Folder

**Given** project structure được tạo
**When** tôi xem file tree
**Then** có `src/features/pomodoro/` với đầy đủ files:

| File | Purpose |
|------|---------|
| `types.ts` | `TimerPhase`, `PomoStatus`, `TIMER_TO_STATUS` mapping, session types |
| `constants.ts` | Default durations (25/5/15 min), session labels, break cycle rules |
| `store.ts` | Zustand timer store — phase, timeLeft, isRunning, sessionCount, label |
| `queries.ts` | TanStack Query keys + fetch functions for pomodoro sessions |
| `actions.ts` | Server Action wrappers: startSession, updateSession, cancelSession |
| `utils.ts` | Timer math helpers: msToSeconds, secondsToMMSS, getTodayStats |

### AC-2: Habits Feature Folder

**Given** project structure được tạo
**When** tôi xem file tree
**Then** có `src/features/habits/` với đầy đủ files:

| File | Purpose |
|------|---------|
| `types.ts` | `HabitDefinition`, `HabitEntry`, `HabitFrequency`, streak types |
| `constants.ts` | Max habit name length, color palette, streak thresholds |
| `store.ts` | Zustand habits store — today's habits, selectedHabit, optimistic updates |
| `queries.ts` | TanStack Query keys + fetch functions for habits and entries |
| `actions.ts` | Server Action wrappers: createHabit, checkInHabit, undoCheckIn, archiveHabit |
| `utils.ts` | Streak calculation, frequency check (isHabitDueToday), progress % |

### AC-3: Gamification Feature Folder

**Given** project structure được tạo
**When** tôi xem file tree
**Then** có `src/features/gamification/` với đầy đủ files:

| File | Purpose |
|------|---------|
| `types.ts` | `XpTransaction`, `XpSourceType`, `Level`, `LevelTitle` |
| `constants.ts` | `XP_PER_POMODORO` (+50), `XP_PER_HABIT` (+10), level thresholds |
| `store.ts` | Zustand XP store — totalXp, currentLevel, levelTitle, recentTransactions |
| `queries.ts` | TanStack Query keys + fetch functions for XP, levels |
| `actions.ts` | Server Action wrapper: `grantXp(sourceType, sourceRefId, amount)` |
| `utils.ts` | `calculateLevel(xp)`, `getXpForNextLevel(level)`, `formatXp(xp)` |

### AC-4: Auth Feature Folder

**Given** project structure được tạo
**When** tôi xem file tree
**Then** có `src/features/auth/` với đầy đủ files:

| File | Purpose |
|------|---------|
| `types.ts` | Auth user type, session type, OAuth provider type |
| `constants.ts` | Auth-related constants (session expiry, cookie names) |
| `queries.ts` | TanStack Query keys + fetch functions for current user, profile |
| `actions.ts` | Server Action wrappers: signUp, signIn, signOut, resetPassword |
| `utils.ts` | Auth helpers: getSession, isAuthenticated, getUserDisplayName |

### AC-5: Feature Components

**Given** project structure được tạo
**When** tôi xem file tree
**Then** có `src/components/features/` với placeholder stub components:

```
src/components/features/
├── xp-bar.tsx           # XP bar component (stub — filled in Epic 6)
├── focus-timer.tsx      # Timer display component (stub — filled in Epic 3)
├── streak-badge.tsx     # Streak display component (stub — filled in Epic 4)
├── habit-card.tsx       # Individual habit card (stub — filled in Epic 4)
├── session-label.tsx    # Label picker chip (stub — filled in Epic 3)
└── level-up-modal.tsx   # Celebration modal (stub — filled in Epic 6)
```

Each stub: named export, renders a `div` with component name as class, has a comment `// TODO: implement in Epic X`

### AC-6: Layout Components

**Given** project structure được tạo
**When** tôi xem file tree
**Then** có `src/components/layout/` với stub components:

```
src/components/layout/
├── sidebar.tsx          # Desktop sidebar (stub — filled in Epic 5)
├── bottom-nav.tsx       # Mobile bottom nav (stub — filled in Epic 5)
└── focus-mode-shell.tsx # Focus Mode wrapper (stub — filled in Epic 5)
```

### AC-7: Lib / i18n Folder

**Given** project structure được tạo
**When** tôi xem file tree
**Then** có `src/lib/i18n/` với structure:

```
src/lib/i18n/
├── index.ts             # next-intl configuration
├── request.ts           # Server request config
├── i18n.config.ts       # Supported locales: ['vi', 'en']
└── messages/
    ├── vi.json          # Vietnamese translations
    └── en.json          # English translations
```

Each `messages/*.json` chỉ chứa empty `{}` ở giai đoạn này — filled in Epic 7.

### AC-8: Existing Files Preserved

**Given** Story 2.4 được implement
**When** các files mới được tạo
**Then** tất cả existing files trong `src/features/*/types.ts` giữ nguyên không thay đổi

---

## Technical Requirements

### Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Feature modules | kebab-case folder, kebab-case files | `features/pomodoro/`, `actions.ts` |
| Components | PascalCase.tsx | `XpBar.tsx`, `FocusTimer.tsx` |
| Store exports | `useXxxStore` | `useTimerStore`, `useHabitsStore` |
| Query keys | camelCase object | `pomodoroKeys`, `habitsKeys` |
| Constants | SCREAMING_SNAKE_CASE | `XP_PER_POMODORO`, `MAX_HABIT_NAME` |

### Zustand Store Template

```typescript
// src/features/[feature]/store.ts
import { create } from 'zustand'

type [Feature]State = {
  // state fields
}

type [Feature]Store = [Feature]State & {
  // actions
}

export const use[Feature]Store = create<[Feature]Store>((set, get) => ({
  // initial state
  ...initialState,
  // actions
}))
```

### TanStack Query Keys Template

```typescript
// src/features/[feature]/queries.ts
export const [feature]Keys = {
  all: ['[feature]'] as const,
  sessions: () => [...[feature]Keys.all, 'sessions'] as const,
} as const
```

### DO NOT

- ❌ Không viết business logic trong store — chỉ UI state, gọi actions.ts cho mutations
- ❌ Không fetch trực tiếp trong components — dùng TanStack Query hooks
- ❌ Không dùng `use client` trong feature module files — chỉ trong React hooks
- ❌ Không tạo `.tsx` components trong `src/features/` — chỉ `.ts` files

### Code Quality

- All files: strict TypeScript (no `any`)
- JSDoc comments on all exported functions
- Barrel exports from `index.ts` in each feature folder (if needed)

---

## Dev Notes

### Current State

- `src/features/` tồn tại với 4 subfolders: `auth/`, `pomodoro/`, `habits/`, `gamification/`
- Mỗi folder hiện chỉ có `types.ts` (tạo từ Story 2.2 — shared types)
- **Cần thêm:** `constants.ts`, `store.ts`, `queries.ts`, `actions.ts`, `utils.ts` cho mỗi feature
- `src/components/features/` và `src/components/layout/` chưa tồn tại
- `src/lib/i18n/` chưa tồn tại

### File Creation Order

1. Tạo `src/lib/i18n/` structure (foundation for i18n Epic 7)
2. Tạo `src/features/*/constants.ts` (shared values)
3. Tạo `src/features/*/utils.ts` (pure functions)
4. Tạo `src/features/*/store.ts` (Zustand)
5. Tạo `src/features/*/queries.ts` (TanStack Query keys + fetch stubs)
6. Tạo `src/features/*/actions.ts` (Server Action stubs)
7. Tạo `src/components/features/` stubs
8. Tạo `src/components/layout/` stubs

### References

- Architecture: `_bmad-output/planning-artifacts/architecture.md` — Feature-based folder rationale
- UX: `_bmad-output/planning-artifacts/ux-design-specification.md` — Component inventory
- DB Schema (types source): `_bmad-output/implementation-artifacts/2-2-database-schema.md`
- Project context: `src/CLAUDE.md` — Naming conventions, patterns
- Epics source: `_bmad-output/planning-artifacts/epics.md#Story 2.4`

---

## Tasks / Subtasks

- [x] Task 1: Create `src/lib/i18n/` structure (AC-7)
  - [x] Subtask 1.1: Create `src/lib/i18n/index.ts`
  - [x] Subtask 1.2: Create `src/lib/i18n/request.ts`
  - [x] Subtask 1.3: Create `src/lib/i18n/i18n.config.ts`
  - [x] Subtask 1.4: Create `src/lib/i18n/messages/vi.json` (empty)
  - [x] Subtask 1.5: Create `src/lib/i18n/messages/en.json` (empty)
- [x] Task 2: Complete `src/features/pomodoro/` (AC-1)
  - [x] Subtask 2.1: Create `src/features/pomodoro/constants.ts`
  - [x] Subtask 2.2: Create `src/features/pomodoro/utils.ts`
  - [x] Subtask 2.3: Create `src/features/pomodoro/store.ts`
  - [x] Subtask 2.4: Create `src/features/pomodoro/queries.ts`
  - [x] Subtask 2.5: Create `src/features/pomodoro/actions.ts`
- [x] Task 3: Complete `src/features/habits/` (AC-2)
  - [x] Subtask 3.1: Create `src/features/habits/constants.ts`
  - [x] Subtask 3.2: Create `src/features/habits/utils.ts`
  - [x] Subtask 3.3: Create `src/features/habits/store.ts`
  - [x] Subtask 3.4: Create `src/features/habits/queries.ts`
  - [x] Subtask 3.5: Create `src/features/habits/actions.ts`
- [x] Task 4: Complete `src/features/gamification/` (AC-3)
  - [x] Subtask 4.1: Create `src/features/gamification/constants.ts`
  - [x] Subtask 4.2: Create `src/features/gamification/utils.ts`
  - [x] Subtask 4.3: Create `src/features/gamification/store.ts`
  - [x] Subtask 4.4: Create `src/features/gamification/queries.ts`
  - [x] Subtask 4.5: Create `src/features/gamification/actions.ts`
- [x] Task 5: Complete `src/features/auth/` (AC-4)
  - [x] Subtask 5.1: Create `src/features/auth/constants.ts`
  - [x] Subtask 5.2: Create `src/features/auth/utils.ts`
  - [x] Subtask 5.3: Create `src/features/auth/queries.ts`
  - [x] Subtask 5.4: Create `src/features/auth/actions.ts`
- [x] Task 6: Create `src/components/features/` stubs (AC-5)
- [x] Task 7: Create `src/components/layout/` stubs (AC-6)
- [x] Task 8: Verify all imports work (TypeScript compile check)
  - [x] Subtask 8.1: Run `pnpm typecheck` — zero errors
  - [x] Subtask 8.2: Verify no existing `types.ts` files were modified

---

## Dev Agent Record

### Agent Model Used

claude-opus-4-5

### Debug Log References

- Resolved: `zustand` and `next-intl` packages were missing from package.json — installed via `pnpm add zustand next-intl`
- Resolved: next-intl v4 `getRequestConfig` signature uses `requestLocale: Promise<string | undefined>` (not `request`); locale can be undefined so used `?? defaultLocale`
- Resolved: `SHORT_BREAK_DURATION_DEFAULT`, `LONG_BREAK_DURATION_DEFAULT` imported but unused in pomodoro/store.ts — removed from import
- Resolved: `HabitFrequency` imported but unused in habits/utils.ts — removed from import
- Resolved: `locales` imported but unused in i18n/request.ts — removed from import

### Completion Notes List

- Created 30 new files across 5 feature modules + i18n + component stubs
- Installed `zustand` (v5.0.12) and `next-intl` (v4.8.4) as required dependencies
- All 4 feature modules (pomodoro, habits, gamification, auth) now have: constants.ts, utils.ts, store.ts, queries.ts, actions.ts
- i18n folder created with next-intl v4 configuration (index.ts, request.ts, i18n.config.ts, messages/vi.json, messages/en.json)
- 6 feature component stubs in `src/components/features/`
- 3 layout component stubs in `src/components/layout/`
- TypeScript: zero errors (`npx tsc --noEmit` clean)
- ESLint: zero errors in new files
- AC-8 verified: existing `types.ts` files in all 4 feature folders were not modified

### File List

```
src/features/pomodoro/constants.ts
src/features/pomodoro/utils.ts
src/features/pomodoro/store.ts
src/features/pomodoro/queries.ts
src/features/pomodoro/actions.ts
src/features/habits/constants.ts
src/features/habits/utils.ts
src/features/habits/store.ts
src/features/habits/queries.ts
src/features/habits/actions.ts
src/features/gamification/constants.ts
src/features/gamification/utils.ts
src/features/gamification/store.ts
src/features/gamification/queries.ts
src/features/gamification/actions.ts
src/features/auth/constants.ts
src/features/auth/utils.ts
src/features/auth/queries.ts
src/features/auth/actions.ts
src/lib/i18n/index.ts
src/lib/i18n/request.ts
src/lib/i18n/i18n.config.ts
src/lib/i18n/messages/vi.json
src/lib/i18n/messages/en.json
src/components/features/xp-bar.tsx
src/components/features/focus-timer.tsx
src/components/features/streak-badge.tsx
src/components/features/habit-card.tsx
src/components/features/session-label.tsx
src/components/features/level-up-modal.tsx
src/components/layout/sidebar.tsx
src/components/layout/bottom-nav.tsx
src/components/layout/focus-mode-shell.tsx
```

---

## Change Log

- 2026-04-01: Created full feature folder structure — 30 files across pomodoro, habits, gamification, auth, i18n, and component stubs. Installed zustand and next-intl dependencies. TypeScript and ESLint pass clean.
- 2026-04-01: Story status updated to "review" — all ACs satisfied, all tasks/subtasks complete.
