import { Timer } from "lucide-react";

import { ServerAppShell } from "@/components/layout/server-app-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { FocusActionFeedback } from "@/features/focus-sessions/components/focus-action-feedback";
import { FocusSessionPanel } from "@/features/focus-sessions/components/focus-session-panel";
import { StartFocusButton } from "@/features/focus-sessions/components/start-focus-button";
import { getActiveFocusSessionDetails } from "@/server/services/focus-sessions-service";
import { listTasks } from "@/server/services/tasks-service";
import { Card, CardContent } from "@/components/ui/card";

type FocusPageProps = {
  searchParams: Promise<{
    focus?: string;
  }>;
};

export default async function FocusPage({ searchParams }: FocusPageProps) {
  const params = await searchParams;
  const [activeSession, tasks] = await Promise.all([
    getActiveFocusSessionDetails(),
    listTasks({ status: "pending" }),
  ]);

  return (
    <ServerAppShell>
      <div className="space-y-6">
        <PageHeader
          title="Foco"
          description="Superfície do Pomodoro persistente, baseada em timestamps e transições validadas no servidor."
        />
        <FocusActionFeedback status={params.focus} />
        {activeSession ? <FocusSessionPanel activeSession={activeSession} /> : null}
        {!activeSession && tasks.length === 0 ? (
          <EmptyState
            icon={Timer}
            title="Nenhuma tarefa disponível para foco"
            description="Crie uma tarefa pendente para iniciar uma sessão de foco."
          />
        ) : null}
        {!activeSession && tasks.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold">{task.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {task.estimatedPomodoros} pomodoro
                      {task.estimatedPomodoros === 1 ? "" : "s"}
                    </p>
                  </div>
                  <StartFocusButton taskId={task.id} />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </ServerAppShell>
  );
}
