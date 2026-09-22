import { execFile } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { promisify } from "node:util";
import postgres from "postgres";

const execFileAsync = promisify(execFile);

function loadEnvFile() {
  if (!existsSync(".env")) {
    return;
  }

  const envFile = readFileSync(".env", "utf8");

  for (const line of envFile.split("\n")) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex);
    const value = trimmedLine.slice(separatorIndex + 1);

    process.env[key] ??= value;
  }
}

function getTestDatabaseUrl() {
  if (process.env.TEST_DATABASE_URL) {
    return process.env.TEST_DATABASE_URL;
  }

  if (process.env.DATABASE_URL) {
    const databaseUrl = new URL(process.env.DATABASE_URL);
    databaseUrl.pathname = "/poplist_test";

    return databaseUrl.toString();
  }

  return "postgres://poplist:poplist@localhost:5432/poplist_test";
}

export default async function globalSetup() {
  loadEnvFile();

  const databaseUrl = new URL(getTestDatabaseUrl());
  const databaseName = databaseUrl.pathname.replace("/", "");

  if (!databaseName.endsWith("_test") && !databaseName.includes("_test_")) {
    throw new Error(
      `Banco "${databaseName}" não parece ser de teste. Use TEST_DATABASE_URL com um banco *_test.`,
    );
  }

  const adminUrl = new URL(databaseUrl);
  adminUrl.pathname = "/postgres";

  const sql = postgres(adminUrl.toString(), { max: 1 });
  const existingDatabase = await sql`
    select 1
    from pg_database
    where datname = ${databaseName}
  `;

  if (existingDatabase.length === 0) {
    await sql.unsafe(`create database "${databaseName.replaceAll('"', '""')}"`);
  }

  await sql.end();

  process.env.DATABASE_URL = databaseUrl.toString();
  await execFileAsync("pnpm", ["db:migrate"], {
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl.toString(),
    },
  });
}
