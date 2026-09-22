# TASKS.md

## Como usar este arquivo

- Trabalhe em uma fase por vez.
- Dentro de cada fase, implemente incrementos pequenos.
- Não avance com erros de lint, typecheck, testes ou build.
- Marque itens somente após validar a implementação.
- Registre decisões importantes em “Notas da fase”.
- Divida tarefas grandes antes de começar.
- Não adicione itens futuros ao escopo atual sem necessidade comprovada.

### Status

- `[ ]` pendente
- `[-]` em andamento
- `[x]` concluído
- `[!]` bloqueado

---

# Fase 0 — Fundação da aplicação web

## Objetivo

Criar uma aplicação Next.js executável, com qualidade básica, PostgreSQL no Docker e identidade visual inicial usando shadcn/ui e Lucide Icons.

## Tarefas

### Projeto

- [x] Inicializar projeto Next.js com App Router, TypeScript e pasta `src`.
- [x] Configurar Node.js 24 em `.nvmrc`.
- [x] Definir `packageManager` no `package.json`.
- [x] Confirmar uso exclusivo de `pnpm`.
- [x] Configurar TypeScript com `strict: true`.
- [x] Configurar aliases com `@/`.
- [x] Configurar ESLint.
- [x] Adicionar scripts `dev`, `build`, `lint`, `typecheck` e `test`.
- [x] Criar `.env.example`.
- [x] Revisar `.gitignore`.
- [x] Criar README com instruções de ambiente.

### UI

- [x] Configurar Tailwind CSS.
- [x] Inicializar shadcn/ui.
- [x] Instalar `lucide-react`.
- [x] Criar helper `cn`.
- [x] Adicionar somente os primeiros componentes shadcn necessários.
- [x] Criar layout base da aplicação.
- [x] Criar sidebar responsiva.
- [x] Criar header principal.
- [x] Criar navegação para Hoje, Projetos, Tarefas, Foco e Relatórios.
- [x] Usar Lucide Icons na navegação.
- [x] Criar tema visual inicial com CSS variables.
- [x] Configurar Sonner para feedback de ações.
- [x] Criar página inicial mínima.

### Banco

- [x] Criar `docker-compose.yml` com PostgreSQL.
- [x] Configurar volume persistente.
- [x] Configurar healthcheck.
- [x] Documentar comandos para iniciar e parar o banco.
- [x] Adicionar `DATABASE_URL` ao `.env.example`.
- [x] Configurar Drizzle ORM.
- [x] Criar conexão server-only.
- [x] Criar comando de geração de migration.
- [x] Criar comando de execução de migration.
- [ ] Criar endpoint ou função de healthcheck apenas se necessário.

### Testes

- [x] Configurar Vitest.
- [x] Configurar React Testing Library.
- [x] Configurar ambiente `jsdom`.
- [x] Criar teste básico da página inicial.
- [x] Criar teste de conexão ou repository somente após o schema existir.

## Critérios de aceite

- [x] `pnpm dev` inicia a aplicação.
- [x] `docker compose up -d` inicia o PostgreSQL.
- [x] A aplicação conecta ao banco sem expor credenciais ao client.
- [x] A navegação base funciona.
- [x] shadcn/ui está configurado.
- [x] Lucide Icons é usado na interface.
- [x] `pnpm lint` passa.
- [x] `pnpm typecheck` passa.
- [x] `pnpm test` passa.
- [x] `pnpm build` passa.

## Notas da fase

Registrar aqui as decisões tomadas.

- Next.js foi inicializado como aplicação web nova com App Router, TypeScript, Tailwind CSS e pasta `src`, sem reaproveitar arquitetura Electron.
- shadcn/ui ficou configurado com `components.json` e componentes mínimos (`button`, `sheet`, `sonner`) para a fundação.
- Drizzle foi configurado sem tabelas de negócio na Fase 0; `src/server/db/schema.ts` permanece sem schema até a Fase 1.
- A conexão Drizzle usa `server-only` para evitar exposição de `DATABASE_URL` no client.
- `docker compose up -d` não pôde ser validado porque o comando `docker` não está disponível neste WSL; por isso os critérios dependentes de PostgreSQL real ficaram bloqueados.
- Docker Compose foi validado posteriormente com o container `poplist-postgres` saudável, e os testes de integração confirmaram conexão server-side com o banco.

---

# Fase 1 — Modelagem e camada de dados

