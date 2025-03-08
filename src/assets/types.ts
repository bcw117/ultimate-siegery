export interface Operator {
  name: string;
  side: "Attacker" | "Defender";
  image?: string;
}

export interface Weapon {
  name: string;
  type: "Primary" | "Secondary";
  image?: string;
}

export interface Gadget {
  name: string;
  image?: string;
}

export interface Loadout {
  operator: Operator;
  primaryWeapon: Weapon;
  secondaryWeapon: Weapon;
  gadget: Gadget;
}

export interface GameMode {
  name: string;
  rounds: number;
  description: string;
}

export interface SavedLoadout extends Loadout {
  id: string;
  name: string;
  createdAt: Date;
}

export type GenerationType = "SingleOperator" | "FullTeam" | "Bans";
