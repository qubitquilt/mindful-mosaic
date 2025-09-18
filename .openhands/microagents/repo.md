# Self-Hosted Organizer Repository Guide for OpenHands Microagents

This document provides a comprehensive overview of the Self-Hosted Organizer project, designed for OpenHands microagents to navigate, understand, and autonomously modify the codebase. It consolidates the full architecture from `docs/architecture/`, enabling agents to perform tasks like adding features, fixing bugs, or extending functionality while maintaining consistency.

## Project Overview

This document outlines the complete fullstack architecture for the Self-Hosted Organizer, including the backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack. This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process.

**Starter Template or Existing Project**  
N/A - This is a greenfield project. The architecture will be designed from scratch based on the technology stack defined in the PRD, without the use of an external starter template.

**Change Log**  
| Date | Version | Description | Author |  
| :---- | :---- | :---- | :---- |  
| 2025-09-05 | 1.0 | Initial Architecture Draft | Winston |

## Tech Stack

| Category | Technology | Version | Notes |  
| :--- | :--- | :--- | :--- |  
| **Frontend Framework** | Next.js | ~14.2.0 | App Router, React Server Components |  
| **UI Library** | React | ~18.3.0 | |  
| **Styling** | Tailwind CSS | ~3.4.0 | Utility-first CSS framework |  
| **Authentication** | NextAuth.js | ~5.0.0 | Handles SSO and session management |  
| **Backend Framework**| Next.js API Routes | ~14.2.0 | For all backend endpoints |  
| **ORM** | Prisma | ~5.15.0 | Database toolkit for TypeScript |  
| **Relational Database**| SQLite | | Default for local development |  
| **Key-Value Store** | Valkey | | For caching and session data |  
| **Testing** | Jest | ~29.7.0 | Test runner |  
| **Testing Library** | React Testing Library| ~16.0.0 | For component testing |  
| **Containerization** | Docker | | For creating portable environments |  
| **Orchestration** | Docker Compose | | For local multi-container setup |  

