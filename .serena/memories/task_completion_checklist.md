# Task completion checklist

Before finishing a code task:

1. Summarize what changed and list modified files.
2. Run relevant checks when feasible, usually:
   - `pnpm lint`
   - `pnpm typecheck`
   - `pnpm test`
   - `pnpm build` for changes that affect Next.js runtime/build behavior.
   - `pnpm test:e2e` for critical user flows or routing/auth changes.
3. If checks are not run, state why.
4. Mention any residual risks or follow-up work.
5. Do not commit, push, reset, clean, install dependencies, modify `.env`/secrets, or create/change migrations without explicit user confirmation.
