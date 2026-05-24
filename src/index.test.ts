import { describe, expect, it } from 'vitest';
import { getName } from './index';

describe('index', () => {
  it('should return the name of the kit', () => {
    expect(getName()).toBe('@cs-tools/kit');
  });
});
