import { describe, expect, it } from 'vitest';
import { onlyAlphanumeric, onlyDigits } from './index';

describe('Formatters - onlyDigits', () => {
  it('strips non-digit characters, keeping only digits', () => {
    expect(onlyDigits('123.456-7')).toBe('1234567');
    expect(onlyDigits('(11) 99999-9999')).toBe('11999999999');
  });

  it('returns the same string when input contains only digits', () => {
    expect(onlyDigits('12345')).toBe('12345');
  });

  it('returns an empty string when there are no digits', () => {
    expect(onlyDigits('abc')).toBe('');
    expect(onlyDigits('')).toBe('');
  });

  it('handles null and undefined gracefully', () => {
    expect(onlyDigits(null as unknown as string)).toBe('');
    expect(onlyDigits(undefined as unknown as string)).toBe('');
  });
});

describe('Formatters - onlyAlphanumeric', () => {
  it('strips special characters and spaces', () => {
    expect(onlyAlphanumeric('AB-12 cd!')).toBe('AB12CD');
    expect(onlyAlphanumeric('hello, world!')).toBe('HELLOWORLD');
  });

  it('converts letters to uppercase', () => {
    expect(onlyAlphanumeric('abc123')).toBe('ABC123');
  });

  it('returns the same string when input is already uppercase alphanumeric', () => {
    expect(onlyAlphanumeric('ABC123')).toBe('ABC123');
  });

  it('returns an empty string when there are no alphanumeric characters', () => {
    expect(onlyAlphanumeric('---')).toBe('');
    expect(onlyAlphanumeric('')).toBe('');
  });

  it('handles null and undefined gracefully', () => {
    expect(onlyAlphanumeric(null as unknown as string)).toBe('');
    expect(onlyAlphanumeric(undefined as unknown as string)).toBe('');
  });
});
