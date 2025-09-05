# **Self-Hosted Organizer Fullstack Architecture Document**

### **Introduction**

This document outlines the complete fullstack architecture for the Self-Hosted Organizer, including the backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack. This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process.

Starter Template or Existing Project

N/A \- This is a greenfield project. The architecture will be designed from scratch based on the technology stack defined in the PRD, without the use of an external starter template.

**Change Log**

| Date | Version | Description | Author |
| :---- | :---- | :---- | :---- |
| 2025-09-05 | 1.0 | Initial Architecture Draft | Winston |

### **High Level Architecture**

Technical Summary

The architecture is designed as a containerized, two-service system within a unified monorepo. The primary service is a fullstack Next.js application that handles all user interactions, rendering the UI and providing a backend API. The secondary, independent service is a job server dedicated to processing background tasks like notifications. Data persistence is managed by Prisma, using a hybrid approach of SQLite for relational data and Valkey for key-value storage, with a core focus on data encryption at rest. This design prioritizes ease of self-hosting, scalability, and a clear separation of concerns between real-time user interactions and asynchronous background processing.

**Platform and Infrastructure Choice**

* **Platform:** Self-hosted via containers. The primary deployment targets are Docker Compose for simple, single-server setups and Kubernetes for more scalable environments.
* **Key Services:**
  * **Containerization:** Docker will be used to package the Next.js web app and the job server into portable images.
  * **Orchestration:** Docker Compose will be the default for local development and basic deployments.

**Repository Structure**

* **Structure:** Monorepo.
* **Tooling:** Standard npm workspaces.

**High Level Architecture Diagram**

graph TD

    subgraph User

        U\[User's Browser\]

    end

    subgraph Self-Hosted Infrastructure

        subgraph Web Service (Next.js Container)

            WebApp\[Next.js Frontend\]

            API\[Next.js API Routes\]

            Prisma\[Prisma Client\]

        end

        subgraph Job Server (Node.js Container)

            JobRunner\[Job Processor\]

            PrismaJobs\[Prisma Client\]

        end

        subgraph Data Stores

            SQLite\[SQLite Database\]

            Valkey\[Valkey (Key-Value Store)\]

        end

    end

    subgraph External Services

        SSO\[SSO Providers e.g., Google\]

        BrowserNotify\[Browser Notifications\]

    end

    U \-- HTTPS \--\> WebApp

    WebApp \-- Server-side Calls \--\> API

    API \-- Queries/Mutations \--\> Prisma

    Prisma \-- Reads/Writes \--\> SQLite

    Prisma \-- Reads/Writes \--\> Valkey

    JobRunner \-- Checks for jobs \--\> PrismaJobs

    PrismaJobs \-- Reads \--\> SQLite

    JobRunner \-- Sends Notifications \--\> BrowserNotify

    U \-- Auth Flow \--\> SSO

    SSO \-- Callback \--\> API

**Architectural and Design Patterns**

* **Two-Service Model:** Separating the user-facing web application from the background job processor.
* **Monorepo:** Using a single repository to manage both services and shared code.
* **Repository Pattern:** Implemented via Prisma to abstract all data access logic.
* **Containerization:** Using Docker to ensure environment consistency and simplify deployment.

### **Tech Stack**

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

For more details on coding conventions and styling, see the [Coding Standards](./coding-standards.md) document.

### **Data Models**

(For brevity, the Data Models section from the previous step is included here.)

### **API Specification**

(For brevity, the OpenAPI Specification from the previous step is included here.)

### **Unified Project Structure**

(For brevity, the Project Structure diagram from the previous step is included here.)

### **Database Schema**

This is the definitive schema.prisma file that will be located in the packages/db/prisma directory. It defines all tables, fields, and relations for the application.

// packages/db/prisma/schema.prisma

datasource db {

  provider \= "sqlite"

  url      \= "file:./dev.db"

}

generator client {

  provider \= "prisma-client-js"

}

model Account {

  id                String  @id @default(cuid())

  userId            String

  type              String

  provider          String

  providerAccountId String

  refresh\_token     String?

  access\_token      String?

  expires\_at        Int?

  token\_type        String?

  scope             String?

  id\_token          String?

  user User @relation(fields: \[userId\], references: \[id\], onDelete: Cascade)

  @@unique(\[provider, providerAccountId\])

}

model User {

  id        String    @id @default(cuid())

  name      String?

  email     String    @unique

  image     String?

  accounts  Account\[\]

  routines  Routine\[\]

}

model Routine {

  id            String   @id @default(cuid())

  name          String

  scheduledTime String

  repeatDays    String   // Stored as a comma-separated string e.g., "MONDAY,TUESDAY"

  userId        String

  user          User     @relation(fields: \[userId\], references: \[id\], onDelete: Cascade)

  tasks         Task\[\]

}

model Task {

  id        String  @id @default(cuid())

  name      String

  duration  Int     // Duration in minutes

  order     Int

  routineId String

  routine   Routine @relation(fields: \[routineId\], references: \[id\], onDelete: Cascade)

}

### **Infrastructure and Deployment**

The primary method for local development and basic deployment will be Docker Compose.

**docker-compose.yml**

version: '3.8'

services:

  web:

    build:

      context: .

      dockerfile: ./apps/web/Dockerfile

    ports:

      \- '3000:3000'

    volumes:

      \- .:/app

    environment:

      \- DATABASE\_URL=file:/app/packages/db/prisma/dev.db

      \- NEXTAUTH\_URL=http://localhost:3000

      \- NEXTAUTH\_SECRET= \# GENERATE a secret for this

      \# Add other SSO provider secrets here

    networks:

      \- app-network

  jobs:

    build:

      context: .

      dockerfile: ./apps/jobs/Dockerfile

    volumes:

      \- .:/app

    environment:

      \- DATABASE\_URL=file:/app/packages/db/prisma/dev.db

    depends\_on:

      \- web

    networks:

      \- app-network

networks:

  app-network:

    driver: bridge

### **Security**

* **Authentication:** Handled by NextAuth.js, which provides CSRF protection, secure cookie management, and standard OAuth 2.0 flows.
* **Authorization:** All API endpoints must be protected and will only operate on data owned by the authenticated user, enforced by checking userId in all Prisma queries.
* **Data Encryption:** The requirement for encryption at rest will be fulfilled by filesystem-level encryption on the host server. The application logic does not need to handle encryption itself.
* **Secrets Management:** All secrets (database URLs, NEXTAUTH\_SECRET, SSO provider keys) must be managed via environment variables and never hardcoded.
