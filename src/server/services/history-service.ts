import type { HistoryFiltersInput } from "@/features/history/schemas/history-schemas";
import {
  countFocusSessionHistory,
  listFocusSessionHistory,
} from "@/server/repositories/focus-sessions-repository";
import { getServiceUserId } from "@/server/auth/service-user";

const HISTORY_PAGE_SIZE = 10;

function parseLocalDate(value: string, endOfDay = false) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(
    year,
    month - 1,
    day,
    endOfDay ? 23 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 999 : 0,
  );
}

export async function getFocusSessionHistory(filters: HistoryFiltersInput) {
  const userId = await getServiceUserId();
  const page = filters.page ?? 1;
  const queryFilters = {
    userId,
    startDate: filters.startDate
      ? parseLocalDate(filters.startDate)
      : undefined,
    endDate: filters.endDate ? parseLocalDate(filters.endDate, true) : undefined,
    projectId: filters.projectId,
    taskId: filters.taskId,
    limit: HISTORY_PAGE_SIZE,
    offset: (page - 1) * HISTORY_PAGE_SIZE,
  };
  const [items, totalItems] = await Promise.all([
    listFocusSessionHistory(queryFilters),
    countFocusSessionHistory(queryFilters),
  ]);

  return {
    items,
    page,
    pageSize: HISTORY_PAGE_SIZE,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / HISTORY_PAGE_SIZE)),
  };
}
