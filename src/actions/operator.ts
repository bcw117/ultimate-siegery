"use server";

/**
 * Operator related functions
 */

import { Operator, OperatorWithLoadout } from "@/lib/types/operator";
import { randomOperator } from "@/server/db/queries/operators";
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
 * Get random operator with loadout
 * @param side: Attacker or Defender (Optional)
 * @returns OperatorWithLoadout
 */
export async function getRandomOperatorWithLoadout(
  side: string
): Promise<OperatorWithLoadout> {
  const result = await randomOperator(side);

  if (!result) {
    throw new Error("No operator found");
  }

  return result;
}

/**
 * Get random operators for full team
 */

/**
 * Get random operators for a full match
 *
 */
