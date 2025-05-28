import { pgTable, serial, text, integer, foreignKey, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const operators = pgTable("operators", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	side: text().notNull(),
	health: integer().notNull(),
	speed: integer().notNull(),
	difficulty: integer().notNull(),
	unique_ability: text().notNull(),
	image_url: text(),
});

export const profiles = pgTable("profiles", {
	id: uuid().primaryKey().notNull(),
	username: text().notNull(),
	first_name: text().notNull(),
	last_name: text().notNull(),
	email: text().notNull(),
	avatar_url: text(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.id],
			foreignColumns: [users.id],
			name: "profiles_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const gadgets = pgTable("gadgets", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
});

export const loadouts = pgTable("loadouts", {
	id: serial().primaryKey().notNull(),
	user_id: uuid().notNull(),
	operator_id: integer().notNull(),
	gadget_id: integer().notNull(),
	pweapon_id: integer().notNull(),
	sweapon_id: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.gadget_id],
			foreignColumns: [gadgets.id],
			name: "loadouts_gadget_id_gadgets_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.operator_id],
			foreignColumns: [operators.id],
			name: "loadouts_operator_id_operators_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.pweapon_id],
			foreignColumns: [weapons.id],
			name: "loadouts_pweapon_id_weapons_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.sweapon_id],
			foreignColumns: [weapons.id],
			name: "loadouts_sweapon_id_weapons_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.user_id],
			foreignColumns: [users.id],
			name: "loadouts_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const weapons = pgTable("weapons", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	class: text().notNull(),
	type: text().notNull(),
	base_damage: integer(),
	mag_size: integer(),
	ammo_cap: integer(),
	rof: integer(),
});

export const operator_gadgets = pgTable("operator_gadgets", {
	operator_id: integer().notNull(),
	gadget_id: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.gadget_id],
			foreignColumns: [gadgets.id],
			name: "operator_gadgets_gadget_id_gadgets_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.operator_id],
			foreignColumns: [operators.id],
			name: "operator_gadgets_operator_id_operators_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.operator_id, table.gadget_id], name: "operator_gadgets_operator_id_gadget_id_pk"}),
]);

export const operator_weapons = pgTable("operator_weapons", {
	operator_id: integer().notNull(),
	weapon_id: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.operator_id],
			foreignColumns: [operators.id],
			name: "operator_weapons_operator_id_operators_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.weapon_id],
			foreignColumns: [weapons.id],
			name: "operator_weapons_weapon_id_weapons_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.operator_id, table.weapon_id], name: "operator_weapons_operator_id_weapon_id_pk"}),
]);
