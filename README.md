# Poplist

Aplicação web para organização pessoal com projetos, tarefas, planejamento diário, sessões de foco e acompanhamento de tempo.

## Stack

- Next.js com App Router
- React
- TypeScript estrito
- Tailwind CSS
- shadcn/ui
- Lucide React
- PostgreSQL via Docker Compose
- Drizzle ORM
- Vitest e React Testing Library

## Ambiente

Use Node.js 24 e pnpm:

```bash
nvm use 24
pnpm install
```

Copie as variáveis de exemplo quando for executar localmente:

```bash
cp .env.example .env
```

## Banco de dados

O PostgreSQL roda em Docker Compose:

```bash
docker compose up -d
docker compose down
```

A URL local esperada está documentada em `.env.example`.

## Desenvolvimento

```bash
pnpm dev
```

## Qualidade

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

Para E2E local, instale o navegador do Playwright uma vez:

```bash
pnpm exec playwright install chromium
```

O Playwright usa um banco PostgreSQL separado por execução. Para fixar o banco
E2E manualmente, defina `E2E_DATABASE_URL`.

## Drizzle

Os scripts estão configurados para as próximas fases:

```bash
pnpm db:generate
pnpm db:migrate
```

Nenhuma tabela de domínio foi criada na Fase 0.

## Autenticação local

Usuário de desenvolvimento criado pela migration:

- E-mail: `local@poplist.dev`
- Senha: `poplist-local`

## Operação

- Checklist de deploy: `docs/deploy-checklist.md`
- Migrations, backup e observabilidade: `docs/operations.md`
