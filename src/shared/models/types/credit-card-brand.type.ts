export type TCreditCardBrand =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'elo'
  | 'hipercard'
  | 'diners';

export type TBrandEntry = { brand: TCreditCardBrand; pattern: RegExp };
