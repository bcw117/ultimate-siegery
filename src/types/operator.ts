export type Operator = {
  name: string;
  primary: string[];
  secondary: string[];
  gadgets: string[];
  side: string;
};

export type Weapon = {
  name: string;
  type: string;
  scopes: string[];
  barrels: string[];
  grips: string[];
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
