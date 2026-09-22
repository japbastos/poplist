import { z } from "zod";

export const reportFiltersSchema = z.object({
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .catch(undefined),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .catch(undefined),
});

export type ReportFiltersInput = z.infer<typeof reportFiltersSchema>;

export type ReportSummary = {
  focusedSeconds: number;
  completedSessions: number;
  cancelledSessions: number;
  completedTasks: number;
};

export type ProjectReportRow = {
  projectKey: string;
  projectName: string;
  focusedSeconds: number;
  completedSessions: number;
  cancelledSessions: number;
};

export type DailyReportRow = {
  date: string;
  focusedSeconds: number;
};
