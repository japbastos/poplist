import { relations, sql } from "drizzle-orm";
import {
  check,
  date,
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const projectStatusEnum = pgEnum("project_status", [
  "active",
  "archived",
]);

export const taskStatusEnum = pgEnum("task_status", [
  "pending",
  "in_progress",
  "completed",
  "cancelled",
]);

export const taskPriorityEnum = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
]);

export const focusSessionStatusEnum = pgEnum("focus_session_status", [
  "active",
  "paused",
  "completed",
  "cancelled",
]);

export const trackerTypeEnum = pgEnum("tracker_type", [
  "boolean",
  "number",
  "scale",
]);

export const trackerStatusEnum = pgEnum("tracker_status", [
  "active",
  "archived",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
};

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("users_email_unique").on(table.email)],
);

export const authSessions = pgTable(
  "auth_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("auth_sessions_token_hash_unique").on(table.tokenHash),
    index("auth_sessions_user_id_idx").on(table.userId),
    index("auth_sessions_expires_at_idx").on(table.expiresAt),
  ],
);

export const timerSettings = pgTable(
  "timer_settings",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    focusDurationMinutes: integer("focus_duration_minutes")
      .notNull()
      .default(25),
    shortBreakMinutes: integer("short_break_minutes").notNull().default(5),
    longBreakMinutes: integer("long_break_minutes").notNull().default(15),
    soundEnabled: boolean("sound_enabled").notNull().default(true),
    autoStartBreak: boolean("auto_start_break").notNull().default(false),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("timer_settings_user_id_unique").on(table.userId),
    check(
      "timer_settings_focus_duration_range",
      sql`${table.focusDurationMinutes} between 5 and 120`,
    ),
    check(
      "timer_settings_short_break_range",
      sql`${table.shortBreakMinutes} between 1 and 60`,
    ),
    check(
      "timer_settings_long_break_range",
      sql`${table.longBreakMinutes} between 5 and 120`,
    ),
  ],
);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    color: text("color"),
    status: projectStatusEnum("status").notNull().default("active"),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    index("projects_user_id_idx").on(table.userId),
    index("projects_status_idx").on(table.status),
  ],
);

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    description: text("description"),
    status: taskStatusEnum("status").notNull().default("pending"),
    priority: taskPriorityEnum("priority").notNull().default("medium"),
    estimatedPomodoros: integer("estimated_pomodoros").notNull().default(1),
    dueDate: date("due_date"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    index("tasks_project_id_idx").on(table.projectId),
    index("tasks_user_id_idx").on(table.userId),
    index("tasks_status_idx").on(table.status),
    index("tasks_due_date_idx").on(table.dueDate),
    check(
      "tasks_estimated_pomodoros_positive",
      sql`${table.estimatedPomodoros} > 0`,
    ),
  ],
);

export const dailyPlanItems = pgTable(
  "daily_plan_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    taskId: uuid("task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    planDate: date("plan_date").notNull(),
    position: integer("position").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("daily_plan_items_task_date_unique").on(
      table.taskId,
      table.planDate,
    ),
    uniqueIndex("daily_plan_items_date_position_unique").on(
      table.planDate,
      table.position,
    ),
    index("daily_plan_items_user_id_idx").on(table.userId),
    index("daily_plan_items_plan_date_idx").on(table.planDate),
    check("daily_plan_items_position_non_negative", sql`${table.position} >= 0`),
  ],
);

export const focusSessions = pgTable(
  "focus_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    taskId: uuid("task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "restrict" }),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    status: focusSessionStatusEnum("status").notNull().default("active"),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
    expectedEndAt: timestamp("expected_end_at", { withTimezone: true }).notNull(),
    pausedAt: timestamp("paused_at", { withTimezone: true }),
    resumedAt: timestamp("resumed_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    accumulatedPauseSeconds: integer("accumulated_pause_seconds")
      .notNull()
      .default(0),
    plannedDurationSeconds: integer("planned_duration_seconds").notNull(),
    focusedDurationSeconds: integer("focused_duration_seconds"),
    ...timestamps,
  },
  (table) => [
    index("focus_sessions_task_id_idx").on(table.taskId),
    index("focus_sessions_user_id_idx").on(table.userId),
    index("focus_sessions_project_id_idx").on(table.projectId),
    index("focus_sessions_status_idx").on(table.status),
    uniqueIndex("focus_sessions_single_active_unique")
      .on(sql`(true)`)
      .where(sql`${table.status} in ('active', 'paused')`),
    check(
      "focus_sessions_planned_duration_positive",
      sql`${table.plannedDurationSeconds} > 0`,
    ),
    check(
      "focus_sessions_pause_duration_non_negative",
      sql`${table.accumulatedPauseSeconds} >= 0`,
    ),
  ],
);