## Objetivo

Definir o modelo inicial e criar a base segura de persistência.

## Tarefas

### Modelagem

- [x] Definir enums de status e prioridade.
- [x] Modelar `projects`.
- [x] Modelar `tasks`.
- [x] Modelar `daily_plan_items`.
- [x] Modelar `focus_sessions`.
- [x] Modelar `timer_settings` somente se necessário nesta fase.
- [x] Definir timestamps como `timestamptz`.
- [x] Definir `plan_date` como `date`.
- [x] Definir foreign keys.
- [x] Definir comportamento de exclusão.
- [x] Definir índices.
- [x] Definir constraints de integridade.
- [x] Avaliar constraint para impedir sessão ativa simultânea.

### Drizzle

- [x] Criar schemas Drizzle.
- [x] Criar relations.
- [x] Gerar migration inicial.
- [x] Executar migration no PostgreSQL local.
- [ ] Criar seed opcional de desenvolvimento.
- [ ] Criar script para reset do banco somente em desenvolvimento.

### Repositories

- [x] Criar repository de projetos.
- [x] Criar repository de tarefas.
- [x] Criar repository de planejamento diário.
- [x] Criar repository de sessões de foco.
- [x] Não acessar Drizzle diretamente em componentes React.
- [x] Adicionar testes de integração dos repositories.

## Critérios de aceite

- [x] Banco pode ser criado do zero somente por migrations.
- [x] Relações possuem integridade referencial.
- [x] Datas de planejamento não sofrem conversão de timezone.
- [x] Repositories escondem detalhes das queries.
- [x] Testes de integração executam em ambiente controlado.
- [x] Não existem regras de negócio importantes somente no banco.

## Notas da fase

Registrar aqui as decisões tomadas.

- `timer_settings` não foi modelada nesta fase porque ainda não existe fluxo de configurações; será criada quando a Fase 9 definir as regras de personalização.
- `projects`, `tasks`, `daily_plan_items` e `focus_sessions` foram modeladas com UUID público, enums, FKs, índices e constraints mínimas de integridade.
- `daily_plan_items.plan_date` usa tipo `date`, e os testes validam que a data planejada permanece como string `YYYY-MM-DD`, sem conversão para timestamp.
- Timestamps usam `timestamp with time zone`.
- Exclusões: remover tarefa remove itens do planejamento, mas sessões de foco restringem exclusão da tarefa; remover projeto preserva tarefas/sessões com `project_id` nulo.
- Enquanto não há autenticação, a constraint `focus_sessions_single_active_unique` impede mais de uma sessão global em status `active` ou `paused`.
- Repositories foram mantidos finos e server-side; regras de aplicação ficam para services nas próximas fases.
- Seed e script de reset não foram criados porque são opcionais/operacionais e não foram necessários para validar a modelagem.

---

# Fase 2 — Shell da aplicação e design system

## Objetivo

Criar uma experiência consistente antes de desenvolver os fluxos completos.

## Tarefas

- [x] Refinar layout desktop.
- [x] Refinar navegação mobile.
- [x] Implementar estado recolhido da sidebar, se necessário.
- [x] Criar componente de título de página.
- [x] Criar componente de estado vazio.
- [x] Criar componente de erro recuperável.
- [x] Criar padrões de skeleton.
- [x] Criar padrão de confirmação destrutiva.
- [x] Criar padrão de formulário em Dialog ou Sheet.
- [x] Definir uso consistente de Card, Badge e Button.
- [x] Definir tamanhos padrão dos Lucide Icons.
- [x] Criar Tooltip para ações somente com ícone.
- [x] Garantir navegação por teclado.
- [x] Verificar contraste.
- [x] Criar página 404.
- [x] Criar error boundary global.

## Critérios de aceite

- [x] Layout funciona em desktop e mobile.
- [x] Componentes base reutilizam shadcn/ui.
- [x] Nenhuma segunda biblioteca de ícones foi adicionada.
- [x] Botões somente com ícone possuem nome acessível.
- [x] Estados de loading, erro e vazio possuem padrão consistente.

## Notas da fase

Registrar aqui as decisões tomadas.

