"use client";

import { useEffect } from "react";
import { toast } from "sonner";

type FocusActionFeedbackProps = {
  status?: string;
};

export function FocusActionFeedback({ status }: FocusActionFeedbackProps) {
  useEffect(() => {
    if (status === "completed") {
      toast.success("Sessão de foco concluída.");
    }

    if (status === "cancelled") {
      toast.message("Sessão de foco cancelada.");
    }

    if (status === "started") {
      toast.success("Sessão de foco iniciada.");
    }
  }, [status]);

  return null;
}
