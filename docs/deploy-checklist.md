# Checklist de Deploy

## Antes do deploy

- Confirmar Node.js 24 e pnpm 11.20.0.
- Configurar `DATABASE_URL` no provedor, sem expor variáveis ao client.
- Executar backup do PostgreSQL antes de migrations.
- Rodar `pnpm install --frozen-lockfile`.
- Rodar `pnpm db:migrate`.
- Rodar `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` e `pnpm test:e2e`.

## Publicação

- Publicar a aplicação Next.js como processo Node, não em Docker local de desenvolvimento.
- Garantir HTTPS para cookies seguros em produção.
- Verificar `/api/health` após o deploy.
- Conferir logs de erro do servidor e status de conexão com PostgreSQL.

## Rollback

- Manter o artefato anterior disponível.
- Restaurar backup do banco somente se a migration aplicada for incompatível com rollback de aplicação.
- Registrar o incidente e a migration afetada.
