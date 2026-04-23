# JL-Tools — Sprint Plan

**Total:** 4 sprints × 2 tuần = **8 tuần**
**Start date:** TBD
**Stack:** Next.js 15 · TypeScript · Supabase · Tailwind · Vercel

---

## Tổng quan

```
Sprint 1 (W1–2)   Foundation        → App chạy, auth hoạt động, design system ready
Sprint 2 (W3–4)   Pomodoro Tool     → Timer end-to-end, XP earn, task list
Sprint 3 (W5–6)   Habit Tracker     → Check-in, streak, heatmap từ real data
Sprint 4 (W7–8)   Flashcard + Ship  → SM-2 review, Character screen, Dashboard, deploy
```

---

## Sprint 1 — Foundation

**Goal:** App chạy được trên localhost, đăng nhập/đăng ký hoạt động, design system đúng với giao diện thiết kế, RPG components cơ bản render được.

**Deliverable:** Đăng nhập → thấy SideNav với Avatar + XP bar đúng design. Level up modal chạy được.

---

### Setup & Infrastructure

- [ ] Khởi tạo Next.js 15 project với TypeScript, Tailwind, App Router
  ```bash
  npx create-next-app@latest jl-tools --typescript --tailwind --app
  ```
- [ ] Cài dependencies:
  ```bash
  npm install @supabase/supabase-js @supabase/ssr
  npm install zustand framer-motion lucide-react
  npm install date-fns date-fns-tz
  npm install react-hook-form zod @hookform/resolvers
  npx shadcn@latest init
  npx shadcn@latest add button dialog progress tabs switch tooltip dropdown-menu skeleton
  ```
- [ ] Setup Supabase local:
  ```bash
  brew install supabase/tap/supabase
  supabase init && supabase start
  ```
- [ ] Tạo `.env.local` với Supabase local keys
- [ ] Tạo 3 Supabase client files: `lib/supabase/client.ts`, `server.ts`, `middleware.ts`
- [ ] Setup `middleware.ts` bảo vệ routes `/dashboard`, `/pomodoro`, `/habits`, `/flashcards`, `/character`

---

### Database

- [ ] Viết và apply migration `001_initial_schema.sql` (17 tables + indexes)
- [ ] Viết và apply migration `002_rls_policies.sql`
- [ ] Viết và apply migration `003_functions_triggers.sql`
  - `award_xp()`, `apply_sm2()`, `update_streak()`
  - `check_and_award_badges()`, `on_auth_user_created()`
  - `update_updated_at()` triggers
- [ ] Viết và apply migration `004_seed_data.sql`
  - 20 badges, 9 quests, 9 unlockables, level_thresholds (1–50)
- [ ] Generate TypeScript types:
  ```bash
  supabase gen types typescript --local > src/types/database.ts
  ```
- [ ] Enable Realtime cho 4 tables: `character_stats`, `xp_transactions`, `user_badges`, `user_quests`

---

### Design System

- [ ] Copy `styles/tokens.css` vào `src/app/globals.css` (merge với Tailwind base)
- [ ] Thêm shadcn token override vào `globals.css`:
  ```css
  :root {
    --background: var(--jl-bg);
    --foreground: var(--jl-text);
    --primary: var(--jl-accent-strong);
    --radius: var(--jl-r);
  }
  ```
- [ ] Cấu hình `tailwind.config.ts` với custom colors từ JL tokens
- [ ] Setup fonts qua `next/font/local`: Geist, Fraunces, JetBrains Mono
- [ ] Tạo `ThemeProvider` client component:
  - Toggle dark mode → set `.dark` class trên `<html>`
  - Set accent hue → `--jl-hue` CSS variable
  - Persist sang cookie (server-readable, không flash khi load)
- [ ] Root `layout.tsx` đọc cookie theme từ server → inject vào `<html>` (flash-free)

---

### Landing Page

