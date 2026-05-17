# Decision 0001: Baseline Playwright 1.56.1

## Context

O projeto acompanha evolucoes do Playwright por release usando SauceDemo como alvo estavel para automacao.

## Decision

- Usar Playwright Test `1.56.1` como baseline.
- Usar TypeScript, Page Objects e fixtures.
- Criar agents apenas no baseline e evolui-los incrementalmente.
- Usar loop `vscode` para compatibilidade com Cursor.
- Versionar `.IA`, `.github/chatmodes` e `.vscode/mcp.json`.

## Consequences

- Cada release futura deve explicar mudancas em testes e agents.
- O historico de evolucao dos agents fica auditavel no repo.
- O MCP deve continuar usando dependencias locais do projeto.
