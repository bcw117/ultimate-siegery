import { getUser } from "@/utils/supabase/server";
import { db } from "@/db";
import { gadgets, loadouts, operators, weapons } from "@/db/schema";
import { gt, eq, asc, and, or, ne } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

const primaryWeapons = alias(weapons, "primary_weapons");
const secondaryWeapons = alias(weapons, "secondary_weapons");

type Entry = {
  created_at: Date;
  id: number;
};

export async function getLoadouts(cursor: string | null, limit: string) {
  const user = await getUser();

  if (!user) {
    throw Error;
  }

  const id = user.id;

  let entry: Entry | null = null;
  if (cursor) {
    entry = decode_cursor(cursor);
  }

  const whereCondition =
    entry !== null
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
      : eq(loadouts.user_id, id);

  const results = await db
    .select({
      loadout: {
        loadout_id: loadouts.id,
        loadout_timestamp: loadouts.created_at,
      },
      operator: {
        name: operators.name,
        side: operators.side,
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
    .limit(parseInt(limit))
    .orderBy(asc(loadouts.created_at), asc(loadouts.id));

  if (!results) {
    return {
      loadouts: [],
      cursor: null,
    };
  }

  const new_cursor = btoa(JSON.stringify(results[results.length - 1].loadout));

  return {
    loadouts: results,
    new_cursor: new_cursor,
  };
}

function decode_cursor(cursor: string) {
  const last_entry = atob(cursor);
  const { loadout_id, loadout_timestamp } = JSON.parse(last_entry);
  const created_at = new Date(Date.parse(loadout_timestamp));

  return { created_at, id: loadout_id } as Entry;
}
