import { db } from "@/db";
import { loadouts } from "@/db/schema";
import { count, eq } from "drizzle-orm";

export async function getNumLoadouts(user_id: string) {
  const response = await db
    .select({ count: count() })
    .from(loadouts)
    .where(eq(loadouts.user_id, user_id));

  return { count: response[0].count };
}
