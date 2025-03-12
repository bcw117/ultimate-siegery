"use server";

import { Operator } from "@/lib/types/operator";
import { createClient } from "@/utils/supabase/server";
import { OPERATOR_COUNT } from "@/utils/helpers";
/**
 * Operator related functions
 */

/**
 * Get random operator (single)
 * @param side: Attacker or Defender (Optional)
 * @returns Operator
 */
export async function getOperator(side: string): Promise<Operator | null> {
  const supabase = await createClient();

  const { count, error: countError } = await supabase
    .from("operators")
    .select("*", { count: "exact", head: true })
    .eq("side", side);

  if (countError) {
    throw countError;
  }

  if (!count || count === 0) {
    return null; // Handle the case where no entries match
  }

  const randomIdx = Math.floor(Math.random() * count) + 1;

  // Step 3: Fetch the row at that random index for the given "side".
  const { data, error } = await supabase
    .from("operators")
    .select("*")
    .eq("side", side)
    .range(randomIdx, randomIdx)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

/**
 * Get random operators for full team
 */

/**
 * Get random operators for a full match
 *
 */
