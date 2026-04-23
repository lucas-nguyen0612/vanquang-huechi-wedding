# JL-Tools — Sprint Plan

**Total:** 4 sprints × 2 tuần = **8 tuần**
**Start date:** TBD
**Stack:** Next.js 15 · TypeScript · Supabase · Tailwind · Vercel

---

## Tổng quan

```
Sprint 1 (W1–2)   Foundation        ✅ Complete
Sprint 2 (W3–4)   Pomodoro Tool     ✅ Complete
Sprint 3 (W5–6)   Habit Tracker     ✅ Complete
Sprint 4 (W7–8)   Flashcard + Ship  🔄 Features complete — Production Deploy pending
```

---

## Sprint 1 — Foundation ✅

**Goal:** App chạy được trên localhost, đăng nhập/đăng ký hoạt động, design system đúng với giao diện thiết kế, RPG components cơ bản render được.

**Deliverable:** Đăng nhập → thấy SideNav với Avatar + XP bar đúng design. Level up modal chạy được.

**Completed:** 2026-04-23

---

### Setup & Infrastructure

- [x] Khởi tạo Next.js 15 project với TypeScript, Tailwind, App Router
- [x] Cài dependencies: supabase-js, ssr, zustand, framer-motion, lucide-react, date-fns, react-hook-form, zod, shadcn/ui
- [x] Setup Supabase local (`supabase init && supabase start`)
- [x] Tạo `.env.local` với Supabase local keys
- [x] Tạo 3 Supabase client files: `lib/supabase/client.ts`, `server.ts`, `middleware.ts`
- [x] Setup `middleware.ts` bảo vệ routes `/dashboard`, `/pomodoro`, `/habits`, `/flashcards`, `/character`

---

### Database

- [x] Migration `001_initial_schema.sql` (17 tables + indexes)
- [x] Migration `002_rls_policies.sql`
- [x] Migration `003_functions_triggers.sql`
  - `award_xp()`, `apply_sm2()`, `update_streak()`
  - `check_and_award_badges()`, `on_auth_user_created()`
  - `update_updated_at()` triggers
- [x] Migration `004_seed_data.sql`
  - 20 badges, 9 quests, 9 unlockables, level_thresholds (1–50)
- [x] TypeScript types: `src/types/database.ts`
- [x] Enable Realtime cho 4 tables: `character_stats`, `xp_transactions`, `user_badges`, `user_quests`

---

### Design System

- [x] CSS tokens vào `src/app/globals.css` (merge với Tailwind base)
- [x] shadcn token override vào `globals.css`
- [x] `tailwind.config.ts` với custom colors từ JL tokens
- [x] `ThemeProvider` client component (dark mode, accent hue, cookie persist)
- [x] Root `layout.tsx` đọc cookie theme từ server → inject vào `<html>` (flash-free)

---

### Landing Page

- [x] `app/page.tsx`: landing page cho unauthenticated, redirect `/dashboard` cho logged-in
- [x] `app/(marketing)/layout.tsx`: layout riêng cho public pages
- [x] `components/marketing/LandingNav.tsx`
- [x] `components/marketing/HeroSection.tsx`
- [x] `components/marketing/HeroVisual.tsx`
- [x] `components/marketing/ToolStrip.tsx`
- [x] `components/marketing/XPBand.tsx`
- [x] `components/marketing/LandingFooter.tsx`

---

### Authentication

- [x] Page `/login` (`app/login/page.tsx`): email + password + Google OAuth
- [x] Page `/auth/login` (`app/auth/login/page.tsx`): dùng `LoginForm` component
- [x] Page `/signup` (`app/signup/page.tsx`)
- [x] Page `/auth/sign-up` (`app/auth/sign-up/page.tsx`)
- [x] Page `/onboarding` (3 steps: đặt tên nhân vật, chọn mục tiêu, chọn tool đầu tiên)
- [x] `app/auth/callback/route.ts`: xử lý OAuth callback
- [x] `app/auth/confirm/route.ts`: xử lý email confirmation link
- [x] `app/auth/forgot-password/page.tsx` + `app/auth/update-password/page.tsx`
- [x] Onboarding check trong middleware
- [x] `enable_confirmations = true` trong `supabase/config.toml`
- [x] `components/ui/PasswordInput.tsx`: input password với eye icon toggle (Eye/EyeOff)
  - Dùng cho tất cả password fields: login, sign-up (×2), update-password
