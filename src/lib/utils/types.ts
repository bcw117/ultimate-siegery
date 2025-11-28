export type CursorData = {
  created_at: Date;
  id: number;
};

export type Operator = {
  id: number;
  name: string;
  side: string;
  speed: number;
  health: number;
  difficulty: number;
  unique_ability: string;
  icon_url: string | null;
  portrait_url: string | null;
};

export type Gadget = {
  id: number;
  name: string;
  icon_url: string;
};

export type Attachment = {
  id: number;
  name: string;
  type: string;
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
  attachments: {
    scope?: Attachment;
    grip?: Attachment;
    barrel?: Attachment;
    underbarrel?: Attachment;
  };
};

export type WeaponSlot = {
  id: number;
  name: string | null;
  class: string | null;
  type: string | null;
  base_damage: number | null;
  mag_size: number | null;
  ammo_cap: number | null;
  rof: number | null;
  attachments: {
    scope?: Attachment[];
    grip?: Attachment[];
    barrel?: Attachment[];
    underbarrel?: Attachment[];
  };
};

export type Loadout = {
  name: string;
  operator: Operator;
  primary_weapon: Weapon;
  secondary_weapon: Weapon;
  gadget: Gadget;
};

