import { TLicensePlate } from '../../shared/models/types/license-plate.type';
import { onlyAlphanumeric } from '../../shared/utils/formatters';

export class LicensePlate {
  private static readonly OLD_PATTERN = /^[A-Z]{3}[0-9]{4}$/;
  private static readonly MERCOSUL_PATTERN = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
  private static readonly LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private static readonly DIGITS = '0123456789';

  /**
   * Validates a vehicle license plate, accepting both the old Brazilian pattern
   * (`ABC1234`) and the Mercosul pattern (`ABC1D23`). Accepts with or without a hyphen.
   *
   * @param value - The license plate string to validate.
   * @returns `true` if the format is valid, `false` otherwise.
   * @example
   * LicensePlate.isValid('ABC1234');  // true
   * LicensePlate.isValid('ABC-1234'); // true
   * LicensePlate.isValid('ABC1D23');  // true
   * LicensePlate.isValid('ABC123');   // false
   */
  public static isValid(value: string): boolean {
    const plate = this.normalize(value);
    return this.OLD_PATTERN.test(plate) || this.MERCOSUL_PATTERN.test(plate);
  }

  /**
   * Identifies the pattern of a license plate, or `null` if it is invalid.
   *
   * @param value - The license plate string to inspect.
   * @returns The plate type (`'old'` or `'mercosul'`), or `null` if invalid.
   * @example
   * LicensePlate.getType('ABC1234'); // 'old'
   * LicensePlate.getType('ABC1D23'); // 'mercosul'
   * LicensePlate.getType('INVALID'); // null
   */
  public static getType(value: string): TLicensePlate | null {
    const plate = this.normalize(value);
    if (this.MERCOSUL_PATTERN.test(plate)) return 'mercosul';
    if (this.OLD_PATTERN.test(plate)) return 'old';
    return null;
  }

  /**
   * Returns whether the license plate follows the Mercosul pattern.
   *
   * @param value - The license plate string to check.
   * @returns `true` if the plate is in the Mercosul format, `false` otherwise.
   * @example
   * LicensePlate.isMercosul('ABC1D23'); // true
   * LicensePlate.isMercosul('ABC1234'); // false
   */
  public static isMercosul(value: string): boolean {
    return this.MERCOSUL_PATTERN.test(this.normalize(value));
  }

  /**
   * Formats a license plate: old pattern receives a hyphen (`ABC-1234`);
   * Mercosul pattern is returned in uppercase without a separator (`ABC1D23`).
   *
   * @param value - The license plate string to format.
   * @returns The formatted license plate string.
   * @example
   * LicensePlate.format('ABC1234');  // 'ABC-1234'
   * LicensePlate.format('ABC1D23');  // 'ABC1D23'
   */
  public static format(value: string): string {
    const plate = this.normalize(value);

    if (this.OLD_PATTERN.test(plate)) {
      return `${plate.slice(0, 3)}-${plate.slice(3)}`;
    }

    return plate;
  }

  /**
   * Removes separators and returns the license plate in uppercase.
   *
   * @param value - The license plate string to clean.
   * @returns The normalized uppercase license plate without separators.
   * @example
   * LicensePlate.clean('ABC-1234'); // 'ABC1234'
   * LicensePlate.clean('abc1d23');  // 'ABC1D23'
   */
  public static clean(value: string): string {
    return this.normalize(value);
  }

  /**
   * Generates a random license plate in the given pattern (Mercosul by default).
   * This is fictional data for testing purposes — it does not correspond to a real vehicle.
   *
   * @param type - The pattern to generate: `'old'` or `'mercosul'`.
   * @returns A randomly generated license plate string.
   * @example
   * LicensePlate.generate();          // e.g. 'ABC1D23'
   * LicensePlate.generate('old');     // e.g. 'ABC1234'
   * LicensePlate.generate('mercosul'); // e.g. 'XYZ3K45'
   */
  public static generate(type: TLicensePlate = 'mercosul'): string {
    const l = () => this.pickLetter();
    const d = () => this.pickDigit();

    if (type === 'old') {
      return `${l()}${l()}${l()}${d()}${d()}${d()}${d()}`;
    }

    return `${l()}${l()}${l()}${d()}${l()}${d()}${d()}`;
  }

  /**
   * Strips non-alphanumeric characters and converts the string to uppercase.
   *
   * @param value - The raw license plate string.
   * @returns The normalized uppercase alphanumeric string.
   */
  private static normalize(value: string): string {
    return onlyAlphanumeric(value);
  }

  /**
   * Returns a random letter from A to Z.
   *
   * @returns A single uppercase letter.
   */
  private static pickLetter(): string {
    return this.LETTERS[Math.floor(Math.random() * this.LETTERS.length)];
  }

  /**
   * Returns a random digit from 0 to 9.
   *
   * @returns A single digit character.
   */
  private static pickDigit(): string {
    return this.DIGITS[Math.floor(Math.random() * this.DIGITS.length)];
  }
}
