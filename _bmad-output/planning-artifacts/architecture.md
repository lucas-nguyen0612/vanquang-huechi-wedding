---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-03-30'
inputDocuments:
  - product-brief-bmad-test-2026-03-30.md
  - prd.md
  - prd-validation-report.md
  - ux-design-specification.md
workflowType: 'architecture'
project_name: 'bmad-test'
user_name: 'Lucas'
date: '2026-03-30'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

60 FRs tổ chức thành 8 nhóm kiến trúc:

| Nhóm | FRs | Architectural Implication |
|------|-----|--------------------------|
| User Management & Auth | FR1-8 | Auth flow, profile creation trigger, data isolation (RLS) |
| Pomodoro Focus Sessions | FR9-19 | Client-side timer state machine, session persistence, offline operation, Focus Mode UI state |
| Habit Tracking | FR20-31 | CRUD operations, streak calculation logic, frequency scheduling, ordering/sorting |
| Gamification & Progression | FR32-40 | Cross-tool XP aggregation, level threshold detection, XP transaction log, deduplication |
| Dashboard & Statistics | FR41-45 | Data aggregation queries, daily/weekly rollups, XP history |
| Platform Navigation & Layout | FR46-50 | Responsive layout system, sidebar state, Focus Mode toggle |
| Internationalization | FR51-55 | i18n framework (vi/en), locale persistence, content translation |
| Data Integrity & Sync | FR56-60 | Offline queue, auto-sync, optimistic UI, duplicate prevention |

**Non-Functional Requirements:**

31 NFRs driving architectural decisions:

| Category | Key NFRs | Architecture Impact |
|----------|----------|-------------------|
| Performance | FCP < 1.5s, TTI < 3s, Timer < 100ms, XP < 500ms, Bundle < 200KB | Code splitting, lazy loading, client-side timer, optimistic updates |
| Security | JWT httpOnly, RLS all tables, HTTPS, input sanitization, rate limit 100req/min | Supabase RLS policies, CSP headers, server-side validation |
| Scalability | 50 concurrent MVP, stateless, < 100MB DB/3months | Stateless architecture, efficient schema design |
| Accessibility | WCAG 2.1 AA (contrast, keyboard, screen reader, focus, motion, touch 44px) | Semantic HTML, aria-live for timer, prefers-reduced-motion |
| Reliability | 99.5% uptime, timer network-independent, zero data loss, tab handling | Client-side timer engine, local persistence queue, visibility API |

**Scale & Complexity:**

- Primary domain: Full-stack Web Application (SPA)
- Complexity level: Medium
- Estimated architectural components: 8 major (Auth, Timer Engine, Habit Manager, XP Engine, Stats Aggregator, Navigation System, i18n Layer, Sync Manager)

### Technical Constraints & Dependencies

- **Solo developer:** Architecture phải optimize cho developer velocity — convention over configuration
- **Free tier targets:** Supabase Free (500MB DB, 50K auth), Vercel Free — architecture phải efficient trong resource usage
- **Greenfield:** Không legacy constraints, tự do lựa chọn patterns
- **MVP timeline 5-6 sprints:** Architecture phải pragmatic, không over-engineer
- **Modular expansion:** Architecture phải hỗ trợ thêm tools mới (Task Manager, Journal) ở Phase 4 mà không refactor core

### Cross-Cutting Concerns Identified

1. **Authentication & Authorization:** RLS enforcement across all data tables — mọi query đều filter by user_id
2. **Unified XP System:** Cross-tool XP aggregation — cần centralized XP engine với transaction integrity
3. **Internationalization (i18n):** vi/en across toàn bộ UI + level titles + dynamic content
4. **Offline Resilience:** Timer 100% client-side, session/check-in queue khi offline, auto-sync on reconnect
5. **Responsive Design:** 3 breakpoints (375px/768px/1024px) với layout shifts (bottom nav ↔ sidebar)
6. **Performance Budget:** Bundle < 200KB, FCP < 1.5s — ảnh hưởng dependency choices và code splitting
7. **Accessibility (WCAG 2.1 AA):** aria-live cho timer, keyboard navigation, contrast ratios, reduced motion
8. **State Management:** Timer state (local) vs server state (sessions, habits) vs UI state (Focus Mode, sidebar) — cần clear separation

## Starter Template Evaluation

### Primary Technology Domain

Full-stack Web Application (SPA) — Next.js + Supabase, dựa trên project requirements analysis.

### Starter Options Considered

| Option | Starter | Đánh giá |
|--------|---------|----------|
| 1 | `create-next-app -e with-supabase` | **Selected** — Auth pre-wired (cookie-based SSR), shadcn/ui, Tailwind, TypeScript |
| 2 | `create-turbo@latest` + manual setup | Rejected — Monorepo overhead không justified cho MVP single-app (conscious deferral to Phase 4) |
| 3 | `create-next-app --yes` + manual | Viable nhưng auth setup thủ công = security risk, debug cost cao |

### Selected Starter: Next.js with Supabase Template

**Rationale for Selection:**

- Supabase cookie-based auth (supabase-ssr) là phần phức tạp nhất — template đã pre-wire middleware, cookie refresh, SSR client. Manual setup = 4-5 files dễ sai, khó debug
- shadcn/ui pre-configured — sẵn sàng thêm components
- TypeScript + Tailwind CSS + App Router — đúng stack PRD yêu cầu
- Solo developer MVP — maximize velocity, auth đúng > latest version

**Initialization Command:**

```bash
npx create-next-app -e with-supabase src
```

