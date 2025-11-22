import { NextRequest, NextResponse } from "next/server";
import { groupBy, isNil } from "lodash";
import { db } from "@/db";
import {
  weapons,
  operator_weapons,
  gadgets,
  operator_gadgets,
  operators,
  attachments,
  weapon_attachments,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { Attachment, Weapon } from "@/utils/types";


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const operatorId = searchParams.get("operatorId");

    if (isNil(operatorId)) {
      return NextResponse.json(
        { error: "Invalid search parameters" },
        { status: 400 }
      );
    }

    const operatorPromise = db
      .select()
      .from(operators)
      .where(eq(operators.id, Number(operatorId)));

    const weaponsPromise = db
      .select({
        id: weapons.id,
        name: weapons.name,
        class: weapons.class,
        type: weapons.type,
        base_damage: weapons.base_damage,
        mag_size: weapons.mag_size,
        ammo_cap: weapons.ammo_cap,
        rof: weapons.rof,
      })
      .from(operator_weapons)
      .innerJoin(weapons, eq(operator_weapons.weapon_id, weapons.id))
      .where(eq(operator_weapons.operator_id, Number(operatorId)));

    const gadgetsPromise = db
      .select({
        id: gadgets.id,
        name: gadgets.name,
        icon_url: gadgets.icon_url,
      })
      .from(operator_gadgets)
      .innerJoin(gadgets, eq(operator_gadgets.gadget_id, gadgets.id))
      .where(eq(operator_gadgets.operator_id, Number(operatorId)));

    const [operatorResults, weaponResults, gadgetResults] = await Promise.all([
      operatorPromise,
      weaponsPromise,
      gadgetsPromise,
    ]);

    const results = [];

    for (let w of weaponResults) {
      const attachmentsResult: Attachment[] = await db
        .select({
          id: attachments.id,
          name: attachments.name,
          type: attachments.type,
        })
        .from(weapon_attachments)
        .innerJoin(
          attachments,
          eq(weapon_attachments.attachment_id, attachments.id)
        )
        .where(eq(weapon_attachments.weapon_id, w.id));

      const attachmentMap = groupBy(attachmentsResult, "type");

      const a = w as Weapon;
      a.attachments = Object.fromEntries(
        Object.entries(attachmentMap).map(([key, value]) => [
          key.toLowerCase(),
          value,
        ])
      ) as Record<string, Attachment[]>;
      results.push(a);
    }


    return NextResponse.json({
      operator: operatorResults,
      weapons: results,
      gadgets: gadgetResults,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
