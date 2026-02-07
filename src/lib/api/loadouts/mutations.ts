"use server";

import { loadout_weapon_attachment, loadout } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { ActionResponse, AttachmentSet, LoadoutDisplay } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import _, { isNil } from "lodash";
import { redirect } from "next/navigation";

type CreateLoadoutRequest = Omit<LoadoutDisplay, "operator" | "id"> & {
  operatorId: number;
};
type UpdateLoadoutRequest = Omit<CreateLoadoutRequest, "operatorId">;

export async function saveLoadout(
  loadoutParams: CreateLoadoutRequest
): Promise<ActionResponse<{ message: string }>> {
  try {
    const user = await currentUser();

    if (!user) {
      return { ok: false, error: "User is not authenticated" };
    }

    const { id: user_id } = user;
    const { name, operatorId, primaryWeapon, secondaryWeapon, gadget } =
      loadoutParams;

    await db.transaction(async (tx) => {
      const [createdLoadout] = await tx
        .insert(loadout)
        .values({
          name: name,
          user_id,
          operator_id: operatorId,
          pweapon_id: primaryWeapon.id,
          sweapon_id: secondaryWeapon.id,
          gadget_id: gadget.id,
        })
        .returning({ id: loadout.id });

      const primaryAttachmentInsert = createAttachmentInsertData(
        createdLoadout.id,
        primaryWeapon.id,
        primaryWeapon.attachments
      );

      const secondaryAttachmentInsert = createAttachmentInsertData(
        createdLoadout.id,
        secondaryWeapon.id,
        secondaryWeapon.attachments
      );

      await tx
        .insert(loadout_weapon_attachment)
        .values([...primaryAttachmentInsert, ...secondaryAttachmentInsert]);
    });
  } catch (e) {
    console.error(e);
    return { ok: false, error: "Unable to save loadout" };
  }

  revalidatePath("/loadouts");
  redirect("/loaduts");
}

export async function deleteLoadout(id: number): Promise<ActionResponse<void>> {
  try {
    const user = await currentUser();

    if (!user) {
      return { ok: false, error: "User is not authenticated" };
    }

    const { id: user_id } = user;

    await db
      .delete(loadout)
      .where(and(eq(loadout.id, id), eq(loadout.user_id, user_id)));
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return { ok: false, error: errorMessage };
  }

  revalidatePath("/loadouts");
  redirect("/loadouts");
}

function createAttachmentInsertData(
  loadoutId: number,
  weaponId: number,
  attachments: AttachmentSet
) {
  return Object.values(attachments)
    .filter((attachment) => !isNil(attachment))
    .map((attachment) => ({
      loadout_id: loadoutId,
      weapon_id: weaponId,
      attachment_id: attachment.id,
    }));
}

async function removeLoadoutAttachments(loadoutId: number, weaponId: number) {
  await db
    .delete(loadout_weapon_attachment)
    .where(
      and(
        eq(loadout_weapon_attachment.weapon_id, weaponId),
        eq(loadout_weapon_attachment.loadout_id, loadoutId)
      )
    );
}

export async function updateLoadout(
  id: number,
  previousLoadout: UpdateLoadoutRequest,
  updatedLoadout: UpdateLoadoutRequest
): Promise<ActionResponse<any>> {
  try {
    const user = await currentUser();

    if (!user) {
      return { ok: false, error: "User is not authenticated" };
    }

    if (_.isEqual(previousLoadout, updatedLoadout)) {
      return { ok: true, data: { message: "Same loadout, no changes needed" } };
    }

    const { id: user_id } = user;

    await db
      .update(loadout)
      .set({
        name: updatedLoadout.name,
        gadget_id: updatedLoadout.gadget.id,
        pweapon_id: updatedLoadout.primaryWeapon.id,
        sweapon_id: updatedLoadout.secondaryWeapon.id,
      })
      .where(and(eq(loadout.user_id, user_id), eq(loadout.id, id)));

    await removeLoadoutAttachments(id, previousLoadout.primaryWeapon.id);
    await removeLoadoutAttachments(id, previousLoadout.secondaryWeapon.id);

    const primaryAttachmentInsert = createAttachmentInsertData(
      id,
      updatedLoadout.primaryWeapon.id,
      updatedLoadout.primaryWeapon.attachments
    );

    const secondaryAttachmentInsert = createAttachmentInsertData(
      id,
      updatedLoadout.secondaryWeapon.id,
      updatedLoadout.secondaryWeapon.attachments
    );

    await db
      .insert(loadout_weapon_attachment)
      .values([...primaryAttachmentInsert, ...secondaryAttachmentInsert]);

    revalidatePath("/loadouts");
    return { ok: true, data: { message: "Loadout updated" } };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return { ok: false, error: errorMessage };
  }
}
