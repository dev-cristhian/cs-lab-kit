<div align="center">

# 🚀 Lab Kit 🚀

**Stop installing 5 packages for what one can do.**

Validate, format, generate and transform Brazilian documents, credit cards, strings, JWTs and more — with zero dependencies and full TypeScript support.

[![npm version](https://img.shields.io/npm/v/cs-lab-kit?color=crimson&style=flat-square)](https://www.npmjs.com/package/cs-lab-kit)
[![npm downloads](https://img.shields.io/npm/dm/cs-lab-kit?color=orange&style=flat-square)](https://www.npmjs.com/package/cs-lab-kit)
[![license](https://img.shields.io/npm/l/cs-lab-kit?color=blue&style=flat-square)](./LICENSE)
[![node](https://img.shields.io/node/v/cs-lab-kit?color=green&style=flat-square)](https://nodejs.org)
[![types](https://img.shields.io/npm/types/cs-lab-kit?style=flat-square)](https://www.typescriptlang.org)

</div>

<p align="center">
  <img src="https://raw.githubusercontent.com/dev-cristhian/cs-lab-kit/main/assets/banner.jpg" alt="cs-lab-kit" width="100%" style="max-width: 900px;" />
</p>

---

## What is Lab Kit?

`cs-lab-kit` is a **production-ready utility toolkit** for JavaScript and TypeScript projects. It brings together validators, formatters, generators and encoders in a single lightweight package — so you don't have to juggle multiple dependencies for everyday tasks.

Need to validate a CPF, generate a fake credit card for tests, convert strings between camelCase and snake_case, or decode a JWT? **Import and use. That's it.**

- **🪪 Brazilian Documents** — CPF, CNPJ, CEP and License Plates with full validation, formatting and generation.
- **🎲 Data Generators** — Names, emails, UUIDs, passwords, colors, IPs, integers and floats.
- **💳 Credit Card** — Luhn validation, brand detection and test-number generation.
- **🔤 Text Case** — 10 string conversion methods including camelCase, snake_case, kebab-case and more.
- **🔒 Security & Encoding** — Base64 encode/decode and JWT encode/decode/verify.

> ⚠️ **Always install the latest version** — new utilities ship with every release. Only the latest version contains the full feature set.

---

## 📦 Installation

```bash
# npm
npm install cs-lab-kit@latest

# yarn
yarn add cs-lab-kit@latest

# pnpm
pnpm add cs-lab-kit@latest

# bun
bun add cs-lab-kit@latest
```

> 💡 Using `@latest` ensures you get every available utility. Older versions may not include features documented below.

---

## 🏆 Why Lab Kit?

Most projects end up installing a handful of packages for validation, case conversion and test data. Lab Kit replaces them with a single, zero-dependency import.

| Feature                         |           cs-lab-kit           |   validator.js   | change-case |     faker-js     |
| ------------------------------- | :----------------------------: | :--------------: | :---------: | :--------------: |
| Brazilian docs (CPF, CNPJ, CEP) |            ✅ Full             |    ⚠️ Partial    |     ❌      |        ❌        |
| Case conversion                 |         ✅ 10 methods          |        ❌        |     ✅      |        ❌        |
| Fake data generation            |          ✅ Brazilian          |        ❌        |     ❌      |    ⚠️ Generic    |
| Credit card (Luhn)              | ✅ Validate + brand + generate | ⚠️ Validate only |     ❌      | ⚠️ Generate only |
| License plate (BR)              |               ✅               |        ❌        |     ❌      |        ❌        |
| JWT encode / decode             |               ✅               |        ❌        |     ❌      |        ❌        |
| Base64 encode / decode          |               ✅               |        ❌        |     ❌      |        ❌        |
| Zero dependencies               |               ✅               |        ✅        |     ✅      |        ❌        |
| Bundle size (minified)          |          Lightweight           |     ~125 kB      |   ~2.5 kB   |      >5 MB       |
| TypeScript-first                |               ✅               |  ⚠️ Via @types   |     ✅      |        ✅        |

<sub>Sources: <a href="https://bundlephobia.com">bundlephobia.com</a>, npm registry, official repositories. Data verified May 2026.</sub>

---

## ✅ Available Features

### 🪪 CPF — Brazilian Individual Taxpayer ID

Full support for CPF validation, formatting, sanitization and generation — including the official check-digit algorithm.

```ts
import { CPF } from 'cs-lab-kit';

CPF.isValid('123.456.789-09'); // true
CPF.isValid('111.111.111-11'); // false (repeated digits)

CPF.format('12345678909'); // '123.456.789-09'
CPF.clean('123.456.789-09'); // '12345678909'

CPF.generate(); // '98765432100'
CPF.generate(true); // '987.654.321-00'
```

| Method     | Signature                         | Description                                |
| ---------- | --------------------------------- | ------------------------------------------ |
| `isValid`  | `(value: string) => boolean`      | Validates CPF using the official algorithm |
| `format`   | `(value: string) => string`       | Applies `###.###.###-##` mask              |
| `clean`    | `(value: string) => string`       | Strips all non-digit characters            |
| `generate` | `(formatted?: boolean) => string` | Generates a random valid CPF               |

---

### 🏢 CNPJ — Brazilian Company Registration Number

Supports both classic numeric CNPJs and the new **alphanumeric CNPJ** format introduced by Receita Federal.

```ts
import { CNPJ } from 'cs-lab-kit';

CNPJ.isValid('12.345.678/0001-95'); // true
CNPJ.isValid('00.000.000/0000-00'); // false (repeated)

CNPJ.format('12345678000195'); // '12.345.678/0001-95'
CNPJ.clean('12.345.678/0001-95'); // '12345678000195'

CNPJ.generate(); // '12345678000195'
CNPJ.generate({ formatted: true }); // '12.345.678/0001-95'
CNPJ.generate({ alphanumeric: true }); // 'AB3DE5GH0001-95'
CNPJ.generate({ formatted: true, alphanumeric: true }); // 'AB.3DE.5GH/0001-95'
```

| Method     | Signature                                             | Description                                 |
| ---------- | ----------------------------------------------------- | ------------------------------------------- |
| `isValid`  | `(value: string) => boolean`                          | Validates CNPJ using the official algorithm |
| `format`   | `(value: string) => string`                           | Applies `##.###.###/####-##` mask           |
| `clean`    | `(value: string) => string`                           | Strips mask characters                      |
| `generate` | `(options?: { formatted?, alphanumeric? }) => string` | Generates a random valid CNPJ               |

---

### 📮 CEP — Brazilian Postal Code

Validate, format and generate Brazilian CEPs — plus look up real addresses from multiple APIs with automatic failover.

```ts
import { CEP } from 'cs-lab-kit';

CEP.isValid('01001-000'); // true
CEP.isValid('00000-000'); // false (repeated digits)

CEP.format('01001000'); // '01001-000'
CEP.clean('01001-000'); // '01001000'

CEP.generate(); // '01234567'
CEP.generate(true); // '01234-567'

const address = await CEP.fetchBrazilianAddress('01001-000');
// { cep: '01001000', street: 'Praça da Sé', neighborhood: 'Sé', city: 'São Paulo', state: 'SP', ddd: '11' }
```

| Method                  | Signature                                | Description                                  |
| ----------------------- | ---------------------------------------- | -------------------------------------------- |
| `isValid`               | `(value: string) => boolean`             | Validates format (8 digits, non-repeated)    |
| `format`                | `(value: string) => string`              | Applies `#####-###` mask                     |
| `clean`                 | `(value: string) => string`              | Strips non-digit characters                  |
| `generate`              | `(formatted?: boolean) => string`        | Generates a random CEP (fictional)           |
| `fetchBrazilianAddress` | `(value: string) => Promise<ICepResult>` | Fetches address data from 3 APIs in parallel |

---

### 💳 CreditCard — Luhn Validation & Generation

Validate credit card numbers with the Luhn algorithm, detect the card brand, and generate fictional test numbers.

```ts
import { CreditCard } from 'cs-lab-kit';

CreditCard.isValid('4111 1111 1111 1111'); // true
CreditCard.getBrand('4111111111111111'); // 'visa'
CreditCard.getBrand('5500000000000004'); // 'mastercard'

CreditCard.format('4111111111111111'); // '4111 1111 1111 1111'
CreditCard.clean('4111 1111 1111 1111'); // '4111111111111111'

CreditCard.generate(); // '4532015112830366'
CreditCard.generate(true); // '4532 0151 1283 0366'
```

| Method     | Signature                                     | Description                                              |
| ---------- | --------------------------------------------- | -------------------------------------------------------- |
| `isValid`  | `(value: string) => boolean`                  | Validates using the Luhn algorithm                       |
| `getBrand` | `(value: string) => TCreditCardBrand \| null` | Detects Visa, Mastercard, Amex, Elo, Diners or Hipercard |
| `format`   | `(value: string) => string`                   | Applies `#### #### #### ####` mask                       |
| `clean`    | `(value: string) => string`                   | Strips non-digit characters                              |
| `generate` | `(formatted?: boolean) => string`             | Generates a fictional Luhn-valid card number             |

---

### 🚗 LicensePlate — Brazilian Vehicle Plates

Validate, identify and generate Brazilian license plates in both the legacy (`ABC-1234`) and Mercosul (`ABC1D23`) formats.

```ts
import { LicensePlate } from 'cs-lab-kit';

LicensePlate.isValid('ABC1234'); // true
LicensePlate.isValid('ABC1D23'); // true

LicensePlate.getType('ABC1234'); // 'old'
LicensePlate.getType('ABC1D23'); // 'mercosul'
LicensePlate.isMercosul('ABC1D23'); // true

LicensePlate.format('ABC1234'); // 'ABC-1234'
LicensePlate.clean('ABC-1234'); // 'ABC1234'

LicensePlate.generate(); // 'XYZ3K45' (mercosul)
LicensePlate.generate('old'); // 'ABC1234'
```

| Method       | Signature                                  | Description                                        |
| ------------ | ------------------------------------------ | -------------------------------------------------- |
| `isValid`    | `(value: string) => boolean`               | Validates old or Mercosul format                   |
| `getType`    | `(value: string) => TLicensePlate \| null` | Returns `'old'`, `'mercosul'` or `null`            |
| `isMercosul` | `(value: string) => boolean`               | Checks if the plate is Mercosul format             |
| `format`     | `(value: string) => string`                | Applies hyphen for old plates; uppercases Mercosul |
| `clean`      | `(value: string) => string`                | Strips separators and uppercases                   |
| `generate`   | `(type?: TLicensePlate) => string`         | Generates a fictional plate (default: mercosul)    |

---

### 🔤 TextCase — String Case Converter

Convert strings between any common case format, with support for space-separated, camelCase, PascalCase, snake_case, and kebab-case inputs.

```ts
import { TextCase } from 'cs-lab-kit';

TextCase.camelCase('hello world'); // 'helloWorld'
TextCase.pascalCase('hello_world'); // 'HelloWorld'
TextCase.snakeCase('helloWorld'); // 'hello_world'
TextCase.kebabCase('HelloWorld'); // 'hello-world'
TextCase.constantCase('hello world'); // 'HELLO_WORLD'
TextCase.titleCase('hello world'); // 'Hello World'
TextCase.uppercase('hello'); // 'HELLO'
TextCase.lowercase('HELLO'); // 'hello'
TextCase.invertText('hello'); // 'olleh'
TextCase.removeAccents('café'); // 'cafe'
```

| Method          | Signature                  | Description                                |
| --------------- | -------------------------- | ------------------------------------------ |
| `camelCase`     | `(text: string) => string` | Converts to camelCase                      |
| `pascalCase`    | `(text: string) => string` | Converts to PascalCase                     |
| `snakeCase`     | `(text: string) => string` | Converts to snake_case                     |
| `kebabCase`     | `(text: string) => string` | Converts to kebab-case                     |
| `constantCase`  | `(text: string) => string` | Converts to CONSTANT_CASE                  |
| `titleCase`     | `(text: string) => string` | Converts to Title Case                     |
| `uppercase`     | `(text: string) => string` | Converts to UPPERCASE                      |
| `lowercase`     | `(text: string) => string` | Converts to lowercase                      |
| `invertText`    | `(text: string) => string` | Reverses the characters of the string      |
| `removeAccents` | `(text: string) => string` | Removes diacritics/accents from the string |

---

### 🔐 Base64 — Encode & Decode

Encode strings to Base64 and decode them back, with built-in format validation.

```ts
import { Base64 } from 'cs-lab-kit';

Base64.encode('hello world'); // 'aGVsbG8gd29ybGQ='
Base64.decode('aGVsbG8='); // 'hello'
Base64.isValid('aGVsbG8='); // true
Base64.isValid('not valid!'); // false
```

| Method    | Signature                    | Description                        |
| --------- | ---------------------------- | ---------------------------------- |
| `encode`  | `(value: string) => string`  | Encodes a UTF-8 string to Base64   |
| `decode`  | `(value: string) => string`  | Decodes a Base64 string to UTF-8   |
| `isValid` | `(value: string) => boolean` | Checks if a string is valid Base64 |

---

### 🔑 JWT — Encode, Decode & Verify

Create, inspect and verify JSON Web Tokens using HMAC-SHA256 — no external libraries needed.

```ts
import { JWT } from 'cs-lab-kit';

const token = JWT.encode({ id: 1, role: 'admin' }, 'my-secret');
// 'eyJhbGciOiJIUzI1NiIs...'

const payload = JWT.decode(token);
// { id: 1, role: 'admin' }

JWT.isValid(token); // true (structural check)
JWT.isValid(token, 'my-secret'); // true (signature verified)
JWT.isValid(token, 'wrong-key'); // false
```

| Method    | Signature                                                      | Description                                                     |
| --------- | -------------------------------------------------------------- | --------------------------------------------------------------- |
| `encode`  | `(payload: Record<string, unknown>, secret: string) => string` | Signs a payload as an HS256 JWT                                 |
| `decode`  | `(token: string) => Record<string, unknown>`                   | Decodes the payload without verifying the signature             |
| `isValid` | `(token: string, secret?: string) => boolean`                  | Validates structure; verifies signature when secret is provided |

---

### 🎲 Generator — Fake Data for Tests

Generate UUIDs, names, emails, passwords, colors, IPs and random numbers — perfect for seeding test suites and mock data.

```ts
import { Generator } from 'cs-lab-kit';

Generator.uuid(); // 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
Generator.fuid(); // 'f47ac10b58cc4372a5670e02b2c3d479'

Generator.firstName(); // 'Ana'
Generator.lastName(); // 'Silva'
Generator.fullName(); // 'Ana Silva'
Generator.email(); // 'ana.silva42@gmail.com'

Generator.password({
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
});
// 'aB3k@9mZ!pQ7xR2$'

Generator.color(); // '#a3f2c1'
Generator.ipv4(); // '192.168.1.45'
Generator.integer(1, 100); // 42
Generator.float(0, 1); // 0.7341
```

| Method      | Signature                                | Description                                     |
| ----------- | ---------------------------------------- | ----------------------------------------------- |
| `uuid`      | `() => string`                           | Generates a UUID v4                             |
| `fuid`      | `() => string`                           | Generates a flat UUID (no dashes, 32 hex chars) |
| `firstName` | `() => string`                           | Random first name from built-in list            |
| `lastName`  | `() => string`                           | Random last name from built-in list             |
| `fullName`  | `() => string`                           | Random full name (first + last)                 |
| `email`     | `() => string`                           | Random fake email address                       |
| `password`  | `(options?: IPasswordOptions) => string` | Configurable random password                    |
| `color`     | `() => string`                           | Random hex color (`#rrggbb`)                    |
| `ipv4`      | `() => string`                           | Random IPv4 address                             |
| `integer`   | `(min?: number, max?: number) => number` | Random integer in range (default 0–100)         |
| `float`     | `(min?: number, max?: number) => number` | Random float in range (default 0–1)             |

---

## 🔭 Roadmap

These features are planned for upcoming releases:

| Feature   | Description                                         |
| --------- | --------------------------------------------------- |
| `JSON`    | Formatter, minifier and prettifier for JSON strings |
| `QR Code` | QR Code generator                                   |
| `TOTP`    | Time-based One-Time Password generator              |

---

## 🚀 Quick Start

```ts
import {
  CPF,
  CNPJ,
  CEP,
  CreditCard,
  LicensePlate,
  TextCase,
  Base64,
  JWT,
  Generator,
} from 'cs-lab-kit';

// Validate user input
CPF.isValid('123.456.789-09'); // true
CNPJ.isValid('12.345.678/0001-95'); // true
CreditCard.isValid('4111 1111 1111 1111'); // true

// Generate test data
const cpf = CPF.generate(true); // '987.654.321-00'
const card = CreditCard.generate(true); // '4532 0151 1283 0366'
const plate = LicensePlate.generate(); // 'XYZ3K45'
const email = Generator.email(); // 'ana.silva42@gmail.com'

// Look up a real address
const address = await CEP.fetchBrazilianAddress('01001-000');

// Convert strings
TextCase.camelCase('hello world'); // 'helloWorld'

// Encode and decode
Base64.encode('hello'); // 'aGVsbG8='
const token = JWT.encode({ userId: 1 }, 'secret'); // signed JWT
```

---

[MIT](./LICENSE) &copy; [Cristhian Santos](https://github.com/dev-cristhian)
