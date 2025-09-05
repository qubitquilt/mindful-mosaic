# **High Level Architecture**

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

    U -- HTTPS --> WebApp

    WebApp -- Server-side Calls --> API

    API -- Queries/Mutations --> Prisma

    Prisma -- Reads/Writes --> SQLite

    Prisma -- Reads/Writes --> Valkey

    JobRunner -- Checks for jobs --> PrismaJobs

    PrismaJobs -- Reads --> SQLite

    JobRunner -- Sends Notifications --> BrowserNotify

    U -- Auth Flow --> SSO

    SSO -- Callback --> API

**Architectural and Design Patterns**

* **Two-Service Model:** Separating the user-facing web application from the background job processor.
* **Monorepo:** Using a single repository to manage both services and shared code.
* **Repository Pattern:** Implemented via Prisma to abstract all data access logic.
* **Containerization:** Using Docker to ensure environment consistency and simplify deployment.
