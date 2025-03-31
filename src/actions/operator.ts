"use server";

/**
 * Operator related functions
 */

import { Operator, OperatorWithLoadout } from "@/lib/types/operator";
import { Weapon } from "@/lib/types/weapon";
import { Gadget } from "@/lib/types/gadget";
import {
  getRandomElement,
  getRandomNumber,
  OPERATOR_COUNT,
} from "@/utils/helpers";
import { createClient } from "@/utils/supabase/server";

/**
 * Get random operator (single)
 * @param side: Attacker or Defender (Optional)
 * @returns Operator
 */
export async function getOperator(side: string): Promise<Operator | null> {
  const supabase = await createClient();

  const { data: operators, error: countError } = await supabase
    .from("operators")
    .select("*")
    .eq("side", side);

  if (countError) {
    throw countError;
  }

  if (!operators || operators.length === 0) {
    return null;
  }

  const count = operators.length;

  const randomIdx = Math.floor(Math.random() * count);

  const operator = operators[randomIdx];

  return operator;
}

/**
 * Get random loadout for single operator
 * @returns Loadout
 */
export async function getRandomLoadout(): Promise<OperatorWithLoadout> {
  const supabase = await createClient();

  const operatorId = getRandomNumber(1, OPERATOR_COUNT);

  const { data, error: loadoutError } = await supabase
    .from("operators")
    .select("*, weapons(*), gadgets(*)")
    .eq("id", operatorId);

  if (loadoutError) {
    throw loadoutError;
  }

  if (!data || data.length == 0) {
    throw new Error("No operator found");
  }

  const result = data[0];
  const loadout: OperatorWithLoadout = {
    id: result.id,
    name: result.name,
    side: result.side,
    health: result.health,
    difficulty: result.difficulty,
    unique_ability: result.unique_ability,
    primary_weapon: getRandomElement(
      result.weapons.filter((weapon: Weapon) => weapon.type === "Primary")
    ) as Weapon,
    secondary_weapon: getRandomElement(
      result.weapons.filter((weapon: Weapon) => weapon.type === "Secondary")
    ) as Weapon,
    gadget: getRandomElement(result.gadgets) as Gadget,
  };

  return loadout;
}

/**
 * Get random operators for full team
 */

/**
 * Get random operators for a full match
 *
 */
