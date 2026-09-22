import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

type RecoverableErrorProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function RecoverableError({
  title,
  description,
  action,
}: RecoverableErrorProps) {
  return (
    <section className="rounded-lg border border-destructive/30 bg-card p-6 text-card-foreground">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 size-5 text-destructive" aria-hidden="true" />
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
          {action ? <div className="mt-4">{action}</div> : null}
        </div>
      </div>
    </section>
  );
}
