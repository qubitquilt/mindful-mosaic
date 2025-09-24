# Coding Standards

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


## Linting and Formatting

The project uses ESLint with @typescript-eslint for TypeScript linting and Prettier for code formatting.

### ESLint Configuration

- **Web App**: Extends `next/core-web-vitals`, `@typescript-eslint/recommended`, and `prettier/recommended`. Uses `@typescript-eslint/parser`. Overrides for test files to disable strict rules like `no-explicit-any`, `no-var-requires`, and `react/display-name`.

- **Jobs App**: Extends `@typescript-eslint/recommended` and `prettier/recommended`. Uses `@typescript-eslint/parser` and Node.js env.

### Prettier Configuration

Prettier is configured in `prettier.config.js` with settings: semi: true, trailingComma: "es5", singleQuote: true, printWidth: 80, tabWidth: 2, useTabs: false.

### Scripts

- Root: `npm run lint` (runs Turbo lint across workspaces), `npm run format` (Prettier write).

- Web: `npm run lint` (next lint --fix), `npm run format` (prettier --write .).

- Jobs: `npm run lint` (eslint . --ext .ts --fix), `npm run format` (prettier --write .).

### Usage

Run `npm run lint` to lint all code and auto-fix issues. Run `npm run format` to format all files. Use VS Code extensions for ESLint and Prettier for real-time feedback.
