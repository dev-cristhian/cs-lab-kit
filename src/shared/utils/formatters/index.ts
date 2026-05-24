/**
 * Remove all non-digits from the string.
 *
 * @param value - The string to remove non-digits from.
 * @returns The string with only digits.
 */
export function onlyDigits(value: string): string {
  return String(value ?? '').replace(/\D/g, '');
}

/**
 * Remove all non-alphanumeric characters from the string.
 *
 * @param value - The string to remove non-alphanumeric characters from.
 * @returns The string with only alphanumeric characters.
 */
export function onlyAlphanumeric(value: string): string {
  return String(value ?? '')
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, '');
}
