<div align="center">

# 🧪 cs-lab-kit

**The all-in-one utility toolkit for JavaScript & TypeScript developers.**

Validate, format, generate and transform data — with zero dependencies and full type safety.

[![npm version](https://img.shields.io/npm/v/cs-lab-kit?color=crimson&style=flat-square)](https://www.npmjs.com/package/cs-lab-kit)
[![npm downloads](https://img.shields.io/npm/dm/cs-lab-kit?color=orange&style=flat-square)](https://www.npmjs.com/package/cs-lab-kit)
[![license](https://img.shields.io/npm/l/cs-lab-kit?color=blue&style=flat-square)](./LICENSE)
[![node](https://img.shields.io/node/v/cs-lab-kit?color=green&style=flat-square)](https://nodejs.org)
[![types](https://img.shields.io/npm/types/cs-lab-kit?style=flat-square)](https://www.typescriptlang.org)

</div>

---

## What is cs-lab-kit?

`cs-lab-kit` is a growing collection of **production-ready utilities** built for JavaScript and TypeScript projects. Whether you need to validate a Brazilian document, generate fake test data, convert currencies, or manipulate strings — cs-lab-kit has you covered.

No bloated dependencies. No configuration. Just import and use.

> 🚧 **Active development** — New utilities are added regularly. Check the [roadmap](#-roadmap) to see what's coming next.

---

## 📦 Installation

```bash
# npm
npm install cs-lab-kit

# yarn
yarn add cs-lab-kit

# pnpm
pnpm add cs-lab-kit

# bun
bun add cs-lab-kit
```

---

## ✅ Available Now

### 🪪 CPF — Brazilian Individual Taxpayer ID

Full support for CPF validation, formatting, sanitization and generation — including the official check-digit algorithm.

```ts
import { CPF } from 'cs-lab-kit';

// Validate
CPF.isValid('123.456.789-09'); // true
CPF.isValid('111.111.111-11'); // false (repeated digits)

// Format
CPF.format('12345678909'); // '123.456.789-09'

// Clean (remove mask)
CPF.clean('123.456.789-09'); // '12345678909'

// Generate random valid CPF
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

// Validate
CNPJ.isValid('12.345.678/0001-95'); // true
CNPJ.isValid('00.000.000/0000-00'); // false (repeated)

// Format
CNPJ.format('12345678000195'); // '12.345.678/0001-95'

// Clean (remove mask)
CNPJ.clean('12.345.678/0001-95'); // '12345678000195'

// Generate random valid CNPJ
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

## 🔭 Roadmap

These features are actively planned and will be released as stable modules:

### 🎲 Generators

| Feature        | Description                                   |
| -------------- | --------------------------------------------- |
| `Name`         | Random full name generator (Brazilian locale) |
| `UUID / FUID`  | Standard UUID v4 and Firebase-style FUID      |
| `Email`        | Random valid e-mail address                   |
| `CEP`          | Brazilian postal code generator               |
| `CreditCard`   | Fake credit card number (Luhn-valid)          |
| `LicensePlate` | Brazilian vehicle plate (Mercosul & legacy)   |

### 💱 Converters

| Feature    | Description                                                                             |
| ---------- | --------------------------------------------------------------------------------------- |
| `Currency` | Real-time currency conversion between multiple currencies                               |
| `JSON`     | Formatter, minifier and prettifier for JSON strings                                     |
| `TextCase` | Convert between `UPPER`, `lower`, `PascalCase`, `camelCase`, `kebab-case`, `snake_case` |

### 🔒 Security & Encoding

| Feature    | Description                                              |
| ---------- | -------------------------------------------------------- |
| `Password` | Secure random password generator with configurable rules |
| `Base64`   | Encode and decode strings to/from Base64                 |
| `JWT`      | Decode JWT payloads without a secret (inspection only)   |

---

## 🚀 Quick Start

```ts
import { CPF, CNPJ } from 'cs-lab-kit';

// Generate test data for your test suite
const cpf = CPF.generate(true); // '987.654.321-00'
const cnpj = CNPJ.generate({ formatted: true }); // '12.345.678/0001-95'

// Validate user input
function validateDocument(doc: string) {
  if (CPF.isValid(doc)) return 'Valid CPF';
  if (CNPJ.isValid(doc)) return 'Valid CNPJ';
  return 'Invalid document';
}

// Normalize before saving to database
const raw = CPF.clean('123.456.789-09'); // '12345678909'
```

---

## 🛠️ Scripts

| Command                 | Description                    |
| ----------------------- | ------------------------------ |
| `npm run build`         | Build for production           |
| `npm run test`          | Run all tests                  |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint`          | Lint source files              |
| `npm run format`        | Format source files            |

---

## Requirements

- Node.js `>= 18`
- Works with ESM and CommonJS

---

## License

[MIT](./LICENSE) © [Cristhian Santos](https://github.com/dev-cristhian)
