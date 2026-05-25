import {
  TBrandEntry,
  TCreditCardBrand,
} from '../../shared/models/types/credit-card-brand.type';
import { onlyDigits } from '../../shared/utils/formatters';

export class CreditCard {
  private static readonly brandPatterns: TBrandEntry[] = [
    {
      brand: 'elo',
      pattern:
        /^((636368|438935|504175|451416|636297)\d{0,10}|(5067|4576|4011)\d{0,12})$/,
    },
    { brand: 'visa', pattern: /^4\d{12}(\d{3})?$/ },
    {
      brand: 'mastercard',
      pattern:
        /^(5[1-5]\d{14}|2(22[1-9]|2[3-9]\d|[3-6]\d\d|7[01]\d|720)\d{12})$/,
    },
    { brand: 'amex', pattern: /^3[47]\d{13}$/ },
    { brand: 'diners', pattern: /^3(0[0-5]|[68]\d)\d{11}$/ },
    { brand: 'hipercard', pattern: /^(606282|3841)\d{10,13}$/ },
  ];

  /**
   * Validates a credit card number using the Luhn algorithm. Checks only the
   * check digit — does not confirm whether the card exists or is active.
   *
   * @param value - The credit card number string (with or without formatting).
   * @returns `true` if the number passes Luhn validation, `false` otherwise.
   * @example
   * CreditCard.isValid('4111 1111 1111 1111'); // true
   * CreditCard.isValid('1234 5678 9012 3456'); // false
   */
  public static isValid(value: string): boolean {
    const digits = onlyDigits(value);

    if (digits.length < 13 || digits.length > 19) return false;

    return this.luhnSum(digits, false) % 10 === 0;
  }

  /**
   * Identifies the brand of a credit card, or `null` if it is unrecognized.
   *
   * @param value - The credit card number string (with or without formatting).
   * @returns The card brand, or `null` if not recognized.
   * @example
   * CreditCard.getBrand('4111111111111111');   // 'visa'
   * CreditCard.getBrand('5500000000000004');   // 'mastercard'
   * CreditCard.getBrand('9999999999999999');   // null
   */
  public static getBrand(value: string): TCreditCardBrand | null {
    const digits = onlyDigits(value);

    for (const { brand, pattern } of this.brandPatterns) {
      if (pattern.test(digits)) return brand;
    }

    return null;
  }

  /**
   * Applies the credit card mask, in groups of four digits (`0000 0000 0000 0000`).
   *
   * @param value - The credit card number string to format.
   * @returns The formatted card number.
   * @example
   * CreditCard.format('4111111111111111'); // '4111 1111 1111 1111'
   */
  public static format(value: string): string {
    return onlyDigits(value)
      .replace(/(.{4})/g, '$1 ')
      .trim();
  }

  /**
   * Removes the mask, returning only the card digits.
   *
   * @param value - The credit card number string to clean.
   * @returns The card number with only digits.
   * @example
   * CreditCard.clean('4111 1111 1111 1111'); // '4111111111111111'
   */
  public static clean(value: string): string {
    return onlyDigits(value);
  }

  /**
   * Generates a 16-digit credit card number valid according to the Luhn algorithm.
   * This is fictional data for testing purposes — it is not a real or usable card.
   *
   * @param formatted - When `true`, returns the number with the mask applied.
   * @returns A randomly generated Luhn-valid card number string.
   * @example
   * CreditCard.generate();       // e.g. '4532015112830366'
   * CreditCard.generate(true);   // e.g. '4532 0151 1283 0366'
   */
  public static generate(formatted = false): string {
    let partial = '4';

    for (let i = 0; i < 14; i++) {
      partial += Math.floor(Math.random() * 10).toString();
    }

    const checkDigit = (10 - (this.luhnSum(partial, true) % 10)) % 10;
    const result = partial + checkDigit;

    return formatted ? this.format(result) : result;
  }

  /**
   * Executes the Luhn algorithm over a sequence of digits.
   *
   * @param digits - The digit string to process.
   * @param startDoubling - Whether to start doubling from the rightmost digit.
   * @returns The Luhn checksum total.
   */
  private static luhnSum(digits: string, startDoubling: boolean): number {
    let sum = 0;
    let double = startDoubling;

    for (let i = digits.length - 1; i >= 0; i--) {
      let n = Number(digits[i]);

      if (double) {
        n *= 2;
        if (n > 9) n -= 9;
      }

      sum += n;
      double = !double;
    }

    return sum;
  }
}
