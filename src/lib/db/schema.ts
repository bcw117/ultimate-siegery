import { pgTable, pgPolicy, serial, text, index, foreignKey, integer, timestamp, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const attachment_type = pgEnum("attachment_type", ['Barrel', 'Sight', 'Grip', 'Underbarrel'])
export const side = pgEnum("side", ['Attacker', 'Defender'])
export const weapon_slot = pgEnum("weapon_slot", ['Primary', 'Secondary'])
export const weapon_type = pgEnum("weapon_type", ['AR', 'HG', 'LMG', 'MR', 'MP', 'SMG', 'SG', 'Shield'])


export const attachment = pgTable("attachment", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	type: attachment_type().notNull(),
	icon_url: text(),
}, (table) => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const gadget = pgTable("gadget", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	icon_url: text(),
}, (table) => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const loadout = pgTable("loadout", {
	id: serial().primaryKey().notNull(),
	name: text().default('').notNull(),
	user_id: text().notNull(),
	operator_id: integer().notNull(),
	gadget_id: integer().notNull(),
	pweapon_id: integer().notNull(),
	sweapon_id: integer().notNull(),
	created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_operator_id").using("btree", table.operator_id.asc().nullsLast().op("int4_ops")),
	index("idx_user_id").using("btree", table.user_id.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.operator_id],
			foreignColumns: [operator.id],
			name: "operator_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.gadget_id],
			foreignColumns: [gadget.id],
			name: "gadget_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.pweapon_id],
			foreignColumns: [weapon.id],
			name: "pweapon_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.sweapon_id],
			foreignColumns: [weapon.id],
			name: "sweapon_fk"
		}).onDelete("cascade"),
	pgPolicy("User can view their own tasks", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("Users must insert their own tasks", { as: "permissive", for: "insert", to: ["authenticated"] }),
]);

export const operator = pgTable("operator", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	health: integer().notNull(),
	speed: integer().notNull(),
	side: side().notNull(),
	unique_ability: text().notNull(),
	icon_url: text(),
	card_url: text(),
	figure_url: text(),
}, (table) => [
	index("idx_operator_side").using("btree", table.side.asc().nullsLast().op("enum_ops")),
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const weapon = pgTable("weapon", {
	id: serial().primaryKey().notNull(),
	slot: weapon_slot().notNull(),
	category: weapon_type().notNull(),
	name: text().notNull(),
	damage: integer(),
	fire_rate: integer(),
	capacity: integer(),
	ammo: integer(),
	icon_url: text(),
}, (table) => [
	index("idx_weapon_category").using("btree", table.category.asc().nullsLast().op("enum_ops")),
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const operator_gadget = pgTable("operator_gadget", {
	operator_id: integer().notNull(),
	gadget_id: integer().notNull(),
}, (table) => [
	index("idx_gadget_id").using("btree", table.gadget_id.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.operator_id],
			foreignColumns: [operator.id],
			name: "operator_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.gadget_id],
			foreignColumns: [gadget.id],
			name: "gadget_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.operator_id, table.gadget_id], name: "operator_gadget_operator_id_gadget_id_pk"}),
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const operator_weapon = pgTable("operator_weapon", {
	operator_id: integer().notNull(),
	weapon_id: integer().notNull(),
}, (table) => [
	index("idx_weapon_id").using("btree", table.weapon_id.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.operator_id],
			foreignColumns: [operator.id],
			name: "operator_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.weapon_id],
			foreignColumns: [weapon.id],
			name: "weapon_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.operator_id, table.weapon_id], name: "operator_weapon_operator_id_weapon_id_pk"}),
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const loadout_weapon_attachment = pgTable("loadout_weapon_attachment", {
	loadout_id: integer().notNull(),
	weapon_id: integer().notNull(),
	attachment_id: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.loadout_id],
			foreignColumns: [loadout.id],
			name: "loadout_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.weapon_id],
			foreignColumns: [weapon.id],
			name: "weapon_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.attachment_id],
			foreignColumns: [attachment.id],
			name: "attachment_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.loadout_id, table.weapon_id, table.attachment_id], name: "loadout_weapon_attachment_pkey"}),
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);

export const operator_weapon_attachment = pgTable("operator_weapon_attachment", {
	operator_id: integer().notNull(),
	weapon_id: integer().notNull(),
	attachment_id: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.operator_id, table.weapon_id],
			foreignColumns: [operator_weapon.operator_id, operator_weapon.weapon_id],
			name: "operator_weapon_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.attachment_id],
			foreignColumns: [attachment.id],
			name: "attachment_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.operator_id, table.weapon_id, table.attachment_id], name: "operator_weapon_attachment_pkey"}),
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
]);
