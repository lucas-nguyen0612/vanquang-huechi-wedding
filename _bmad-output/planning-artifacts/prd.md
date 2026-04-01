---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
inputDocuments: ['product-brief-bmad-test-2026-03-30.md']
workflowType: 'prd'
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 0
classification:
  projectType: web_app
  domain: edtech_productivity
  complexity: medium
  projectContext: greenfield
date: 2026-03-30
author: Lucas
---

# Product Requirements Document - JL-Tools

**Author:** Lucas
**Date:** 2026-03-30

## Executive Summary

**JL-Tools** là nền tảng productivity all-in-one dạng web application, hướng đến sinh viên, nhân viên văn phòng, freelancer và content creator — những người làm việc nhiều trên máy tính và đang chịu thiệt hại năng suất nghiêm trọng từ sự phân tâm và thiếu hệ thống kỷ luật bền vững.

Hiện tại, người dùng phải sử dụng 3-4 ứng dụng phân tán (Forest cho focus, Habitica cho habits, Toggl cho time tracking) với chi phí cộng dồn, dữ liệu rải rác, và không có bức tranh toàn cảnh về sự tiến bộ cá nhân. JL-Tools giải quyết triệt để vấn đề này bằng cách quy tụ các công cụ productivity vào một nền tảng duy nhất với hệ thống gamification RPG xuyên suốt.

MVP bao gồm 2 công cụ cốt lõi: **Pomodoro App** (focus timer với giao diện neon immersive, focus mode toàn màn hình) và **Habit Tracker** (theo dõi thói quen với streak, check-in hàng ngày, weekly progress). Cả hai chia sẻ chung **Shared Gamification System** — mọi hành động tích cực đều tích lũy XP vào cùng một hệ thống level thống nhất.

**Tagline:** *"Làm chủ thời gian. Tối đa giá trị."*

### What Makes This Special

**Unified XP System** — differentiator cốt lõi mà chưa có app nào trên thị trường sở hữu. Thay vì gamification bị giam trong từng app riêng lẻ, JL-Tools tạo ra một hệ thống progression thống nhất: hoàn thành Pomodoro earn XP, check-in habit earn XP, tất cả đổ vào cùng một thanh XP và level. Dùng càng nhiều tool → tiến bộ càng nhanh → lý do tự nhiên để dùng tất cả tools.

**Core insight:** Kỷ luật không bền vững nếu chỉ dựa vào ý chí. Gamification biến kỷ luật thành thói quen thông qua reward loop — và reward loop mạnh nhất khi nó thống nhất across all activities. Habitica chứng minh gamification works nhưng UI cũ và motivation giảm sau vài tháng. JL-Tools học từ lỗi này: gamification tiến hóa theo level, gentle approach (khuyến khích > trừng phạt), và aesthetic hiện đại (dark neon RPG).

**Founder = User:** Sản phẩm được xây dựng từ chính pain point thực tế của founder, đảm bảo product-market fit tự nhiên.

## Project Classification

| Attribute | Value | Detail |
|-----------|-------|--------|
| **Project Type** | Web Application (SPA) | Next.js App Router, Turborepo monorepo, responsive mobile-first |
| **Domain** | EdTech / Productivity | Giao thoa giữa education (sinh viên) và personal productivity (văn phòng, freelancer, content creator) |
| **Complexity** | Medium | 3 hệ thống phối hợp (Timer + Habits + Gamification), multi-schema DB, i18n, RLS |
| **Project Context** | Greenfield | Sản phẩm hoàn toàn mới, chưa có codebase |
| **Tech Stack** | Next.js, Supabase (Auth + Postgres + RLS), Tailwind CSS, shadcn/ui, Turborepo | Modern web stack, boring-but-right choices |
| **Target Launch** | MVP trong 5-6 sprints | Foundation → Pomodoro → Habits → Gamification → Polish |

## Success Criteria

### User Success

