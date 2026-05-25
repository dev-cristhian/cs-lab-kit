import { describe, expect, it } from 'vitest';
import { LicensePlate } from './index';

describe('LicensePlate - isValid', () => {
  it('returns true for a valid old-pattern plate without hyphen', () => {
    expect(LicensePlate.isValid('ABC1234')).toBe(true);
  });

  it('returns true for a valid old-pattern plate with hyphen', () => {
    expect(LicensePlate.isValid('ABC-1234')).toBe(true);
  });

  it('returns true for a valid Mercosul plate', () => {
    expect(LicensePlate.isValid('ABC1D23')).toBe(true);
  });

  it('returns true for a lowercase valid plate', () => {
    expect(LicensePlate.isValid('abc1234')).toBe(true);
  });

  it('returns false for a plate with wrong length', () => {
    expect(LicensePlate.isValid('ABC123')).toBe(false);
  });

  it('returns false for a plate with invalid character positioning', () => {
    expect(LicensePlate.isValid('1BC1234')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(LicensePlate.isValid('')).toBe(false);
  });
});

describe('LicensePlate - getType', () => {
  it('returns "old" for a valid old-pattern plate', () => {
    expect(LicensePlate.getType('ABC1234')).toBe('old');
  });

  it('returns "mercosul" for a valid Mercosul plate', () => {
    expect(LicensePlate.getType('ABC1D23')).toBe('mercosul');
  });

  it('returns null for an invalid plate', () => {
    expect(LicensePlate.getType('INVALID')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(LicensePlate.getType('')).toBeNull();
  });

  it('correctly identifies plates with lowercase input', () => {
    expect(LicensePlate.getType('abc1234')).toBe('old');
    expect(LicensePlate.getType('abc1d23')).toBe('mercosul');
  });
});

describe('LicensePlate - isMercosul', () => {
  it('returns true for a Mercosul plate', () => {
    expect(LicensePlate.isMercosul('ABC1D23')).toBe(true);
  });

  it('returns false for an old-pattern plate', () => {
    expect(LicensePlate.isMercosul('ABC1234')).toBe(false);
  });

  it('returns false for an invalid plate', () => {
    expect(LicensePlate.isMercosul('INVALID')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(LicensePlate.isMercosul('')).toBe(false);
  });
});

describe('LicensePlate - format', () => {
  it('adds a hyphen to an old-pattern plate', () => {
    expect(LicensePlate.format('ABC1234')).toBe('ABC-1234');
  });

  it('returns a Mercosul plate unchanged (without separator)', () => {
    expect(LicensePlate.format('ABC1D23')).toBe('ABC1D23');
  });

  it('correctly formats an already-hyphenated old plate', () => {
    expect(LicensePlate.format('ABC-1234')).toBe('ABC-1234');
  });

  it('converts lowercase to uppercase when formatting', () => {
    expect(LicensePlate.format('abc1234')).toBe('ABC-1234');
  });

  it('returns the cleaned string for an invalid plate', () => {
    expect(LicensePlate.format('ABC123')).toBe('ABC123');
  });
});

describe('LicensePlate - clean', () => {
  it('removes the hyphen from a formatted old plate', () => {
    expect(LicensePlate.clean('ABC-1234')).toBe('ABC1234');
  });

  it('returns an already-clean plate unchanged', () => {
    expect(LicensePlate.clean('ABC1234')).toBe('ABC1234');
  });

  it('converts the string to uppercase', () => {
    expect(LicensePlate.clean('abc1234')).toBe('ABC1234');
  });

  it('returns an empty string for an empty input', () => {
    expect(LicensePlate.clean('')).toBe('');
  });
});

describe('LicensePlate - generate', () => {
  it('generates a Mercosul plate by default', () => {
    expect(LicensePlate.generate()).toMatch(/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/);
  });

  it('generates a valid old-pattern plate when type is "old"', () => {
    expect(LicensePlate.generate('old')).toMatch(/^[A-Z]{3}[0-9]{4}$/);
  });

  it('generates a valid Mercosul plate when type is "mercosul"', () => {
    expect(LicensePlate.generate('mercosul')).toMatch(
      /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/,
    );
  });

  it('returns different values across multiple calls', () => {
    const results = new Set(
      Array.from({ length: 20 }, () => LicensePlate.generate()),
    );
    expect(results.size).toBeGreaterThan(1);
  });

  it('always generates plates that pass isValid', () => {
    const plates = Array.from({ length: 20 }, () => LicensePlate.generate());
    plates.forEach((plate) => expect(LicensePlate.isValid(plate)).toBe(true));
  });
});
