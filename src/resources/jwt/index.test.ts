import { describe, expect, it } from 'vitest';
import { JWT } from './index';

const SECRET = 'test-secret';
const PAYLOAD = { id: 1, name: 'Cristhian' };

describe('JWT - encode', () => {
  it('returns a string with exactly 3 dot-separated parts', () => {
    const token = JWT.encode(PAYLOAD, SECRET);
    expect(token.split('.')).toHaveLength(3);
  });

  it('produces a header that decodes to { alg: "HS256", typ: "JWT" }', () => {
    const token = JWT.encode(PAYLOAD, SECRET);
    const [encodedHeader] = token.split('.');
    const header = JSON.parse(
      Buffer.from(encodedHeader, 'base64url').toString('utf-8'),
    );
    expect(header).toEqual({ alg: 'HS256', typ: 'JWT' });
  });

  it('embeds the payload so that decode returns the original object', () => {
    const token = JWT.encode(PAYLOAD, SECRET);
    expect(JWT.decode(token)).toEqual(PAYLOAD);
  });

  it('produces different signatures for different secrets', () => {
    const token1 = JWT.encode(PAYLOAD, 'secret-a');
    const token2 = JWT.encode(PAYLOAD, 'secret-b');
    const sig1 = token1.split('.')[2];
    const sig2 = token2.split('.')[2];
    expect(sig1).not.toBe(sig2);
  });

  it('throws TypeError when payload is null', () => {
    expect(() =>
      JWT.encode(null as unknown as Record<string, unknown>, SECRET),
    ).toThrow(TypeError);
  });

  it('throws TypeError when payload is a number', () => {
    expect(() =>
      JWT.encode(42 as unknown as Record<string, unknown>, SECRET),
    ).toThrow(TypeError);
  });

  it('throws TypeError when payload is a string', () => {
    expect(() =>
      JWT.encode('data' as unknown as Record<string, unknown>, SECRET),
    ).toThrow(TypeError);
  });

  it('throws TypeError when secret is an empty string', () => {
    expect(() => JWT.encode(PAYLOAD, '')).toThrow(TypeError);
  });

  it('throws TypeError when secret is not a string', () => {
    expect(() => JWT.encode(PAYLOAD, 123 as unknown as string)).toThrow(
      TypeError,
    );
    expect(() => JWT.encode(PAYLOAD, null as unknown as string)).toThrow(
      TypeError,
    );
  });
});

describe('JWT - decode', () => {
  it('returns the original payload object for a valid token', () => {
    const token = JWT.encode(PAYLOAD, SECRET);
    expect(JWT.decode(token)).toEqual(PAYLOAD);
  });

  it('preserves all payload field types through encode → decode', () => {
    const richPayload = { id: 1, active: true, tags: ['a', 'b'], score: 3.14 };
    const token = JWT.encode(richPayload, SECRET);
    expect(JWT.decode(token)).toEqual(richPayload);
  });

  it('throws TypeError when token is not a string', () => {
    expect(() => JWT.decode(null as unknown as string)).toThrow(TypeError);
    expect(() => JWT.decode(undefined as unknown as string)).toThrow(TypeError);
    expect(() => JWT.decode(42 as unknown as string)).toThrow(TypeError);
  });

  it('throws Error when token has fewer than 3 parts', () => {
    expect(() => JWT.decode('only.two')).toThrow(Error);
  });

  it('throws Error when token has more than 3 parts', () => {
    expect(() => JWT.decode('a.b.c.d')).toThrow(Error);
  });

  it('throws Error when header segment is not valid base64url JSON', () => {
    expect(() => JWT.decode('!!!.validpayload.sig')).toThrow(Error);
  });

  it('throws Error when payload segment is not valid JSON', () => {
    const badPayload = Buffer.from('not-json', 'utf-8').toString('base64url');
    const header = Buffer.from(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
      'utf-8',
    ).toString('base64url');
    expect(() => JWT.decode(`${header}.${badPayload}.sig`)).toThrow(Error);
  });
});

describe('JWT - isValid', () => {
  it('returns true for a structurally valid token without a secret', () => {
    const token = JWT.encode(PAYLOAD, SECRET);
    expect(JWT.isValid(token)).toBe(true);
  });

  it('returns true for a valid token with the correct secret', () => {
    const token = JWT.encode(PAYLOAD, SECRET);
    expect(JWT.isValid(token, SECRET)).toBe(true);
  });

  it('returns false for a valid token with the wrong secret', () => {
    const token = JWT.encode(PAYLOAD, SECRET);
    expect(JWT.isValid(token, 'wrong-secret')).toBe(false);
  });

  it('returns false when token is not a string', () => {
    expect(JWT.isValid(null as unknown as string)).toBe(false);
    expect(JWT.isValid(undefined as unknown as string)).toBe(false);
    expect(JWT.isValid(42 as unknown as string)).toBe(false);
  });

  it('returns false for a token with fewer than 3 parts', () => {
    expect(JWT.isValid('only.two')).toBe(false);
  });

  it('returns false for a token with more than 3 parts', () => {
    expect(JWT.isValid('a.b.c.d')).toBe(false);
  });

  it('returns false when a segment is an empty string', () => {
    expect(JWT.isValid('header..signature')).toBe(false);
    expect(JWT.isValid('.payload.signature')).toBe(false);
  });

  it('returns false when the header segment is not valid JSON', () => {
    const badHeader = Buffer.from('not-json', 'utf-8').toString('base64url');
    const payload = Buffer.from(JSON.stringify(PAYLOAD), 'utf-8').toString(
      'base64url',
    );
    expect(JWT.isValid(`${badHeader}.${payload}.sig`)).toBe(false);
  });

  it('returns false when the payload segment is not valid JSON', () => {
    const header = Buffer.from(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
      'utf-8',
    ).toString('base64url');
    const badPayload = Buffer.from('not-json', 'utf-8').toString('base64url');
    expect(JWT.isValid(`${header}.${badPayload}.sig`)).toBe(false);
  });

  it('returns false for a completely invalid string', () => {
    expect(JWT.isValid('not-a-jwt-at-all')).toBe(false);
  });
});
