import { onlyAlphanumeric } from '../../shared/utils/formatters';
import { isRepeated } from '../../shared/utils/validators';

export class CNPJ {
  private static readonly firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  private static readonly secondWeights = [
    6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2,
  ];
  private static readonly numeric = '0123456789';
  private static readonly alphanumeric = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  /**
   * Check if the CNPJ is valid.
   *
   * @param value - The CNPJ to check if it is valid.
   * @returns True if the CNPJ is valid, false otherwise.
   */
  public static isValid(value: string): boolean {
    const doc = onlyAlphanumeric(value);
    if (doc.length !== 14 || isRepeated(doc)) return false;
    const base = doc.slice(0, 12);
    const verifier = doc.slice(12);
    if (!/^\d{2}$/.test(verifier)) return false;
    const first = this.checkDigit(base, this.firstWeights);
    const second = this.checkDigit(base + first, this.secondWeights);
    return first === Number(verifier[0]) && second === Number(verifier[1]);
  }

  /**
   * Format the CNPJ.
   *
   * @param value - The CNPJ to format.
   * @returns The formatted CNPJ.
   */
  public static format(value: string): string {
    return onlyAlphanumeric(value).replace(
      /^([0-9A-Z]{2})([0-9A-Z]{3})([0-9A-Z]{3})([0-9A-Z]{4})(\d{2})$/,
      '$1.$2.$3/$4-$5',
    );
  }

  /**
   * Clean the CNPJ.
   *
   * @param value - The CNPJ to clean.
   * @returns The cleaned CNPJ.
   * @example
   * CNPJ.clean('12.345.678/9000-12'); // '12345678900012'
   */
  public static clean(value: string): string {
    return onlyAlphanumeric(value);
  }

  /**
   * Generate a random CNPJ.
   *
   * @param options - The options for generating the CNPJ.
   * @returns The generated CNPJ.
   * @example
   * CNPJ.generate(); // '12345678900012'
   * CNPJ.generate({ formatted: true }); // '12.345.678/9000-12'
   * CNPJ.generate({ alphanumeric: true }); // '12345678900012'
   * CNPJ.generate({ formatted: true, alphanumeric: true }); // '12.345.678/9000-12'
   */
  public static generate(
    options: { formatted?: boolean; alphanumeric?: boolean } = {},
  ): string {
    const { formatted = false, alphanumeric = false } = options;
    const alphabet = alphanumeric ? this.alphanumeric : this.numeric;
    let base = '';
    for (let i = 0; i < 12; i++) {
      base += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    if (isRepeated(base)) {
      base = base.slice(0, 11) + (base[11] === '0' ? '1' : '0');
    }
    const first = this.checkDigit(base, this.firstWeights);
    const second = this.checkDigit(base + first, this.secondWeights);
    const result = base + first + second;
    return formatted ? this.format(result) : result;
  }

  /**
   * Calculate the check digit for a given base string.
   *
   * @param base - The base string to calculate the check digit.
   * @param weights - The weights to use for the calculation.
   * @returns The check digit.
   */
  private static checkDigit(base: string, weights: number[]): number {
    let sum = 0;
    for (let i = 0; i < base.length; i++) {
      sum += this.charValue(base[i]) * weights[i];
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  }

  /**
   * Get the value of a character.
   *
   * @param char - The character to get the value of.
   * @returns The value of the character.
   */
  private static charValue(char: string): number {
    return char.charCodeAt(0) - 48;
  }
}
