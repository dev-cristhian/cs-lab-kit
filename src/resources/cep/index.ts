import { ICepResult } from '../../shared/models/interfaces/cep-result.interface';
import { TCepApi } from '../../shared/models/types/cep-api.type';
import { onlyDigits } from '../../shared/utils/formatters';
import { randomDigits } from '../../shared/utils/generators';
import { httpGet } from '../../shared/utils/http';
import { isRepeated } from '../../shared/utils/validators';

export class CEP {
  private static readonly apisResource: TCepApi[] = [
    {
      url: (cep) => `https://viacep.com.br/ws/${cep}/json/`,
      map: (d) => ({
        cep: d['cep']?.replace('-', '') ?? '',
        street: d['logradouro'] ?? '',
        neighborhood: d['bairro'] ?? '',
        city: d['localidade'] ?? '',
        state: d['uf'] ?? '',
        ddd: d['ddd'] ?? null,
      }),
    },
    {
      url: (cep) => `https://cep.awesomeapi.com.br/json/${cep}`,
      map: (d) => ({
        cep: d['cep'] ?? '',
        street: d['address'] ?? '',
        neighborhood: d['district'] ?? '',
        city: d['city'] ?? '',
        state: d['state'] ?? '',
        ddd: d['ddd'] ?? null,
      }),
    },
    {
      url: (cep) => `https://brasilapi.com.br/api/cep/v1/${cep}`,
      map: (d) => ({
        cep: d['cep'] ?? '',
        street: d['street'] ?? '',
        neighborhood: d['neighborhood'] ?? '',
        city: d['city'] ?? '',
        state: d['state'] ?? '',
        ddd: null,
      }),
    },
  ];

  /**
   * Validates the format of a CEP (8 digits). The CEP does not have a check
   * digit, so this only confirms the format — it does not guarantee the CEP exists.
   *
   * @param value - The CEP string to validate (with or without mask).
   * @returns `true` if the format is valid, `false` otherwise.
   * @example
   * CEP.isValid('01001-000'); // true
   * CEP.isValid('00000-000'); // false (all digits repeated)
   * CEP.isValid('1234');      // false (wrong length)
   */
  public static isValid(value: string): boolean {
    const digits = onlyDigits(value);
    return digits.length === 8 && !isRepeated(digits);
  }

  /**
   * Applies the CEP mask (`00000-000`).
   *
   * @param value - The CEP string to format.
   * @returns The formatted CEP string.
   * @example
   * CEP.format('01001000'); // '01001-000'
   * CEP.format('01001-000'); // '01001-000'
   */
  public static format(value: string): string {
    return onlyDigits(value).replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }

  /**
   * Removes the mask, returning only the CEP digits.
   *
   * @param value - The CEP string to clean.
   * @returns The CEP string with only digits.
   * @example
   * CEP.clean('01001-000'); // '01001000'
   */
  public static clean(value: string): string {
    return onlyDigits(value);
  }

  /**
   * Generates a CEP with a valid format (8 random digits). This is fictional
   * data for testing purposes — it does not correspond to a real address.
   *
   * @param formatted - When `true`, returns the CEP with the mask applied.
   * @returns A randomly generated CEP string.
   * @example
   * CEP.generate();        // e.g. '01234567'
   * CEP.generate(true);    // e.g. '01234-567'
   */
  public static generate(formatted = false): string {
    let digits = randomDigits(8);

    if (isRepeated(digits)) {
      digits = digits.slice(0, 7) + String((Number(digits[7]) + 1) % 10);
    }

    return formatted ? this.format(digits) : digits;
  }

  /**
   * Fetches address data for a Brazilian CEP by querying multiple APIs in
   * parallel. The first successful response cancels the remaining requests.
   *
   * @param value - The CEP to look up (with or without mask).
   * @returns A promise that resolves with the address data.
   * @throws {Error} When the CEP format is invalid or all APIs fail.
   * @example
   * const result = await CEP.fetch('01001-000');
   * // { cep: '01001000', street: 'Praça da Sé', neighborhood: 'Sé', city: 'São Paulo', state: 'SP', ddd: '11' }
   */
  public static async fetchBrazilianAddress(
    value: string,
  ): Promise<ICepResult> {
    const sanitized = this.sanitize(value);
    const controllers = this.apisResource.map(() => new AbortController());

    try {
      return await new Promise<ICepResult>((resolve, reject) => {
        let failCount = 0;

        this.apisResource.forEach((api, index) => {
          httpGet<Record<string, string>>(
            api.url(sanitized),
            controllers[index].signal,
          )
            .then((data) => {
              if (data['erro'] || data['error']) {
                throw new Error('CEP not found.');
              }

              controllers.forEach((ctrl, i) => {
                if (i !== index) ctrl.abort();
              });

              resolve(api.map(data));
            })
            .catch(() => {
              failCount++;
              if (failCount === this.apisResource.length) {
                reject(
                  new Error('Could not retrieve CEP data: all APIs failed.'),
                );
              }
            });
        });
      });
    } finally {
      controllers.forEach((ctrl) => ctrl.abort());
    }
  }

  /**
   * Strips non-digits from the CEP and validates the length.
   *
   * @param value - The raw CEP string.
   * @returns The sanitized CEP with exactly 8 digits.
   * @throws {Error} When the CEP does not contain exactly 8 digits.
   */
  private static sanitize(value: string): string {
    const digits = onlyDigits(value);

    if (digits.length !== 8) {
      throw new Error('Invalid CEP: must contain exactly 8 digits.');
    }

    return digits;
  }
}
