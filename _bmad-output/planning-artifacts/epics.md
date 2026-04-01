---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories']
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
---

# bmad-test - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for JL-Tools, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**1. User Management & Authentication (FR1-FR8)**

- FR1: User can dang ky tai khoan moi bang email/password
- FR2: User can dang ky va dang nhap bang Google OAuth
- FR3: User can dang nhap vao tai khoan hien co
- FR4: User can dang xuat khoi phien dang nhap
- FR5: User can xem va chinh sua thong tin profile (display name, avatar)
- FR6: User can reset password qua email
- FR7: System tu dong tao profile record khi user dang ky thanh cong
- FR8: User chi co the truy cap du lieu cua chinh minh (data isolation)

**2. Pomodoro Focus Sessions (FR9-FR19)**

- FR9: User can bat dau mot phien Pomodoro focus moi
- FR10: User can tuy chinh thoi luong focus, short break, long break, va so phien truoc long break
- FR11: User can xem timer dem nguoc chinh xac trong suot phien
- FR12: User can tam dung (pause) phien dang chay va tiep tuc (resume)
- FR13: User can huy (cancel) phien dang chay
- FR14: User can gan label tuy chon cho moi phien
- FR15: System tu dong chuyen trang thai: focus -> short break -> focus -> ... -> long break
- FR16: System ghi nhan moi phien hoan thanh/huy voi timestamp va duration thuc te
- FR17: User can kich hoat Focus Mode — an sidebar, navigation, notifications; chi hien timer, session count, XP preview
- FR18: Timer hoat dong chinh xac bat ke trang thai network
- FR19: User can xem so phien da hoan thanh va tong phut focus trong ngay

**3. Habit Tracking (FR20-FR31)**

- FR20: User can tao habit moi voi ten, icon, mau sac
- FR21: User can chinh sua thong tin habit hien co
- FR22: User can xoa hoac archive habit
- FR23: User can cau hinh tan suat: daily, weekly, hoac custom (chon ngay cu the)
- FR24: User can xem danh sach habits can thuc hien hom nay
- FR25: User can check-in mot habit cho ngay hien tai
- FR26: User can bo check-in (undo) neu danh dau nham
- FR27: System tu dong tinh toan current streak va longest streak
- FR28: System tu dong reset streak ve 0 khi miss (khong phat them)
- FR29: User can xem streak count va trang thai cho moi habit
- FR30: User can xem progress bar % habits hoan thanh trong tuan
- FR31: User can sap xep thu tu hien thi cua cac habits

**4. Gamification & Progression (FR32-FR40)**

- FR32: System tu dong grant XP khi hoan thanh phien Pomodoro focus
- FR33: System tu dong grant XP khi check-in habit
- FR34: System ghi nhan moi XP transaction voi source, amount, timestamp
- FR35: User can xem tong XP va XP bar tren sidebar
- FR36: User can xem level hien tai va title (vi/en)
- FR37: System tu dong detect khi dat du XP de level up
- FR38: System hien thi celebration khi level up
- FR39: User can xem XP bar animate khi nhan XP moi
- FR40: System ho tro 20 levels, moi level co XP threshold va title rieng

**5. Dashboard & Statistics (FR41-FR45)**

- FR41: User can xem tong quan ngay: so phien Pomodoro + habits completed
- FR42: User can xem daily Pomodoro stats: so phien, tong phut focus
- FR43: User can xem weekly habit progress: % completion
- FR44: User can xem profile page: level, total XP, stats tong hop
- FR45: User can xem lich su XP transactions

**6. Platform Navigation & Layout (FR46-FR50)**

- FR46: User can dieu huong giua tools qua sidebar (desktop) hoac bottom nav (mobile)
- FR47: User can xem logo, avatar, level, XP bar tren navigation
- FR48: System tu dong chuyen layout theo kich thuoc man hinh
- FR49: User can collapse/expand sidebar tren desktop
- FR50: Focus Mode tu dong an navigation khi trong phien Pomodoro

**7. Internationalization & Preferences (FR51-FR55)**

- FR51: User can chuyen doi ngon ngu giua Tieng Viet va English
- FR52: System luu locale preference va ap dung khi dang nhap lai
- FR53: Moi noi dung tinh hien thi theo ngon ngu da chon
- FR54: Level titles hien thi theo ngon ngu cua user
- FR55: System hien thi dark theme mac dinh

**8. Data Integrity & Sync (FR56-FR60)**

- FR56: System dam bao khong mat du lieu khi offline va tu dong cap nhat khi co ket noi
- FR57: System dam bao khong duplicate XP grant cho cung mot hanh dong
- FR58: System dam bao moi habit chi check-in mot lan/ngay
- FR59: User can xem trang thai sync (synced/pending)
- FR60: System tu dong cap nhat daily stats khi co session/check-in moi

### NonFunctional Requirements

**Performance**

- NFR1: Page load FCP < 1.5s
- NFR2: Interactivity TTI < 3s
- NFR3: Timer accuracy drift/25min < 1s
- NFR4: Timer start click -> countdown < 100ms
- NFR5: XP feedback action -> animate < 500ms
- NFR6: Check-in response tap -> confirm < 200ms
- NFR7: Layout shift CLS < 0.1
- NFR8: Bundle size gzipped < 200KB

**Security**

- NFR9: Auth tokens JWT httpOnly cookies
- NFR10: Data isolation database-level enforcement (RLS)
- NFR11: Transport HTTPS only (TLS 1.2+)
- NFR12: Storage managed database encryption
- NFR13: Input sanitize all user input (prevent XSS, SQL injection)
- NFR14: CSRF token-based auth protection
- NFR15: Rate limit 100 req/min/user
- NFR16: Password min 8 characters

**Scalability**

- NFR17: Concurrent MVP peak 50 simultaneous users
- NFR18: DB growth 500 users x 3 months < 100MB
- NFR19: Growth 10x users < 10% perf degradation
- NFR20: Stateless horizontal scaling support

**Accessibility**

- NFR21: Contrast WCAG 2.1 AA 4.5:1 text, 3:1 large text
- NFR22: Keyboard WCAG 2.1 AA all elements via Tab
- NFR23: Screen reader WCAG 2.1 AA aria-live timer, semantic HTML
- NFR24: Focus WCAG 2.1 AA visible focus rings
- NFR25: Motion WCAG 2.1 AA respect prefers-reduced-motion
- NFR26: Touch mobile min 44x44px targets

**Reliability**

- NFR27: Uptime availability >= 99.5% monthly
- NFR28: Timer network independence
- NFR29: Data no loss on session completion regardless of network state
- NFR30: Errors graceful degradation with error description and retry option
- NFR31: Tab handling timer maintains accuracy when browser tab is inactive/switched

### Additional Requirements

**From Architecture:**

- Starter template: `npx create-next-app -e with-supabase src` — Epic 1 Story 1 phai su dung starter nay
- Story 0 bootstrap sequence: init project, verify auth, restructure components, deploy skeleton to Vercel
- Story 1 foundation: add next-intl, configure dark neon theme, add Vitest + testing-library, create feature folders
- Database: single schema voi table naming prefix convention (pomo_, habit_, gam_)
- XP deduplication: unique constraint `xp_transactions(source_type, source_ref_id)` + application-level check
- Timer engine: timestamp-based approach voi Zustand store
- State management: Zustand (timer, focus mode), TanStack Query (server state), React Context (auth, locale)
- Data validation: Zod cho tat ca input validation
- Form handling: React Hook Form + Zod resolver
- API pattern: Server Actions (mutations) + Supabase Client direct (reads)
- Server Action return format: `{ data, error }` pattern bat buoc
- Error handling: centralized error boundary + toast notifications
- CI/CD: Vercel auto-deploy + GitHub Actions lint/test gate
- Monitoring: Vercel Analytics + Supabase Dashboard cho MVP
- Feature boundaries: khong cross-import giua features tren client-side
- Cross-feature communication: qua TanStack Query invalidation
- Code splitting: Next.js App Router automatic + dynamic imports cho heavy components
- Project structure: feature-based organization (features/pomodoro, features/habits, features/gamification)
- Test organization: co-located tests, Arrange-Act-Assert pattern
- RLS policies: `auth.uid() = user_id` tren moi table
- Supabase migrations: sequential numbering trong supabase/migrations/

**From UX Design:**

- Responsive breakpoints: Mobile 375-768px, Tablet 768-1024px, Desktop 1024+, Large desktop 1280+
- Typography: Inter (UI) + JetBrains Mono (timer display)
- Custom components can build: XpBar, FocusTimerHero, StreakBadge, HabitCheckInCard, LevelUpModal, SyncStatusBadge, DailyMomentumPanel
- Animation feedback < 500ms cho reward loops
- Focus Mode design: hide sidebar/chrome, timer hero, immersive background
- Streak fire gradient system: muted gray (1-2d) -> yellow (3-6d) -> orange (7-13d) -> pink (14-29d) -> blazing gradient (30+d)
- WCAG 2.1 AA compliance, prefers-reduced-motion support
- 1 primary CTA per screen
- Empty states phai co CTA ro rang, khong dead end
- Gentle messaging cho streak reset (khong guilt)
- Mobile: bottom nav, hub compact, thumb zone optimization
- Desktop: Mission Control Sidebar + Timer Hero + habits/progress panels
- Design direction: hybrid Mission Control Sidebar + Focus Arena + Dual Track Workspace
- Button hierarchy: Primary (accent), Secondary (outline/ghost), Tertiary (text), Destructive (confirm)
- Toast cho feedback ngan, modal chi cho moments lon
- Skeleton loading cho initial page loads

