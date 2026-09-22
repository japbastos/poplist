import "@testing-library/jest-dom/vitest";

import { existsSync, readFileSync } from "node:fs";

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

if (existsSync(".env")) {
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

process.env.DATABASE_URL = getTestDatabaseUrl();
