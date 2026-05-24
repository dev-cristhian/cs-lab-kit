import { describe, expect, it, vi } from 'vitest';
import { CNPJ } from './index';

describe('CNPJ - isValid', () => {
  it('returns true for a valid unformatted numeric CNPJ', () => {
    expect(CNPJ.isValid('11222333000181')).toBe(true);
  });

  it('returns true for a valid formatted CNPJ', () => {
    expect(CNPJ.isValid('11.222.333/0001-81')).toBe(true);
  });

  it('returns false for a CNPJ with wrong check digits', () => {
    expect(CNPJ.isValid('11222333000100')).toBe(false);
  });

  it('returns false for a CNPJ with all repeated characters', () => {
    expect(CNPJ.isValid('11111111111111')).toBe(false);
    expect(CNPJ.isValid('00000000000000')).toBe(false);
  });

  it('returns false when the CNPJ has fewer than 14 characters', () => {
    expect(CNPJ.isValid('1122233300018')).toBe(false);
  });

  it('returns false when the CNPJ has more than 14 characters', () => {
    expect(CNPJ.isValid('112223330001810')).toBe(false);
  });

  it('returns false when the verifier digits are not numeric', () => {
    expect(CNPJ.isValid('ABCDEFGHIJKLMN')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(CNPJ.isValid('')).toBe(false);
  });
});

describe('CNPJ - format', () => {
  it('formats a raw 14-character CNPJ string', () => {
    expect(CNPJ.format('11222333000181')).toBe('11.222.333/0001-81');
  });

  it('reformats an already-formatted CNPJ unchanged', () => {
    expect(CNPJ.format('11.222.333/0001-81')).toBe('11.222.333/0001-81');
  });

  it('returns the raw characters unchanged when length differs from 14', () => {
    expect(CNPJ.format('1122233300018')).toBe('1122233300018');
  });
});

describe('CNPJ - clean', () => {
  it('removes formatting characters from a CNPJ', () => {
    expect(CNPJ.clean('11.222.333/0001-81')).toBe('11222333000181');
  });

  it('returns the same value when the CNPJ is already clean', () => {
    expect(CNPJ.clean('11222333000181')).toBe('11222333000181');
  });

  it('uppercases letters while removing non-alphanumeric characters', () => {
    expect(CNPJ.clean('ab.cde.fgh/ijkl-00')).toBe('ABCDEFGHIJKL00');
  });

  it('returns an empty string for an empty input', () => {
    expect(CNPJ.clean('')).toBe('');
  });
});

describe('CNPJ - generate', () => {
  it('returns a 14-digit numeric string by default', () => {
    expect(CNPJ.generate()).toMatch(/^\d{14}$/);
  });

  it('returns a formatted CNPJ when formatted option is true', () => {
    expect(CNPJ.generate({ formatted: true })).toMatch(
      /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
    );
  });

  it('returns a 14-character alphanumeric CNPJ when alphanumeric option is true', () => {
    expect(CNPJ.generate({ alphanumeric: true })).toMatch(/^[0-9A-Z]{14}$/);
  });

  it('always generates a valid numeric CNPJ', () => {
    for (let i = 0; i < 20; i++) {
      expect(CNPJ.isValid(CNPJ.generate())).toBe(true);
    }
  });

  it('always generates a valid alphanumeric CNPJ', () => {
    for (let i = 0; i < 20; i++) {
      expect(CNPJ.isValid(CNPJ.generate({ alphanumeric: true }))).toBe(true);
    }
  });

  it('produces different values across calls', () => {
    const results = new Set(Array.from({ length: 20 }, () => CNPJ.generate()));
    expect(results.size).toBeGreaterThan(1);
  });

  it('generates a valid CNPJ even when the repeated base ends with 0', () => {
    // Math.random() → 0 causes alphabet[0] = '0' for all 12 positions
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const cnpj = CNPJ.generate();
    vi.restoreAllMocks();
    expect(CNPJ.isValid(cnpj)).toBe(true);
  });

  it('generates a valid CNPJ even when the repeated base ends with a non-zero digit', () => {
    // Math.random() → 0.1 causes Math.floor(0.1 * 10) = 1 → alphabet[1] = '1' for all 12 positions
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const cnpj = CNPJ.generate();
    vi.restoreAllMocks();
    expect(CNPJ.isValid(cnpj)).toBe(true);
  });
});
