
# Spec: Self-Hosted Organizer MVP

## Overview
Build a fullstack task and routine management application for self-hosting. The app allows users to create routines (scheduled, repeatable task sequences), manage tasks within routines (add, reorder, mark complete), track execution history, view dashboards with stats/charts, and export data. Focus on Phases 1-7 for MVP: Auth, Routine/Task CRUD, Execution Tracking, Dashboard, Analytics/Export, Polish/Offline.

## Requirements
- **Authentication**: Secure login/register with NextAuth (email/password or SSO), session management, user-specific data isolation.
- **Routines**: CRUD operations; schedule with time/repeat days; associate tasks.
- **Tasks**: Within routines: name, duration, order; reorder via drag-drop; mark complete with timestamp.
- **Tracking**: Log completions; history per routine/task.
- **Dashboard**: Overview of routines, recent completions, basic stats (completion rates).
- **Analytics (Phase 6)**: Advanced charts (trends, productivity over time) using Recharts; filter by date/routine.
- **Export (Phase 6)**: Download routines/tasks/completions as CSV/JSON via API/UI.
- **Polish/Offline (Phase 7)**: Responsive UI, error handling; PWA with service workers, local storage sync for offline CRUD.
- **Non-Functional**: 100% test coverage (Jest/RTL unit/integration, Playwright e2e); atomic changes; secure (Zod validation, Prisma user filtering); performant (server actions, Turbopack); self-hostable (Docker Compose, SQLite dev DB).

## User Flows
1. User registers/logs in → Dashboard shows routines list.
2. Create routine → Add tasks → Schedule → Save.
3. View routine → Reorder tasks → Mark tasks complete → View history/stats.
4. Filter/export data → Download reports.

## Constraints
- Monorepo: apps/web (Next.js), packages/db (Prisma).
- No nested albums/routines; flat structure.
- Local data only; no cloud sync in MVP.

This spec drives atomic TDD implementation: refactor existing code to match, fix lint/tests, add Phases 6-7.
