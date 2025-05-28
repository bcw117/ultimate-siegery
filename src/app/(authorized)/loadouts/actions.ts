import { getUser } from "@/utils/supabase/server";
import { db } from "@/db";
import { gadgets, loadouts, operators, weapons } from "@/db/schema";
import { eq } from "drizzle-orm";

import { alias } from "drizzle-orm/pg-core";

const primaryWeapons = alias(weapons, "primary_weapons");
const secondaryWeapons = alias(weapons, "secondary_weapons");

export async function getLoadouts() {
  const user = await getUser();

  if (!user) {
    throw Error;
  }

  const id = user.id;

  const results = await db
    .select({
      operator: {
        name: operators.name,
        side: operators.side,
      },
      weapons: {
        pweapon_name: primaryWeapons.name,
        sweapon_name: secondaryWeapons.name,
      },
      gadget: gadgets.name,
    })
    .from(loadouts)
    .where(eq(loadouts.user_id, id))
    .innerJoin(operators, eq(loadouts.operator_id, operators.id))
    .innerJoin(primaryWeapons, eq(loadouts.pweapon_id, primaryWeapons.id))
    .innerJoin(secondaryWeapons, eq(loadouts.sweapon_id, secondaryWeapons.id))
    .innerJoin(gadgets, eq(loadouts.gadget_id, gadgets.id));

  return results;
}
