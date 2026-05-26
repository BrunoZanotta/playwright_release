# Project Memory

## Identity

- Projeto: `playwright_releases`
- Objetivo: acompanhar evolucoes do Playwright por release usando SauceDemo como aplicacao alvo
- Stack atual: Playwright Test `1.60.0`, TypeScript, ESM
- Cliente de agentes: definicoes versionadas em `.ia/agents`

## Current Architecture

- Specs ficam em `tests/<versao>` organizados por release do Playwright
- Fixtures ficam em `src/fixtures/fixtures.ts`
- Helpers ficam em `src/helpers`
- Page Objects ficam em `src/pages`
- Dados compartilhados ficam em `src/data`
- Config principal fica em `playwright.config.ts`
- `src/helpers/loginEnv.ts` le `BASE_URL`, `USERNAME` e `PASSWORD` do `.env` para o fluxo de login

## Test Directory Convention

- Testes ficam em subdiretorios por versao: `tests/1_56/`, `tests/1_57/`, `tests/1_58/`, `tests/1_59/`
- Cada nova release do Playwright recebe seu proprio subdiretorio
- Specs em subdiretorios usam imports com prefixo `../../src/`
- Testes que gerenciam multiplos contextos manualmente podem importar Page Objects diretamente em vez de usar fixtures

## Current File Map

- `tests/1_56/singleProductCheckoutFlow.spec.ts`: fluxo canonico de login, carrinho e checkout com um produto (baseline 1.56)
- `tests/1_57/multiProductCheckoutFlow.spec.ts`: fluxo de checkout com multiplos produtos e verificacao de total (1.57)
- `tests/1_58/multiProductCheckoutFlow.spec.ts`: fluxo de checkout multiproduto (1.58)
- `tests/1_59/multiProductCheckoutFlow.spec.ts`: fluxo de checkout multiproduto com screencast chapters (1.59)
- `tests/1_59/storageManagement.spec.ts`: persistencia de estado entre contextos via `setStorageState` (1.59)
- `src/fixtures/fixtures.ts`: fixture central com `loginPage`, `inventoryPage`, `cartPage` e `checkoutPage`
- `src/helpers/loginEnv.ts`: helper minimo para `BASE_URL`, `USERNAME`, `PASSWORD` e `buildLoginUrl()`
- `src/pages/loginPage.ts`: navegação, login e validacao de acesso consumindo `loginEnv`
- `src/pages/inventoryPage.ts`: carregamento de inventario, adicao de multiplos produtos, preco de produto e abertura do carrinho
- `src/pages/cartPage.ts`: validacao de itens no carrinho, precos, calculo de total e inicio de checkout
- `src/pages/checkoutPage.ts`: preenchimento de cliente, validacao de total, finalizacao e confirmacao
- `src/data/checkoutData.ts`: massa compartilhada `checkoutCustomer`

## Naming Conventions

- Arquivos de Page Object devem comecar com letra minuscula: `loginPage.ts`, `inventoryPage.ts`, `cartPage.ts`, `checkoutPage.ts`
- Classes podem continuar com PascalCase: `LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage`
- Arquivos de spec usam sufixo `.spec.ts`

## Spec Contract

- Specs importam `test` de `../../src/fixtures/fixtures.js` (prefixo `../../src/` porque specs ficam em `tests/<versao>/`)
- Specs NAO devem ter `const` com calculos, `expect` inline ou logica de UI direto na spec
- Toda logica de calculo e validacao deve estar encapsulada em metodos de Page Object
- Specs devem usar `test.step` para separar etapas relevantes do fluxo
- Quando houver classificacao operacional, usar tags no `describe` e no `test`
- Fluxos devem preferir Page Objects em vez de logica de UI direto na spec
- Specs devem consumir configuracao via funcao ou constante exportada
- `src/pages/loginPage.ts` deve consumir o helper `src/helpers/loginEnv.ts` para URL e credenciais de login
- `productName` e `products` podem permanecer inline na spec quando forem especificos do cenario
- `checkoutCustomer` e reutilizado via `src/data/checkoutData.ts`
- Testes que gerenciam multiplos contextos (ex: `storageManagement.spec.ts`) podem importar Page Objects diretamente em vez de usar fixtures

