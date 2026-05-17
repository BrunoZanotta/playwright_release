# Project Memory

## Identity

- Projeto: `playwright_releases`
- Objetivo: acompanhar evolucoes do Playwright por release usando SauceDemo como aplicacao alvo
- Stack atual: Playwright Test `1.56.1`, TypeScript, ESM
- Cliente de agentes: definicoes versionadas em `.ia/agents`

## Current Architecture

- Specs ficam em `tests`
- Fixtures ficam em `src/fixtures/fixtures.ts`
- Helpers ficam em `src/helpers`
- Page Objects ficam em `src/pages`
- Dados compartilhados ficam em `src/data`
- Config principal fica em `playwright.config.ts`
- `src/helpers/loginEnv.ts` le `BASE_URL`, `USERNAME` e `PASSWORD` do `.env` para o fluxo de login

## Current File Map

- `tests/singleProductCheckoutFlow.spec.ts`: fluxo canonico atual de login, carrinho e checkout com um produto e `test.step`
- `src/fixtures/fixtures.ts`: fixture central com `loginPage`, `inventoryPage`, `cartPage` e `checkoutPage`
- `src/helpers/loginEnv.ts`: helper minimo para `BASE_URL`, `USERNAME`, `PASSWORD` e `buildLoginUrl()`
- `src/pages/loginPage.ts`: login e validacao de acesso com consumo de `loginEnv`
- `src/pages/inventoryPage.ts`: carregamento de inventario, adicao ao carrinho e abertura do carrinho
- `src/pages/cartPage.ts`: validacao de item no carrinho e inicio de checkout
- `src/pages/checkoutPage.ts`: preenchimento de cliente, finalizacao e validacao de confirmacao
- `src/data/checkoutData.ts`: massa compartilhada `checkoutCustomer`

## Naming Conventions

- Arquivos de Page Object devem comecar com letra minuscula: `loginPage.ts`, `inventoryPage.ts`, `cartPage.ts`, `checkoutPage.ts`
- Classes podem continuar com PascalCase: `LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage`
- Arquivos de spec usam sufixo `.spec.ts`

## Testing Conventions

- Specs importam `test` e, quando necessario, `expect` de `../src/fixtures/fixtures.js`
- Specs devem usar `test.step` para separar etapas relevantes do fluxo
- Quando houver classificacao operacional, usar tags no `describe` e no `test`
- Fluxos devem preferir Page Objects em vez de logica de UI direto na spec
- Specs devem consumir configuracao via funcao ou constante exportada
- `src/pages/loginPage.ts` deve consumir o helper `src/helpers/loginEnv.ts` para URL e credenciais de login
- A spec canonica atual mantem `productName` inline quando o dado e especifico do cenario e reutiliza `checkoutCustomer` via `src/data/checkoutData.ts`

## Fixture Contract

- Existe uma fixture central unica em `src/fixtures/fixtures.ts`
- Ela expoe apenas objetos realmente existentes no projeto
- Ela deve reexportar `expect`
- Nao adicionar fixtures novas sem ganho claro de reutilizacao

## Coverage Snapshot

- Existe hoje um fluxo principal de checkout em `tests/singleProductCheckoutFlow.spec.ts`
- O fluxo cobre login com usuario padrao, adicao de produto, revisao de carrinho, checkout e confirmacao visual
- A suite atual ainda e pequena; qualquer novo dado compartilhado ou novo agente deve ser justificado por reutilizacao real

## Config Contract

- Variaveis de acesso vivem em `.env`
- O contrato versionado vive em `.env.example`
- Somente `playwright.config.ts` e `src/helpers/loginEnv.ts` podem acessar `.env` ou `process.env`
- Modulos consumidores devem usar `baseURL` do Playwright; login consome `buildLoginUrl`, `loginUsername` e `loginPassword`
- Variaveis obrigatorias de acesso nao devem ter fallback hardcoded no codigo

## Page Object Contract

- Page Objects mantem `readonly page`
- Locators devem ser `readonly`
- Metodos devem ser pequenos, previsiveis e orientados ao dominio
- Verificacoes devem preferir metodos `assert...` ou `expect...` consistentes com o Page Object
- URLs e credenciais devem vir dos pontos permitidos de configuracao

## Validation Baseline

- `npm run typecheck`
- `npm test`
- `npm run test:all`
- `npm run audit:security`
- `npm run audit:signatures`

## Security Baseline

- Nao versionar secrets, tokens ou credenciais privadas
- Usar `npx --no-install` no MCP local
- Evitar downloads implicitos em tooling
- Nao usar dados sensiveis em fixtures, specs ou artefatos `.ia`
