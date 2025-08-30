"use server";
import { db } from "@/db";
import {
  gadgets,
  loadouts,
  operators,
  weapons,
  loadout_attachments,
  attachments,
} from "@/db/schema";
import { Weapon } from "@/utils/types";
import { auth } from "@clerk/nextjs/server";
import { gt, eq, asc, and, or, lt, desc, ne, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { redirect } from "next/navigation";

const primaryWeapons = alias(weapons, "primary_weapons");
const secondaryWeapons = alias(weapons, "secondary_weapons");
const LIMIT = 5;

type MetaData = {
  created_at: Date;
  id: number;
};

function foldAttachments(rows: { id: number; name: string; type: string }[]) {
  const result: {
    scope?: { id: number; name: string; type: string };
    barrel?: { id: number; name: string; type: string };
    grip?: { id: number; name: string; type: string };
    underbarrel?: { id: number; name: string; type: string };
  } = {};
  for (const a of rows) {
    if (a.type === "Scope" && !result.scope) result.scope = a;
    else if (a.type === "Barrel" && !result.barrel) result.barrel = a;
    else if (a.type === "Grip" && !result.grip) result.grip = a;
    else if (a.type === "Underbarrel" && !result.underbarrel)
      result.underbarrel = a;
  }
  return result;
}

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
