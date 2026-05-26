# Test Plan — Playwright 1.59

## Release Overview

Playwright 1.59 introduziu diversas APIs novas. As features mais relevantes para este projeto sao:

| Feature | API | Status dos testes |
|---|---|---|
| Screencast (video, chapters, overlays, actions) | `page.screencast.*` | Coberto |
| `setStorageState` | `browserContext.setStorageState()` | Coberto |
| `locator.describe()` | `locator.describe()` | Coberto (via Page Objects) |
| `{ steps }` em `locator.click()` | `click({ steps: n })` | Coberto |
| `storageState({ indexedDB: true })` | `browserContext.storageState()` | Coberto |
| `await using` (async disposables) | Sintaxe TS | Nao aplicado |
| `browser.bind()` / interoperabilidade | `browser.bind()` | Fora do escopo |
| `page.clearConsoleMessages()` / `page.clearPageErrors()` | — | Nao coberto |
| `consoleMessage.timestamp()` | — | Nao coberto |
| `request.existingResponse()` | — | Nao coberto |
| `response.httpVersion()` | — | Nao coberto |
| `browserContext.isClosed()` | — | Nao coberto |
| `page.ariaSnapshot()` | — | Nao coberto |
| `locator.normalize()` | — | Nao coberto |
| `browserContext.debugger` | — | Nao coberto |

## Features testadas em detalhe

### 1. Screencast — `page.screencast.showChapter()`

**Spec**: `tests/1_59/multiProductCheckoutFlow.spec.ts`

O teste `multiProductCheckoutFlow.spec.ts` exercita a API de screencast em cada step do fluxo de checkout multiproduto:

```ts
await page.screencast.showChapter('Login', {
  description: 'Authenticate with the standard user',
  duration: 1000
});
```

Uso no teste:
- `showChapter('Login', ...)` — antes do login
- `showChapter('Add products', ...)` — antes de adicionar produtos
- `showChapter('Cart review', ...)` — antes de revisar o carrinho
- `showChapter('Checkout', ...)` — antes de preencher dados de checkout
- `showChapter('Order confirmed', ...)` — na confirmacao visual

Alem disso, a config do projeto (`playwright.config.ts`) usa `video.show` para anotacoes automaticas de acoes:

```ts
video: {
  mode: 'retain-on-failure',
  show: {
    actions: { position: 'top-right' },
    test: { position: 'top-left' }
  }
}
```

### 2. `browserContext.setStorageState()` — persistencia de estado entre contextos

**Spec**: `tests/1_59/storageManagement.spec.ts`

Este teste valida o fluxo completo da nova API `setStorageState()`:

1. **Step 1**: Login e adicao de produtos em um contexto. Salva o estado com `storageState({ indexedDB: true })` e fecha o contexto.
2. **Step 2**: Cria um novo contexto, restaura o estado com `setStorageState(savedState)`, e verifica que o badge do carrinho mostra o numero correto de itens sem novo login.
3. **Step 3**: Restaura o estado novamente em um terceiro contexto e completa o checkout completo (carrinho → dados → confirmacao).

```ts
savedState = await context.storageState({ indexedDB: true });

const newContext = await browser.newContext();
await newContext.setStorageState(savedState);
```

Pontos validados:
- Cookies de sessao sobrevivem entre contextos
- Estado do carrinho (badge) e preservado
- IndexedDB e incluido no snapshot
- Fluxo de checkout funciona apos restauracao de estado

### 3. `locator.describe()` — descricoes em locators

Aplicado em todos os Page Objects (`src/pages/*.ts`):

```ts
this.cartLink = page.locator('[data-test="shopping-cart-link"]').describe('Shopping cart link');
this.inventoryItem = page.locator('[data-test="inventory-item"]').describe('Inventory product card');
```

Usado em: `inventoryPage.ts`, `cartPage.ts`, `checkoutPage.ts`.

### 4. `{ steps }` em `locator.click()`

O parametro `steps` controla o numero de eventos `mousemove` emitidos durante o movimento do ponteiro. Usado em:

```ts
await product.locator(this.addToCartButton).click({ steps: 5 });
await this.checkoutButton.click({ steps: 5 });
await this.finishButton.click({ steps: 5 });
```

Arquivos: `src/pages/inventoryPage.ts`, `src/pages/cartPage.ts`, `src/pages/checkoutPage.ts`.

## Features nao cobertas

As seguintes APIs do 1.59 nao possuem testes dedicados neste release:

| API | Motivo |
|---|---|
| `page.screencast.start()` / `stop()` | Requer gravacao de video em disco; fora do escopo de teste funcional |
| `page.screencast.showOverlay()` | Overlay visual; sem impacto funcional |
| `browser.bind()` | Interoperabilidade com CLI/MCP; fora do escopo |
| `await using` | Sintaxe TS; requer Node.js com suporte explicito ao `AsyncDisposable` |
| `page.clearConsoleMessages()` | Nao ha cenario de uso na aplicacao alvo |
| `consoleMessage.timestamp()` | Nao ha cenario de uso na aplicacao alvo |
| `request.existingResponse()` | Nao ha cenario de uso na aplicacao alvo |
| `response.httpVersion()` | Nao ha cenario de uso na aplicacao alvo |
| `browserContext.isClosed()` | Nao ha cenario de uso na aplicacao alvo |
| `page.ariaSnapshot()` | Pode ser explorado em release futura |
| `locator.normalize()` | Pode ser explorado em release futura |
| `browserContext.debugger` | Uso de debugging; fora do escopo de teste funcional |
| `tracing.start({ live })` | Requer infraestrutura de trace ao vivo |
| `testProject.artifactsDir` | Config; nao requer teste funcional |

## Estrutura dos testes 1.59

```
tests/1_59/
  multiProductCheckoutFlow.spec.ts  — checkout multiproduto com screencast chapters
  storageManagement.spec.ts         — persistencia de estado via setStorageState
```

## Diferencas em relacao ao 1.58

| Aspecto | 1.58 | 1.59 |
|---|---|---|
| Screencast chapters | Nao usado | `page.screencast.showChapter()` em cada step |
| Video config | `retain-on-failure` | `retain-on-failure` + `show.actions` e `show.test` |
| `setStorageState` | Nao existia | Novo teste dedicado |
| `storageState({ indexedDB })` | Nao existia | Usado para capturar IndexedDB |
| `locator.describe()` | Nao usado | Aplicado em todos os Page Objects |
| `click({ steps })` | Nao usado | Aplicado em clicks de acao |

## Infraestrutura e Page Objects

Nenhum Page Object novo foi criado para o 1.59. Os Page Objects existentes foram atualizados com:

- `locator.describe()` em todos os locators (trace viewer e reports mais descritivos)
- `click({ steps: 5 })` em acoes criticas (simulacao mais realista de interacao)
- `storageManagement.spec.ts` importa Page Objects diretamente em vez de usar fixtures, pois gerencia multiplos contextos manualmente

## Config

`playwright.config.ts` foi atualizado com:

```ts
video: {
  mode: 'retain-on-failure',
  show: {
    actions: { position: 'top-right' },
    test: { position: 'top-left' }
  }
}
```

Isso ativa as anotacoes visuais automaticas de acoes (feature do 1.59 screencast) sem necessidade de chamar `showActions()` manualmente em cada teste.

## Como rodar

```bash
# Testes do 1.59 apenas (chromium)
npx playwright test tests/1_59 --project=chromium

# Todos os testes do 1.59 em todos os browsers
npx playwright test tests/1_59

# Teste especifico de storage
npx playwright test tests/1_59/storageManagement.spec.ts

# Teste especifico de checkout com screencast
npx playwright test tests/1_59/multiProductCheckoutFlow.spec.ts
```

## Breaking changes do 1.59

- Suporte a macOS 14 para WebKit foi removido
- Pacote `@playwright/experimental-ct-svelte` foi removido

Nenhum impacto direto nos testes deste projeto.