- [x] OTP verification dialog khi login với email chưa confirm:
  - Tự động gửi OTP 6 số khi bắt lỗi `"Email not confirmed"`
  - Dialog nhập OTP + nút Resend (cooldown 60s)
  - Verify qua `supabase.auth.verifyOtp({ type: 'signup' })` → redirect `/dashboard`

---

### RPG Components

- [x] `components/rpg/Avatar.tsx`
- [x] `components/rpg/XPBar.tsx`
- [x] `components/rpg/LevelBadge.tsx`
- [x] `components/rpg/RarityChip.tsx`
- [x] `components/rpg/StatPill.tsx`
- [x] `components/rpg/Sparkline.tsx`
- [x] `components/rpg/Heatmap.tsx`

---

### Layout Components

- [x] `components/layout/SideNav.tsx`
- [x] `components/layout/TopBar.tsx`
- [x] `components/layout/BottomNav.tsx` (mobile)
- [x] `app/(app)/layout.tsx`: Server Component fetch profile → render SideNav

---

### Animation Layer

- [x] `components/animations/XPGainOverlay.tsx`
- [x] `components/animations/LevelUpModal.tsx`

---

### State Foundation

- [x] `store/userStore.ts`: profile, totalXP, level, xpGainQueue, `addXP()`
- [x] `hooks/useXPRealtime.ts`: Supabase Realtime subscribe `character_stats`
- [x] TypeScript types: `src/types/rpg.ts`, `src/types/tools.ts`

---

## Sprint 2 — Pomodoro Tool ✅

**Goal:** Pomodoro timer hoạt động end-to-end: timer chạy, task list, soundscape, XP award khi session hoàn thành, XP cộng vào character.

**Deliverable:** User bấm Start → đếm ngược 25 phút → hoàn thành → thấy "+10 XP" popup → XP bar tăng.

**Completed:** 2026-04-23 — build pass, type-check 0 errors, lint 0 errors.

---

### Supabase

- [x] API route `POST /api/pomodoro/sessions`: nhận completed session, gọi `award_xp()`, trả về XP result
- [x] API route `GET /api/pomodoro/sessions?from=&to=`: lấy session history

---

### State

- [x] `store/pomodoroStore.ts` với Zustand `persist`:
  - `phase`, `timeLeft`, `isRunning`, `sessionCount`, `tasks`, `settings`
  - Actions: `startTimer`, `pauseTimer`, `resetTimer`, `skipPhase`, `addTask`, `reorderTasks`
  - Persist sang `localStorage` để survive page refresh
- [x] `hooks/useTimer.ts`: `requestAnimationFrame` loop → tick store mỗi giây

---

### Components

- [x] `components/pomodoro/PomodoroTimer.tsx`
- [x] `components/pomodoro/ModeSelector.tsx`
- [x] `components/pomodoro/TimerControls.tsx`
- [x] `components/pomodoro/SessionDots.tsx`
- [x] `components/pomodoro/TaskList.tsx`
- [x] `components/pomodoro/TaskItem.tsx`
- [x] `components/pomodoro/SoundscapeSelector.tsx`
- [x] `components/pomodoro/FocusBlocker.tsx`
- [x] `components/pomodoro/FocusModeOverlay.tsx`
- [x] `components/pomodoro/XPTickerPanel.tsx`
- [x] `components/pomodoro/SessionHistoryChart.tsx`

---

### Page

- [x] `app/(app)/pomodoro/page.tsx`
- [x] Keyboard shortcuts: `Space` = start/pause, `R` = reset, `F` = focus mode
- [x] Notification API khi session complete

---

### XP Integration

