# Project Constitution: Self-Hosted Organizer

## Core Principles
- **Atomic Changes**: Every implementation targets minimal, focused modifications (1-2 files max per spec). No bundling unrelated features.
- **Test-First Development (TDD)**: Write executable specs and tests before code. Use Jest/RTL for unit/integration (100% coverage goal), Playwright for e2e later.
- **Quality Over Speed**: Prioritize reproducibility (lockfiles, pre-commit hooks), security (user-owned data, Zod validation), and performance (minimal deps, Turbopack).
- **Tech Stack Fidelity**: Next.js 15 (App Router), Prisma/SQLite, Tailwind CSS, React Hook Form/Zod, Recharts/date-fns. Monorepo with Turborepo/pnpm workspaces.
- **Self-Hosting Focus**: Ensure Docker Compose compatibility; offline/PWA support in Phase 7.
- **Verification**: All changes must pass full test suite, linting, and build before commit/PR. Use Spec Kit for spec → plan → tasks → implement flow.

## Guidelines
- Follow Next.js/Prisma best practices (e.g., server actions for mutations, userId filtering).
- Commit messages: Conventional (feat:/fix:/chore: description).
- No external deps beyond stack unless justified in spec.
- Retrospective integration: Update docs/retrospective.md after phases.

This constitution guides all Spec Kit commands for consistent, high-quality development.