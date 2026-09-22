# Operação

## Variáveis de Ambiente

- `DATABASE_URL`: conexão PostgreSQL server-side. Nunca usar prefixo `NEXT_PUBLIC_`.

## Migrações

- Gerar migrations com `pnpm db:generate`.
- Revisar SQL gerado antes de aplicar.
- Aplicar em produção com `pnpm db:migrate`.
- Migrations que alteram dados existentes devem documentar a estratégia de transição.

## Backup

- Antes de cada deploy com migration, criar um dump lógico do PostgreSQL.
- Reter pelo menos o backup mais recente e o último backup anterior a uma mudança de schema.
- Testar restauração periodicamente em ambiente isolado.

## Observabilidade Mínima

- `/api/health` retorna status da aplicação e conexão com o banco.
- Logs server-side devem evitar segredos e stack traces enviados ao client.
- Falhas de Server Actions retornam mensagens controladas para a interface.

## Segurança

- Cookies de sessão são httpOnly e `secure` em produção.
- Toda query sensível deve receber o usuário autenticado ou usar serviço que resolve o usuário atual.
- Nenhum formulário deve aceitar `userId` livremente do client.