- [ ] Cập nhật `app/page.tsx`: hiển thị landing page cho unauthenticated, redirect `/dashboard` cho logged-in
- [ ] `app/(marketing)/layout.tsx`: layout riêng cho public pages (không có SideNav)
- [ ] `components/marketing/LandingNav.tsx`: sticky nav với logo, links, lang switcher, Sign in + Start free buttons
- [ ] `components/marketing/HeroSection.tsx`: headline, description, CTA buttons, social proof stats (24k+ adventurers...)
- [ ] `components/marketing/HeroVisual.tsx`: 3 stacked product cards (heatmap, pomodoro timer, level-up toast) — dùng lại RPG components
- [ ] `components/marketing/ToolStrip.tsx`: 3-col grid giới thiệu Pomodoro / Habit Tracker / Flashcards
- [ ] `components/marketing/XPBand.tsx`: "Every tool feeds the same XP bar" section với XP flow diagram
- [ ] `components/marketing/LandingFooter.tsx`: copyright + links + version tag
- [ ] Wire `Sign in` → `/login`, `Start free` → `/signup`, `Begin your adventure` → `/signup`

---

### Authentication

- [ ] Page `/login`: email + password form + Google OAuth button
- [ ] Page `/signup`: tạo account
- [ ] Page `/onboarding` (3 steps):
  1. Đặt tên nhân vật
  2. Chọn mục tiêu (multi-select: Học/Công việc/Thói quen/Ghi nhớ)
  3. Chọn tool đầu tiên → redirect
- [ ] `api/auth/callback/route.ts`: xử lý OAuth callback
- [ ] Onboarding check trong middleware: user mới → redirect `/onboarding`

---

### RPG Components

Chuyển đổi từ `lib/rpg.jsx` sang TypeScript:

- [ ] `components/rpg/Avatar.tsx` — SVG avatar evolve theo level/tier
- [ ] `components/rpg/XPBar.tsx` — segmented progress bar
- [ ] `components/rpg/LevelBadge.tsx` — circular level number
- [ ] `components/rpg/RarityChip.tsx` — color-coded tier badge
- [ ] `components/rpg/StatPill.tsx` — stat chip với icon + label + value
- [ ] `components/rpg/Sparkline.tsx` — mini line chart SVG
- [ ] `components/rpg/Heatmap.tsx` — 26-week contribution grid SVG

---

### Layout Components

- [ ] `components/layout/SideNav.tsx`: nav links, avatar mini, XP bar compact, active highlight
- [ ] `components/layout/TopBar.tsx`: title + subtitle + right slot
- [ ] `app/(app)/layout.tsx`: Server Component fetch profile → render SideNav

---

### Animation Layer

- [ ] `components/animations/XPGainOverlay.tsx`: Framer Motion queue của XP popups (+N XP slide in)
- [ ] `components/animations/LevelUpModal.tsx`: full-screen celebration khi level up
- [ ] Gắn vào root app layout

---

### State Foundation

- [ ] `store/userStore.ts`: profile, totalXP, level, xpGainQueue, `addXP()`
- [ ] `hooks/useXPRealtime.ts`: Supabase Realtime subscribe `character_stats`
- [ ] TypeScript types: `src/types/rpg.ts`, `src/types/tools.ts`

---

### CI/CD

- [ ] Tạo `.github/workflows/ci.yml` (lint + type-check + build)
- [ ] Push lên GitHub, connect Vercel
- [ ] Set environment variables trên Vercel (Supabase cloud keys)

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

- [x] `components/pomodoro/PomodoroTimer.tsx`: vòng tròn SVG progress + số đếm ngược (72px)
- [x] `components/pomodoro/ModeSelector.tsx`: Focus / Short / Long pill buttons
- [x] `components/pomodoro/TimerControls.tsx`: Start/Pause, Reset, Skip
- [x] `components/pomodoro/SessionDots.tsx`: 4 session dots (filled/empty)
- [x] `components/pomodoro/TaskList.tsx`: list với drag-reorder (`@dnd-kit/core`)
- [x] `components/pomodoro/TaskItem.tsx`: checkbox + tên + pomodoro dot tracker + menu
- [x] `components/pomodoro/SoundscapeSelector.tsx`: 3×2 grid + lock overlay cho locked tracks + volume slider
- [x] `components/pomodoro/FocusBlocker.tsx`: toggle on/off + site list + blocked count
- [x] `components/pomodoro/FocusModeOverlay.tsx`: full-screen dark overlay, chỉ hiện timer lớn + task
- [x] `components/pomodoro/XPTickerPanel.tsx`: live log các XP gains trong session
- [x] `components/pomodoro/SessionHistoryChart.tsx`: 14-day bar chart (SVG)

---

### Page

