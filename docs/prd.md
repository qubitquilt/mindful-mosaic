# **Self-Hosted Organizer Product Requirements Document (PRD)**

### **Goals and Background Context**

**Goals**

* To create a viable, community-driven, open-source alternative to proprietary routine planners.
* To empower users with digital sovereignty over their organizational system through self-hosting and full data control.
* To build a platform that champions the principles of privacy, user control, and open access.
* To foster a healthy and engaged community that helps guide the project's growth and evolution.

**Background Context**

Technically proficient individuals, especially those with organizational challenges, currently face a compromise: either use costly, proprietary tools that sacrifice privacy and control, or rely on less effective solutions. Existing market leaders create vendor lock-in, offer no self-hosting options, and restrict user choice in areas like AI integration. This project addresses this gap by creating a powerful, open-source, and self-hostable platform that provides a feature-rich experience without compromising on user freedom or data privacy.

**Change Log**

| Date | Version | Description | Author |
| :---- | :---- | :---- | :---- |
| 2025-09-05 | 1.0 | Initial PRD draft | John |

### **Requirements**

#### **Functional**

1. **FR1:** An **authenticated user** must be able to create, name, and save a routine **that is associated with their account**.
2. **FR2:** Users must be able to add individual tasks to a routine, each with a specific name and a defined time duration (e.g., in minutes).
3. **FR3:** Users must be able to edit and delete existing routines and the tasks within them.
4. **FR4:** An **authenticated user** must be able to schedule a routine with basic recurrence options (e.g., specific days of the week).
5. **FR5:** The system must display a visual timeline of all scheduled routines and their tasks for the **currently logged-in user**.
6. **FR6:** The system must be able to send a basic notification to the user when a scheduled routine is set to begin.
7. **FR7:** The application must be packaged as a container (e.g., Docker image) to facilitate easy self-hosting.
8. **FR8:** The project must include clear, step-by-step documentation for setting up and running the application via the provided container.
9. **FR9:** Users must be able to sign up or sign in to the application using a social SSO provider (e.g., Google, GitHub).
10. **FR10:** A user account must be automatically created upon their first successful SSO login.
11. **FR11:** Users must have a clear way to sign out of the application.

#### **Non-Functional**

1. **NFR1:** The user interface must be responsive, providing a functional and intuitive experience on both desktop and mobile web browsers.
2. **NFR2:** The system must use Prisma as its ORM, configured to work with an SQLite database by default, while maintaining architectural compatibility for future migration to PostgreSQL.
3. **NFR3:** The architecture must ensure all sensitive user-generated data (e.g., routine names, task descriptions) is encrypted at rest in the database.
4. **NFR4:** The system's architecture must be designed to accommodate an independent job server for handling asynchronous tasks like notifications.
5. **NFR5:** Authentication must be implemented using a robust, standard library like NextAuth.js to securely handle the SSO flows.

### **User Interface Design Goals**

Overall UX Vision

The UX vision is a hybrid, combining the holistic visual planning of "Structured" with the guided, focused execution of "Routinery." The user will start with a clear, comprehensive timeline of their day, which provides clarity and reduces planning friction. When a routine begins, the interface will transition into a minimalist, single-task focus mode, reducing distractions and decision fatigue during execution. The core principle is: Plan your day, then execute your plan.

Key Interaction Paradigms

The application will operate in two primary modes:

1. **Planning Mode (Timeline View):** Inspired by Structured, this is the main dashboard. It will feature a clean, vertical timeline of the user's day, integrating their routines and tasks. The key interaction will be flexible, allowing users to easily drag-and-drop to reschedule and reorganize their day.
2. **Execution Mode (Focus View):** When a user starts a routine, the UI will shift to a minimalist, Routinery-inspired timer view. This mode will display only the current task, a visual timer, and simple controls (e.g., pause, skip to next). This is designed to eliminate distractions and guide the user through their routine one step at a time.

Core Screens and Views

The MVP will require the following core screens:

* **Sign-In Screen:** A simple page with SSO provider buttons.
* **Daily Timeline / Dashboard:** The main "Planning Mode" view.
* **Routine Editor:** A view to create, edit, and schedule a routine and its associated tasks.
* **Active Routine View:** The "Execution Mode" screen, featuring the current task and timer.
* **Settings:** A basic page for managing account settings (e.g., Sign Out).

**Accessibility**

* **Standard:** The application will aim for WCAG 2.1 AA compliance.

**Branding**

* **Approach:** The design will be minimalist and clean, using a neutral color palette to support a focused and calm user experience.

**Target Device and Platforms**

* **Platform:** Web Responsive, designed with a mobile-first approach.

### **Technical Assumptions**

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

### **Epic List**

1. **Epic 1: Foundation & Core User Experience**
   * **Goal:** Establish the project's technical foundation, implement user authentication via SSO, and create the main application layout, including the "Planning Mode" timeline view.
2. **Epic 2: Routine Management**
   * **Goal:** Enable authenticated users to create, view, edit, and delete their routines and timed tasks, making them visible on the daily timeline.
3. **Epic 3: Scheduling & Execution**
   * **Goal:** Implement the routine scheduling system, the "Execution Mode" focus view with a live timer, and the notification job server to make routines fully functional.

### **Epic 1: Foundation & Core User Experience**

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

