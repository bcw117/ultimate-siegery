export type Loadout = {
  operator: Operator;
  pweapon: Weapon;
  sweapon: Weapon;
  gadget: Gadget;
};

export type Operator = {
  id: number;
  name: string;
  side: string;
  speed: number;
  health: number;
  difficulty: number;
  unique_ability: string;
};

export type OperatorWithLoadout = Operator & {
  primary_weapon: Weapon;
  secondary_weapon: Weapon;
  gadget: Gadget;
};

export type Gadget = {
  id: number;
  name: string;
};

export type Weapon = {
  id: number;
  name: string | null;
  class: string | null;
  type: string | null;
  base_damage: number | null;
  mag_size: number | null;
  ammo_cap: number | null;
  rof: number | null;
};
