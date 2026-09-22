import { eq } from "drizzle-orm";

import { db } from "@/server/db/client";
import {
  timerSettings,
  type NewTimerSettings,
} from "@/server/db/schema";

export async function getTimerSettingsRecord(userId: string) {
  const [settings] = await db
    .select()
    .from(timerSettings)
    .where(eq(timerSettings.userId, userId))
    .limit(1);

  return settings ?? null;
}

export async function upsertTimerSettingsRecord(
  userId: string,
  values: Omit<NewTimerSettings, "id" | "userId">,
) {
  const [settings] = await db
    .insert(timerSettings)
    .values({ userId, ...values })
    .onConflictDoUpdate({
      target: timerSettings.userId,
      set: {
        ...values,
        updatedAt: new Date(),
      },
    })
    .returning();

  return settings;
}
