export class Base64 {
  /**
   * Encodes a string to Base64.
   *
   * @param value - The string to encode.
   * @returns The Base64 encoded string.
   * @example
   * Base64.encode('hello'); // 'aGVsbG8='
   */
  public static encode(value: string): string {
    if (typeof value !== 'string') {
      throw new TypeError('Input must be a string');
    }
    return Buffer.from(value, 'utf-8').toString('base64');
  }

  /**
   * Decodes a Base64 string to a string.
   *
   * @param value - The Base64 string to decode.
   * @returns The decoded string.
   * @example
   * Base64.decode('aGVsbG8='); // 'hello'
   */
  public static decode(value: string): string {
    if (typeof value !== 'string') {
      throw new TypeError('Input must be a string');
    }
    if (!this.isValid(value)) {
      throw new Error('Invalid Base64 string');
    }
    return Buffer.from(value, 'base64').toString('utf-8');
  }

  /**
   * Checks if a string is a valid Base64 string.
   *
   * @param value - The string to check.
   * @returns True if the string is a valid Base64 string, false otherwise.
   * @example
   * Base64.isValid('aGVsbG8='); // true
   */
  public static isValid(value: string): boolean {
    if (typeof value !== 'string') return false;
    return /^[A-Za-z0-9+/]*={0,2}$/.test(value) && value.length % 4 === 0;
  }
}
