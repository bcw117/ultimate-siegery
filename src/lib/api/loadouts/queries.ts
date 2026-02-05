import { loadout } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";
import { db } from "@/lib/db/index";
import { ActionResponse } from "@/db/types";
import { isNil } from "lodash";

const processAttachments = (attachments: any[]) => {
  return attachments.reduce((acc, { attachment }) => {
    const type = attachment.type.toLowerCase();
    const key = type === "sight" ? "scope" : type;
    acc[key] = attachment;
    return acc;
  }, {} as any);
};

// TODO: add actual types to actions
export async function fetchLoadout(id: number): Promise<ActionResponse<any>> {
  try {
    const data = await db.query.loadout.findFirst({
      where: eq(loadout.id, id),
      columns: { id: true, created_at: true, name: true },
      with: {
        operator: true,
        gadget: true,
        primary_weapon: {
          with: {
            loadout_attachments: { columns: {}, with: { attachment: true } },
          },
        },
        secondary_weapon: {
          with: {
            loadout_attachments: { columns: {}, with: { attachment: true } },
          },
        },
      },
    });

    if (isNil(data)) {
      return { ok: false, error: "Loadout not found" };
    }

    const { loadout_attachments: pAttachments, ...primaryWeapon } =
      data.primary_weapon;
    const { loadout_attachments: sAttachments, ...secondaryWeapon } =
      data.secondary_weapon;

    const response = {
      ...data,
      primary_weapon: {
        ...primaryWeapon,
        attachments: processAttachments(pAttachments),
      },
      secondary_weapon: {
        ...secondaryWeapon,
        attachments: processAttachments(pAttachments),
      },
    };

    return { ok: true, data: response };
  } catch (e) {
    return { ok: false, error: "Unable to fetch loadouts" };
  }
}

export async function fetchLoadouts(): Promise<ActionResponse<any>> {
  try {
    const data = await db.query.loadout.findMany({
      columns: { id: true, created_at: true, name: true },
      with: {
        operator: true,
        gadget: true,
        primary_weapon: {
          with: {
            loadout_attachments: { columns: {}, with: { attachment: true } },
          },
        },
        secondary_weapon: {
          with: {
            loadout_attachments: { columns: {}, with: { attachment: true } },
          },
        },
      },
    });

    const response = data.map((loadout) => {
      const { loadout_attachments: pAttachments, ...primaryWeapon } =
        loadout.primary_weapon;
      const { loadout_attachments: sAttachments, ...secondaryWeapon } =
        loadout.secondary_weapon;

      return {
        ...loadout,
        primary_weapon: {
          ...primaryWeapon,
          attachments: processAttachments(pAttachments),
        },
        secondary_weapon: {
          ...secondaryWeapon,
          attachments: processAttachments(pAttachments),
        },
      };
    });

    return { ok: true, data: response };
  } catch (e) {
    return { ok: false, error: "Unable to fetch loadouts" };
  }
}
