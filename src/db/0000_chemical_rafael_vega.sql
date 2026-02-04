-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."attachment_type" AS ENUM('Barrel', 'Sight', 'Grip', 'Underbarrel');--> statement-breakpoint
CREATE TYPE "public"."side" AS ENUM('Attacker', 'Defender');--> statement-breakpoint
CREATE TYPE "public"."weapon_slot" AS ENUM('Primary', 'Secondary');--> statement-breakpoint
CREATE TYPE "public"."weapon_type" AS ENUM('AR', 'HG', 'LMG', 'MR', 'MP', 'SMG', 'SG', 'Shield');--> statement-breakpoint
CREATE TABLE "attachment" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "attachment_type" NOT NULL,
	"icon_url" text
);
--> statement-breakpoint
ALTER TABLE "attachment" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "gadget" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"icon_url" text
);
--> statement-breakpoint
ALTER TABLE "gadget" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "loadouts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text DEFAULT '',
	"user_id" text NOT NULL,
	"operator_id" integer NOT NULL,
	"gadget_id" integer NOT NULL,
	"pweapon_id" integer NOT NULL,
	"sweapon_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "loadouts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "operator" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"health" integer NOT NULL,
	"speed" integer NOT NULL,
	"side" "side" NOT NULL,
	"unique_ability" text NOT NULL,
	"icon_url" text,
	"card_url" text,
	"figure_url" text
);
--> statement-breakpoint
ALTER TABLE "operator" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "weapon" (
	"id" serial PRIMARY KEY NOT NULL,
	"slot" "weapon_slot" NOT NULL,
	"category" "weapon_type" NOT NULL,
	"name" text NOT NULL,
	"damage" integer,
	"fire_rate" integer,
	"capacity" integer,
	"ammo" integer,
	"icon_url" text
);
--> statement-breakpoint
ALTER TABLE "weapon" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "weapon_attachment" (
	"weapon_id" integer NOT NULL,
	"attachment_id" integer NOT NULL,
	CONSTRAINT "weapon_attachment_pkey" PRIMARY KEY("weapon_id","attachment_id")
);
--> statement-breakpoint
ALTER TABLE "weapon_attachment" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "operator_gadget" (
	"operator_id" integer NOT NULL,
	"gadget_id" integer NOT NULL,
	CONSTRAINT "operator_gadget_operator_id_gadget_id_pk" PRIMARY KEY("operator_id","gadget_id")
);
--> statement-breakpoint
ALTER TABLE "operator_gadget" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "operator_weapon" (
	"operator_id" integer NOT NULL,
	"weapon_id" integer NOT NULL,
	CONSTRAINT "operator_weapon_operator_id_weapon_id_pk" PRIMARY KEY("operator_id","weapon_id")
);
--> statement-breakpoint
ALTER TABLE "operator_weapon" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "operator_weapon_attachment" (
	"operator_id" integer NOT NULL,
	"weapon_id" integer NOT NULL,
	"attachment_id" integer NOT NULL,
	CONSTRAINT "operator_weapon_attachment_pkey" PRIMARY KEY("operator_id","weapon_id","attachment_id")
);
--> statement-breakpoint
CREATE TABLE "loadout_attachment" (
	"loadout_id" integer NOT NULL,
	"weapon_id" integer NOT NULL,
	"attachment_id" integer NOT NULL,
	CONSTRAINT "loadout_attachment_pkey" PRIMARY KEY("loadout_id","weapon_id","attachment_id")
);
--> statement-breakpoint
ALTER TABLE "loadouts" ADD CONSTRAINT "operator_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."operator"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loadouts" ADD CONSTRAINT "gadget_fk" FOREIGN KEY ("gadget_id") REFERENCES "public"."gadget"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loadouts" ADD CONSTRAINT "pweapon_fk" FOREIGN KEY ("pweapon_id") REFERENCES "public"."weapon"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loadouts" ADD CONSTRAINT "sweapon_fk" FOREIGN KEY ("sweapon_id") REFERENCES "public"."weapon"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weapon_attachment" ADD CONSTRAINT "weapon_fk" FOREIGN KEY ("weapon_id") REFERENCES "public"."weapon"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weapon_attachment" ADD CONSTRAINT "attachment_fk" FOREIGN KEY ("attachment_id") REFERENCES "public"."attachment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operator_gadget" ADD CONSTRAINT "operator_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."operator"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operator_gadget" ADD CONSTRAINT "gadget_fk" FOREIGN KEY ("gadget_id") REFERENCES "public"."gadget"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operator_weapon" ADD CONSTRAINT "operator_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."operator"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operator_weapon" ADD CONSTRAINT "weapon_fk" FOREIGN KEY ("weapon_id") REFERENCES "public"."weapon"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operator_weapon_attachment" ADD CONSTRAINT "operator_weapon_fk" FOREIGN KEY ("operator_id","weapon_id") REFERENCES "public"."operator_weapon"("operator_id","weapon_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operator_weapon_attachment" ADD CONSTRAINT "attachment_fk" FOREIGN KEY ("attachment_id") REFERENCES "public"."attachment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loadout_attachment" ADD CONSTRAINT "weapon_fk" FOREIGN KEY ("weapon_id") REFERENCES "public"."weapon"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loadout_attachment" ADD CONSTRAINT "attachment_fk" FOREIGN KEY ("attachment_id") REFERENCES "public"."attachment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_operator_id" ON "loadouts" USING btree ("operator_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_user_id" ON "loadouts" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_operator_side" ON "operator" USING btree ("side" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_weapon_category" ON "weapon" USING btree ("category" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_gadget_id" ON "operator_gadget" USING btree ("gadget_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_weapon_id" ON "operator_weapon" USING btree ("weapon_id" int4_ops);--> statement-breakpoint
CREATE POLICY "Enable read access for all users" ON "attachment" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "Enable read access for all users" ON "gadget" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "User can view their own tasks" ON "loadouts" AS PERMISSIVE FOR SELECT TO "authenticated";--> statement-breakpoint
CREATE POLICY "Users must insert their own tasks" ON "loadouts" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "Enable read access for all users" ON "operator" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "Enable read access for all users" ON "weapon" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "Enable read access for all users" ON "weapon_attachment" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "Enable read access for all users" ON "operator_gadget" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "Enable read access for all users" ON "operator_weapon" AS PERMISSIVE FOR SELECT TO public USING (true);
*/