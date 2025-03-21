"use server";

/**
 * Weapon related functions
 */

import { createClient } from "@/utils/supabase/server";
import { OPERATOR_COUNT } from "@/utils/helpers";
import { Weapon } from "@/lib/types/weapon";

export async function getRandomWeapon(
  operatorId: number,
  weaponType?: "Primary" | "Secondary"
): Promise<Weapon> {
  const weapons = await getWeapons(operatorId, weaponType);
  return getRandomElement(weapons) as Weapon;
}

/**
 * Retrieves all weapons of an operator, filtered based on parameter provided
 * @param operatorId ID of the operator give as an int
 * @param weaponType Optional parameter of weapon type, if empty returns all weapons
 * @returns An array of weapon objects
 */
export async function getWeapons(
  operatorId: number,
  weaponType?: "Primary" | "Secondary"
): Promise<Weapon[]> {
  const supabase = await createClient();

  // Get weapon id's through join
  const { data: weaponData, error: operatorWeaponError } = await supabase
    .from("operator_weapon")
    .select("weapon_id, weapons:weapons(*)")
    .eq("operator_id", operatorId);

  if (operatorWeaponError) {
    throw operatorWeaponError;
  }

  if (!weaponData || weaponData.length == 0) {
    throw new Error("Weapons not found");
  }

  let weapons = weaponData.map((weaponEntry) => {
    return weaponEntry.weapons as unknown as Weapon;
  });

  if (weaponType) {
    weapons = weapons.filter((weapon) => {
      return weapon.type === (weaponType as string);
    });
  }

  return weapons;
}

function getRandomElement(arr: unknown[]) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
