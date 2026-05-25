import { describe, expect, it } from 'vitest';
import { CreditCard } from './index';

describe('CreditCard - isValid', () => {
  it('returns true for a valid Visa card number', () => {
    expect(CreditCard.isValid('4111111111111111')).toBe(true);
  });

  it('returns true for a formatted valid card number', () => {
    expect(CreditCard.isValid('4111 1111 1111 1111')).toBe(true);
  });

  it('returns false for a number that fails Luhn validation', () => {
    expect(CreditCard.isValid('1234567890123456')).toBe(false);
  });

  it('returns false when the number has fewer than 13 digits', () => {
    expect(CreditCard.isValid('411111111111')).toBe(false);
  });

  it('returns false when the number has more than 19 digits', () => {
    expect(CreditCard.isValid('41111111111111111111')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(CreditCard.isValid('')).toBe(false);
  });
});

describe('CreditCard - getBrand', () => {
  it('returns "visa" for a Visa card number', () => {
    expect(CreditCard.getBrand('4111111111111111')).toBe('visa');
  });

  it('returns "mastercard" for a Mastercard number', () => {
    expect(CreditCard.getBrand('5500000000000004')).toBe('mastercard');
  });

  it('returns "amex" for an American Express number', () => {
    expect(CreditCard.getBrand('378282246310005')).toBe('amex');
  });

  it('returns "diners" for a Diners Club number', () => {
    expect(CreditCard.getBrand('30569309025904')).toBe('diners');
  });

  it('returns null for an unrecognized card number', () => {
    expect(CreditCard.getBrand('9999999999999999')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(CreditCard.getBrand('')).toBeNull();
  });
});

describe('CreditCard - format', () => {
  it('groups digits into blocks of four separated by spaces', () => {
    expect(CreditCard.format('4111111111111111')).toBe('4111 1111 1111 1111');
  });

  it('returns the same result for an already-formatted number', () => {
    expect(CreditCard.format('4111 1111 1111 1111')).toBe(
      '4111 1111 1111 1111',
    );
  });

  it('strips non-digit characters before formatting', () => {
    expect(CreditCard.format('4111-1111-1111-1111')).toBe(
      '4111 1111 1111 1111',
    );
  });

  it('returns an empty string for an empty input', () => {
    expect(CreditCard.format('')).toBe('');
  });
});

describe('CreditCard - clean', () => {
  it('removes spaces from a formatted card number', () => {
    expect(CreditCard.clean('4111 1111 1111 1111')).toBe('4111111111111111');
  });

  it('returns the same string when there is no formatting', () => {
    expect(CreditCard.clean('4111111111111111')).toBe('4111111111111111');
  });

  it('strips hyphens and other separators', () => {
    expect(CreditCard.clean('4111-1111-1111-1111')).toBe('4111111111111111');
  });

  it('returns an empty string for an empty input', () => {
    expect(CreditCard.clean('')).toBe('');
  });
});

describe('CreditCard - generate', () => {
  it('returns a 16-digit string by default', () => {
    expect(CreditCard.generate()).toMatch(/^\d{16}$/);
  });

  it('returns a formatted 19-character string when formatted is true', () => {
    expect(CreditCard.generate(true)).toMatch(/^\d{4} \d{4} \d{4} \d{4}$/);
  });

  it('returns a number that passes Luhn validation', () => {
    expect(CreditCard.isValid(CreditCard.generate())).toBe(true);
  });

  it('always starts with 4 (Visa prefix)', () => {
    const results = Array.from({ length: 10 }, () => CreditCard.generate());
    results.forEach((r) => expect(r.startsWith('4')).toBe(true));
  });

  it('returns different values across multiple calls', () => {
    const results = new Set(
      Array.from({ length: 20 }, () => CreditCard.generate()),
    );
    expect(results.size).toBeGreaterThan(1);
  });
});
