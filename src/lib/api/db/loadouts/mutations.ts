"use server";

import { currentUser } from "@clerk/nextjs/server";
import { loadout_attachments, loadouts } from "../schema";
import { db } from "..";
import { Loadout } from "@/lib/utils/types";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

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

    const name = loadout.name;
    const operator_id = loadout.operator.id;
    const pweapon_id = loadout.primary_weapon.id;
    const sweapon_id = loadout.secondary_weapon.id;
    const gadget_id = loadout.gadget.id;

    const [result] = await db
      .insert(loadouts)
      .values({
        name,
        user_id,
        operator_id,
        pweapon_id,
        sweapon_id,
        gadget_id,
      })
      .returning({ id: loadouts.id });

    if (!result) {
      throw new Error("Failed to insert loadout!");
    }

    const loadoutId = result.id;

    const primaryAttachments = Object.values(
      loadout.primary_weapon.attachments
    ).map((attachment) => attachment.id);

    const secondaryAttachments = Object.values(
      loadout.secondary_weapon.attachments
    ).map((attachment) => attachment.id);

    const rows = [
      ...primaryAttachments.map((attachment_id: number) => ({
        loadout_id: loadoutId,
        weapon_id: pweapon_id,
        attachment_id: attachment_id,
      })),
      ...secondaryAttachments.map((attachment_id: number) => ({
        loadout_id: loadoutId,
        weapon_id: sweapon_id,
        attachment_id: attachment_id,
      })),
    ];

    await db.insert(loadout_attachments).values(rows);

    return { success: true, message: "Loadout saved successfully!" };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

export async function deleteLoadout(id: number) {
  try {
    await db.delete(loadouts).where(eq(loadouts.id, id));
    revalidatePath("/");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      error: errorMessage,
    };
  }
}