⚠️ **Post-init verification:** Kiểm tra Next.js version trong template. Nếu < 16, evaluate upgrade path.

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript với strict mode
- Next.js App Router (React Server Components + Client Components)
- Node.js 20.9+ runtime

**Styling Solution:**
- Tailwind CSS utility-first
- shadcn/ui component library (copy-paste, fully owned, Radix primitives)
- CSS variables cho theming

**Build Tooling:**
- Turbopack (default dev bundler Next.js 16) hoặc Webpack (Next.js 15)
- Next.js build pipeline cho production
- ESLint cho linting

**Authentication:**
- Supabase Auth với cookie-based sessions (supabase-ssr)
- Middleware cho token refresh
- SSR-compatible client setup
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

**Testing Framework:**
- Chưa có — cần thêm Vitest + React Testing Library (Story 1)

**Code Organization (post-restructure):**
- `app/` — Routes và pages (App Router)
- `components/ui/` — shadcn/ui base components
- `components/features/` — Feature-specific components (XpBar, StreakBadge, FocusTimer, HabitCheckIn)
- `components/layout/` — Sidebar, nav, Focus Mode shell
- `features/` — Feature modules (pomodoro, habits, gamification)
- `lib/` — Utility functions, Supabase client
- `@/*` import alias

**Development Experience:**
- Hot reload via Turbopack/Webpack
- TypeScript type checking
- Supabase local development support
- AGENTS.md cho AI coding agents

### Turborepo Decision Record

**Decision:** Defer Turborepo to Phase 4 (conscious decision, not oversight)

**Rationale:**
- MVP có 1 deployable app duy nhất — không có multiple apps sharing code
- Solo developer — không cần parallel builds, workspace isolation
- Modular architecture đạt được bằng folder structure (`/features/*`)
- Turborepo overhead (turbo.json, workspace configs, package resolution) không justified

**Reassess trigger:** Khi thêm app thứ 2 (Task Manager, Phase 4) → extract shared packages → wrap Turborepo

### Post-Init Implementation Strategy

**Story 0 — Project Bootstrap (first sprint):**
1. Init project với `create-next-app -e with-supabase`
2. Verify auth flow works (signup/login/logout)
3. Verify Next.js version, upgrade if needed
4. Restructure `components/` → `ui/`, `features/`, `layout/`
5. Deploy skeleton to Vercel + connect Supabase
6. Validate full pipeline: dev → build → deploy → auth works on production

**Story 1 — Foundation Setup:**
1. Add next-intl cho i18n (vi/en với `[locale]` routing)
2. Configure dark neon theme tokens (Tailwind config theo UX Design Specification)
3. Add Vitest + @testing-library/react
4. Create feature folder structure (`/features/pomodoro`, `/features/habits`, `/features/gamification`)

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Data access pattern (Server Actions + Supabase Client)
- State management strategy (Zustand + TanStack Query)
- Timer engine architecture (timestamp-based)
- XP deduplication (unique constraint + app logic)
- Database schema strategy (single schema, prefix naming)

**Important Decisions (Shape Architecture):**
- Data validation (Zod)
- Form handling (React Hook Form + Zod)
- CI/CD pipeline (Vercel + GitHub Actions)

**Deferred Decisions (Post-MVP):**
- Sentry error tracking (thêm khi user base > 100)
- Multi-schema migration (reassess Phase 4)
- Advanced caching layers (CDN, edge caching)

### Data Architecture

**Data Access Pattern:**
- **Decision:** Hybrid — Server Actions cho mutations + Supabase Client direct cho reads
- **Rationale:** Server Actions đảm bảo validation server-side cho mutations (create session, check-in habit, grant XP). Supabase Client direct cho reads giảm latency, RLS đã protect data isolation
- **Affects:** Toàn bộ data flow — FR9-19 (Pomodoro), FR20-31 (Habits), FR32-40 (Gamification)

**Server State Management:**
- **Decision:** TanStack Query (React Query)
- **Rationale:** Optimistic updates cho habit check-in và XP grant (NFR5: < 500ms feedback). Mutation management, devtools, stale-while-revalidate. Bundle ~13KB justified bởi UX requirements
- **Affects:** FR25 (check-in), FR32-33 (XP grant), FR39 (XP animation), FR56 (offline sync)

**Client State Management:**
- **Decision:** Zustand cho timer + Focus Mode state, React Context cho auth/locale
- **Rationale:** Timer state cập nhật mỗi giây — Zustand tránh re-render toàn bộ component tree. Auth/locale ít thay đổi → Context đủ
- **Affects:** FR11 (timer countdown), FR17 (Focus Mode), FR51-52 (locale)

**Data Validation:**
- **Decision:** Zod
- **Rationale:** TypeScript-first schema validation, works natively với Server Actions và React Hook Form. Supabase types generation compatible
- **Affects:** Toàn bộ input validation — FR20-23 (habit CRUD), FR10 (timer settings), FR5 (profile edit)

**Database Schema Strategy:**
- **Decision:** Single schema với table naming prefix convention
- **Rationale:** MVP solo developer — multi-schema thêm complexity (RLS policies per schema, migration management) mà chưa cần. Prefix naming đủ tổ chức module boundaries
- **Convention:** `pomo_sessions`, `pomo_settings`, `habit_definitions`, `habit_entries`, `gam_xp_transactions`, `gam_levels`
- **Reassess:** Phase 4 khi thêm tools mới → evaluate multi-schema migration
- **Affects:** Toàn bộ database layer

### Authentication & Security