- [x] `app/(app)/pomodoro/page.tsx`: Client Component, render toàn bộ tool
- [x] Keyboard shortcuts: `Space` = start/pause, `R` = reset, `F` = focus mode
- [x] Notification API khi session complete (yêu cầu permission lần đầu)

---

### XP Integration

- [x] Khi session hoàn thành (timeLeft = 0, phase = 'work'):
  1. `POST /api/pomodoro/sessions` với session data
  2. Nhận `{ xpAwarded, leveledUp }` response
  3. `userStore.addXP(amount)` → trigger XP popup animation
  4. Nếu `leveledUp` → dispatch `jl:levelup` event → LevelUpModal
- [x] XP amounts:
  - Session complete: +10
  - Clean session (0 interruptions): +5 bonus
  - Daily streak bonus: +5
- [ ] Update `character_stats.total_pomodoros` + `total_focus_minutes` *(defer: cần thêm RPC call trong API route)*

---

### Edge Cases

- [x] Tab hidden / máy sleep: khi tab active lại, recalculate elapsed từ timestamp lúc hidden
- [x] User đóng tab giữa chừng: session chưa hoàn thành không tính XP
- [x] Cross-tab sync qua `BroadcastChannel`

---

## Sprint 3 — Habit Tracker ✅

**Goal:** Habit check-in hoạt động, streak tính đúng (timezone-aware), heatmap render từ real Supabase data, XP award khi check-in.

**Deliverable:** User tạo habit → check-in hàng ngày → thấy streak tăng → heatmap điền màu → XP cộng vào.

**Completed:** 2026-04-23 — build pass, type-check 0 errors, lint 0 errors. Một số items minor defer sang Sprint 4 polish.

---

### Supabase

- [x] `GET /api/habits` → implemented as `fetchHabitsWithStatus` Server Action (`features/habits/queries.ts`)
- [x] `POST /api/habits` → `createHabit` Server Action (`features/habits/actions.ts`)
- [x] `PUT /api/habits/[id]` → `updateHabit` Server Action
- [x] `DELETE /api/habits/[id]` → `archiveHabit` Server Action (soft delete, `is_archived = true`)
- [x] Server Action `toggleHabitCompletion(habitId, userId, date)`:
  1. Insert/delete `habit_completions`
  2. Streak tính tay trong action (current_streak, longest_streak, last_completed_date)
  3. Insert `xp_transactions` nếu check-in
  4. `revalidatePath('/habits')`

---

### State

- [x] `features/habits/store.ts`: todayHabits, optimisticCheckinIds, optimistic toggle/rollback/confirm
- [x] `hooks/useHabits.ts`: TanStack Query + optimistic update (`useToggleHabit`, `useCreateHabit`, `useUpdateHabit`, `useArchiveHabit`, `useHeatmapQuery`)

---

### Components

- [x] `components/habits/HabitCard.tsx`: tên habit + category icon + streak badge + check-in button + dropdown menu (edit/delete)
- [x] `components/habits/CheckInButton.tsx`: toggle với spring animation (Framer Motion), loading spinner
- [x] `components/habits/StreakBadge.tsx`: animated flame + số ngày, 4 tier (cold/warm/hot/blazing)
- [x] `components/habits/HabitForm.tsx`: Dialog create/edit, Zod validation, fields: name/category/timeOfDay/color/targetDays/reminderTime
- [x] `components/habits/HeatmapView.tsx`: 26-week grid từ `habit_completions` data, 5 intensity levels
- [x] `components/habits/InsightPanel.tsx`: completion rate, best streak, empty state khi < 2 habits
- [ ] `components/habits/HabitList.tsx` *(defer — HabitsClient render card list trực tiếp, không tách file riêng)*
- [ ] `components/habits/WeeklyGrid.tsx` *(defer — không implement weekly 7-col grid, dùng card list)*
- [ ] `components/habits/RemindersPanel.tsx` *(defer — chưa implement)*

---

### Page

- [x] `app/(app)/habits/page.tsx`: Server Component, auth check, render HabitsClient
- [x] `app/(app)/habits/HabitsClient.tsx`: Client island, TanStack Query, XP notifications, progress bar, tabs (heatmap/insights)

---

### XP Integration