For more details on coding conventions and styling, see the [Coding Standards](#coding-standards) section.

## Repository Structure

This outlines the source tree for the Self-Hosted Organizer monorepo.

```
/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   └── lib/
│   │   ├── next.config.js
│   │   └── package.json
│   └── jobs/
│       ├── src/
│       └── package.json
├── packages/
│   ├── db/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── package.json
│   └── ui/
│       ├── src/
│       └── package.json
└── package.json
```

### Key Directories
- **`apps/web`**: The main Next.js application, containing all UI and API routes.
- **`apps/jobs`**: The independent job server for background tasks.
- **`packages/db`**: The shared Prisma package for database access.
- **`packages/ui`**: A shared component library (optional, for future use).

For microagents: Entry points are `apps/web/src/app/page.tsx` for UI and `apps/web/src/app/api/` for backend. Shared logic in `packages/`. Use npm workspaces for dependencies.

## High-Level Architecture

**Technical Summary**  
The architecture is designed as a containerized, two-service system within a unified monorepo. The primary service is a fullstack Next.js application that handles all user interactions, rendering the UI and providing a backend API. The secondary, independent service is a job server dedicated to processing background tasks like notifications. Data persistence is managed by Prisma, using a hybrid approach of SQLite for relational data and Valkey for key-value storage, with a core focus on data encryption at rest. This design prioritizes ease of self-hosting, scalability, and a clear separation of concerns between real-time user interactions and asynchronous background processing.

**Platform and Infrastructure Choice**  
- **Platform:** Self-hosted via containers. The primary deployment targets are Docker Compose for simple, single-server setups and Kubernetes for more scalable environments.  
- **Key Services:**  
  - **Containerization:** Docker will be used to package the Next.js web app and the job server into portable images.  
  - **Orchestration:** Docker Compose will be the default for local development and basic deployments.  

**Repository Structure**  
- **Structure:** Monorepo.  
- **Tooling:** Standard npm workspaces.  

**High-Level Architecture Diagram**

```mermaid
graph TD
    subgraph UsersBrowser
        U[Users Browser]
    end
    subgraph SelfHostedInfrastructure
        subgraph WebServiceNextJsContainer
            WebApp[Next Js Frontend]
            API[Next Js API Routes]
            Prisma[Prisma Client]
        end
        subgraph JobServerNodeJsContainer
            JobRunner[Job Processor]
            PrismaJobs[Prisma Client]
        end
        subgraph DataStores
            SQLite[SQLite Database]
            Valkey[Valkey Key Value Store]
        end
    end
    subgraph ExternalServices
        SSO[SSO Providers e g Google]
        BrowserNotify[Browser Notifications]
    end
    U -- HTTPS --> WebApp
    WebApp -- Server side Calls --> API
    API -- Queries Mutations --> Prisma
    Prisma -- Reads Writes --> SQLite
    Prisma -- Reads Writes --> Valkey
    JobRunner -- Checks for jobs --> PrismaJobs
    PrismaJobs -- Reads --> SQLite
    JobRunner -- Sends Notifications --> BrowserNotify
    U -- Auth Flow --> SSO
    SSO -- Callback --> API
```

**Architectural and Design Patterns**  
- **Two-Service Model:** Separating the user-facing web application from the background job processor.  
- **Monorepo:** Using a single repository to manage both services and shared code.  
- **Repository Pattern:** Implemented via Prisma to abstract all data access logic.  
- **Containerization:** Using Docker to ensure environment consistency and simplify deployment.

For microagents: Modify UI in `apps/web/src/components/`, API in `apps/web/src/app/api/`, jobs in `apps/jobs/src/`. Update schema in `packages/db/prisma/schema.prisma` and run migrations.

## Data Models

(For brevity, the Data Models section from the previous step is included here.)  
*Note for agents: Expand with Prisma models as needed; current focus on User, Account, Routine, Task.*

## Database Schema

This is the definitive schema.prisma file that will be located in the packages/db/prisma directory. It defines all tables, fields, and relations for the application.

// packages/db/prisma/schema.prisma

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model User {
  id        String    @id @default(cuid())
  name      String?
  email     String    @unique
  image     String?
  accounts  Account[]
  routines  Routine[]
}

model Routine {
  id            String   @id @default(cuid())
  name          String
  scheduledTime String
  repeatDays    String   // Stored as a comma-separated string e.g., "MONDAY,TUESDAY"
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks         Task[]
}

model Task {
  id        String  @id @default(cuid())
  name      String
  duration  Int     // Duration in minutes
  order     Int
  routineId String
  routine   Routine @relation(fields: [routineId], references: [id], onDelete: Cascade)
}

For microagents: Use Prisma Client in `packages/db/` for queries. Run `npx prisma generate` after schema changes.

## API Specification

(For brevity, the OpenAPI Specification from the previous step is included here.)  
*Note for agents: API routes in `apps/web/src/app/api/` (e.g., /api/auth/[...nextauth], /api/routines). Implement new routes following Next.js conventions; protect with auth middleware.*

## Infrastructure and Deployment

The primary method for local development and basic deployment will be Docker Compose.

**docker-compose.yml**

version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: ./apps/web/Dockerfile
    ports:
      - '3000:3000'
    volumes:
      - .:/app
    environment:
      - DATABASE_URL=file:/app/packages/db/prisma/dev.db
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET= # GENERATE a secret for this
      # Add other SSO provider secrets here
    networks:
      - app-network
  jobs:
    build:
      context: .
      dockerfile: ./apps/jobs/Dockerfile
    volumes:
      - .:/app
    environment:
      - DATABASE_URL=file:/app/packages/db/prisma/dev.db
    depends_on:
      - web
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

For microagents: Build with `docker compose up --build`. Environment vars in .env; avoid hardcoding secrets.

## Security

- **Authentication:** Handled by NextAuth.js, which provides CSRF protection, secure cookie management, and standard OAuth 2.0 flows.  
- **Authorization:** All API endpoints must be protected and will only operate on data owned by the authenticated user, enforced by checking userId in all Prisma queries.  
- **Data Encryption:** The requirement for encryption at rest will be fulfilled by filesystem-level encryption on the host server. The application logic does not need to handle encryption itself.  
- **Secrets Management:** All secrets (database URLs, NEXTAUTH_SECRET, SSO provider keys) must be managed via environment variables and never hardcoded.

For microagents: Always validate user ownership in queries (e.g., `where: { userId: session.user.id }`). Use secure env vars.

## Coding Standards

This document outlines the coding standards and conventions to be followed for the Self-Hosted Organizer project.

### Styling Strategy

To maintain a clean, consistent, and maintainable codebase, this project will use **Tailwind CSS** as its primary styling methodology.

#### Rationale
- **Utility-First:** Tailwind's utility-first approach allows for rapid UI development without writing custom CSS.  
- **Consistency:** It enforces a consistent design system by using a predefined set of utilities.  
- **Performance:** It can produce highly optimized, small CSS files by purging unused styles.  
- **Minimalism:** Aligns with the project's goal of a clean and minimalist user interface.  

#### Implementation
- All new components should be styled directly in the JSX using Tailwind classes.  
- Custom CSS should be avoided. If a component requires complex styling that cannot be achieved with utilities, create a component-specific CSS module.  
- Use the `@apply` directive sparingly and only for reusable component classes.

### General Coding Guidelines
- Use TypeScript for type safety.  
- Follow DRY principles; extract shared logic to `packages/`.  
- Write tests for new features using Jest and React Testing Library.  
- Commit messages: Conventional Commits (e.g., feat: add routine API).  

For microagents: When modifying code, match existing patterns (e.g., arrow functions, early returns). Analyze files like `apps/web/src/components/` for style consistency before changes.

## Microagents Navigation and Best Practices
- **Key Files to Monitor:** `schema.prisma` for DB changes, `apps/web/src/app/api/` for endpoints, `apps/web/src/components/` for UI.
- **Workflows:** For new features, update schema -> migrate -> add API route -> update components -> add tests. Run `pnpm turbo run build` to verify.
- **Tools Integration:** Use Prisma for DB ops, NextAuth for auth checks. Avoid external deps unless in tech stack.
- **Error Handling:** Use try-catch in async ops; log with console.error for debugging.

This guide ensures microagents can operate effectively. Update as the project evolves.

## BMAD Workflow Integration

The Self-Hosted Organizer project integrates the BMAD Agentic Workflow using OpenHands microagents, enabling structured, multi-agent development following the Breakthrough Method for Agile AI-Driven Development (BMAD) methodology.

### Persona Documentation and Linkages

Each BMAD persona has comprehensive documentation in [.bmad-core/agents/](.bmad-core/agents/), including roles, principles, commands, and dependencies (tasks, templates, checklists). Microagent implementations in [.openhands/microagents/](.openhands/microagents/) link to these for full context. Refer to [.bmad-core/core-config.yaml](.bmad-core/core-config.yaml) for project configuration.

| Persona | Agent File | Key Dependencies | Microagent Examples |
|---------|------------|------------------|---------------------|
| Analyst | [.bmad-core/agents/analyst.md](.bmad-core/agents/analyst.md) | Tasks: [advanced-elicitation.md](.bmad-core/tasks/advanced-elicitation.md), [create-doc.md](.bmad-core/tasks/create-doc.md), [facilitate-brainstorming-session.md](.bmad-core/tasks/facilitate-brainstorming-session.md); Templates: [brainstorming-output-tmpl.yaml](.bmad-core/templates/brainstorming-output-tmpl.yaml), [competitor-analysis-tmpl.yaml](.bmad-core/templates/competitor-analysis-tmpl.yaml), [market-research-tmpl.yaml](.bmad-core/templates/market-research-tmpl.yaml), [project-brief-tmpl.yaml](.bmad-core/templates/project-brief-tmpl.yaml); Data: [bmad-kb.md](.bmad-core/data/bmad-kb.md), [brainstorming-techniques.md](.bmad-core/data/brainstorming-techniques.md) | 01_analyst-create-brief.md |
| PM | [.bmad-core/agents/pm.md](.bmad-core/agents/pm.md) | Tasks: [brownfield-create-epic.md](.bmad-core/tasks/brownfield-create-epic.md), [brownfield-create-story.md](.bmad-core/tasks/brownfield-create-story.md), [correct-course.md](.bmad-core/tasks/correct-course.md), [create-doc.md](.bmad-core/tasks/create-doc.md), [shard-doc.md](.bmad-core/tasks/shard-doc.md); Templates: [brownfield-prd-tmpl.yaml](.bmad-core/templates/brownfield-prd-tmpl.yaml), [prd-tmpl.yaml](.bmad-core/templates/prd-tmpl.yaml); Checklists: [pm-checklist.md](.bmad-core/checklists/pm-checklist.md); Data: [technical-preferences.md](.bmad-core/data/technical-preferences.md) | 02_pm-create-prd.md |
| Architect | [.bmad-core/agents/architect.md](.bmad-core/agents/architect.md) | Tasks: [create-deep-research-prompt.md](.bmad-core/tasks/create-deep-research-prompt.md), [create-doc.md](.bmad-core/tasks/create-doc.md), [document-project.md](.bmad-core/tasks/document-project.md), [execute-checklist.md](.bmad-core/tasks/execute-checklist.md), [shard-doc.md](.bmad-core/tasks/shard-doc.md); Templates: [architecture-tmpl.yaml](.bmad-core/templates/architecture-tmpl.yaml), [brownfield-architecture-tmpl.yaml](.bmad-core/templates/brownfield-architecture-tmpl.yaml), [front-end-architecture-tmpl.yaml](.bmad-core/templates/front-end-architecture-tmpl.yaml), [fullstack-architecture-tmpl.yaml](.bmad-core/templates/fullstack-architecture-tmpl.yaml); Checklists: [architect-checklist.md](.bmad-core/checklists/architect-checklist.md); Data: [technical-preferences.md](.bmad-core/data/technical-preferences.md) | 03_architect-create-design.md |
| Dev | [.bmad-core/agents/dev.md](.bmad-core/agents/dev.md) | Tasks: [apply-qa-fixes.md](.bmad-core/tasks/apply-qa-fixes.md), [execute-checklist.md](.bmad-core/tasks/execute-checklist.md), [validate-next-story.md](.bmad-core/tasks/validate-next-story.md); Checklists: [story-dod-checklist.md](.bmad-core/checklists/story-dod-checklist.md) | 05_dev-implement-story.md |
| QA | [.bmad-core/agents/qa.md](.bmad-core/agents/qa.md) | Tasks: [nfr-assess.md](.bmad-core/tasks/nfr-assess.md), [qa-gate.md](.bmad-core/tasks/qa-gate.md), [review-story.md](.bmad-core/tasks/review-story.md), [risk-profile.md](.bmad-core/tasks/risk-profile.md), [test-design.md](.bmad-core/tasks/test-design.md), [trace-requirements.md](.bmad-core/tasks/trace-requirements.md); Templates: [qa-gate-tmpl.yaml](.bmad-core/templates/qa-gate-tmpl.yaml); Data: [technical-preferences.md](.bmad-core/data/technical-preferences.md) | 06_qa-review-code.md |
| PO | [.bmad-core/agents/po.md](.bmad-core/agents/po.md) | Tasks: [execute-checklist.md](.bmad-core/tasks/execute-checklist.md); Checklists: [po-master-checklist.md](.bmad-core/checklists/po-master-checklist.md), [story-draft-checklist.md](.bmad-core/checklists/story-draft-checklist.md) | N/A (master checklist validation) |
| SM | [.bmad-core/agents/sm.md](.bmad-core/agents/sm.md) | Tasks: [create-next-story.md](.bmad-core/tasks/create-next-story.md), [review-story.md](.bmad-core/tasks/review-story.md), [validate-next-story.md](.bmad-core/tasks/validate-next-story.md); Templates: [story-tmpl.yaml](.bmad-core/templates/story-tmpl.yaml); Checklists: [story-draft-checklist.md](.bmad-core/checklists/story-draft-checklist.md) | bmad-sm-draft |
| UX Expert | [.bmad-core/agents/ux-expert.md](.bmad-core/agents/ux-expert.md) | Tasks: [generate-ai-frontend-prompt.md](.bmad-core/tasks/generate-ai-frontend-prompt.md); Templates: [front-end-spec-tmpl.yaml](.bmad-core/templates/front-end-spec-tmpl.yaml) | N/A (UI spec generation) |
| BMAD Orchestrator | [.bmad-core/agents/bmad-orchestrator.md](.bmad-core/agents/bmad-orchestrator.md) | Workflows: [greenfield-fullstack.yaml](.bmad-core/workflows/greenfield-fullstack.yaml), [brownfield-ui.yaml](.bmad-core/workflows/brownfield-ui.yaml), etc.; Tasks: [shard-doc.md](.bmad-core/tasks/shard-doc.md) | 00_orchestrator-help.md |
| BMAD Master | [.bmad-core/agents/bmad-master.md](.bmad-core/agents/bmad-master.md) | Tasks: [index-docs.md](.bmad-core/tasks/index-docs.md), [kb-mode-interaction.md](.bmad-core/tasks/kb-mode-interaction.md); Data: [bmad-kb.md](.bmad-core/data/bmad-kb.md) | N/A (master task execution) |


### BMAD Overview

BMAD simulates an agile team with specialized agents for planning and development. The workflow divides into Planning (web UI or powerful IDE agents for cost efficiency) and Core Development Cycle (IDE-focused).

#### Planning Workflow

```mermaid
graph TD
    A[Start: Project Idea] --> B{Optional: Analyst Research}
    B -->|Yes| C[Analyst: Brainstorming Optional]
    B -->|No| G{Project Brief Available?}
    C --> C2[Analyst: Market Research Optional]
    C2 --> C3[Analyst: Competitor Analysis Optional]
    C3 --> D[Analyst: Create Project Brief]
    D --> G
    G -->|Yes| E[PM: Create PRD from Brief Fast Track]
    G -->|No| E2[PM: Interactive PRD Creation More Questions]
    E --> F[PRD Created with FRs, NFRs, Epics & Stories]
    E2 --> F
    F --> F2{UX Required?}
    F2 -->|Yes| F3[UX Expert: Create Front End Spec]
    F2 -->|No| H[Architect: Create Architecture from PRD]
    F3 --> F4[UX Expert: Generate UI Prompt for Lovable/V0 Optional]
    F4 --> H2[Architect: Create Architecture from PRD + UX Spec]
    H --> Q{Early Test Strategy? Optional}
    H2 --> Q
    Q -->|Yes| R[QA: Early Test Architecture Input on High-Risk Areas]
    Q -->|No| I
    R --> I[PO: Run Master Checklist]
    I --> J{Documents Aligned?}
    J -->|Yes| K[Planning Complete]
    J -->|No| L[PO: Update Epics & Stories]
    L --> M[Update PRD/Architecture as needed]
    M --> I
    K --> N[Switch to IDE If in a Web Agent Platform]
    N --> O[PO: Shard Documents]
    O --> P[Ready for SM/Dev Cycle]

    style A fill:#f5f5f5,color:#000
    style B fill:#e3f2fd,color:#000
    style C fill:#e8f5e9,color:#000
    style E fill:#fff3e0,color:#000
    style F fill:#fff3e0,color:#000
    style H fill:#f3e5f5,color:#000
    style I fill:#f9ab00,color:#fff
    style K fill:#34a853,color:#fff
    style N fill:#1a73e8,color:#fff
    style P fill:#34a853,color:#fff
```

#### Core Development Cycle

```mermaid
graph TD
    A[Development Phase Start] --> B[SM: Reviews Previous Story Dev/QA Notes]
    B --> B2[SM: Drafts Next Story from Sharded Epic + Architecture]
    B2 --> S{High-Risk Story? Optional}
    S -->|Yes| T[QA: risk + design on Draft Story]
    S -->|No| B3
    T --> U[Test Strategy & Risk Profile Created]
    U --> B3{PO: Validate Story Draft Optional}
    B3 -->|Validation Requested| B4[PO: Validate Story Against Artifacts]
    B3 -->|Skip Validation| C{User Approval}
    B4 --> C
    C -->|Approved| D[Dev: Sequential Task Execution]
    C -->|Needs Changes| B2
    D --> E[Dev: Implement Tasks + Tests]
    E --> V{Mid-Dev QA Check? Optional}
    V -->|Yes| W[QA: trace or nfr for Early Validation]
    V -->|No| F
    W --> X[Dev: Address Coverage/NFR Gaps]
    X --> F[Dev: Run All Validations]
    F --> G[Dev: Mark Ready for Review + Add Notes]
    G --> H{User Verification}
    H -->|Request QA Review| I[QA: Test Architect Review + Quality Gate]
    H -->|Approve Without QA| M[Verify All Regression Tests and Linting are Passing]
    I --> J[QA: Test Architecture Analysis + Active Refactoring]
    J --> L{QA Decision}
    L -->|Needs Dev Work| D
    L -->|Approved| M
    H -->|Needs Fixes| D
    M --> N[COMMIT YOUR CHANGES BEFORE PROCEEDING!]
    N --> Y{Gate Update Needed?}
    Y -->|Yes| Z[QA: gate to Update Status]
    Y -->|No| K
    Z --> K[Mark Story as Done]
    K --> B

    style A fill:#f5f5f5,color:#000
    style B fill:#e8f5e9,color:#000
    style B2 fill:#e8f5e9,color:#000
    style S fill:#e3f2fd,color:#000
    style T fill:#ffd54f,color:#000
    style B3 fill:#e3f2fd,color:#000
    style C fill:#e3f2fd,color:#000
    style D fill:#e3f2fd,color:#000
    style E fill:#e3f2fd,color:#000
    style I fill:#f9ab00,color:#fff
    style J fill:#ffd54f,color:#000
    style K fill:#34a853,color:#fff
    style L fill:#e3f2fd,color:#000
    style M fill:#ff5722,color:#fff
    style N fill:#d32f2f,color:#fff
    style Z fill:#ffd54f,color:#000
```

### Available BMAD Commands (Keywords)

Use keywords to trigger microagents. Aliases (short forms) are supported for QA commands.

**Planning Phase:**
- bmad-analyst-brief: Create/update brief.md from high-level idea (or *brainstorm {topic}, *create-project-brief)
- bmad-pm-prd: Generate prd.md from brief.md (or *create-prd, *create-brownfield-prd for brownfield)
- bmad-architect-design: Create architecture.md from prd.md (or *create-full-stack-architecture, *document-project)

**Development Cycle:**
- bmad-sm-draft: Draft story in docs/stories/ from prd.md and architecture.md (specify story number, e.g., "bmad-sm-draft story 1.2"; or *create-story, *create-brownfield-story)
- bmad-dev-implement: Implement code for a story (specify file, e.g., "bmad-dev-implement --file=./docs/stories/1.2-story.md"; or *develop-story {story})
- bmad-qa-review: Review code for a story using qa-review-checklist.md (specify files; or *review {story} for full assessment)

**QA/Test Architect Commands (Quinn):**
| Stage | Command | Alias | Purpose | Output |
|-------|---------|-------|---------|--------|
| After Story Approval | *risk-profile {story} | *risk | Identify integration & regression risks | docs/qa/assessments/{epic}.{story}-risk-{YYYYMMDD}.md |
| | *test-design {story} | *design | Create test strategy for dev | docs/qa/assessments/{epic}.{story}-test-design-{YYYYMMDD}.md |
| During Development | *trace-requirements {story} | *trace | Verify test coverage | docs/qa/assessments/{epic}.{story}-trace-{YYYYMMDD}.md |
| | *nfr-assess {story} | *nfr | Validate quality attributes | docs/qa/assessments/{epic}.{story}-nfr-{YYYYMMDD}.md |
| After Development | *review {story} | *review | Comprehensive assessment | QA Results in story + docs/qa/gates/{epic}.{story}-{slug}.yml |
| Post-Review | *qa-gate {story} | *gate | Update quality decision | Updated docs/qa/gates/{epic}.{story}-{slug}.yml |

**General:**
- bmad-help: Show overview and commands (or *help)

### Brownfield Integration

For existing projects (brownfield), use PRD-First approach:
- *create-brownfield-prd: Generate enhancement PRD analyzing codebase.
- *document-project: Document relevant areas before planning.
- Follow Approach A (PRD → Focused Docs) for efficiency; use *create-brownfield-epic/story for isolated changes.
- Test Architect critical: Run *risk + *design before dev to identify regressions; *trace for integration coverage.

See working-in-the-brownfield.md for full scenarios (e.g., legacy modernization, API integration) and decision tree.

### Integration Notes

- Documents: docs/brief.md, docs/prd.md, docs/architecture.md, docs/stories/; QA in docs/qa/.
- Templates: .bmad-assets/templates/ for outputs.
- User Role: Orchestrate – review before next keyword.
- repo.md: Loaded for context (tech stack, structure).
- Config: Reference .bmad-core/core-config.yaml for locations (e.g., prdSharded: true).

For BMAD tasks, reference this section and docs/ blueprints.

### Alignment Summary and Recommendations

The microagents now align with .bmad-core verbosity:
- Expanded EXECUTION PLANs include personas, principles, commands, dependencies, and detailed sub-steps mirroring agent files.
- BMAD section consolidated, with workflows, commands, and brownfield guidance.
- Best Practices reference config and QA details.

Remaining inconsistencies:
- Microagents use keyword triggers without full YAML schemas; consider adding if OpenHands supports.
- No explicit YOLO mode or elicit interactions; add if needed for advanced workflows.
- Verify templates/checklists consistency: All referenced (e.g., prd-tmpl.yaml, qa-review-checklist.md) match install-manifest.yaml (unmodified).

Recommendations:
- Test full BMAD flow with a sample story.
- Update as .bmad-core evolves (e.g., new commands).
- For brownfield, prioritize *document-project before planning.
