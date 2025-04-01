import { sql, eq } from "drizzle-orm";
import { db } from "../index";
import {
  operators,
  operator_weapons,
  operator_gadgets,
  weapons,
  gadgets,
} from "../schema";
import { OperatorWithLoadout } from "@/lib/types/operator";
import { Weapon } from "@/lib/types/weapon";
import { Gadget } from "@/lib/types/gadget";
import { getRandomElement } from "@/utils/helpers";

export async function randomOperator(
  side: string
): Promise<OperatorWithLoadout> {
  const operatorData = await db
    .select({
      id: operators.id,
      name: operators.name,
      side: operators.side,
      health: operators.health,
      speed: operators.speed,
      difficulty: operators.difficulty,
      unique_ability: operators.unique_ability,
      image_url: operators.image_url,
      weapons: sql<Weapon[]>`json_agg(
          json_build_object(
            'id', ${weapons.id},
            'name', ${weapons.name},
            'class', ${weapons.class},
            'type', ${weapons.type},
            'base_damage', COALESCE(${weapons.base_damage}, 0),
            'mag_size', COALESCE(${weapons.mag_size}, 0),
            'ammo_cap', COALESCE(${weapons.ammo_cap}, 0),
            'rof', COALESCE(${weapons.rof}, 0)
          )
        )`,
      gadgets: sql<Gadget[]>`json_agg(
          json_build_object(
            'id', ${gadgets.id},
            'name', ${gadgets.name}
          )
        )`,
    })
    .from(operators)
    .where(eq(operators.side, side))
    .leftJoin(operator_weapons, eq(operators.id, operator_weapons.operator_id))
    .leftJoin(weapons, eq(operator_weapons.weapon_id, weapons.id))
    .leftJoin(operator_gadgets, eq(operators.id, operator_gadgets.operator_id))
    .leftJoin(gadgets, eq(operator_gadgets.gadget_id, gadgets.id))
    .groupBy(operators.id)
    .orderBy(sql`random()`)
    .limit(1);

  if (!operatorData.length) {
    throw new Error(`No operators found for side: ${side}`);
  }

  const operator = operatorData[0];
  const primaryWeapons = operator.weapons.filter((w) => w.type === "Primary");
  const secondaryWeapons = operator.weapons.filter(
    (w) => w.type === "Secondary"
  );
  const availableGadgets = operator.gadgets;

  if (
    !primaryWeapons.length ||
    !secondaryWeapons.length ||
    !availableGadgets.length
  ) {
    throw new Error("Operator missing required loadout items");
  }

  return {
    id: operator.id,
    name: operator.name,
    side: operator.side,
    health: operator.health,
    speed: operator.speed,
    difficulty: operator.difficulty,
    unique_ability: operator.unique_ability,
    primary_weapon: getRandomElement(primaryWeapons) as Weapon,
    secondary_weapon: getRandomElement(secondaryWeapons) as Weapon,
    gadget: getRandomElement(availableGadgets) as Gadget,
  };
}
