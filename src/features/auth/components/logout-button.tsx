import { LogOut } from "lucide-react";

import { logoutAction } from "@/features/auth/actions/auth-actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="outline" size="sm">
        <LogOut className="size-4" aria-hidden="true" />
        Sair
      </Button>
    </form>
  );
}