| Criteria | Metric | Target | Kết nối Differentiator |
|----------|--------|--------|----------------------|
| **Activation nhanh** | User mới hoàn thành phiên Pomodoro đầu tiên trong 24h | ≥ 60% | "Mở là dùng" — zero setup, value ngay lập tức |
| **Core loop hoạt động** | User active ≥ 4 ngày/tuần | DAU/WAU ≥ 57% | Gamification reward loop giữ chân hàng ngày |
| **Pomodoro effective** | Phiên focus hoàn thành (không cancel) | ≥ 75% | Focus Mode immersive giảm phân tâm |
| **Habit sticks** | Users duy trì streak ≥ 7 ngày trong tháng đầu | ≥ 30% | Streak + XP tạo double motivation |
| **Cross-tool magic** | Users dùng CẢ 2 tools trong cùng tuần | ≥ 40% | Metric quan trọng nhất — chứng minh Unified XP System có giá trị |
| **Level progression** | User trung bình đạt Lv.5 sau 2 tuần | Đo theo cohort | XP pacing đủ satisfying, không quá nhanh/chậm |

**Aha moments cần đạt được:**

1. Phiên Pomodoro đầu tiên hoàn thành → thấy XP bar nhích lên → "Ồ, satisfying!"
2. Ngày thứ 3: Level up lần đầu → celebration modal → "Mình đang tiến bộ thật!"
3. Tuần thứ 2: Mở JL-Tools là thao tác đầu tiên khi mở laptop → habit formed

### Business Success

**MVP (0-3 tháng) — Validate:**

| Metric | Target | Signal |
|--------|--------|--------|
| Tổng signups | ≥ 500 | Có demand thực sự |
| D7 Retention | ≥ 40% | Core loop works (benchmark ngành: 25-35%) |
| D30 Retention | ≥ 20% | Gamification giữ chân dài hạn |
| NPS | ≥ 40 | Word-of-mouth potential |
| Revenue | Chưa ưu tiên | 100% focus user value |

**Growth (3-12 tháng) — Scale:**

| Metric | Target | Signal |
|--------|--------|--------|
| Tổng signups | 5,000 | Organic + referral growth |
| MAU | 2,000 | 40% monthly active rate |
| Premium conversion | 5-8% | Freemium model viable |
| MRR | $500-1,000 | ~$5/th x 100-200 subscribers |
| Organic referral | 30% signups | Viral loop từ gamification sharing |

### Measurable Outcomes

**North Star Metric:**

> **Tổng (Pomodoro sessions completed + Habit check-ins) / tuần / toàn platform**

**Weekly KPIs dashboard:**

| KPI | Formula | Target | Alert |
|-----|---------|--------|-------|
| WAU | Unique active users / 7 ngày | Tăng 10%/tuần | Giảm 2 tuần liên tiếp |
| Avg Pomodoro/user/ngày | Sessions completed / DAU | ≥ 3 | < 1.5 |
| Habit check-in rate | Check-ins / (Active habits x Active users) | ≥ 65% | < 50% |
| XP earned/user/ngày | Avg XP per active user per day | ≥ 80 | < 40 |
| Cross-tool ratio | Users dùng cả 2 tools / Total active | ≥ 40% | < 25% |

**Go/No-Go Gates sau 3 tháng:**

| Gate | Pass | Fail | Action nếu Fail |
|------|------|------|-----------------|
| User Adoption | ≥ 500 signups | < 200 | Reassess marketing/positioning |
| Core Loop | D7 retention ≥ 40% | < 20% | Redesign onboarding + XP pacing |
| Cross-tool | ≥ 40% dùng cả 2 | < 20% | Strengthen XP incentives cross-tool |
| Gamification | ≥ 3 Pomo/user/ngày | < 1.5 | Rebalance rewards + add variety |
| Satisfaction | NPS ≥ 40 | < 20 | User interviews → pivot |

## User Journeys

### Journey 1: Minh — Sinh viên tìm lại sự tập trung (Primary User - Success Path)

**Opening Scene:** Thứ Hai, 14h. Minh ngồi ở thư viện trường, mở laptop ra định ôn bài thi cuối kỳ. Nhưng thay vì mở slide bài giảng, tay Minh vô thức mở YouTube — "xem 1 clip thôi". 2 tiếng sau, Minh vẫn đang scroll. Anh từng thử Forest nhưng vẫn bị phân tâm trên laptop. Notion habit tracker thì tốn 2 tiếng setup rồi bỏ.

**Rising Action:** Tối đó, Minh thấy story Instagram của bạn cùng lớp: screenshot "Lv.10 Chiến binh kỷ luật — 12 ngày streak!" từ JL-Tools. Tò mò, click link. Đăng ký bằng Google — 5 giây. "Lv.1 Tân binh", XP bar trống. Sidebar: Pomodoro, Habits. Bấm Start Pomodoro. Sidebar biến mất. Timer neon 25:00 + "+50 XP khi hoàn thành".

