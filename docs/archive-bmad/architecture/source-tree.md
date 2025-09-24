# **Unified Project Structure**

This document outlines the source tree for the Self-Hosted Organizer monorepo.

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

### **Key Directories**

*   **`apps/web`**: The main Next.js application, containing all UI and API routes.
*   **`apps/jobs`**: The independent job server for background tasks.
*   **`packages/db`**: The shared Prisma package for database access.
*   **`packages/ui`**: A shared component library (optional, for future use).
