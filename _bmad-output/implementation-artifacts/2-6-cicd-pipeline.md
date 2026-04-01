# Story 2.6: CI/CD Pipeline — Lint + Test Gate

Status: ready-for-dev

## Story

As a **developer**,
I want **GitHub Actions workflow chạy lint và tests trước mỗi merge**,
So that **code không quality issues được deploy lên production**.

## Context

**Epic:** 2 — Foundation Setup
**Story ID:** 2.6
**Story Key:** 2-6-cicd-pipeline
**Dependencies:** Story 2.5 (Testing Infrastructure) — tests must exist for CI to run
**Preceding Story:** 2.5 (Testing Infrastructure) — same epic, last story
**Outputs to:** All subsequent epics — CI gates every future PR
**Role:** Developer

---

## Acceptance Criteria

### AC-1: ESLint Gate

**Given** PR được tạo hoặc push lên branch
**When** GitHub Actions trigger
**Then** ESLint chạy với `pnpm lint`
**And** job fails nếu có ESLint errors
**And** job passes nếu không có errors

### AC-2: TypeScript Type Check Gate

**Given** PR được tạo hoặc push lên branch
**When** GitHub Actions trigger
**Then** TypeScript compiler chạy với `pnpm typecheck`
**And** job fails nếu có type errors
**And** job passes nếu không có errors

### TypeScript script for package.json:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit"
  }
}
```

### AC-3: Vitest Test Gate

**Given** PR được tạo hoặc push lên branch
**When** GitHub Actions trigger
**Then** Vitest tests chạy với `pnpm test:run`
**And** job fails nếu có test failures
**And** job passes nếu all tests pass

### AC-4: CI Failure Blocks Merge

**Given** lint, typecheck, hoặc tests fail
**When** PR được tạo hoặc push
**Then** CI status hiển thị failed (red ❌)
**And** GitHub merge rules block PR from merging

### AC-5: Vercel Auto-Deploy on Main

**Given** lint và tests pass
**When** PR được merge vào `main`
**Then** Vercel tự động deploy production
**And** production URL có sẵn với code mới

---

## Technical Requirements

### GitHub Actions Workflow

Location: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    name: Lint, Type Check & Test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run ESLint
        run: pnpm lint

      - name: Run TypeScript check
        run: pnpm typecheck

      - name: Run Tests
        run: pnpm test:run

      - name: Upload coverage
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/
          retention-days: 7
```

### Node Version

Use **Node.js 22** — matches `engines` in `package.json` (if specified) and matches current runtime.

### pnpm Version

Use **pnpm v9** (`pnpm/action-setup@v4` with `version: 9`) — consistent with project setup.

### package.json: Add typecheck script

If not already present from Story 2.5:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit"
  }
}
```

### tsconfig.json Requirements

For `tsc --noEmit` to work in CI:

```json
{
  "compilerOptions": {
    "noEmit": true,
    "skipLibCheck": false
  }
}
```

Verify these are set — they should already be configured in Story 2.1.

### DO NOT

- ❌ Không hardcode Node/pnpm versions — use `setup-node` cache + action defaults
- ❌ Không skip typecheck hoặc tests trong CI
- ❌ Không push coverage to external services (Coveralls, Codecov) — local artifact only for MVP
- ❌ Không change `main` branch name — hardcode `main`

### GitHub Branch Protection (Documentation)

Document for Lucas to configure in GitHub Settings:

1. **Settings → Branches → Add rule for `main`:**
   - ✅ "Require pull request reviews before merging"
   - ✅ "Require status checks to pass before merging" → select: `lint-and-test`
   - ✅ "Require branches to be up to date before merging"

2. **Settings → Secrets and variables → Actions:**
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Add `SUPABASE_SERVICE_ROLE_KEY`

### Vercel Integration

Vercel auto-deploy is configured by connecting the GitHub repo in Vercel Dashboard. The `.github/workflows/ci.yml` runs BEFORE every deploy. Vercel deploys automatically when:
- PR is merged to `main` AND
- CI (lint + typecheck + tests) passes

No Vercel configuration file needed — use Vercel Dashboard GitHub integration.

---

## Dev Notes

### Current State

- `.github/` folder **chưa tồn tại** — cần tạo
- GitHub Actions workflow **chưa tồn tại** — cần tạo
- `pnpm typecheck` script có thể **chưa có** trong `package.json` — check và thêm nếu cần
- Vercel Dashboard integration: **chưa verify** — Lucas cần xác nhận đã connect repo

### CI Workflow Summary

```
PR opened/push → GitHub Actions
  ├── Checkout
  ├── Setup pnpm v9
  ├── Setup Node 22
  ├── Install deps (frozen lockfile)
  ├── pnpm lint         ← FAIL → block merge
  ├── pnpm typecheck    ← FAIL → block merge
  ├── pnpm test:run     ← FAIL → block merge
  └── Upload coverage artifact
                        ← ALL PASS → allow merge → Vercel deploy
```

### Files to Create

1. `.github/workflows/ci.yml`
2. Update `src/package.json` scripts (add `typecheck` if missing)

### Manual Steps for Lucas (Not in CI)

These require manual setup in GitHub and Vercel dashboards — document but don't automate:

1. Connect GitHub repo to Vercel (Vercel Dashboard → Add New Project → Import GitHub repo)
2. Configure Vercel Environment Variables in dashboard
3. Set branch protection rules in GitHub Settings
4. Add Supabase environment variables to GitHub Actions secrets

### References

- Architecture: `_bmad-output/planning-artifacts/architecture.md` — Deployment patterns
- Package.json: `src/package.json` — Current scripts
- Project context: `src/CLAUDE.md` — Dev commands
- Epics source: `_bmad-output/planning-artifacts/epics.md#Story 2.6`

---

## Tasks / Subtasks

- [ ] Task 1: Create `.github/workflows/` directory
- [ ] Task 2: Create `.github/workflows/ci.yml`
  - [ ] Subtask 2.1: Define `on: push` + `on: pull_request` triggers
  - [ ] Subtask 2.2: Configure pnpm setup action
  - [ ] Subtask 2.3: Configure Node 22 setup with pnpm cache
  - [ ] Subtask 2.4: Add `pnpm lint` step
  - [ ] Subtask 2.5: Add `pnpm typecheck` step
  - [ ] Subtask 2.6: Add `pnpm test:run` step
  - [ ] Subtask 2.7: Add coverage artifact upload
- [ ] Task 3: Verify package.json has `typecheck` script
  - [ ] Subtask 3.1: Add if missing
- [ ] Task 4: Local CI verification
  - [ ] Subtask 4.1: Run `pnpm lint` locally — zero errors
  - [ ] Subtask 4.2: Run `pnpm typecheck` locally — zero errors
  - [ ] Subtask 4.3: Run `pnpm test:run` locally — all pass
- [ ] Task 5: Document manual setup for Lucas
  - [ ] Subtask 5.1: Document GitHub branch protection steps
  - [ ] Subtask 5.2: Document Vercel repo connection steps
  - [ ] Subtask 5.3: Document GitHub Actions secrets setup

---

## Dev Agent Record

### Agent Model Used

claude-opus-4-5

### Debug Log References

### Completion Notes List

### File List

```
.github/workflows/ci.yml
```

**Modified files:**
```
src/package.json   (add typecheck script if missing)
```
