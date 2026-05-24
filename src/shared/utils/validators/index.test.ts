import { describe, expect, it } from 'vitest';
import { isRepeated } from './index';

describe('Validators - isRepeated', () => {
  it('returns true when all characters are the same', () => {
    expect(isRepeated('000')).toBe(true);
    expect(isRepeated('aaaa')).toBe(true);
    expect(isRepeated('11111111111')).toBe(true);
  });

  it('returns true for a single character', () => {
    expect(isRepeated('a')).toBe(true);
    expect(isRepeated('0')).toBe(true);
  });

  it('returns false when characters differ', () => {
    expect(isRepeated('abc')).toBe(false);
    expect(isRepeated('001')).toBe(false);
    expect(isRepeated('aab')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isRepeated('')).toBe(false);
  });
});
