<!--

Hey, thanks for using the awesome-readme-template template.  

If you have any enhancements, then fork this project and create a pull request 

or just open an issue with the label "enhancement".

Don't forget to give this project a star for additional support ;)

Maybe you can mention me or this repo in the acknowledgements too

-->

<div align="center">
  <img src="assets/logo.png" alt="logo" width="200" height="auto" />
  <h1>Mindful Mosaic</h1>
  <p>
    A thoughtfully designed application that helps users build and manage daily routines with mindfulness at its core.
  </p>

<!-- Badges -->
<p>
  <a href="https://github.com/qubitquilt/mindful-mosaic/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/qubitquilt/mindful-mosaic" alt="contributors" />
  </a>
  <a href="https://github.com/qubitquilt/mindful-mosaic/commits/main">
    <img src="https://img.shields.io/github/last-commit/qubitquilt/mindful-mosaic" alt="last update" />
  </a>
  <a href="https://github.com/qubitquilt/mindful-mosaic/network/members">
    <img src="https://img.shields.io/github/forks/qubitquilt/mindful-mosaic" alt="forks" />
  </a>
  <a href="https://github.com/qubitquilt/mindful-mosaic/stargazers">
    <img src="https://img.shields.io/github/stars/qubitquilt/mindful-mosaic" alt="stars" />
  </a>
  <a href="https://github.com/qubitquilt/mindful-mosaic/issues">
    <img src="https://img.shields.io/github/issues/qubitquilt/mindful-mosaic" alt="open issues" />
  </a>
  <a href="https://github.com/qubitquilt/mindful-mosaic/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/qubitquilt/mindful-mosaic.svg" alt="license" />
  </a>
</p>

<h4>
  <a href="https://github.com/qubitquilt/mindful-mosaic">View Demo</a>
  <span> · </span>
    <a href="https://github.com/qubitquilt/mindful-mosaic/tree/main/docs">Documentation</a>
  <span> · </span>
    <a href="https://github.com/qubitquilt/mindful-mosaic/issues/">Report Bug</a>
  <span> · </span>
    <a href="https://github.com/qubitquilt/mindful-mosaic/issues/">Request Feature</a>
  </h4>
</div>

<br />



<!-- Table of Contents -->

# :notebook_with_decorative_cover: Table of Contents



