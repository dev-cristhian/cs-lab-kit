import { afterEach, describe, expect, it, vi } from 'vitest';
import { CEP } from './index';

vi.mock('../../shared/utils/http', () => ({
  httpGet: vi.fn(),
}));

vi.mock('../../shared/utils/generators', async (importOriginal) => {
  const orig =
    await importOriginal<typeof import('../../shared/utils/generators')>();
  return {
    ...orig,
    randomDigits: vi.fn().mockImplementation(orig.randomDigits),
  };
});

import { randomDigits } from '../../shared/utils/generators';
import { httpGet } from '../../shared/utils/http';

const mockHttpGet = vi.mocked(httpGet);
const mockRandomDigits = vi.mocked(randomDigits);

afterEach(() => {
  vi.clearAllMocks();
});

describe('CEP - isValid', () => {
  it('returns true for a valid unmasked CEP', () => {
    expect(CEP.isValid('01001000')).toBe(true);
  });

  it('returns true for a valid masked CEP', () => {
    expect(CEP.isValid('01001-000')).toBe(true);
  });

  it('returns false when the CEP has fewer than 8 digits', () => {
    expect(CEP.isValid('1234')).toBe(false);
  });

  it('returns false when the CEP has more than 8 digits', () => {
    expect(CEP.isValid('012345678')).toBe(false);
  });

  it('returns false when all digits are the same', () => {
    expect(CEP.isValid('00000000')).toBe(false);
    expect(CEP.isValid('11111111')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(CEP.isValid('')).toBe(false);
  });
});

describe('CEP - format', () => {
  it('applies the mask to an unmasked 8-digit CEP', () => {
    expect(CEP.format('01001000')).toBe('01001-000');
  });

  it('returns the same masked CEP when already formatted', () => {
    expect(CEP.format('01001-000')).toBe('01001-000');
  });

  it('strips non-digit characters before formatting', () => {
    expect(CEP.format('01001.000')).toBe('01001-000');
  });

  it('returns an empty string for an empty input', () => {
    expect(CEP.format('')).toBe('');
  });
});

describe('CEP - clean', () => {
  it('removes the mask from a formatted CEP', () => {
    expect(CEP.clean('01001-000')).toBe('01001000');
  });

  it('returns the same string when there is no mask', () => {
    expect(CEP.clean('01001000')).toBe('01001000');
  });

  it('strips all non-digit characters', () => {
    expect(CEP.clean('01001.000')).toBe('01001000');
  });

  it('returns an empty string for an empty input', () => {
    expect(CEP.clean('')).toBe('');
  });
});

describe('CEP - generate', () => {
  it('returns a string of exactly 8 digits', () => {
    expect(CEP.generate()).toMatch(/^\d{8}$/);
  });

  it('returns a formatted CEP when formatted is true', () => {
    expect(CEP.generate(true)).toMatch(/^\d{5}-\d{3}$/);
  });

  it('returns an unformatted CEP by default', () => {
    const result = CEP.generate();
    expect(result).toMatch(/^\d{8}$/);
    expect(result).not.toContain('-');
  });

  it('never generates a CEP with all repeated digits', () => {
    const results = Array.from({ length: 50 }, () => CEP.generate());
    const hasRepeated = results.some((r) => /^(.)\1{7}$/.test(r));
    expect(hasRepeated).toBe(false);
  });

  it('returns different values across multiple calls', () => {
    const results = new Set(Array.from({ length: 20 }, () => CEP.generate()));
    expect(results.size).toBeGreaterThan(1);
  });

  it('adjusts the last digit when randomDigits returns all repeated digits', () => {
    mockRandomDigits.mockReturnValueOnce('00000000');
    expect(CEP.generate()).toBe('00000001');
  });

  it('wraps the adjusted digit around 0 when the last digit is 9', () => {
    mockRandomDigits.mockReturnValueOnce('99999999');
    expect(CEP.generate()).toBe('99999990');
  });
});

describe('CEP - fetch', () => {
  const mockResult = {
    cep: '01001000',
    logradouro: 'Praça da Sé',
    bairro: 'Sé',
    localidade: 'São Paulo',
    uf: 'SP',
    ddd: '11',
  };

  it('resolves with the mapped address data on success', async () => {
    mockHttpGet.mockResolvedValue(mockResult);
    const result = await CEP.fetchBrazilianAddress('01001-000');
    expect(result).toMatchObject({
      street: 'Praça da Sé',
      neighborhood: 'Sé',
      city: 'São Paulo',
      state: 'SP',
      ddd: '11',
    });
  });

  it('accepts an unmasked CEP', async () => {
    mockHttpGet.mockResolvedValue(mockResult);
    await expect(CEP.fetchBrazilianAddress('01001000')).resolves.toBeDefined();
  });

  it('throws when the CEP does not contain exactly 8 digits', async () => {
    await expect(CEP.fetchBrazilianAddress('1234')).rejects.toThrow(
      'Invalid CEP',
    );
  });

  it('rejects when all APIs fail', async () => {
    mockHttpGet.mockRejectedValue(new Error('Network error'));
    await expect(CEP.fetchBrazilianAddress('01001000')).rejects.toThrow(
      'all APIs failed',
    );
  });

  it('rejects when the API returns an error flag', async () => {
    mockHttpGet.mockResolvedValue({ erro: 'true' });
    await expect(CEP.fetchBrazilianAddress('01001000')).rejects.toThrow(
      'all APIs failed',
    );
  });

  it('resolves with the first successful API response when others fail', async () => {
    mockHttpGet
      .mockRejectedValueOnce(new Error('fail'))
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce({
        cep: '01001000',
        street: 'Praça da Sé',
        neighborhood: 'Sé',
        city: 'São Paulo',
        state: 'SP',
      });
    const result = await CEP.fetchBrazilianAddress('01001000');
    expect(result.city).toBe('São Paulo');
  });

  it('rejects when the API returns an "error" flag', async () => {
    mockHttpGet.mockResolvedValue({ error: 'true' });
    await expect(CEP.fetchBrazilianAddress('01001000')).rejects.toThrow(
      'all APIs failed',
    );
  });

  it('uses empty-string fallbacks when all API fields are absent', async () => {
    mockHttpGet.mockResolvedValue({});
    const result = await CEP.fetchBrazilianAddress('01001000');
    expect(result).toMatchObject({
      cep: '',
      street: '',
      neighborhood: '',
      city: '',
      state: '',
      ddd: null,
    });
  });

  it('resolves using the awesomeapi field mapping', async () => {
    mockHttpGet
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce({
        cep: '01001000',
        address: 'Rua Teste',
        district: 'Bairro Teste',
        city: 'Cidade Teste',
        state: 'SP',
        ddd: '11',
      })
      .mockRejectedValueOnce(new Error('fail'));
    const result = await CEP.fetchBrazilianAddress('01001000');
    expect(result).toMatchObject({
      cep: '01001000',
      street: 'Rua Teste',
      neighborhood: 'Bairro Teste',
      city: 'Cidade Teste',
      state: 'SP',
      ddd: '11',
    });
  });
});