**Provided by Starter:**
- Supabase Auth (cookie-based, supabase-ssr)
- JWT httpOnly cookies
- Middleware token refresh
- SSR-compatible client

**XP Deduplication Strategy:**
- **Decision:** Unique constraint `xp_transactions(source_type, source_ref_id)` + application-level check
- **Rationale:** DB constraint là safety net chống race condition. Application logic là primary check cho UX feedback. Không cần full DB trigger cho MVP scope
- **Affects:** FR34 (XP transaction log), FR57 (no duplicate XP)

**RLS Policy Pattern:**
- **Decision:** `auth.uid() = user_id` trên mọi table, applied via Supabase RLS
- **Rationale:** Database-level enforcement — zero trust application layer cho data isolation (NFR10)
- **Affects:** FR8 (data isolation), toàn bộ data access

### API & Communication Patterns

**Primary Pattern:**
- **Decision:** No separate API layer — Server Actions (mutations) + Supabase Client (reads)
- **Rationale:** Supabase RLS eliminates cần cho API authorization layer riêng. Server Actions cung cấp type-safe mutations. Không có external API consumers trong MVP
- **Affects:** Toàn bộ client-server communication

**Error Handling Standard:**
- **Decision:** Centralized error boundary + Server Action error returns + TanStack Query error states
- **Pattern:** Server Actions return `{ data, error }` pattern. Client hiển thị toast notification cho errors. Error boundary cho unexpected crashes
- **Affects:** NFR30 (graceful degradation)

### Frontend Architecture

**Timer Engine:**
- **Decision:** Timestamp-based approach
- **Implementation:** Lưu `startTime` + `duration` trong Zustand store. Display update bằng `setInterval(1000ms)`. `visibilitychange` event recalculate khi tab focus lại. Remaining = `duration - (Date.now() - startTime - totalPausedTime)`
- **Rationale:** Chính xác (NFR3: drift < 1s/25min), handles tab switch (NFR31), đơn giản hơn Web Worker. Không cần requestAnimationFrame vì Pomodoro chỉ cần precision đến giây
- **Affects:** FR11 (timer accuracy), FR12 (pause/resume), FR18 (network independence), NFR28 (timer reliability)

**Form Handling:**
- **Decision:** React Hook Form + Zod resolver
- **Rationale:** Consistent validation pipeline: Zod schema → React Hook Form (client) → Server Action (server). Uncontrolled inputs = better performance
- **Affects:** FR20-23 (habit CRUD), FR10 (timer settings), FR5 (profile edit)

**Code Splitting Strategy:**
- **Decision:** Next.js App Router automatic code splitting + dynamic imports cho heavy components
- **Pattern:** Route-based splitting (automatic), `dynamic(() => import())` cho LevelUpModal, celebration animations
- **Rationale:** Bundle < 200KB gzipped (NFR8). Route splitting handles 80%, dynamic imports cho remaining heavy UI
- **Affects:** NFR1 (FCP < 1.5s), NFR2 (TTI < 3s), NFR8 (bundle size)

### Infrastructure & Deployment

**Hosting:**
- **Decision:** Vercel (frontend) + Supabase (database + auth) — cả hai free tier
- **Rationale:** Zero cost MVP, auto-scaling, edge network. Supabase Free: 500MB DB, 50K auth users. Vercel Free: 100GB bandwidth
- **Affects:** NFR17 (50 concurrent), NFR27 (99.5% uptime)

**CI/CD Pipeline:**
- **Decision:** Vercel auto-deploy + GitHub Actions test gate
- **Pipeline:** Push → GitHub Actions (lint + test) → Vercel Preview Deploy → Merge to main → Vercel Production Deploy
- **Rationale:** Vercel handles build/deploy automatically. GitHub Actions chỉ chạy lint + test trước merge
- **Affects:** Development workflow, deployment reliability

**Monitoring & Error Tracking:**
- **Decision:** Vercel Analytics + Supabase Dashboard cho MVP
- **Rationale:** Built-in, free, zero setup. Đủ cho 500 users MVP. Sentry deferred khi user base > 100
- **Affects:** NFR27 (uptime monitoring), business KPIs tracking

### Decision Impact Analysis

**Implementation Sequence:**
1. Database schema + RLS policies (foundation)
2. Auth flow verification (starter provides)
3. Zustand stores (timer state, Focus Mode state)
4. TanStack Query setup + Supabase client helpers
5. Server Actions cho mutations
6. Zod schemas + React Hook Form integration
7. Timer engine implementation
8. XP transaction system + deduplication
9. CI/CD pipeline (GitHub Actions)

**Cross-Component Dependencies:**
- Timer Engine → Zustand (state) → Server Actions (persist session) → TanStack Query (optimistic XP update)
- Habit Check-in → Server Actions (validate + persist) → TanStack Query (optimistic UI) → XP Engine (grant XP)
- XP Engine → Unique constraint (dedup) → TanStack Query (invalidate queries) → Zustand (trigger level-up UI)

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 28 areas where AI agents could make different choices, organized into 5 categories.

### Naming Patterns

**Database Naming Conventions:**
- Tables: `snake_case`, plural, prefixed by module → `pomo_sessions`, `habit_definitions`, `gam_xp_transactions`
- Columns: `snake_case` → `user_id`, `created_at`, `current_streak`, `is_archived`
- Foreign keys: `{referenced_table_singular}_id` → `user_id`, `habit_definition_id`
- Indexes: `idx_{table}_{columns}` → `idx_pomo_sessions_user_id`, `idx_habit_entries_date`
- Constraints: `uq_{table}_{columns}` → `uq_gam_xp_transactions_source`
- Enums: `snake_case` → `session_status`: `active`, `paused`, `completed`, `cancelled`
- Timestamps: Luôn dùng `timestamptz` (with timezone), column name: `created_at`, `updated_at`, `completed_at`

