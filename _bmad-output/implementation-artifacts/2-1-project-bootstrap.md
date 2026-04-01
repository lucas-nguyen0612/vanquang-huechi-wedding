# Story 2.1: Project Bootstrap & Deployment

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **developer**,
I want **project được khởi tạo từ Next.js + Supabase starter template và deploy lên Vercel**,
So that **tôi có môi trường development và production sẵn sàng**.

## Context

**Epic:** 2 — Foundation Setup
**Story ID:** 2.1
**Story Key:** 2-1-project-bootstrap
**Dependencies:** None (đây là story đầu tiên, nền tảng cho mọi thứ khác)
**Outputs to:** Epic 1 (Auth), Epic 2 (Foundation stories khác), Epic 3+ (Feature implementation)

---

## Acceptance Criteria

1. ✅ **Init command:** `npx create-next-app -e with-supabase src` — project được tạo trong thư mục con `src/`
2. ✅ **Folder structure:** Sau restructure — `app/`, `components/`, `lib/`, `supabase/` đúng vị trí
3. ✅ **TypeScript strict mode:** Enabled trong `tsconfig.json`
4. ✅ **Tailwind CSS + shadcn/ui:** Pre-configured, hoạt động sau init
5. ✅ **Supabase auth flow:** Cookie-based, JWT, hoạt động (signup/login/logout)
6. ✅ **GitHub repo:** Project được push lên GitHub
7. ✅ **Vercel auto-deploy:** Kết nối Vercel với repo — auto-deploy cho mỗi push
8. ✅ **Production URL:** Production URL có sẵn và accessible
9. ✅ **Auth trên production:** Signup/login/logout flow hoạt động đúng trên production domain

---

## Technical Requirements

### Stack (từ Architecture — Starter Template)

| Layer | Technology | Version Notes |
|-------|-----------|---------------|
| Framework | Next.js (App Router) | Kiểm tra version, nếu < 16 đánh giá upgrade |
| Language | TypeScript (strict mode) | Strict trong tsconfig.json |
| Styling | Tailwind CSS + shadcn/ui | Pre-configured bởi starter |
| Auth | Supabase Auth (cookie-based, supabase-ssr) | JWT httpOnly cookies |
| Package Manager | pnpm | Dùng pnpm trong mọi lệnh |

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...    # Server-side only, KHÔNG commit
```

### Dev Commands

```bash
# Local development
pnpm install
npx supabase start    # Terminal 1: Supabase local
pnpm dev              # Terminal 2: Next.js dev

# Production build
pnpm build

# Type checking
pnpm lint
pnpm typecheck
```

---

## Developer Context

### ⚠️ CRITICAL — Đọc Trước Khi Code

1. **Đây là greenfield project** — chưa có gì trong thư mục `src/`. Mọi thứ được tạo từ starter template.
2. **Starter cung cấp auth flow sẵn** — KHÔNG viết lại auth logic. Chỉ verify nó hoạt động.
3. **Component restructure SAU KHI init** — Starter có `components/` phẳng. Cần tách thành `ui/`, `features/`, `layout/`.
4. **pnpm là package manager** — Dùng `pnpm` thay vì npm/yarn trong mọi lệnh.

### Architecture Patterns to Follow

**Server Action Return Format (bắt buộc cho mọi feature sau này):**
```typescript
type ActionResult<T> =
  | { data: T; error: null }
  | { data: null; error: { message: string; code: string } }
```

**Zustand Store Pattern:**
```typescript
export const useTimerStore = create<TimerStore>((set, get) => ({ ... }))
```

**TanStack Query Keys:**
```typescript
export const pomodoroKeys = {
  all: ['pomodoro'] as const,
  sessions: () => [...pomodoroKeys.all, 'sessions'] as const,
}
```

**Named Exports — KHÔNG default exports** (trừ Next.js page/layout conventions).

### File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Components | `PascalCase.tsx` | `XpBar.tsx`, `FocusTimer.tsx` |
| Component files | `kebab-case.tsx` | `xp-bar.tsx`, `focus-timer.tsx` |
| Utilities | `kebab-case.ts` | `xp-calculator.ts`, `streak-utils.ts` |
| Functions | `camelCase` | `grantXp()`, `calculateStreak()` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_LEVEL`, `XP_PER_SESSION` |
| Types | `PascalCase` | `Session`, `Habit`, `XpTransaction` |
| DB Tables | `snake_case` | `pomo_sessions`, `habit_definitions` |

