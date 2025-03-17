"use server";

/**
 * Weapon related functions
 */

import { createClient } from "@/utils/supabase/server";
import { OPERATOR_COUNT } from "@/utils/helpers";

/**
 * Retrieves all weapons of an operator, seperated based on primaries and secondaries
 * @param operatorId ID of the operator give as an int
 * @returns Weapon object
 */
export async function getWeapons(operatorId: number) {
    const supabase = await createClient();

    // Get weapon id's
    const {data : weaponData, error : operatorWeaponError} = await supabase.from("operator_weapon").select("weapon_id")
                                                            .eq("operator_id", operatorId);
    
    if (operatorWeaponError) {
        throw operatorWeaponError;
    }

    if (!weaponData) {
        throw new Error("This operator has no weapons");
    }

    const weaponIds = weaponData.map((weapon) => {
        return weapon.weapon_id;
    })

    const {data : weapons, error: weaponError} = await supabase.from("weapons").select().in('id', weaponIds)
    
    if (weaponError) {
        throw weaponError;
    }
    return weapons;

    
}