**Code Naming Conventions:**
- Components: `PascalCase` → `XpBar`, `StreakBadge`, `FocusTimer`, `HabitCheckIn`
- Files (components): `kebab-case.tsx` → `xp-bar.tsx`, `streak-badge.tsx`, `focus-timer.tsx`
- Files (utilities): `kebab-case.ts` → `xp-calculator.ts`, `streak-utils.ts`
- Functions: `camelCase` → `calculateStreak()`, `grantXp()`, `getActiveHabits()`
- Server Actions: `camelCase` with verb prefix → `createSession()`, `checkInHabit()`, `grantXpForSession()`
- Variables: `camelCase` → `currentStreak`, `totalXp`, `isFocusMode`
- Constants: `SCREAMING_SNAKE_CASE` → `MAX_LEVEL`, `XP_PER_SESSION`, `DEFAULT_FOCUS_DURATION`
- Types/Interfaces: `PascalCase`, no prefix → `Session`, `Habit`, `XpTransaction` (không `ISession` hay `TSession`)
- Zustand stores: `use{Name}Store` → `useTimerStore`, `useFocusModeStore`
- TanStack Query keys: hierarchical array → `['pomodoro', 'sessions', 'today']`, `['habits', 'list', 'active']`
- Hooks: `use{Purpose}` → `useTimer()`, `useHabits()`, `useXp()`

**Route Naming Conventions:**
- App Router paths: `kebab-case` → `/pomodoro`, `/habits`, `/profile`
- Dynamic segments: `[id]` → `/habits/[id]/edit`
- Route groups: `(group)` → `(auth)`, `(app)`, `(marketing)`
- Locale prefix: `[locale]` → `/vi/pomodoro`, `/en/habits`

### Structure Patterns

**Project Organization (Feature-Based):**

```
app/
  [locale]/
    (auth)/
      login/page.tsx
      signup/page.tsx
    (app)/
      layout.tsx              ← Shared layout (sidebar + XP bar)
      pomodoro/page.tsx
      habits/page.tsx
      profile/page.tsx
    layout.tsx                ← Root layout (providers, fonts)
    page.tsx                  ← Landing page

components/
  ui/                         ← shadcn/ui components (untouched)
    button.tsx
    dialog.tsx
    progress.tsx
  features/                   ← Feature-specific UI
    xp-bar.tsx
    streak-badge.tsx
    level-up-modal.tsx
    focus-timer.tsx
    habit-check-in.tsx
  layout/                     ← App shell
    sidebar.tsx
    bottom-nav.tsx
    focus-mode-shell.tsx

features/
  pomodoro/
    actions.ts                ← Server Actions
    queries.ts                ← TanStack Query hooks
    store.ts                  ← Zustand store (timer state)
    types.ts                  ← Types & Zod schemas
    utils.ts                  ← Pure helper functions
  habits/
    actions.ts
    queries.ts
    types.ts
    utils.ts
  gamification/
    actions.ts
    queries.ts
    types.ts
    utils.ts                  ← XP calculator, level thresholds

lib/
  supabase/
    client.ts                 ← Browser client
    server.ts                 ← Server client
    middleware.ts              ← Auth middleware
  i18n/
    routing.ts
    request.ts
    navigation.ts
  constants.ts                ← App-wide constants (XP values, level thresholds)
  utils.ts                    ← Generic utilities (cn(), formatDate())

messages/
  vi.json                     ← Vietnamese translations
  en.json                     ← English translations
```

**Test Organization (Co-located):**
- Unit tests: cùng thư mục với source → `features/pomodoro/utils.test.ts`
- Component tests: `components/features/__tests__/xp-bar.test.tsx`
- Integration tests: `__tests__/integration/` ở root
- Test naming: `{source-file}.test.{ts|tsx}`
- Test pattern: Arrange-Act-Assert, mỗi test có 1 assertion rõ ràng

**File Rules:**
- Mỗi file export 1 thứ chính (component, hook, hoặc utility set)
- `index.ts` barrel exports chỉ cho thư mục `features/*/` — KHÔNG cho `components/`
- Config files ở root: `tailwind.config.ts`, `next.config.ts`, `vitest.config.ts`
- Env files: `.env.local` (secrets), `.env.example` (template, committed)

### Format Patterns

**Server Action Return Format:**

```typescript
type ActionResult<T> =
  | { data: T; error: null }
  | { data: null; error: { message: string; code: string } }
```

- LUÔN trả về format này từ mọi Server Action
- Validate input bằng Zod trước khi execute
- Error codes convention: `{MODULE}_{ERROR}` → `POMO_SESSION_ACTIVE`, `HABIT_ALREADY_CHECKED`, `GAM_XP_DUPLICATE`

**Date/Time Format:**
- Database: `timestamptz` (UTC) — luôn store UTC
- API/Server Actions: ISO 8601 string → `2026-03-30T14:00:00.000Z`
- UI display: Localized via next-intl formatters
- "Today" logic: User's local timezone, tính bằng `startOfDay()` trong client

**JSON Field Naming:**
- TypeScript/Client: `camelCase` → `{ userId, currentStreak, totalXp }`
- Database columns: `snake_case` → `user_id, current_streak, total_xp`
- Supabase client auto-maps via generated types

### Communication Patterns

**Zustand Store Pattern:**

