"use server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/index";
import { operator } from "@/lib/db/schema";
import { ActionResponse } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";

export async function fetchOperator(id: number): Promise<ActionResponse<any>> {
  try {
    const user = await currentUser();

    if (!user) {
      return { ok: false, error: "User is not authenticated" };
    }

    const data = await db.query.operator.findFirst({
      where: eq(operator.id, id),
      with: {
        op_weapons: {
          columns: {},
          with: {
            weapon: true,
            op_weap_attachments: { columns: {}, with: { attachment: true } },
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
      operatorWeapons: data.op_weapons.map(
        ({ weapon, op_weap_attachments }) => ({
          ...weapon,
          attachments: op_weap_attachments.map(({ attachment }) => ({
            ...attachment,
          })),
        })
      ),
      operatorGadgets: data.operator_gadgets.map(({ gadget }) => ({
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
    const user = await currentUser();

    if (!user) {
      return { ok: false, error: "User is not authenticated" };
    }

    const data = await db.select().from(operator);

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: "Unable to fetch information on operators" };
  }
}

export async function fetchAllOperatorLoadouts() {
  try {
    const user = await currentUser();

    if (!user) {
      return { ok: false, error: "User is not authenticated" };
    }
    const response = await db.query.operator.findMany({
      with: {
        op_weapons: {
          columns: {},
          with: {
            weapon: true,
            op_weap_attachments: { columns: {}, with: { attachment: true } },
          },
        },
        operator_gadgets: { columns: {}, with: { gadget: true } },
      },
    });

    const data = response.map((record) => ({
      ...record,
      operatorWeapons: record.op_weapons.map(
        ({ weapon, op_weap_attachments }) => ({
          ...weapon,
          attachments: op_weap_attachments.map(({ attachment }) => ({
            ...attachment,
          })),
        })
      ),
      operatorGadgets: record.operator_gadgets.map(({ gadget }) => ({
        ...gadget,
      })),
    }));

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: "Unable to fetch operator loadout data" };
  }
}
