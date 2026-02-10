import { currentUser } from "@clerk/nextjs/server";
import { db } from "../db";
import HttpStatusCode from "../types/statusCodes";
import { err, ok } from "../errors";
import { operator } from "../db/schema";
import { eq } from "drizzle-orm";
import { isNil } from "lodash";

export async function fetchOperatorService(id?: number) {
  try {
    const user = await currentUser();

    if (!user) {
      return err({ statusCode: HttpStatusCode.UNAUTHORIZED });
    }

    const whereCond = isNil(id) ? undefined : eq(operator.id, id);

    const data = await db.query.operator.findMany({
      where: whereCond,
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

    const result = data.map(({ op_weapons, operator_gadgets, ...record }) => ({
      ...record,
      operatorWeapons: op_weapons.map(({ weapon, op_weap_attachments }) => ({
        ...weapon,
        attachments: op_weap_attachments.map(({ attachment }) => ({
          ...attachment,
        })),
      })),
      operatorGadgets: operator_gadgets.map(({ gadget }) => ({ ...gadget })),
    }));

    return ok(HttpStatusCode.ACCEPTED, result);
  } catch (e) {
    return err({ statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR, caughtError: e });
  }
}
