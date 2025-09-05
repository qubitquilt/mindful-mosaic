# **Coding Standards**

This document outlines the coding standards and conventions to be followed for the Self-Hosted Organizer project.

## Styling Strategy

To maintain a clean, consistent, and maintainable codebase, this project will use **Tailwind CSS** as its primary styling methodology.

### Rationale

*   **Utility-First:** Tailwind's utility-first approach allows for rapid UI development without writing custom CSS.
*   **Consistency:** It enforces a consistent design system by using a predefined set of utilities.
*   **Performance:** It can produce highly optimized, small CSS files by purging unused styles.
*   **Minimalism:** Aligns with the project's goal of a clean and minimalist user interface.

### Implementation

*   All new components should be styled directly in the JSX using Tailwind classes.
*   Custom CSS should be avoided. If a component requires complex styling that cannot be achieved with utilities, create a component-specific CSS module.
*   Use the `@apply` directive sparingly and only for reusable component classes.
