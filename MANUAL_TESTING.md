# Guia de Teste Manual

Este guia cobre uma rodada manual do MVP do Poplist em ambiente local.

## Pré-requisitos

- Node.js 24 ativo.
- Dependências instaladas com `pnpm install`.
- PostgreSQL ativo via Docker Compose.
- `.env` configurado com `DATABASE_URL`.
- Migrations aplicadas com `pnpm db:migrate`.

Comandos básicos:

```bash
nvm use 24
docker compose up -d
pnpm db:migrate
pnpm dev
```

Acesse:

```text
http://localhost:3000
```

Credenciais locais:

```text
E-mail: local@poplist.dev
Senha: poplist-local
```

## 1. Login e Proteção de Rotas

1. Abra `/today` sem estar autenticado.
2. Confirme que a aplicação redireciona para `/login`.
3. Faça login com as credenciais locais.
4. Confirme que a página “Hoje” é exibida.
5. Clique em “Sair”.
6. Confirme que volta para `/login`.

Resultado esperado:

- Rotas privadas exigem autenticação.
- Login e logout funcionam.
- Não há stack trace ou erro técnico visível.

## 2. Projetos

1. Acesse “Projetos”.
2. Clique em “Novo projeto”.
3. Crie um projeto com nome, descrição opcional e cor.
4. Confirme que o projeto aparece na lista.
5. Edite o projeto.
6. Tente criar outro projeto ativo com o mesmo nome.
7. Arquive o projeto editado.

Resultado esperado:

- Projeto vazio ou duplicado é rejeitado.
- Projeto arquivado sai da lista padrão.
- Feedback visual aparece após ações.

## 3. Tarefas

1. Acesse “Tarefas”.
2. Clique em “Nova tarefa”.
3. Crie uma tarefa sem projeto.
4. Crie outra tarefa vinculada a um projeto ativo.
5. Use filtros de status, projeto e busca.
6. Marque uma tarefa como concluída.
7. Reabra a tarefa.
8. Cancele uma tarefa.

Resultado esperado:

- Tarefas aparecem e respeitam filtros.
- Transições de status funcionam.
- Projeto arquivado não pode ser usado em novas tarefas.

## 4. Planejamento Diário

1. Acesse “Hoje”.
2. Adicione uma tarefa existente ao dia.
3. Crie uma tarefa diretamente pelo bloco “Criar tarefa para o dia”.
4. Reordene tarefas planejadas.
5. Remova uma tarefa do planejamento.
6. Conclua uma tarefa planejada.

Resultado esperado:

- Planejar não duplica a tarefa original.
- Reordenação mantém a lista consistente.
- Remover do planejamento não exclui a tarefa.

## 5. Foco e Pomodoro

1. Garanta que exista uma tarefa pendente.
2. Inicie foco a partir de “Hoje” ou “Foco”.
3. Confirme redirecionamento para `/focus?focus=started`.
4. Confirme que o timer aparece no painel e no widget global.
5. Pause a sessão.
6. Retome a sessão.
7. Atualize a página.
8. Confirme que a sessão ativa é reconstruída.
9. Conclua ou cancele a sessão.

Resultado esperado:

- Timer usa tempo restante baseado em timestamp.
- Atualizar a página não perde a sessão.
- Não é possível iniciar duas sessões ativas ao mesmo tempo.

## 6. Histórico

1. Crie ao menos uma sessão concluída e uma cancelada.
2. Acesse “Histórico”.
3. Filtre por período.
4. Filtre por projeto e tarefa.
5. Navegue pela paginação se houver dados suficientes.

Resultado esperado:

- Sessões concluídas e canceladas aparecem separadas.
- Filtros aparecem na URL.
- Paginação mantém filtros.

## 7. Relatórios

1. Acesse “Relatórios”.
2. Filtre por um período com sessões concluídas.
3. Verifique cards de resumo.
4. Verifique gráficos de tempo por dia e por projeto.
5. Verifique tabela de projetos.
6. Filtre um período sem dados.

Resultado esperado:

- Métricas batem com sessões persistidas.
- Sessões canceladas não somam tempo focado.
- Tela sem dados não quebra.

## 8. Configurações

1. Acesse “Configurações”.
2. Altere duração de foco, pausa curta, pausa longa e preferências.
3. Salve.
4. Inicie uma nova sessão de foco.
5. Confirme que a nova sessão usa a nova duração.
6. Confirme que uma sessão já em andamento não muda inesperadamente.
7. Tente salvar valores fora dos limites.

Resultado esperado:

- Configurações persistem.
- Valores inválidos são rejeitados.
- Mudanças afetam apenas novas sessões.

## 9. Responsividade e Acessibilidade

1. Teste em largura desktop.
2. Teste em largura mobile.
3. Navegue usando teclado.
4. Confirme foco visível em botões e campos.
5. Verifique botões somente com ícone.
6. Alterne tema claro/escuro.

Resultado esperado:

- Sidebar desktop e navegação mobile funcionam.
- Botões icon-only possuem nome acessível.
- Texto não sobrepõe elementos.
- Contraste permanece aceitável nos temas.

## 10. Healthcheck e Qualidade

1. Acesse `/api/health`.
2. Execute a bateria local:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

Resultado esperado:

- `/api/health` retorna `status: ok`.
- Todos os comandos passam.

## Observações Para Registro

Durante o teste manual, registre:

- navegador e sistema operacional;
- data e horário;
- dados criados;
- passos para reproduzir falhas;
- mensagens de erro visíveis;
- logs relevantes do terminal;
- screenshots quando houver problema visual.
