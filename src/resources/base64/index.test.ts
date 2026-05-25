import { describe, expect, it } from 'vitest';
import { Base64 } from './index';

describe('Base64 - encode', () => {
  it('returns a non-empty string for a simple ASCII input', () => {
    const result = Base64.encode('hello');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('produces the correct base64 output for a known ASCII value', () => {
    expect(Base64.encode('hello')).toBe('aGVsbG8=');
  });

  it('handles Unicode characters correctly', () => {
    const result = Base64.encode('olá mundo');
    expect(Base64.decode(result)).toBe('olá mundo');
  });

  it('handles emoji and multi-byte Unicode characters', () => {
    const result = Base64.encode('🚀 TypeScript');
    expect(Base64.decode(result)).toBe('🚀 TypeScript');
  });

  it('returns an empty string when the input is empty', () => {
    expect(Base64.encode('')).toBe('');
  });

  it('throws a TypeError when the input is not a string', () => {
    expect(() => Base64.encode(123 as unknown as string)).toThrow(TypeError);
    expect(() => Base64.encode(null as unknown as string)).toThrow(TypeError);
    expect(() => Base64.encode(undefined as unknown as string)).toThrow(
      TypeError,
    );
  });
});

describe('Base64 - decode', () => {
  it('returns the original ASCII string from a valid base64 input', () => {
    expect(Base64.decode('aGVsbG8=')).toBe('hello');
  });

  it('round-trips encode → decode for an ASCII string', () => {
    const original = 'Hello, World!';
    expect(Base64.decode(Base64.encode(original))).toBe(original);
  });

  it('round-trips encode → decode for a Unicode string', () => {
    const original = 'olá, mundo! çãõ';
    expect(Base64.decode(Base64.encode(original))).toBe(original);
  });

  it('round-trips encode → decode for emoji and multi-byte characters', () => {
    const original = '🔥 vitest 🧪';
    expect(Base64.decode(Base64.encode(original))).toBe(original);
  });

  it('returns an empty string when the input is an empty string', () => {
    expect(Base64.decode('')).toBe('');
  });

  it('throws a TypeError when the input is not a string', () => {
    expect(() => Base64.decode(42 as unknown as string)).toThrow(TypeError);
    expect(() => Base64.decode(null as unknown as string)).toThrow(TypeError);
    expect(() => Base64.decode(undefined as unknown as string)).toThrow(
      TypeError,
    );
  });

  it('throws an Error when the input is not valid base64', () => {
    expect(() => Base64.decode('not-valid!!')).toThrow(Error);
    expect(() => Base64.decode('!!!!')).toThrow(Error);
    expect(() => Base64.decode('abc')).toThrow(Error);
  });
});

describe('Base64 - isValid', () => {
  it('returns true for a known valid base64 string', () => {
    expect(Base64.isValid('aGVsbG8=')).toBe(true);
  });

  it('returns true for a valid base64 string without padding', () => {
    expect(Base64.isValid('dGVzdA==')).toBe(true);
  });

  it('returns true for an empty string', () => {
    expect(Base64.isValid('')).toBe(true);
  });

  it('returns false for a string with invalid characters', () => {
    expect(Base64.isValid('not-valid!!')).toBe(false);
    expect(Base64.isValid('abc$')).toBe(false);
  });

  it('returns false for a string with incorrect length (not a multiple of 4)', () => {
    expect(Base64.isValid('abc')).toBe(false);
    expect(Base64.isValid('abcde')).toBe(false);
  });

  it('returns false for a non-string value', () => {
    expect(Base64.isValid(123 as unknown as string)).toBe(false);
    expect(Base64.isValid(null as unknown as string)).toBe(false);
    expect(Base64.isValid(undefined as unknown as string)).toBe(false);
  });
});
