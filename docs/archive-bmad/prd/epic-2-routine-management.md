# **Epic 2: Routine Management**

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