```typescript
interface TimerStore {
  // State
  status: 'idle' | 'running' | 'paused' | 'break'
  startTime: number | null
  duration: number
  // Actions (verb prefix)
  startTimer: (duration: number) => void
  pauseTimer: () => void
  resumeTimer: () => void
  resetTimer: () => void
}
export const useTimerStore = create<TimerStore>((set, get) => ({ ... }))
```

**TanStack Query Pattern:**

```typescript
// Query keys: hierarchical factory
export const pomodoroKeys = {
  all: ['pomodoro'] as const,
  sessions: () => [...pomodoroKeys.all, 'sessions'] as const,
  sessionsToday: () => [...pomodoroKeys.sessions(), 'today'] as const,
  settings: () => [...pomodoroKeys.all, 'settings'] as const,
}

// Mutations with optimistic updates + invalidation
export function useCheckInHabit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: checkInHabit,
    onMutate: async (habitId) => { /* optimistic update */ },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.all })
      queryClient.invalidateQueries({ queryKey: gamificationKeys.xp() })
    },
  })
}
```

**Component Pattern:**

```typescript
// 1. Props interface trước component
interface XpBarProps {
  currentXp: number
  nextLevelXp: number
  className?: string
}
// 2. Named export (không default export)
export function XpBar({ currentXp, nextLevelXp, className }: XpBarProps) {
  // 3. Hooks ở đầu → 4. Derived state → 5. Handlers → 6. Return JSX
}
```

### Process Patterns

**Error Handling Flow:**
1. Server Actions: Validate input (Zod) → Execute → Return `{ data, error }`
2. TanStack Query: `onError` callback → Toast notification
3. Component level: Error boundary cho unexpected crashes
4. Global: Root error boundary với retry button + error description (NFR30)

**Loading State Pattern:**
- TanStack Query `isPending` cho data loading (KHÔNG custom loading state)
- `useTransition` cho Server Action mutations
- Skeleton components cho initial page loads (shadcn/ui Skeleton)
- KHÔNG dùng global loading spinner — mỗi component tự quản lý loading state

**Auth Guard Pattern:**
- Middleware kiểm tra auth cho toàn bộ `(app)` route group
- Redirect về `/login` nếu chưa auth
- Server Components: `getUser()` từ Supabase server client
- Client Components: `useUser()` hook từ auth context

**Optimistic Update Pattern:**
- User action → Optimistic UI update (< 200ms) → Server Action call
- Success → Invalidate queries → UI tự update từ cache
- Error → Rollback optimistic update → Toast error message

### Enforcement Guidelines

**All AI Agents MUST:**
1. Follow naming conventions EXACTLY — no exceptions cho "personal preference"
2. Place files in correct directories — feature code trong `features/`, UI trong `components/`
3. Use Server Actions for ALL mutations — never mutate directly from client
4. Return `{ data, error }` format from ALL Server Actions
5. Use TanStack Query for ALL server data fetching — no raw `useEffect` + `fetch`
6. Use Zustand ONLY for client-side state that needs frequent updates (timer, Focus Mode)
7. Use named exports — KHÔNG default exports (trừ Next.js page/layout conventions)
8. Co-locate tests — test file cùng thư mục với source file
9. Validate ALL user input với Zod schemas trước khi Server Action execute

**Anti-Patterns to AVOID:**
- ❌ `useEffect` + `useState` cho data fetching → ✅ TanStack Query
- ❌ Direct Supabase mutations từ client → ✅ Server Actions
- ❌ Default exports cho components → ✅ Named exports
- ❌ Global loading spinner → ✅ Component-level loading (Skeleton)
- ❌ Custom state cho server data → ✅ TanStack Query cache
- ❌ `any` type → ✅ Proper TypeScript types hoặc Zod inferred types
- ❌ Inline styles → ✅ Tailwind utility classes
- ❌ Raw SQL strings trong application code → ✅ Supabase client query builder

## Project Structure & Boundaries

### Complete Project Directory Structure

