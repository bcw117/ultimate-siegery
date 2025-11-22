import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db/index";
import {
  operator_weapons,
  operator_gadgets,
  gadgets,
  operators,
  weapons,
  attachments,
  weapon_attachments,
} from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { Weapon, Gadget, Operator, Attachment } from "@/utils/types";
import { getRandomElement, randomizedLoadoutName } from "@/utils/helpers";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let side = searchParams.get("side");
    if (!side) {
      side = "A";
    }

    const result = await db
      .select()
      .from(operators)
      .where(eq(operators.side, side))
      .orderBy(sql`random()`)
      .limit(1);

    const operatorData = result[0];
    const operator: Operator = {
      id: operatorData.id,
      name: operatorData.name,
      speed: operatorData.speed,
      side: operatorData.side,
      health: operatorData.health,
      difficulty: operatorData.difficulty,
      unique_ability: operatorData.unique_ability,
      icon_url: operatorData.icon_url,
      portrait_url: operatorData.portrait_url,
    };

    const operatorId = operatorData.id;

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
      .where(eq(operator_weapons.operator_id, operatorId));

    const gadgetsPromise = db
      .select({
        id: gadgets.id,
        name: gadgets.name,
        icon_url: gadgets.icon_url,
      })
      .from(operator_gadgets)
      .innerJoin(gadgets, eq(operator_gadgets.gadget_id, gadgets.id))
      .where(eq(operator_gadgets.operator_id, operatorId));

    const [weaponResults, gadgetResults] = await Promise.all([
      weaponsPromise,
      gadgetsPromise,
    ]);

    const primary_weapon = getRandomElement(
      weaponResults.filter((weapon) => weapon.type === "Primary")
    ) as Weapon;

    const secondary_weapon = getRandomElement(
      weaponResults.filter((weapon) => weapon.type === "Secondary")
    ) as Weapon;

    for (let w of [primary_weapon, secondary_weapon]) {
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

      let scope: Attachment | undefined = getRandomElement(
        attachmentsResult.filter((attachment) => attachment.type == "Scope")
      );

      let barrel: Attachment | undefined = getRandomElement(
        attachmentsResult.filter((attachment) => attachment.type == "Barrel")
      );

      let grip: Attachment | undefined = getRandomElement(
        attachmentsResult.filter((attachment) => attachment.type == "Grip")
      );
      w.attachments = {
        scope: scope,
        barrel: barrel,
        grip: grip,
        underbarrel: undefined,
      };

      // w.underbarrel = (Math.random() < 0.5 ? 0 : 1)
      //   ? { id: 28, name: "Laser Sight", type: "Underbarrel" }
      //   : undefined;
    }

    const name = randomizedLoadoutName(operator.name);

    const loadout = {
      name,
      operator,
      primary_weapon,
      secondary_weapon,
      gadget: getRandomElement(gadgetResults) as Gadget,
    };

    return NextResponse.json(loadout);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
