CREATE TABLE "gadgets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "operator_gadgets" (
	"operator_id" integer,
	"gadget_id" integer,
	CONSTRAINT "operator_gadgets_operator_id_gadget_id_pk" PRIMARY KEY("operator_id","gadget_id")
);
--> statement-breakpoint
CREATE TABLE "operator_weapons" (
	"operator_id" integer,
	"weapon_id" integer,
	CONSTRAINT "operator_weapons_operator_id_weapon_id_pk" PRIMARY KEY("operator_id","weapon_id")
);
--> statement-breakpoint
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
ALTER TABLE "operator_gadgets" ADD CONSTRAINT "operator_gadgets_operator_id_operators_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."operators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operator_gadgets" ADD CONSTRAINT "operator_gadgets_gadget_id_gadgets_id_fk" FOREIGN KEY ("gadget_id") REFERENCES "public"."gadgets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operator_weapons" ADD CONSTRAINT "operator_weapons_operator_id_operators_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."operators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operator_weapons" ADD CONSTRAINT "operator_weapons_weapon_id_weapons_id_fk" FOREIGN KEY ("weapon_id") REFERENCES "public"."weapons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;