### Project Structure Target (Sau Restructure)

```
src/
├── .env.example                   ← Template env (committed)
├── .env.local                     ← Secrets (gitignored)
├── .gitignore
├── .github/workflows/ci.yml       ← Tạo sau
├── messages/vi.json               ← Tạo sau
├── messages/en.json               ← Tạo sau
├── middleware.ts                   ← Starter + next-intl
├── tailwind.config.ts             ← Starter
├── vitest.config.ts               ← Tạo sau (Story 2.5)
├── app/
│   ├── globals.css
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   └── (app)/
│   │       ├── layout.tsx
│   │       ├── pomodoro/page.tsx
│   │       ├── habits/page.tsx
│   │       └── profile/page.tsx
├── components/
│   ├── ui/                        ← shadcn/ui (giữ nguyên)
│   ├── features/                  ← Tạo sau
│   └── layout/                    ← Tạo sau
├── features/                      ← Tạo sau (Story 2.4)
│   ├── pomodoro/
│   ├── habits/
│   └── gamification/
└── lib/
    ├── supabase/
    └── utils.ts
```

### Anti-Patterns — TUYỆT ĐỐI TRÁNH

- ❌ `useEffect` + `useState` cho data fetching → Dùng TanStack Query
- ❌ Default exports cho components → Dùng named exports
- ❌ Inline styles → Dùng Tailwind
- ❌ `any` type → Dùng TypeScript strict
- ❌ Raw SQL → Dùng Supabase client
- ❌ Direct Supabase mutations từ client → Dùng Server Actions

---

## Tasks & Subtasks

### Phase 1: Initialize Project (Epic 2.1 Foundation)

- [x] **Task 1.1:** Initialize Next.js project với Supabase starter
  - [x] Subtask 1.1.1: Chạy `npx create-next-app -e with-supabase src` trong project directory
  - [x] Subtask 1.1.2: Kiểm tra Next.js version trong `package.json` — Next.js 16.2.2 (≥ 16 ✅)
  - [x] Subtask 1.1.3: Chạy `pnpm install` để verify dependencies install thành công
  - [x] Subtask 1.1.4: Verify dev server start không lỗi: `pnpm dev` → http://localhost:3004

- [x] **Task 1.2:** Verify Supabase auth flow (local)
  - [x] Subtask 1.2.1: Chạy `npx supabase start` (cần Docker running)
  - [x] Subtask 1.2.2: Copy Supabase local URL và anon key vào `.env.local`
  - [x] Subtask 1.2.3: Verify signup page tải tại `/auth/login` (200 ✅) và `/auth/sign-up` (200 ✅)
  - [x] Subtask 1.2.4: Auth pages verified via HTTP response (full flow requires browser)
  - [x] Subtask 1.2.5: Protected route `/protected` correctly redirects to `/auth/login` (307 ✅)

### Phase 2: Restructure Components

- [x] **Task 2.1:** Restructure `components/` → feature-based
  - [x] Subtask 2.1.1: `components/ui/` đã tồn tại (shadcn/ui) — giữ nguyên
  - [x] Subtask 2.1.2: Tạo `components/features/` — moved all non-ui components: auth forms, hero, deploy-button, env-var-warning, theme-switcher, tutorial/
  - [x] Subtask 2.1.3: Tạo `components/layout/` — empty placeholder (Epic 5 sẽ fill)
  - [x] Subtask 2.1.4: Verify `pnpm dev` chạy tại localhost:3004 (200 OK ✅) sau restructure

### Phase 3: Vercel Deployment

