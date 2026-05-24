/**
 * Generate a random string with the given length.
 *
 * @param length - The length of the random string.
 * @returns The random string.
 */
export function randomDigits(length: number): string {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += Math.floor(Math.random() * 10).toString();
  }
  return out;
}
