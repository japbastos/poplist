import Link from "next/link";
import { ArrowRight, Clock3, ListChecks, Timer } from "lucide-react";

import { ServerAppShell } from "@/components/layout/server-app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <ServerAppShell>
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <PageHeader
            title="Planeje o dia sem perder o foco"
            description="Poplist nasce como uma aplicação local para organizar projetos, tarefas e sessões de foco, com base preparada para PostgreSQL e evolução por fases."
            actions={
              <>
                <Button asChild>
                  <Link href="/today">
                    Começar por Hoje
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/focus">Abrir Foco</Link>
                </Button>
              </>
            }
          />

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-4 text-card-foreground">
              <p className="text-sm text-muted-foreground">Banco</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                PostgreSQL
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 text-card-foreground">
              <p className="text-sm text-muted-foreground">Runtime</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                Node 24
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 text-card-foreground">
              <p className="text-sm text-muted-foreground">UI</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">
                shadcn
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          {[
            {
              title: "Planejamento diário",
              description: "A página Hoje será o centro operacional do produto.",
              icon: ListChecks,
            },
            {
              title: "Pomodoro confiável",
              description: "O timer será derivado de timestamps persistidos.",
              icon: Timer,
            },
            {
              title: "Tempo acompanhado",
              description: "Relatórios virão depois do fluxo central validado.",
              icon: Clock3,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-lg border bg-card p-4 text-card-foreground"
              >
                <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
                <h2 className="mt-3 text-base font-semibold">{item.title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </ServerAppShell>
  );
}
