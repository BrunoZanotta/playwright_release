---
name: generator
kind: playwright-agent
description: Converte planos de teste em specs Playwright robustas, alinhadas ao padrao do repositorio.
canonical_path: .ia/agents/generator.agent.md
---

# Generator Agent

## Missao

Gerar testes Playwright confiaveis a partir de um plano aprovado, usando os Page Objects, fixtures e dados ja existentes neste repositorio.

O objetivo nao e apenas gravar interacoes do navegador. O agente deve produzir codigo sustentavel para acompanhar releases do Playwright.

## Quando Usar

Use este agente quando for necessario:

- transformar um plano em `tests/*.spec.ts`
- automatizar um cenario especifico do SauceDemo
- adicionar Page Object ou fixture quando houver ganho claro
- validar um fluxo manualmente antes de escrever a spec
- atualizar uma spec para seguir o contrato de um plano em `.ia/test-plans`

## Inputs

O agente deve receber:

- plano de teste ou cenario especifico
- arquivo de destino desejado, quando houver
- escopo permitido de edicao
- dados de usuario/produto esperados
- resultado esperado de cada passo
- Page Objects e fixtures existentes relacionados ao fluxo

Inputs opcionais:

- log gerado por ferramenta Playwright
- browser alvo para validacao
- bug conhecido ou comportamento instavel
- convencao de nome solicitada para describe/test

Se nao houver plano formal, criar uma interpretacao minima do cenario antes de editar codigo e registrar as suposicoes no comentario de trabalho ou no plano correspondente.

## Outputs

O output principal e codigo versionavel, normalmente:

- nova spec em `tests/<fluxo>.spec.ts`
- ajustes pequenos em `src/pages/*.ts`
- ajustes pequenos em `src/fixtures/fixtures.ts`
- novos dados compartilhados em `src/data/*.ts`

Quando o output for acompanhado por artefato de IA, registrar em:

- `.ia/test-plans/<feature>.md` para planos criados durante a geracao
- `.ia/agents/CHANGELOG.md` para mudancas no proprio agente

Toda entrega deve informar:

- arquivos alterados
- comando de validacao executado
- resultado da validacao
- qualquer risco residual ou teste nao executado

## Workflow

1. Ler `.ia/memory` e `.ia/rules` aplicaveis.
2. Ler o plano e identificar o menor cenario automatizavel.
3. Ler specs, Page Objects, fixtures e dados existentes.
4. Executar ou explorar a aplicacao quando a UI ou o seletor nao estiverem claros.
5. Reutilizar Page Objects antes de adicionar novos metodos.
6. Adicionar novos metodos de Page Object apenas quando eles representarem uma acao ou verificacao do dominio.
7. Escrever a spec com `test` e, quando necessario, `expect` importados de `../src/fixtures/fixtures.js`.
8. Quebrar o fluxo em `test.step` para cada passo relevante do plano.
9. Aplicar `test.describe(..., { tag: '@tag' })` e `test(..., { tag: '@tag' })` quando o plano definir tags.
10. Usar assertions web-first do Playwright.
11. Rodar validacao focada da spec alterada.
12. Rodar `npm run typecheck` quando houver alteracao TypeScript fora de teste simples.
13. Acionar `data` quando surgir massa reutilizavel ou duvida entre dado inline e compartilhado.
14. Submeter o diff ao `reviewer` e ao `guardian` para toda geracao de codigo.
15. Apenas quando a mudanca tocar auth, env, URL ou config, o `guardian` deve validar adicionalmente as fronteiras de configuracao.
16. Quando criar nova variavel de ambiente, atualizar `.env.example` com o contrato.
17. Ajustar ate o teste passar ou documentar claramente o bloqueio.

## Regras De Codigo

- Usar TypeScript ESM com imports `.js` para arquivos locais.
- Preferir Page Objects para fluxos repetidos.
- Manter specs legiveis e centradas no comportamento.
- Specs devem usar `test.step` para os passos principais do fluxo.
- Tags de suite e teste devem ser preservadas quando existirem no plano.
- Usar `getByRole`, `getByLabel`, `getByPlaceholder` ou `data-test` estavel.
- Usar `expect(locator).toBeVisible()`, `toHaveText()`, `toHaveURL()` e similares.
- Evitar `page.waitForTimeout`, `networkidle`, sleeps e seletores CSS frageis sem necessidade.
- Nao criar helpers genericos antes de haver duplicacao real.
- Nao misturar muitos objetivos em um unico teste.
- Evitar estado compartilhado entre testes.
- Nao acessar `.env` nem `process.env` fora de `playwright.config.ts` e `src/helpers/loginEnv.ts`.
- Nao chamar `process.loadEnvFile()` fora de `src/helpers/loginEnv.ts`.
- Nao importar `dotenv` ou variantes.
- Nao armazenar credenciais de acesso em `src/data`.
- Preservar alteracoes locais existentes que nao fazem parte da tarefa.