### FR Coverage Map

**Epic 1: Authentication & User Identity**

- FR1: Epic 1 - User đăng ký bằng email/password
- FR2: Epic 1 - User đăng ký/đăng nhập bằng Google OAuth
- FR3: Epic 1 - User đăng nhập vào tài khoản hiện có
- FR4: Epic 1 - User đăng xuất khỏi phiên
- FR5: Epic 1 - User xem và chỉnh sửa profile (name, avatar)
- FR6: Epic 1 - User reset password qua email
- FR7: Epic 1 - System tự động tạo profile khi đăng ký
- FR8: Epic 1 - Data isolation - user chỉ truy cập dữ liệu của mình

**Epic 2: Foundation Setup**

- (Technical foundation - tạo database schema, theme tokens, testing, CI/CD)

**Epic 3: Focus Timer — Pomodoro Sessions**

- FR9: Epic 3 - User bắt đầu phiên Pomodoro focus mới
- FR10: Epic 3 - User tùy chỉnh thời lượng timer
- FR11: Epic 3 - User xem timer đếm ngược chính xác
- FR12: Epic 3 - User tạm dừng (pause) và tiếp tục (resume) phiên
- FR13: Epic 3 - User hủy (cancel) phiên đang chạy
- FR14: Epic 3 - User gắn label tùy chọn cho mỗi phiên
- FR15: Epic 3 - System tự động chuyển trạng thái focus/break
- FR16: Epic 3 - System ghi nhận phiên hoàn thành/hủy với timestamp
- FR17: Epic 3 - User kích hoạt Focus Mode (ẩn sidebar, chỉ hiện timer)
- FR18: Epic 3 - Timer hoạt động khi offline
- FR19: Epic 3 - User xem số phiên và tổng phút focus trong ngày

**Epic 4: Habit Tracker — Building Daily Routines**

- FR20: Epic 4 - User tạo habit mới với name, icon, color
- FR21: Epic 4 - User chỉnh sửa habit hiện có
- FR22: Epic 4 - User xóa hoặc archive habit
- FR23: Epic 4 - User cấu hình tần suất (daily/weekly/custom)
- FR24: Epic 4 - User xem danh sách habits cần thực hiện hôm nay
- FR25: Epic 4 - User check-in habit cho ngày hiện tại
- FR26: Epic 4 - User bỏ check-in (undo) nếu đánh dấu nhầm
- FR27: Epic 4 - System tính current streak và longest streak
- FR28: Epic 4 - System reset streak về 0 khi miss (không phạt thêm)
- FR29: Epic 4 - User xem streak count cho mỗi habit
- FR30: Epic 4 - User xem progress bar % habits trong tuần
- FR31: Epic 4 - User sắp xếp thứ tự hiển thị habits

**Epic 5: Progress & Navigation Shell**

- FR41: Epic 5 - User xem tổng quan ngày (sessions + habits completed)
- FR42: Epic 5 - User xem daily Pomodoro stats
- FR43: Epic 5 - User xem weekly habit progress
- FR44: Epic 5 - User xem profile page với level, XP, stats
- FR45: Epic 5 - User xem lịch sử XP transactions
- FR46: Epic 5 - User điều hướng qua sidebar (desktop) hoặc bottom nav (mobile)
- FR47: Epic 5 - User xem logo, avatar, level, XP bar trên navigation
- FR48: Epic 5 - System tự động chuyển layout theo màn hình
- FR49: Epic 5 - User collapse/expand sidebar trên desktop
- FR50: Epic 5 - Focus Mode tự động ẩn navigation

**Epic 6: Cross-Tool Gamification — Unified XP System**

- FR32: Epic 3/6 - System grant XP khi hoàn thành Pomodoro
- FR33: Epic 4/6 - System grant XP khi check-in habit
- FR34: Epic 3/6 - System ghi nhận XP transaction (source, amount, timestamp)
- FR35: Epic 5/6 - User xem XP bar trên sidebar
- FR36: Epic 5/6 - User xem level và title (vi/en)
- FR37: Epic 3/6 - System detect level up
- FR38: Epic 3/6 - System hiển thị celebration khi level up
- FR39: Epic 3/6 - User xem XP bar animate khi nhận XP
- FR40: Epic 6 - System hỗ trợ 20 levels với title riêng

**Epic 7: Polish, i18n & Cross-Cutting**

- FR51: Epic 7 - User chuyển đổi ngôn ngữ vi/en
- FR52: Epic 7 - System lưu locale preference
- FR53: Epic 7 - Mọi nội dung hiển thị theo ngôn ngữ đã chọn
- FR54: Epic 7 - Level titles hiển thị theo ngôn ngữ user
- FR55: Epic 7 - System hiển thị dark theme mặc định
- FR56: Epic 7 - System không mất dữ liệu khi offline
- FR57: Epic 7 - System không duplicate XP grant
- FR58: Epic 7 - System đảm bảo habit check-in 1 lần/ngày
- FR59: Epic 7 - User xem trạng thái sync
- FR60: Epic 7 - System tự động cập nhật daily stats

## Epic List

### Epic 1: Authentication & User Identity

**Mục tiêu:** User có thể đăng ký, đăng nhập, và quản lý profile cá nhân một cách bảo mật.

**User outcome:** Mọi người có tài khoản riêng, bảo mật, cá nhân hóa — dữ liệu hoàn toàn cô lập giữa các users.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8

**Implementation notes:**
- Starter template `create-next-app -e with-supabase` cung cấp auth flow sẵn
- RLS policies đảm bảo data isolation ở database level
- Profile auto-creation trigger khi user đăng ký thành công

---

### Story 1.1: Authentication Flow — Registration, Login, OAuth, Logout

As a **user**,
I want to **register, log in, and log out of my account securely**,
So that **I can access my personal productivity data safely**.

**Acceptance Criteria:**

**Given** I am on the login page and do not have an account
**When** I click "Đăng ký" (Register)
**Then** I am taken to the registration page

**Given** I am on the registration page
**When** I enter a valid email and a password with at least 8 characters
**And** I click "Đăng ký"
**Then** my account is created successfully
**And** I am automatically logged in
**And** I am redirected to the main app dashboard
**And** a profile record is automatically created for me (FR7)

**Given** I am on the registration page
**When** I enter an invalid email format
**Then** a validation error is shown: "Email không hợp lệ"

**Given** I am on the registration page
**When** I enter a password with fewer than 8 characters
**Then** a validation error is shown: "Mật khẩu phải có ít nhất 8 ký tự"

**Given** I am on the registration page
**When** I click "Đăng ký với Google"
**Then** I am redirected to Google's OAuth consent screen

**Given** I have authorized Google OAuth
**When** Google returns successfully
**Then** I am logged in with my Google account
**And** I am redirected to the main app dashboard
**And** a profile record is automatically created for me (FR7)

**Given** I am on the login page
**When** I enter my correct email and password
**And** I click "Đăng nhập"
**Then** I am logged in successfully
**And** I am redirected to the main app dashboard

**Given** I am on the login page
**When** I enter an incorrect password
**Then** an error is shown: "Email hoặc mật khẩu không đúng"
**And** I remain on the login page

**Given** I am on the login page
**When** I click "Đăng nhập với Google"
**Then** I am redirected to Google's OAuth consent screen

**Given** I am logged in
**When** I click "Đăng xuất" (Logout) in the profile menu
**Then** my session is terminated
**And** I am redirected to the login page
**And** I cannot access app pages without logging in again

---

### Story 1.2: Password Reset via Email

As a **user**,
I want to **reset my password if I forget it**,
So that **I can recover access to my account**.

**Acceptance Criteria:**

**Given** I am on the login page
**When** I click "Quên mật khẩu?" (Forgot password?)
**Then** I am taken to the password reset request page

**Given** I am on the password reset request page
**When** I enter my registered email address
**And** I click "Gửi email đặt lại"
**Then** a password reset email is sent to my email address
**And** a success message is shown: "�ã gửi email đặt lại mật khẩu"

**Given** I am on the password reset request page
**When** I enter an email that is not registered
**Then** no email is sent
**And** I see a success message (to prevent email enumeration attacks)

**Given** I receive a password reset email
**When** I click the reset link in the email
**Then** I am taken to a password reset page
**And** the link contains a valid, non-expired token

**Given** I am on the password reset page with a valid token
**When** I enter a new password (at least 8 characters)
**And** I click "Đặt lại mật khẩu"
**Then** my password is updated
**And** I am redirected to the login page
**And** I can log in with my new password

**Given** I am on the password reset page with an expired or invalid token
**When** I try to set a new password
**Then** an error is shown: "Liên kết đã hết hạn hoặc không hợp lệ"
**And** I am redirected to the login page

---

### Story 1.3: Profile Viewing and Editing

As a **user**,
I want to **view and edit my profile information**,
So that **I can personalize my account**.

**Acceptance Criteria:**

**Given** I am logged in
**When** I click my avatar or name in the navigation
**Then** I am taken to my Profile page

**Given** I am on my Profile page
**When** the page loads
**Then** I see my current display name
**And** I see my avatar (from Google OAuth or a default avatar)
**And** I see my current level and title
**And** I see my total XP

**Given** I am on my Profile page
**When** I click "Chỉnh sửa" (Edit)
**Then** the edit form is displayed