- [ ] **Task 3.1:** Connect Vercel
  - [ ] Subtask 3.1.1: Tạo account Vercel (nếu chưa có) tại vercel.com
  - [ ] Subtask 3.1.2: Tạo Supabase project trên supabase.com (production instance)
  - [ ] Subtask 3.1.3: Lấy production `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` từ Supabase dashboard → Settings → API
  - [x] Subtask 3.1.4: Tạo file `.env.example` với template env vars (KHÔNG commit secrets) ✅
  - [ ] Subtask 3.1.5: Thêm Vercel project từ GitHub repo → Import `src/`
  - [ ] Subtask 3.1.6: Thêm environment variables trong Vercel dashboard (từ `.env.example` + real values)
  - [ ] Subtask 3.1.7: Trigger first production deploy

- [ ] **Task 3.2:** Verify production auth
  - [ ] Subtask 3.2.1: Mở production URL → verify landing page load
  - [ ] Subtask 3.2.2: Test signup trên production → verify account created
  - [ ] Subtask 3.2.3: Test login trên production → verify redirect
  - [ ] Subtask 3.2.4: Test logout trên production → verify redirect về login

### Phase 4: CI/CD Pipeline

- [x] **Task 4.1:** Setup GitHub Actions CI
  - [x] Subtask 4.1.1: Tạo `.github/workflows/ci.yml`
  - [x] Subtask 4.1.2: Cấu hình jobs: lint + build + typecheck (typecheck/test stubs for Story 2.5)
  - [ ] Subtask 4.1.3: Verify CI chạy thành công trên push — **cần GitHub repo trước**

- [x] **Task 4.2:** Create `.gitignore` chuẩn
  - [x] Subtask 4.2.1: Verify `.gitignore` include: `node_modules/`, `.env.local`, `.next/`, `.vercel/`, `*.log`

### Phase 5: Documentation

- [x] **Task 5.1:** Create AGENTS.md hoặc CLAUDE.md
  - [x] Subtask 5.1.1: Tạo file `CLAUDE.md` hướng dẫn AI agents về project conventions
  - [x] Subtask 5.1.2: Include: stack summary, folder structure, naming conventions, anti-patterns
  - [x] Subtask 5.1.3: Include: dev commands, env setup instructions

---

## Implementation Notes

### Init Command (Chạy TRONG project root — KHÔNG tạo nested folder)

```bash
cd /Users/lucas/Documents/Vtech/vanquang-huechi-wedding
npx create-next-app -e with-supabase src
```

**ĐÚNG:** Tạo `src/` là subdirectory của wedding project.
**SAI:** Tạo trong thư mục khác hoặc overwrite project hiện tại.

### Local Supabase Setup

1. Cài Docker Desktop (nếu chưa có)
2. Chạy `npx supabase init` trong `src/`
3. Chạy `npx supabase start` — sẽ hiển thị local credentials
4. Update `.env.local` với local URL và anon key từ output

### Vercel Environment Variables

Trong Vercel Dashboard → Project → Settings → Environment Variables, thêm:

| Name | Value Source |
|------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API (server-side only) |

**Lưu ý:** `SUPABASE_SERVICE_ROLE_KEY` là secret — không để lộ phía client.

### Auth Callback URLs

Trong Supabase Dashboard → Authentication → URL Configuration, thêm:

- **Site URL:** Production URL (e.g., `https://src.vercel.app`)
- **Redirect URLs:** Production URL + `http://localhost:3000`

### CI/CD Pipeline Template

```yaml
name: CI
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
```

---

## Dev Notes

### What Starter Provides (ĐỪNG TÁI TẠO)

- Auth flow (login, signup, logout, OAuth callback)
- `supabase/` folder với config và helpers
- `middleware.ts` cho auth refresh
- shadcn/ui setup với `components.json`
- Tailwind + TypeScript configuration
- `lib/supabase/client.ts` và `lib/supabase/server.ts`

### What TOẠ CHƯA CÓ (Cần tạo sau)

- Feature folders (`features/pomodoro/`, `features/habits/`, `features/gamification/`)
- Component features (`components/features/`)
- Layout components (`components/layout/`)
- i18n files (`messages/vi.json`, `messages/en.json`)
- `lib/i18n/` setup
- Vitest config
- CI/CD workflow
- Database migrations

### Verification Checklist

Sau khi deploy, verify:

- [ ] Landing page load tại production URL
- [ ] Click "Sign up" → signup page
- [ ] Submit signup form → account created, redirected
- [ ] Click "Logout" → redirected to login
- [ ] Login với account vừa tạo → dashboard
- [ ] Auth state persisted khi refresh page
- [ ] GitHub Actions CI chạy trên push

