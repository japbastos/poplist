"use client";

import { cancelFocusSessionAction } from "@/features/focus-sessions/actions/focus-session-actions";
import { Button } from "@/components/ui/button";

type CancelFocusSessionFormProps = {
  sessionId: string;
};

export function CancelFocusSessionForm({ sessionId }: CancelFocusSessionFormProps) {
  return (
    <form
      action={cancelFocusSessionAction}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          "Cancelar esta sessão de foco? O tempo focado não será registrado como sessão concluída.",
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={sessionId} />
      <Button type="submit" variant="outline">
        Cancelar
      </Button>
    </form>
  );
}
