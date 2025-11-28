import { NextResponse } from "next/server";
import { db } from "@/lib/api/db";
import { operators } from "@/lib/api/db/schema";

export async function GET() {
  try {
    const operatorResults = await db.select().from(operators);

    return NextResponse.json(operatorResults, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
