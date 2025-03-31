import { Gadget } from "./gadget";
import { Weapon } from "./weapon";

export type Operator = {
  id: number;
  name: string;
  side: string;
  health: number;
  difficulty: number;
  unique_ability: string;
};

export type OperatorWithLoadout = Operator & {
  primary_weapon: Weapon;
  secondary_weapon: Weapon;
  gadget: Gadget;
};