export const trackers = pgTable(
  "trackers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    type: trackerTypeEnum("type").notNull(),
    targetValue: integer("target_value"),
    status: trackerStatusEnum("status").notNull().default("active"),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    index("trackers_user_id_idx").on(table.userId),
    index("trackers_status_idx").on(table.status),
    check(
      "trackers_target_value_positive",
      sql`${table.targetValue} is null or ${table.targetValue} > 0`,
    ),
  ],
);

export const trackerEntries = pgTable(
  "tracker_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    trackerId: uuid("tracker_id")
      .notNull()
      .references(() => trackers.id, { onDelete: "cascade" }),
    entryDate: date("entry_date").notNull(),
    value: integer("value").notNull(),
    note: text("note"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("tracker_entries_tracker_date_unique").on(
      table.trackerId,
      table.entryDate,
    ),
    index("tracker_entries_user_id_idx").on(table.userId),
    index("tracker_entries_entry_date_idx").on(table.entryDate),
    check("tracker_entries_value_non_negative", sql`${table.value} >= 0`),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  authSessions: many(authSessions),
  projects: many(projects),
  tasks: many(tasks),
  focusSessions: many(focusSessions),
  trackers: many(trackers),
  trackerEntries: many(trackerEntries),
}));

export const authSessionsRelations = relations(authSessions, ({ one }) => ({
  user: one(users, {
    fields: [authSessions.userId],
    references: [users.id],
  }),
}));

export const projectsRelations = relations(projects, ({ many, one }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  tasks: many(tasks),
  focusSessions: many(focusSessions),
}));

export const tasksRelations = relations(tasks, ({ many, one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  dailyPlanItems: many(dailyPlanItems),
  focusSessions: many(focusSessions),
}));

export const dailyPlanItemsRelations = relations(dailyPlanItems, ({ one }) => ({
  task: one(tasks, {
    fields: [dailyPlanItems.taskId],
    references: [tasks.id],
  }),
}));

export const focusSessionsRelations = relations(focusSessions, ({ one }) => ({
  user: one(users, {
    fields: [focusSessions.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [focusSessions.taskId],
    references: [tasks.id],
  }),
  project: one(projects, {
    fields: [focusSessions.projectId],
    references: [projects.id],
  }),
}));

export const trackersRelations = relations(trackers, ({ many, one }) => ({
  user: one(users, {
    fields: [trackers.userId],
    references: [users.id],
  }),
  entries: many(trackerEntries),
}));

export const trackerEntriesRelations = relations(trackerEntries, ({ one }) => ({
  user: one(users, {
    fields: [trackerEntries.userId],
    references: [users.id],
  }),
  tracker: one(trackers, {
    fields: [trackerEntries.trackerId],
    references: [trackers.id],
  }),
}));

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type AuthSession = typeof authSessions.$inferSelect;
export type NewAuthSession = typeof authSessions.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type DailyPlanItem = typeof dailyPlanItems.$inferSelect;
export type NewDailyPlanItem = typeof dailyPlanItems.$inferInsert;
export type FocusSession = typeof focusSessions.$inferSelect;
export type NewFocusSession = typeof focusSessions.$inferInsert;
export type TimerSettings = typeof timerSettings.$inferSelect;
export type NewTimerSettings = typeof timerSettings.$inferInsert;
export type Tracker = typeof trackers.$inferSelect;
export type NewTracker = typeof trackers.$inferInsert;
export type TrackerEntry = typeof trackerEntries.$inferSelect;
export type NewTrackerEntry = typeof trackerEntries.$inferInsert;
