"use server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/index";
import {
  attachment,
  operator,
  operator_gadget,
  operator_weapon_attachment,
} from "@/lib/db/schema";
import { ActionResponse } from "@/db/types";

export async function fetchOperator(id: number): Promise<ActionResponse<any>> {
  try {
    const data = await db.query.operator.findFirst({
      where: eq(operator.id, id),
      with: {
        operator_weapons: {
          columns: {},
          with: {
            weapon: true,
            operator_weapon_attachments: {
              columns: {},
              with: { attachment: true },
            },
          },
        },
        operator_gadgets: { columns: {}, with: { gadget: true } },
      },
    });

    if (!data) {
      return { ok: false, error: "Operator not found" };
    }

    const result = {
      ...data,
      operator_weapons: data.operator_weapons.map(
        ({ weapon, operator_weapon_attachments }) => ({
          ...weapon,
          attachments: operator_weapon_attachments.map(({ attachment }) => ({
            ...attachment,
          })),
        })
      ),
      operator_gadgets: data.operator_gadgets.map(({ gadget }) => ({
        ...gadget,
      })),
    };

    return { ok: true, data: result };
  } catch (error) {
    return { ok: false, error: "Unable to fetch operator information" };
  }
}

export async function fetchAllOperators() {
  try {
    const data = await db.select().from(operator);

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: "Unable to fetch information on operators" };
  }
}

export async function fetchAllOperatorLoadouts() {
  try {
    const response = await db.query.operator.findMany({
      with: {
        operator_weapons: {
          columns: {},
          with: {
            weapon: true,
            operator_weapon_attachments: {
              columns: {},
              with: { attachment: true },
            },
          },
        },
        operator_gadgets: { columns: {}, with: { gadget: true } },
      },
    });

    const data = response.map((record) => ({
      ...record,
      operator_weapons: record.operator_weapons.map(
        ({ weapon, operator_weapon_attachments }) => ({
          ...weapon,
          attachments: operator_weapon_attachments.map(({ attachment }) => ({
            ...attachment,
          })),
        })
      ),
      operator_gadgets: record.operator_gadgets.map(({ gadget }) => ({
        ...gadget,
      })),
    }));

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: "Unable to fetch operator loadout data" };
  }
}

// TODO: fix this one
export async function fetchRandomOperator() {
  try {
    const data = await db.query.operator.findFirst({
      where: eq(operator.id, 1),
      with: {
        operator_weapons: { columns: {}, with: { weapon: true } },
        operator_gadgets: { columns: {}, with: { gadget: true } },
      },
    });

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: "Unable to fetch information on operators" };
  }
}
