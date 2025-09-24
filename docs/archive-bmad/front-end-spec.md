# **Self-Hosted Organizer UI/UX Specification**

### **Introduction**

This document defines the user experience goals, information architecture, user flows, and visual design specifications for the Self-Hosted Organizer's user interface. It serves as the foundation for visual design and frontend development, ensuring a cohesive and user-centered experience that combines the best of visual planning and focused execution.

### **Overall UX Goals & Principles**

**Target User Personas**

* **The Tech-Savvy Self-Hoster:** A privacy-conscious technical user who needs a powerful organizational tool without the compromises of proprietary software. They are motivated by control, customization, and data sovereignty.
* **The Privacy-Conscious Organization:** A modern company looking for effective, privacy-compliant wellness and productivity tools for their employees.
* **The Convenience User:** A non-technical user who values the application's functionality and is willing to pay a small fee for a managed, hassle-free experience.

**Usability Goals**

* **Clarity:** The interface must be immediately understandable, presenting the day's plan without clutter or confusion.
* **Efficiency:** Users should be able to create, organize, and execute routines with minimal clicks and cognitive load.
* **Focus:** The "Execution Mode" must be a distraction-free environment that guides the user through their tasks effectively.
* **Flexibility:** The "Planning Mode" must allow for easy and intuitive rescheduling of the day's events.

**Design Principles**

1. **Plan Your Day, Then Execute Your Plan:** The core principle. The UI must support a clear separation between the holistic planning phase and the focused execution phase.
2. **Clarity Over Cleverness:** Prioritize straightforward, intuitive design patterns over novel but potentially confusing interactions.
3. **Progressive Disclosure:** Show only the necessary information and controls for the user's current context (e.g., hide planning tools during execution mode).
4. **Accessible by Default:** Design and build for all users from the outset, aiming for WCAG 2.1 AA compliance.

**Change Log**

| Date | Version | Description | Author |
| :---- | :---- | :---- | :---- |
| 2025-09-05 | 1.0 | Initial Spec draft | Sally |

### **Information Architecture (IA)**

**Site Map / Screen Inventory**

graph TD

    subgraph Unauthenticated

        A\[Sign-In Screen\]

    end

    subgraph Authenticated

        B\[Daily Timeline / Dashboard\]

        C\[Routine Editor\]

        D\[Active Routine View\]

        E\[Settings\]

    end

    A \-- Successful Sign-In \--\> B

    B \-- Clicks 'Create Routine' \--\> C

    B \-- Clicks 'Edit Routine' \--\> C

    B \-- Clicks 'Start Routine' \--\> D

    B \-- Clicks 'Settings' \--\> E

    C \-- Saves or Cancels \--\> B

    D \-- Finishes or Exits \--\> B

    E \-- Navigates Back \--\> B

**Navigation Structure**

* **Primary Navigation:** For an authenticated user, the primary "home" will be the **Daily Timeline / Dashboard**. A simple, persistent header or sidebar will provide access to **Settings** and a **Sign Out** button.
* **Contextual Navigation:** Key actions like creating, editing, or starting routines will be initiated directly from the timeline view. These views are temporary states, and the user will always return to the main timeline upon completion.

### **User Flows**

**User Flow 1: User Sign-In**

* **User Goal:** To securely access their personal dashboard.
* **Entry Points:** Visiting the application's main URL while not being authenticated.
* **Success Criteria:** The user successfully authenticates and is redirected to their personal Daily Timeline view.

**User Flow 2: Create & Schedule a New Routine**

* **User Goal:** To add a new, scheduled routine to their daily plan.
* **Entry Points:** Clicking the "Create Routine" button from the main dashboard.
* **Success Criteria:** The newly created routine is saved and appears correctly on the Daily Timeline.

**User Flow 3: Execute a Routine (Focus Mode)**

