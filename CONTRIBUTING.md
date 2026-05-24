# Contributing Guide — cs-lab-kit

This is the manual for anyone working on the `cs-lab-kit` codebase — both people and AI
agents. It describes the full workflow, from creating a branch to the automatic publication
of a new version on npm.

> For installation and usage of the package, see the [README](./README.md). This guide is for development only.

---

## Tech stack

| Tool                    | Purpose                                                     |
| ----------------------- | ----------------------------------------------------------- |
| **TypeScript**          | Source language                                             |
| **tsup**                | Build — generates `dist/` in ESM, CJS and type declarations |
| **Vitest**              | Unit testing                                                |
| **ESLint**              | Code quality                                                |
| **Prettier**            | Formatting                                                  |
| **Husky + lint-staged** | Git hooks (automatic checks)                                |
| **Changesets**          | Versioning and changelog                                    |
| **GitHub Actions**      | CI and automated publishing                                 |

---

## Prerequisites

- **Node.js 18 or higher**
- **npm** (the project uses `package-lock.json`)
- **Git**

## Initial setup

```bash
git clone https://github.com/dev-cristhian/cs-lab-kit.git
cd cs-lab-kit
npm install
```

`npm install` also installs the Git hooks automatically (via Husky). After that, the
environment is ready.

---

## Project structure

```
src/                 Source code (.ts). index.ts is the entry point.
                     Tests live next to the code, as *.test.ts.
dist/                Build output. Generated automatically — NOT committed.
.changeset/          Changesets configuration and pending version "notes".
.github/workflows/   CI and release workflows.
.husky/              Git hooks.
```

---

## Available commands

| Command                 | What it does                          |
| ----------------------- | ------------------------------------- |
| `npm run build`         | Generates `dist/` (ESM + CJS + types) |
| `npm test`              | Runs the tests once                   |
| `npm run test:watch`    | Runs the tests in watch mode          |
| `npm run test:coverage` | Runs the tests with a coverage report |
| `npm run typecheck`     | Type-checks without emitting files    |
| `npm run lint`          | Checks code quality (ESLint)          |
| `npm run format`        | Formats the code (Prettier)           |

---

## Workflow

Every change follows this path. **Never commit directly to `main`.**

### 1. Create a branch from an up-to-date `main`

```bash
git switch main
git pull
git switch -c type/short-description
```

Use a prefix that describes the type of change: `feat/`, `fix/`, `chore/`, `docs/`, `test/`
or `refactor/`. Example: `feat/cpf-validator`.

### 2. Make your changes

Write the code in `src/` and **write or update the tests** (`*.test.ts`) for everything you
change. New code without tests should not be merged.

### 3. Create a changeset

If the change affects what the end user receives (a new function, a bug fix, a behavior
change), create a changeset:

```bash
npx changeset
```

It asks for the change type (`patch`, `minor` or `major`) and a summary — write a clear
sentence, since it goes into the `CHANGELOG.md`. This generates a file in `.changeset/`,
which you **commit together** with the change.

When **not** to create a changeset: changes that don't affect the published package — test
tweaks, CI, formatting, or this guide.

### 4. Commit

```bash
git add .
git commit -m "feat: short description of the change"
```

Use Conventional Commit messages: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`,
`ci:`.

When you commit, the **pre-commit** hook runs automatically: it applies ESLint and Prettier
to the staged files. Formatting issues are fixed automatically; lint errors that cannot be
auto-fixed **abort the commit**.

### 5. Push

```bash
git push -u origin type/short-description
```

On push, the **pre-push** hook runs the full test suite. If any test fails, the push is
blocked.

### 6. Open a Pull Request

On GitHub, open a Pull Request from your branch into `main`. **CI** runs automatically on the
PR: typecheck, tests and build. The PR can only be merged when CI is **green**.

### 7. Merge into `main`

After review and with CI green, merge the PR into `main`. This is where the publishing
process begins.

---

## How a new version is published

Publishing is **fully automated** — nobody runs `npm publish` by hand. After a PR with a
changeset is merged into `main`:

1. The **Release** workflow detects the pending changesets and opens (or updates) an
   automatic Pull Request called **"Version Packages"**. This PR bumps the version in
   `package.json`, updates the `CHANGELOG.md`, and removes the consumed changesets.
2. Someone with permission reviews and **merges the "Version Packages" PR**.
3. On that merge, the Release workflow **publishes the new version to npm**, creates the
   **tag** `vX.Y.Z`, and the matching **GitHub Release**.

In short: nobody touches the version, changelog, tag or publishing manually. The work is just
creating changesets and merging Pull Requests.

---

## Semantic versioning

The changeset type determines how the version bumps:

| Type    | Example       | When to use                      |
| ------- | ------------- | -------------------------------- |
| `patch` | 1.0.0 → 1.0.1 | Bug fix, no API change           |
| `minor` | 1.0.0 → 1.1.0 | New feature, backward compatible |
| `major` | 1.0.0 → 2.0.0 | Breaking change                  |

When unsure between `patch` and `minor`, ask: "does this add something new?" If yes, `minor`.
When unsure between `minor` and `major`: "does existing code that uses the package keep
working without changes?" If no, `major`.

---

## Rules for AI agents

AI agents working in this repository must follow these rules, without exception:

- **Always** work on a new branch; **never** commit directly to `main`.
- For any change in `src/` that affects the package's behavior, **create a changeset**
  (`npx changeset`) with the correct type and summary.
- **Write or update tests** for any new or changed code.
- Before completing a task, run `npm run lint`, `npm test` and `npm run build`, and confirm
  all three pass.
- **Never** edit the `version` field in `package.json` manually.
- **Never** edit `CHANGELOG.md` manually.
- **Never** run `npm publish` or `changeset version` manually — automation handles that.
- **Never** commit the `dist/`, `coverage/` or `node_modules/` folders.
- Use Conventional Commit messages (`feat:`, `fix:`, `chore:`, etc.).
- Deliver the change as a Pull Request into `main`; do not merge without green CI.

---

## What never to do

- Commit directly to `main`.
- Run `npm publish`, `changeset version` or `changeset publish` manually.
- Edit the `version` in `package.json` or the `CHANGELOG.md` by hand.
- Commit `dist/`, `coverage/` or `node_modules/`.
- Merge a Pull Request with failing CI.
- Push new code without a corresponding test.

---

## Note for the maintainer

To actually enforce the "never commit directly to `main`" rule, enable branch protection on
GitHub: _Settings → Branches → Add branch protection rule_ for `main`, requiring a Pull
Request and a passing CI check before merging.
