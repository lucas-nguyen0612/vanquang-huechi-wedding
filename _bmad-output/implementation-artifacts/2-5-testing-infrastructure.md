# Story 2.5: Testing Infrastructure Setup

Status: review

## Story

As a **developer**,
I want **Vitest + testing-library được setup và chạy được tests**,
So that **tôi có thể viết unit tests cho business logic**.

## Context

**Epic:** 2 — Foundation Setup
**Story ID:** 2.5
**Story Key:** 2-5-testing-infrastructure
**Dependencies:** Story 2.4 (Feature Folder Structure) — stores and utils need to exist for meaningful tests
**Preceding Story:** 2.4 (Feature Folder Structure) — same epic, same sprint
**Outputs to:** All subsequent epics (Epics 3–7)
**Role:** Developer

---

## Acceptance Criteria

### AC-1: Vitest Config

**Given** `vitest.config.ts` được tạo
**When** tôi chạy `pnpm test`
**Then** Vitest test runner khởi động không lỗi
**And** UI mode available via `pnpm test:ui` (if available)
**And** Coverage reporter available via `pnpm test:coverage`

### AC-2: Testing Library Installed

**Given** `@testing-library/react` và `@testing-library/jest-dom` được install
**When** tôi import trong `.tsx` test files
**Then** imports không có lỗi TypeScript
**And** `render()`, `screen`, `fireEvent`, `waitFor` có sẵn

### AC-3: Sample Test Passes

**Given** testing setup hoàn tất
**When** tôi viết test cho một utility function (e.g., `secondsToMMSS` từ `features/pomodoro/utils.ts`)
**Then** test chạy và pass
**And** coverage report được generate

### AC-4: GitHub Actions CI Integration

**Given** testing setup hoàn tất
**When** CI pipeline chạy (Story 2.6)
**Then** tests được execute tự động trước khi deploy
**And** coverage output được uploaded as artifact

---

## Technical Requirements

### vitest.config.ts

Location: `src/vitest.config.ts` (project root)

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,                    // describe, it, expect globally available
    setupFiles: ['./src/vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: [
        'node_modules/**',
        'src/**/*.d.ts',
        'src/vitest.setup.ts',
        'src/vitest.config.ts',
      ],
    },
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### vitest.setup.ts

Location: `src/vitest.setup.ts`

```typescript
import '@testing-library/jest-dom'
// Optional: mock Supabase client globally to avoid DB calls in unit tests
// Optional: mock next/navigation to avoid router calls
```

