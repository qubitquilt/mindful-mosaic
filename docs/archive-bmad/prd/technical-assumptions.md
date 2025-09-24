# **Technical Assumptions**

**Repository Structure: Monorepo**

* The project will be developed within a single monorepo. This approach will contain the Next.js web application, the separate job server, and any shared packages, simplifying dependency management and ensuring consistency across the entire system.

**Service Architecture**

* The architecture will consist of two primary services to ensure separation of concerns and independent scalability:
  1. **Web Service:** A Next.js application handling all UI, API routes, and user-facing interactions.
  2. **Job Server:** An independent service responsible for processing asynchronous background tasks, such as sending notifications.
* These services will be designed to run together seamlessly using Docker Compose for local development and be deployable to Kubernetes for production environments.

**Testing Requirements**

* The project will follow a standard testing pyramid approach. For the Next.js and Prisma stack, **Jest** combined with **React Testing Library** will be used for unit and integration testing. This provides a robust, industry-standard framework for ensuring code quality and reliability.

**Additional Technical Assumptions and Requests**

* **Database:** The default database will be SQLite managed via Prisma for simplicity, with the architecture supporting future migration to PostgreSQL. Valkey will be used for key-value/NoSQL requirements.
* **Data Security:** All sensitive user data must be encrypted at rest.
* **AI Integration:** The system must be designed with a modular interface for AI integrations, initially supporting OpenAI-compatible APIs and Google Gemini, with the ability to add more providers through configuration.
