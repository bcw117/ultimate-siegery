"use server";

import { loadout_attachment, loadout } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { ActionResponse } from "@/db/types";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

type CreateLoadoutRequest = {
  name: string;
  operator_id: number;
  primary_weapon_id: number;
  secondary_weapon_id: number;
  gadget_id: number;
  primary_attachment_ids: number[];
  secondary_attachment_ids: number[];
};

export async function saveLoadout(
  loadoutParams: CreateLoadoutRequest
): Promise<ActionResponse<{ message: string }>> {
  try {
    // ADD SOME ACTUAL AUTH HERE
    const user_id = "asdfasdfasdf";

    console.log(loadoutParams);

    await db.transaction(async (tx) => {
      const [createdLoadout] = await tx
        .insert(loadout)
        .values({
          name: loadoutParams.name,
          user_id,
          operator_id: loadoutParams.operator_id,
          pweapon_id: loadoutParams.primary_weapon_id,
          sweapon_id: loadoutParams.secondary_weapon_id,
          gadget_id: loadoutParams.gadget_id,
        })
        .returning({ id: loadout.id });

      const primaryAttachmentsInsert = loadoutParams.primary_attachment_ids.map(
        (id) => ({
          loadout_id: createdLoadout.id,
          weapon_id: loadoutParams.primary_weapon_id,
          attachment_id: id,
        })
      );

      const secondaryAttachmentInsert =
        loadoutParams.secondary_attachment_ids.map((id) => ({
          loadout_id: createdLoadout.id,
          weapon_id: loadoutParams.secondary_weapon_id,
          attachment_id: id,
        }));

      await tx
        .insert(loadout_attachment)
        .values([...primaryAttachmentsInsert, ...secondaryAttachmentInsert]);
    });

    return { ok: true, data: { message: "Loadout saved successfully" } };
  } catch (e) {
    console.log(e);
    return { ok: false, error: "Unable to save loadout" };
  }
}

export async function deleteLoadout(
  id: number
): Promise<ActionResponse<{ message: string }>> {
  try {
    await db.delete(loadout).where(eq(loadout.id, id));
    revalidatePath("/");

    return { ok: true, data: { message: "Loadout deleted successfully" } };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { ok: false, error: errorMessage };
  }
}

export async function updateLoadout(
  id: number,
  loadout: CreateLoadoutRequest
): Promise<ActionResponse<{ message: string }>> {
  revalidatePath("/");
  return { ok: true, data: { message: "This worked" } };
}