- O tema visual foi alinhado ao site pessoal `japbastos.com`: fonte Ubuntu, default dark, tokens light/dark e roxo `#974aaa` como cor de marca.
- O tema foi implementado sem adicionar `next-themes`; um script `beforeInteractive` aplica a classe `.dark` antes da hidratação e o toggle persiste em `localStorage`.
- A sidebar desktop permanece fixa; no mobile ela usa Sheet. Estado recolhido persistente não foi criado porque ainda não há necessidade operacional além da navegação responsiva.
- `Card`, `Badge`, `Button`, `Tooltip`, `PageHeader`, `EmptyState`, `RecoverableError`, `PageSkeleton`, `FormSheet` e `DestructiveConfirmation` definem os padrões iniciais do design system.
- Botões somente com ícone possuem `aria-label`; o botão de tema usa Tooltip.
- Contraste checado nos principais pares: light fg/bg 20.16, dark fg/bg 16.64, branco sobre marca 5.42, muted light/bg 4.76, muted dark/bg 6.62.

---

# Fase 3 — Projetos

## Objetivo

Permitir criar, visualizar, editar e arquivar projetos.

## Tarefas

### Aplicação

- [x] Criar schema Zod de criação.
- [x] Criar schema Zod de edição.
- [x] Implementar serviço `createProject`.
- [x] Implementar serviço `listProjects`.
- [x] Implementar serviço `getProject`.
- [x] Implementar serviço `updateProject`.
- [x] Implementar serviço `archiveProject`.
- [x] Definir regra para nomes vazios ou duplicados.
- [x] Definir regra para projeto arquivado.

### Interface

- [x] Criar página de projetos.
- [x] Criar cards ou tabela de projetos.
- [ ] Criar formulário usando shadcn/ui Form.
- [x] Criar seletor de cor simples.
- [x] Criar estado vazio.
- [x] Criar loading state.
- [x] Criar tratamento de erro.
- [x] Criar confirmação para arquivamento, caso necessário.
- [x] Usar Lucide Icons nas ações.
- [x] Atualizar a interface após mutações.

### Testes

- [x] Testar schemas.
- [x] Testar serviços.
- [x] Testar repository.
- [x] Testar formulário.
- [x] Testar arquivamento.

## Critérios de aceite

- [x] Usuário cria um projeto.
- [x] Usuário edita um projeto.
- [x] Usuário arquiva um projeto.
- [x] Projetos arquivados não aparecem por padrão.
- [x] Dados persistem no PostgreSQL.
- [x] Entradas são validadas no cliente e servidor.

## Notas da fase

Registrar aqui as decisões tomadas.

- Foi avaliado o uso de React Hook Form. Para o formulário inicial de projetos, a implementação ficou com Server Actions + Zod no servidor + validação HTML básica no cliente, seguindo o guia atual do Next para forms simples. React Hook Form permanece como opção para formulários mais complexos.
- O formulário de projeto usa os componentes/padrões locais baseados em shadcn (`Button`, `Sheet`, `Card`, `Badge`) sem instalar novos componentes ou dependências.
- Nomes vazios são rejeitados por Zod; descrições vazias são normalizadas para `null`; cores aceitam apenas hexadecimal `#RRGGBB`.
- Nomes duplicados entre projetos ativos são rejeitados de forma case-insensitive no service; nomes de projetos arquivados podem ser reutilizados.
- Projetos arquivados não aparecem na listagem padrão e não podem ser editados pelo service.
- Mutations usam Server Actions com `revalidatePath("/projects")`.

---

# Fase 4 — Tarefas

## Objetivo

Permitir gerenciar tarefas vinculadas ou não a projetos.

## Tarefas

### Aplicação

- [x] Definir status da tarefa.
- [x] Definir prioridades.
- [x] Criar schemas de criação e edição.
- [x] Implementar `createTask`.
- [x] Implementar `listTasks`.
- [x] Implementar `getTask`.
- [x] Implementar `updateTask`.
- [x] Implementar `completeTask`.
- [x] Implementar `cancelTask`.
- [x] Implementar `reopenTask`, se necessário.
- [x] Validar vínculo com projeto existente e ativo.
- [x] Registrar `completedAt`.

### Interface

- [x] Criar página de tarefas.
- [x] Criar formulário de tarefa.
- [x] Permitir tarefa sem projeto.
- [x] Adicionar seleção de projeto.
- [x] Adicionar seleção de prioridade.
- [x] Adicionar estimativa de Pomodoros.
- [x] Adicionar due date opcional.
- [x] Criar filtros por status.
- [x] Criar filtro por projeto.
- [x] Representar filtros em search params.
- [x] Criar busca por título.
- [x] Criar estado vazio.
- [x] Criar feedback de mutações.
- [x] Usar Lucide Icons de forma consistente.

