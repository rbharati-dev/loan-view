import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "CSV import has been removed. Use the native Add Quote form at /quotes/new.",
    },
    { status: 410 },
  );
}