**Climax:** 25 phút — hoàn thành phiên focus đầu tiên mà không chạm YouTube. XP bar animate 0 → 50. "Thêm 1 phiên nữa." Sau 4 phiên: 2 tiếng focus liền. Tạo 2 habits: "Dậy trước 7h", "Ôn bài 2 tiếng/ngày". Tổng ngày đầu: 240 XP.

**Resolution:** Ngày thứ 3, Lv.3. Celebration modal. Tuần 2: mở JL-Tools = thao tác đầu tiên khi mở laptop. Tháng sau: Lv.15, streak 14 ngày, focus time tăng 40%. Screenshot lên Instagram — viral loop bắt đầu.

**Requirements revealed:** Onboarding zero-friction, Focus Mode immersive, XP animation instant, level-up celebration, daily stats, social sharing potential.

### Journey 2: Khoa — Freelancer chiến thắng sự trì hoãn (Primary User - Alternative Persona)

**Opening Scene:** 10h sáng. Khoa thức dậy muộn — lại. 3 email client chờ revision. Deadline chiều nay. Lướt Twitter "5 phút" → 1 tiếng. Không ai giám sát = không pressure. Toggl chỉ track, không motivate.

**Rising Action:** Đăng ký JL-Tools. 3 habits: "Dậy trước 8h", "Tập thể dục 30p", "Design 4 tiếng/ngày". Pomodoro: 50 phút focus / 10 phút break. Ngày đầu: 3 phiên, label "Client revision", hoàn thành trước deadline. +150 XP. Ngày 2: dậy muộn, miss habit → streak reset, fire emoji biến mất. Không mất XP (gentle approach).

**Climax:** Ngày 5: pattern emerge — dậy sớm + tập thể dục → 4-5 phiên Pomodoro. Dậy muộn → 1-2 phiên. Tuần 1: 7 ngày streak "Design 4 tiếng". Weekly progress: 78%. 2 projects xong thay vì 1.

**Resolution:** Tháng 2: routine ổn định. Thu nhập tăng 30%. "XP bar giám sát thay mình."

**Requirements revealed:** Custom timer durations, session labels, gentle streak reset, habit frequency flexibility, weekly progress stats.

### Journey 3: Hà — Edge Case: Internet mất giữa phiên (Primary User - Error Recovery)

**Opening Scene:** 14h văn phòng. Pomodoro 25 phút, label "Q1 Report". Timer: 18:42 còn lại.

**Rising Action:** WiFi mất. Timer vẫn đếm (client-side). Hoàn thành → "XP sẽ cập nhật khi có kết nối." WiFi quay lại → auto sync, XP animate. Scenario 2: sếp gọi họp → Pause → 30 phút sau Resume. Hoặc bấm "Bỏ qua" → cancelled, không mất XP.

**Resolution:** App ổn định mọi tình huống: mất mạng, interrupt, switch tab. Không data loss anxiety.

**Requirements revealed:** Client-side timer, offline resilience, pause/resume, graceful cancel, auto-sync, session states (active/paused/completed/cancelled).

### Journey 4: Linh — Content Creator tối ưu workflow (Primary User - Power User)

**Opening Scene:** 3 tuần dùng, Lv.12. Labels: Research, Quay, Edit, Viết.

**Rising Action:** Daily Stats tuần này: Research 6 phiên (2.5h), Quay 4 (1.7h), Edit 10 (4.2h), Viết 5 (2.1h). Insight: Edit tốn gấp đôi Research → đầu tư skill edit nhanh hơn.

**Climax:** Tuần sau: cùng output, Edit giảm 7 phiên. Tiết kiệm 1.5h/tuần. Screenshot stats làm content → followers hỏi "App gì vậy?"

**Resolution:** Organic referral. Power user + brand ambassador tự nhiên.

**Requirements revealed:** Label-based stats aggregation, screenshot-friendly UI, organic viral loop.

### Journey 5: Lucas — Founder monitor platform (Operations User)

**Rising Action:** Supabase Dashboard: 87 users, 1,240 XP transactions/tuần, 73% completion rate, 34% streak ≥ 3.

**Climax:** SQL query cross-tool engagement: 41% → vượt target 40%. Unified XP works!

**Resolution:** Soft launch rộng hơn. Supabase functions cho weekly metrics.

**Requirements revealed:** Supabase Dashboard đủ cho MVP admin, RLS correctness, performant queries. Post-MVP: built-in admin dashboard.

