import {
  completeFocusSessionAction,
  pauseFocusSessionAction,
  resumeFocusSessionAction,
} from "@/features/focus-sessions/actions/focus-session-actions";
import type { FocusSession } from "@/server/db/schema";
import { Button } from "@/components/ui/button";
import { CancelFocusSessionForm } from "@/features/focus-sessions/components/cancel-focus-session-form";

type FocusSessionControlsProps = {
  session: FocusSession;
};

export function FocusSessionControls({ session }: FocusSessionControlsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {session.status === "active" ? (
        <form action={pauseFocusSessionAction}>
          <input type="hidden" name="id" value={session.id} />
          <Button type="submit" variant="outline">Pausar</Button>
        </form>
      ) : null}
      {session.status === "paused" ? (
        <form action={resumeFocusSessionAction}>
          <input type="hidden" name="id" value={session.id} />
          <Button type="submit">Retomar</Button>
        </form>
      ) : null}
      <form action={completeFocusSessionAction}>
        <input type="hidden" name="id" value={session.id} />
        <Button type="submit">Concluir</Button>
      </form>
      <CancelFocusSessionForm sessionId={session.id} />
    </div>
  );
}
