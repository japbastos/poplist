import { and, asc, eq } from "drizzle-orm";

import { db } from "@/server/db/client";
import {
  trackerEntries,
  trackers,
  type NewTracker,
  type NewTrackerEntry,
} from "@/server/db/schema";

export async function createTracker(values: NewTracker) {
  const [tracker] = await db.insert(trackers).values(values).returning();

  return tracker;
}

export async function listActiveTrackers(userId: string) {
  return db
    .select()
    .from(trackers)
    .where(and(eq(trackers.userId, userId), eq(trackers.status, "active")))
    .orderBy(asc(trackers.createdAt));
}

export async function getTrackerById(id: string, userId: string) {
  const [tracker] = await db
    .select()
    .from(trackers)
    .where(and(eq(trackers.id, id), eq(trackers.userId, userId)))
    .limit(1);

  return tracker ?? null;
}

export async function archiveTrackerById(id: string, userId: string) {
  const [tracker] = await db
    .update(trackers)
    .set({
      status: "archived",
      archivedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(trackers.id, id), eq(trackers.userId, userId)))
    .returning();

  return tracker ?? null;
}

export async function listTrackerEntriesByDate(entryDate: string, userId: string) {
  return db
    .select()
    .from(trackerEntries)
    .where(
      and(
        eq(trackerEntries.entryDate, entryDate),
        eq(trackerEntries.userId, userId),
      ),
    );
}

export async function upsertTrackerEntry(values: NewTrackerEntry) {
  const [entry] = await db
    .insert(trackerEntries)
    .values(values)
    .onConflictDoUpdate({
      target: [trackerEntries.trackerId, trackerEntries.entryDate],
      set: {
        value: values.value,
        note: values.note,
        updatedAt: new Date(),
      },
    })
    .returning();

  return entry;
}