### Testes

- [x] Testar schemas.
- [x] Testar transições de status.
- [x] Testar vínculo com projeto.
- [x] Testar filtros.
- [x] Testar conclusão.

## Critérios de aceite

- [x] Tarefa pode existir sem projeto.
- [x] Tarefa pode pertencer a um projeto.
- [x] Tarefa concluída registra data.
- [x] Filtros permanecem na URL.
- [x] Formulário é acessível.
- [x] Dados persistem após recarregar a página.

## Notas da fase

Registrar aqui as decisões tomadas.

- A Fase 4 seguiu o mesmo padrão simples da Fase 3: Server Actions + Zod + validação HTML básica, sem React Hook Form.
- Tarefas podem existir sem projeto ou vinculadas a um projeto ativo; vínculo com projeto arquivado/inexistente é rejeitado no service.
- Status implementados: `pending`, `in_progress`, `completed`, `cancelled`; a UI usa concluir, cancelar e reabrir.
- Prioridades implementadas: `low`, `medium`, `high`.
- `completeTask` registra `completedAt`; `reopenTask` volta para `pending` e limpa `completedAt`.
- Filtros por status, projeto e busca por título são representados em search params da rota `/tasks`.
- A página `/tasks` é server-rendered on demand porque depende de search params e consulta ao banco.

---

# Fase 5 — Planejamento diário

## Objetivo

Transformar a página “Hoje” no centro operacional da aplicação.

## Tarefas

### Aplicação

- [x] Implementar `planTaskForDate`.
- [x] Implementar `removeTaskFromDate`.
- [x] Implementar `getDailyPlan`.
- [x] Implementar reordenação.
- [x] Impedir duplicação da mesma tarefa na mesma data.
- [x] Definir comportamento de tarefas concluídas.
- [x] Definir comportamento de tarefas canceladas.
- [x] Usar `America/Recife` até existir configuração por usuário.

### Interface

- [x] Criar página “Hoje”.
- [x] Criar navegação entre datas.
- [x] Adicionar tarefa existente ao dia.
- [x] Criar tarefa diretamente no dia.
- [x] Reordenar tarefas.
- [x] Exibir projeto, prioridade e estimativa.
- [x] Concluir tarefa pela página Hoje.
- [ ] Adicionar ação de iniciar foco.
- [x] Criar resumo do dia.
- [x] Criar estado vazio útil.
- [x] Manter a interface simples e rápida.

### Testes

- [x] Testar unicidade por tarefa e data.
- [x] Testar datas sem alteração por timezone.
- [x] Testar ordenação.
- [x] Testar remoção do planejamento sem excluir a tarefa.
- [x] Testar criação direta.

## Critérios de aceite

- [x] Usuário planeja tarefas para uma data.
- [x] Adicionar ao dia não duplica a tarefa principal.
- [x] Ordenação é persistida.
- [x] Data exibida corresponde à data escolhida.
- [ ] Tarefa pode ser iniciada no timer a partir do planejamento.

## Notas da fase

Registrar aqui as decisões tomadas.

- A página Hoje usa search param `date=YYYY-MM-DD`; quando ausente ou inválida, usa a data atual em `America/Recife`.
- `plan_date` continua tratado como string `YYYY-MM-DD`; helpers de data evitam conversão para meia-noite UTC.
- Tarefa concluída pode permanecer ou ser planejada; tarefa cancelada não pode ser adicionada ao planejamento.
- Adicionar a mesma tarefa na mesma data retorna o item existente e respeita a unique constraint do banco.
- Reordenação troca posições usando uma posição temporária válida para não violar a constraint única `(plan_date, position)`.
- Criar tarefa diretamente no dia cria tarefa simples sem projeto, prioridade média e 1 Pomodoro, e já adiciona ao planejamento.
- O botão “Iniciar foco” foi incluído como placeholder desabilitado; a ação real fica para a Fase 6, quando o timer persistente existir.

---

# Fase 6 — Sessão de foco e Pomodoro

## Objetivo

Implementar um timer confiável, persistente e vinculado às tarefas.

## Tarefas

### Regras