### Journey Requirements Summary

| Journey | Key Capabilities |
|---------|-----------------|
| **Minh (Success)** | Zero-friction onboarding, Focus Mode, XP instant feedback, level-up celebration |
| **Khoa (Alternative)** | Custom durations, session labels, gentle streak reset, weekly progress |
| **Hà (Edge Case)** | Client-side timer, offline resilience, pause/resume, graceful cancel, auto-sync |
| **Linh (Power User)** | Label-based stats, screenshot-friendly UI, organic viral loop |
| **Lucas (Admin)** | Supabase Dashboard, SQL-queryable metrics, RLS correctness |

## Innovation & Novel Patterns

### Detected Innovation Areas

**1. Unified XP System Cross-Tool (Primary Innovation)**

Không platform nào tạo hệ thống progression thống nhất nơi mọi hành động kỷ luật — bất kể tool nào — đều đóng góp vào cùng một hành trình. JL-Tools biến cross-tool engagement thành core mechanic: Pomodoro XP + Habit XP → cùng level → cùng identity. Đây là kiến trúc sản phẩm, không chỉ feature.

**2. Evolving Gamification (Anti-Novelty Fatigue)**

Habitica chứng minh gamification works nhưng mất hứng sau 2-3 tháng do mechanics không đổi. JL-Tools: gamification tiến hóa theo level — level thấp XP đơn giản, level cao mở khóa badges, insights, challenges mới.

**3. Gentle Gamification Philosophy**

Habitica phạt nặng (mất HP khi miss). JL-Tools: miss habit → streak reset nhưng không mất XP. Khuyến khích > trừng phạt. Inspiration từ Finch áp dụng cho productivity.

### Market Context

| Dimension | Thị trường hiện tại | JL-Tools |
|-----------|---------------------|----------|
| Gamification scope | Giam trong 1 app | Unified cross-tool |
| Gamification lifecycle | Static, mất hứng 2-3 tháng | Evolving theo level |
| Punishment model | Mất HP/coins khi fail | Gentle — chỉ reset streak |
| Tool combination | Bolt-on (TickTick) | Deep integration qua shared XP |
| Data insight | Siloed per app | Cross-domain post-MVP |

Nearest competitor: **TickTick** — nhưng zero gamification, zero unified progression. JL-Tools fills the exact gap.

### Validation Approach

| Innovation | Method | Success Signal | Timeline |
|-----------|--------|----------------|----------|
| Unified XP | Cross-tool engagement % | ≥ 40% dùng cả 2 tools/tuần | MVP + 4 tuần |
| Evolving Gamification | D30/D7 retention ratio | ≥ 50% | MVP + 30 ngày |
| Gentle Approach | User survey | < 10% report stress, NPS ≥ 40 | MVP + 30 ngày |

## Product Scope & Phased Development

### MVP Strategy

**Approach:** Experience MVP — ship trải nghiệm hoàn chỉnh nhưng tối giản với full core loop (focus → earn XP → level up → quay lại). Gamification IS the product — MVP phải bao gồm nó.

**Resources:** 1 full-stack developer (solo founder), shadcn/ui + Tailwind (giảm 80% design work), Vercel Free + Supabase Free ($0/tháng), 5-6 sprints.

### MVP Feature Set (Phase 1)

**Platform Foundation:**

- Auth: Email + Google OAuth → `public.profiles`
- Shared Layout: Sidebar (desktop) + Bottom nav (mobile), logo, avatar, XP bar
- i18n: Vietnamese + English, toggle switch, locale persisted
- Dark theme default, responsive 375px+
- Deploy: Vercel + Supabase

**Pomodoro App:**

- Timer engine: focus → short break → focus → ... → long break (client-side)
- Customizable settings: durations, sessions before long break
- Focus Mode: ẩn sidebar, fullscreen-like, timer + XP preview only
- Session persistence: completed/cancelled with pause/resume
- Session labels (optional)
- XP earning: auto grant on completion
- Daily stats: số phiên + tổng phút

**Habit Tracker:**

- CRUD: tạo/sửa/xóa/archive habits (name, icon, color)
- Frequency: daily / weekly / custom days
- Daily check-in: tap toggle, micro-animation
- Streak: auto calculate current + longest, gentle reset on miss
- XP earning: auto grant on check-in
- Weekly progress bar: % completion

**Shared Gamification:**

