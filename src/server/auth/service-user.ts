import "server-only";

import { getCurrentUser } from "@/server/auth/session";
import { ensureLocalUser } from "@/server/services/auth-service";

export async function getServiceUserId() {
  let currentUser = null;

  try {
    currentUser = await getCurrentUser();
  } catch {
    currentUser = null;
  }

  if (currentUser) {
    return currentUser.id;
  }

  const localUser = await ensureLocalUser();

  return localUser.id;
}
