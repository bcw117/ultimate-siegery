export const OPERATOR_COUNT = 75;

export function getRandomElement(arr: unknown[]) {
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
  return name.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}