- Unified XP bar trên sidebar, animated (< 500ms feedback)
- 20 levels, title vi/en, XP thresholds
- Level-up detection → celebration modal
- XP transaction log (source, amount, timestamp)

**Journey Coverage:**

| Journey | MVP Support |
|---------|------------|
| Minh (Success) | Full |
| Khoa (Alternative) | Full |
| Hà (Edge Case) | Partial (pause/resume, basic offline) |
| Linh (Power User) | Basic (labels + daily stats) |
| Lucas (Admin) | Via Supabase Dashboard |

### Phase 2 — Engagement Depth (Month 2-3)

| Feature | Value | Dependency |
|---------|-------|------------|
| Badge/Achievement system | Gamification depth + collectibility | Level system stable |
| Session label aggregation | Power user stats breakdown | Daily stats có |
| Improved weekly stats | Charts, trends, heatmap | Đủ data (2-4 tuần) |
| Habit reminder (basic) | Browser notification | Service Worker |

### Phase 3 — Polish & Social (Month 3-6)

| Feature | Value | Dependency |
|---------|-------|------------|
| Sound effects + ambient | Immersive focus | Core timer stable |
| Level-up animations | Delight + shareability | Modal celebration có |
| Light theme toggle | Accessibility | Dark theme polished |
| Social: leaderboard | Viral loop + accountability | User base ≥ 500 |
| Cross-domain insights | Correlation analysis | Đủ data (1-2 tháng) |

### Phase 4 — Platform Expansion (Month 6-12)

| Feature | Value | Dependency |
|---------|-------|------------|
| PWA + offline full | Mobile-native feel | Core stable |
| Task Manager | Kanban + XP | Architecture proven modular |
| Journal | Daily reflection + mood | User demand validated |
| Team workspaces | B2B expansion | Individual PMF confirmed |
| Public API | Third-party integrations | Core API stable |

### Risk Mitigation

**Technical Risks:**

| Risk | Probability | Mitigation |
|------|------------|------------|
| Timer drift | Low | `requestAnimationFrame` + server timestamp validation |
| Supabase free tier limits | Low | 500MB DB, 50K auth — dư cho 500 users. Monitor, upgrade khi 70% |
| XP race condition | Medium | DB trigger + unique constraint `xp_transactions(source_ref_id)` |
| Bundle size bloat | Medium | Code splitting per route, lazy load, `@next/bundle-analyzer` |
| Unified XP không đủ motivate | Medium | XP bonus cho cross-tool usage. Onboarding guide cả 2 tools |
| Gamification mất hứng | Medium | New mechanics mỗi 2-3 tháng. Fallback: core tools tốt, gamification = bonus |

**Market Risks:**

| Risk | Probability | Mitigation |
|------|------------|------------|
| "Chỉ là Pomodoro app khác" | Medium | Onboarding highlight Unified XP. First 5 min = Pomodoro + Habit + XP |
| Target users không biết product | High | ProductHunt, Reddit r/productivity, FB groups sinh viên VN |

**Resource Risks:**

| Risk | Probability | Mitigation |
|------|------------|------------|
| Solo founder burnout | Medium | Strict sprint scope. Dogfood sản phẩm |
| Scope creep | High | Go/No-Go gates. Feature request → "Giúp pass gate nào?" |

**Absolute Minimum Viable (fallback 2 tuần):** Auth + Pomodoro Timer + XP bar + Level up. Không Habits. Validate gamified Pomodoro alone → nếu retention tốt → build Habits.

## Functional Requirements

### 1. User Management & Authentication

- **FR1:** User can đăng ký tài khoản mới bằng email/password
- **FR2:** User can đăng ký và đăng nhập bằng Google OAuth
- **FR3:** User can đăng nhập vào tài khoản hiện có
- **FR4:** User can đăng xuất khỏi phiên đăng nhập
- **FR5:** User can xem và chỉnh sửa thông tin profile (display name, avatar)
- **FR6:** User can reset password qua email
- **FR7:** System tự động tạo profile record khi user đăng ký thành công
- **FR8:** User chỉ có thể truy cập dữ liệu của chính mình (data isolation)

### 2. Pomodoro Focus Sessions

