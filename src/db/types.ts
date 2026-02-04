export enum AttachmentType {
  Barrel = "Barrel",
  Grip = "Grip",
  Sight = "Sight",
  Underbarrel = "Underbarrel",
}

export enum Side {
  Attacker = "Attacker",
  Defender = "Defender",
}

export enum WeaponType {
  AR = "AR",
  HG = "HG",
  LMG = "LMG",
  MR = "MR",
  MP = "MP",
  SMG = "SMG",
  SG = "SG",
  Shield = "Shield",
}

export enum WeaponSlot {
  Primary = "Primary",
  Secondary = "Secondary",
}

export type AttachmentRecord = {
  id: number;
  name: string;
  type: AttachmentType;
  icon_url?: string;
};

export type GadgetRecord = { id: number; name: string; icon_url?: string };

export type OperatorRecord = {
  id: number;
  name: string;
  health: number;
  speed: number;
  side: Side;
  unique_ability: string;
  icon_url?: string;
  card_url?: string;
  figure_url?: string;
};

export type WeaponRecord = {
  id: number;
  slot: WeaponSlot;
  category: WeaponType;
  name: string;
  damage: number;
  fire_rate: number;
  capacity: number;
  ammo: number;
  icon_url?: string;
};

export type LoadoutRecord = {
  id: number;
  name: string;
  user_id: string;
  operator_id: number;
  gadget_id: number;
  pweapon_id: number;
  sweapon_id: number;
  created_at: Date;
};

export type Attachment = Omit<AttachmentRecord, "id">;

export type Weapon = Omit<WeaponRecord, "id">;

export type Operator = Omit<OperatorRecord, "id">;

export type Gadget = Omit<GadgetRecord, "id">;

export type Loadout = Omit<LoadoutRecord, "id">;

export type LoadoutDisplay = {
  id: number;
  name: string;
  operator: OperatorRecord;
  primary_weapon: WeaponWithAttachments;
  secondary_weapon: WeaponWithAttachments;
  gadget: GadgetRecord;
};

export type OperatorFullLoadout = OperatorRecord & {
  operator_gadgets: GadgetRecord[];
  operator_weapons: WeaponWithAllAttachments[];
};

export type WeaponWithAttachments = WeaponRecord & {
  attachments: {
    scope?: AttachmentRecord;
    grip?: AttachmentRecord;
    barrel?: AttachmentRecord;
    underbarrel?: AttachmentRecord;
  };
};

export type WeaponWithAllAttachments = WeaponRecord & {
  attachments: AttachmentRecord[];
};

export type ActionResponse<T> = ActionError | ActionResult<T>;

export type ActionError = { ok: false; error: string };

export type ActionResult<T> = { ok: true; data: T };