### **Epic 2: Routine Management**

**Epic Goal:** To enable authenticated users to perform full CRUD (Create, Read, Update, Delete) operations for their routines and timed tasks. By the end of this epic, a user will be able to create a complete routine, add multiple tasks to it, and see it correctly displayed on their daily timeline.

Story 2.1: Create Routine UI

As a signed-in user,

I want a clear button and form to start creating a new routine,

so that I can begin organizing my tasks.

**Acceptance Criteria:**

1. A "Create Routine" or similar button is clearly visible on the main timeline view.
2. Clicking the button opens a modal or navigates to a form for creating a new routine.
3. The form includes fields for the Routine Name and a section to add tasks.
4. The task section allows adding multiple tasks, each with a field for its name and its duration in minutes.
5. A "Save Routine" button exists on the form.

Story 2.2: Save Routine Functionality

As a signed-in user,

I want to save a new routine I've created,

so that it is stored in my account for future use.

**Acceptance Criteria:**

1. Clicking "Save Routine" sends the routine and task data to the backend API.
2. The backend validates the incoming data.
3. A new routine and its associated tasks are successfully saved to the database, linked to the currently authenticated user.
4. Upon a successful save, the user is returned to the daily timeline view.
5. An error message is displayed if the save operation fails for any reason.

Story 2.3: Display Routines on Timeline

As a signed-in user,

I want to see my saved routines displayed on my daily timeline,

so that I can get a visual overview of my plan.

**Acceptance Criteria:**

1. When the daily timeline view loads, it fetches all routines scheduled for the current day for the logged-in user.
2. Saved routines are displayed as blocks on the timeline at their scheduled times.
3. The routine blocks clearly show the routine name and its total duration.
4. Clicking on a routine block on the timeline could show its list of tasks (e.g., in a pop-up or sidebar).

Story 2.4: Edit & Delete Routines

As a signed-in user,

I want to be able to edit or delete a routine I've created,

so that I can adjust my plans as they change.

**Acceptance Criteria:**

1. Controls for "Edit" and "Delete" are available for each routine (e.g., on the timeline block or within a routine detail view).
2. Clicking "Edit" opens the routine editor form, pre-populated with the selected routine's data.
3. Saving the form after an edit successfully updates the routine in the database.
4. Clicking "Delete" prompts the user with a confirmation dialog.
5. Upon confirmation, the routine and its tasks are permanently removed from the database.

### **Epic 3: Scheduling & Execution**

**Epic Goal:** To implement the routine scheduling system, the "Execution Mode" focus view with a live timer, and the notification job server. By the end of this epic, a user will be able to schedule a routine, receive a notification for it, and step through it task-by-task in a focused environment.

Story 3.1: Implement Routine Scheduling

As a signed-in user,

I want to apply a schedule to my routines,

so that they automatically appear on my daily timeline on the correct days.

**Acceptance Criteria:**

1. The routine editor form includes a user-friendly interface for selecting recurrence (e.g., checkboxes for days of the week).
2. When a routine is saved with a schedule, the schedule information is stored in the database.
3. The daily timeline view correctly fetches and displays only the routines scheduled for the current date.
4. Users can edit a routine to change its schedule.

Story 3.2: Develop Execution Mode (Focus View)

As a signed-in user,

I want to start a scheduled routine and enter a focused, single-task view with a timer,

so that I can execute my routine without distractions.

**Acceptance Criteria:**

1. A "Start Routine" button is visible on routines in the daily timeline.
2. Clicking "Start" transitions the UI to the "Execution Mode" view.
3. This view displays only the name of the *first* task and a visual timer for its duration.
4. The timer accurately counts down. When it reaches zero, the view automatically advances to the next task in the routine.
5. Simple controls are present to "Pause" the timer or "Skip" to the next task.
6. A "Finish Routine" button is available to exit the mode.

Story 3.3: Implement Notification Job Server

As a user with a scheduled routine,

I want to receive a notification when it's time to start,

so that I don't forget to begin my planned tasks.

**Acceptance Criteria:**

1. The independent job server is built and can be run via Docker Compose alongside the web service.
2. The job server can securely connect to and read from the application's database.
3. The server periodically checks for routines that are scheduled to start soon (e.g., within the next 5 minutes).
4. When an upcoming routine is found, a basic browser notification is successfully sent to the user.
5. The job server is resilient and handles errors gracefully (e.g., database connection issues).

Story 3.4: Project Documentation

As a developer or a new contributor,

I want clear and concise documentation for the project,

so that I can understand how to set up, run, and contribute to the application.

**Acceptance Criteria:**

1. A `README.md` file is created at the root of the monorepo.
2. The README includes a project overview, setup instructions, and scripts for running the application and tests.
3. API documentation is generated or written for all public-facing API endpoints.
4. The documentation is sufficient to satisfy functional requirement FR8.

Story 3.5: Basic Logging and Monitoring

As a developer,

I want a basic logging and monitoring solution in place,

so that I can troubleshoot issues and observe the application's health.

**Acceptance Criteria:**

1. A logging library is integrated into both the web service and the job server.
2. Key events, errors, and application startup are logged to the console.
3. The system is configured to output structured logs (e.g., JSON) to support future monitoring solutions.
4. Basic health check endpoints are created for both the web and job services.
