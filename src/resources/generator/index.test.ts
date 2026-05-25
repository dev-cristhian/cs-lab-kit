import { describe, expect, it } from 'vitest';
import { LAST_NAMES, NAMES } from '../../shared/constants/names.constant';
import { Generator } from './index';

describe('Generator - uuid', () => {
  it('returns a string in standard UUID v4 format', () => {
    const result = Generator.uuid();
    expect(result).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  it('returns a string of 36 characters', () => {
    expect(Generator.uuid()).toHaveLength(36);
  });

  it('returns a unique value on each call', () => {
    expect(Generator.uuid()).not.toBe(Generator.uuid());
  });

  it('contains exactly four dashes', () => {
    const dashes = Generator.uuid().split('-').length - 1;
    expect(dashes).toBe(4);
  });
});

describe('Generator - fuid', () => {
  it('returns a 32-character hexadecimal string', () => {
    const result = Generator.fuid();
    expect(result).toMatch(/^[0-9a-f]{32}$/);
  });

  it('returns a string of exactly 32 characters', () => {
    expect(Generator.fuid()).toHaveLength(32);
  });

  it('contains no dashes', () => {
    expect(Generator.fuid()).not.toContain('-');
  });

  it('returns a unique value on each call', () => {
    expect(Generator.fuid()).not.toBe(Generator.fuid());
  });
});

describe('Generator - firstName', () => {
  it('returns a non-empty string', () => {
    expect(Generator.firstName().length).toBeGreaterThan(0);
  });

  it('returns a value that exists in the NAMES list', () => {
    expect(NAMES).toContain(Generator.firstName());
  });

  it('returns a string (not a number or undefined)', () => {
    expect(typeof Generator.firstName()).toBe('string');
  });

  it('returns different values across multiple calls', () => {
    const results = new Set(
      Array.from({ length: 20 }, () => Generator.firstName()),
    );
    expect(results.size).toBeGreaterThan(1);
  });
});

describe('Generator - lastName', () => {
  it('returns a non-empty string', () => {
    expect(Generator.lastName().length).toBeGreaterThan(0);
  });

  it('returns a value that exists in the LAST_NAMES list', () => {
    expect(LAST_NAMES).toContain(Generator.lastName());
  });

  it('returns a string type', () => {
    expect(typeof Generator.lastName()).toBe('string');
  });

  it('returns different values across multiple calls', () => {
    const results = new Set(
      Array.from({ length: 20 }, () => Generator.lastName()),
    );
    expect(results.size).toBeGreaterThan(1);
  });
});

describe('Generator - fullName', () => {
  it('returns a string containing exactly one space', () => {
    const result = Generator.fullName();
    expect(result.split(' ')).toHaveLength(2);
  });

  it('has a first part that exists in NAMES', () => {
    const [first] = Generator.fullName().split(' ');
    expect(NAMES).toContain(first);
  });

  it('has a last part that exists in LAST_NAMES', () => {
    const parts = Generator.fullName().split(' ');
    expect(LAST_NAMES).toContain(parts[1]);
  });

  it('returns a non-empty string', () => {
    expect(Generator.fullName().length).toBeGreaterThan(0);
  });
});

describe('Generator - email', () => {
  it('returns a string matching the email format', () => {
    expect(Generator.email()).toMatch(/^[a-z0-9]+\.[a-z0-9]+\d*@[a-z.]+$/);
  });

  it('contains exactly one @ character', () => {
    const atCount = Generator.email().split('@').length - 1;
    expect(atCount).toBe(1);
  });

  it('contains a dot in the local part', () => {
    const [local] = Generator.email().split('@');
    expect(local).toContain('.');
  });

  it('ends with a known domain', () => {
    const domain = Generator.email().split('@')[1];
    const knownDomains = [
      'gmail.com',
      'outlook.com',
      'yahoo.com',
      'hotmail.com',
      'icloud.com',
      'aol.com',
      'live.com',
    ];
    expect(knownDomains).toContain(domain);
  });

  it('contains only lowercase and safe characters', () => {
    expect(Generator.email()).toMatch(/^[a-z0-9.@]+$/);
  });
});

describe('Generator - password', () => {
  it('returns a string of the default length (12)', () => {
    expect(Generator.password({ lowercase: true })).toHaveLength(12);
  });

  it('returns a string of a custom length', () => {
    expect(Generator.password({ length: 20, lowercase: true })).toHaveLength(
      20,
    );
  });

  it('returns only uppercase letters when only uppercase is enabled', () => {
    const result = Generator.password({
      uppercase: true,
      lowercase: false,
      numbers: false,
    });
    expect(result).toMatch(/^[A-Z]+$/);
  });

  it('includes symbol characters when symbols option is enabled', () => {
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';
    const results = Array.from({ length: 50 }, () =>
      Generator.password({
        length: 20,
        uppercase: false,
        lowercase: false,
        numbers: false,
        symbols: true,
      }),
    );
    const hasSymbol = results.some((r) =>
      r.split('').some((c) => symbols.includes(c)),
    );
    expect(hasSymbol).toBe(true);
  });

  it('throws when all character types are disabled', () => {
    expect(() =>
      Generator.password({
        uppercase: false,
        lowercase: false,
        numbers: false,
        symbols: false,
      }),
    ).toThrow('At least one character type must be enabled');
  });

  it('returns a unique value on each call', () => {
    const opts = { lowercase: true };
    expect(Generator.password(opts)).not.toBe(Generator.password(opts));
  });

  it('returns only digits when only numbers is enabled', () => {
    const result = Generator.password({ numbers: true });
    expect(result).toMatch(/^[0-9]+$/);
  });

  it('uses lowercase false as default when option is omitted', () => {
    const result = Generator.password({ uppercase: true });
    expect(result).toMatch(/^[A-Z]+$/);
  });
});

describe('Generator - color', () => {
  it('starts with a # character', () => {
    expect(Generator.color().startsWith('#')).toBe(true);
  });

  it('returns a string of exactly 7 characters', () => {
    expect(Generator.color()).toHaveLength(7);
  });

  it('contains only valid hexadecimal characters after the #', () => {
    expect(Generator.color()).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('returns a unique value on each call', () => {
    expect(Generator.color()).not.toBe(Generator.color());
  });
});

describe('Generator - ipv4', () => {
  it('returns a string in dotted-decimal notation', () => {
    expect(Generator.ipv4()).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
  });

  it('contains exactly four octets', () => {
    expect(Generator.ipv4().split('.')).toHaveLength(4);
  });

  it('has all octets within the valid 0–255 range', () => {
    const octets = Generator.ipv4().split('.').map(Number);
    octets.forEach((octet) => {
      expect(octet).toBeGreaterThanOrEqual(0);
      expect(octet).toBeLessThanOrEqual(255);
    });
  });

  it('returns a unique value on each call', () => {
    expect(Generator.ipv4()).not.toBe(Generator.ipv4());
  });
});

describe('Generator - integer', () => {
  it('returns an integer within the default range [0, 100]', () => {
    const result = Generator.integer();
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
  });

  it('returns an integer within a custom range', () => {
    const result = Generator.integer(50, 60);
    expect(result).toBeGreaterThanOrEqual(50);
    expect(result).toBeLessThanOrEqual(60);
  });

  it('returns exactly min when min equals max', () => {
    expect(Generator.integer(7, 7)).toBe(7);
  });

  it('returns a whole number (no decimal part)', () => {
    expect(Number.isInteger(Generator.integer())).toBe(true);
  });

  it('returns different values across multiple calls', () => {
    const results = new Set(
      Array.from({ length: 20 }, () => Generator.integer(0, 1000)),
    );
    expect(results.size).toBeGreaterThan(1);
  });
});

describe('Generator - float', () => {
  it('returns a number within the default range [0, 1)', () => {
    const result = Generator.float();
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(1);
  });

  it('returns a number within a custom range', () => {
    const result = Generator.float(5, 10);
    expect(result).toBeGreaterThanOrEqual(5);
    expect(result).toBeLessThan(10);
  });

  it('returns a number type', () => {
    expect(typeof Generator.float()).toBe('number');
  });

  it('returns a value with a decimal part (not always a whole number)', () => {
    const results = Array.from({ length: 20 }, () => Generator.float(0, 100));
    const hasDecimal = results.some((n) => !Number.isInteger(n));
    expect(hasDecimal).toBe(true);
  });

  it('returns different values across multiple calls', () => {
    expect(Generator.float()).not.toBe(Generator.float());
  });
});
