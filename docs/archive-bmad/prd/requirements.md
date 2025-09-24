# **Requirements**

## **Functional**

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

## **Non-Functional**

1. **NFR1:** The user interface must be responsive, providing a functional and intuitive experience on both desktop and mobile web browsers.
2. **NFR2:** The system must use Prisma as its ORM, configured to work with an SQLite database by default, while maintaining architectural compatibility for future migration to PostgreSQL.
3. **NFR3:** The architecture must ensure all sensitive user-generated data (e.g., routine names, task descriptions) is encrypted at rest in the database.
4. **NFR4:** The system's architecture must be designed to accommodate an independent job server for handling asynchronous tasks like notifications.
5. **NFR5:** Authentication must be implemented using a robust, standard library like NextAuth.js to securely handle the SSO flows.
