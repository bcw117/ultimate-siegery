import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { isNil } from "lodash";
import {
  ALL_SIDES,
  AttachmentSet,
  AttachmentType,
  LoadoutDisplay,
  OperatorFullLoadout,
  Side,
  SideFilter,
  WeaponSlot,
  WeaponWithAllAttachments,
} from "@/lib/types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const OPERATOR_COUNT = 75;

const DESCRIPTORS = [
  "Anchor",
  "Calculated",
  "Clutch",
  "Entry",
  "Flank",
  "Flex",
  "Late Round",
  "Lurk",
  "Methodical",
  "Off Angle",
  "Patient",
  "Quick Play",
  "Ranked",
  "Retake",
  "Roam",
  "Site Hold",
  "Steady",
  "Support",
  "Utility",
  "Vertical",
];

export function getRandomElement<T>(arr: T[]) {
  if (!arr || arr.length === 0) {
    return undefined;
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

export function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function removeUnderscores(name: string) {
  return name.replace(/_/g, " ").trim();
}

export function toTitleCase(name: string) {
  if (!name) {
    return null;
  }

  return name.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

export function randomizedLoadoutName(name?: string) {
  if (!name) {
    return `${getRandomElement(DESCRIPTORS)} Loadout`;
  }
  return `${getRandomElement(DESCRIPTORS)} ${toTitleCase(name)} Loadout`;
}

// Accepts a `side` search param such as "attacker" or "Defender"
export function parseSide(value: string | undefined) {
  return Object.values(Side).find(
    (side) => side.toLowerCase() === value?.toLowerCase()
  );
}

function randomAttachments(weapon: WeaponWithAllAttachments): AttachmentSet {
  const pick = (type: AttachmentType) =>
    getRandomElement(weapon.attachments.filter((a) => a.type === type));

  return {
    sight: pick(AttachmentType.Sight),
    barrel: pick(AttachmentType.Barrel),
    grip: pick(AttachmentType.Grip),
    underbarrel: pick(AttachmentType.Underbarrel),
  };
}

export function generateRandomLoadout(
  operators: OperatorFullLoadout[],
  side: SideFilter,
  operatorId?: number
): LoadoutDisplay | undefined {
  const operator = getRandomElement(
    operators.filter(
      (op) =>
        (side === ALL_SIDES || op.side === side) &&
        (isNil(operatorId) || op.id === operatorId)
    )
  );
  if (!operator) {
    return undefined;
  }

  const primary = getRandomElement(
    operator.operatorWeapons.filter((w) => w.slot === WeaponSlot.Primary)
  );
  const secondary = getRandomElement(
    operator.operatorWeapons.filter((w) => w.slot === WeaponSlot.Secondary)
  );
  const gadget = getRandomElement(operator.operatorGadgets);
  if (!primary || !secondary || !gadget) {
    return undefined;
  }

  return {
    id: 1,
    name: randomizedLoadoutName(operator.name),
    operator,
    primaryWeapon: { ...primary, attachments: randomAttachments(primary) },
    secondaryWeapon: {
      ...secondary,
      attachments: randomAttachments(secondary),
    },
    gadget,
  };
}
