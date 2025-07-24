import {
  pgTable,
  pgPolicy,
  integer,
  text,
  serial,
  timestamp,
  foreignKey,
  primaryKey,
  bigint,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const attachments = pgTable(
  "attachments",
  {
    id: integer().primaryKey().generatedByDefaultAsIdentity({
      name: "attachments_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    name: text().notNull(),
    type: text().notNull(),
  },
  (table) => [
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
  ]
);

export const gadgets = pgTable(
  "gadgets",
  {
    id: serial().primaryKey().notNull(),
    name: text().notNull(),
  },
  (table) => [
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
  ]
);

export const weapons = pgTable(
  "weapons",
  {
    id: serial().primaryKey().notNull(),
    name: text().notNull(),
    class: text().notNull(),
    type: text().notNull(),
    base_damage: integer(),
    mag_size: integer(),
    ammo_cap: integer(),
    rof: integer(),
  },
  (table) => [
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
  ]
);

export const profiles = pgTable(
  "profiles",
  {
    username: text().notNull(),
    first_name: text().notNull(),
    last_name: text().notNull(),
    avatar_url: text(),
    created_at: timestamp({ withTimezone: true, mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`
    ),
    id: text().primaryKey().notNull(),
  },
  (table) => [
    pgPolicy("User can view their own profile", {
      as: "permissive",
      for: "select",
      to: ["authenticated"],
      using: sql`(( SELECT (auth.jwt() ->> 'sub'::text)) = id)`,
    }),
  ]
);

export const loadouts = pgTable(
  "loadouts",
  {
    id: serial().primaryKey().notNull(),
    operator_id: integer().notNull(),
    gadget_id: integer().notNull(),
    pweapon_id: integer().notNull(),
    sweapon_id: integer().notNull(),
    created_at: timestamp({ mode: "string" }).defaultNow().notNull(),
    user_id: text().notNull(),
    name: text().default(""),
  },
  (table) => [
    foreignKey({
      columns: [table.gadget_id],
      foreignColumns: [gadgets.id],
      name: "loadouts_gadget_id_gadgets_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.operator_id],
      foreignColumns: [operators.id],
      name: "loadouts_operator_id_operators_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.pweapon_id],
      foreignColumns: [weapons.id],
      name: "loadouts_pweapon_id_weapons_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.sweapon_id],
      foreignColumns: [weapons.id],
      name: "loadouts_sweapon_id_weapons_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.user_id],
      foreignColumns: [profiles.id],
      name: "loadouts_user_id_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    pgPolicy("Users must insert their own loadouts", {
      as: "permissive",
      for: "insert",
      to: ["authenticated"],
      withCheck: sql`(( SELECT (auth.jwt() ->> 'sub'::text)) = user_id)`,
    }),
    pgPolicy("User can view their own loadouts", {
      as: "permissive",
      for: "select",
      to: ["authenticated"],
    }),
  ]
);

export const operators = pgTable(
  "operators",
  {
    id: serial().primaryKey().notNull(),
    name: text().notNull(),
    side: text().notNull(),
    health: integer().notNull(),
    speed: integer().notNull(),
    difficulty: integer().notNull(),
    unique_ability: text().notNull(),
    image_url: text(),
  },
  (table) => [
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
  ]
);

export const operator_weapons = pgTable(
  "operator_weapons",
  {
    operator_id: integer().notNull(),
    weapon_id: integer().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.operator_id],
      foreignColumns: [operators.id],
      name: "operator_weapons_operator_id_operators_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.weapon_id],
      foreignColumns: [weapons.id],
      name: "operator_weapons_weapon_id_weapons_id_fk",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.operator_id, table.weapon_id],
      name: "operator_weapons_operator_id_weapon_id_pk",
    }),
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
  ]
);

export const operator_gadgets = pgTable(
  "operator_gadgets",
  {
    operator_id: integer().notNull(),
    gadget_id: integer().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.gadget_id],
      foreignColumns: [gadgets.id],
      name: "operator_gadgets_gadget_id_gadgets_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.operator_id],
      foreignColumns: [operators.id],
      name: "operator_gadgets_operator_id_operators_id_fk",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.operator_id, table.gadget_id],
      name: "operator_gadgets_operator_id_gadget_id_pk",
    }),
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
  ]
);

export const weapon_attachments = pgTable(
  "weapon_attachments",
  {
    weapon_id: integer().notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    attachment_id: bigint({ mode: "number" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.attachment_id],
      foreignColumns: [attachments.id],
      name: "weapon_attachments_attachment_id_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.weapon_id],
      foreignColumns: [weapons.id],
      name: "weapon_attachments_weapon_id_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    primaryKey({
      columns: [table.weapon_id, table.attachment_id],
      name: "weapon_attachments_pkey",
    }),
    pgPolicy("Enable read access for all users", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`true`,
    }),
  ]
);