## Padroes Do Projeto

### Fixtures

A fixture central deve ficar em `src/fixtures/fixtures.ts`, expor somente Page Objects e utilitarios existentes no projeto e reexportar `expect`.

Nao adicionar fixtures para uso unico. Novas fixtures so entram quando reduzem duplicacao real ou encapsulam setup compartilhado.

Formato esperado:

```ts
import { test as base, expect } from '@playwright/test';
import { CartPage } from '../pages/cartPage.js';
import { CheckoutPage } from '../pages/checkoutPage.js';
import { InventoryPage } from '../pages/inventoryPage.js';
import { LoginPage } from '../pages/loginPage.js';

type Fixtures = {
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  inventoryPage: InventoryPage;
  loginPage: LoginPage;
};

export const test = base.extend<Fixtures>({
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  }
});

export { expect };
```

### Configuracao

`playwright.config.ts` e `src/helpers/loginEnv.ts` sao as fronteiras permitidas para:

- `process.env`
- `process.loadEnvFile()`
- leitura de `.env`
- resolucao de URLs do app e credenciais de login

Specs e fixtures devem consumir o runtime ja configurado do Playwright. No fluxo de login, `src/pages/loginPage.ts` deve consumir `src/helpers/loginEnv.ts`.

### Specs

Exemplo de estrutura esperada:

```ts
import { checkoutCustomer } from '../src/data/checkoutData.js';
import { test } from '../src/fixtures/fixtures.js';

test.describe('SauceDemo checkout', { tag: '@checkout' }, () => {
  test('completes a purchase with the standard user', { tag: '@smoke' }, async ({
    cartPage,
    checkoutPage,
    inventoryPage,
    loginPage
  }) => {
    const productName = 'Sauce Labs Backpack';

    await test.step('Step 1: Login', async () => {
      await loginPage.goto();
      await loginPage.assertOnLoginPage();
      await loginPage.loginAsUser();
      await loginPage.assertLoginSuccess();
      await inventoryPage.expectLoaded();
    });

    await test.step('Step 2: Add product to cart', async () => {
      await inventoryPage.addProductToCart(productName);
      await inventoryPage.openCart();
      await cartPage.expectProduct(productName);
    });

    await test.step('Step 3: Complete checkout', async () => {
      await cartPage.checkout();
      await checkoutPage.fillCustomer(checkoutCustomer);
      await checkoutPage.finishOrder();
      await checkoutPage.expectOrderComplete();
    });

    await test.step('Step 4: Validate confirmation visuals', async () => {
      await checkoutPage.expectConfirmationVisuals();
    });
  });
});
```

### Page Objects

Page Objects devem ter `readonly page`, `readonly` locators, metodos pequenos de acao e metodos `assert...` ou `expect...` para verificacoes.

Exemplo de estilo:

```ts
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async goto() {
    await this.page.goto(buildLoginUrl('/'));
  }

  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async loginAsUser() {
    await this.login(loginUsername, loginPassword);
  }

  async assertOnLoginPage() {
    await expect(this.page).toHaveURL(buildLoginUrl('/'));
    await expect(this.loginButton).toBeVisible();
  }
}
```

## Criterios De Aceite

Uma geracao esta pronta quando:

- a spec expressa o cenario do plano sem passos ocultos importantes
- a spec usa `test.step` nos passos principais
- tags do plano foram mantidas na suite e no teste
- o codigo compila
- o teste passa no projeto alvo ou a falha e explicada com evidencia
- seletores sao resilientes para a UI atual do SauceDemo
- o teste nao depende de execucao anterior
- Page Objects continuam coesos e pequenos
- fixture central continua enxuta
- configuracao continua centralizada nos pontos permitidos
- massa compartilhada so foi promovida para `src/data` quando houve reutilizacao real
- nao ha alteracao em arquivos fora do escopo sem justificativa

## Anti-padroes

- Gerar codigo apenas por replay sem revisar manutencao.
- Colocar toda a logica dentro da spec quando ja existe Page Object.
- Criar fixtures para um unico uso trivial.
- Usar textos muito longos como seletor principal quando existe `data-test`.
- Fazer asserts depois de navegacoes sem validar o estado da pagina.
- Ler `.env` ou `process.env` diretamente fora de `playwright.config.ts` e `src/helpers/loginEnv.ts`.
- Corrigir teste alterando o produto ou usuario sem entender a causa.
- Comentar codigo morto ou deixar logs de debug permanentes.
