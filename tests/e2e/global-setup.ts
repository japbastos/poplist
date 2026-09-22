import { execFile } from "node:child_process";
import { promisify } from "node:util";
import postgres from "postgres";

const execFileAsync = promisify(execFile);

function getE2eDatabaseUrl() {
  return (
    process.env.E2E_DATABASE_URL ??
    process.env.DATABASE_URL ??
    "postgres://poplist:poplist@localhost:5432/poplist_e2e"
  );
}

export default async function globalSetup() {
  const databaseUrl = new URL(getE2eDatabaseUrl());
  const databaseName = databaseUrl.pathname.replace("/", "");
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

  await execFileAsync("pnpm", ["db:migrate"], {
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl.toString(),
    },
  });
}
