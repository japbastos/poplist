"use client";

import { RotateCcw } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { RecoverableError } from "@/components/shared/recoverable-error";
import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <AppShell>
      <RecoverableError
        title="Não foi possível carregar esta tela"
        description="Tente novamente. Se o problema persistir, o erro precisa ser investigado no fluxo correspondente."
        action={
          <Button type="button" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Tentar novamente
          </Button>
        }
      />
    </AppShell>
  );
}
