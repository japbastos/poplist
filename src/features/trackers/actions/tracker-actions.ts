"use server";

import { revalidatePath } from "next/cache";

import type { TrackerActionState } from "@/features/trackers/actions/tracker-action-state";
import {
  createTrackerSchema,
  trackerIdSchema,
  upsertTrackerEntrySchema,
} from "@/features/trackers/schemas/tracker-schemas";
import {
  archiveTracker,
  createTracker,
  upsertTrackerEntry,
} from "@/server/services/trackers-service";

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export async function createTrackerAction(
  _prevState: TrackerActionState,
  formData: FormData,
): Promise<TrackerActionState> {
  const parsed = createTrackerSchema.safeParse({
    name: getStringValue(formData, "name"),
    description: getStringValue(formData, "description"),
    type: getStringValue(formData, "type"),
    targetValue: getStringValue(formData, "targetValue"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revise os campos do tracker.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createTracker(parsed.data);
    revalidatePath("/trackers");

    return {
      status: "success",
      message: "Tracker criado.",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Não foi possível criar.",
    };
  }
}

export async function upsertTrackerEntryAction(
  _prevState: TrackerActionState,
  formData: FormData,
): Promise<TrackerActionState> {
  const parsed = upsertTrackerEntrySchema.safeParse({
    trackerId: getStringValue(formData, "trackerId"),
    entryDate: getStringValue(formData, "entryDate"),
    value: getStringValue(formData, "value"),
    note: getStringValue(formData, "note"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revise o registro.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await upsertTrackerEntry(parsed.data);
    revalidatePath("/trackers");

    return {
      status: "success",
      message: "Registro salvo.",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Não foi possível salvar.",
    };
  }
}

export async function archiveTrackerAction(formData: FormData) {
  const parsed = trackerIdSchema.safeParse({
    id: getStringValue(formData, "id"),
  });

  if (!parsed.success) {
    return;
  }

  await archiveTracker(parsed.data.id);
  revalidatePath("/trackers");
}
