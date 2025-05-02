import { sql } from "drizzle-orm";
import {
  pgSchema,
  uuid,
  pgTable,
  text,
  timestamp,
  integer,
  serial,
  primaryKey,
} from "drizzle-orm/pg-core";

const authSchema = pgSchema("auth");

export const users = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const profiles = pgTable("profiles", {
  id: uuid("id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  username: text("username").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).default(sql`CURRENT_TIMESTAMP`),
});

export const weapons = pgTable("weapons", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  class: text("class").notNull(),
  type: text("type").notNull(),
  base_damage: integer("base_damage"),
  mag_size: integer("mag_size"),
  ammo_cap: integer("ammo_cap"),
  rof: integer("rof"),
});

export const gadgets = pgTable("gadgets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const operators = pgTable("operators", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  side: text("side").notNull(),
  health: integer("health").notNull(),
  speed: integer("speed").notNull(),
  difficulty: integer("difficulty").notNull(),
  unique_ability: text("unique_ability").notNull(),
  image_url: text("image_url"),
});

export const operator_weapons = pgTable(
  "operator_weapons",
  {
    operator_id: integer("operator_id").references(() => operators.id, {
      onDelete: "cascade",
    }),
    weapon_id: integer("weapon_id").references(() => weapons.id, {
      onDelete: "cascade",
    }),
  },
  (table) => [primaryKey({ columns: [table.operator_id, table.weapon_id] })]
);

export const operator_gadgets = pgTable(
  "operator_gadgets",
  {
    operator_id: integer("operator_id").references(() => operators.id, {
      onDelete: "cascade",
    }),
    gadget_id: integer("gadget_id").references(() => gadgets.id, {
      onDelete: "cascade",
    }),
  },
  (table) => [primaryKey({ columns: [table.operator_id, table.gadget_id] })]
);