- [x] Definir estados de uma sessão.
- [x] Definir transições válidas.
- [x] Impedir duas sessões simultâneas.
- [x] Definir duração padrão.
- [x] Definir cálculo de pausa.
- [x] Definir cálculo de duração focada.
- [x] Definir comportamento de sessão expirada.
- [x] Definir comportamento após refresh.
- [x] Definir comportamento quando a aba ficou suspensa.

### Aplicação

- [x] Implementar `startFocusSession`.
- [x] Implementar `getActiveFocusSession`.
- [x] Implementar `pauseFocusSession`.
- [x] Implementar `resumeFocusSession`.
- [x] Implementar `completeFocusSession`.
- [x] Implementar `cancelFocusSession`.
- [x] Proteger transições com transação quando necessário.
- [x] Persistir timestamps em toda transição.
- [x] Calcular o tempo restante a partir de timestamps.
- [x] Calcular duração final no servidor.

### Interface

- [x] Criar widget global de sessão ativa.
- [x] Criar página de foco.
- [x] Exibir tarefa e projeto.
- [x] Exibir tempo restante.
- [x] Criar ações iniciar, pausar, retomar, concluir e cancelar.
- [x] Usar Zustand apenas para atualização visual do timer.
- [x] Reconstruir o estado autoritativo a partir do servidor.
- [x] Criar aviso antes de cancelar.
- [x] Criar feedback ao concluir.
- [ ] Avaliar Web Notifications somente após o fluxo básico funcionar.
- [ ] Avaliar alerta sonoro configurável.

### Testes

- [x] Testar cada transição.
- [x] Testar transições inválidas.
- [x] Testar sessão simultânea.
- [x] Testar cálculo após atraso do event loop.
- [x] Testar recuperação após refresh.
- [x] Testar pausas.
- [x] Testar conclusão automática ou manual conforme regra definida.

## Critérios de aceite

- [x] Refresh não perde a sessão.
- [x] O timer não deriva com atraso do event loop.
- [x] Somente uma sessão pode estar ativa.
- [x] Pausa não é contabilizada como foco.
- [x] Sessão concluída registra duração consistente.
- [x] O timer permanece visível durante navegação interna.

## Notas da fase

Registrar aqui as decisões tomadas.

- Sessões usam status `active`, `paused`, `completed` e `cancelled`, com duração padrão de 25 minutos.
- O tempo restante é sempre derivado de `expectedEndAt - Date.now()`; o intervalo do client apenas força atualização visual.
- A sessão ativa é reconstruída a partir do PostgreSQL em `/focus`, então refresh não perde estado.
- A constraint parcial do banco impede mais de uma sessão global em `active` ou `paused`; o service também valida antes de iniciar.
- Pausas somam `accumulatedPauseSeconds` e deslocam `expectedEndAt`, evitando contabilizar pausa como foco.
- Conclusão manual calcula `focusedDurationSeconds` no servidor, limitada à duração planejada.
- Não foi adicionado Zustand porque o timer visual local e o widget global conseguem reconstruir o estado autoritativo pelo servidor.
- O botão de iniciar foco foi habilitado na página Hoje e na página Foco.
- O shell server renderiza um widget global compacto quando há sessão ativa, mantendo o timer visível durante navegação.
- Cancelamento exige confirmação no client antes de submeter a Server Action.
- Conclusão, cancelamento e início redirecionam para `/focus` com query param de feedback e exibem toast.
- Web Notifications e alerta sonoro ficaram para etapas posteriores.

---

# Fase 7 — Histórico

## Objetivo

Permitir consultar as sessões já executadas.

## Tarefas

- [x] Criar consulta por dia.
- [x] Criar consulta por intervalo.
- [x] Criar filtros por projeto.
- [x] Criar filtros por tarefa.
- [x] Criar paginação.
- [x] Criar página de histórico.
- [x] Exibir status da sessão.
- [x] Exibir duração planejada.
- [x] Exibir duração focada.
- [x] Exibir pausas.
- [x] Representar filtros na URL.
- [x] Criar loading e empty states.
- [x] Criar testes das agregações.

## Critérios de aceite

- [x] Usuário consulta sessões por período.
- [x] Filtros funcionam em conjunto.
- [x] Durações exibidas correspondem aos registros.
- [x] Sessões canceladas são identificadas claramente.

## Notas da fase

Registrar aqui as decisões tomadas.

