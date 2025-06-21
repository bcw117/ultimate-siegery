"use server";

import { Loadout } from "@/lib/types/loadout";
import { db } from "@/db";
import { loadouts } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";

export async function saveLoadout(loadout: Loadout) {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        success: false,
        error: "Authentication required. Please sign in.",
      };
    }
    const user_id = user.id;

    const operator_id = loadout.operator.id;
    const pweapon_id = loadout.pweapon.id;
    const sweapon_id = loadout.sweapon.id;
    const gadget_id = loadout.gadget.id;

    await db.insert(loadouts).values({
      user_id,
      operator_id,
      pweapon_id,
      sweapon_id,
      gadget_id,
    });

    return { success: true, message: "Loadout saved successfully!" };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

export async function create() {}
