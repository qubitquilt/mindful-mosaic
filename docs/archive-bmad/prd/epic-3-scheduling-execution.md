# **Epic 3: Scheduling & Execution**

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
