-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "operators" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"side" text NOT NULL,
	"health" integer NOT NULL,
	"speed" integer NOT NULL,
	"difficulty" integer NOT NULL,
	"unique_ability" text NOT NULL,
	"image_url" text
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "gadgets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loadouts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"operator_id" integer NOT NULL,
	"gadget_id" integer NOT NULL,
	"pweapon_id" integer NOT NULL,
	"sweapon_id" integer NOT NULL
);
--> statement-breakpoint
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
--> statement-breakpoint
CREATE TABLE "operator_gadgets" (
	"operator_id" integer NOT NULL,
	"gadget_id" integer NOT NULL,
	CONSTRAINT "operator_gadgets_operator_id_gadget_id_pk" PRIMARY KEY("operator_id","gadget_id")
);
--> statement-breakpoint
CREATE TABLE "operator_weapons" (
	"operator_id" integer NOT NULL,
	"weapon_id" integer NOT NULL,
	CONSTRAINT "operator_weapons_operator_id_weapon_id_pk" PRIMARY KEY("operator_id","weapon_id")
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loadouts" ADD CONSTRAINT "loadouts_gadget_id_gadgets_id_fk" FOREIGN KEY ("gadget_id") REFERENCES "public"."gadgets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loadouts" ADD CONSTRAINT "loadouts_operator_id_operators_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."operators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loadouts" ADD CONSTRAINT "loadouts_pweapon_id_weapons_id_fk" FOREIGN KEY ("pweapon_id") REFERENCES "public"."weapons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loadouts" ADD CONSTRAINT "loadouts_sweapon_id_weapons_id_fk" FOREIGN KEY ("sweapon_id") REFERENCES "public"."weapons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loadouts" ADD CONSTRAINT "loadouts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operator_gadgets" ADD CONSTRAINT "operator_gadgets_gadget_id_gadgets_id_fk" FOREIGN KEY ("gadget_id") REFERENCES "public"."gadgets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operator_gadgets" ADD CONSTRAINT "operator_gadgets_operator_id_operators_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."operators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operator_weapons" ADD CONSTRAINT "operator_weapons_operator_id_operators_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."operators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operator_weapons" ADD CONSTRAINT "operator_weapons_weapon_id_weapons_id_fk" FOREIGN KEY ("weapon_id") REFERENCES "public"."weapons"("id") ON DELETE cascade ON UPDATE no action;
*/