import { onlyDigits } from '../../shared/utils/formatters';
import { randomDigits } from '../../shared/utils/generators';
import { isRepeated } from '../../shared/utils/validators';

export class CPF {
  /**
   * Check if the CPF is valid.
   *
   * @param value - The CPF to check if it is valid.
   * @returns True if the CPF is valid, false otherwise.
   */
  public static isValid(value: string): boolean {
    const digits = onlyDigits(value);
    if (digits.length !== 11 || isRepeated(digits)) return false;

    const first = this.checkDigit(digits.slice(0, 9));
    const second = this.checkDigit(digits.slice(0, 10));
    return first === Number(digits[9]) && second === Number(digits[10]);
  }

  /**
   * Format the CPF.
   *
   * @param value - The CPF to format.
   * @returns The formatted CPF.
   */
  public static format(value: string): string {
    return onlyDigits(value).replace(
      /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
      '$1.$2.$3-$4',
    );
  }

  /**
   * Clean the CPF.
   *
   * @param value - The CPF to clean.
   * @returns The cleaned CPF.
   * @example
   * CPF.clean('123.456.789-00'); // '12345678900'
   */
  public static clean(value: string): string {
    return onlyDigits(value);
  }

  /**
   * Generate a random CPF.
   *
   * @param formatted - Whether to format the CPF.
   * @returns The generated CPF.
   * @example
   * CPF.generate(); // '12345678900'
   * CPF.generate(true); // '123.456.789-00'
   */
  public static generate(formatted = false): string {
    let base = randomDigits(9);
    if (isRepeated(base)) {
      base = base.slice(0, 8) + ((Number(base[8]) + 1) % 10);
    }
    const first = this.checkDigit(base);
    const second = this.checkDigit(base + first);
    const result = base + first + second;
    return formatted ? this.format(result) : result;
  }

  /**
   * Calculate the check digit for a given base string.
   *
   * @param base - The base string to calculate the check digit.
   * @returns The check digit.
   */
  private static checkDigit(base: string): number {
    let sum = 0;
    let weight = base.length + 1;
    for (const char of base) {
      sum += Number(char) * weight;
      weight -= 1;
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  }
}
