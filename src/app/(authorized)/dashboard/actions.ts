"use server";

import { Attachment, Loadout } from "@/utils/types";
import { db } from "@/db";
import { loadout_attachments, loadouts } from "@/db/schema";
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

    const primaryAttachments = extractAttachmentID(
      loadout.primary_weapon.attachments
    );
    const secondaryAttachments = extractAttachmentID(
      loadout.secondary_weapon.attachments
    );

    const rows = [
      ...primaryAttachments.map((attachment_id) => ({
        loadout_id: loadoutId,
        weapon_id: pweapon_id,
        attachment_id: attachment_id,
      })),
      ...secondaryAttachments.map((attachment_id) => ({
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

function extractAttachmentID(attachments: {
  scope?: Attachment;
  barrel?: Attachment;
  grip?: Attachment;
  underBarrel?: Attachment;
}) {
  const values = Object.values(attachments);
  const defined = values.filter((a): a is Attachment => !!a);
  return defined.map((a) => a.id);
}
