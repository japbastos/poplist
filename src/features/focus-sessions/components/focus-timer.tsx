"use client";

import { useEffect, useMemo, useState } from "react";

type FocusTimerProps = {
  expectedEndAt: Date;
  status: "active" | "paused" | "completed" | "cancelled";
  compact?: boolean;
};

function formatSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function FocusTimer({ expectedEndAt, status, compact }: FocusTimerProps) {
  const expectedEndTime = useMemo(
    () => expectedEndAt.getTime(),
    [expectedEndAt],
  );
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (status !== "active") {
      return;
    }

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [status]);

  const remainingSeconds =
    status === "active" || status === "paused"
      ? Math.max(0, Math.ceil((expectedEndTime - now) / 1000))
      : 0;

  return (
    <div className={compact ? "text-right" : "rounded-lg border bg-card p-6 text-center"}>
      <p className="text-sm text-muted-foreground">
        {compact ? "Restante" : "Tempo restante"}
      </p>
      <p className={compact ? "font-mono text-2xl font-semibold" : "mt-2 font-mono text-6xl font-semibold tracking-tight"}>
        {formatSeconds(remainingSeconds)}
      </p>
      {!compact ? (
        <p className="mt-2 text-sm text-muted-foreground">
          {status === "paused" ? "Sessão pausada" : "Calculado por timestamp"}
        </p>
      ) : null}
    </div>
  );
}
