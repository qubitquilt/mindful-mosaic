# **Project Brief: Self-Hosted Organizer**

### **Executive Summary**

This project is a privacy-first, open-source organizational platform designed to help technically skilled individuals with ADHD and organizational challenges manage their lives effectively. It solves the problem of organizational gaps while ensuring complete data privacy and user control, including the ability to integrate with self-hosted LLMs like Ollama. The primary target market is tech-savvy individuals and organizations seeking wellness tools for their staff, with a secondary offering of a low-cost hosted version for non-technical users. The core value proposition is its open-source, self-hostable nature, which empowers a community to drive its development as the ultimate privacy-focused and customizable organizational tool.

### **Problem Statement**

Current State & Pain Points:

Technically proficient individuals, particularly those with organizational challenges such as ADHD, face a frustrating dilemma with current productivity tools. They are often forced to choose between powerful, feature-rich platforms that are proprietary and costly, or less effective methods that don't meet their needs. This creates a significant barrier for those who have the skills to manage their own infrastructure but lack a suitable open-source tool to empower them, leading to unresolved organizational gaps and a tangible loss of productivity.

Impact of the Problem:

The direct impact of this gap is a sense of disempowerment and reduced personal effectiveness. Users are unable to fully achieve their organizational goals without compromising on core principles like cost, privacy, or control over their digital environment. This prevents them from leveraging their technical skills for personal success and can lead to increased stress.

Why Existing Solutions Fall Short:

Current market leaders are inadequate for this target user for three critical reasons:

1. **Cost:** They operate on subscription models, creating a recurring financial barrier.
2. **Lack of Control & Privacy:** As closed-source, cloud-hosted platforms, they offer no option for self-hosting, forcing users to entrust their sensitive organizational and personal data to a third party.
3. **Vendor Lock-in:** Users are locked into a single ecosystem, especially regarding AI integration. They cannot choose their preferred LLM provider (e.g., OpenAI, Gemini, Anthropic) or integrate with custom, organization-level solutions like a self-hosted LiteLLM instance.

Urgency and Importance:

As a passion project, the urgency is rooted in the principle of digital sovereignty. As users grow more aware of data privacy issues and the restrictive nature of closed ecosystems, the need for powerful, controllable, and open-source alternatives becomes increasingly important. This project addresses that philosophical and practical void for users who refuse to compromise.

### **Proposed Solution**

Core Concept and Approach

The proposed solution is a self-hostable, open-source platform that will directly mirror the core functionality and user experience of market-leading routine planners like Routinery and Structured. The primary goal is to effectively clone the successful, intuitive workflows of these applications, providing users with a familiar and proven approach to daily organization and task management right out of the box.

Key Differentiators

The fundamental differentiator is the project's open-source nature. Unlike its proprietary counterparts, this platform will offer:

* **Complete Data Sovereignty:** Users can self-host the application, ensuring their private data never leaves their own infrastructure.
* **Unmatched Customization:** Users and organizations have the freedom to modify, integrate, and extend the platform to meet their specific needs, including the choice of which LLM to use.
* **Community-Driven Development:** The platform's evolution will be guided by the collective contributions of its users, not the roadmap of a single corporation.

Why This Solution Will Succeed

This solution is positioned to succeed by targeting a valuable market segment that is fundamentally misaligned with the business models of current leaders. It will attract technically proficient users and privacy-conscious organizations by offering the one thing proprietary solutions cannot: complete control. Its success will be driven by adoption within the open-source community, which values transparency, customizability, and freedom from vendor lock-in.

High-Level Vision

The long-term vision is to establish this platform as the definitive open-source foundation for privacy-first organizational tools. The ultimate goal is to place the tool into the hands of professionals, developers, and other users who will not only use it but also build upon it, expanding its capabilities in ways that have not yet been envisioned and fostering a vibrant, community-driven ecosystem.

### **Target Users**

Primary User Segment: The Tech-Savvy Self-Hoster

This user is a technically proficient individual (e.g., a software developer, systems administrator, or tech hobbyist) who also struggles with executive function or organizational challenges. They are highly privacy-conscious and prefer to have complete control over their software and data. Their primary goal is to find a powerful organizational tool that rivals the best proprietary options but aligns with their open-source and self-hosting values. Success for them is a stable, feature-rich platform they can host, trust, and potentially contribute to.

Secondary User Segment: The Privacy-Conscious Organization

This user is a modern, tech-forward organization that wants to provide its employees with effective wellness and productivity tools. They prioritize privacy-compliant solutions and may have an open-source ethos. Their goal is to boost team productivity and well-being without forcing employees onto third-party cloud services that collect data.

Secondary User Segment: The Convenience User

This user is someone who needs the organizational features of the platform but lacks the technical skill or time to self-host. They are willing to pay a small, reasonable fee for a managed, "it-just-works" version of the tool. Their primary goal is to access the functionality without the overhead of setup and maintenance.

### **Goals & Success Metrics**

Project Philosophy & Objectives

The primary objective is to create and sustain a viable, community-driven, open-source alternative in the productivity space. Success is not measured in revenue, but in the project's value to the community and its adherence to the principles of privacy, user control, and open access. The project's goal is to be an empowering resource, not a commercial product focused on growth metrics.

User Success Definition

Success for a user is defined by their ability to achieve digital sovereignty over their organizational system. A user is successful when they can easily self-host the application, customize it to their unique needs (including their choice of LLM), and feel confident that their data remains completely private. The ultimate metric is user empowerment.

Project Health Indicators

While not tracking strict KPIs, the health of the project can be observed through qualitative community indicators:

