import { relations } from "drizzle-orm/relations";
import {
  operator,
  loadout,
  gadget,
  weapon,
  operator_gadget,
  operator_weapon,
  operator_weapon_attachment,
  attachment,
  loadout_attachment,
} from "./schema";

export const loadoutRelations = relations(loadout, ({ one }) => ({
  operator: one(operator, {
    fields: [loadout.operator_id],
    references: [operator.id],
  }),
  gadget: one(gadget, { fields: [loadout.gadget_id], references: [gadget.id] }),
  primary_weapon: one(weapon, {
    fields: [loadout.pweapon_id],
    references: [weapon.id],
    relationName: "loadout_pweapon_id_weapon_id",
  }),
  secondary_weapon: one(weapon, {
    fields: [loadout.sweapon_id],
    references: [weapon.id],
    relationName: "loadout_sweapon_id_weapon_id",
  }),
}));

export const operatorRelations = relations(operator, ({ many }) => ({
  loadouts: many(loadout),
  operator_gadgets: many(operator_gadget),
  operator_weapons: many(operator_weapon),
}));

export const gadgetRelations = relations(gadget, ({ many }) => ({
  loadouts: many(loadout),
  operator_gadgets: many(operator_gadget),
}));

export const weaponRelations = relations(weapon, ({ many }) => ({
  loadouts_pweapon_id: many(loadout, {
    relationName: "loadout_pweapon_id_weapon_id",
  }),
  loadouts_sweapon_id: many(loadout, {
    relationName: "loadout_sweapon_id_weapon_id",
  }),
  operator_weapons: many(operator_weapon),
  loadout_attachments: many(loadout_attachment),
}));

export const operator_gadgetRelations = relations(
  operator_gadget,
  ({ one }) => ({
    operator: one(operator, {
      fields: [operator_gadget.operator_id],
      references: [operator.id],
    }),
    gadget: one(gadget, {
      fields: [operator_gadget.gadget_id],
      references: [gadget.id],
    }),
  })
);

export const operator_weaponRelations = relations(
  operator_weapon,
  ({ one, many }) => ({
    operator: one(operator, {
      fields: [operator_weapon.operator_id],
      references: [operator.id],
    }),
    weapon: one(weapon, {
      fields: [operator_weapon.weapon_id],
      references: [weapon.id],
    }),
    operator_weapon_attachments: many(operator_weapon_attachment),
  })
);

export const operator_weapon_attachmentRelations = relations(
  operator_weapon_attachment,
  ({ one }) => ({
    operator_weapon: one(operator_weapon, {
      fields: [
        operator_weapon_attachment.operator_id,
        operator_weapon_attachment.weapon_id,
      ],
      references: [operator_weapon.operator_id, operator_weapon.weapon_id],
    }),
    attachment: one(attachment, {
      fields: [operator_weapon_attachment.attachment_id],
      references: [attachment.id],
    }),
  })
);

export const attachmentRelations = relations(attachment, ({ many }) => ({
  operator_weapon_attachments: many(operator_weapon_attachment),
  loadout_attachments: many(loadout_attachment),
}));

export const loadout_attachmentRelations = relations(
  loadout_attachment,
  ({ one }) => ({
    weapon: one(weapon, {
      fields: [loadout_attachment.weapon_id],
      references: [weapon.id],
    }),
    attachment: one(attachment, {
      fields: [loadout_attachment.attachment_id],
      references: [attachment.id],
    }),
  })
);