- Foi criada a rota `/history` separada de `/reports`; relatórios permanecem reservados para a Fase 8.
- O histórico lista apenas sessões finalizadas (`completed` e `cancelled`), com join de tarefa e projeto.
- Filtros por período, projeto, tarefa e página são representados em search params.
- Paginação inicial usa 10 itens por página.
- Durações planejada, focada e pausas são formatadas a partir dos valores persistidos.
- Sessões canceladas são exibidas com badge própria e duração focada `0s` quando não há registro.
- A navegação principal ganhou item “Histórico”.

---

# Fase 8 — Relatórios do MVP

## Objetivo

Exibir métricas úteis sem transformar o produto em um dashboard excessivo.

## Tarefas

- [x] Calcular tempo focado no período.
- [x] Calcular quantidade de sessões concluídas.
- [x] Calcular tarefas concluídas.
- [x] Agrupar tempo por projeto.
- [x] Agrupar tempo por dia.
- [x] Criar seletor de período.
- [x] Criar cards de resumo.
- [x] Criar no máximo dois gráficos inicialmente.
- [x] Criar tabela de projetos.
- [x] Diferenciar sessão concluída e cancelada.
- [x] Validar agregações com testes.

## Critérios de aceite

- [x] Métricas possuem definição clara.
- [x] Valores correspondem aos dados persistidos.
- [x] Tela funciona sem gráficos quando não há dados.
- [x] Período selecionado aparece na URL.
- [x] Relatório não depende de cálculos no client para ser correto.

## Notas da fase

Registrar aqui as decisões tomadas.

- Relatórios são calculados no servidor por `getReports`, a partir de tarefas e sessões persistidas no PostgreSQL.
- O período usa `startDate` e `endDate` em search params, mantendo a seleção visível na URL.
- Tempo focado é a soma de `focusedDurationSeconds` apenas de sessões `completed` iniciadas no período.
- Sessões `cancelled` são contadas separadamente e não somam tempo focado.
- Tarefas concluídas são contadas por `status = completed` e `completedAt` dentro do período selecionado.
- Foram criados dois gráficos simples em CSS, por dia e por projeto, sem adicionar biblioteca de gráficos.
- O bloqueio de build foi resolvido removendo `next/font/google`, que exigia rede para baixar fontes, e usando `next build --webpack` com worker de Webpack desativado para contornar o panic do Turbopack neste ambiente.
- `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` passaram após a correção.

---

# Fase 9 — Configurações

## Objetivo

Permitir personalizar o ciclo de foco.

## Tarefas

- [x] Criar configurações de duração do foco.
- [x] Criar duração de pausa curta.
- [x] Criar duração de pausa longa.
- [x] Definir limite mínimo e máximo.
- [x] Criar preferência de som.
- [x] Criar preferência de início automático, se entrar no MVP.
- [x] Aplicar configurações apenas a novas sessões.
- [x] Criar página de configurações.
- [x] Validar no cliente e servidor.
- [x] Testar valores inválidos.

## Critérios de aceite

- [x] Configurações persistem.
- [x] Sessão em andamento não muda inesperadamente.
- [x] Novas sessões usam os valores atualizados.
- [x] Valores inválidos são rejeitados.

## Notas da fase

Registrar aqui as decisões tomadas.

- Foi criada a tabela singleton `timer_settings` enquanto não existe autenticação; após usuários, essa configuração deve ser isolada por usuário.
- Durações validadas: foco de 5 a 120 minutos, pausa curta de 1 a 60 minutos e pausa longa de 5 a 120 minutos.
- `soundEnabled` e `autoStartBreak` foram persistidos como preferências simples; não há execução real de som ou pausa automática nesta fase.
- `focus_sessions.plannedDurationSeconds` continua sendo a fonte da duração de uma sessão já iniciada, então mudanças em configurações afetam apenas novas sessões.
- A página `/settings` usa Server Component para carregar dados e um formulário cliente pequeno para feedback de submit.
- Migration `drizzle/0001_fancy_dagger.sql` foi gerada e aplicada no PostgreSQL local.

---

# Fase 10 — Autenticação e isolamento de dados

## Objetivo

Preparar o produto para publicação e múltiplos usuários.

Esta fase deve começar somente após o fluxo principal estar validado.

## Tarefas

