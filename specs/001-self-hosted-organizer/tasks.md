
# Actionable Task List: Self-Hosted Organizer MVP

## Phase 0: Refactor & Fix Existing (Atomic TDD for Phases 1-5)
1. **Fix Lint Errors - no-explicit-any**: Update types in routines.test.ts, tasks.test.ts, API routes (/api/routines, /api/tasks, /api/completions, /api/stats). Add explicit types (e.g., Prisma models, Zod schemas). Write/update tests to cover. Verify with `pnpm lint --fix`.
2. **Fix Parsing Errors in Tests**: Resolve syntax issues in completions.test.tsx (line 55: add missing ')'), routine-tasks.test.tsx (line 110: add missing ','). Run `jest` to confirm passing.
3. **Fix prefer-const Warnings**: Change let to const where possible in API routes and utils. Test handlers.
4. **Fix exhaustive-deps in Pages**: Add missing deps or use useCallback/useMemo in dashboard, completions, routines pages. Run RTL tests.
5. **Fix no-html-link-for-pages in Dashboard**: Use Next.js Link component instead of <a>. Test navigation.
6. **Achieve 100% Test Coverage for Phases 1-5**: Run `jest --coverage`, add missing tests for edge cases (e.g., empty routines, invalid inputs). Refactor code minimally to pass.
7. **Update Pre-Commit Hooks**: Ensure hooks run full lint/test/build; test with staged changes.

## Phase 6: Analytics and Export
8. **Add Analytics API**: Create /api/analytics route with aggregate queries (completion trends, productivity metrics using date-fns). Use Zod for params (date range, routine filter). Write integration tests.
9. **Implement Advanced Charts Component**: Add AdvancedChart.tsx using Recharts (line/bar for trends). Integrate in dashboard with filters. Unit test with RTL.
10. **Add Export API**: Create /api/export route for CSV/JSON generation (routines/tasks/completions). Use server action. Tests for formats/edges.
11. **Implement Export UI**: Add ExportButton component with form (format, filters). Handle download. Integration tests.

## Phase 7: Polish and Offline Support
12. **PWA Setup**: Configure next.config.js for PWA (manifest.json, icons). Add service-worker.js for caching. Test offline navigation.
13. **Offline CRUD Sync**: Implement localStorage hooks for pending mutations (create/update routines/tasks). Sync on reconnect via service worker. Tests for offline/online flows.
14. **UI Polish**: Enhance responsiveness (Tailwind mobile classes), add error toasts (e.g., via react-hot-toast if added minimally). Accessibility checks.
15. **E2E Tests**: Setup Playwright; write flows (auth → create routine → complete task → export). Run suite.

## Verification
- Each task: Spec → Test → Code → Verify (lint/test/build/coverage).
- After all: Full CI run, update retrospective.md.

Tasks are atomic; implement sequentially with Spec Kit /implement per task.
