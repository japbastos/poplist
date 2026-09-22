import type { ReactNode } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";

type AppShellProps = {
  children: ReactNode;
  focusWidget?: ReactNode;
};

export function AppShell({ children, focusWidget }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="fixed inset-y-0 left-0 hidden md:block">
        <AppSidebar />
      </div>
      <div className="flex min-h-dvh flex-col md:pl-64">
        <div className="flex h-14 items-center border-b px-4 md:hidden">
          <MobileSidebar />
        </div>
        {focusWidget}
        <main className="mx-auto flex w-full max-w-7xl flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
