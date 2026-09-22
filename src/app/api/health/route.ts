import { NextResponse } from "next/server";

import { db } from "@/server/db/client";

export async function GET() {
  try {
    await db.execute("select 1");

    return NextResponse.json({
      status: "ok",
      database: "ok",
    });
  } catch {
    return NextResponse.json(
      {
        status: "error",
        database: "unavailable",
      },
      { status: 503 },
    );
  }
}
