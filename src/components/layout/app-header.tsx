import { CalendarDays } from "lucide-react";

import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b bg-background/80 px-4 shadow-sm backdrop-blur-sm md:px-6">
      <MobileSidebar />
      <div className="flex-1" />
      <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
        <CalendarDays className="size-4" aria-hidden="true" />
        America/Recife
      </div>
      <ThemeToggle />
    </header>
  );
}
