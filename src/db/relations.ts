import { relations } from "drizzle-orm/relations";
import { gadgets, loadouts, operators, weapons, profiles, operator_gadgets, operator_weapons, attachments, weapon_attachments } from "./schema";

export const loadoutsRelations = relations(loadouts, ({one}) => ({
	gadget: one(gadgets, {
		fields: [loadouts.gadget_id],
		references: [gadgets.id]
	}),
	operator: one(operators, {
		fields: [loadouts.operator_id],
		references: [operators.id]
	}),
	weapon_pweapon_id: one(weapons, {
		fields: [loadouts.pweapon_id],
		references: [weapons.id],
		relationName: "loadouts_pweapon_id_weapons_id"
	}),
	weapon_sweapon_id: one(weapons, {
		fields: [loadouts.sweapon_id],
		references: [weapons.id],
		relationName: "loadouts_sweapon_id_weapons_id"
	}),
	profile: one(profiles, {
		fields: [loadouts.user_id],
		references: [profiles.id]
	}),
}));

export const gadgetsRelations = relations(gadgets, ({many}) => ({
	loadouts: many(loadouts),
	operator_gadgets: many(operator_gadgets),
}));

export const operatorsRelations = relations(operators, ({many}) => ({
	loadouts: many(loadouts),
	operator_gadgets: many(operator_gadgets),
	operator_weapons: many(operator_weapons),
}));

export const weaponsRelations = relations(weapons, ({many}) => ({
	loadouts_pweapon_id: many(loadouts, {
		relationName: "loadouts_pweapon_id_weapons_id"
	}),
	loadouts_sweapon_id: many(loadouts, {
		relationName: "loadouts_sweapon_id_weapons_id"
	}),
	operator_weapons: many(operator_weapons),
	weapon_attachments: many(weapon_attachments),
}));

export const profilesRelations = relations(profiles, ({many}) => ({
	loadouts: many(loadouts),
}));

export const operator_gadgetsRelations = relations(operator_gadgets, ({one}) => ({
	gadget: one(gadgets, {
		fields: [operator_gadgets.gadget_id],
		references: [gadgets.id]
	}),
	operator: one(operators, {
		fields: [operator_gadgets.operator_id],
		references: [operators.id]
	}),
}));

export const operator_weaponsRelations = relations(operator_weapons, ({one}) => ({
	operator: one(operators, {
		fields: [operator_weapons.operator_id],
		references: [operators.id]
	}),
	weapon: one(weapons, {
		fields: [operator_weapons.weapon_id],
		references: [weapons.id]
	}),
}));

export const weapon_attachmentsRelations = relations(weapon_attachments, ({one}) => ({
	attachment: one(attachments, {
		fields: [weapon_attachments.attachment_id],
		references: [attachments.id]
	}),
	weapon: one(weapons, {
		fields: [weapon_attachments.weapon_id],
		references: [weapons.id]
	}),
}));

export const attachmentsRelations = relations(attachments, ({many}) => ({
	weapon_attachments: many(weapon_attachments),
}));