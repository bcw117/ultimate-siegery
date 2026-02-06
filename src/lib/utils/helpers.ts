import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function randomizedLoadoutName(name?: string) {
  if (!name) {
    return `${getRandomElement(DESCRIPTORS)} Loadout`;
  }
  return `${getRandomElement(DESCRIPTORS)} ${toTitleCase(name)} Loadout`;
}
