import type {
  CreateTrackerInput,
  UpsertTrackerEntryInput,
} from "@/features/trackers/schemas/tracker-schemas";
import { getServiceUserId } from "@/server/auth/service-user";
import {
  archiveTrackerById,
  createTracker as insertTracker,
  getTrackerById,
  listActiveTrackers,
  listTrackerEntriesByDate,
  upsertTrackerEntry as upsertEntry,
} from "@/server/repositories/trackers-repository";

export async function createTracker(input: CreateTrackerInput) {
  const userId = await getServiceUserId();

  return insertTracker({
    userId,
    name: input.name,
    description: input.description,
    type: input.type,
    targetValue: input.targetValue,
  });
}

export async function archiveTracker(id: string) {
  const userId = await getServiceUserId();
  const tracker = await archiveTrackerById(id, userId);

  if (!tracker) {
    throw new Error("Tracker não encontrado.");
  }

  return tracker;
}

export async function getTrackersForDate(entryDate: string) {
  const userId = await getServiceUserId();
  const [trackers, entries] = await Promise.all([
    listActiveTrackers(userId),
    listTrackerEntriesByDate(entryDate, userId),
  ]);
  const entriesByTrackerId = new Map(
    entries.map((entry) => [entry.trackerId, entry]),
  );

  return trackers.map((tracker) => ({
    tracker,
    entry: entriesByTrackerId.get(tracker.id) ?? null,
  }));
}

export async function upsertTrackerEntry(input: UpsertTrackerEntryInput) {
  const userId = await getServiceUserId();
  const tracker = await getTrackerById(input.trackerId, userId);

  if (!tracker || tracker.status !== "active") {
    throw new Error("Tracker não encontrado ou arquivado.");
  }

  if (tracker.type === "boolean" && input.value > 1) {
    throw new Error("Trackers de feito/não feito aceitam apenas 0 ou 1.");
  }

  if (tracker.type === "scale" && (input.value < 1 || input.value > 5)) {
    throw new Error("Trackers de escala aceitam valores entre 1 e 5.");
  }

  return upsertEntry({
    userId,
    trackerId: tracker.id,
    entryDate: input.entryDate,
    value: input.value,
    note: input.note,
  });
}
