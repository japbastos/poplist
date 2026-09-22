# Suggested commands

## Development
- `nvm use 24` - use the expected Node.js version.
- `pnpm install` - install dependencies when needed and explicitly approved.
- `pnpm dev` - start the Next.js dev server.
- `docker compose up -d` - start local PostgreSQL.
- `docker compose down` - stop local PostgreSQL.

## Quality
- `pnpm lint` - run ESLint.
- `pnpm typecheck` - run TypeScript with `tsc --noEmit`.
- `pnpm test` - run Vitest tests.
- `pnpm build` - build with `next build --webpack`.
- `pnpm test:e2e` - run Playwright E2E tests.
- `pnpm exec playwright install chromium` - install Chromium once for local E2E, if needed.

## Database
- `pnpm db:generate` - generate Drizzle migrations; requires explicit confirmation before creating/modifying migrations.
- `pnpm db:migrate` - apply Drizzle migrations.

## Useful Linux/project inspection commands
- `rg "pattern"` - fast text search.
- `rg --files` - list tracked/searchable files quickly.
- `find <path> -maxdepth <n> -type f` - inspect directories when `rg` is not enough.
- `ls -la` - inspect directory contents.
- `sed -n '1,220p' <file>` - read bounded file ranges.
- `git status --short` - inspect worktree when Git metadata is available.
