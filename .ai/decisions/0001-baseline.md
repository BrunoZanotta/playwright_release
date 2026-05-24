# Decision 0001: Baseline Playwright 1.56.1

## Context

O projeto acompanha evolucoes do Playwright por release usando SauceDemo como alvo estavel para automacao.

## Decision

- Usar Playwright Test `1.56.1` como baseline.
- Usar TypeScript, Page Objects e fixtures.
- Criar agents apenas no baseline e evolui-los incrementalmente.
- Manter uma camada de agentes com responsabilidades separadas para planejamento, geracao, healing, revisao, seguranca, configuracao, memoria, release, dados e triagem de falhas.
- Usar loop `vscode` para compatibilidade com Cursor.
- Versionar `.ia` e `.vscode/mcp.json`.

## Consequences

- Cada release futura deve explicar mudancas em testes e agents.
- O historico de evolucao dos agents fica auditavel no repo.
- O MCP deve continuar usando dependencias locais do projeto.

## Atualizacoes Posteriores

### Playwright 1.60.0

- Versao atualizada de `1.56.1` para `1.60.0`
- Chrome for Testing substituiu Chromium como browser padrao
- Adicionado teste de multi-product checkout em `tests/multiProductCheckoutFlow.spec.ts`
- Page Objects refinados com padrao obrigatorio: todos os locators como `readonly` no constructor
- Consolidacao de metodos duplicados (versoes singular/plural) em metodos unicos com array
- Remocao de metodos intermediarios desnecessarios (inlining)
- Spec pattern refinado: sem logica inline (const com calculos, expect, seletores)
