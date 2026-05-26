# Playwright 1.59 — Testes

Suite de testes que exercita as novas APIs introduzidas no Playwright 1.59, usando o site SauceDemo como aplicacao alvo.

## Visao Geral

| Arquivo | Feature 1.59 | API Playwright | Padrao |
|---|---|---|---|
| `multiProductCheckoutFlow.spec.ts` | Screencast / Dashboard | `page.screencast.showChapter()` | Fixtures + Page Objects |
| `ariaSnapshot.spec.ts` | Aria Snapshots | `page.ariaSnapshot()`, `locator.ariaSnapshot({ depth, mode })` | Fixtures + Page Objects |
| `consoleManagement.spec.ts` | Console & Errors | `consoleMessages({ filter })`, `clearConsoleMessages()`, `pageErrors()`, `clearPageErrors()`, `timestamp()` | Fixtures + Page Objects |
| `storageManagement.spec.ts` | Storage State | `browserContext.setStorageState()`, `storageState({ indexedDB: true })` | Infraestrutura + Page Objects |
| `awaitUsing.spec.ts` | Async Disposables | `[Symbol.asyncDispose]` em Page, Route e addInitScript | Infraestrutura + Page Objects |
| `networkInsights.spec.ts` | Network | `response.httpVersion()`, `request.existingResponse()`, `browserContext.isClosed()` | Infraestrutura + Page Objects |

---

## Testes por Arquivo

### `multiProductCheckoutFlow.spec.ts`

**Feature:** Screencast API — gravacao de video com capitulos e anotacoes visuais.

**Cenario:** Fluxo completo de checkout com 3 produtos, onde cada etapa exibe um capitulo no overlay do screencast via `showChapter()`.

| Step | Acao | Metodo Page Object |
|---|---|---|
| 1 | Login com usuario padrao | `loginPage.showChapter()` → `loginPage.goto()` → `loginPage.loginAsUser()` → `loginPage.assertLoginSuccess()` → `inventoryPage.expectLoaded()` |
| 2 | Adiciona 3 produtos ao carrinho | `inventoryPage.showChapter()` → `inventoryPage.addMultipleProductsToCart()` → `inventoryPage.openCart()` |
| 3 | Revisa carrinho e inicia checkout | `cartPage.showChapter()` → `cartPage.expectProducts()` → `cartPage.checkout()` |
| 4 | Preenche dados e finaliza | `checkoutPage.showChapter()` → `checkoutPage.fillCustomer()` → `checkoutPage.expectValidTotal()` → `checkoutPage.finishOrder()` → `checkoutPage.expectOrderComplete()` |
| 5 | Valida confirmacao visual | `checkoutPage.showChapter()` → `checkoutPage.expectConfirmationVisuals()` |

**Config relacionada** (`playwright.config.ts`):
```ts
video: {
  mode: 'retain-on-failure',
  show: {
    actions: { position: 'top-right' },
    test: { position: 'top-left' }
  }
}
```

**Dashboard:** Para visualizar os browsers no Dashboard durante a execucao, use `PLAYWRIGHT_DASHBOARD=1 npm test`.

---

### `ariaSnapshot.spec.ts`

**Feature:** Aria Snapshots — captura da arvore de acessibilidade da pagina.

**Cenarios:**

| Teste | API | Metodo Page Object | Verifica |
|---|---|---|---|
| Page-level snapshot do inventory | `page.ariaSnapshot()` | `inventoryPage.expectAriaSnapshotContains('Products')` | Snapshot contem o texto "Products" |
| Locator snapshot com `depth` | `locator.ariaSnapshot({ depth: 2 })` | `loginPage.expectFormAriaSnapshotContains(2, ['Username', 'Password'])` | Snapshot raso do formulario contem os labels esperados |
| Locator snapshot com `mode: 'ai'` | `locator.ariaSnapshot({ mode: 'ai' })` | `loginPage.expectBodyAriaSnapshotMode('ai')` | Snapshot em modo AI retorna conteudo |

**Opcoes do `ariaSnapshot()`:**
- `depth` — limita a profundidade da arvore
- `mode` — `'default'` (padrao) ou `'ai'` (otimizado para consumo por IA, inclui refs e iframes)
- `boxes` — inclui bounding boxes como `[box=x,y,w,h]`

---

### `consoleManagement.spec.ts`

**Feature:** Console Messages & Page Errors — captura, filtro e limpeza de mensagens do console e erros de pagina.

**Cenario 1 — Console messages:**

| Step | API | Metodo Page Object |
|---|---|---|
| 1 | Navega e emite mensagens | `loginPage.goto()` → `loginPage.emitConsoleMessages()` |
| 2 | Verifica quantidade minima | `loginPage.expectConsoleMessagesCount(3)` |
| 3 | Filtra mensagens desde a navegacao | `loginPage.expectConsoleMessagesFiltered(['info-message', 'warn-message', 'error-message'])` |
| 4 | Verifica timestamp da ultima mensagem | `loginPage.expectLastConsoleMessageTimestamp()` |
| 5 | Limpa e verifica vazio | `loginPage.clearAndExpectConsoleCleared()` |

