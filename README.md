# Playwright Releases

End-to-end tests for [SauceDemo](https://www.saucedemo.com), written with Playwright Test and TypeScript. Specs live in directories named by Playwright release, so the checkout flow and the APIs exercised for that release stay together. The installed test runner is `@playwright/test` **1.60.0**. The suites in this repository cover releases 1.56 through 1.59.

## Tech stack

Versions below match `package.json` and `package-lock.json`.

| Piece | Version / setting |
| --- | --- |
| `@playwright/test` | 1.60.0 |
| TypeScript | 5.9.3 (`strict`, `NodeNext`, `noEmit`) |
| `@types/node` | 22.19.19 |
| Node.js | 22 (`.nvmrc`); engines `>=22 <26` |
| npm | `>=10` |
| Module format | ESM (`"type": "module"`) |
| License | MIT |

`.npmrc` sets `save-exact=true`, `package-lock=true`, `engine-strict=true`, and `audit=true`. Dependency versions are locked in `package-lock.json`.

## What the suite covers

Sixteen tests across four release directories. Each checkout spec signs in, adds catalog products, reviews the cart, completes checkout, and checks the confirmation screen.

| Directory | Spec | Scenario |
| --- | --- | --- |
| `tests/1_56/` | `singleProductCheckoutFlow.spec.ts` | One product: Sauce Labs Backpack |
| `tests/1_57/` | `multiProductCheckoutFlow.spec.ts` | Three products, plus an order-total check |
| `tests/1_58/` | `multiProductCheckoutFlow.spec.ts` | Three products, plus an order-total check |
| `tests/1_59/` | six specs | Checkout with screencast chapters, plus the 1.59 API specs listed below |

The 1.57 and 1.58 checkout specs buy Sauce Labs Backpack, Sauce Labs Bike Light, and Sauce Labs Bolt T-Shirt, then assert that the overview total matches item total plus tax.

`tests/1_59/` adds these files:

| Spec | APIs the spec calls |
| --- | --- |
| `multiProductCheckoutFlow.spec.ts` | `page.screencast.showChapter()` during the three-product checkout |
| `ariaSnapshot.spec.ts` | `page.ariaSnapshot()` and `locator.ariaSnapshot()` with `depth` and `mode` |
| `consoleManagement.spec.ts` | `consoleMessages()`, `clearConsoleMessages()`, `pageErrors()`, `clearPageErrors()`, `consoleMessage.timestamp()` |
| `storageManagement.spec.ts` | `storageState({ indexedDB: true })` and `browserContext.setStorageState()` across browser contexts, then checkout |
| `awaitUsing.spec.ts` | `await using` on a page, a route, and an init script |
| `networkInsights.spec.ts` | `response.httpVersion()`, `request.existingResponse()`, `browserContext.isClosed()` |

Shared code:

- Page objects: `src/pages/loginPage.ts`, `inventoryPage.ts`, `cartPage.ts`, `checkoutPage.ts`
- Fixtures: `src/fixtures/fixtures.ts` builds those four pages and re-exports `expect`
- Data: `src/data/checkoutData.ts` exports `checkoutCustomer`
- Config helper: `src/helpers/loginEnv.ts` reads `BASE_URL`, `USERNAME`, and `PASSWORD`

## Project structure

```
.
├── .ai/
│   ├── agents/       planner, generator, healer, reviewer, guardian,
│   │                 knowledge, data, report, release, github
│   ├── decisions/
│   ├── memory/
│   ├── rules/
│   ├── test-plans/
│   └── workflows/
├── src/
│   ├── data/checkoutData.ts
│   ├── fixtures/fixtures.ts
│   ├── helpers/loginEnv.ts
│   └── pages/
├── tests/
│   ├── 1_56/
│   ├── 1_57/
│   ├── 1_58/
│   └── 1_59/
├── .env.example
├── .nvmrc
├── package.json
├── package-lock.json
├── playwright.config.ts
└── tsconfig.json
```

## Setup

Node.js 22 and npm 10 or newer. `.nvmrc` is `22`.

```bash
git clone https://github.com/BrunoZanotta/playwright_release.git
cd playwright_release
npm ci
npx playwright install
cp .env.example .env
```

`.env.example` is the committed contract. `.env` is gitignored. Both `playwright.config.ts` and `src/helpers/loginEnv.ts` load `.env` with `process.loadEnvFile('.env')`. A missing `BASE_URL` throws when the config loads. A missing `USERNAME` or `PASSWORD` throws from the login helper. The code has no fallback values.

```
BASE_URL=
USERNAME=
PASSWORD=
```

The specs navigate SauceDemo paths (`/`, `/inventory.html`, cart, and checkout) and buy the catalog names above. SauceDemo publishes this demo account on its login page:

```
BASE_URL=https://www.saucedemo.com
USERNAME=standard_user
PASSWORD=secret_sauce
```

## Run

```bash
npm test                  # playwright test --project=chromium
npm run test:all          # playwright test (Chromium, Firefox, and WebKit)
npm run test:ui           # Playwright UI mode
npm run typecheck         # tsc --noEmit
npm run audit:security    # npm audit --audit-level=moderate
npm run audit:signatures  # npm audit signatures
```

Run one directory or one file:

```bash
npm test -- tests/1_59
npm test -- tests/1_59/storageManagement.spec.ts
npm run test:all -- tests/1_56
```

`playwright.config.ts` sets `testDir` to `./tests` and `fullyParallel` to `true`. Projects:

| Project | Device preset |
| --- | --- |
| `chromium` | Desktop Chrome |
| `firefox` | Desktop Firefox |
| `webkit` | Desktop Safari |

`use.baseURL` is the `BASE_URL` value from `.env`.

## Reports

The config registers two reporters: `list` in the terminal, and HTML with `open: 'never'`. The HTML report is written to `playwright-report/`.

```bash
npm run report    # playwright show-report
```

Artifacts from `playwright.config.ts`:

- screenshot: `only-on-failure`
- video: `retain-on-failure`, with the actions overlay at the top right and the test overlay at the top left
- trace: `on-first-retry`

`test-results/`, `playwright-report/`, and `blob-report/` are listed in `.gitignore`.

Checkout and inventory steps are wrapped in `test.step`, so the list and HTML reports show each step by name. Several locators call `locator.describe()`, which names the control in traces and reports.

## Highlights

- Release directories `tests/1_56` through `tests/1_59` keep SauceDemo flows next to the Playwright APIs each spec calls. The dependency in use is `@playwright/test` 1.60.0.
- Page objects keep locators as `readonly` fields assigned in the constructor. Critical clicks use `click({ steps: 5 })`.
- One fixture module supplies `loginPage`, `inventoryPage`, `cartPage`, and `checkoutPage`.
- Customer data used by every checkout spec comes from `src/data/checkoutData.ts`.
- `npm test` runs the Chromium project. `npm run test:all` runs Chromium, Firefox, and WebKit.
- Versions are exact, `package-lock.json` is committed, and `engine-strict` is enabled. `npm run audit:security` and `npm run audit:signatures` are the audit scripts.
- Agent definitions, rules, memory, decisions, test plans, and workflows are versioned under `.ai`. The agent files are in `.ai/agents`: `planner.agent.md`, `generator.agent.md`, `healer.agent.md`, `reviewer.agent.md`, `guardian.agent.md`, `knowledge.agent.md`, `data.agent.md`, `report.agent.md`, `release.agent.md`, and `github.agent.md`. Creating a test is documented in `.ai/workflows/run-create-new-test.md`. Following a Playwright release is documented in `.ai/workflows/release.md`.
