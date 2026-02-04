import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CursorData } from "../../db/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const OPERATOR_COUNT = 75;

const DESCRIPTORS = [
  "Potato Aim",
  "Rage Inducing",
  "Cringe",
  "Tilt Proof",
  "Big Brain",
  "Cursed",
  "Blessed",
  "RNG Based",
  "Hardcore",
  "Highlight Reel",
  "Cracked",
  "Based",
  "Sigma",
  "Perfect",
  "Weird",
  "Interesting",
  "Very Random",
  "Suspicious",
  "Epic",
  "Ultimate",
  "Copper",
  "Silver",
  "Bronze",
  "Gold",
  "Platinum",
  "Emerald",
  "Diamond",
  "Champion",
  "Genius",
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

export function randomizedLoadoutName(name: string | undefined) {
  if (!name) {
    return `${getRandomElement(DESCRIPTORS)} Loadout`;
  }
  return `${getRandomElement(DESCRIPTORS)} ${toTitleCase(name)} Loadout`;
}

export function encodeCursor(data: CursorData) {
  const json = JSON.stringify(data);
  return Buffer.from(json, "utf8").toString("base64url");
}

export function decodeCursor(cursor: string | null) {
  if (!cursor) {
    return null;
  }

  try {
    const json = Buffer.from(cursor, "base64url").toString("utf8");
    const parsed = JSON.parse(json) as { created_at: string; id: number };

    return { created_at: new Date(parsed.created_at), id: parsed.id };
  } catch {
    return null;
  }
}

export function foldAttachments(
  rows: { id: number; name: string; type: string }[]
) {
  const result: {
    scope?: { id: number; name: string; type: string };
    barrel?: { id: number; name: string; type: string };
    grip?: { id: number; name: string; type: string };
    underbarrel?: { id: number; name: string; type: string };
  } = {};
  for (const a of rows) {
    if (a.type === "Scope" && !result.scope) result.scope = a;
    else if (a.type === "Barrel" && !result.barrel) result.barrel = a;
    else if (a.type === "Grip" && !result.grip) result.grip = a;
    else if (a.type === "Underbarrel" && !result.underbarrel)
      result.underbarrel = a;
  }
  return result;
}
