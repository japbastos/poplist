import type { getActiveFocusSessionDetails } from "@/server/services/focus-sessions-service";
import { FocusTimer } from "@/features/focus-sessions/components/focus-timer";
import { FocusSessionControls } from "@/features/focus-sessions/components/focus-session-controls";
import { Badge } from "@/components/ui/badge";

type ActiveSession = NonNullable<
  Awaited<ReturnType<typeof getActiveFocusSessionDetails>>
>;

type FocusSessionPanelProps = {
  activeSession: ActiveSession;
};

export function FocusSessionPanel({ activeSession }: FocusSessionPanelProps) {
  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <div className="rounded-lg border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Tarefa em foco</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              {activeSession.task.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {activeSession.project?.name ?? "Sem projeto"}
            </p>
          </div>
          <Badge>{activeSession.session.status}</Badge>
        </div>
      </div>
      <FocusTimer
        expectedEndAt={activeSession.session.expectedEndAt}
        status={activeSession.session.status}
      />
      <FocusSessionControls session={activeSession.session} />
    </section>
  );
}