- [x] POST session → nhận `{ xpAwarded, leveledUp }` → trigger XP popup + LevelUpModal
- [x] Session complete: +10 XP · Clean session: +5 bonus · Daily streak: +5
- [ ] Update `character_stats.total_pomodoros` + `total_focus_minutes` *(defer: cần thêm RPC call)*

---

### Edge Cases

- [x] Tab hidden / máy sleep: recalculate elapsed từ timestamp lúc hidden
- [x] User đóng tab giữa chừng: session chưa hoàn thành không tính XP
- [x] Cross-tab sync qua `BroadcastChannel`

---

## Sprint 3 — Habit Tracker ✅

**Goal:** Habit check-in hoạt động, streak tính đúng (timezone-aware), heatmap render từ real Supabase data, XP award khi check-in.

**Deliverable:** User tạo habit → check-in hàng ngày → thấy streak tăng → heatmap điền màu → XP cộng vào.

**Completed:** 2026-04-23 — build pass, type-check 0 errors, lint 0 errors.

---

### Supabase

- [x] `fetchHabitsWithStatus` Server Action (`features/habits/queries.ts`)
- [x] `createHabit` Server Action (`features/habits/actions.ts`)
- [x] `updateHabit` Server Action
- [x] `archiveHabit` Server Action (soft delete, `is_archived = true`)
- [x] `toggleHabitCompletion(habitId, userId, date)`: Insert/delete completions, streak calc, XP insert, `revalidatePath`

---

### State

- [x] `features/habits/store.ts`: optimistic toggle/rollback/confirm
- [x] `hooks/useHabits.ts`: TanStack Query + `useToggleHabit`, `useCreateHabit`, `useUpdateHabit`, `useArchiveHabit`, `useHeatmapQuery`

---

### Components

- [x] `components/habits/HabitCard.tsx`
- [x] `components/habits/CheckInButton.tsx`
- [x] `components/habits/StreakBadge.tsx`
- [x] `components/habits/HabitForm.tsx`
- [x] `components/habits/HeatmapView.tsx`
- [x] `components/habits/InsightPanel.tsx`
- [x] `components/habits/WeeklyGrid.tsx`
- [x] `components/habits/RemindersPanel.tsx`
- [ ] `components/habits/HabitList.tsx` *(skipped — HabitsClient renders cards directly)*

---

### Page

- [x] `app/(app)/habits/page.tsx`
- [x] `app/(app)/habits/HabitsClient.tsx`

---

### XP Integration

- [x] Check-in: +5 XP · All done bonus: +10 XP
- [x] Streak milestones: +50 XP (7d), +100 XP (14d), +200 XP (30d)
- [x] `character_stats.total_habits_completed` update

---

### Edge Cases

- [x] Timezone: `toLocaleDateString('sv-SE')` → YYYY-MM-DD browser timezone
- [x] Habit limit: max 10, button disabled + "Max 10 habits reached"
- [x] Retroactive check-in ngày hôm qua trong 6h sau midnight
- [x] Warning sớm khi đạt 8+ habits

---

## Sprint 4 — Flashcard + Character + Ship 🔄

**Goal:** SM-2 review loop hoàn chỉnh, Character screen đầy đủ, Dashboard tổng hợp, app deploy lên Vercel production.

**Deliverable:** App hoàn chỉnh 3 tools + dashboard + character sheet. Deployed và chạy được trên production URL.

**Status:** Features complete locally — Production Deploy pending.

---

### Flashcard ✅

#### Supabase
- [x] `hooks/useFlashcards.ts`: TanStack Query cho decks, cards, review session
- [x] `store/flashcardStore.ts`: current review session, results queue

#### State
- [x] `lib/sm2/algorithm.ts`: `calculateNextReview()` client-side
- [x] `hooks/useFlashcards.ts`: session state machine (idle → reviewing → complete)

#### Components
- [x] `components/flashcard/DeckList.tsx`
- [x] `components/flashcard/DeckCard.tsx`
- [x] `components/flashcard/CardFlip.tsx`
- [x] `components/flashcard/RatingButtons.tsx` (Again/Hard/Good/Easy + keyboard 1/2/3/4)
- [x] `components/flashcard/ReviewSession.tsx`
- [x] `components/flashcard/SessionProgress.tsx`
- [x] `components/flashcard/SessionSummary.tsx`
- [x] `components/flashcard/DeckStats.tsx`
- [x] `components/flashcard/CardEditor.tsx`
- [x] `components/flashcard/DeckEditor.tsx`
- [x] `components/flashcard/ForecastChart.tsx`

