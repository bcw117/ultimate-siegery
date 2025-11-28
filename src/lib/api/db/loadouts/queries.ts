import {
  decodeCursor,
  encodeCursor,
  foldAttachments,
} from "@/lib/utils/helpers";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  attachments,
  gadgets,
  loadout_attachments,
  loadouts,
  operators,
  weapons,
} from "../schema";
import { and, asc, count, desc, eq, gt, lt, ne, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core/alias";
import { db } from "..";
import { Weapon } from "@/lib/utils/types";

type CursorData = {
  created_at: Date;
  id: number;
};

const primaryWeapons = alias(weapons, "primary_weapons");
const secondaryWeapons = alias(weapons, "secondary_weapons");
const LIMIT = 5;

export async function fetchLoadouts(cursor: string | null, forward: string) {
  try {
    const { userId: id } = await auth();

    if (!id) {
      redirect("/");
    }

    const entry: CursorData | null = decodeCursor(cursor);

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

    const primaryAttachmentsJson = sql<
      { id: number; name: string; type: string }[]
    >`coalesce((
      select json_agg(json_build_object('id', a.id, 'name', a.name, 'type', a.type) order by a.id)
      from ${loadout_attachments} la
      join ${attachments} a on la.attachment_id = a.id
      where la.loadout_id = ${loadouts.id} and la.weapon_id = ${primaryWeapons.id}
    ), '[]'::json)`.as("primary_attachments");

    const secondaryAttachmentsJson = sql<
      { id: number; name: string; type: string }[]
    >`coalesce((
      select json_agg(json_build_object('id', a.id, 'name', a.name, 'type', a.type) order by a.id)
      from ${loadout_attachments} la
      join ${attachments} a on la.attachment_id = a.id
      where la.loadout_id = ${loadouts.id} and la.weapon_id = ${secondaryWeapons.id}
    ), '[]'::json)`.as("secondary_attachments");

    const data = await db
      .select({
        details: {
          name: loadouts.name,
          id: loadouts.id,
          timestamp: loadouts.created_at,
        },
        operator: {
          id: operators.id,
          name: operators.name,
          speed: operators.speed,
          side: operators.side,
          health: operators.health,
          difficulty: operators.difficulty,
          unique_ability: operators.unique_ability,
          icon_url: operators.icon_url,
          portrait_url: operators.portrait_url,
        },
        primary_weapon: {
          id: primaryWeapons.id,
          name: primaryWeapons.name,
          class: primaryWeapons.class,
          type: primaryWeapons.type,
          base_damage: primaryWeapons.base_damage,
          mag_size: primaryWeapons.mag_size,
          ammo_cap: primaryWeapons.ammo_cap,
          rof: primaryWeapons.rof,
          attachments: primaryAttachmentsJson,
        },
        secondary_weapon: {
          id: secondaryWeapons.id,
          name: secondaryWeapons.name,
          class: secondaryWeapons.class,
          type: secondaryWeapons.type,
          base_damage: secondaryWeapons.base_damage,
          mag_size: secondaryWeapons.mag_size,
          ammo_cap: secondaryWeapons.ammo_cap,
          rof: secondaryWeapons.rof,
          attachments: secondaryAttachmentsJson,
        },
        gadget: {
          id: gadgets.id,
          name: gadgets.name,
          icon_url: gadgets.icon_url,
        },
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
          created_at: results[0].details.timestamp,
          id: results[0].details.id,
        })
      : null;

    const next_cursor = hasNextPage
      ? encodeCursor({
          created_at: results[results.length - 1].details.timestamp,
          id: results[results.length - 1].details.id,
        })
      : null;

    const shaped = results.map((row) => ({
      ...row,
      primary_weapon: {
        ...row.primary_weapon,
        attachments: foldAttachments(
          (row.primary_weapon as Weapon).attachments as {
            id: number;
            name: string;
            type: string;
          }[]
        ),
      },
      secondary_weapon: {
        ...row.secondary_weapon,
        attachments: foldAttachments(
          (row.secondary_weapon as Weapon).attachments as {
            id: number;
            name: string;
            type: string;
          }[]
        ),
      },
    }));

    return {
      result: shaped,
      prev_cursor,
      next_cursor,
    };
  } catch (e) {
    throw e;
  }
}

export async function getNumLoadouts(user_id: string) {
  const response = await db
    .select({ count: count() })
    .from(loadouts)
    .where(eq(loadouts.user_id, user_id));

  return { count: response[0].count };
}
