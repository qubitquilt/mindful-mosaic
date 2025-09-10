# Mindful Mosaic

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/yourusername/mindful-mosaic/actions) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/mindful-mosaic/releases)

## Introduction

Welcome to **Mindful Mosaic** ([REPO_NAME]), a thoughtfully designed application that helps users build and manage daily routines with mindfulness at its core. In a fast-paced world, maintaining healthy habits can be challenging. Mindful Mosaic provides an intuitive platform to create, schedule, and track your routines, fostering a sense of accomplishment and well-being.

This project is built as a modern web application using Next.js, TypeScript, and Prisma, ensuring a robust, scalable, and developer-friendly experience. Whether you're a beginner looking to establish new habits or an advanced user integrating it into a larger workflow, Mindful Mosaic is designed to be accessible and extensible.

## Purpose

Mindful Mosaic exists to simplify routine management by combining user-friendly interfaces with powerful backend capabilities. It addresses common pain points like forgetting tasks, lack of motivation, and fragmented scheduling tools. By leveraging authentication for personalized experiences, a daily timeline view for visualization, and extensible architecture for future features like job scheduling, the project empowers users to mosaic their lives with mindful practices.

The core motivation is to promote mental health through structured yet flexible habit-building, drawing from product requirements documented in our PRD (Product Requirements Document). It's open-source to encourage community contributions and adaptations for diverse needs.

## Key Features

- **User Authentication**: Secure sign-in/sign-out with NextAuth.js integration, supporting multiple providers.
- **Daily Timeline View**: Visualize your routines in a chronological, interactive timeline component.
- **Routine Management**: Create, edit, and track daily tasks with intuitive forms and persistence via Prisma database.
- **Responsive Design**: Built with Tailwind CSS for seamless experience across devices.
- **Testing Suite**: Comprehensive unit, integration, and E2E tests using Jest, React Testing Library, and Playwright.
- **Monorepo Architecture**: Organized with Turborepo for efficient development across web and jobs apps, sharing a common database.
- **Type Safety**: Full TypeScript support for reliable code.
- **Accessibility**: ARIA-compliant components and keyboard navigation.

Future enhancements include advanced scheduling execution and analytics dashboards.

## Installation

To get started with Mindful Mosaic, ensure you have Node.js (v18+) and pnpm installed. The project uses a monorepo structure, so we'll set up the entire workspace.

1. **Clone the Repository**:
   ```
   git clone https://github.com/yourusername/mindful-mosaic.git
   cd mindful-mosaic
   ```

2. **Install Dependencies**:
   Use pnpm for package management:
   ```
   pnpm install
   ```
   This installs dependencies for all apps (web, jobs) and shared packages (db).

3. **Set Up Environment Variables**:
   Copy the example env file and configure:
   ```
   cp .env.example .env
   ```
   Key variables include:
   - `DATABASE_URL`: Your PostgreSQL connection string (e.g., from Prisma).
   - `NEXTAUTH_SECRET`: Generate a secret for authentication.
   - `NEXTAUTH_URL`: Your app's base URL (e.g., http://localhost:3000).

4. **Database Setup**:
   Run Prisma migrations to set up the schema:
   ```
   pnpm db:push  # Or pnpm db:migrate for versioned migrations
   ```
   This creates tables for users, routines, and auth models.

5. **Build and Run**:
   Start the development server:
   ```
   pnpm dev
   ```
   The web app will be available at `http://localhost:3000`. For the jobs app, use `pnpm jobs:dev`.

For production builds:
```
pnpm build
pnpm start
```

## Usage Examples

### Basic Authentication Flow

1. **Sign In**:
   Users can sign in via the `SignInButton` component. Example usage in a layout:
   ```tsx
   import { SignInButton } from '@/components/SignInButton';

   export default function Header() {
     return (
       <header className="flex justify-between p-4">
         <h1>Mindful Mosaic</h1>
         <SignInButton />
       </header>
     );
   }
   ```
   This renders a button that triggers NextAuth sign-in.

