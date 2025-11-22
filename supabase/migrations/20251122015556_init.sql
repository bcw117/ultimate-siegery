-- Create tables
CREATE TABLE "operators" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"side" text NOT NULL,
	"health" integer NOT NULL,
	"speed" integer NOT NULL,
	"difficulty" integer NOT NULL,
	"unique_ability" text NOT NULL,
	"icon_url" text,
    "portrait_url" text
);

CREATE TABLE "weapons" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"class" text NOT NULL,
	"type" text NOT NULL,
	"base_damage" integer,
	"mag_size" integer,
	"ammo_cap" integer,
	"rof" integer
);

CREATE TABLE "gadgets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
    "icon_url" text
);

CREATE TABLE "attachments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL
);

CREATE TABLE "operator_gadgets" (
	"operator_id" integer NOT NULL,
	"gadget_id" integer NOT NULL,
	CONSTRAINT "operator_gadgets_operator_id_gadget_id_pk" PRIMARY KEY("operator_id","gadget_id"),
    CONSTRAINT "operator_fk" FOREIGN KEY ("operator_id") REFERENCES "operators"("id")
        ON DELETE CASCADE,
    CONSTRAINT "gadget_fk" FOREIGN KEY ("gadget_id") REFERENCES "gadgets"("id")
        ON DELETE CASCADE
);

CREATE TABLE "operator_weapons" (
	"operator_id" integer NOT NULL,
	"weapon_id" integer NOT NULL,
	CONSTRAINT "operator_weapons_operator_id_weapon_id_pk" PRIMARY KEY("operator_id","weapon_id"),
    CONSTRAINT "operator_fk" FOREIGN KEY ("operator_id") REFERENCES "operators"("id")
        ON DELETE CASCADE,
    CONSTRAINT "weapon_fk" FOREIGN KEY ("weapon_id") REFERENCES "weapons"("id")
        ON DELETE CASCADE
);

CREATE TABLE "weapon_attachments" (
	"weapon_id" integer NOT NULL,
	"attachment_id" bigint NOT NULL,
	CONSTRAINT "weapon_attachments_pkey" PRIMARY KEY("weapon_id","attachment_id")
);

CREATE TABLE "loadouts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text DEFAULT '',
	"user_id" text NOT NULL,
	"operator_id" integer NOT NULL,
	"gadget_id" integer NOT NULL,
	"pweapon_id" integer NOT NULL,
	"sweapon_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "operator_fk" FOREIGN KEY ("operator_id") REFERENCES "operators"("id")
        ON DELETE CASCADE,
    CONSTRAINT "gadget_fk" FOREIGN KEY ("gadget_id") REFERENCES "gadgets"("id")
        ON DELETE CASCADE,
    CONSTRAINT "pweapon_fk" FOREIGN KEY ("pweapon_id") REFERENCES "weapons"("id")
        ON DELETE CASCADE,
    CONSTRAINT "sweapon_fk" FOREIGN KEY ("sweapon_id") REFERENCES "weapons"("id")
        ON DELETE CASCADE
);

CREATE TABLE "loadout_attachments" (
	"loadout_id" integer NOT NULL,
	"weapon_id" integer NOT NULL,
	"attachment_id" integer NOT NULL,
	CONSTRAINT "loadout_attachments_pkey" PRIMARY KEY("loadout_id","weapon_id","attachment_id")
);

-- Indexes
CREATE INDEX "idx_operators_side" ON "operators"("side");
CREATE INDEX "idx_weapons_type" ON "weapons"("type");

CREATE INDEX "idx_gadget_id" ON "operator_gadgets" ("gadget_id");
CREATE INDEX "idx_weapon_id" ON "operator_weapons" ("weapon_id");

CREATE INDEX "idx_user_id" ON "loadouts"("user_id");
CREATE INDEX "idx_operator_id" ON "loadouts"("operator_id");

-- RLS
ALTER TABLE "attachments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "weapon_attachments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "gadgets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "loadouts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "operator_gadgets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "operator_weapons" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "operators" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "weapons" ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for all users" ON "operators" AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Enable read access for all users" ON "gadgets" AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Users must insert their own tasks" ON "loadouts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((( SELECT (auth.jwt() ->> 'sub'::text)) = user_id));
CREATE POLICY "User can view their own tasks" ON "loadouts" AS PERMISSIVE FOR SELECT TO "authenticated";
CREATE POLICY "Enable read access for all users" ON "weapons" AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Enable read access for all users" ON "operator_gadgets" AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Enable read access for all users" ON "operator_weapons" AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Enable read access for all users" ON "attachments" AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Enable read access for all users" ON "weapon_attachments" AS PERMISSIVE FOR SELECT TO public USING (true);
