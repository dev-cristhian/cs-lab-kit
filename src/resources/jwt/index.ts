import crypto from 'node:crypto';

export class JWT {
  /**
   * Encodes a payload object into a signed JWT token using HMAC-SHA256.
   *
   * @param payload - Plain object to embed in the token.
   * @param secret - Secret key used to sign the token.
   * @returns The generated JWT token string in `header.payload.signature` format.
   * @throws {TypeError} If `payload` is not a plain object or `secret` is not a non-empty string.
   *
   * @example
   * JWT.encode({ id: 1, name: 'Cristhian' }, 'my-secret');
   * // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkNyaXN0aGlhbiJ9.<sig>'
   */
  public static encode(
    payload: Record<string, unknown>,
    secret: string,
  ): string {
    if (typeof payload !== 'object' || payload === null) {
      throw new TypeError('Payload must be a plain object');
    }

    if (typeof secret !== 'string' || !secret) {
      throw new TypeError('Secret must be a non-empty string');
    }

    const header = { alg: 'HS256', typ: 'JWT' };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));
    const signature = this.sign(`${encodedHeader}.${encodedPayload}`, secret);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  /**
   * Decodes the payload of a JWT token without verifying its signature.
   *
   * Use {@link JWT.isValid} with a secret to verify the token before trusting
   * the returned data in security-sensitive contexts.
   *
   * @param token - JWT token string to decode.
   * @returns The decoded payload object.
   * @throws {TypeError} If `token` is not a string.
   * @throws {Error} If the token structure is invalid or the payload cannot be parsed.
   *
   * @example
   * const payload = JWT.decode(token);
   * // { id: 1, name: 'Cristhian' }
   */
  public static decode(token: string): Record<string, unknown> {
    if (typeof token !== 'string') {
      throw new TypeError('Token must be a string');
    }

    if (!this.isValid(token)) {
      throw new Error('Invalid JWT token');
    }

    const [, encodedPayload] = token.split('.');

    return JSON.parse(this.base64UrlDecode(encodedPayload));
  }

  /**
   * Validates the structure of a JWT token and, when a secret is provided,
   * verifies the HMAC-SHA256 signature.
   *
   * @param token - JWT token string to validate.
   * @param secret - Optional secret key. When supplied, the signature is verified.
   * @returns `true` if the token is structurally valid (and the signature matches
   *   when a secret is given), `false` otherwise.
   *
   * @example
   * JWT.isValid(token);               // structural check only
   * JWT.isValid(token, 'my-secret'); // also verifies signature
   */
  public static isValid(token: string, secret?: string): boolean {
    if (typeof token !== 'string') {
      return false;
    }

    const parts = token.split('.');

    if (parts.length !== 3) {
      return false;
    }

    const [header, payload, signature] = parts;

    if (!header || !payload || !signature) {
      return false;
    }

    try {
      JSON.parse(this.base64UrlDecode(header));
      JSON.parse(this.base64UrlDecode(payload));
    } catch {
      return false;
    }

    if (secret) {
      const expectedSignature = this.sign(`${header}.${payload}`, secret);
      return signature === expectedSignature;
    }

    return true;
  }

  /**
   * Generates an HMAC-SHA256 signature encoded as base64url.
   *
   * @param value - The message to sign (typically `header.payload`).
   * @param secret - The signing key.
   * @returns The base64url-encoded signature.
   */
  private static sign(value: string, secret: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(value)
      .digest('base64url');
  }

  /**
   * Encodes a UTF-8 string to base64url format.
   *
   * @param value - The string to encode.
   * @returns The base64url-encoded string.
   */
  private static base64UrlEncode(value: string): string {
    return Buffer.from(value, 'utf-8').toString('base64url');
  }

  /**
   * Decodes a base64url string to UTF-8.
   *
   * @param value - The base64url string to decode.
   * @returns The decoded UTF-8 string.
   */
  private static base64UrlDecode(value: string): string {
    return Buffer.from(value, 'base64url').toString('utf-8');
  }
}