**Given** the edit form is displayed
**When** I change my display name to a valid name (1–50 characters)
**And** I click "Lưu"
**Then** my display name is updated
**And** the new name appears everywhere (navigation, profile page, etc.)

**Given** the edit form is displayed
**When** I leave the display name blank
**Then** a validation error is shown: "Tên hiển thị là bắt buộc"

**Given** the edit form is displayed
**When** I change my avatar
**Then** a file picker opens allowing me to select an image

**Given** the edit form is displayed
**When** I select a valid image file (JPG, PNG, WebP, max 2MB)
**And** I click "Lưu"
**Then** my avatar is updated
**And** the new avatar appears in navigation and profile page

**Given** the edit form is displayed
**When** I select an image file that is too large (> 2MB)
**Then** a validation error is shown: "Ảnh phải nhỏ hơn 2MB"

**Given** the edit form is displayed
**When** I select a non-image file
**Then** a validation error is shown: "Vui lòng chọn file ảnh (JPG, PNG, WebP)"

---

### Story 1.4: Data Isolation — Users Can Only Access Their Own Data

As a **system**,
I want to **enforce data isolation at the database level using Row Level Security (RLS)**,
So that **User A can never see or modify User B's data**.

**Acceptance Criteria:**

**Given** I am logged in as User A
**When** I query any table (profiles, pomodoro_sessions, habit_definitions, habit_entries, gam_xp_transactions)
**Then** only rows belonging to User A are returned
**And** rows belonging to any other user are NOT returned

**Given** I am logged in as User A
**When** I try to directly insert a row into any table with another user's user_id
**Then** the database rejects the insert
**And** an RLS policy violation error is returned

**Given** I am logged in as User A
**When** I try to directly update or delete a row belonging to another user
**Then** the database rejects the update/delete
**And** an RLS policy violation error is returned

**Given** I am NOT logged in (no valid session)
**When** I try to query any application table
**Then** no rows are returned
**And** the database enforces RLS — unauthenticated users see nothing

**Given** a Supabase RLS policy is applied to a table
**When** I inspect the policy
**Then** the policy condition is `auth.uid() = user_id` for all user-owned tables
**And** the policy applies to ALL operations (SELECT, INSERT, UPDATE, DELETE)

---

### Epic 2: Foundation Setup

**Mục tiêu:** Tạo nền tảng kỹ thuật vững chắc: database schema, UI theme tokens, testing infrastructure, và CI/CD pipeline.

**User outcome:** Dev có môi trường phát triển ổn định, codebase tổ chức rõ ràng, deploy pipeline tự động.

**Implementation notes:**
- Database migrations với Supabase (profiles, pomodoro_sessions, habit_definitions, habit_entries, gam_xp_transactions, gam_levels)
- Tailwind config với JL-Tools dark neon tokens
- Vitest + testing-library setup
- GitHub Actions CI gate (lint + test)
- Feature folder structure (features/pomodoro, features/habits, features/gamification)

---

### Epic 3: Focus Timer — Pomodoro Sessions

**Mục tiêu:** User có thể chạy các phiên Pomodoro focus với timer chính xác, tùy chỉnh linh hoạt, nhận XP khi hoàn thành, và trải nghiệm Focus Mode immersive.

**User outcome:** User hoàn thành phiên focus đầu tiên → thấy XP bar animate → "Ồ, satisfying!" — đây là aha moment sớm nhất.

**FRs covered:** FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR32, FR33, FR34, FR37, FR38, FR39

**Implementation notes:**
- Zustand store cho timer state (timestamp-based approach)
- Client-side timer hoạt động offline
- XP grant tự động khi hoàn thành (với deduplication)
- Focus Mode ẩn sidebar, chỉ hiện timer + session count + XP preview
- Celebration modal khi hoàn thành hoặc level up

---

### Epic 4: Habit Tracker — Building Daily Routines

**Mục tiêu:** User có thể tạo habits, check-in hàng ngày, theo dõi streak, và nhận XP khi hoàn thành — xây dựng thói quen bền vững.

**User outcome:** User xây dựng được thói quen hàng ngày với streak fire (🔥) và momentum. Miss habit → streak reset nhưng không mất XP (gentle approach).

**FRs covered:** FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27, FR28, FR29, FR30, FR31, FR33

**Implementation notes:**
- Habit CRUD với React Hook Form + Zod validation
- Streak calculation: current streak + longest streak, tự động reset khi miss
- Streak fire gradient: gray (1-2d) → yellow (3-6d) → orange (7-13d) → pink (14-29d) → blazing (30+d)
- XP grant tự động khi check-in
- Optimistic UI cho check-in interaction (< 200ms)

---

### Epic 5: Progress & Navigation Shell

**Mục tiêu:** User có bức tranh toàn cảnh về tiến độ cá nhân, điều hướng mượt mà giữa Pomodoro và Habits, truy cập profile và stats.

**User outcome:** Dashboard mission control — user luôn thấy XP bar, level, navigation, và daily momentum summary. Cross-tool switching không reset context.

**FRs covered:** FR35, FR36, FR41, FR42, FR43, FR44, FR45, FR46, FR47, FR48, FR49, FR50

**Implementation notes:**
- Shared layout: sidebar (desktop) + bottom nav (mobile)
- XP bar + level badge persistent trên navigation
- Daily momentum panel: sessions + habits summary + next best action
- Responsive breakpoints: 375px (mobile), 768px (tablet), 1024px (desktop)
- Focus Mode state toggle (hide/show navigation chrome)

---

### Epic 6: Cross-Tool Gamification — Unified XP System

**Mục tiêu:** XP từ Pomodoro và Habits hợp nhất vào cùng một hệ thống progression, tạo ra incentive mạnh để dùng cả hai tools.

**User outcome:** Unified XP System hoạt động xuyên suốt — dùng càng nhiều tool → tiến bộ càng nhanh → đây là differentiator cốt lõi. ≥40% users dùng cả 2 tools trong cùng tuần.

**FRs covered:** FR32, FR33, FR34, FR35, FR36, FR37, FR38, FR39, FR40

**Implementation notes:**
- Centralized XP engine với transaction log và deduplication constraint
- 20 levels với XP thresholds và titles (vi/en)
- Level-up detection → celebration modal
- XP animation < 500ms feedback loop
- Cross-tool XP aggregation qua TanStack Query invalidation

---

### Epic 7: Polish, i18n & Cross-Cutting

**Mục tiêu:** App hoàn thiện: đa ngôn ngữ vi/en, responsive polish trên mọi thiết bị, offline resilience, sync status, và CI/CD hoàn chỉnh.

**User outcome:** App hoạt động mượt mà trên mọi thiết bị (375px+), mọi ngôn ngữ, không lo mất dữ liệu dù internet không ổn định.

**FRs covered:** FR51, FR52, FR53, FR54, FR55, FR56, FR57, FR58, FR59, FR60

**Implementation notes:**
- next-intl cho i18n (vi/en) với [locale] routing
- Offline queue: timer 100% client-side, session/check-in sync on reconnect
- SyncStatusBadge component cho pending sync states
- WCAG 2.1 AA compliance: contrast, keyboard nav, screen reader, reduced motion
- Vercel auto-deploy + GitHub Actions lint/test gate hoàn chỉnh

---

### Story 7.1: Internationalization — Vietnamese & English

As a **user**,
I want **chuyển đổi ngôn ngữ giữa Tiếng Việt và English**,
So that **tôi có thể sử dụng app bằng ngôn ngữ quen thuộc**.

**Acceptance Criteria:**

**Given** tôi đăng nhập
**When** tôi bấm language switcher
**Then** tôi có thể chọn "Tiếng Việt" hoặc "English"

**Given** tôi chọn English
**When** tôi sử dụng app
**Then** mọi nội dung tĩnh hiển thị bằng tiếng Anh

**Given** tôi chọn Tiếng Việt
**When** tôi sử dụng app
**Then** mọi nội dung tĩnh hiển thị bằng tiếng Việt

---

### Story 7.2: Locale Persistence — Remember User Preference

As a **user**,
I want **locale preference được lưu lại**,
So that **tôi không phải chọn ngôn ngữ mỗi lần đăng nhập**.

**Acceptance Criteria:**

**Given** tôi đặt ngôn ngữ là English
**When** tôi đăng xuất và đăng nhập lại
**Then** app vẫn hiển thị English

**Given** tôi đặt ngôn ngữ là Tiếng Việt
**When** tôi refresh trang
**Then** app vẫn hiển thị Tiếng Việt

---

### Story 7.3: Theme Preference — Dark Mode Default

As a **user**,
I want **app hiển thị dark theme mặc định và nhớ theme preference**,
So that **tôi có trải nghiệm neon immersive ngay từ đầu**.

**Acceptance Criteria:**

**Given** tôi là user mới đăng nhập lần đầu
**When** app load
**Then** dark theme được active mặc định
**And** tôi không cần setup gì thêm

**Given** dark theme đang active
**When** app render
**Then** background sử dụng `#0a0a0f` (bg-primary)
**And** accent neon-green `#00ff88` được dùng cho XP bar và primary CTAs

---

### Story 7.4: Offline Resilience — Timer Works Without Network

As a **user**,
I want **timer vẫn hoạt động khi mất mạng**,
So that **tôi không bị gián đoạn khi internet không ổn định**.

**Acceptance Criteria:**

**Given** tôi đang chạy phiên Pomodoro
**When** internet mất kết nối
**Then** timer vẫn đếm bình thường

