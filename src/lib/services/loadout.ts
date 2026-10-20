import { currentUser } from "@clerk/nextjs/server";
import { AttachmentSet, LoadoutDisplay } from "../types/types";
import { err, ok } from "../errors";
import { isNil } from "lodash";
import { db } from "../db";
import {
    loadout,
    loadout_weapon_attachment,
    operator_gadget,
    operator_weapon,
} from "../db/schema";
import HttpStatusCode from "../types/statusCodes";
import { and, desc, eq, inArray } from "drizzle-orm";
import _ from "lodash";

type CreateLoadoutValues = Omit<LoadoutDisplay, "operator" | "id"> & {
    operatorId: number;
};

type UpdateLoadoutValues = Omit<CreateLoadoutValues, "operatorId">;

const MAX_LOADOUT_NAME_LENGTH = 64;

const ATTACHMENT_SLOTS: readonly string[] = [
    "sight",
    "grip",
    "barrel",
    "underbarrel",
];

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
            orderBy: desc(loadout.created_at),
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

        const { name, operatorId, primaryWeapon, secondaryWeapon, gadget } =
            data;

        if (
            !isId(operatorId) ||
            !(await isValidLoadoutSelection(operatorId, data))
        ) {
            return err({
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: "Invalid loadout selection",
            });
        }

        await db.transaction(async (tx) => {
            const [createdLoadout] = await tx
                .insert(loadout)
                .values({
                    name: name.trim(),
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
                .values([
                    ...primaryAttachmentInsert,
                    ...secondaryAttachmentInsert,
                ]);
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

        return ok(HttpStatusCode.OK, {
            message: "Loadout successfully deleted",
        });
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

        const existingLoadout = isId(id)
            ? await db.query.loadout.findFirst({
                  where: and(eq(loadout.id, id), eq(loadout.user_id, user_id)),
                  columns: { operator_id: true },
              })
            : undefined;

        if (isNil(existingLoadout)) {
            return err({
                statusCode: HttpStatusCode.NOT_FOUND,
                message: "Loadout not found",
            });
        }

        if (
            !(await isValidLoadoutSelection(
                existingLoadout.operator_id,
                updatedLoadout
            ))
        ) {
            return err({
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: "Invalid loadout selection",
            });
        }

        await db.transaction(async (tx) => {
            await tx
                .update(loadout)
                .set({
                    name: updatedLoadout.name.trim(),
                    gadget_id: updatedLoadout.gadget.id,
                    pweapon_id: updatedLoadout.primaryWeapon.id,
                    sweapon_id: updatedLoadout.secondaryWeapon.id,
                })
                .where(and(eq(loadout.user_id, user_id), eq(loadout.id, id)));

            // Ownership was checked above, so clear every attachment on this loadout
            await tx
                .delete(loadout_weapon_attachment)
                .where(eq(loadout_weapon_attachment.loadout_id, id));

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
                .values([
                    ...primaryAttachmentInsert,
                    ...secondaryAttachmentInsert,
                ]);
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

function isId(value: unknown): value is number {
    return typeof value === "number" && Number.isInteger(value) && value > 0;
}

// Server actions accept any payload, so check the selection against what the
// operator can actually equip before writing it
async function isValidLoadoutSelection(
    operatorId: number,
    selection: UpdateLoadoutValues
) {
    const { name, gadget, primaryWeapon, secondaryWeapon } = selection;

    if (
        typeof name !== "string" ||
        name.trim().length === 0 ||
        name.trim().length > MAX_LOADOUT_NAME_LENGTH
    ) {
        return false;
    }

    if (
        !isId(gadget?.id) ||
        !isId(primaryWeapon?.id) ||
        !isId(secondaryWeapon?.id)
    ) {
        return false;
    }

    const operatorGadget = await db.query.operator_gadget.findFirst({
        where: and(
            eq(operator_gadget.operator_id, operatorId),
            eq(operator_gadget.gadget_id, gadget.id)
        ),
    });

    if (isNil(operatorGadget)) {
        return false;
    }

    const operatorWeapons = await db.query.operator_weapon.findMany({
        where: and(
            eq(operator_weapon.operator_id, operatorId),
            inArray(operator_weapon.weapon_id, [
                primaryWeapon.id,
                secondaryWeapon.id,
            ])
        ),
        columns: { weapon_id: true },
        with: {
            weapon: { columns: { slot: true } },
            op_weap_attachments: {
                columns: {},
                with: { attachment: { columns: { id: true, type: true } } },
            },
        },
    });

    const selectedWeapons = [
        { selected: primaryWeapon, slot: "Primary" },
        { selected: secondaryWeapon, slot: "Secondary" },
    ];

    return selectedWeapons.every(({ selected, slot }) => {
        const operatorWeapon = operatorWeapons.find(
            (weapon) => weapon.weapon_id === selected.id
        );

        if (isNil(operatorWeapon) || operatorWeapon.weapon.slot !== slot) {
            return false;
        }

        return isValidAttachmentSet(
            selected.attachments,
            operatorWeapon.op_weap_attachments.map(
                ({ attachment }) => attachment
            )
        );
    });
}

function isValidAttachmentSet(
    attachments: unknown,
    allowedAttachments: { id: number; type: string }[]
) {
    if (typeof attachments !== "object" || isNil(attachments)) {
        return false;
    }

    // Each key must be a known slot, and a chosen attachment must be allowed on
    // this weapon and belong to that slot
    return Object.entries(attachments).every(([slot, attachment]) =>
        isNil(attachment)
            ? ATTACHMENT_SLOTS.includes(slot)
            : allowedAttachments.some(
                  ({ id, type }) =>
                      id === attachment.id && type.toLowerCase() === slot
              )
    );
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
