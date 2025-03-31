export const OPERATOR_COUNT = 75;

export function getRandomElement(arr: unknown[]) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
