import { sql } from "drizzle-orm";

import { db } from "@/server/db/client";

function assertTestDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL não configurada para testes.");
  }

  const databaseName = new URL(databaseUrl).pathname.replace("/", "");

  if (!databaseName.endsWith("_test") && !databaseName.includes("_test_")) {
    throw new Error(
      `Banco "${databaseName}" não parece ser de teste. Use TEST_DATABASE_URL com um banco *_test.`,
    );
  }
}

export async function truncateTestDatabase() {
  assertTestDatabaseUrl();

  await db.execute(sql`
    truncate table
      "auth_sessions",
      "daily_plan_items",
      "focus_sessions",
      "projects",
      "tasks",
      "timer_settings",
      "tracker_entries",
      "trackers",
      "users"
    restart identity cascade
  `);
}