### package.json Scripts (Add to existing)

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:run": "vitest run"
  }
}
```

### Dependencies to Install

```bash
pnpm add -D @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom
```

Verify existing `vitest` version in `package.json` — use compatible version:
- vitest ^4.x → `@vitejs/plugin-react` ^4.x
- vitest ^3.x → `@vitejs/plugin-react` ^3.x

### Test File Pattern

- Location: Co-located with source: `src/features/[feature]/[name].test.ts`
- Pattern: `*.test.ts` and `*.test.tsx`
- Naming: `[function-name].test.ts` or `[component-name].test.tsx`

### DO NOT

- ❌ Không test implementation details — test behavior/output
- ❌ Không mock những thứ đang test — mock dependencies
- ❌ Không viết test không có assertion
- ❌ Không ignore tests (`test.skip`) — fix hoặc delete
- ❌ Không hardcode base URL trong tests — use environment variable

### TypeScript Paths

Ensure `tsconfig.json` has path aliases configured for `@/*` to work in test files:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Sample Test File

```typescript
// src/features/pomodoro/secondsToMMSS.test.ts
import { describe, it, expect } from 'vitest'
import { secondsToMMSS } from './utils'

describe('secondsToMMSS', () => {
  it('converts 0 seconds to 00:00', () => {
    expect(secondsToMMSS(0)).toBe('00:00')
  })

  it('converts 65 seconds to 01:05', () => {
    expect(secondsToMMSS(65)).toBe('01:05')
  })

  it('converts 1500 seconds (25min) to 25:00', () => {
    expect(secondsToMMSS(1500)).toBe('25:00')
  })
})
```

---

## Dev Notes

### Current State

- `vitest` đã có trong `devDependencies` (`package.json`)
- `vitest.config.ts` **chưa tồn tại** — cần tạo
- `@testing-library/react` **chưa có** trong dependencies
- `@testing-library/jest-dom` **chưa có** trong dependencies
- `@vitejs/plugin-react` **chưa có** trong dependencies
- `jsdom` environment **chưa có** trong dependencies
- No test files exist yet

### Setup Checklist

1. Install missing dev dependencies
2. Create `src/vitest.config.ts`
3. Create `src/vitest.setup.ts`
4. Update `src/package.json` scripts
5. Verify `tsconfig.json` path aliases
6. Write one sample passing test
7. Run `pnpm test:run` — confirm green
8. Run `pnpm test:coverage` — confirm coverage report generated

### References

- Architecture: `_bmad-output/planning-artifacts/architecture.md` — Testing standards
- Project context: `src/CLAUDE.md` — Dev commands, patterns
- Package.json: `src/package.json` — Current dependencies
- Epics source: `_bmad-output/planning-artifacts/epics.md#Story 2.5`

---

## Tasks / Subtasks

- [x] Task 1: Install testing dependencies
  - [x] Subtask 1.1: `pnpm add -D @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom`
  - [x] Subtask 1.2: Verify `vitest` version compatibility
- [x] Task 2: Create Vitest config
  - [x] Subtask 2.1: Create `src/vitest.config.ts`
  - [x] Subtask 2.2: Create `src/vitest.setup.ts`
- [x] Task 3: Update package.json scripts
  - [x] Subtask 3.1: Add `test`, `test:ui`, `test:coverage`, `test:run` scripts
- [x] Task 4: Verify TypeScript path aliases
  - [x] Subtask 4.1: Check `tsconfig.json` has `@/*` paths configured
  - [x] Subtask 4.2: Fix if missing
- [x] Task 5: Write sample passing test
  - [x] Subtask 5.1: Create `src/features/pomodoro/secondsToMMSS.test.ts`
  - [x] Subtask 5.2: Test `secondsToMMSS` utility (or whatever utils exist after Story 2.4)
- [x] Task 6: Run and verify
  - [x] Subtask 6.1: `pnpm test:run` — all tests pass
  - [x] Subtask 6.2: `pnpm test:coverage` — coverage report generated
  - [x] Subtask 6.3: `pnpm lint` — no errors introduced

---

## Dev Agent Record

### Agent Model Used

claude-opus-4-5

### Debug Log References

- `vitest.config.ts` originally used `__dirname` which doubled paths when cwd is `src/`. Fixed by using relative `./` paths and adjusting `setupFiles` from `'./src/vitest.setup.ts'` → `'./vitest.setup.ts'`.
- `vitest.config.ts` `include` pattern `src/**/*.test.ts` was relative to cwd (`src/`) causing "No test files found". Fixed to `**/*.test.ts`.
- `vitest.config.ts` `alias` changed from `'@': path.resolve(__dirname, './src')` → `'~/*': path.resolve(__dirname, '.')` to match existing project convention (the project uses `~/*` alias pointing to `src/`).
- `__tests__/theme.test.ts` had hardcoded `src/tailwind.config.ts` etc. doubling `src/` when cwd is `src/`. Fixed paths to remove the extra `src/` prefix.
- `tailwind.config.ts` used `require()` directly which is forbidden by ESLint in `.ts` files. Fixed by adding `import { createRequire } from "module"` and using `const require = createRequire(import.meta.url)`.
- Added `@vitest/coverage-v8` dependency (required by `coverage: { provider: 'v8' }` in vitest config).

### Completion Notes List

**2026-04-01** — Testing infrastructure fully implemented and green.
- Installed: `@testing-library/react`, `@testing-library/jest-dom`, `@vitejs/plugin-react`, `jsdom`, `@vitest/coverage-v8`
- Created `src/vitest.config.ts` with jsdom env, globals, coverage (v8), `@vitejs/plugin-react`, `~/*` alias
- Created `src/vitest.setup.ts` with `@testing-library/jest-dom` import
- Updated `src/package.json` with `test`, `test:ui`, `test:coverage`, `test:run` scripts
- Fixed `__tests__/theme.test.ts` broken file paths (pre-existing issue from Story 2.3)
- Fixed `tailwind.config.ts` ESLint `require()` error (pre-existing issue from Story 2.3)
- All 32 tests pass, coverage report generated, lint 0 errors on source files

### File List

**New files:**
```
src/vitest.config.ts
src/vitest.setup.ts
src/features/pomodoro/secondsToMMSS.test.ts
```

**Modified files:**
```
src/package.json   (scripts added)
src/__tests__/theme.test.ts   (path fix — pre-existing broken paths)
src/tailwind.config.ts        (eslint fix — pre-existing require() error)
```

## Change Log

- **2026-04-01**: Initial testing infrastructure setup — vitest 4.x with jsdom, @testing-library/react, @testing-library/jest-dom, @vitejs/plugin-react, jsdom, @vitest/coverage-v8. All 32 tests pass. Coverage reports generated. Lint clean on source files.