- **FR9:** User can bắt đầu một phiên Pomodoro focus mới
- **FR10:** User can tùy chỉnh thời lượng focus, short break, long break, và số phiên trước long break
- **FR11:** User can xem timer đếm ngược chính xác trong suốt phiên
- **FR12:** User can tạm dừng (pause) phiên đang chạy và tiếp tục (resume)
- **FR13:** User can hủy (cancel) phiên đang chạy
- **FR14:** User can gắn label tùy chọn cho mỗi phiên
- **FR15:** System tự động chuyển trạng thái: focus → short break → focus → ... → long break
- **FR16:** System ghi nhận mỗi phiên hoàn thành/hủy với timestamp và duration thực tế
- **FR17:** User can kích hoạt Focus Mode — ẩn sidebar, navigation, notifications; chỉ hiện timer, session count, XP preview
- **FR18:** Timer hoạt động chính xác bất kể trạng thái network
- **FR19:** User can xem số phiên đã hoàn thành và tổng phút focus trong ngày

### 3. Habit Tracking

- **FR20:** User can tạo habit mới với tên, icon, màu sắc
- **FR21:** User can chỉnh sửa thông tin habit hiện có
- **FR22:** User can xóa hoặc archive habit
- **FR23:** User can cấu hình tần suất: daily, weekly, hoặc custom (chọn ngày cụ thể)
- **FR24:** User can xem danh sách habits cần thực hiện hôm nay
- **FR25:** User can check-in một habit cho ngày hiện tại
- **FR26:** User can bỏ check-in (undo) nếu đánh dấu nhầm *(error recovery — Journey 3 pattern)*
- **FR27:** System tự động tính toán current streak và longest streak
- **FR28:** System tự động reset streak về 0 khi miss (không phạt thêm)
- **FR29:** User can xem streak count và trạng thái cho mỗi habit
- **FR30:** User can xem progress bar % habits hoàn thành trong tuần
- **FR31:** User can sắp xếp thứ tự hiển thị của các habits *(workflow optimization — Journey 4 pattern)*

### 4. Gamification & Progression

- **FR32:** System tự động grant XP khi hoàn thành phiên Pomodoro focus
- **FR33:** System tự động grant XP khi check-in habit
- **FR34:** System ghi nhận mọi XP transaction với source, amount, timestamp
- **FR35:** User can xem tổng XP và XP bar trên sidebar
- **FR36:** User can xem level hiện tại và title (vi/en)
- **FR37:** System tự động detect khi đạt đủ XP để level up
- **FR38:** System hiển thị celebration khi level up
- **FR39:** User can xem XP bar animate khi nhận XP mới
- **FR40:** System hỗ trợ 20 levels, mỗi level có XP threshold và title riêng

### 5. Dashboard & Statistics

- **FR41:** User can xem tổng quan ngày: số phiên Pomodoro + habits completed
- **FR42:** User can xem daily Pomodoro stats: số phiên, tổng phút focus
- **FR43:** User can xem weekly habit progress: % completion
- **FR44:** User can xem profile page: level, total XP, stats tổng hợp
- **FR45:** User can xem lịch sử XP transactions *(gamification transparency — supports all journeys)*

### 6. Platform Navigation & Layout

- **FR46:** User can điều hướng giữa tools qua sidebar (desktop) hoặc bottom nav (mobile)
- **FR47:** User can xem logo, avatar, level, XP bar trên navigation
- **FR48:** System tự động chuyển layout theo kích thước màn hình
- **FR49:** User can collapse/expand sidebar trên desktop *(standard responsive web_app UX)*
- **FR50:** Focus Mode tự động ẩn navigation khi trong phiên Pomodoro

### 7. Internationalization & Preferences

- **FR51:** User can chuyển đổi ngôn ngữ giữa Tiếng Việt và English
- **FR52:** System lưu locale preference và áp dụng khi đăng nhập lại
- **FR53:** Mọi nội dung tĩnh hiển thị theo ngôn ngữ đã chọn
- **FR54:** Level titles hiển thị theo ngôn ngữ của user
- **FR55:** System hiển thị dark theme mặc định

### 8. Data Integrity & Sync

- **FR56:** System đảm bảo không mất dữ liệu khi offline và tự động cập nhật khi có kết nối
- **FR57:** System đảm bảo không duplicate XP grant cho cùng một hành động
- **FR58:** System đảm bảo mỗi habit chỉ check-in một lần/ngày
- **FR59:** User can xem trạng thái sync (synced/pending)
- **FR60:** System tự động cập nhật daily stats khi có session/check-in mới

## Non-Functional Requirements

### Performance

