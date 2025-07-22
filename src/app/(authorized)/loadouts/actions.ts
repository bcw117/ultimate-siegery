"use server";
import { db } from "@/db";
import { gadgets, loadouts, operators, weapons } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/utils/supabaseClient";
import { gt, eq, asc, and, or, ne, lt } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { redirect } from "next/navigation";

const primaryWeapons = alias(weapons, "primary_weapons");
const secondaryWeapons = alias(weapons, "secondary_weapons");
const LIMIT = 10;

type Entry = {
  created_at: Date;
  id: number;
};

export async function getLoadouts(cursor: string | null, getNext: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return redirect("/");
    }

    const user = await currentUser();
    if (!user) {
      return redirect("/");
    }

    const id = user.id;

    let entry: Entry | null = null;
    if (cursor && cursor !== "null") {
      entry = decode_cursor(cursor);
    }

    const whereCondition =
      entry !== null
        ? getNext === "true"
          ? and(
              eq(loadouts.user_id, id),
              or(
                gt(loadouts.created_at, entry.created_at.toISOString()),
                and(
                  eq(loadouts.created_at, entry.created_at.toISOString()),
                  gt(loadouts.id, entry.id)
                )
              ),
              ne(loadouts.id, entry.id)
            )
          : and(
              eq(loadouts.user_id, id),
              or(
                lt(loadouts.created_at, entry.created_at.toISOString()),
                and(
                  eq(loadouts.created_at, entry.created_at.toISOString()),
                  lt(loadouts.id, entry.id)
                )
              ),
              ne(loadouts.id, entry.id)
            )
        : eq(loadouts.user_id, id);

    const data = await db
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
      .limit(LIMIT + 1)
      .orderBy(asc(loadouts.created_at), asc(loadouts.id));

    if (data.length == 0) {
      return {
        loadouts: [],
        prev_cursor: null,
        next_cursor: null,
      };
    }

    let hasNextPage = false;
    let hasPrevPage = false;

    const results = data.slice(0, LIMIT);

    if (results.length > 0) {
      // If this is true, then the data that we got corresponds to the entries ahead
      if (getNext === "true") {
        hasNextPage = data.length > LIMIT;
        const firstResult = results[0];
        const prevCheck = await db
          .select({ count: loadouts.id })
          .from(loadouts)
          .where(
            and(
              eq(loadouts.user_id, id),
              or(
                lt(loadouts.created_at, firstResult.loadout.loadout_timestamp),
                and(
                  eq(
                    loadouts.created_at,
                    firstResult.loadout.loadout_timestamp
                  ),
                  lt(loadouts.id, firstResult.loadout.loadout_id)
                )
              )
            )
          )
          .limit(1);
        hasPrevPage = prevCheck.length > 0;
      } else {
        hasPrevPage = data.length > LIMIT;
        const lastResult = results[results.length - 1];
        const nextCheck = await db
          .select({ count: loadouts.id })
          .from(loadouts)
          .where(
            and(
              eq(loadouts.user_id, id),
              or(
                gt(loadouts.created_at, lastResult.loadout.loadout_timestamp),
                and(
                  eq(loadouts.created_at, lastResult.loadout.loadout_timestamp),
                  gt(loadouts.id, lastResult.loadout.loadout_id)
                )
              )
            )
          )
          .limit(1);
        hasNextPage = nextCheck.length > 0;
      }
    }

    const prev_cursor = hasPrevPage
      ? btoa(JSON.stringify(results[0].loadout))
      : null;

    const next_cursor = hasNextPage
      ? btoa(JSON.stringify(results[results.length - 1].loadout))
      : null;

    const operator_icons = results.map((result) => result.operator.name);
    const gadget_icons = results.map((result) => result.gadget);

    const icons1 = await getIcon({
      prefix: "icons/operators",
      values: operator_icons,
      suffix: ".svg",
    });
    const icons2 = await getIcon({
      prefix: "icons/gadgets",
      values: gadget_icons,
    });

    const icons = { operator_icons: icons1, gadget_icons: icons2 };

    return {
      loadouts: results,
      icons,
      prev_cursor,
      next_cursor,
    };
  } catch (e) {
    throw e;
  }
}

function decode_cursor(cursor: string) {
  const last_entry = atob(cursor);
  const { loadout_id, loadout_timestamp } = JSON.parse(last_entry);
  const created_at = new Date(Date.parse(loadout_timestamp));

  return { created_at, id: loadout_id } as Entry;
}

async function getIcon({
  prefix,
  values,
  suffix = ".png",
}: {
  prefix: string;
  values: string[];
  suffix?: string;
}) {
  const urlPromises = values.map(async (value) => {
    const {
      data: { publicUrl },
    } = supabase.storage
      .from(prefix)
      .getPublicUrl(value.toLowerCase().replaceAll(" ", "_") + suffix);
    return publicUrl;
  });

  return await Promise.all(urlPromises);
}