- [x] Escolher solução de autenticação.
- [x] Criar tabela de usuários.
- [x] Adicionar `userId` às entidades necessárias.
- [x] Criar migrations de transição.
- [x] Implementar login.
- [x] Implementar logout.
- [x] Proteger rotas.
- [x] Associar registros ao usuário autenticado.
- [x] Remover qualquer `userId` controlado pelo client.
- [x] Garantir autorização em repositories e services.
- [x] Criar testes de isolamento.
- [x] Criar tratamento para dados locais anteriores à autenticação.

## Critérios de aceite

- [x] Usuário não acessa dados de outro usuário.
- [x] Rotas privadas exigem autenticação.
- [x] Toda query sensível possui filtro de usuário.
- [x] Testes validam isolamento de dados.

## Notas da fase

Registrar aqui as decisões tomadas.

- A autenticação inicial é própria e mínima, usando cookies httpOnly e hash de senha com `crypto.scrypt` do Node, sem adicionar dependências.
- Foi criado um usuário local padrão para migrar dados existentes: `local@poplist.dev`. A senha de desenvolvimento é `poplist-local`.
- A migration `drizzle/0002_same_rhodey.sql` cria `users`, `auth_sessions`, adiciona `user_id` às entidades sensíveis e atribui dados existentes ao usuário local.
- Rotas privadas são bloqueadas por `middleware.ts` e pela `ServerAppShell`; `/login` permanece pública.
- Services e repositories sensíveis passaram a filtrar por usuário. Nenhum formulário aceita `userId` vindo do client.
- `timer_settings` deixou de ser singleton global e passou a ter configuração única por usuário.
- O fallback de usuário local existe apenas para testes e execução server-side fora de request; rotas reais continuam protegidas por cookie.
- Foi adicionado teste de isolamento para garantir que um usuário não consulta projetos ou tarefas de outro.

---

# Fase 11 — Qualidade e publicação

## Objetivo

Preparar a aplicação para um ambiente publicado.

## Tarefas

- [x] Configurar Playwright.
- [x] Cobrir fluxo crítico completo.
- [x] Revisar acessibilidade.
- [x] Revisar performance.
- [x] Revisar bundle do client.
- [x] Revisar Server e Client Components.
- [x] Revisar segurança de Server Actions e Route Handlers.
- [x] Configurar variáveis do ambiente de produção.
- [x] Definir estratégia de migrations em deploy.
- [x] Configurar CI.
- [x] Executar lint, typecheck, testes e build no CI.
- [x] Configurar observabilidade mínima.
- [x] Definir política de backup do PostgreSQL.
- [x] Criar checklist de deploy.
- [x] Atualizar documentação.

## Critérios de aceite

- [x] Fluxo crítico passa no E2E.
- [x] CI bloqueia regressões.
- [x] Build de produção funciona.
- [x] Segredos não estão versionados.
- [x] Migrações possuem procedimento seguro.
- [x] Aplicação possui logs suficientes para diagnóstico.

## Notas da fase

Registrar aqui as decisões tomadas.

- Playwright foi configurado com projeto Chromium e banco E2E isolado por execução, evitando tocar nos dados locais de desenvolvimento.
- O fluxo E2E cobre login, criação de projeto, criação de tarefa, planejamento para hoje e início de foco.
- O CI usa PostgreSQL como service, executa migrations, instala Chromium e roda lint, typecheck, testes, build e E2E.
- Foi criado `/api/health` para diagnóstico mínimo da aplicação e conexão com PostgreSQL sem expor detalhes sensíveis.
- A documentação operacional define `DATABASE_URL`, estratégia de migrations, backup, observabilidade e checklist de deploy.
- A revisão de acessibilidade resultou em seletores E2E por roles/labels e correção do script de tema para evitar HTML inválido no root layout.
- A revisão de Server/Client Components manteve Server Components por padrão; o E2E permanece isolado em `tests/e2e` e foi excluído do Vitest.
- A revisão de bundle não identificou dependências client desnecessárias; artefatos finais checados: `.next/static` 1.3M e `.next/server` 2.3M.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` e `pnpm test:e2e` passaram.

---

# Backlog posterior ao MVP

Não iniciar sem decisão explícita:

- [ ] modo offline;
- [ ] PWA;
- [ ] notificações push;
- [ ] integração com Google Calendar;
- [ ] aplicativo mobile;
- [ ] API NestJS separada;
- [ ] colaboração;
- [ ] times;
- [ ] metas semanais;
- [ ] gamificação;
- [ ] billing;
- [ ] exportação;
- [ ] internacionalização;
- [ ] inteligência artificial;
- [ ] integrações externas.
