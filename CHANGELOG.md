# cs-lab-kit

## 1.3.1

### Patch Changes

- 0415eaf: Update README.md with test coverage badge.

## 1.3.0

### Minor Changes

- 52b4f68: Add Base64, CEP, CreditCard, LicensePlate, JWT, and Generator classes. Base64 provides encode, decode, and isValid. CEP adds isValid, format, clean, generate, and fetchBrazilianAddress with multi-API failover. CreditCard adds Luhn validation, getBrand (Visa, Mastercard, Amex, Elo, Diners, Hipercard), format, clean, and generate. LicensePlate supports old and Mercosul plates with isValid, getType, isMercosul, format, clean, and generate. JWT adds encode, decode, and isValid with optional HMAC-SHA256 signature verification. Generator adds uuid, fuid, firstName, lastName, fullName, email, password, color, ipv4, integer, and float for test data.

## 1.2.0

### Minor Changes

- 40b9a89: Add TextCase class with camelCase, pascalCase, snakeCase, kebabCase, constantCase, titleCase, uppercase, lowercase, invertText, and removeAccents methods.

## 1.1.0

### Minor Changes

- 45c8aa0: Add `CPF` and `CNPJ` classes with `isValid`, `format`, `clean`, and `generate` methods. CNPJ also supports alphanumeric generation (new Brazilian Federal Revenue format).
