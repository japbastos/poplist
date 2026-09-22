"use server";

import { redirect } from "next/navigation";

import type { LoginActionState } from "@/features/auth/actions/auth-action-state";
import { loginSchema } from "@/features/auth/schemas/auth-schemas";
import { createSessionCookie, destroyCurrentSession } from "@/server/auth/session";
import { authenticateUser } from "@/server/services/auth-service";

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse({
    email: getStringValue(formData, "email"),
    password: getStringValue(formData, "password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revise os campos de login.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await authenticateUser(parsed.data);
    await createSessionCookie(user.id);
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Não foi possível entrar.",
    };
  }

  redirect("/today");
}

export async function logoutAction() {
  await destroyCurrentSession();
  redirect("/login");
}