* **Community Engagement:** Active and helpful discussions on platforms like GitHub or Discord.
* **Contributor Growth:** The organic emergence of community members who contribute code, documentation, or support.
* **User Adoption:** Positive "word-of-mouth" and organic growth within the target niche of privacy-conscious, tech-savvy users.

### **MVP Scope**

Core Features (Must-Haves)

The MVP will focus on the core user loop of creating, scheduling, and executing a routine.

1. **Routine & Task Creation:** The fundamental ability for a user to create a routine and add custom, timed tasks within it.
2. **Flexible Scheduling:** Basic scheduling options for routines to recur on specific days (e.g., daily, weekdays).
3. **Daily Timeline View:** A simple, visual timeline for the current day that displays the user's scheduled routines and tasks.
4. **Smart Reminders:** A basic notification system to alert the user when it's time to start a scheduled routine.
5. **Self-Hosting Capability:** The application must be containerized (e.g., via Docker) with clear documentation, enabling the primary target user to deploy it on their own infrastructure.

Out of Scope for MVP

To ensure a focused and achievable first release, the following features will be deferred:

* **Progress Tracking & Gamification:** All forms of streak tracking, visual analytics, points, and badges.
* **Templates:** The library of pre-made routines.
* **Advanced Planning:** The "Inbox" or "brain dump" feature for unscheduled tasks.
* **Integrations:** Syncing with external calendars (Google, Apple) and cross-platform device sync.
* **Convenience Features:** Home screen widgets and reflective notes.
* **LLM Integration:** The ability to connect to any AI/LLM provider.
* **Hosted Version:** The entire paid, hosted offering will be deferred until the self-hosted version is mature.

MVP Success Criteria

The MVP will be considered a success when a user can successfully self-host the application, create a multi-step routine with timed tasks, schedule it to recur, and use the daily timeline and notifications to execute it. The core loop of creation, scheduling, and execution must be stable and functional.

### **Post-MVP Vision**

Phase 2 Features

Once the core self-hosted MVP is stable, the next phase of development could focus on introducing key features that deepen user engagement and utility. A potential roadmap could include:

* **Progress Tracking & Gamification:** Introduce streak tracking and basic visual analytics to help users stay motivated.
* **Calendar Integration:** Allow users to sync their routines with external calendars like Google Calendar or open-source CalDAV servers.
* **Initial LLM Integration:** Build the framework to allow users to connect to their choice of LLM provider for task-related intelligence.

Long-term Vision

The long-term vision is for the platform to mature from a feature-complete alternative into the go-to standard for open-source, self-hosted productivity. Success will be seeing the community adopt the platform as a foundation, building integrations and new features that we haven't yet imagined. The project will become a vibrant, decentralized ecosystem that champions user privacy and control.

Expansion Opportunities

Future growth could be explored in several directions as the community and platform evolve:

* **Low-Cost Hosted Version:** Launching the planned, simple hosted offering for non-technical users.
* **Community Template Library:** Creating a space for users to share and discover effective routine templates.
* **Integrations with FOSS Ecosystem:** Building connections with other popular self-hosted tools.
* **Organizational Features:** Developing features specifically for teams and organizations that want to use the platform as a wellness tool.

### **Technical Considerations**

**Platform Requirements**

* **Target Platforms:** The primary platform will be a responsive web application, designed to function seamlessly on both desktop and mobile browsers.
* **Future Expansion:** While native mobile applications are out of scope for the MVP, the architecture should not preclude future expansion into iOS and Android.
* **Hosting Environment:** The application is intended for self-hosting on standard web servers, with deployment streamlined via containers.

**Technology Preferences**

* **Frontend:** Next.js (React) will be used for the user interface.
* **Backend:** The backend will be built using Next.js API Routes, keeping the entire web application within a single framework.
* **Database:** A hybrid data strategy will be employed. Prisma will be used as the primary ORM, defaulting to an SQLite database for ease of setup, while ensuring portability to more robust relational databases like PostgreSQL in the future. Valkey (or a similar key-value store) will be utilized for NoSQL use cases where appropriate (e.g., caching, session management, or job queues).

**Architecture Considerations**

* **Repository Structure:** The project will be housed in a single monorepo containing the Next.js application and the separate job server.
* **Service Architecture:** The system will consist of two main services:
  1. A core **Web Service** (Next.js) handling all user interactions and API requests.
  2. An independent **Job Server** responsible for asynchronously processing events, tasks, and routines. This separation allows the services to be scaled independently.
* **Deployment:** The default and recommended method for deployment will be Docker Compose. The architecture must also be designed to support scalable deployments on Kubernetes (k8s).
* **Integration Requirements:** AI integration will be modular. The system must initially support providers with OpenAI-compatible interfaces and Google Gemini, with a configuration-based approach that allows for the easy addition of new providers in the future.
* **Security/Compliance:** A core security requirement is that all user data be encrypted at rest to ensure maximum privacy.

### **Constraints & Assumptions**

**Constraints**

* **Budget:** Budget is not a primary constraint for the MVP, as this is a passion project driven by personal time and effort.
* **Timeline:** As a passion project, there is no strict external deadline. The timeline is flexible and will be dictated by development progress.
* **Resources:** The project will be developed and maintained by a single contributor. This is the primary constraint, influencing the pace of development and the scope of work that can be completed in a given timeframe.

Key Assumptions

The project's strategy is based on the following key assumptions:

* **Market Viability:** There is a sufficient audience of technically-skilled, privacy-conscious users who desire a self-hosted organizational tool and possess the capability to deploy it.
* **Technical & Legal Feasibility:** The core, non-proprietary features of market-leading applications can be replicated for an MVP without encountering significant, unforeseen technical or legal obstacles.
* **Community Growth:** By building the project as open-source, it will naturally attract a community of users who may, over time, become contributors, helping to sustain and expand the platform's capabilities.
