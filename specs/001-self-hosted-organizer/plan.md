
# Technical Implementation Plan: Self-Hosted Organizer MVP

## Tech Stack
- **Framework**: Next.js 15 (App Router, Server Components/Actions for mutations).
- **Database/ORM**: Prisma 5 with SQLite (dev.db); models: User, Account, Routine, Task, Completion.
- **Styling**: Tailwind CSS 4 (utility-first, responsive classes).
- **Forms/Validation**: React Hook Form + Zod resolvers.
- **Auth**: NextAuth.js 4 with Prisma adapter (credentials/SSO providers).
- **Charts**: Recharts 2 for dashboard/analytics (line/bar charts with date-fns for formatting).
- **Build/Tools**: Turborepo for monorepo (apps/web, packages/db); pnpm workspaces; Jest 29 + RTL 16 for TDD (100% coverage); ESLint 9 + Prettier 3; Husky/lint-staged pre-commit.
- **Deployment**: Docker Compose (web/jobs services); PWA manifest/service workers for offline (Phase 7).
- **Other**: date-fns 4 for dates; no additional libs (minimalism).

## Architecture
- **Monorepo Structure**: apps/web (pages: dashboard, routines/[id], tasks, completions; API routes: /api/routines, /api/tasks, /api/completions, /api/stats, /api/export); packages/db (prisma/schema.prisma, client/index.ts singleton).
- **Data Flow**: Server actions for CRUD (e.g., createRoutine, reorderTasks); client fetches via fetch() or SWR if needed; userId filtering in all queries.
- **Offline (Phase 7)**: Service Worker for caching API responses; IndexedDB/localStorage for pending mutations, sync on reconnect.
- **Testing**: Unit (components, utils), Integration (API handlers, forms), E2E (Playwright for flows post-MVP).
- **Phased Implementation**:
  - **Refactor Phases 1-5**: Fix lint (no-explicit-any → types, prefer-const, exhaustive-deps); update tests for coverage; ensure atomic commits.
  - **Phase 6**: Add /api/analytics (aggregate queries), /api/export (CSV/JSON generation); UI components (AdvancedChart, ExportButton).
  - **Phase 7**: Add next.config.js PWA config; service-worker.js; localStorage hooks for sync.

## Risks/Mitigations
- Dep mismatches (React 19 → override to 18): Lockfile overrides.
- CI failures: Run lint/test/build locally before push.
- Coverage gaps: Generate reports with Jest --coverage; aim 100%.

This plan ensures spec-driven, atomic TDD: implement one task/spec at a time, verify tests pass.
