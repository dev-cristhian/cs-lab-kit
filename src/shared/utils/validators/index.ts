/**
 * Check if the string is repeated.
 *
 * @param value - The string to check if it is repeated.
 * @returns True if the string is repeated, false otherwise.
 */
export function isRepeated(value: string): boolean {
  return value.length > 0 && /^(.)\1*$/.test(value);
}
