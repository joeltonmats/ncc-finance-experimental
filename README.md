# NCC Finance

An initial MVP modern financial management platform built with [Next.js](https://nextjs.org), [TypeScript](https://www.typescriptlang.org/), [Prisma](https://www.prisma.io/), [NextAuth.js](https://next-auth.js.org/), and more.

Includes authentication, database integration, Storybook-driven UI, and best practices for code quality and testing.

Developed for Tech Challenge 1.

## Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:NewCode-Crafters/ncc-finance.git
cd ncc-finance
```

### 2. Install dependencies

> Pre-requirements: Node >= 18

```bash
npm install
```

### 3. Configure Prisma

- Copy the example environment file and update the database URL:
  ```bash
  cp .env.example .env
  ```
- Edit `.env` and set your `NEXTAUTH_SECRET`.

> How to: Generate the password by `npx auth secret`, then copy the value from `.env.local` to `NEXTAUTH_SECRET` in `.env` file. Also, you can delete the `.env.local` file, it is not necessary.

### 4. Run Prisma migrations

```bash
npm run prisma:migrate
```

> Note: After the first time this step finishes, automatically will run the initial database seed.

### 5. Run the development server

```bash
npm run dev
```

Then, Access `http://localhost:3000/`:

- "Já tenho conta" Option - Fill the "Email" and "Senha" fields with the following credentials:
  - Email: guest@ncc.com
  - Password: ncc
  - Select the "Access" button. The application will redirect to the home page, after success
- "Abrir minha conta" option - Fill all fields with the proper information, then "Create conta" button
  - The application will redirect to the sign in page, after success.
  - Sign in with the data previously saved. The application will redirect to the home page, after success

### 6. Additional Commands Seed the database(optional, only if decides to)

A. Optional, only necessary if it custom the seed script.

```bash
npm run prisma:seed
```

B. Optional, it resets prisma DB, then you are able to generate seed using command `A`.

```bash
npm run prisma:db-reset
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Storybook

To run storybook

```bash
npm run storybook
```

Open [http://localhost:6006/](http://localhost:3000) to view the components.

## Project Structure

```
ncc-finance/
├── .github/            # GitHub workflows and templates
├── .husky/             # Husky git hooks
├── .next/              # Next.js build output (auto-generated)
├── .storybook/         # Storybook configuration for UI component development
├── .vscode/            # VS Code editor settings and extensions
├── docs/               # Project documentation and guides
├── node_modules/       # Installed dependencies
├── prisma/             # Prisma schema, migrations, and seed scripts
├── public/             # Static assets (images, icons, etc.)
├── src/                # Main source code for the application
│   ├── app/            # Next.js app directory (routes, layouts, pages)
│   ├── components/     # Reusable React components
│   ├── constants/      # Application-wide constants
│   ├── features/       # Feature-specific modules and logic
│   ├── lib/            # Utility libraries and helpers
│   ├── models/         # Data models and types
│   ├── service/        # Service layer for business logic and API calls
│   ├── stories/        # Storybook stories for UI components
│   ├── types/          # Shared TypeScript types and interfaces
│   └── setupTests.ts   # Test setup file
├── tests/              # Code Coverage for the automated tests for the application
├── .env                # Environment variable configuration
├── .env.example        # Example environment variable configuration
├── .eslintignore       # ESLint ignore rules
├── .gitignore          # Git ignore rules
├── .huskyrc            # Husky configuration
├── .lintstagedrc       # Lint Staged configuration
├── .nvmrc              # Node version manager configuration
├── .prettierignore     # Prettier ignore rules
├── .prettierrc.json    # Prettier configuration
├── eslint.config.mjs   # ESLint configuration
├── next-env.d.ts       # Next.js TypeScript environment definitions
├── next.config.ts      # Next.js configuration
├── package-lock.json   # Dependency lock file
├── package.json        # Project metadata, scripts, and dependencies
├── postcss.config.mjs  # PostCSS configuration
├── README.md           # Project documentation
├── tsconfig.json       # TypeScript configuration
└── vitest.config.ts    # Vitest testing configuration
```

## Scripts

| Script            | Description                                                                    |
| ----------------- | ------------------------------------------------------------------------------ |
| `check:node`      | Checks if Node.js version is 18 or higher before installing dependencies.      |
| `preinstall`      | Runs the Node.js version check before installing dependencies.                 |
| `dev`             | Starts the Next.js development server with Turbopack for fast refresh and HMR. |
| `build`           | Builds the Next.js application for production.                                 |
| `start`           | Starts the Next.js production server.                                          |
| `lint`            | Runs ESLint to check for code quality and style issues.                        |
| `lint:fix`        | Runs ESLint and automatically fixes fixable issues.                            |
| `prettier:check`  | Checks code formatting in the `src` directory using Prettier.                  |
| `storybook`       | Starts Storybook for developing and testing UI components in isolation.        |
| `build-storybook` | Builds the static Storybook site for deployment.                               |
| `commit`          | Starts Commitizen CLI for standardized commit messages.                        |
| `test`            | Runs all tests using Vitest.                                                   |
| `test:ui`         | Opens the Vitest UI for interactive test running.                              |
| `test:coverage`   | Runs tests and generates a code coverage report.                               |
| `prepare`         | Sets up Husky git hooks after installing dependencies.                         |
| `prisma:migrate`  | Runs Prisma migrations in development.                                         |
| `prisma:generate` | Generates Prisma client code from the schema.                                  |
| `prisma:seed`     | Seeds the database with initial data using the seed script.                    |
| `prisma:db-reset` | Resets the database and applies all migrations from scratch.                   |

## Main Libraries & Tools

| Library/Tool                  | Purpose                                                               |
| ----------------------------- | --------------------------------------------------------------------- |
| **TypeScript**                | Type-safe JavaScript for scalable and maintainable development.       |
| **Next.js**                   | React framework for SSR, routing, and API routes.                     |
| **React**                     | Core UI library for building user interfaces.                         |
| **Prisma**                    | Type-safe ORM for database access and migrations.                     |
| **@prisma/client**            | Prisma's generated client for database queries.                       |
| **NextAuth.js**               | Authentication for Next.js apps.                                      |
| **@auth/prisma-adapter**      | Prisma adapter for NextAuth.js to persist user sessions and accounts. |
| **Tailwind CSS**              | Utility-first CSS framework for rapid UI development.                 |
| **Storybook**                 | Isolated UI component development and documentation environment.      |
| **@storybook/nextjs**         | Storybook integration for Next.js projects.                           |
| **@faker-js/faker**           | Generates fake data for testing and seeding.                          |
| **Vitest**                    | Fast unit testing framework with Vite integration.                    |
| **@testing-library/react**    | Utilities for testing React components with a user-centric approach.  |
| **@testing-library/jest-dom** | Custom Jest matchers for asserting on DOM nodes.                      |
| **Playwright**                | End-to-end browser testing for UI flows.                              |
| **ESLint**                    | Linting for code quality and consistency.                             |
| **Prettier**                  | Code formatter for consistent style.                                  |
| **Commitizen**                | Standardizes commit messages for better readability and automation.   |
| **Husky**                     | Git hooks for enforcing code quality before commits and pushes.       |
| **Lint Staged**               | Runs linters and formatters on staged git files.                      |
| **react-hot-toast**           | Toast notifications for user feedback.                                |
| **@headlessui/react**         | Unstyled, accessible UI primitives for React.                         |
| **@heroicons/react**          | Beautiful hand-crafted SVG icons for React.                           |
| **bcrypt**                    | Password hashing for authentication.                                  |
| **validator**                 | String validation and sanitization.                                   |

## External Links

- **[Video Demo](https://google.com)**
- **[Figma Design](https://www.figma.com/design/Z8ArLKonyv79d1eJIG6aE6/NCC-v.1?node-id=12085-1622&m=dev&t=V5sTdCtx3KMC54AK-1)**

## Contributors

| Name              | GitHub Profile                                       | Profile Picture                                                                                                       |
| ----------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Carlos Ferreira   | [@carlosrfjrdev](https://github.com/carlosrfjrdev)   | <img src="https://avatars.githubusercontent.com/u/107284563?v=4" width="40" height="40" style="border-radius:50%;" /> |
| Joelton Matos     | [@joeltonmatos](https://github.com/joeltonmats)      | <img src="https://avatars.githubusercontent.com/u/4190757?v=4" width="40" height="40" style="border-radius:50%;" />   |
| Larissa Rocha     | [@larisr](https://github.com/larisr)                 | <img src="https://avatars.githubusercontent.com/u/64704731?v=4" width="40" height="40" style="border-radius:50%;" />  |
| Leonardo Medeiros | [@leomartinsm](https://github.com/leomartinsm)       | <img src="https://avatars.githubusercontent.com/u/20979905?v=4" width="40" height="40" style="border-radius:50%;" />  |
| Ricardo Momberg   | [@ricardomomberg](https://github.com/RicardoMomberg) | <img src="https://avatars.githubusercontent.com/u/65039145?v=4" width="40" height="40" style="border-radius:50%;" />  |
