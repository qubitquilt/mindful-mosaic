# **Epic 1: Foundation & Core User Experience**

**Epic Goal:** To establish the project's technical foundation, including the monorepo structure, core dependencies, and a basic CI/CD pipeline. This epic will also deliver the complete user authentication system via social SSO and create the main application layout, including the primary navigation and the empty "Planning Mode" timeline view where future routines will be displayed.

Story 1.1: Project Scaffolding & Setup

As a developer,

I want to set up the monorepo with the Next.js application and the job server placeholder,

so that I have a clean, consistent foundation for all future development.

**Acceptance Criteria:**

1. A monorepo is initialized.
2. A Next.js application is created within the monorepo.
3. A placeholder directory for the future job server is created.
4. Prisma is initialized and configured to use an SQLite database for development.
5. A basic "Hello World" page is accessible when running the Next.js app.

Story 1.2: User Authentication Setup

As a user,

I want to be able to sign up or sign in using a social provider (e.g., Google or GitHub),

so that I can securely access my personal account.

**Acceptance Criteria:**

1. NextAuth.js is installed and configured in the Next.js application.
2. At least one social SSO provider (e.g., Google) is configured and functional.
3. A "Sign In" button is visible to unauthenticated users.
4. Clicking "Sign In" initiates the SSO authentication flow.
5. Upon successful authentication, a new user record is created in the database.
6. The user is redirected to the main dashboard after a successful login.

Story 1.3: Core Application Layout & Navigation

As a signed-in user,

I want to see the main application shell with a clear navigation bar and a sign-out option,

so that I can orient myself and securely end my session.

**Acceptance Criteria:**

1. A main application layout is created that includes a persistent header or sidebar.
2. The navigation contains a "Sign Out" button for authenticated users.
3. Clicking "Sign Out" successfully logs the user out and redirects them to the sign-in page.
4. The user's identity (e.g., name or email) is visible somewhere in the layout.

Story 1.4: Daily Timeline View

As a signed-in user,

I want to see a clean, empty daily timeline view as my main dashboard,

so that I have a clear space to begin planning my day.

**Acceptance Criteria:**

1. The main dashboard page displays a vertical, chronological timeline for the current day.
2. The timeline view correctly displays time slots (e.g., hourly blocks from morning to night).
3. The view is responsive and functions correctly on both mobile and desktop screen sizes.
4. Initially, the timeline is empty, with a message like "No routines scheduled for today."