* **User Goal:** To step through a planned routine task by task in a distraction-free environment.
* **Entry Points:** Clicking the "Start Routine" button on a routine block in the timeline.
* **Success Criteria:** The user is guided through all tasks in the routine and then returned to the timeline.

### **Wireframes & Mockups**

**Primary Design Files:** TBD. This specification will serve as the primary design guide.

**Key Screen Layouts**

1. **Screen: Sign-In Page:** Centered, minimal layout with application name and SSO provider buttons.
2. **Screen: Daily Timeline / Dashboard (Planning Mode):** Main application hub with a header, a vertical hourly timeline, and a floating action button to create new routines.
3. **Screen: Routine Editor:** A modal overlay with fields for routine name, a dynamic list of tasks with durations, and scheduling controls.
4. **Screen: Active Routine View (Execution Mode):** A minimal, full-screen view showing only the current task name, a large visual timer, and basic controls (Pause, Skip, Finish).

### **Component Library / Design System**

**Design System Approach:** The project will use shadcn/ui, a collection of reusable components built on Tailwind CSS and Radix UI, to ensure consistency, accessibility, and rapid development.

**Core Components:**

* **Button:** For all actions.
* **Input:** For all form fields.
* **Card:** For routine blocks on the timeline.
* **Modal / Dialog:** For the Routine Editor and confirmation prompts.
* **Timer / Circular Progress:** For the Execution Mode view.
* **Day Selector / Toggle Group:** For the scheduling interface.

### **Branding & Style Guide**

**Visual Identity:** The brand is minimalist, clean, and modern, designed to create a calm and focused user experience.

Color Palette

| Color Type | Hex Code | Usage |

| :---------- | :------------- | :------------------------------------- |

| Primary | \#18181B | Main text, headers, active elements |

| Secondary | \#71717A | Subtitles, secondary text, borders |

| Accent | \#2563EB | Buttons, links, focus indicators |

| Success | \#16A34A | Positive feedback, confirmations |

| Warning | \#FBBF24 | Cautions, important notices |

| Error | \#DC2626 | Errors, destructive actions |

| Neutral | \#F4F4F5 | Backgrounds, card backgrounds |

**Typography**

* **Primary Font:** Inter (a clean, modern sans-serif, available from Google Fonts).
* **Type Scale:** A standard, harmonious type scale will be used for headings and body text to ensure a clear visual hierarchy.

**Iconography**

* **Icon Library:** Lucide React (lucide-react). A simple, modern, and highly comprehensive icon set that integrates perfectly with shadcn/ui.

### **Accessibility Requirements**

**Compliance Target:** The application will aim for **WCAG 2.1 Level AA** compliance. This includes ensuring sufficient color contrast, keyboard navigability, screen reader support, and proper use of ARIA attributes. shadcn/ui provides a strong, accessible foundation for this.

### **Responsiveness Strategy**

Breakpoints: Standard Tailwind CSS breakpoints will be used (sm, md, lg, xl) to handle different screen sizes.

Adaptation Patterns: The application will be designed mobile-first. The daily timeline will be a single column on mobile and may expand to show more information on larger screens. The Routine Editor modal and Execution Mode view will be optimized for all screen sizes.

### **Animation & Micro-interactions**

Motion Principles: Animations will be subtle and purposeful, used only to provide feedback and guide the user's attention without being distracting.

Key Animations:

* **Modal Transitions:** A gentle fade-in and scale for the Routine Editor modal.
* **Timer Progress:** A smooth, continuous animation for the timer in Execution Mode.

### **Performance Considerations**

**Performance Goals:**

* **Page Load:** Aim for a Core Web Vitals "Good" score, with a Largest Contentful Paint (LCP) under 2.5 seconds.
* Interaction Response: Interactions should be near-instant, with a First Input Delay (FID) of less than 100ms.
  Design Strategies: Next.js provides an excellent performance foundation with features like code splitting by default. Images and other assets will be optimized, and the component library is lightweight.