```
src/
├── .env.example                    ← Template env (committed)
├── .env.local                      ← Secrets (gitignored)
├── .gitignore
├── .github/
│   └── workflows/
│       └── ci.yml                  ← Lint + test gate
├── components.json                 ← shadcn/ui config
├── messages/
│   ├── vi.json                     ← Vietnamese translations
│   └── en.json                     ← English translations
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts              ← Neon dark theme tokens
├── tsconfig.json
├── vitest.config.ts
├── middleware.ts                    ← Supabase auth refresh + next-intl locale
├── public/
│   ├── favicon.ico
│   └── og-image.png                ← Open Graph image
├── supabase/
│   ├── config.toml                 ← Supabase local dev config
│   ├── seed.sql                    ← Dev seed data (levels, test habits)
│   └── migrations/
│       ├── 00001_create_profiles.sql
│       ├── 00002_create_pomo_tables.sql
│       ├── 00003_create_habit_tables.sql
│       ├── 00004_create_gam_tables.sql
│       └── 00005_create_rls_policies.sql
├── app/
│   ├── globals.css                 ← Tailwind imports + CSS variables (neon palette)
│   ├── [locale]/
│   │   ├── layout.tsx              ← Root layout (providers, fonts, metadata)
│   │   ├── page.tsx                ← Landing page (SSR, SEO)
│   │   ├── not-found.tsx
│   │   ├── error.tsx               ← Global error boundary
│   │   ├── (auth)/
│   │   │   ├── layout.tsx          ← Auth layout (centered, no sidebar)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── auth/
│   │   │       └── callback/
│   │   │           └── route.ts    ← OAuth callback handler
│   │   └── (app)/
│   │       ├── layout.tsx          ← App shell (sidebar + XP bar + bottom nav)
│   │       ├── pomodoro/
│   │       │   └── page.tsx        ← Pomodoro timer page
│   │       ├── habits/
│   │       │   └── page.tsx        ← Habit list + check-in page
│   │       └── profile/
│   │           └── page.tsx        ← Profile + stats + XP history
├── components/
│   ├── ui/                         ← shadcn/ui (untouched, auto-generated)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── progress.tsx
│   │   ├── skeleton.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── switch.tsx
│   │   ├── card.tsx
│   │   └── dropdown-menu.tsx
│   ├── features/                   ← Feature-specific UI components
│   │   ├── xp-bar.tsx              ← Animated XP progress bar
│   │   ├── level-badge.tsx         ← Current level + title display
│   │   ├── level-up-modal.tsx      ← Celebration modal (dynamic import)
│   │   ├── focus-timer.tsx         ← Timer countdown display (mono font)
│   │   ├── session-controls.tsx    ← Start/pause/resume/cancel buttons
│   │   ├── session-label-input.tsx ← Optional label for Pomodoro session
│   │   ├── daily-stats.tsx         ← Today's sessions + minutes
│   │   ├── habit-card.tsx          ← Single habit with check-in toggle
│   │   ├── habit-list.tsx          ← Today's habits list
│   │   ├── habit-form.tsx          ← Create/edit habit (RHF + Zod)
│   │   ├── streak-badge.tsx        ← Fire emoji + streak count + gradient
│   │   ├── weekly-progress.tsx     ← Weekly habit completion bar
│   │   └── locale-switcher.tsx     ← vi/en toggle
│   └── layout/                     ← App shell components
│       ├── sidebar.tsx             ← Desktop sidebar (logo, avatar, XP, nav)
│       ├── bottom-nav.tsx          ← Mobile bottom navigation
│       ├── focus-mode-shell.tsx    ← Focus Mode wrapper (hides chrome)
│       ├── user-avatar.tsx         ← Avatar + level display
│       └── providers.tsx           ← QueryClientProvider, AuthProvider, etc.
├── features/
│   ├── pomodoro/
│   │   ├── actions.ts              ← createSession, completeSession, cancelSession
│   │   ├── queries.ts             ← useTodaySessions, usePomoSettings
│   │   ├── store.ts                ← useTimerStore (Zustand)
│   │   ├── types.ts                ← Session, PomoSettings, Zod schemas
│   │   ├── utils.ts                ← formatTime, calculateRemaining
│   │   ├── utils.test.ts
│   │   ├── constants.ts            ← DEFAULT_FOCUS, DEFAULT_BREAK, etc.
│   │   └── index.ts                ← Barrel export
│   ├── habits/
│   │   ├── actions.ts              ← createHabit, updateHabit, checkInHabit, uncheckHabit
│   │   ├── queries.ts             ← useTodayHabits, useHabitList, useWeeklyProgress
│   │   ├── types.ts                ← Habit, HabitEntry, Frequency, Zod schemas
│   │   ├── utils.ts                ← calculateStreak, isHabitDueToday
│   │   ├── utils.test.ts
│   │   ├── constants.ts            ← STREAK_THRESHOLDS (gradient colors)
│   │   └── index.ts
│   └── gamification/
│       ├── actions.ts              ← grantXp, checkLevelUp
│       ├── queries.ts             ← useUserXp, useXpHistory, useCurrentLevel
│       ├── types.ts                ← XpTransaction, Level, Zod schemas
│       ├── utils.ts                ← xpForNextLevel, getLevelTitle
│       ├── utils.test.ts
│       ├── constants.ts            ← LEVEL_THRESHOLDS, XP_VALUES, LEVEL_TITLES
│       └── index.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts               ← createBrowserClient()
│   │   ├── server.ts               ← createServerClient()
│   │   └── types.ts                ← Generated database types
│   ├── i18n/
│   │   ├── routing.ts              ← defineRouting({ locales, defaultLocale })
│   │   ├── request.ts              ← getRequestConfig
│   │   └── navigation.ts           ← createNavigation wrappers
│   ├── constants.ts                ← App-wide constants
│   └── utils.ts                    ← cn(), formatDate(), generic helpers
└── __tests__/
    └── integration/
        ├── auth-flow.test.ts       ← Signup → login → protected route
        └── xp-flow.test.ts         ← Session complete → XP grant → level check
```

### Architectural Boundaries

**Auth Boundary:**
- `middleware.ts` → Gate cho toàn bộ `(app)` routes
- `lib/supabase/server.ts` → Server-side auth checks
- `lib/supabase/client.ts` → Client-side auth state
- Mọi route trong `(app)/` đều require authenticated user
- `(auth)/` routes accessible cho unauthenticated users

**Feature Boundaries:**
- Mỗi feature (`pomodoro/`, `habits/`, `gamification/`) là module độc lập
- Features KHÔNG import trực tiếp từ nhau
- Cross-feature communication qua TanStack Query invalidation:
  - Pomodoro complete → invalidate `gamificationKeys.xp()`
  - Habit check-in → invalidate `gamificationKeys.xp()`
- Shared types định nghĩa trong từng feature, KHÔNG shared types folder

**Data Boundary:**
- Application code → Supabase Client / Server Actions → Supabase Postgres
- KHÔNG raw SQL trong application code
- RLS policies là last line of defense — mọi table enforce `auth.uid() = user_id`
- Migrations trong `supabase/migrations/` — sequential numbering

