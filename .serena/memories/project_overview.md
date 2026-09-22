# Poplist overview

Poplist is a personal organization web app for projects, tasks, daily planning, focus sessions, and time tracking/reporting.

## Stack
- Next.js 16.3.0 with App Router and React 19.2.8.
- TypeScript with `strict` enabled.
- Tailwind CSS v4 and shadcn-style components in `src/components/ui`.
- PostgreSQL via Docker Compose, Drizzle ORM, and migrations in `drizzle/`.
- Vitest + React Testing Library for unit/component/service tests.
- Playwright for E2E tests.

## Main structure
- `src/app`: Next App Router pages, layouts, loading/error/not-found, and API routes.
- `src/features/*`: feature modules with `actions`, `components`, and `schemas` for auth, tasks, projects, daily plan, focus sessions, history, reports, and settings.
- `src/server`: server-side auth, database client/schema, repositories, and services.
- `src/components/layout`: app shell, navigation, sidebars, header, theme toggle.
- `src/components/shared`: reusable app components such as page headers, skeletons, forms, empty/error states.
- `src/lib`: shared utilities, especially date and duration helpers.
- `tests/e2e`: Playwright critical-flow tests and global setup.
- `docs`: deployment and operations notes.

## Local environment
- Node.js 24 is expected (`.nvmrc` contains `24`).
- Package manager is `pnpm@11.20.0`.
- Copy `.env.example` to `.env` for local execution, but do not modify secrets without explicit user confirmation.
- Local auth seed from README: `local@poplist.dev` / `poplist-local`.
