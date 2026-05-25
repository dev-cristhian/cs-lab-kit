import { LAST_NAMES, NAMES } from '../../shared/constants/names.constant';
import { IPasswordOptions } from '../../shared/models/interfaces/password-options.interface';

export class Generator {
  private static readonly emailDomains = [
    'gmail.com',
    'outlook.com',
    'yahoo.com',
    'hotmail.com',
    'icloud.com',
    'aol.com',
    'live.com',
  ] as const;

  private static readonly upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private static readonly lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
  private static readonly numbersChars = '0123456789';
  private static readonly symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';

  /**
   * Generates a random UUID v4.
   *
   * @returns A UUID string in standard format.
   * @example
   * Generator.uuid(); // 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
   */
  public static uuid(): string {
    return crypto.randomUUID();
  }

  /**
   * Generates a Flat UUID — a UUID v4 without dashes (32 hex characters).
   *
   * @returns A 32-character hexadecimal string.
   * @example
   * Generator.fuid(); // 'f47ac10b58cc4372a5670e02b2c3d479'
   */
  public static fuid(): string {
    return this.uuid().replace(/-/g, '');
  }

  /**
   * Returns a random first name from the built-in name list.
   *
   * @returns A capitalized first name string.
   * @example
   * Generator.firstName(); // 'James'
   */
  public static firstName(): string {
    return this.pick(NAMES);
  }

  /**
   * Returns a random last name from the built-in surname list.
   *
   * @returns A capitalized last name string.
   * @example
   * Generator.lastName(); // 'Smith'
   */
  public static lastName(): string {
    return this.pick(LAST_NAMES);
  }

  /**
   * Returns a random full name combining a first name and a last name.
   *
   * @returns A full name string in the format `'FirstName LastName'`.
   * @example
   * Generator.fullName(); // 'James Smith'
   */
  public static fullName(): string {
    return `${this.firstName()} ${this.lastName()}`;
  }

  /**
   * Generates a random fake email address.
   *
   * Combines a normalized first name and last name with an optional numeric
   * suffix, and a randomly chosen domain.
   *
   * @returns An email address string.
   * @example
   * Generator.email(); // 'james.smith42@gmail.com'
   */
  public static email(): string {
    const first = this.normalizeForEmail(this.firstName());
    const last = this.normalizeForEmail(this.lastName());
    const suffix = Math.random() > 0.5 ? String(this.randomInt(1, 999)) : '';
    const domain = this.pick([...this.emailDomains]);

    return `${first}.${last}${suffix}@${domain}`;
  }

  /**
   * Generates a random password based on the provided options.
   *
   * At least one character type must be enabled (uppercase, lowercase,
   * numbers, or symbols). Throws if all types are explicitly set to `false`.
   *
   * @param options - Password configuration options.
   * @param options.length - Number of characters (default: `12`).
   * @param options.uppercase - Include uppercase letters (default: `false`).
   * @param options.lowercase - Include lowercase letters (default: `false`).
   * @param options.numbers - Include numeric digits (default: `false`).
   * @param options.symbols - Include symbol characters (default: `false`).
   * @returns A password string.
   * @throws {Error} When no character type is enabled.
   * @example
   * Generator.password({ lowercase: true }); // 'xkqmrvtaepwz'
   * Generator.password({ length: 8, uppercase: true, symbols: true }); // 'aB3k@9m!'
   */
  public static password(options?: IPasswordOptions): string {
    const length = options?.length ?? 12;
    const useUppercase = options?.uppercase ?? false;
    const useLowercase = options?.lowercase ?? false;
    const useNumbers = options?.numbers ?? false;
    const useSymbols = options?.symbols ?? false;

    let charset = '';
    if (useUppercase) charset += this.upperCaseChars;
    if (useLowercase) charset += this.lowerCaseChars;
    if (useNumbers) charset += this.numbersChars;
    if (useSymbols) charset += this.symbolChars;

    if (!charset) {
      throw new Error(
        'At least one character type must be enabled to generate a password',
      );
    }

    return Array.from(
      { length },
      () => charset[this.randomInt(0, charset.length - 1)],
    ).join('');
  }

  /**
   * Generates a random hex color code.
   *
   * @returns A hex color string in the format `'#rrggbb'`.
   * @example
   * Generator.color(); // '#a3f2c1'
   */
  public static color(): string {
    const hex = this.randomInt(0, 0xffffff).toString(16).padStart(6, '0');

    return `#${hex}`;
  }

  /**
   * Generates a random IPv4 address.
   *
   * Each octet is an integer in the range [0, 255].
   *
   * @returns An IPv4 address string in dotted-decimal notation.
   * @example
   * Generator.ipv4(); // '192.168.1.45'
   */
  public static ipv4(): string {
    return Array.from({ length: 4 }, () => this.randomInt(0, 255)).join('.');
  }

  /**
   * Generates a random integer within the specified inclusive range.
   *
   * @param min - Minimum value (default: `0`).
   * @param max - Maximum value (default: `100`).
   * @returns A random integer between `min` and `max` (inclusive).
   * @example
   * Generator.integer();       // 42
   * Generator.integer(1, 6);   // 4
   */
  public static integer(min = 0, max = 100): number {
    return this.randomInt(min, max);
  }

  /**
   * Generates a random floating-point number within the specified range.
   *
   * @param min - Minimum value (default: `0`).
   * @param max - Maximum value (default: `1`).
   * @returns A random float between `min` (inclusive) and `max` (exclusive).
   * @example
   * Generator.float();        // 0.7341
   * Generator.float(1, 10);  // 7.234
   */
  public static float(min = 0, max = 1): number {
    return min + Math.random() * (max - min);
  }

  /**
   * Picks a random item from the given array.
   *
   * @param items - The items to pick from.
   * @returns A random item from the array.
   */
  private static pick<T>(items: T[]): T {
    return items[this.randomInt(0, items.length - 1)];
  }

  /**
   * Generates a random integer between `min` and `max` (inclusive).
   *
   * @param min - The minimum value.
   * @param max - The maximum value.
   * @returns A random integer between `min` and `max` (inclusive).
   */
  private static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Normalizes a name for email purposes.
   *
   * @param name - The name to normalize.
   * @returns A normalized name.
   */
  private static normalizeForEmail(name: string): string {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  }
}