| NFR | Metric | Target | Rationale |
|-----|--------|--------|-----------|
| **NFR1:** Page load | FCP | < 1.5s | User mở app để focus, không để chờ |
| **NFR2:** Interactivity | TTI | < 3s | Start Pomodoro phải responsive ngay |
| **NFR3:** Timer accuracy | Drift/25min | < 1s | Core mechanic — sai = mất trust |
| **NFR4:** Timer start | Click → countdown | < 100ms | Instant response |
| **NFR5:** XP feedback | Action → animate | < 500ms | Core reward loop |
| **NFR6:** Check-in response | Tap → confirm | < 200ms | Micro-interaction snappy |
| **NFR7:** Layout shift | CLS | < 0.1 | Stable layout |
| **NFR8:** Bundle size | Gzipped | < 200KB | Mobile 3G/4G |

### Security

| NFR | Requirement | Detail |
|-----|------------|--------|
| **NFR9:** Auth tokens | JWT httpOnly cookies | Prevent XSS token theft |
| **NFR10:** Data isolation | Database-level enforcement | Zero tolerance — User A never sees User B |
| **NFR11:** Transport | HTTPS only (TLS 1.2+) | Encrypted in transit |
| **NFR12:** Storage | Managed database encryption | Encrypted at rest |
| **NFR13:** Input | Sanitize all user input | Prevent XSS, SQL injection |
| **NFR14:** CSRF | Token-based auth | CSRF protection via auth tokens |
| **NFR15:** Rate limit | 100 req/min/user | Prevent abuse |
| **NFR16:** Password | Min 8 characters | Security + usability |

### Scalability

| NFR | Scenario | Target |
|-----|----------|--------|
| **NFR17:** Concurrent | MVP peak | 50 simultaneous users |
| **NFR18:** DB growth | 500 users x 3 months | < 100MB |
| **NFR19:** Growth | 10x users | < 10% perf degradation |
| **NFR20:** Stateless | Horizontal scaling | Application supports horizontal scaling without session affinity |

### Accessibility

| NFR | Standard | Requirement |
|-----|----------|-------------|
| **NFR21:** Contrast | WCAG 2.1 AA | 4.5:1 text, 3:1 large text |
| **NFR22:** Keyboard | WCAG 2.1 AA | All elements via Tab |
| **NFR23:** Screen reader | WCAG 2.1 AA | aria-live timer, semantic HTML |
| **NFR24:** Focus | WCAG 2.1 AA | Visible focus rings |
| **NFR25:** Motion | WCAG 2.1 AA | Respect prefers-reduced-motion |
| **NFR26:** Touch | Mobile | Min 44x44px targets |

### Reliability

| NFR | Requirement | Target |
|-----|------------|--------|
| **NFR27:** Uptime | Availability | ≥ 99.5% monthly |
| **NFR28:** Timer | Network independence | Timer functions without network/server dependency |
| **NFR29:** Data | No loss on complete | Zero data loss on session completion regardless of network state |
| **NFR30:** Errors | Graceful degradation | User-facing error message with error description and retry option |
| **NFR31:** Tab handling | Timer survives switch | Timer maintains accuracy when browser tab is inactive or switched |

## Web Application Technical Requirements

### Browser Support

| Browser | Version | Priority |
|---------|---------|----------|
| Chrome | Latest 2 | Primary |
| Safari | Latest 2 | Primary |
| Firefox | Latest 2 | Secondary |
| Edge | Latest 2 | Secondary |

### Responsive Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| 375px - 768px | Bottom nav, single column, full-width timer |
| 768px - 1024px | Collapsible sidebar, 2-column |
| 1024px+ | Fixed sidebar, multi-column |

### SEO Strategy

- Landing page (`/`): SSR, meta tags, Open Graph, structured data
- Auth pages: SSR, minimal SEO
- App pages (behind auth): Client-side only, `noindex`

### Implementation Architecture

**State Management:**

- Server state: React Query / SWR + Supabase — cache + optimistic updates
- Client state: React Context (auth, theme, locale). Zustand nếu cần
- Timer state: Local (useRef + useEffect) — zero server dependency

**Offline Resilience:**

- Timer: 100% client-side
- Session save: local queue → sync on reconnect
- Habit check-in: optimistic UI + background sync

**Security:**

- Auth: Supabase JWT, httpOnly cookies
- RLS: `auth.uid() = user_id` on all tables
- XSS: React auto-escape + CSP headers
- Rate limiting: Supabase built-in + Vercel edge