- [About the Project](#star2-about-the-project)

  * [Screenshots](#camera-screenshots)

  * [Tech Stack](#space_invader-tech-stack)

  * [Features](#dart-features)

  * [Color Reference](#art-color-reference)

  * [Environment Variables](#key-environment-variables)

- [Getting Started](#toolbox-getting-started)

  * [Prerequisites](#bangbang-prerequisites)

  * [Installation](#gear-installation)

  * [Running Tests](#test_tube-running-tests)

  * [Run Locally](#running-run-locally)

  * [Deployment](#triangular_flag_on_post-deployment)

- [Usage](#eyes-usage)

- [Roadmap](#compass-roadmap)

- [Contributing](#wave-contributing)

  * [Code of Conduct](#scroll-code-of-conduct)

- [FAQ](#grey_question-faq)

- [License](#warning-license)

- [Contact](#handshake-contact)

- [Acknowledgements](#gem-acknowledgements)



  

<!-- About the Project -->

## :star2: About the Project



Mindful Mosaic exists to simplify routine management by combining user-friendly interfaces with powerful backend capabilities. It addresses common pain points like forgetting tasks, lack of motivation, and fragmented scheduling tools. By leveraging authentication for personalized experiences, a daily timeline view for visualization, and extensible architecture for future features like job scheduling, the project empowers users to mosaic their lives with mindful practices.



The core motivation is to promote mental health through structured yet flexible habit-building, drawing from product requirements documented in our PRD (Product Requirements Document). It's open-source to encourage community contributions and adaptations for diverse needs.



<!-- Screenshots -->

### :camera: Screenshots



<div align="center"> 

  <img src="https://placehold.co/600x400?text=Timeline+View" alt="screenshot" />

  <img src="https://placehold.co/600x400?text=Routine+Management" alt="screenshot" />

</div>



<!-- TechStack -->

### :space_invader: Tech Stack



<details>

  <summary>Client</summary>

  <ul>
    <li><a href="https://www.typescriptlang.org/">Typescript</a></li>
    <li><a href="https://nextjs.org/">Next.js</a></li>
    <li><a href="https://reactjs.org/">React.js</a></li>
    <li><a href="https://tailwindcss.com/">TailwindCSS</a></li>
  </ul>

</details>



<details>

  <summary>Server</summary>

  <ul>

    <li><a href="https://www.typescriptlang.org/">Typescript</a></li>

    <li><a href="https://nextjs.org/docs/api-routes/introduction">Next.js API</a></li>

    <li><a href="https://authjs.dev/">NextAuth.js</a></li>

    <li><a href="https://www.prisma.io/">Prisma</a></li>    

  </ul>

</details>



<details>

<summary>Database</summary>

  <ul>

    <li><a href="https://www.postgresql.org/">PostgreSQL</a></li>

  </ul>

</details>



<details>

<summary>DevOps</summary>

  <ul>

    <li><a href="https://turbo.build/repo/docs">Turborepo</a></li>

    <li><a href="https://pnpm.io/">pnpm</a></li>

    <li><a href="https://jestjs.io/">Jest</a></li>

    <li><a href="https://playwright.dev/">Playwright</a></li>

  </ul>

</details>



<!-- Features -->

### :dart: Features



- **User Authentication**: Secure sign-in/sign-out with NextAuth.js integration, supporting multiple providers.

- **Daily Timeline View**: Visualize your routines in a chronological, interactive timeline component.

- **Routine Management**: Create, edit, and track daily tasks with intuitive forms and persistence via Prisma database.

- **Responsive Design**: Built with Tailwind CSS for seamless experience across devices.

- **Testing Suite**: Comprehensive unit, integration, and E2E tests using Jest, React Testing Library, and Playwright.

- **Monorepo Architecture**: Organized with Turborepo for efficient development across web and jobs apps, sharing a common database.

- **Type Safety**: Full TypeScript support for reliable code.

- **Accessibility**: ARIA-compliant components and keyboard navigation.



Future enhancements include advanced scheduling execution and analytics dashboards.



<!-- Color Reference -->

### :art: Color Reference



| Color             | Hex                                                                |

| ----------------- | ---------------------------------------------------------------- |

| Primary Color | ![#3B82F6](https://via.placeholder.com/10/3B82F6?text=+) #3B82F6 |

| Secondary Color | ![#10B981](https://via.placeholder.com/10/10B981?text=+) #10B981 |

| Accent Color | ![#F59E0B](https://via.placeholder.com/10/F59E0B?text=+) #F59E0B |

| Text Color | ![#111827](https://via.placeholder.com/10/111827?text=+) #111827 |



<!-- Env Variables -->

### :key: Environment Variables



To run this project, you will need to add the following environment variables to your .env file



`DATABASE_URL`

`NEXTAUTH_SECRET`

`NEXTAUTH_URL`



<!-- Getting Started -->

## 	:toolbox: Getting Started



<!-- Prerequisites -->

### :bangbang: Prerequisites



This project uses pnpm as package manager



```bash

 npm install --global pnpm

```



<!-- Installation -->

### :gear: Installation



1. Clone the Repository:

```bash

  git clone https://github.com/qubitquilt/mindful-mosaic.git

  cd mindful-mosaic

```



2. Install Dependencies:

```bash

  pnpm install

```



3. Set Up Environment Variables:

```bash

  cp .env.example .env

```



4. Database Setup:

```bash

  pnpm db:push

```



   

<!-- Running Tests -->

### :test_tube: Running Tests



To run tests, run the following command



```bash

  pnpm test

```



<!-- Run Locally -->

### :running: Run Locally



Go to the project directory



```bash

  cd mindful-mosaic

```



Install dependencies



```bash

  pnpm install

```



Start the server



```bash

  pnpm dev

```



  

<!-- Deployment -->

### :triangular_flag_on_post: Deployment



To deploy this project run



```bash

  pnpm build

  pnpm start

```



For Vercel, set root to `/apps/web` and build command to `pnpm turbo build --filter=web`.



<!-- Usage -->

## :eyes: Usage



Use this space to tell a little more about your project and how it can be used. Show additional screenshots, code samples, demos or link to other resources.



### Basic Authentication Flow



1. **Sign In**:

   Users can sign in via the `SignInButton` component. Example usage in a layout:

   ```tsx

   import { SignInButton } from '@/components/SignInButton';



   export default function Header() {

     return (

       <header className="flex justify-between p-4">

         <h1>Mindful Mosaic</h1>

         <SignInButton />

       </header>

     );

   }

   ```

   This renders a button that triggers NextAuth sign-in.



2. **Viewing Daily Timeline**:

   Once authenticated, access the timeline:

   ```tsx

   import { Timeline } from '@/components/Timeline';



   export default function Dashboard() {

     return <Timeline />;  // Fetches and displays user's routines

   }

   ```

   The `Timeline` component queries the database for scheduled items and renders them chronologically.



3. **Signing Out**:

   Use the `SignOutButton` for logout:

   ```tsx

   import { SignOutButton } from '@/components/auth/SignOutButton';



   <SignOutButton>Sign Out</SignOutButton>

   ```



### Adding a Routine (API Example)



Interact with the backend via API routes. Example fetch for creating a routine:

```javascript

async function createRoutine(routineData) {

  const response = await fetch('/api/routines', {

    method: 'POST',

    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify(routineData),

  });

  return response.json();

}



// Usage

createRoutine({ title: 'Morning Meditation', time: '07:00', duration: 10 });

```



For more configuration options, see the [docs](docs/architecture.md) or [coding standards](docs/coding-standards.md).



<!-- Roadmap -->

## :compass: Roadmap



- [x] User Authentication

- [x] Routine Management

- [x] Daily Timeline View

- [ ] Advanced Scheduling Execution

- [ ] Routine Analytics and Notifications

- [ ] Mobile App Support



See [prd/epic-list.md](docs/prd/epic-list.md) for detailed epics.



<!-- Contributing -->

## :wave: Contributing



<a href="https://github.com/qubitquilt/mindful-mosaic/graphs/contributors">

  <img src="https://contrib.rocks/image?repo=qubitquilt/mindful-mosaic" />

</a>





Contributions are always welcome!



See `contributing.md` for ways to get involved. Follow conventional commits (e.g., `feat: add new routine type`). Adhere to Prettier and ESLint configs. See [coding-standards.md](docs/coding-standards.md).



Guidelines:

- Write tests for new features.

- Update docs in `/docs` for major changes.

- No breaking changes without discussion.



Join our community on GitHub Discussions for ideas!



<!-- Code of Conduct -->

### :scroll: Code of Conduct



Please read the [coding-standards.md](docs/coding-standards.md) for details on our standards.



<!-- FAQ -->

## :grey_question: FAQ



- **How do I set up the database?**

  + Run `pnpm db:push` after configuring `DATABASE_URL` in `.env`.



- **What if auth fails?**

  + Check `NEXTAUTH_SECRET` and provider configs. Verify database has auth models: `pnpm db:studio`.



- **Tests failing?**

  + Clear caches with `pnpm next build --no-cache` or check Node version.



For more, check [Troubleshooting](docs/troubleshooting.md) or file an issue.



<!-- License -->

## :warning: License



Distributed under the MIT License. See [LICENSE](LICENSE) for more information.



<!-- Contact -->

## :handshake: Contact



qubitquilt - [@qubitquilt](https://github.com/qubitquilt) - michaelruelas@gmail.com



Project Link: [https://github.com/qubitquilt/mindful-mosaic](https://github.com/qubitquilt/mindful-mosaic)



- **Repository**: [github.com/qubitquilt/mindful-mosaic](https://github.com/qubitquilt/mindful-mosaic)

- **Issues**: Report bugs or request features [here](https://github.com/qubitquilt/mindful-mosaic/issues).

- **Email**: contact@mindfulmosaic.app

- **Discord/Slack**: Join our community server for real-time support.



We'd love your feedback—star the repo and share your thoughts!



<!-- Acknowledgments -->

## :gem: Acknowledgements



- [Next.js](https://nextjs.org/)

- [Prisma](https://www.prisma.io/)

- [Tailwind CSS](https://tailwindcss.com/)

- [Turborepo](https://turbo.build/repo)

- Contributors listed in Git history

- Docs authors for architecture and PRD



Thanks to the open-source community!
