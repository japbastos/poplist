# Style and conventions

- Respond and document primarily in Brazilian Portuguese when writing project-facing explanations.
- Code is TypeScript/React with strict typing. Prefer explicit, readable types and avoid broad `any`.
- Imports use the `@/*` alias for `src/*`.
- App Router routes live under `src/app`; feature code is grouped by domain under `src/features/<domain>`.
- Server-side business logic is split into repositories (`src/server/repositories`) and services (`src/server/services`). Keep database access in repositories and business orchestration in services.
- Feature modules commonly have `actions`, `schemas`, and `components`; reuse those conventions before adding new structure.
- Validation schemas use Zod.
- UI should reuse existing shared/layout/ui components before introducing new ones.
- Tests are colocated as `*.test.ts`/`*.test.tsx` near the code where practical; E2E tests live in `tests/e2e`.
- ESLint uses Next core web vitals and TypeScript configs from `eslint.config.mjs`.
- The repository has special AGENTS instructions: before edits, explain the plan, files to change, and risks; avoid modifying `.env`, secrets, migrations, public API contracts, DB schema, commits/pushes/resets/cleans, or dependency installation without explicit confirmation.
- This project uses a newer Next.js with local docs under `node_modules/next/dist/docs/`; read relevant docs before changing Next-specific APIs or conventions.
