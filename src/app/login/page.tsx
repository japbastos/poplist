import { connection } from "next/server";
import { redirect } from "next/navigation";

import { LoginForm } from "@/features/auth/components/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/server/auth/session";
import { ensureLocalUser } from "@/server/services/auth-service";

export default async function LoginPage() {
  await connection();
  await ensureLocalUser();

  const user = await getCurrentUser();

  if (user) {
    redirect("/today");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Entrar no Poplist</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