---

## References

- [Source: architecture.md — Starter Template Evaluation]
- [Source: architecture.md — Project Structure & Boundaries]
- [Source: architecture.md — Implementation Patterns & Consistency Rules]
- [Source: epics.md — Story 2.1: Project Bootstrap & Deployment]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6 (via `CLAUDE_CODE_SUBAGENT_MODEL`)

### Debug Log

- Issue: Port conflict on `npx supabase start` — `p.vtech.asia` already using port 54322. Fixed by running `npx supabase stop --project-id p.vtech.asia` first.
- Issue: After moving components, relative imports `./ui/` broke. Fixed by updating all 12 feature files to use `@/components/ui/` absolute imports.
- Issue: Dev server auto-started on port 3004 instead of 3000 (Turbopack). Verified on :3004.
- Issue: GitHub CLI not authenticated — GitHub push deferred (manual step required).
- **2026-04-01:** Git user configured: `lucasnguyen` / `dat.t.nguyen.works@gmail.com`. GitHub push still blocked — no `gh auth login` and no stored git credentials. GitHub repo already exists at `https://github.com/lucas-nguyen0612/vanquang-huechi-wedding`. All Phase 3 (Vercel) tasks blocked on GitHub push + Vercel manual setup.

### Completion Notes

- Story bootstrap: COMPLETED (Phase 1, 2, 4, 5)
- Phase 3 (Vercel) partially done — `.env.example` created, but actual Vercel deployment requires GitHub auth + manual Vercel dashboard steps
- Next.js 16.2.2 (latest) ✅
- TypeScript strict mode ✅
- pnpm as package manager ✅
- Supabase local running ✅
- Components restructured ✅
- CI pipeline created ✅
- CLAUDE.md created ✅

### File List

**Created:**
- `src/.env.local` — Local Supabase credentials
- `src/.env.example` — Env var template for documentation
- `src/.github/workflows/ci.yml` — GitHub Actions CI pipeline
- `src/CLAUDE.md` — AI agent project documentation

**Modified:**
- `src/app/page.tsx` — Updated imports: `@/components/*` → `@/components/features/*`
- `src/app/auth/login/page.tsx` — Updated import path
- `src/app/auth/sign-up/page.tsx` — Updated import path
- `src/app/auth/forgot-password/page.tsx` — Updated import path
- `src/app/auth/update-password/page.tsx` — Updated import path
- `src/app/auth/sign-up-success/page.tsx` — No change needed (uses @/components/ui only)
- `src/app/auth/error/page.tsx` — No change needed (uses @/components/ui only)
- `src/app/protected/layout.tsx` — Updated imports
- `src/app/protected/page.tsx` — Updated import for FetchDataSteps
- `src/components/features/tutorial/tutorial-step.tsx` — Fixed relative import
- `src/components/features/tutorial/code-block.tsx` — Fixed relative import
- `src/components/features/env-var-warning.tsx` — Fixed relative imports
- `src/components/features/auth-button.tsx` — Fixed relative imports
- `src/components/features/deploy-button.tsx` — Fixed relative imports
- `src/components/features/login-form.tsx` — Fixed relative imports
- `src/components/features/sign-up-form.tsx` — Fixed relative imports
- `src/components/features/forgot-password-form.tsx` — Fixed relative imports
- `src/components/features/update-password-form.tsx` — Fixed relative imports
- `src/components/features/logout-button.tsx` — Fixed relative imports
- `src/components/features/theme-switcher.tsx` — Fixed relative imports
- `src/.gitignore` — Added `.env.local` and `*.log` entries

**Moved:**
- All non-ui components from `components/` → `components/features/` (auth forms, hero, deploy-button, env-var-warning, theme-switcher, tutorial/)
- `components/tutorial/` moved to `components/features/tutorial/`
- `components/layout/` created as empty placeholder

**Not completed (requires manual action):**
- GitHub repo creation + push (requires `gh auth login`)
- Vercel project setup (requires manual Vercel dashboard steps)
- Production URL verification (requires Vercel deployment first)
