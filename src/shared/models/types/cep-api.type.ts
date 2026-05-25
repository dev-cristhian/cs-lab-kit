import { ICepResult } from '../interfaces/cep-result.interface';

export type TCepApi = {
  url: (cep: string) => string;
  map: (data: Record<string, string>) => ICepResult;
};