#### Pages
- [x] `app/(app)/flashcards/page.tsx`
- [x] `app/(app)/flashcards/[deckId]/page.tsx`
- [x] `app/(app)/flashcards/[deckId]/study/page.tsx`

---

### Character Screen ✅

- [x] `app/(app)/character/page.tsx`
- [x] `components/character/CharacterSheet.tsx`
- [x] `components/character/BadgeGrid.tsx`
- [x] `components/character/ActivityTimeline.tsx`
- [x] `components/character/StatChart.tsx`

---

### Dashboard ✅

- [x] `app/(app)/dashboard/page.tsx`
- [x] `components/dashboard/HeroCard.tsx`
- [x] `components/dashboard/QuestList.tsx`
- [x] `components/dashboard/ToolGrid.tsx`
- [x] `components/dashboard/WeeklyStats.tsx`
- [x] `components/dashboard/RecentBadges.tsx`

---

### Polish ✅

- [x] Error boundaries: `components/errors/ToolErrorBoundary.tsx`, `QueryErrorBoundary.tsx`
- [x] Skeleton loading states: `DashboardSkeleton`, `CharacterSheetSkeleton`, `BadgeGridSkeleton`, `DeckListSkeleton`
- [x] Empty states với CTA: `NoPomodoroSessionsCTA`, `NoHabitsCTA`, `NoDecksCTA`
- [x] Mobile responsive: `components/layout/BottomNav.tsx`

---

### Production Deploy ❌

- [ ] Tạo Supabase cloud project (region: Singapore)
- [ ] `supabase link --project-ref YOUR_REF`
- [ ] `supabase db push` — apply migrations lên cloud
- [ ] Set environment variables trên Vercel (cloud Supabase keys)
- [ ] Set Auth Redirect URL trong Supabase: `https://jl-tools.vercel.app/api/auth/callback`
- [ ] Enable Google OAuth (tạo credentials tại Google Cloud Console)
- [ ] Verify RLS policies với anonymous role
- [ ] Setup Sentry: `npx @sentry/wizard@latest -i nextjs`
- [ ] Verify deploy trên production URL
- [ ] Smoke test toàn bộ flows trên production

---

## Definition of Done (per sprint)

Một sprint được coi là Done khi:
- [x] Tất cả tasks đã checked
- [x] `pnpm lint` pass (0 errors)
- [x] `pnpm build` pass (0 TypeScript errors)
- [x] App chạy được trên localhost với Supabase local
- [x] User flows chính của sprint hoạt động end-to-end
- [x] Code đã push lên `main`

---

## Dependency Tree

```
Sprint 1 (Foundation) ✅
    ↓
Sprint 2 (Pomodoro) ✅ ← auth, XP engine, character_stats
    ↓
Sprint 3 (Habits) ✅ ← auth, XP engine, streak function
    ↓
Sprint 4 (Flashcard + Ship) 🔄 ← auth, XP engine, SM-2 function, dashboard
```

---

## Packages cần install (đầy đủ)

```bash
# Core
pnpm add @supabase/supabase-js @supabase/ssr

# UI
npx shadcn@latest init
npx shadcn@latest add button dialog progress tabs switch tooltip dropdown-menu skeleton badge popover

# Animation
pnpm add framer-motion

# State
pnpm add zustand @tanstack/react-query

# Forms
pnpm add react-hook-form zod @hookform/resolvers

# Date
pnpm add date-fns date-fns-tz

# Icons
pnpm add lucide-react

# Drag & drop (Pomodoro task list)
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Monitoring (sau khi deploy)
pnpm add @vercel/analytics @vercel/speed-insights
npx @sentry/wizard@latest -i nextjs

# Dev
pnpm add -D supabase @tanstack/react-query-devtools
```
