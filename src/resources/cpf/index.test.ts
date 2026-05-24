import { describe, expect, it, vi } from 'vitest';
import * as generators from '../../shared/utils/generators';
import { CPF } from './index';

describe('CPF - isValid', () => {
  it('returns true for a valid unformatted CPF', () => {
    expect(CPF.isValid('11144477735')).toBe(true);
  });

  it('returns true for a valid formatted CPF', () => {
    expect(CPF.isValid('111.444.777-35')).toBe(true);
  });

  it('returns false for a CPF with wrong check digits', () => {
    expect(CPF.isValid('11144477700')).toBe(false);
  });

  it('returns false for a CPF with all repeated digits', () => {
    expect(CPF.isValid('11111111111')).toBe(false);
    expect(CPF.isValid('00000000000')).toBe(false);
  });

  it('returns false when the CPF has fewer than 11 digits', () => {
    expect(CPF.isValid('1234567890')).toBe(false);
  });

  it('returns false when the CPF has more than 11 digits', () => {
    expect(CPF.isValid('123456789012')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(CPF.isValid('')).toBe(false);
  });
});

describe('CPF - format', () => {
  it('formats a raw 11-digit CPF string', () => {
    expect(CPF.format('11144477735')).toBe('111.444.777-35');
  });

  it('reformats an already-formatted CPF unchanged', () => {
    expect(CPF.format('111.444.777-35')).toBe('111.444.777-35');
  });

  it('returns the raw digits unchanged when length differs from 11', () => {
    expect(CPF.format('1234567890')).toBe('1234567890');
  });
});

describe('CPF - clean', () => {
  it('removes formatting characters from a CPF', () => {
    expect(CPF.clean('111.444.777-35')).toBe('11144477735');
  });

  it('returns the same value when the CPF is already clean', () => {
    expect(CPF.clean('11144477735')).toBe('11144477735');
  });

  it('returns an empty string for an empty input', () => {
    expect(CPF.clean('')).toBe('');
  });
});

describe('CPF - generate', () => {
  it('returns an 11-digit numeric string by default', () => {
    const cpf = CPF.generate();
    expect(cpf).toMatch(/^\d{11}$/);
  });

  it('returns a formatted CPF when formatted flag is true', () => {
    expect(CPF.generate(true)).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
  });

  it('always generates a valid CPF', () => {
    for (let i = 0; i < 20; i++) {
      expect(CPF.isValid(CPF.generate())).toBe(true);
    }
  });

  it('produces different values across calls', () => {
    const results = new Set(Array.from({ length: 20 }, () => CPF.generate()));
    expect(results.size).toBeGreaterThan(1);
  });

  it('generates a valid CPF even when the random base has all repeated digits', () => {
    vi.spyOn(generators, 'randomDigits').mockReturnValueOnce('999999999');
    const cpf = CPF.generate();
    expect(CPF.isValid(cpf)).toBe(true);
    vi.restoreAllMocks();
  });
});
