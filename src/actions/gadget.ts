"use server";

/**
 * Gadget related functions
 */

import { Gadget } from "@/lib/types/gadget";
import { createClient } from "@/utils/supabase/server";
import { getRandomElement } from "@/utils/helpers";
/**
 * Returns all gadgets of a given operator
 * @param operatorId: number
 * @returns Gadget[]
 */
export async function getGadgets(operatorId: number): Promise<Gadget[]> {
  const supabase = await createClient();

  const { data: gadgetData, error: operatorGadgetError } = await supabase
    .from("operator_gadget")
    .select("gadget_id, gadgets:gadgets(*)")
    .eq("operator_id", operatorId);

  if (operatorGadgetError) {
    throw operatorGadgetError;
  }

  if (!gadgetData || gadgetData.length === 0) {
    throw new Error("Gadgets not found");
  }

  const gadgets = gadgetData.map((gadgetEntry) => {
    return gadgetEntry.gadgets as unknown as Gadget;
  });

  return gadgets;
}

/**
 * Returns a random gadget of a given operator
 * @param operatorId: number
 * @returns Gadget
 */
export async function getRandomGadget(operatorId: number): Promise<Gadget> {
  const gadgets = await getGadgets(operatorId);

  return getRandomElement(gadgets) as Gadget;
}
