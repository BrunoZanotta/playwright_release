# Workflow: run-create-new-test

## Objetivo

Workflow unico que orquestra todos os agentes necessarios para criar novos testes, executar e garantir qualidade, sem intervencao manual em cada etapa.

## Gatilho

Execute este workflow quando precisar criar um novo teste do zero.

## Comando Unico

```bash
/loop Execute run-create-new-test para: <descricao do cenario>
```

## Exemplos de Uso

```
/loop Execute run-create-new-test para: fluxo de checkout com multiplos produtos
/loop Execute run-create-new-test para: validar login com usuario bloqueado
/loop Execute run-create-new-test para: teste de adicao de produtos ao carrinho
```

## Fluxo Automatizado

### 1. Contextualizacao
- Ler `.ia/memory/project.memory.md`
- Ler `.ia/rules/global.rules.md`, `.ia/rules/testing.rules.md`, `.ia/rules/config.rules.md`
- Ler specs, Page Objects e fixtures existentes
- Identificar o que pode ser reutilizado
- Verificar se Page Objects existentes ja cobrem o cenario ou se precisam de novos metodos

### 2. Planejamento (Agent: planner)
- Criar plano de teste em `.ia/test-plans/<feature>.md`
- Definir steps, tags, dados e criterios de aceite
- Garantir que cada step mapeia para um metodo de Page Object
- Nunca planejar logica inline na spec (const com calculos, expect direto, seletores)

### 3. Geracao (Agent: generator)
- Gerar spec Playwright baseada no plano
- Salvar em `tests/<versao>/<fluxo>.spec.ts`
- Spec DEVE seguir o padrao: so chamadas a Page Objects e dados, sem logica inline
- Spec DEVE usar `test.step` para cada passo relevante
- Spec DEVE importar `test` de `../../src/fixtures/fixtures.js`

### 4. Extensao de Page Objects (se necessario)
- Novos locators DEVEM ser declarados como `readonly` na classe e inicializados no `constructor`
- Metodos NAO DEVEM conter seletores inline (`this.page.locator(...)`, `this.page.getByRole(...)`)
- NAO criar metodos duplicados para 1 vs N items — usar versao pluralizada com array
- NAO criar metodos intermediarios chamados por apenas um metodo — inliner a logica
- Metodos `expect...` encapsulam toda logica de verificacao (incluindo calculos e assertions)

### 5. Revisao Tecnica (Agent: reviewer)
- Validar aderencia aos padroes do projeto
- Checklist obrigatorio:
  - [ ] Spec usa `test.step` nos passos principais
  - [ ] Spec NAO contem `const` com calculos, `expect` inline ou logica de UI
  - [ ] Spec so chama metodos de Page Objects e dados de `src/data`
  - [ ] Page Object declara todos os locators como `readonly` no constructor
  - [ ] Page Object NAO usa seletores inline nos metodos
  - [ ] Page Object NAO tem metodos duplicados para 1 vs N items
  - [ ] Page Object NAO tem metodos intermediarios desnecessarios
  - [ ] Arquivo segue naming em minusculo
- Retornar ajustes necessarios

### 6. Revisao de Seguranca (Agent: guardian)
- Validar que nenhum segredo foi exposto
- Confirmar uso correto de `.env` (somente em `playwright.config.ts` e `src/helpers/loginEnv.ts`)
- Confirmar que nenhum `process.env` ou seletor inline foi introduzido

### 7. Execucao de Testes
```bash
npm run typecheck
npm test
npm run test:all
```

### 8. Correcao de Falhas (Agents: report + healer)
- Se houver falhas, analisar e corrigir automaticamente
- Correcoes DEVEM respeitar o padrao de `readonly` locators em Page Objects
- Correcoes NAO DEVEM introduzir logica inline na spec
- Reexecutar ate passar

### 9. Atualizacao de Memoria (Agent: knowledge)
- Registrar novos padroes aprendidos
- Atualizar file map, coverage snapshot e conventions quando necessario
- Atualizar changelog se necessario

## O Que Voce Ganha

Ao final do workflow voce tera:
- Plano de teste documentado
- Spec funcionando sem logica inline
- Page Objects com `readonly` locators, sem seletores inline
- Typecheck passando
- Testes passando em todos os browsers
- Revisoes tecnica e de seguranca aprovadas
- Memoria do projeto atualizada

## Gates de Qualidade

O workflow so conclui quando:
- [ ] Typecheck sem erros
- [ ] Testes passam em chromium
- [ ] Testes passam em todos os projetos
- [ ] Sem bloqueios do reviewer
- [ ] Sem bloqueios do guardian
- [ ] Spec sem logica inline (const com calculos, expect, seletores)
- [ ] Page Objects com todos os locators como `readonly` no constructor
- [ ] Page Objects sem metodos duplicados ou intermediarios desnecessarios
- [ ] Memoria atualizada

## Rollback Automatico

Se qualquer gate falhar:
- Pausa automaticamente
- Reporta o problema
- Aplica correcao respeitando os padroes do projeto
- Retoma do ponto de falha

## Padroes Obrigatorios

### Spec Pattern
```ts
import { checkoutCustomer } from '../../src/data/checkoutData.js';
import { test } from '../../src/fixtures/fixtures.js';

test.describe('SauceDemo <descricao>', () => {
  test('<acao> with the standard user', async ({
    cartPage,
    checkoutPage,
    inventoryPage,
    loginPage
  }) => {
    await test.step('Step 1: Login with the standard user', async () => {
      await loginPage.goto();
      await loginPage.loginAsUser();
      await loginPage.assertLoginSuccess();
      await inventoryPage.expectLoaded();
    });

    // ... mais steps chamando apenas Page Objects
  });
});
```

Specs ficam em `tests/<versao>/` e usam imports com prefixo `../../src/`.
Testes que gerenciam multiplos contextos podem importar Page Objects diretamente.

### Page Object Pattern
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

### Anti-padroes (BLOQUEAR)
- `this.page.locator('[data-test="..."]')` dentro de metodos — deve ser `readonly` no constructor
- `this.page.getByRole(...)` dentro de metodos — deve ser `readonly` no constructor
- `const x = await page.something(); expect(x)...` na spec — deve ser metodo do Page Object
- Metodos `addProduct` + `addProducts` — usar apenas `addProducts(names: string[])`
- Metodos `fillX` + `fillY` + `clickZ` so chamados por um metodo — inliner
