# 🎨 Mindful Mosaic

**A privacy-first, open-source organizational platform for those who want complete control over their data and tools.**

Mindful Mosaic is a self-hostable organizer designed for technically-skilled individuals who need powerful, private, and customizable tools to manage their lives. It mirrors the core functionality of market-leading routine planners, but with a key difference: **you own your data, always.**

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![GitHub issues](https://img.shields.io/github/issues/qubitquilt/mindful-mosaic)](https://github.com/qubitquilt/mindful-mosaic/issues)
[![GitHub stars](https://img.shields.io/github/stars/qubitquilt/mindful-mosaic)](https://github.com/qubitquilt/mindful-mosaic/stargazers)

---

## ✨ Key Features

*   **Privacy First**: Your data is your own. Host it on your own infrastructure for complete privacy.
*   **Open Source**: Built on a foundation of transparency. Modify, extend, and contribute to the platform.
*   **Familiar Workflows**: Clones the intuitive, effective user experience of leading routine planners.
*   **Customizable**: Free from vendor lock-in. Integrate with your preferred tools and services, including self-hosted LLMs.
*   **Community-Driven**: Designed to be shaped and improved by the people who use it.

## 🚀 Getting Started

Follow these instructions to get a local copy of Mindful Mosaic up and running for development and testing.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v20.x or later recommended)
*   [npm](https://www.npmjs.com/) (v10.x or later)

### 1. Clone the Repository

```bash
git clone https://github.com/qubitquilt/mindful-mosaic.git
cd mindful-mosaic
```

### 2. Install Dependencies

This is a monorepo using npm workspaces. Install all dependencies from the root directory.

```bash
npm install
```

### 3. Configure Environment Variables

The application requires a set of environment variables to run. Copy the example from `packages/db/.env` to a new `.env` file in the root of the project.

```bash
cp packages/db/.env .env
```

Open the new `.env` file and add your credentials for authentication. You will need to create OAuth credentials from a provider like Google or GitHub.

```dotenv
# .env

# Database URL (defaults to a local SQLite file)
DATABASE_URL="file:./packages/db/prisma/dev.db"

# NextAuth.js Credentials
# Generate a secret: openssl rand -base64 32
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"

# Example for Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### 4. Run Database Migrations

Apply the database schema to your local SQLite database.

```bash
npm run prisma:migrate
```

This will also generate the Prisma Client, making it available to the application.

### 5. Run the Development Server

The web application is a Next.js project located in `apps/web`.

```bash
# Navigate to the web app directory
cd apps/web

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🏗️ Project Structure

This project is a monorepo managed with npm workspaces.

*   `apps/web`: The main Next.js web application. This is the user-facing frontend and API layer.
*   `apps/jobs`: A separate server for handling asynchronous tasks, routines, and events (future development).
*   `packages/db`: Contains the Prisma schema, migrations, and generated database client. This package is shared across all apps.
*   `docs/`: Project documentation, including the project brief, architecture, and user stories.

## 💻 Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/)
*   **Authentication**: [NextAuth.js](https://next-auth.js.org/)
*   **Database ORM**: [Prisma](https://www.prisma.io/)
*   **Database**: [SQLite](https://www.sqlite.org/) (default for local dev), compatible with [PostgreSQL](https://www.postgresql.org/).
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please refer to the project's issue tracker for areas where you can help.

## 📄 License

This project is distributed under the ISC License. See `LICENSE` for more information.