**UI Boundary:**
- `components/ui/` → shadcn/ui primitives, KHÔNG modify trực tiếp
- `components/features/` → Composed từ `ui/` primitives + feature logic
- `components/layout/` → App shell, KHÔNG chứa business logic
- Feature components import từ `components/features/` + `features/*/queries.ts`

### Requirements to Structure Mapping

**FR Category → Directory Mapping:**

| FR Group | Primary Directory | Key Files |
|----------|------------------|-----------|
| FR1-8 (Auth) | `app/[locale]/(auth)/`, `lib/supabase/`, `middleware.ts` | `login/page.tsx`, `signup/page.tsx`, `server.ts`, `callback/route.ts` |
| FR9-19 (Pomodoro) | `features/pomodoro/`, `app/[locale]/(app)/pomodoro/`, `components/features/` | `store.ts`, `actions.ts`, `focus-timer.tsx`, `session-controls.tsx` |
| FR20-31 (Habits) | `features/habits/`, `app/[locale]/(app)/habits/`, `components/features/` | `actions.ts`, `queries.ts`, `habit-card.tsx`, `habit-form.tsx` |
| FR32-40 (Gamification) | `features/gamification/`, `components/features/` | `actions.ts`, `constants.ts`, `xp-bar.tsx`, `level-up-modal.tsx` |
| FR41-45 (Dashboard) | `app/[locale]/(app)/profile/`, `components/features/` | `page.tsx`, `daily-stats.tsx`, `weekly-progress.tsx` |
| FR46-50 (Navigation) | `components/layout/`, `app/[locale]/(app)/layout.tsx` | `sidebar.tsx`, `bottom-nav.tsx`, `focus-mode-shell.tsx` |
| FR51-55 (i18n) | `lib/i18n/`, `messages/`, `middleware.ts` | `routing.ts`, `vi.json`, `en.json`, `locale-switcher.tsx` |
| FR56-60 (Data Integrity) | `features/*/actions.ts`, `supabase/migrations/` | Server Actions + RLS policies + unique constraints |

**Cross-Cutting Concerns → Location:**

| Concern | Files |
|---------|-------|
| Authentication | `middleware.ts`, `lib/supabase/*`, `app/[locale]/(auth)/*` |
| RLS Policies | `supabase/migrations/00005_create_rls_policies.sql` |
| XP System | `features/gamification/actions.ts`, `components/features/xp-bar.tsx` |
| i18n | `lib/i18n/*`, `messages/*`, `middleware.ts` |
| Dark Theme | `app/globals.css`, `tailwind.config.ts` |
| Error Handling | `app/[locale]/error.tsx`, `components/layout/providers.tsx` |

### Integration Points

**Internal Communication Flow:**

```
User Action (click Start/Check-in)
  → Component (focus-timer.tsx / habit-card.tsx)
    → Zustand store update (timer) OR TanStack mutation (habit)
      → Server Action (features/*/actions.ts)
        → Supabase Client (lib/supabase/server.ts)
          → Postgres + RLS
        → XP Grant (features/gamification/actions.ts)
      → TanStack Query invalidation
        → UI re-render (xp-bar.tsx, daily-stats.tsx)
```

**External Integrations:**

| Service | Integration Point | Purpose |
|---------|------------------|---------|
| Supabase Auth | `lib/supabase/*`, `middleware.ts` | Authentication + session management |
| Supabase Postgres | `features/*/actions.ts`, `features/*/queries.ts` | Data persistence |
| Google OAuth | `app/[locale]/(auth)/auth/callback/route.ts` | Social login |
| Vercel | `next.config.ts`, `.github/workflows/ci.yml` | Hosting + auto-deploy |
| Vercel Analytics | `app/[locale]/layout.tsx` | Usage analytics |

**Data Flow — Pomodoro Complete:**

```
Timer reaches 00:00
  → useTimerStore.completeSession()
  → completeSession Server Action
    → INSERT INTO pomo_sessions (status='completed')
    → grantXp Server Action
      → INSERT INTO gam_xp_transactions (unique constraint check)
      → UPDATE profiles SET total_xp = total_xp + amount
      → Check level threshold → return { leveledUp, newLevel }
  → TanStack invalidate: pomodoro.sessions, gamification.xp
  → If leveledUp → dynamic import LevelUpModal → show celebration
  → XP bar animate (< 500ms)
```

**Data Flow — Habit Check-in:**

```
User taps habit toggle
  → useCheckInHabit mutation (optimistic: mark checked)
  → checkInHabit Server Action
    → Validate: not already checked today (unique constraint)
    → INSERT INTO habit_entries
    → Calculate streak (current + longest)
    → UPDATE habit_definitions SET current_streak, longest_streak
    → grantXp Server Action (same as above)
  → TanStack invalidate: habits.list, gamification.xp
  → Streak badge update (gradient color based on length)
  → XP bar animate
```

### Development Workflow Integration

**Local Development:**

```bash
# Terminal 1: Supabase local
npx supabase start

# Terminal 2: Next.js dev server
pnpm dev
```

**Environment Variables:**

```
# .env.local
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...        ← Server-side only
```

**Build Process:**

```
pnpm build
  → next build
    → Route-based code splitting (automatic)
    → Static generation for landing page
    → Server Components compiled
    → Client bundles optimized
  → Output: .next/
```

**Deployment Pipeline:**

