"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { focusSessionIdSchema, startFocusSessionSchema } from "@/features/focus-sessions/schemas/focus-session-schemas";
import {
  cancelFocusSession,
  completeFocusSession,
  pauseFocusSession,
  resumeFocusSession,
  startFocusSession,
} from "@/server/services/focus-sessions-service";

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function revalidateFocus() {
  revalidatePath("/focus");
  revalidatePath("/today");
}

export async function startFocusSessionAction(formData: FormData) {
  const parsed = startFocusSessionSchema.safeParse({
    taskId: getStringValue(formData, "taskId"),
  });

  if (!parsed.success) return;
  await startFocusSession(parsed.data.taskId);
  revalidateFocus();
  redirect("/focus?focus=started");
}

async function runSessionAction(
  formData: FormData,
  action: (id: string) => Promise<unknown>,
) {
  const parsed = focusSessionIdSchema.safeParse({
    id: getStringValue(formData, "id"),
  });

  if (!parsed.success) return;
  await action(parsed.data.id);
  revalidateFocus();
}

export async function pauseFocusSessionAction(formData: FormData) {
  await runSessionAction(formData, pauseFocusSession);
}

export async function resumeFocusSessionAction(formData: FormData) {
  await runSessionAction(formData, resumeFocusSession);
}

export async function completeFocusSessionAction(formData: FormData) {
  await runSessionAction(formData, completeFocusSession);
  redirect("/focus?focus=completed");
}

export async function cancelFocusSessionAction(formData: FormData) {
  await runSessionAction(formData, cancelFocusSession);
  redirect("/focus?focus=cancelled");
}
