"use server";

/**
 * Operator related functions
 */

import { Operator, OperatorWithLoadout } from "@/lib/types/operator";
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
export async function getRandomLoadout(
  side: string
): Promise<OperatorWithLoadout> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_random_loadout_for_side", {
    target_side: side,
  });

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Error fetching random loadout");
  }

  const loadout: OperatorWithLoadout = {
    id: data.id,
    name: data.name,
    side: data.side,
    health: data.health,
    difficulty: data.difficulty,
    unique_ability: data.unique_ability,
    primary_weapon: data.primary_weapon,
    secondary_weapon: data.secondary_weapon,
    gadget: data.gadget,
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
