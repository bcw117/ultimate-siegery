import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db/index";
import {
  operator_weapons,
  operator_gadgets,
  gadgets,
  operators,
  weapons,
} from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { Weapon, Gadget, OperatorWithLoadout } from "@/lib/types/loadout";
import { getRandomElement } from "@/utils/helpers";

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
      .select({ id: gadgets.id, name: gadgets.name })
      .from(operator_gadgets)
      .innerJoin(gadgets, eq(operator_gadgets.gadget_id, gadgets.id))
      .where(eq(operator_gadgets.operator_id, operatorId));

    const [weaponResults, gadgetResults] = await Promise.all([
      weaponsPromise,
      gadgetsPromise,
    ]);

    const loadout: OperatorWithLoadout = {
      id: operatorData.id,
      name: operatorData.name,
      speed: operatorData.speed,
      side: operatorData.side,
      health: operatorData.health,
      difficulty: operatorData.difficulty,
      unique_ability: operatorData.unique_ability,
      primary_weapon: getRandomElement(
        weaponResults.filter((weapon: Weapon) => weapon.type === "Primary")
      ) as Weapon,
      secondary_weapon: getRandomElement(
        weaponResults.filter((weapon: Weapon) => weapon.type === "Secondary")
      ) as Weapon,
      gadget: getRandomElement(gadgetResults) as Gadget,
    };

    return NextResponse.json(loadout);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
