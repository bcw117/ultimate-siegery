import { relations } from "drizzle-orm/relations";
import { usersInAuth, profiles, gadgets, loadouts, operators, weapons, operator_gadgets, operator_weapons } from "./schema";

export const profilesRelations = relations(profiles, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [profiles.id],
		references: [usersInAuth.id]
	}),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	profiles: many(profiles),
	loadouts: many(loadouts),
}));

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
	usersInAuth: one(usersInAuth, {
		fields: [loadouts.user_id],
		references: [usersInAuth.id]
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