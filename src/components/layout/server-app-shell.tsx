import type { ReactNode } from "react";

import { connection } from "next/server";

import { AppShell } from "@/components/layout/app-shell";
import { ActiveFocusWidget } from "@/features/focus-sessions/components/active-focus-widget";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { requireCurrentUser } from "@/server/auth/session";
import { getActiveFocusSessionDetails } from "@/server/services/focus-sessions-service";

type ServerAppShellProps = {
  children: ReactNode;
};

export async function ServerAppShell({ children }: ServerAppShellProps) {
  await connection();
  await requireCurrentUser();
  const activeSession = await getActiveFocusSessionDetails();

  return (
    <AppShell
      focusWidget={
        activeSession ? <ActiveFocusWidget activeSession={activeSession} /> : null
      }
    >
      <div className="mb-4 flex justify-end">
        <LogoutButton />
      </div>
      {children}
    </AppShell>
  );
}
