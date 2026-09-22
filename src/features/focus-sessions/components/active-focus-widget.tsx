import Link from "next/link";

import type { getActiveFocusSessionDetails } from "@/server/services/focus-sessions-service";
import { FocusTimer } from "@/features/focus-sessions/components/focus-timer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ActiveSession = NonNullable<
  Awaited<ReturnType<typeof getActiveFocusSessionDetails>>
>;

type ActiveFocusWidgetProps = {
  activeSession: ActiveSession;
};

export function ActiveFocusWidget({ activeSession }: ActiveFocusWidgetProps) {
  return (
    <aside className="border-b bg-card/80 px-4 py-3 backdrop-blur-sm md:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{activeSession.session.status}</Badge>
            <p className="truncate text-sm font-medium">
              {activeSession.task.title}
            </p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeSession.project?.name ?? "Sem projeto"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32">
            <FocusTimer
              expectedEndAt={activeSession.session.expectedEndAt}
              status={activeSession.session.status}
              compact
            />
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/focus">Abrir foco</Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}
