import { currentUser } from "@clerk/nextjs/server";
import { AttachmentSet, LoadoutDisplay } from "../types/types";
import { err, ok } from "../errors";
import { isNil } from "lodash";
import { db } from "../db";
import { loadout, loadout_weapon_attachment } from "../db/schema";
import HttpStatusCode from "../types/statusCodes";
import { and, eq, inArray, Update } from "drizzle-orm";
import _ from "lodash";

type CreateLoadoutValues = Omit<LoadoutDisplay, "operator" | "id"> & {
  operatorId: number;
};

type UpdateLoadoutValues = Omit<CreateLoadoutValues, "operatorId">;

export async function fetchLoadoutService(id?: number) {
  try {
    const user = await currentUser();

    if (!user) {
      return err({ statusCode: HttpStatusCode.UNAUTHORIZED });
    }

    const { id: user_id } = user;

    const whereCond = isNil(id)
      ? eq(loadout.user_id, user_id)
      : and(eq(loadout.id, id), eq(loadout.user_id, user_id));

    const data = await db.query.loadout.findMany({
      where: whereCond,
      columns: {
        id: true,
        created_at: true,
        name: true,
        pweapon_id: true,
        sweapon_id: true,
      },
      with: {
        operator: true,
        gadget: true,
        primary_weapon: true,
        secondary_weapon: true,
        loadout_weapon_attachments: {
          columns: { weapon_id: true },
          with: { attachment: true },
        },
      },
    });

    if (data.length === 0) {
      return ok(HttpStatusCode.NO_CONTENT, []);
    }

    const response = data.map(
      ({
        primary_weapon,
        secondary_weapon,
        loadout_weapon_attachments,
        pweapon_id,
        sweapon_id,
        ...loadout
      }) => {
        const primaryAttachments = loadout_weapon_attachments.filter(
          (lwa) => lwa.weapon_id === pweapon_id
        );
        const secondaryAttachments = loadout_weapon_attachments.filter(
          (lwa) => lwa.weapon_id === sweapon_id
        );

        return {
          ...loadout,
          primaryWeapon: {
            ...primary_weapon,
            attachments: processAttachments(primaryAttachments),
          },
          secondaryWeapon: {
            ...secondary_weapon,
            attachments: processAttachments(secondaryAttachments),
          },
        };
      }
    );

    return ok(HttpStatusCode.ACCEPTED, response);
  } catch (e) {
    return err({
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      caughtError: e,
    });
  }
}

export async function saveLoadoutService(data: CreateLoadoutValues) {
  try {
    const user = await currentUser();

    if (isNil(user)) {
      return err({
        statusCode: HttpStatusCode.UNAUTHORIZED,
        message: "User not authenticated",
      });
    }

    const { id: user_id } = user;

    const { name, operatorId, primaryWeapon, secondaryWeapon, gadget } = data;

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
    return ok(HttpStatusCode.CREATED, { message: "Loadout created!" });
  } catch (e) {
    return err({
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      caughtError: e,
    });
  }
}

export async function deleteLoadoutService(id: number) {
  try {
    const user = await currentUser();

    if (!user) {
      return err({ statusCode: HttpStatusCode.UNAUTHORIZED });
    }

    const { id: user_id } = user;

    await db
      .delete(loadout)
      .where(and(eq(loadout.id, id), eq(loadout.user_id, user_id)));

    return ok(HttpStatusCode.OK, { message: "Loadout successfully deleted" });
  } catch (e) {
    return err({
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      caughtErro: e,
    });
  }
}

export async function updateLoadoutService(
  id: number,
  previousLoadout: UpdateLoadoutValues,
  updatedLoadout: UpdateLoadoutValues
) {
  try {
    const user = await currentUser();

    if (!user) {
      return err({
        statusCode: HttpStatusCode.UNAUTHORIZED,
        message: "User not authenticated",
      });
    }

    if (_.isEqual(previousLoadout, updatedLoadout)) {
      return ok(HttpStatusCode.NO_CONTENT, {
        message: "No modifications made from original loadout",
      });
    }

    const { id: user_id } = user;

    await db.transaction(async (tx) => {
      await tx
        .update(loadout)
        .set({
          name: updatedLoadout.name,
          gadget_id: updatedLoadout.gadget.id,
          pweapon_id: updatedLoadout.primaryWeapon.id,
          sweapon_id: updatedLoadout.secondaryWeapon.id,
        })
        .where(and(eq(loadout.user_id, user_id), eq(loadout.id, id)));

      await tx
        .delete(loadout_weapon_attachment)
        .where(
          and(
            inArray(loadout_weapon_attachment.weapon_id, [
              previousLoadout.primaryWeapon.id,
              previousLoadout.secondaryWeapon.id,
            ]),
            eq(loadout_weapon_attachment.loadout_id, id)
          )
        );

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

      await tx
        .insert(loadout_weapon_attachment)
        .values([...primaryAttachmentInsert, ...secondaryAttachmentInsert]);
    });

    return ok(HttpStatusCode.ACCEPTED, {
      message: "Loadout updated successfully",
    });
  } catch (e) {
    return err({
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      caughtError: e,
    });
  }
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

function processAttachments(attachments: any[]) {
  return attachments.reduce((acc, { attachment }) => {
    const type = attachment.type.toLowerCase();
    acc[type] = attachment;
    return acc;
  }, {} as any);
}
