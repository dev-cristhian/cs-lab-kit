import { describe, expect, it } from 'vitest';
import { randomDigits } from './index';

describe('Generators - randomDigits', () => {
  it('returns a string with the exact requested length', () => {
    expect(randomDigits(10)).toHaveLength(10);
    expect(randomDigits(1)).toHaveLength(1);
  });

  it('returns an empty string when length is 0', () => {
    expect(randomDigits(0)).toBe('');
  });

  it('contains only digit characters', () => {
    expect(randomDigits(20)).toMatch(/^\d+$/);
  });

  it('produces different values across calls', () => {
    const results = new Set(Array.from({ length: 20 }, () => randomDigits(8)));
    expect(results.size).toBeGreaterThan(1);
  });
});