2. **Viewing Daily Timeline**:
   Once authenticated, access the timeline:
   ```tsx
   import { Timeline } from '@/components/Timeline';

   export default function Dashboard() {
     return <Timeline />;  // Fetches and displays user's routines
   }
   ```
   The `Timeline` component queries the database for scheduled items and renders them chronologically.

3. **Signing Out**:
   Use the `SignOutButton` for logout:
   ```tsx
   import { SignOutButton } from '@/components/auth/SignOutButton';

   <SignOutButton>Sign Out</SignOutButton>
   ```

### Adding a Routine (API Example)

Interact with the backend via API routes. Example fetch for creating a routine:
```javascript
async function createRoutine(routineData) {
  const response = await fetch('/api/routines', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(routineData),
  });
  return response.json();
}

// Usage
createRoutine({ title: 'Morning Meditation', time: '07:00', duration: 10 });
```

## Configuration Options

Mindful Mosaic is highly configurable:

- **Tailwind CSS**: Customize themes in `apps/web/tailwind.config.ts`. Extend colors, fonts, etc.
  ```ts
  module.exports = {
    theme: {
      extend: {
        colors: { primary: '#your-color' },
      },
    },
  };
  ```

- **Prisma Schema**: Edit `packages/db/prisma/schema.prisma` for custom models. Run migrations after changes.
  
- **NextAuth Providers**: In `apps/web/src/app/api/auth/[...nextauth]/route.ts`, add providers like Google or GitHub:
  ```ts
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  ```

- **Testing Config**: Adjust `apps/web/jest.config.js` or `playwright.config.ts` for custom setups.

- **Turborepo Pipelines**: Modify `turbo.json` for build scripts.

Environment variables in `.env` control logging, database connections, and feature flags (e.g., `ENABLE_JOBS=true`).

## Contributing

We welcome contributions! To get involved:

1. **Fork the Repo** and create a feature branch: `git checkout -b feature/amazing-feature`.
2. **Commit Changes**: Follow conventional commits (e.g., `feat: add new routine type`).
3. **Test Thoroughly**: Run `pnpm test` and `pnpm lint`.
4. **Push and PR**: Open a Pull Request against `main`. Ensure it passes CI checks.
5. **Code Style**: Adhere to Prettier and ESLint configs. See [coding-standards.md](docs/coding-standards.md).

Guidelines:
- Write tests for new features.
- Update docs in `/docs` for major changes.
- No breaking changes without discussion.

Join our community on GitHub Discussions for ideas!

## Troubleshooting

- **Auth Issues**: Check `NEXTAUTH_SECRET` and provider configs. Verify database has auth models: `pnpm db:studio`.
- **Build Errors**: Ensure pnpm is used; run `pnpm install` after dependency changes.
- **Timeline Not Loading**: Confirm API route `/api/auth` is protected and user session is active.
- **Database Connection**: Use a tool like Prisma Studio or pgAdmin to inspect schemas.
- **Tests Failing**: Clear caches with `pnpm next build --no-cache` or check Node version.
- **Deployment**: For Vercel, set root to `/apps/web` and build command to `pnpm turbo build --filter=web`.

If issues persist, check logs or file an issue with reproduction steps.

## Roadmap

- **Short-term**: Integrate routine analytics and notifications.
- **Medium-term**: Add mobile app support via React Native.
- **Long-term**: AI-powered routine suggestions and multi-user collaboration.

See [prd/epic-list.md](docs/prd/epic-list.md) for detailed epics. Contributions to these are highly encouraged!

## Acknowledgments

Thanks to the open-source community for tools like Next.js, Prisma, and Tailwind. Special shoutout to contributors listed in Git history and our docs authors for architecture and PRD.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact and Support

- **Repository**: [github.com/yourusername/mindful-mosaic](https://github.com/yourusername/mindful-mosaic)
- **Issues**: Report bugs or request features [here](https://github.com/yourusername/mindful-mosaic/issues).
- **Email**: contact@mindfulmosaic.app
- **Discord/Slack**: Join our community server for real-time support.

We'd love your feedback—star the repo and share your thoughts!

---

*Word count: ~1050. This README is adaptable; replace placeholders with specifics as needed.*