**Given** internet mất kết nối trong khi timer chạy
**When** timer đếm về 00:00
**Then** completion được ghi nhận trong local state
**And** message hiển thị: "XP sẽ cập nhật khi có kết nối"

**Given** internet quay lại
**When** kết nối được khôi phục
**Then** session được sync lên server tự động
**And** XP được grant

---

### Story 7.5: Offline Queue — Session & Check-in Sync

As a **user**,
I want **dữ liệu được sync tự động khi có kết nối**,
So that **không có dữ liệu bị mất**.

**Acceptance Criteria:**

**Given** tôi hoàn thành phiên Pomodoro khi offline
**When** internet quay lại
**Then** session được push lên server tự động
**And** XP được grant

**Given** tôi check-in habit khi offline
**When** internet quay lại
**Then** check-in được sync lên server
**And** streak được tính đúng

**Given** tôi có nhiều actions khi offline (3 sessions, 5 check-ins)
**When** internet quay lại
**Then** tất cả được sync đúng thứ tự thời gian

---

### Story 7.6: Sync Status Badge — Visibility

As a **user**,
I want **thấy trạng thái sync khi có pending data**,
So that **tôi biết dữ liệu có an toàn không**.

**Acceptance Criteria:**

**Given** tôi đang offline và có pending actions
**When** tôi xem app
**Then** sync badge hiển thị: "Đang đồng bộ..." hoặc "Chờ kết nối"

**Given** sync đang diễn ra
**When** tôi xem app
**Then** badge hiển thị: "Đang đồng bộ... (3)"

**Given** sync hoàn tất
**When** tôi xem app
**Then** badge biến mất hoặc hiển thị ✓

**Given** sync thất bại
**When** tôi xem app
**Then** badge hiển thị: "Đồng bộ thất bại" + retry button

---

### Story 7.7: Habit Check-in Deduplication — 1 Per Day

As a **system**,
I want **đảm bảo mỗi habit chỉ check-in được một lần mỗi ngày**,
So that **streak và XP được tính chính xác**.

**Acceptance Criteria:**

**Given** tôi đã check-in habit X hôm nay
**When** tôi cố check-in habit X lần nữa trong cùng ngày
**Then** hệ thống ngăn chặn
**And** hiển thị message: "Bạn đã check-in habit này hôm nay rồi"

**Given** user A và user B cùng check-in habit X
**When** cả hai check-in cùng ngày
**Then** mỗi user có entry riêng trong database
**And** không conflict

---

### Story 7.8: Auto-Update Daily Stats

As a **system**,
I want **daily stats tự động cập nhật khi có session hoặc check-in mới**,
So that **user luôn thấy thông tin mới nhất**.

**Acceptance Criteria:**

**Given** tôi hoàn thành phiên Pomodoro
**When** XP được grant
**Then** daily stats tự động update
**And** dashboard hiển thị số mới

**Given** tôi check-in habit
**When** check-in được ghi nhận
**Then** daily habit count update ngay
**And** weekly progress recalculate

---

### Story 7.10: Accessibility — WCAG 2.1 AA Compliance

As a **user with accessibility needs**,
I want **app tuân thủ WCAG 2.1 AA**,
So that **tôi có thể sử dụng app dễ dàng**.

**Acceptance Criteria:**

**Given** tôi điều hướng bằng bàn phím
**When** tôi tab qua app
**Then** focus rings visible trên mọi interactive element

**Given** tôi sử dụng screen reader
**When** timer chạy
**Then** screen reader thông báo state changes (không spam mỗi giây)

**Given** tôi bật `prefers-reduced-motion`
**When** animations triggered
**Then** animations được disable hoặc giảm thiểu

**Given** tôi phóng to trình duyệt lên 200%
**When** tôi xem app
**Then** layout không bị break
**And** nội dung vẫn đọc được

As a **developer**,
I want **project được khởi tạo từ Next.js + Supabase starter template và deploy lên Vercel**,
So that **tôi có môi trường development và production sẵn sàng**.

**Acceptance Criteria:**

**Given** tôi chạy init command với starter template
**When** project được tạo
**Then** folder structure đúng: `app/`, `components/`, `lib/`, `supabase/`
**And** TypeScript strict mode enabled
**And** Tailwind CSS + shadcn/ui pre-configured
**And** Supabase auth flow hoạt động (cookie-based, JWT)

**Given** project đã được push lên GitHub
**When** tôi kết nối Vercel với repo
**Then** auto-deploy hoạt động cho mỗi push
**And** production URL có sẵn và accessible

**Given** production deploy hoàn tất
**When** tôi test auth flow (signup/login/logout)
**Then** flow hoạt động đúng trên production domain

---

### Story 2.2: Database Schema & Migrations

As a **developer**,
I want **database schema được tạo với Supabase migrations**,
So that **tất cả tables có cấu trúc đúng và RLS policies được apply**.

**Acceptance Criteria:**

**Given** Supabase project được tạo
**When** migration files được chạy
**Then** table `public.profiles` tồn tại với columns: `id`, `user_id`, `display_name`, `avatar_url`, `total_xp`, `current_level`, `created_at`, `updated_at`

**Given** migration được chạy
**When** migration files được chạy
**Then** table `public.pomo_sessions` tồn tại với columns: `id`, `user_id`, `label`, `status` (enum: active/paused/completed/cancelled), `planned_duration`, `actual_duration`, `started_at`, `completed_at`, `created_at`

**Given** migration được chạy
**When** migration files được chạy
**Then** table `public.habit_definitions` tồn tại với columns: `id`, `user_id`, `name`, `icon`, `color`, `frequency` (daily/weekly/custom), `custom_days` (array), `is_archived`, `current_streak`, `longest_streak`, `position`, `created_at`, `updated_at`

**Given** migration được chạy
**When** migration files được chạy
**Then** table `public.habit_entries` tồn tại với columns: `id`, `user_id`, `habit_definition_id`, `checked_at` (date), `created_at`

**Given** migration được chạy
**When** migration files được chạy
**Then** table `public.gam_xp_transactions` tồn tại với columns: `id`, `user_id`, `source_type` (pomodoro/habit), `source_ref_id`, `amount`, `created_at`
**And** unique constraint `uq_gam_xp_transactions_source` trên `(source_type, source_ref_id)`

**Given** migration được chạy
**When** migration files được chạy
**Then** table `public.gam_levels` tồn tại với 20 rows, mỗi row có `level`, `min_xp`, `title_vi`, `title_en`

**Given** migration được chạy
**When** migration files được chạy
**Then** RLS policies được apply cho TẤT CẢ tables với pattern `auth.uid() = user_id`

---

### Story 2.3: Dark Neon Theme & Design Tokens

As a **developer**,
I want **Tailwind CSS được configure với JL-Tools dark neon design tokens**,
So that **UI có aesthetic nhất quán và đúng với design specification**.

**Acceptance Criteria:**

