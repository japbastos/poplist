import { Play } from "lucide-react";

import { startFocusSessionAction } from "@/features/focus-sessions/actions/focus-session-actions";
import { Button } from "@/components/ui/button";

type StartFocusButtonProps = {
  taskId: string;
  disabled?: boolean;
};

export function StartFocusButton({ taskId, disabled }: StartFocusButtonProps) {
  return (
    <form action={startFocusSessionAction}>
      <input type="hidden" name="taskId" value={taskId} />
      <Button type="submit" variant="outline" size="sm" disabled={disabled}>
        <Play className="size-4" aria-hidden="true" />
        Iniciar foco
      </Button>
    </form>
  );
}
