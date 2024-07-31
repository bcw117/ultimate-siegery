export type Operator = {
  name: string;
  primary: string[];
  secondary: string[];
  gadgets: string[];
  side: string;
};

export type WeaponOptions = {
  name: string;
  type: string;
  scopes: string[];
  barrels: string[];
  grips: string[];
  icon_url: string;
};

export type Weapon = {
  name: string;
  type: string;
  scope: string[];
  barrel: string[];
  grip: string[];
  underbarrel: string;
  icon_url: string;
};

export type OperatorResponse = {
  operator: Operator;
  portrait: string;
};

export type WeaponResponse = {
  primary: Weapon;
  secondary: Weapon;
};

export type OperatorFilter = {
  name: string;
  side: string;
  selected: boolean;
};
