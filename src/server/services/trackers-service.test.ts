import { beforeEach, describe, expect, it } from "vitest";

import { truncateTestDatabase } from "@/test/database";
import {
  archiveTracker,
  createTracker,
  getTrackersForDate,
  upsertTrackerEntry,
} from "@/server/services/trackers-service";

beforeEach(async () => {
  await truncateTestDatabase();
});

describe("trackers service", () => {
  it("cria tracker e registra entrada por data", async () => {
    const tracker = await createTracker({
      name: "Candidaturas enviadas",
      description: "Vagas aplicadas no dia",
      type: "number",
      targetValue: 5,
    });

    await upsertTrackerEntry({
      trackerId: tracker.id,
      entryDate: "2026-08-07",
      value: 3,
      note: "Boas vagas",
    });

    await expect(getTrackersForDate("2026-08-07")).resolves.toMatchObject([
      {
        tracker: {
          id: tracker.id,
          name: "Candidaturas enviadas",
        },
        entry: {
          value: 3,
          note: "Boas vagas",
        },
      },
    ]);
  });

  it("atualiza entrada existente para o mesmo tracker e data", async () => {
    const tracker = await createTracker({
      name: "Recrutadores contatados",
      description: null,
      type: "number",
      targetValue: 3,
    });

    await upsertTrackerEntry({
      trackerId: tracker.id,
      entryDate: "2026-08-07",
      value: 1,
      note: null,
    });
    await upsertTrackerEntry({
      trackerId: tracker.id,
      entryDate: "2026-08-07",
      value: 4,
      note: "Inclui follow-ups",
    });

    const trackers = await getTrackersForDate("2026-08-07");

    expect(trackers).toHaveLength(1);
    expect(trackers[0]?.entry).toMatchObject({
      value: 4,
      note: "Inclui follow-ups",
    });
  });

  it("aplica regras por tipo e arquivamento", async () => {
    const booleanTracker = await createTracker({
      name: "Revisou LinkedIn",
      description: null,
      type: "boolean",
      targetValue: null,
    });
    const scaleTracker = await createTracker({
      name: "Qualidade do networking",
      description: null,
      type: "scale",
      targetValue: 4,
    });

    await expect(
      upsertTrackerEntry({
        trackerId: booleanTracker.id,
        entryDate: "2026-08-07",
        value: 2,
        note: null,
      }),
    ).rejects.toThrow("aceitam apenas 0 ou 1");

    await expect(
      upsertTrackerEntry({
        trackerId: scaleTracker.id,
        entryDate: "2026-08-07",
        value: 6,
        note: null,
      }),
    ).rejects.toThrow("valores entre 1 e 5");

    await archiveTracker(scaleTracker.id);
    await expect(getTrackersForDate("2026-08-07")).resolves.toHaveLength(1);
  });
});