## Page Object Contract

- Page Objects mantem `readonly page: Page`
- Todos os locators usados nos metodos DEVEM ser declarados como `readonly` na classe e inicializados no `constructor`
- Metodos NAO devem conter seletores inline como `this.page.locator('[data-test="..."]')` ou `this.page.getByRole(...)` — todo seletor deve ser uma propriedade `readonly` do constructor
- Excecao: locators filtrados dinamicamente (ex: `.filter({ hasText: name })`) podem ser criados inline a partir de um `readonly` base
- Metodos devem ser pequenos, previsiveis e orientados ao dominio
- Verificacoes devem preferir metodos `assert...` ou `expect...` consistentes com o Page Object
- NAO criar metodos duplicados que fazem a mesma coisa com parametros diferentes (ex: `addProduct` + `addProducts`) — usar o metodo pluralizado que aceita array
- URLs e credenciais devem vir dos pontos permitidos de configuracao
- Page Objects podem usar `locator.describe()` para traces e reports mais descritivos
- Acoes criticas podem usar `click({ steps: n })` para simulacao mais realista de interacao

### Padrao de estrutura de Page Object

```ts
export class ExamplePage {
  readonly page: Page;
  readonly someButton: Locator;
  readonly someLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.someButton = page.getByRole('button', { name: 'Some action' });
    this.someLabel = page.locator('[data-test="some-label"]');
  }

  async expectSomething() {
    await expect(this.someLabel).toBeVisible();
  }
}
```

## Fixture Contract

- Existe uma fixture central unica em `src/fixtures/fixtures.ts`
- Ela expoe apenas objetos realmente existentes no projeto
- Ela deve reexportar `expect`
- Nao adicionar fixtures novas sem ganho claro de reutilizacao

## Coverage Snapshot

- `tests/1_56/`: fluxo de checkout com produto unico (baseline)
- `tests/1_57/`: fluxo de checkout com multiplos produtos e verificacao de total
- `tests/1_58/`: fluxo de checkout multiproduto (mesmo padrao 1.57)
- `tests/1_59/`: checkout multiproduto com screencast chapters + gestao de estado via `setStorageState`
- Todos cobrem login com usuario padrao, adicao de produto(s), revisao de carrinho, checkout e confirmacao visual
- `storageManagement.spec.ts` (1_59) cobre persistencia de estado entre contextos com `setStorageState` e `storageState({ indexedDB: true })`
- Qualquer novo dado compartilhado ou novo agente deve ser justificado por reutilizacao real

## Config Contract

- Variaveis de acesso vivem em `.env`
- O contrato versionado vive em `.env.example`
- Somente `playwright.config.ts` e `src/helpers/loginEnv.ts` podem acessar `.env` ou `process.env`
- Modulos consumidores devem usar `baseURL` do Playwright; login consome `buildLoginUrl`, `loginUsername` e `loginPassword`
- Variaveis obrigatorias de acesso nao devem ter fallback hardcoded no codigo

## Validation Baseline

- `npm run typecheck`
- `npm test`
- `npm run test:all`
- `npm run audit:security`
- `npm run audit:signatures`

## Playwright Features In Use

- `locator.describe()`: aplicado em Page Objects para traces e reports mais descritivos
- `click({ steps: n })`: aplicado em acoes criticas para simulacao mais realista
- `page.screencast.showChapter()`: usado em `tests/1_59/` para chapters de video
- `browserContext.setStorageState()`: usado em `tests/1_59/storageManagement.spec.ts`
- `browserContext.storageState({ indexedDB: true })`: inclui IndexedDB no snapshot de estado
- `video.show` config: anotacoes visuais automaticas de acoes e testes

## Security Baseline

- Nao versionar secrets, tokens ou credenciais privadas
- Usar `npx --no-install` no MCP local
- Evitar downloads implicitos em tooling
- Nao usar dados sensiveis em fixtures, specs ou artefatos `.ia`