**Cenario 2 — Page errors:**

| Step | API | Metodo Page Object |
|---|---|---|
| 1 | Navega e dispara erro via `page.evaluate()` | `loginPage.goto()` → `loginPage.triggerPageError()` |
| 2 | Verifica captura do erro | `loginPage.expectPageErrors(1)` |
| 3 | Limpa e verifica vazio | `loginPage.clearAndExpectPageErrorsCleared()` |

**APIs exercitadas:**
- `page.consoleMessages({ filter: 'since-navigation' | 'all' })` — retorna ate 200 mensagens
- `page.clearConsoleMessages()` — limpa mensagens armazenadas
- `page.pageErrors({ filter })` — retorna erros de pagina
- `page.clearPageErrors()` — limpa erros armazenados
- `consoleMessage.timestamp()` — timestamp em ms desde epoch

---

### `storageManagement.spec.ts`

**Feature:** `setStorageState()` — restaura estado de storage (cookies, localStorage, IndexedDB) em um contexto existente sem precisar criar um novo.

**Cenario:** Persiste estado do carrinho entre 3 contextos diferentes usando `setStorageState()`.

| Step | Acao | Detalhe |
|---|---|---|
| 1 | Login + adicionar produtos | Salva estado com `context.storageState({ indexedDB: true })` |
| 2 | Restaura estado em novo contexto | `newContext.setStorageState(savedState)` → verifica badge do carrinho |
| 3 | Restaura e completa checkout | `setStorageState()` → completa fluxo de compra inteiro |

**Diferenca vs `storageState()` anterior:** Ate 1.58, era necessario criar um novo contexto para restaurar estado. Com `setStorageState()`, o estado pode ser restaurado em um contexto ja existente, limpando cookies, localStorage e IndexedDB anteriores.

---

### `awaitUsing.spec.ts`

**Feature:** `await using` — async disposables via `Symbol.asyncDispose`. Objetos Playwright (Page, Route, InitScript) agora suportam cleanup automatico quando saem de escopo.

**Cenarios:**

| Teste | O que testa | Verificacao |
|---|---|---|
| Page auto-cleanup | `await using page = await context.newPage()` | Apos escopo, `context.pages().length === 0` |
| Route auto-cleanup | `await using route = await page.route(...)` | Dentro do escopo rota intercepta; apos escopo, nao intercepta |
| InitScript auto-cleanup | `await using script = await page.addInitScript(...)` | Dentro do escopo script executa; apos escopo, nao executa |

**Como funciona:**
1. `await using` registra o objeto para cleanup automatico
2. Quando a variavel sai de escopo (fim do bloco), `[Symbol.asyncDispose]()` e chamado
3. Page e fechada, route e removida, initScript e desabilitado

---

### `networkInsights.spec.ts`

**Feature:** Novas APIs de rede e contexto.

**Cenarios:**

| Teste | API | O que verifica |
|---|---|---|
| HTTP version | `response.httpVersion()` | Retorna versao do protocolo (ex: `'http/1.1'`, `'h2'`) |
| Existing response | `request.existingResponse()` | Retorna response ja disponivel sem esperar (nao-bloqueante) |
| Context isClosed | `browserContext.isClosed()` | Retorna `false` enquanto aberto, `true` apos `context.close()` |

---

## Page Objects Modificados

Os seguintes Page Objects receberam metodos novos para encapsular as APIs 1.59:

### `InventoryPage`
- `goto()` — navega direto para `/inventory.html`
- `expectCartBadgeCount(n)` — verifica contagem no badge do carrinho
- `expectAriaSnapshotContains(text)` — verifica conteudo no snapshot aria da pagina
- `showChapter(title, options)` — exibe capitulo no overlay do screencast

### `LoginPage`
- `showChapter(title, options)` — overlay de capitulo
- `expectFormAriaSnapshotContains(depth, texts)` — snapshot aria com profundidade
- `expectBodyAriaSnapshotMode(mode)` — snapshot aria em modo AI
- `emitConsoleMessages()` — emite mensagens de console via `page.evaluate()`
- `expectConsoleMessagesCount(min)` — verifica quantidade de mensagens
- `expectConsoleMessagesFiltered(expected)` — verifica mensagens filtradas desde navegacao
- `expectLastConsoleMessageTimestamp()` — verifica timestamp da ultima mensagem
- `clearAndExpectConsoleCleared()` — limpa e verifica console vazio
- `triggerPageError()` — dispara erro de pagina
- `expectPageErrors(min)` — verifica quantidade de erros
- `clearAndExpectPageErrorsCleared()` — limpa e verifica erros vazio

### `CartPage`
- `showChapter(title, options)` — overlay de capitulo

### `CheckoutPage`
- `showChapter(title, options)` — overlay de capitulo

---

## Como Rodar

```bash
# Todos os testes da versao 1.59
npm test -- --grep "1.59"

# Apenas um arquivo
npx playwright test tests/1_59/consoleManagement.spec.ts

# Com Dashboard ativado
PLAYWRIGHT_DASHBOARD=1 npm test -- --grep "1.59"

# Todos os browsers
npm run test:all -- --grep "1.59"
```
