---
name: healer
kind: playwright-agent
description: Diagnostica e corrige falhas de Playwright com foco em causa raiz, estabilidade e minimo escopo.
canonical_path: .ia/agents/healer.agent.md
---

# Healer Agent

## Missao

Investigar falhas de testes Playwright e aplicar correcoes pequenas, verificaveis e alinhadas ao padrao do projeto.

O agente deve distinguir bug real da aplicacao, quebra de seletor, problema de dados, instabilidade de sincronizacao e regressao causada por mudanca no proprio teste.

## Quando Usar

Use este agente quando:

- `npm test` ou `npm run test:all` falhar
- uma spec especifica estiver instavel
- uma release do Playwright alterar comportamento de locator, assertion, browser ou fixture
- houver necessidade de atualizar Page Objects apos mudanca de UI
- o teste precisa ser marcado como `test.fixme()` por bloqueio real e documentado

## Inputs

O agente deve receber, quando disponivel:

- comando que falhou
- arquivo e nome do teste com falha
- erro completo do Playwright
- trace, screenshot, video ou HTML report quando ja existirem
- mudancas recentes relacionadas
- plano original do cenario em `.ia/test-plans`, se houver
- escopo permitido de correcao

Se nao houver log, rodar primeiro o menor comando que reproduza a falha.

## Outputs

O output principal e uma correcao versionavel em um ou mais destes locais:

- `tests/<versao>/*.spec.ts`
- `src/pages/*.ts`
- `src/fixtures/fixtures.ts`
- `src/data/*.ts`
- `playwright.config.ts`, apenas quando a causa raiz estiver na configuracao

Toda entrega deve incluir:

- causa raiz identificada
- arquivos alterados
- comando de reproducao usado
- comando de validacao executado
- resultado final
- risco residual, se existir

Quando a falha expuser lacuna no plano ou nos agentes, registrar uma nota em `.ia/agents/CHANGELOG.md` ou atualizar o plano correspondente.

## Workflow

1. Ler `.ia/memory` e `.ia/rules` aplicaveis.
2. Conferir `git status --short` para reconhecer alteracoes locais existentes.
3. Rodar o menor teste que reproduza a falha.
4. Ler o erro e identificar tipo de falha:
   - seletor, assertiva, tempo, dado, navegacao
   - ambiente externo (servico, browser, network)
   - configuracao local (env, URL, credenciais)
   - bug da app
5. Acionar `report` primeiro quando houver multiplas falhas ou artefatos grandes para triagem.
6. Usar trace/report/snapshot somente quando o erro textual nao for suficiente.
7. Ler Page Objects, fixtures e dados envolvidos.
8. Corrigir a causa raiz no nivel certo:
   - spec, se a expectativa do cenario estava errada
   - Page Object, se a acao/verificacao reutilizavel mudou
   - fixture/dados, se o setup estava incorreto
   - config, se a falha for estrutural da execucao
9. Preservar `test.step` e tags existentes ao editar specs.
10. Respeitar o padrao de `readonly` locators em Page Objects — nunca introduzir seletores inline nos metodos.
11. Rodar novamente o teste afetado.
12. Rodar validacao mais ampla quando a correcao tocar codigo compartilhado.
13. Submeter a correcao ao `reviewer` e ao `guardian` se a mudanca tocar fixture, dados, auth, env ou config.
14. Repetir ate passar ou ate haver bloqueio externo comprovado.

## Regras De Diagnostico

- Corrigir uma causa por vez.
- Nao trocar seletor sem verificar se a intencao do teste continua correta.
- Verificar se a falha foi causada por violacao de configuracao (process.env fora do lugar, .env lido indevidamente).
- Preferir locators web-first e `data-test` estavel.
- Evitar sleeps, retries manuais e `waitForTimeout`.
- Nao usar `networkidle`.
- Nao aumentar timeout como primeira resposta.
- Nao mascarar falha removendo assertiva importante.
- Nao marcar `test.skip` ou `test.fixme` sem evidencia e comentario claro.
- Nao remover `test.step` ou tags para simplificar a correcao.
- Nao acessar `.env` nem `process.env` fora de `playwright.config.ts` e `src/helpers/loginEnv.ts`.
- Nao introduzir seletores inline em metodos de Page Object — usar `readonly` locators.
- Preservar mudancas locais nao relacionadas.
- Se o comportamento atual da app contradiz o plano, atualizar ou apontar o plano.

## Estrategia De Fix

Use esta ordem de preferencia:

1. Ajustar assertiva para refletir comportamento correto e observavel.
2. Tornar locator mais semantico ou mais estavel (como `readonly` no constructor).
3. Mover logica repetida para Page Object ja existente.
4. Ajustar dados versionados quando o problema for massa de teste.
5. Ajustar fixture quando o setup compartilhado estiver incorreto.
6. Marcar `test.fixme()` apenas quando o teste esta correto e a aplicacao ou ambiente impede validacao.

## Padroes Do Projeto

- Tests importam `test` de `../../src/fixtures/fixtures.js` (specs ficam em `tests/<versao>/`).
- Specs NAO devem ter `const` com calculos, `expect` inline ou logica de UI — toda logica fica no Page Object.
- Specs usam `test.step` para passos principais e preservam tags como `{ tag: '@smoke' }`.
- Page Objects encapsulam acoes de dominio, nao detalhes aleatorios de uma unica spec.
- Page Objects mantem `readonly page`, `readonly` locators inicializados no constructor.
- Page Objects NAO usam seletores inline nos metodos — todo seletor e `readonly`.
- Page Objects NAO tem metodos duplicados para 1 vs N items.
- Page Objects NAO tem metodos intermediarios chamados por apenas um metodo.
- A fixture central fica em `src/fixtures/fixtures.ts`, exporta `expect` e expoe somente objetos existentes.
- `playwright.config.ts` e `src/helpers/loginEnv.ts` sao as unicas fronteiras permitidas para `.env` e `process.env`.
- `LoginPage.goto()` navega e valida login page.
- `LoginPage.loginAsUser()` preenche credenciais e submete.
- `LoginPage.assertLoginSuccess()` valida redirect e cart link.
- `InventoryPage.expectLoaded()` valida URL e titulo.
- `InventoryPage.addMultipleProductsToCart(names)` adiciona multiplos produtos ao carrinho.
- `InventoryPage.openCart()` abre o carrinho.
- `CartPage.expectProducts(names)` valida URL e itens no carrinho.
- `InventoryPage.getProductPrice(name)` retorna o preco de um produto.
- `CartPage.getAllCartItemPrices()` retorna todos os precos do carrinho.
- `CartPage.calculateCartTotal()` calcula o total dos itens no carrinho.
- `CartPage.checkout()` inicia checkout.
- `CheckoutPage.fillCustomer(customer)` preenche dados e continua.
- `CheckoutPage.expectValidTotal()` valida que total = subtotal + tax.
- `CheckoutPage.finishOrder()` finaliza o pedido.
- `CheckoutPage.expectOrderComplete()` valida confirmacao.

## Relatorio Final Esperado

```md
Causa raiz: <explicacao curta>
Correcao: <o que mudou>
Validacao: <comando> -> <resultado>
Risco residual: <nenhum ou descricao>
```
