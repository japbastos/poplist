"use client";

import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type DestructiveConfirmationProps = {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  trigger: ReactNode;
};

export function DestructiveConfirmation({
  title,
  description,
  confirmLabel,
  onConfirm,
  trigger,
}: DestructiveConfirmationProps) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-card p-4 text-card-foreground">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 size-5 text-destructive" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {trigger}
            <Button type="button" variant="outline" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
