import Link from "next/link";

import { ServerAppShell } from "@/components/layout/server-app-shell";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <ServerAppShell>
      <section className="mx-auto flex min-h-96 max-w-xl flex-col items-center justify-center text-center">
        <p className="text-sm font-medium text-brand-secondary">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Página não encontrada
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          A rota acessada não existe no shell atual da aplicação.
        </p>
        <Button asChild className="mt-6">
          <Link href="/today">Voltar para Hoje</Link>
        </Button>
      </section>
    </ServerAppShell>
  );
}