- [x] Check-in: +5 XP per habit (`XP_VALUES.HABIT_CHECKIN`)
- [x] All habits done cùng ngày: +10 XP bonus (`XP_VALUES.HABIT_ALL_DONE_BONUS`)
- [x] Cập nhật `character_stats.total_habits_completed` (best-effort trong toggleHabitCompletion)
- [ ] Streak milestones: +50 XP tại 7 ngày, +100 XP tại 14 ngày, +200 XP tại 30 ngày *(defer — chưa implement)*

---

### Edge Cases

- [x] Timezone: `toLocaleDateString('sv-SE')` → YYYY-MM-DD trong browser timezone (không phải UTC)
- [x] Habit limit: cứng max 10, button disabled + label "Max 10 habits reached"
- [ ] Retroactive check-in ngày hôm qua trong 6h sau midnight *(defer — chưa implement UI)*
- [ ] Warning sớm khi đạt 8+ habits *(defer — hiện chỉ block cứng tại 10)*

---

## Sprint 4 — Flashcard + Character + Ship

**Goal:** SM-2 review loop hoàn chỉnh, Character screen đầy đủ, Dashboard tổng hợp, app deploy lên Vercel production.

**Deliverable:** App hoàn chỉnh 3 tools + dashboard + character sheet. Deployed và chạy được trên production URL.

---

### Flashcard

#### Supabase
- [ ] API route `GET /api/flashcards/decks`: deck list với due counts
- [ ] API route `POST /api/flashcards/decks`: tạo deck
- [ ] API route `GET/PUT/DELETE /api/flashcards/decks/[id]`
- [ ] API route `POST /api/flashcards/cards`: tạo card
- [ ] API route `POST /api/flashcards/review`: nhận rating → gọi `apply_sm2()` → trả về next interval + XP

#### State
- [ ] `store/flashcardStore.ts`: current review session, results queue
- [ ] `hooks/useFlashSession.ts`: session state machine (idle → reviewing → complete)
- [ ] `lib/sm2/algorithm.ts`: `calculateNextReview()` client-side (preview intervals cho UI)

#### Components
- [ ] `components/flashcard/DeckList.tsx`: Server Component — list decks với due count chip
- [ ] `components/flashcard/DeckCard.tsx`: deck overview với color, stats
- [ ] `components/flashcard/CardFlip.tsx`: CSS 3D flip, `backface-visibility: hidden`
- [ ] `components/flashcard/RatingButtons.tsx`: Again/Hard/Good/Easy với next interval preview
  - Again → "< 1 min", Hard → "6 min", Good → "3 days", Easy → "8 days"
  - Keyboard: 1/2/3/4 (chỉ sau khi đã flip)
- [ ] `components/flashcard/ReviewSession.tsx`: Client Component — orchestrate session flow
- [ ] `components/flashcard/SessionProgress.tsx`: progress bar (x/42 · y%)
- [ ] `components/flashcard/SessionSummary.tsx`: kết quả session (retention, XP, breakdown)
- [ ] `components/flashcard/DeckStats.tsx`: card pool (New/Learning/Young/Mature), forecast chart
- [ ] `components/flashcard/CardEditor.tsx`: Dialog tạo/sửa card (front/back textarea + tags)
- [ ] `components/flashcard/ForecastChart.tsx`: due cards 7 ngày tới (bar chart SVG)

#### Pages
- [ ] `app/(app)/flashcards/page.tsx`: Server Component — deck list
- [ ] `app/(app)/flashcards/[deckId]/page.tsx`: deck detail + study button
- [ ] `app/(app)/flashcards/[deckId]/study/page.tsx`: Client Component — review session

#### XP Integration
- [ ] Per card: Again=0, Hard=+1, Good=+2, Easy=+3
- [ ] Session bonus: +15 XP nếu review ≥ 50 cards trong 1 session
- [ ] Cập nhật `character_stats.total_cards_reviewed`

#### Edge Cases
- [ ] Empty due queue: hiển thị "All caught up! Next review: tomorrow (N cards due)"
- [ ] Session interrupted: resume từ đầu session (không mất cards)
- [ ] Batch submit: buffer results client-side trong session, POST 1 lần khi session kết thúc

---

### Character Screen

- [ ] `app/(app)/character/page.tsx`: Server Component
- [ ] `components/character/CharacterSheet.tsx`: full RPG profile
  - Avatar lớn + tier badge + class label + title
  - 4 stat bars: Focus, Discipline, Knowledge, Endurance (0–100)
  - XP bar + level progress
