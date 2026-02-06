CREATE TYPE side AS ENUM ('Attacker', 'Defender');

CREATE TABLE "operator" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"health" integer NOT NULL,
	"speed" integer NOT NULL,
	"side" side NOT NULL,
	"unique_ability" text NOT NULL,
	"icon_url" text,
    "card_url" text,
	"figure_url" text
);

CREATE TYPE weapon_slot AS ENUM ('Primary', 'Secondary');
CREATE TYPE weapon_type AS ENUM ('AR', 'HG', 'LMG', 'MR', 'MP', 'SMG', 'SG', 'Shield');

CREATE TABLE "weapon" (
	"id" serial PRIMARY KEY NOT NULL,
	"slot" weapon_slot NOT NULL,
	"category" weapon_type NOT NULL,
	"name" text NOT NULL,
	"damage" integer,
	"fire_rate" integer,
	"capacity" integer,
	"ammo" integer,
	"icon_url" text
);

CREATE TABLE "gadget" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
    "icon_url" text
);

CREATE TYPE attachment_type AS ENUM ('Barrel', 'Sight', 'Grip', 'Underbarrel');

CREATE TABLE "attachment" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" attachment_type NOT NULL,
	"icon_url" text
);

CREATE TABLE "operator_gadget" (
	"operator_id" integer NOT NULL,
	"gadget_id" integer NOT NULL,
	CONSTRAINT "operator_gadget_operator_id_gadget_id_pk" PRIMARY KEY("operator_id","gadget_id"),
    CONSTRAINT "operator_fk" FOREIGN KEY ("operator_id") REFERENCES "operator"("id"),
    CONSTRAINT "gadget_fk" FOREIGN KEY ("gadget_id") REFERENCES "gadget"("id")
);

CREATE TABLE "operator_weapon" (
	"operator_id" integer NOT NULL,
	"weapon_id" integer NOT NULL,
	CONSTRAINT "operator_weapon_operator_id_weapon_id_pk" PRIMARY KEY("operator_id","weapon_id"),
    CONSTRAINT "operator_fk" FOREIGN KEY ("operator_id") REFERENCES "operator"("id"),
    CONSTRAINT "weapon_fk" FOREIGN KEY ("weapon_id") REFERENCES "weapon"("id")
);

CREATE TABLE "operator_weapon_attachment" (
  	"operator_id" integer NOT NULL,
	"weapon_id" integer NOT NULL,
	"attachment_id" integer NOT NULL,
  	CONSTRAINT "operator_weapon_attachment_pkey" PRIMARY KEY("operator_id", "weapon_id","attachment_id"),
	CONSTRAINT "operator_weapon_fk" FOREIGN KEY ("operator_id", "weapon_id") REFERENCES "operator_weapon"("operator_id", "weapon_id"),
	CONSTRAINT "attachment_fk" FOREIGN KEY ("attachment_id") REFERENCES "attachment"("id")
);

CREATE TABLE "loadout" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"user_id" text NOT NULL,
	"operator_id" integer NOT NULL,
	"gadget_id" integer NOT NULL,
	"pweapon_id" integer NOT NULL,
	"sweapon_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "operator_fk" FOREIGN KEY ("operator_id") REFERENCES "operator"("id"),
    CONSTRAINT "gadget_fk" FOREIGN KEY ("gadget_id") REFERENCES "gadget"("id"),
    CONSTRAINT "pweapon_fk" FOREIGN KEY ("pweapon_id") REFERENCES "weapon"("id"),
    CONSTRAINT "sweapon_fk" FOREIGN KEY ("sweapon_id") REFERENCES "weapon"("id")
);

CREATE TABLE "loadout_weapon_attachment" (
	"loadout_id" integer NOT NULL,
	"weapon_id" integer NOT NULL,
	"attachment_id" integer NOT NULL,
	CONSTRAINT "loadout_weapon_attachment_pkey" PRIMARY KEY("loadout_id","weapon_id","attachment_id"),
	CONSTRAINT "loadout_fk" FOREIGN KEY ("loadout_id") REFERENCES "loadout"("id")
		ON DELETE CASCADE,
	CONSTRAINT "weapon_fk" FOREIGN KEY ("weapon_id") REFERENCES "weapon"("id"),
	CONSTRAINT "attachment_fk" FOREIGN KEY ("attachment_id") REFERENCES "attachment"("id")
);

-- Indexes
CREATE INDEX "idx_operator_side" ON "operator"("side");
CREATE INDEX "idx_weapon_category" ON "weapon"("category");

CREATE INDEX "idx_gadget_id" ON "operator_gadget" ("gadget_id");
CREATE INDEX "idx_weapon_id" ON "operator_weapon" ("weapon_id");

CREATE INDEX "idx_user_id" ON "loadout"("user_id");
CREATE INDEX "idx_operator_id" ON "loadout"("operator_id");

-- RLS
ALTER TABLE "attachment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "gadget" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "loadout" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "operator_gadget" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "operator_weapon" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "operator" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "weapon" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "loadout_weapon_attachment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "operator_weapon_attachment" ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for all users" ON "operator" AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Enable read access for all users" ON "gadget" AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Users must insert their own tasks" ON "loadout" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((( SELECT (auth.jwt() ->> 'sub'::text)) = user_id));
CREATE POLICY "User can view their own tasks" ON "loadout" AS PERMISSIVE FOR SELECT TO "authenticated";
CREATE POLICY "Enable read access for all users" ON "weapon" AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Enable read access for all users" ON "operator_gadget" AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Enable read access for all users" ON "operator_weapon" AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Enable read access for all users" ON "attachment" AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Enable read access for all users" ON "loadout_weapon_attachment" AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Enable read access for all users" ON "operator_weapon_attachment" AS PERMISSIVE FOR SELECT TO public USING (true);
