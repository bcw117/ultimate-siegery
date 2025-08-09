"use server";
import { db } from "@/db";
import { gadgets, loadouts, operators, weapons } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { gt, eq, asc, and, or, lt, desc, ne } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { redirect } from "next/navigation";

const primaryWeapons = alias(weapons, "primary_weapons");
const secondaryWeapons = alias(weapons, "secondary_weapons");
const LIMIT = 2;

type MetaData = {
  created_at: Date;
  id: number;
};

export async function getLoadouts(cursor: string | null, forward: string) {
  try {
    const { userId: id } = await auth();

    if (!id) {
      redirect("/");
    }

    const entry: MetaData | null = decodeCursor(cursor);

    const whereCondition =
      entry !== null
        ? forward === "true"
          ? and(
              eq(loadouts.user_id, id),
              or(
                gt(loadouts.created_at, entry.created_at),
                and(
                  eq(loadouts.created_at, entry.created_at),
                  gt(loadouts.id, entry.id)
                )
              ),
              ne(loadouts.id, entry.id)
            )
          : and(
              eq(loadouts.user_id, id),
              or(
                lt(loadouts.created_at, entry.created_at),
                and(
                  eq(loadouts.created_at, entry.created_at),
                  lt(loadouts.id, entry.id)
                )
              ),
              ne(loadouts.id, entry.id)
            )
        : eq(loadouts.user_id, id);

    const ordering =
      forward === "true"
        ? [asc(loadouts.created_at), asc(loadouts.id)]
        : [desc(loadouts.created_at), desc(loadouts.id)];

    const data = await db
      .select({
        loadout: {
          loadout_id: loadouts.id,
          loadout_timestamp: loadouts.created_at,
        },
        operator: {
          name: operators.name,
          side: operators.side,
          icon_url: operators.icon_url,
          portrait_url: operators.portrait_url,
        },
        weapons: {
          pweapon_name: primaryWeapons.name,
          sweapon_name: secondaryWeapons.name,
        },
        gadget: gadgets.name,
      })
      .from(loadouts)
      .where(whereCondition)
      .innerJoin(operators, eq(loadouts.operator_id, operators.id))
      .innerJoin(primaryWeapons, eq(loadouts.pweapon_id, primaryWeapons.id))
      .innerJoin(secondaryWeapons, eq(loadouts.sweapon_id, secondaryWeapons.id))
      .innerJoin(gadgets, eq(loadouts.gadget_id, gadgets.id))
      .limit(LIMIT + 1)
      .orderBy(...ordering);

    if (data.length == 0) {
      return {
        loadouts: [],
        prev_cursor: null,
        next_cursor: null,
      };
    }

    const hasMore = data.length > LIMIT;
    const results = data.slice(0, LIMIT);

    if (forward !== "true") {
      results.reverse();
    }

    const hasNextPage = forward === "true" ? hasMore : cursor !== null;
    const hasPrevPage = forward === "true" ? cursor !== null : hasMore;

    const prev_cursor = hasPrevPage
      ? encodeCursor({
          created_at: results[0].loadout.loadout_timestamp,
          id: results[0].loadout.loadout_id,
        })
      : null;

    const next_cursor = hasNextPage
      ? encodeCursor({
          created_at: results[results.length - 1].loadout.loadout_timestamp,
          id: results[results.length - 1].loadout.loadout_id,
        })
      : null;

    return {
      loadouts: results,
      prev_cursor,
      next_cursor,
    };
  } catch (e) {
    throw e;
  }
}

function encodeCursor(data: { created_at: Date; id: number }) {
  const json = JSON.stringify(data);
  return Buffer.from(json, "utf8").toString("base64url");
}

function decodeCursor(cursor: string | null): MetaData | null {
  if (!cursor) return null;
  try {
    const json = Buffer.from(cursor, "base64url").toString("utf8");
    const parsed = JSON.parse(json) as { created_at: string; id: number };
    return {
      created_at: new Date(parsed.created_at),
      id: parsed.id,
    };
  } catch {
    return null;
  }
}
