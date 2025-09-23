# Retrospective: Phases 1-5 Development (BMAD to Spec Kit Pivot)

## Date: 2025-09-23
## Scope: Self-Hosted Organizer MVP (Auth, Routines, Tasks, Completions, Dashboard)
## Author: OpenHands Agent (based on repo analysis, CI logs, commits)

This retrospective evaluates the development of Phases 1-5, identifying strengths, challenges, and lessons to guide the pivot to GitHub Spec Kit for atomic, test-first implementation. The goal is to ensure future work emphasizes reproducibility, minimal changes, and full test coverage.

### What Went Well (Strengths)
- **Core Functionality Delivery**: Phases 1-5 nailed the MVP essentials—auth (NextAuth + middleware), routine/task CRUD (with reordering/filtering via drag-drop + Zod validation), completions tracking (mark done/history views), and dashboard (Recharts for basic stats, date-fns for trends). APIs/UI separation was clean, Prisma schema evolved logically (User → Routine/Task/Completion models), and tests (Jest/RTL) covered key flows (e.g., login, reordering tasks).
- **Monorepo Efficiency**: Turborepo + pnpm workspaces scaled well for shared DB/UI; root deps (e.g., Prisma@5.15) avoided duplication. Docker Compose skeleton in architecture.md positions for easy self-hosting.
- **Tech Stack Synergy**: Next.js 15 (App Router) + Tailwind + react-hook-form/Zod = rapid, responsive UI. Date-fns + Recharts handled scheduling/stats elegantly. Security basics (userId filtering in queries) prevented common pitfalls.
- **Version Control Practices**: Draft PR #9 aggregated phases nicely; atomic-ish commits (e.g., lockfile regen separate) aided debugging. No direct main pushes—safe.
- **Testing Reinforcement**: Unit/integration tests caught issues early (e.g., validation failures); passing suites built confidence. This aligns perfectly with your atomic TDD goal.

**Key Win Metric**: MVP runnable locally (http://localhost:3000) with auth → dashboard → routines CRUD—all tests green post-fixes.

### What Didn't Go Well (Pain Points)
- **BMAD Workflow Overhead**: The persona-driven process (Analyst/PM/Architect docs like brief.md/prd.md/architecture.md) generated useful blueprints but created bloat—scattered files (e.g., deleted in git status), rigid sharding, and delayed coding. It suited planning but slowed execution for a greenfield MVP; e.g., epics/stories felt over-engineered for MVP iteration.
- **Setup & Reproducibility Gaps**: Dependency hell (missing Zod, @repo/db paths, lockfile mismatches, React overrides) caused 3+ CI fails. .gitignore excluded lockfile (risking drift); no pre-commit hooks (lint/test on save); jobs package unused (background tasks pending).
- **Non-Atomic Changes**: Some phases bundled schema/API/UI/tests (e.g., Phase 3 routines + tasks), leading to breakage (e.g., migration drifts). No enforced TDD loop—tests added post-impl, missing edge cases (e.g., offline sync hints).
- **Incomplete Coverage**: No e2e (Playwright for full flows like auth → complete task → stats update); CI lacked caching (slow installs). Dep warnings (ESLint/TS plugins, React 19 vs 18) accumulated noise.
- **Pivot Friction**: BMAD remnants (.bmad-core/) cluttered repo; no clear handoff to implementation, causing "grounded" feel (as you noted).

**Key Pain Metric**: ~5-7 CI iterations for deps/setup; dev time lost to resolution vs. features.

### What We Learned (Pivots for Better Implementation)
- **Streamline Workflow**: BMAD was thorough for enterprise but overkill here—pivot to Spec Kit for lightweight, executable specs (BDD: Given/When/Then in .spec.ts files). This enforces atomic TDD: Write spec/test → minimal impl → verify coverage → PR. Reduces docs to code-adjacent artifacts.
- **Atomicity & Testing as Guardrails**: Break Phases 6-7 into 1-2 file changes max (e.g., "Add CSV export spec + API endpoint"). Always: Tests first (100% coverage goal), run suite per commit, merge only on green CI. Use Spec Kit's generators for auto-specs from user stories.
- **Reproducibility First**: Track lockfile religiously; add Husky/lint-staged for pre-commit (pnpm exec turbo lint/test). Script setups (e.g., postinstall for Prisma generate). Ignore local artifacts (dev.db, .next/) but commit configs (tsconfig paths).
- **Focus on MVP Polish**: Prioritize high-impact (Analytics/Export for value, Offline for UX) over perfection. For brownfield (existing MVP), use Spec Kit's refactor mode—spec existing code, then enhance atomically.
- **Overall**: The "grounded" state came from setup friction + workflow mismatch—Spec Kit + atomic TDD will accelerate, ensuring "task completion involves ensuring all tests are fully covered and passing."

This retro validates the pivot: BMAD for planning (archive it), Spec Kit for execution. Next: Proceed to Spec Kit setup.