- [ ] `components/character/BadgeGrid.tsx`: locked/unlocked badges với rarity color
  - Locked badges hiện icon mờ + "Unlock at X" tooltip
- [ ] `components/character/ActivityTimeline.tsx`: recent XP events feed
- [ ] `components/character/StatChart.tsx`: 4 stat bars với labels

---

### Dashboard

- [ ] `app/(app)/dashboard/page.tsx`: Server Component (ISR revalidate = 60s)
- [ ] `components/dashboard/HeroCard.tsx`: Avatar + XP bar + 4 stat pills + "Next unlock" card
- [ ] `components/dashboard/QuestList.tsx`: daily quests với progress bars + "Resets in X:XX" countdown
- [ ] `components/dashboard/ToolGrid.tsx`: 3 tool shortcut cards (Pomodoro/Habits/Flashcards)
- [ ] `components/dashboard/WeeklyStats.tsx`: 4 mini-stat cards với delta vs tuần trước + sparkline
- [ ] `components/dashboard/RecentBadges.tsx`: last 3 badges earned

---

### Polish & QA

- [ ] Error boundaries cho mỗi tool section
- [ ] Skeleton loading states cho tất cả data-fetching components
- [ ] Empty states có CTA (deck rỗng, 0 habits, 0 sessions)
- [ ] Mobile responsive: sidebar collapse → bottom nav trên mobile
- [ ] `React.memo` cho heavy components: `Heatmap`, `XPBar`, `BadgeGrid`
- [ ] Test toàn bộ user flows:
  - Onboarding (signup → character creation → first tool)
  - Daily use (dashboard → start pomodoro → earn XP → level up)
  - Flashcard review session (chọn deck → flip → rate → summary)

---

### Production Deploy

- [ ] Tạo Supabase cloud project (region: Singapore)
- [ ] `supabase link --project-ref YOUR_REF`
- [ ] `supabase db push` — apply migrations lên cloud
- [ ] Set environment variables trên Vercel (cloud Supabase keys)
- [ ] Set Auth Redirect URL trong Supabase: `https://jl-tools.vercel.app/api/auth/callback`
- [ ] Enable Google OAuth (tạo credentials tại Google Cloud Console)
- [ ] Verify RLS policies bằng cách test với anonymous role
- [ ] Setup Sentry (error tracking): `npx @sentry/wizard@latest -i nextjs`
- [ ] Verify deploy trên production URL
- [ ] Smoke test toàn bộ flows trên production

---

## Definition of Done (per sprint)

Một sprint được coi là Done khi:
- [ ] Tất cả tasks đã checked
- [ ] `npm run lint` pass (0 errors)
- [ ] `npm run type-check` pass (0 TypeScript errors)
- [ ] App chạy được trên localhost với Supabase local
- [ ] User flows chính của sprint hoạt động end-to-end
- [ ] Code đã push lên `main` và CI pass

---

## Dependency Tree

```
Sprint 1 (Foundation)
    ↓
Sprint 2 (Pomodoro) ← cần: auth, XP engine, character_stats
    ↓
Sprint 3 (Habits) ← cần: auth, XP engine, streak function
    ↓
Sprint 4 (Flashcard + Ship) ← cần: auth, XP engine, SM-2 function, dashboard tổng hợp từ 3 tools
```

Sprint 2 và 3 độc lập về feature — có thể làm song song nếu có 2 developer.

---

## Packages cần install (đầy đủ)

```bash
# Core
npm install @supabase/supabase-js @supabase/ssr

# UI
npx shadcn@latest init
npx shadcn@latest add button dialog progress tabs switch tooltip dropdown-menu skeleton badge popover

# Animation
npm install framer-motion

# State
npm install zustand @tanstack/react-query

# Forms
npm install react-hook-form zod @hookform/resolvers

# Date
npm install date-fns date-fns-tz

# Icons
npm install lucide-react

# Drag & drop (cho Pomodoro task list)
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Monitoring (sau khi deploy)
npm install @vercel/analytics @vercel/speed-insights
npx @sentry/wizard@latest -i nextjs

# Dev
npm install -D supabase @tanstack/react-query-devtools
```