**Given** Tailwind config được update
**When** app render
**Then** background colors đúng: `bg-primary` (#0a0a0f), `bg-secondary` (#12121a), `bg-tertiary` (#1a1a2e)

**Given** Tailwind config được update
**When** app render
**Then** accent colors đúng: `neon-green` (#00ff88), `neon-pink` (#ff0080), `neon-blue` (#00d4ff), `neon-purple` (#8b5cf6)

**Given** Tailwind config được update
**When** typography render
**Then** font Inter được sử dụng cho UI
**And** JetBrains Mono được sử dụng cho timer display

**Given** Tailwind config được update
**When** dark mode được kích hoạt
**Then** app sử dụng dark theme mặc định

---

### Story 2.4: Feature Folder Structure & Indexes

As a **developer**,
I want **project được tổ chức theo feature-based structure**,
So that **codebase dễ navigate và maintain khi scale**.

**Acceptance Criteria:**

**Given** project structure được tạo
**When** tôi xem file tree
**Then** có `features/pomodoro/` với: `actions.ts`, `queries.ts`, `store.ts`, `types.ts`, `utils.ts`, `constants.ts`

**Given** project structure được tạo
**When** tôi xem file tree
**Then** có `features/habits/` với: `actions.ts`, `queries.ts`, `types.ts`, `utils.ts`, `constants.ts`

**Given** project structure được tạo
**When** tôi xem file tree
**Then** có `features/gamification/` với: `actions.ts`, `queries.ts`, `types.ts`, `utils.ts`, `constants.ts`

**Given** project structure được tạo
**When** tôi xem file tree
**Then** có `components/features/` cho custom UI: `xp-bar.tsx`, `focus-timer.tsx`, `streak-badge.tsx`, `habit-card.tsx`

**Given** project structure được tạo
**When** tôi xem file tree
**Then** có `components/layout/` cho shell: `sidebar.tsx`, `bottom-nav.tsx`, `focus-mode-shell.tsx`

**Given** project structure được tạo
**When** tôi xem file tree
**Then** có `lib/supabase/`, `lib/i18n/`, `lib/constants.ts`, `lib/utils.ts`

---

### Story 2.5: Testing Infrastructure Setup

As a **developer**,
I want **Vitest + testing-library được setup và chạy được tests**,
So that **tôi có thể viết unit tests cho business logic**.

**Acceptance Criteria:**

**Given** Vitest được install và configure
**When** tôi chạy `pnpm test`
**Then** test runner khởi động không lỗi
**And** `@testing-library/react` được import được trong `.tsx` files

**Given** testing setup hoàn tất
**When** tôi viết test cho một utility function
**Then** test chạy và pass
**And** coverage report được generate

**Given** testing setup hoàn tất
**When** CI pipeline chạy
**Then** tests được execute tự động trước khi deploy

---

### Story 2.6: CI/CD Pipeline — Lint + Test Gate

As a **developer**,
I want **GitHub Actions workflow chạy lint và tests trước mỗi merge**,
So that **code không quality issues được deploy lên production**.

**Acceptance Criteria:**

**Given** PR được tạo hoặc push lên branch
**When** GitHub Actions trigger
**Then** ESLint chạy và không có errors

**Given** PR được tạo hoặc push lên branch
**When** GitHub Actions trigger
**Then** TypeScript type checking chạy và không có type errors

**Given** PR được tạo hoặc push lên branch
**When** GitHub Actions trigger
**Then** Vitest tests chạy và pass

**Given** lint hoặc tests fail
**When** PR được tạo
**Then** CI status hiển thị failed
**And** merge bị blocked

**Given** lint và tests pass
**When** PR được merge vào main
**Then** Vercel auto-deploy production

---

### Story 2.1: Project Bootstrap & Deployment

As a **developer**,
I want **project được khởi tạo từ Next.js + Supabase starter template và deploy lên Vercel**,
So that **tôi có môi trường development và production sẵn sàng**.

**Acceptance Criteria:**

**Given** tôi chạy init command với starter template
**When** project được tạo
**Then** folder structure đúng: `app/`, `components/`, `lib/`, `supabase/`
**And** TypeScript strict mode enabled
**And** Tailwind CSS + shadcn/ui pre-configured
**And** Supabase auth flow hoạt động (cookie-based, JWT)

**Given** project đã được push lên GitHub
**When** tôi kết nối Vercel với repo
**Then** auto-deploy hoạt động cho mỗi push
**And** production URL có sẵn và accessible

**Given** production deploy hoàn tất
**When** tôi test auth flow (signup/login/logout)
**Then** flow hoạt động đúng trên production domain

---

## Epic 3: Focus Timer — Pomodoro Sessions

**Mục tiêu:** User có thể chạy các phiên Pomodoro focus với timer chính xác, tùy chỉnh linh hoạt, nhận XP khi hoàn thành, và trải nghiệm Focus Mode immersive.

**User outcome:** User hoàn thành phiên focus đầu tiên → thấy XP bar animate → "Ồ, satisfying!" — đây là **aha moment sớm nhất**.

**FRs covered:** FR9-FR19 (Pomodoro), FR32-FR33-FR34-FR37-FR38-FR39 (XP cơ bản)

**Implementation notes:**
- Timer: Zustand store với timestamp-based approach
- Client-side timer hoạt động offline
- XP grant với deduplication constraint
- Focus Mode ẩn sidebar, chỉ hiện timer + session count + XP preview

### Story 3.1: Pomodoro Timer — Start & Countdown

As a **user**,
I want **bắt đầu một phiên Pomodoro với timer 25 phút**,
So that **tôi có thể tập trung làm việc trong 25 phút liền**.

**Acceptance Criteria:**

**Given** tôi đang ở trang Pomodoro
**When** tôi bấm "Bắt đầu"
**Then** timer bắt đầu đếm ngược từ 25:00
**And** display hiển thị thời gian còn lại chính xác đến giây
**And** button chuyển thành "Tạm dừng"

**Given** timer đang chạy
**When** 1 giây trôi qua
**Then** display giảm 1 giây chính xác (drift < 1s sau 25 phút)

**Given** timer đang chạy
**When** tôi switch sang tab khác trong trình duyệt
**Then** timer vẫn đếm chính xác khi quay lại (visibilitychange event handled)

**Given** timer đang chạy
**When** tôi reload trang
**Then** timer KHÔNG bị mất — state được restore từ Zustand store

---

### Story 3.2: Pomodoro Timer — Pause & Resume

As a **user**,
I want **tạm dừng và tiếp tục phiên Pomodoro**,
So that **tôi có thể xử lý interrupt mà không mất tiến độ**.

**Acceptance Criteria:**

**Given** timer đang chạy
**When** tôi bấm "Tạm dừng"
**Then** timer dừng lại ngay lập tức
**And** button chuyển thành "Tiếp tục"
**And** elapsed time được ghi nhớ chính xác

**Given** timer đang pause
**When** tôi bấm "Tiếp tục"
**Then** timer tiếp tục đếm từ đúng thời điểm đã dừng
**And** button chuyển thành "Tạm dừng"

**Given** timer đang pause
**When** tôi reload trang
**Then** timer được restore ở trạng thái paused với đúng remaining time

---

### Story 3.3: Pomodoro Timer — Cancel Session

As a **user**,
I want **hủy phiên Pomodoro đang chạy**,
So that **tôi có thể dừng lại nếu cần**.

**Acceptance Criteria:**

**Given** timer đang chạy
**When** tôi bấm "Hủy"
**Then** confirmation dialog xuất hiện với message nhẹ nhàng

**Given** dialog xác nhận hiện ra
**When** tôi bấm "Có, hủy"
**Then** timer dừng, session được ghi nhận là "cancelled"
**And** KHÔNG có XP được grant
**And** tôi được quay về trạng thái idle

**Given** dialog xác nhận hiện ra
**When** tôi bấm "Không, tiếp tục"
**Then** dialog đóng, timer tiếp tục

---

### Story 3.4: Pomodoro Session — Complete & Auto-Next

As a **user**,
I want **hoàn thành phiên Pomodoro và được nhắc nghỉ ngơi**,
So that **tôi biết khi nào xong và có kế hoạch nghỉ phù hợp**.

**Acceptance Criteria:**

**Given** timer đếm về 00:00
**When** phiên focus hoàn thành
**Then** completion message hiển thị
**And** session được ghi nhận là "completed" với timestamp
**And** XP được grant tự động (+50 XP)
**And** XP bar animate trong < 500ms
**And** dialog hiển thị với options: "Nghỉ 5 phút" hoặc "Bắt đầu phiên tiếp"

**Given** phiên hoàn thành và tôi chọn "Nghỉ 5 phút"
**Then** timer chuyển sang break mode với countdown 05:00
**And** display hiển thị "Thời gian nghỉ"

**Given** break timer đếm về 00:00
**When** break kết thúc
**Then** notification nhắc "Hết giờ nghỉ!"
**And** options: "Bắt đầu phiên tiếp" hoặc "Kết thúc"

**Given** đây là phiên thứ 4 (hoặc số phiên cấu hình trước long break)
**When** break kết thúc
**Then** long break timer bắt đầu (mặc định 15:00)

---

### Story 3.5: Pomodoro Settings — Customize Durations

As a **user**,
I want **tùy chỉnh thời lượng focus, short break, long break**,
So that **tôi có thể điều chỉnh timer phù hợp với workflow của mình**.

**Acceptance Criteria:**

**Given** tôi đang ở trang settings
**When** tôi mở Pomodoro settings
**Then** tôi thấy các fields: Focus duration (default 25), Short break (default 5), Long break (default 15), Sessions before long break (default 4)

**Given** tôi thay đổi focus duration thành 50 phút
**When** tôi quay lại trang Pomodoro
**Then** timer mới mặc định là 50:00
**And** setting được persist vào database

**Given** tôi thay đổi short break thành 10 phút
**When** tôi bắt đầu phiên mới
**Then** short break timer là 10:00

**Given** tôi thay đổi sessions before long break thành 2
**When** tôi hoàn thành 2 phiên focus
**Then** break tiếp theo là long break (15 phút)

---

### Story 3.6: Pomodoro Settings — Session Labels

As a **user**,
I want **gắn label tùy chọn cho mỗi phiên**,
So that **tôi có thể theo dõi mình đang làm gì**.

**Acceptance Criteria:**

**Given** tôi đang ở trang Pomodoro
**When** tôi nhập label vào field "Phiên này về..."
**Then** label được hiển thị bên cạnh timer

**Given** tôi bắt đầu phiên với label "Học React"
**When** phiên hoàn thành
**Then** session record có label "Học React"

**Given** tôi bỏ trống label field
**When** tôi bắt đầu phiên
**Then** phiên được tạo với label = null (không bắt buộc)

**Given** tôi nhập label
**When** tôi nhập hơn 50 ký tự
**Then** input bị giới hạn ở 50 ký tự
**And** tôi không thể nhập thêm

**Given** tôi nhập label
**When** tôi nhập ký tự đặc biệt (emoji được phép)
**Then** label được lưu bình thường

**Given** tôi nhập label
**When** tôi nhập HTML hoặc script tags
**Then** input được sanitize — tags bị loại bỏ trước khi lưu

---

### Story 3.7: Focus Mode — Immersive Experience

As a **user**,
I want **Focus Mode ẩn mọi thứ trừ timer**,
So that **tôi có thể tập trung hoàn toàn không bị phân tâm**.

**Acceptance Criteria:**

**Given** tôi đang ở trang Pomodoro
**When** tôi bấm "Focus Mode"
**Then** sidebar biến mất
**And** navigation biến mất
**And** chỉ còn timer, session count, XP preview hiển thị
**And** background chuyển thành immersive dark gradient

**Given** tôi đang trong Focus Mode
**When** tôi hover chuột lên top edge
**Then** exit button hiện ra
**And** tôi có thể bấm để thoát Focus Mode

**Given** tôi đang trong Focus Mode
**When** timer kết thúc hoặc tôi bấm thoát
**Then** sidebar và navigation hiện lại bình thường

---

### Story 3.8: Pomodoro Stats — Daily Summary

As a **user**,
I want **xem số phiên đã hoàn thành và tổng phút focus trong ngày**,
So that **tôi biết mình đã focus được bao lâu hôm nay**.

**Acceptance Criteria:**

**Given** tôi đã hoàn thành 4 phiên Pomodoro hôm nay
**When** tôi xem trang Pomodoro
**Then** tôi thấy "Hôm nay: 4 phiên, 100 phút focus"

**Given** tôi chưa hoàn thành phiên nào hôm nay
**When** tôi xem trang Pomodoro
**Then** tôi thấy "Hôm nay: 0 phiên, 0 phút"

**Given** tôi xem stats
**When** ngày mới bắt đầu (00:00 local time)
**Then** counter reset về 0

---

### Story 3.9: XP Grant on Pomodoro Completion

As a **user**,
I want **nhận XP khi hoàn thành phiên Pomodoro**,
So that **tôi thấy tiến bộ của mình được ghi nhận**.

**Acceptance Criteria:**

**Given** tôi hoàn thành một phiên Pomodoro
**When** phiên kết thúc
**Then** +50 XP được grant tự động
**And** XP transaction được ghi lại với source_type = 'pomodoro', source_ref_id = session_id

**Given** tôi hủy một phiên Pomodoro
**When** phiên bị hủy
**Then** KHÔNG có XP được grant

**Given** tôi đã nhận XP cho phiên X
**When** tôi hoàn thành phiên X lần nữa
**Then** KHÔNG có duplicate XP — unique constraint ngăn chặn

**Given** tôi nhận XP
**When** XP được grant
**Then** XP bar animate trong < 500ms

---

### Story 3.10: Level Up Detection & Celebration

As a **user**,
I want **biết khi nào mình lên level mới**,
So that **tôi cảm thấy vui và có động lực tiếp tục**.

**Acceptance Criteria:**

**Given** tôi đang ở Lv.3 (100 XP)
**When** tôi hoàn thành 2 phiên Pomodoro (+100 XP)
**Then** tổng XP = 200 → vượt threshold Lv.4
**And** level-up modal hiện ra với animation celebration

**Given** level-up xảy ra
**When** modal hiển thị
**Then** hiển thị: "Chúc mừng! Bạn đã lên Lv.4" + title mới
**And** confetti/celebration animation chạy

**Given** level-up modal đang hiển thị
**When** tôi bấm "Tiếp tục"
**Then** modal đóng
**And** XP bar hiển thị progress về level tiếp theo

---

## Epic 4: Habit Tracker — Building Daily Routines

**Mục tiêu:** User có thể tạo habits, check-in hàng ngày, theo dõi streak, và nhận XP khi hoàn thành — xây dựng thói quen bền vững.

**User outcome:** User xây dựng được thói quen hàng ngày với streak fire (🔥) và momentum. Miss habit → streak reset nhưng **không mất XP** (gentle approach).

**FRs covered:** FR20-FR31 (Habits), FR33 (XP khi check-in)

**Implementation notes:**
- Habit CRUD với React Hook Form + Zod validation
- Streak calculation: current streak + longest streak, tự động reset khi miss
- Streak fire gradient: gray (1-2d) → yellow (3-6d) → orange (7-13d) → pink (14-29d) → blazing (30+d)
- Optimistic UI cho check-in interaction (< 200ms)

### Story 4.1: Create Habit

As a **user**,
I want **tạo một habit mới với tên, icon, và màu sắc**,
So that **tôi có thể bắt đầu theo dõi thói quen mới**.

**Acceptance Criteria:**

**Given** tôi đang ở trang Habits
**When** tôi bấm "Thêm habit"
**Then** form hiện ra với fields: tên habit, icon picker, color picker, tần suất (daily/weekly/custom)

**Given** form habit đang mở
**When** tôi nhập "Dậy sớm 6h", chọn icon 🌅, màu cam
**And** bấm "Lưu"
**Then** habit mới xuất hiện trong danh sách
**And** habit được gán position mới (cuối list)

**Given** form habit đang mở
**When** tôi bỏ trống tên habit
**Then** validation error hiện ra "Tên habit là bắt buộc"

**Given** form habit đang mở
**When** tôi chọn tần suất "Custom"
**Then** day picker hiện ra cho phép chọn các ngày cụ thể (Thứ 2, Thứ 6, Chủ nhật)

---

### Story 4.2: View Today's Habits

As a **user**,
I want **xem danh sách habits cần thực hiện hôm nay**,
So that **tôi biết mình cần làm gì hôm nay**.

**Acceptance Criteria:**

**Given** tôi có 5 habits với tần suất khác nhau
**When** tôi mở trang Habits
**Then** chỉ hiển thị habits cần thực hiện HÔM NAY (theo local time)
**And** habits được sắp xếp theo thứ tự position

**Given** tôi có habit "Tập thể dục" với tần suất 3 lần/tuần (T2-T4-T6)
**When** hôm nay là thứ 5
**Then** habit "Tập thể dục" KHÔNG hiển thị trong danh sách hôm nay

**Given** tôi có habit archived
**When** tôi xem trang Habits
**Then** habit archived KHÔNG hiển thị

---

### Story 4.3: Check-In Habit

As a **user**,
I want **check-in một habit bằng một tap**,
So that **tôi ghi nhận mình đã hoàn thành thói quen hôm nay**.

**Acceptance Criteria:**

**Given** tôi đang xem habits hôm nay
**When** tôi tap vào habit chưa check-in
**Then** habit chuyển sang trạng thái checked ngay lập tức (< 200ms)
**And** check-in animation phát (ripple + checkmark)
**And** +10 XP được grant tự động
**And** streak count tăng 1

**Given** tôi đã check-in habit "Dậy sớm" hôm nay
**When** tôi xem lại habit đó
**Then** habit hiển thị checked state với ngày đã check-in

**Given** tôi check-in habit
**When** network đang offline
**Then** UI vẫn hiển thị checked ngay lập tức (optimistic)
**And** sync badge hiện "Đang đồng bộ..."

---

### Story 4.4: Undo Check-In

As a **user**,
I want **bỏ check-in nếu đánh dấu nhầm**,
So that **tôi có thể sửa lỗi check-in**.

**Acceptance Criteria:**

**Given** tôi đã check-in habit
**When** tôi tap lại vào habit đó (trong cùng ngày)
**Then** habit chuyển về unchecked state
**And** XP được hoàn lại (-10 XP)

**Given** tôi đã check-in habit
**When** ngày mới bắt đầu (00:00)
**Then** habit tự động chuyển về unchecked
**And** tôi KHÔNG thể undo check-in của ngày hôm trước

---

### Story 4.5: Streak Calculation & Display

As a **user**,
I want **xem streak count cho mỗi habit**,
So that **tôi biết mình đã giữ được bao lâu**.

**Acceptance Criteria:**

**Given** tôi check-in habit 3 ngày liên tiếp
**When** tôi xem habit đó
**Then** streak count hiển thị "🔥 3"
**And** streak color là warm yellow (#fbbf24)

**Given** tôi có habit với streak 10 ngày
**When** tôi xem habit đó
**Then** streak hiển thị "🔥 10"
**And** streak color là orange (#f97316)

**Given** tôi có habit với streak 20 ngày
**When** tôi xem habit đó
**Then** streak hiển thị "🔥 20"
**And** streak color là hot pink (#ff0080)

**Given** tôi có habit với streak 45 ngày
**When** tôi xem habit đó
**Then** streak hiển thị "🔥 45"
**And** streak gradient là blazing (#ff0080 → #ff4400)

---

### Story 4.6: Streak Reset on Miss (Gentle)

As a **user**,
I want **streak reset khi miss một ngày nhưng KHÔNG mất XP**,
So that **tôi có động lực bắt đầu lại mà không bị trừng phạt nặng nề**.

**Acceptance Criteria:**

**Given** tôi có habit với streak 7 ngày
**When** hôm qua tôi quên check-in
**Then** hôm nay streak hiển thị "0" (reset)
**And** longest_streak vẫn giữ giá trị 7

**Given** tôi miss habit (streak reset)
**When** streak reset xảy ra
**Then** gentle modal hiện ra: "Streak đã reset nhưng bạn giữ nguyên XP. Bắt đầu lại nhé!"
**And** KHÔNG có XP bị trừ

**Given** tôi miss habit
**When** streak reset xảy ra
**Then** XP hiện tại và level vẫn giữ nguyên

---

### Story 4.7: Edit Habit

As a **user**,
I want **chỉnh sửa thông tin habit hiện có**,
So that **tôi có thể cập nhật khi cần**.

**Acceptance Criteria:**

**Given** tôi đang xem habit
**When** tôi bấm icon chỉnh sửa
**Then** form edit hiện ra với thông tin hiện tại

**Given** form edit đang mở
**When** tôi đổi tên habit và bấm "Lưu"
**Then** habit được cập nhật
**And** tất cả nơi hiển thị habit đều update

**Given** form edit đang mở
**When** tôi thay đổi tần suất từ daily sang weekly
**Then** habit schedule được cập nhật

---

### Story 4.8: Archive & Delete Habit

As a **user**,
I want **archive hoặc xóa habit**,
So that **tôi có thể dọn dẹp habits không còn dùng**.

**Acceptance Criteria:**

**Given** tôi đang xem habit
**When** tôi bấm "Archive"
**Then** habit được đánh dấu là archived
**And** habit biến mất khỏi danh sách "Hôm nay"
**And** streak và dữ liệu vẫn được giữ

**Given** tôi xem tab "Đã archive"
**When** tôi muốn khôi phục
**Then** tôi bấm "Khôi phục"
**And** habit quay lại danh sách chính

**Given** tôi đang xem habit
**When** tôi bấm "Xóa"
**Then** confirmation dialog hiện ra với cảnh báo

**Given** dialog confirm hiện ra
**When** tôi xác nhận xóa
**Then** habit và TẤT CẢ check-in history bị xóa vĩnh viễn
**And** không thể khôi phục

---

### Story 4.9: Weekly Progress Bar

As a **user**,
I want **xem progress bar % habits hoàn thành trong tuần**,
So that **tôi biết mình có đang tiến bộ không**.

**Acceptance Criteria:**

**Given** tôi có 7 habits daily
**When** tuần này tôi đã hoàn thành 28/49 check-ins
**Then** progress bar hiển thị 57%
**And** text hiển thị "Tuần này: 28/49 hoàn thành (57%)"

**Given** tôi xem progress bar
**When** tuần mới bắt đầu
**Then** progress bar reset về 0%

---

### Story 4.10: Reorder Habits

As a **user**,
I want **sắp xếp thứ tự habits trong danh sách**,
So that **tôi có thể ưu tiên habits quan trọng nhất**.

**Acceptance Criteria:**

**Given** tôi đang xem danh sách habits
**When** tôi kéo thả habit lên trên
**Then** habit được di chuyển đến vị trí mới
**And** thứ tự được persist vào database

**Given** tôi có 5 habits
**When** tôi sắp xếp
**Then** thứ tự mới được giữ khi tôi reload trang

---

## Epic 5: Progress & Navigation Shell

**Mục tiêu:** User có bức tranh toàn cảnh về tiến độ cá nhân, điều hướng mượt mà giữa Pomodoro và Habits, truy cập profile và stats.

**User outcome:** Dashboard mission control — user luôn thấy XP bar, level, navigation, và daily momentum summary. Cross-tool switching không reset context.

**FRs covered:** FR35-FR36-FR41-FR42-FR43-FR44-FR45-FR46-FR47-FR48-FR49-FR50

**Implementation notes:**
- Shared layout: sidebar (desktop 1024px+) + bottom nav (mobile 375-768px)
- XP bar + level badge persistent trên navigation
- Daily momentum panel: sessions + habits summary + next best action
- Responsive breakpoints: 375px (mobile), 768px (tablet), 1024px (desktop)
- Focus Mode state toggle (hide/show navigation chrome)

### Story 5.1: Navigation Shell — Sidebar (Desktop)

As a **desktop user**,
I want **thấy sidebar cố định bên trái với navigation và XP bar**,
So that **tôi có thể điều hướng và theo dõi tiến bộ mọi lúc**.

**Acceptance Criteria:**

**Given** tôi đăng nhập trên desktop (1024px+)
**When** app load
**Then** sidebar cố định 280px hiện bên trái
**And** sidebar chứa: logo, XP bar, level badge, avatar, navigation items (Pomodoro, Habits, Profile)
**And** content area chiếm phần còn lại

**Given** tôi đang xem trang Pomodoro
**When** tôi bấm "Habits" trong sidebar
**Then** tôi được chuyển đến trang Habits ngay lập tức
**And** sidebar vẫn giữ nguyên

**Given** tôi đang xem sidebar
**When** tôi bấm collapse icon
**Then** sidebar thu nhỏ thành rail 64px (chỉ hiện icons)
**And** tôi có thể bấm expand để quay lại

---

### Story 5.2: Navigation Shell — Bottom Nav (Mobile)

As a **mobile user**,
I want **thấy bottom navigation bar với 3 tabs**,
So that **tôi có thể điều hướng bằng ngón tay cái**.

**Acceptance Criteria:**

**Given** tôi đăng nhập trên mobile (375-768px)
**When** app load
**Then** bottom nav bar 56px hiện ở dưới cùng
**And** nav chứa 3 items: Pomodoro, Habits, Profile (với icons + labels)

**Given** tôi đang xem trang Pomodoro
**When** tôi bấm tab "Habits"
**Then** tôi được chuyển đến trang Habits
**And** bottom nav vẫn hiển thị

**Given** tôi đang xem bottom nav
**When** active tab hiện tại
**Then** tab đó được highlight với neon-green accent

---

### Story 5.3: XP Bar — Persistent Display

As a **user**,
I want **thấy XP bar luôn hiển thị trên sidebar/navigation**,
So that **tôi luôn biết mình tiến bộ đến đâu**.

**Acceptance Criteria:**

**Given** tôi đang ở Lv.3 với 150/200 XP
**When** tôi nhìn sidebar
**Then** XP bar hiển thị: Lv.3, progress bar 75% filled, "150 / 200 XP"

**Given** tôi nhận XP mới
**When** XP được grant
**Then** XP bar animate tăng trong < 500ms
**And** XP number tăng dần

**Given** tôi nhận XP mới và đủ level up
**When** XP bar animate
**Then** bar fill hết → level-up modal xuất hiện → bar reset về 0%

---

### Story 5.4: Dashboard — Daily Momentum Summary

As a **user**,
I want **xem tổng quan ngày hôm nay: số phiên + habits completed**,
So that **tôi biết mình đã tiến bộ bao xa hôm nay**.

**Acceptance Criteria:**

**Given** hôm nay tôi hoàn thành 3 phiên Pomodoro và 4/5 habits
**When** tôi mở app
**Then** dashboard hiển thị: "Hôm nay: 3 phiên focus | 4/5 habits ✓"

**Given** hôm nay tôi chưa làm gì
**When** tôi mở app
**Then** dashboard hiển thị: "Hôm nay: 0 phiên focus | 0/0 habits"

**Given** tôi xem dashboard
**When** tôi complete một action
**Then** dashboard tự động update ngay

---

### Story 5.5: Dashboard — Pomodoro Daily Stats

As a **user**,
I want **xem chi tiết số phiên và tổng phút focus trong ngày**,
So that **tôi biết mình đã tập trung được bao lâu**.

**Acceptance Criteria:**

**Given** hôm nay tôi hoàn thành 4 phiên (25+25+25+50 = 125 phút)
**When** tôi xem dashboard
**Then** tôi thấy: "Hôm nay: 4 phiên, 125 phút focus"

**Given** tôi xem stats
**When** ngày mới bắt đầu
**Then** stats reset về 0

---

### Story 5.6: Dashboard — Weekly Habit Progress

As a **user**,
I want **xem % hoàn thành habits trong tuần**,
So that **tôi biết mình có đang duy trì thói quen không**.

**Acceptance Criteria:**

**Given** tuần này tôi hoàn thành 21/35 check-ins
**When** tôi xem dashboard
**Then** tôi thấy: "Tuần này: 60% hoàn thành (21/35)"

**Given** tuần này tôi hoàn thành 35/35
**When** tôi xem dashboard
**Then** tôi thấy celebration mini-badge "🎉 Tuần hoàn hảo!"

---

### Story 5.7: Profile Page — Level, XP, Stats & Editing

As a **user**,
I want **xem và chỉnh sửa profile page với level, total XP, và stats tổng hợp**,
So that **tôi có cái nhìn tổng quan về hành trình của mình và có thể cá nhân hóa tài khoản**.

**Acceptance Criteria:**

**Given** tôi đang ở profile page
**When** tôi xem
**Then** tôi thấy: avatar, display name, level + title, total XP, ngày tham gia

**Given** tôi đang ở profile page
**When** tôi xem stats
**Then** tôi thấy: tổng phiên Pomodoro, tổng habits completed, streak dài nhất, ngày active liên tiếp

**Given** tôi đang ở profile page
**When** tôi bấm "Chỉnh sửa"
**Then** form chỉnh sửa hiện ra

**Given** form chỉnh sửa đang mở
**When** tôi sửa display name thành "Minh Nguyễn" (1–50 ký tự)
**And** tôi bấm "Lưu"
**Then** display name được cập nhật
**And** tên mới hiển thị trên profile, navigation, và mọi nơi

**Given** form chỉnh sửa đang mở
**When** tôi bỏ trống display name
**Then** validation error hiện ra: "Tên hiển thị là bắt buộc"

**Given** form chỉnh sửa đang mở
**When** tôi bấm đổi avatar
**Then** file picker mở ra cho phép chọn ảnh

**Given** form chỉnh sửa đang mở
**When** tôi chọn file ảnh hợp lệ (JPG, PNG, WebP, ≤ 2MB)
**And** tôi bấm "Lưu"
**Then** avatar được cập nhật
**And** avatar mới hiển thị trên profile và navigation

**Given** form chỉnh sửa đang mở
**When** tôi chọn file lớn hơn 2MB
**Then** validation error hiện ra: "Ảnh phải nhỏ hơn 2MB"

**Given** form chỉnh sửa đang mở
**When** tôi chọn file không phải ảnh
**Then** validation error hiện ra: "Vui lòng chọn file ảnh (JPG, PNG, WebP)"

**Given** form chỉnh sửa đang mở
**When** tôi bấm "Hủy"
**Then** form đóng
**And** không có thay đổi nào được lưu

---

### Story 5.8: Profile Page — XP Transaction History

As a **user**,
I want **xem lịch sử XP transactions**,
So that **tôi biết XP đến từ đâu**.

**Acceptance Criteria:**

**Given** tôi đang ở profile page
**When** tôi bấm "Lịch sử XP"
**Then** danh sách hiện ra với: ngày, nguồn (Pomodoro/Habit), số XP

**Given** tôi xem lịch sử XP
**When** tôi scroll
**Then** danh sách được phân trang (20 items mỗi trang)

**Given** tôi xem lịch sử XP
**When** transaction là từ Pomodoro
**Then** hiển thị icon timer + số phiên

**Given** tôi xem lịch sử XP
**When** transaction là từ Habit
**Then** hiển thị icon checkmark + tên habit

---

### Story 5.9: Responsive Layout Transitions

As a **user**,
I want **app tự động điều chỉnh layout theo kích thước màn hình**,
So that **tôi có trải nghiệm tốt trên mọi thiết bị**.

**Acceptance Criteria:**

**Given** tôi resize trình duyệt từ 1024px xuống 768px
**When** breakpoint crossed
**Then** sidebar thu gọn thành collapsible rail
**And** layout chuyển sang 2-zone

**Given** tôi resize trình duyệt từ 768px xuống 375px
**When** breakpoint crossed
**Then** sidebar biến mất
**And** bottom nav xuất hiện
**And** layout chuyển sang single column

**Given** tôi xem app trên tablet 1024px
**When** tôi bấm collapse sidebar
**Then** sidebar thu nhỏ thành 64px rail
**And** content area mở rộng

---

### Story 5.10: Focus Mode — Navigation State Toggle

As a **user**,
I want **Focus Mode tự động ẩn navigation khi trong phiên Pomodoro**,
So that **tôi có trải nghiệm immersive**.

**Acceptance Criteria:**

**Given** tôi bấm "Focus Mode" trong phiên Pomodoro
**When** Focus Mode activated
**Then** sidebar (desktop) hoặc bottom nav (mobile) biến mất
**And** timer chiếm toàn bộ viewport
**And** exit button hiện ở góc trên

**Given** tôi trong Focus Mode
**When** phiên Pomodoro kết thúc
**Then** navigation tự động hiện lại
**And** user được chuyển đến completion dialog

---

## Epic 6: Cross-Tool Gamification — Unified XP System

**Mục tiêu:** XP từ Pomodoro và Habits hợp nhất vào cùng một hệ thống progression, tạo incentive mạnh để dùng cả hai tools.

**User outcome:** Unified XP System hoạt động xuyên suốt — dùng càng nhiều tool → tiến bộ càng nhanh.

**FRs covered:** FR32, FR33, FR34, FR35, FR36, FR37, FR38, FR39, FR40

**Implementation notes:**
- Centralized XP engine với transaction log + deduplication
- 20 levels với XP thresholds và titles (vi/en)
- TanStack Query invalidation khi cross-tool action xảy ra
- Level-up detection → celebration modal

### Story 6.1: Unified XP Engine — Centralized XP Management

As a **system**,
I want **centralized XP engine xử lý tất cả XP grants từ mọi nguồn**,
So that **hệ thống nhất quán và không có race conditions**.

**Acceptance Criteria:**

**Given** user hoàn thành Pomodoro
**When** XP được grant
**Then** XP transaction được ghi vào `gam_xp_transactions`
**And** `profiles.total_xp` được UPDATE atomically
**And** level được recalculate

**Given** user check-in habit
**When** XP được grant
**Then** XP transaction được ghi vào `gam_xp_transactions`
**And** `profiles.total_xp` được UPDATE atomically
**And** level được recalculate

**Given** XP engine xử lý request đồng thời từ Pomodoro và Habit
**When** 2 requests grant XP cho cùng user
**Then** KHÔNG có race condition

---

### Story 6.2: 20 Levels — XP Thresholds & Titles

As a **user**,
I want **20 levels với XP thresholds và titles riêng**,
So that **tôi có mục tiêu rõ ràng để phấn đấu**.

**Acceptance Criteria:**

**Given** tôi là user mới
**When** tôi đăng ký
**Then** tôi bắt đầu ở Lv.1 với 0 XP
**And** title là "Tân binh" (vi) / "Rookie" (en)

**Given** `gam_levels` table được seed
**When** tôi query levels
**Then** có 20 levels với thresholds tăng dần
**And** mỗi level có `title_vi` và `title_en` riêng

---

### Story 6.3: Level Titles — Vietnamese & English

As a **bilingual user**,
I want **level titles hiển thị theo ngôn ngữ tôi chọn**,
So that **tôi thấy quen thuộc và có ý nghĩa**.

**Acceptance Criteria:**

**Given** tôi đặt ngôn ngữ là Tiếng Việt
**When** tôi xem XP bar hoặc level
**Then** titles hiển thị tiếng Việt ("Chiến binh kỷ luật")

**Given** tôi đặt ngôn ngữ là English
**When** tôi xem XP bar hoặc level
**Then** titles hiển thị tiếng Anh ("Discipline Warrior")

---

### Story 6.4: XP Bar Animation — Real-Time Feedback

As a **user**,
I want **thấy XP bar animate mỗi khi nhận XP**,
So that **reward loop cảm thấy satisfying**.

**Acceptance Criteria:**

**Given** tôi hoàn thành phiên Pomodoro
**When** XP được grant
**Then** XP bar animate tăng trong < 500ms
**And** số XP "+50" hiển thị và bay lên

**Given** tôi check-in habit
**When** XP được grant
**Then** XP bar animate tăng trong < 500ms
**And** số XP "+10" hiển thị và bay lên

**Given** tôi nhận XP khi user có `prefers-reduced-motion`
**When** XP được grant
**Then** bar tăng NHANH CHÓNG (không animation delay)

---

### Story 6.5: Level-Up Detection & Threshold Calculation

As a **system**,
I want **tự động detect khi user đủ XP để lên level**,
So that **level-up celebration được trigger đúng lúc**.

**Acceptance Criteria:**

**Given** user có 190 XP, Lv.2 (threshold 200)
**When** user hoàn thành phiên Pomodoro (+50 XP)
**Then** total = 240 XP → vượt Lv.2 threshold
**And** user được promote lên Lv.3
**And** level-up modal được trigger

**Given** user đủ XP cho 2 levels cùng lúc
**When** level-up detection chạy
**Then** user được promote lên đúng level cao nhất
**And** KHÔNG trigger 2 modals liên tiếp

---

### Story 6.6: Level-Up Modal — Celebration Moments

As a **user**,
I want **thấy celebration modal khi lên level mới**,
So that **tôi cảm thấy vui và tự hào**.

**Acceptance Criteria:**

**Given** tôi lên level mới
**When** level-up triggered
**Then** modal xuất hiện với confetti animation
**And** hiển thị: "Chúc mừng! Bạn đã lên Lv.5 — Chiến binh kỷ luật!"

**Given** level-up modal đang hiển thị
**When** tôi bấm "Tiếp tục"
**Then** modal đóng

**Given** level-up xảy ra khi tôi có `prefers-reduced-motion`
**When** modal hiển thị
**Then** confetti KHÔNG chạy

---

### Story 6.7: XP Deduplication — No Duplicate Grants

As a **system**,
I want **đảm bảo KHÔNG có duplicate XP cho cùng một action**,
So that **game balance được duy trì**.

**Acceptance Criteria:**

**Given** user hoàn thành phiên Pomodoro X
**When** lần đầu hoàn thành
**Then** +50 XP được grant bình thường

**Given** user đã nhận XP cho phiên Pomodoro X
**When** phiên X hoàn thành lần nữa
**Then** KHÔNG có XP được grant — unique constraint ngăn chặn

---

### Story 6.8: Cross-Tool XP Aggregation — Pomodoro + Habits

As a **user**,
I want **thấy XP từ Pomodoro và Habits được gộp chung vào cùng một level**,
So that **tôi có cái nhìn tổng quan về tiến bộ từ cả 2 tools**.

**Acceptance Criteria:**

**Given** tuần này tôi dùng cả Pomodoro và Habits
**When** tôi xem weekly summary
**Then** tôi thấy XP tổng = Pomodoro XP + Habit XP
**And** level progress được update cho cả 2 nguồn

**Given** tôi chỉ dùng Pomodoro
**When** tôi xem level
**Then** level progress chỉ tính từ Pomodoro XP

**Given** tôi dùng thêm Habits
**When** tôi check-in habit đầu tiên
**Then** XP từ habit được cộng vào tổng XP của tôi
**And** level progress reflect cả 2 nguồn

---

### Story 6.9: XP Transaction Log — Transparency

As a **user**,
I want **xem chi tiết mỗi XP transaction**,
So that **tôi biết XP đến từ đâu và có bao nhiêu**.

**Acceptance Criteria:**

**Given** tôi xem lịch sử XP
**When** tôi scroll
**Then** tôi thấy mỗi transaction: ngày giờ, nguồn (Pomodoro/Habit), số XP

**Given** tôi xem lịch sử XP
**When** transaction là từ Pomodoro
**Then** hiển thị thêm label của phiên đó

**Given** tôi xem lịch sử XP
**When** transaction là từ Habit
**Then** hiển thị thêm tên habit đó

---

### Story 6.10: Milestone Celebrations — Streak Milestones

As a **user**,
I want **được ăn mừng khi đạt milestones streak quan trọng**,
So that **tôi có thêm động lực duy trì thói quen**.

**Acceptance Criteria:**

**Given** tôi đạt streak 7 ngày trên bất kỳ habit nào
**When** tôi check-in ngày thứ 7
**Then** mini-celebration hiện: "🔥 7 ngày! Đã có thói quen!"