```
git push → GitHub Actions (lint + vitest) → Pass?
  → Yes → Vercel auto-deploy (preview for PR, production for main)
  → No → Block merge, fix issues
```

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:** Toàn bộ technology choices hoạt động cùng nhau không xung đột. Next.js App Router + Supabase + TanStack Query + Zustand + Zod + next-intl — tất cả đã verified compatible qua official starter template và ecosystem documentation.

**Pattern Consistency:** Naming conventions nhất quán xuyên suốt: `snake_case` (DB) → `camelCase` (code) → `PascalCase` (components) → `kebab-case` (files). Implementation patterns (Server Actions, TanStack Query hooks, Zustand stores) đều có concrete examples và consistent format.

**Structure Alignment:** Project structure hỗ trợ toàn bộ architectural decisions — feature-based organization cho modularity, route groups cho auth/app separation, co-located tests cho maintainability.

**Boundary Clarification:** Cross-feature import rule clarified — "no cross-import" áp dụng cho client-side code và UI components. Server Actions CÓ THỂ import từ features khác (e.g., `completeSession` calls `grantXp`) vì đây là server-side integration points.

### Requirements Coverage Validation ✅

**Functional Requirements:** 60/60 FRs covered — toàn bộ 8 FR groups (Auth, Pomodoro, Habits, Gamification, Dashboard, Navigation, i18n, Data Integrity) đều có architectural support rõ ràng với directory mapping cụ thể.

**Non-Functional Requirements:** 31/31 NFRs addressed — Performance (code splitting, bundle budget), Security (RLS, JWT), Scalability (stateless), Accessibility (WCAG 2.1 AA via Radix), Reliability (client-side timer, optimistic UI).

### Implementation Readiness Validation ✅

**Decision Completeness:** Tất cả critical decisions documented — Data access pattern, state management, timer engine, XP deduplication, database schema, CI/CD. Mỗi decision có rationale và affected FRs.

**Structure Completeness:** ~70 files mapped trong project tree. Toàn bộ FR groups có directory mapping. Integration points (data flows) specified cho cả Pomodoro complete và Habit check-in flows.

**Pattern Completeness:** 28 potential conflict points addressed trong 5 categories (Naming, Structure, Format, Communication, Process). 9 enforcement rules + 8 anti-patterns documented. Code examples cho tất cả major patterns.

### Gap Analysis Results

**Critical Gaps:** 0

**Important Gaps (Addressed):**
1. Cross-feature Server Action imports — Clarified: server-side imports allowed, client-side cross-imports prohibited

**Implementation Notes (Deferred to Stories):**
- Database column schemas → Defined during epic/story implementation
- Offline queue mechanism (localStorage vs IndexedDB) → Implementation detail
- Profile auto-creation trigger → Supabase auth hook during auth epic
- Rate limiting configuration → Vercel edge + Supabase built-in during deployment story

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (Medium)
- [x] Technical constraints identified (solo dev, free tier, 5-6 sprints)
- [x] Cross-cutting concerns mapped (8 concerns)

**✅ Starter Template**
- [x] Technology domain identified (Full-stack Web App)
- [x] Starter options evaluated (3 options)
- [x] Selected starter documented with rationale
- [x] Post-init strategy defined (Story 0 + Story 1)
- [x] Turborepo deferral documented as conscious decision

**✅ Architectural Decisions**
- [x] Data architecture decisions (5 decisions)
- [x] Authentication & security decisions (3 decisions)
- [x] API & communication patterns (2 decisions)
- [x] Frontend architecture decisions (3 decisions)
- [x] Infrastructure & deployment decisions (3 decisions)
- [x] Implementation sequence defined
- [x] Cross-component dependencies mapped

**✅ Implementation Patterns**
- [x] Database naming conventions established
- [x] Code naming conventions established
- [x] Route naming conventions established
- [x] Project organization pattern defined
- [x] Server Action return format standardized
- [x] Zustand store pattern documented
- [x] TanStack Query pattern documented
- [x] Component pattern documented
- [x] Error handling flow defined
- [x] Loading state pattern defined
- [x] Optimistic update pattern defined
- [x] Enforcement guidelines with anti-patterns

**✅ Project Structure**
- [x] Complete directory tree (~70 files)
- [x] Architectural boundaries defined (Auth, Feature, Data, UI)
- [x] FR → Directory mapping (8 groups)
- [x] Cross-cutting concerns → Location mapping
- [x] Data flow diagrams (Pomodoro + Habit flows)
- [x] External integration points mapped
- [x] Development workflow documented

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION ✅

**Confidence Level:** High

**Key Strengths:**
1. Comprehensive FR/NFR coverage — 91/91 requirements architecturally supported
2. Concrete implementation patterns — code examples, not abstract guidelines
3. Clear feature boundaries — prevents AI agent conflicts
4. Pragmatic decisions — optimized cho solo developer MVP velocity
5. Data flow documentation — exact sequence for core loops (Pomodoro + Habits)

**Areas for Future Enhancement (Post-MVP):**
- Turborepo monorepo wrapping (Phase 4)
- Sentry error tracking (user base > 100)
- Advanced caching strategy (CDN, edge)
- Multi-schema database migration
- PWA offline support (Service Worker)

### Implementation Handoff

**AI Agent Guidelines:**
- Follow ALL architectural decisions exactly as documented
- Use implementation patterns consistently — refer to code examples
- Respect project structure and feature boundaries
- Server Actions may import across features; client code must NOT
- Refer to this document for ALL architectural questions before making independent decisions

**First Implementation Priority:**

```bash
npx create-next-app -e with-supabase src
```

Follow Story 0 → Story 1 sequence as defined in Starter Template Evaluation.
