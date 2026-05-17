# Global Rules

## Mandatory Inputs

Antes de editar codigo ou gerar plano, o agente deve ler:

- `.ia/memory/project.memory.md`
- `.ia/memory/agent.memory.md`
- `.ia/rules/global.rules.md`

Ler tambem, quando relevante:

- `.ia/rules/testing.rules.md`
- `.ia/rules/security.rules.md`
- `.ia/rules/config.rules.md`
- `.ia/workflows/agent-lifecycle.md`

## Repository Boundaries

- Codigo executavel fica em `src`, `tests` e `playwright.config.ts`
- Artefatos de IA ficam dentro de `.ia`
- Configuracao de MCP do editor continua em `.vscode/mcp.json`
- Variaveis de ambiente entram por `.env`, mas so modulos dedicados de configuracao podem le-las

## Naming

- Arquivos de Page Object devem comecar com letra minuscula
- Classes e tipos podem usar PascalCase
- Agents, memories, rules e workflows devem usar nomes ASCII e previsiveis

## Change Scope

- Preferir a menor mudanca capaz de resolver o problema
- Nao fazer refactor amplo sem motivacao real
- Nao duplicar fixture, Page Object ou massa de dados sem necessidade

## Test Style

- Specs devem usar `test.step` em fluxos relevantes
- Imports de teste devem sair de `src/fixtures/fixtures.ts`
- Assertions devem ser web-first
- Nao usar sleeps fixos, `networkidle` ou waits manuais sem justificativa excepcional

## Documentation Discipline

- Toda regra nova recorrente deve ser registrada em `.ia/rules`
- Toda decisao persistente deve ser registrada em `.ia/memory`
- Toda mudanca de papel operacional deve ser registrada em `.ia/agents`
- Toda mudanca de processo deve ser registrada em `.ia/workflows`

## Conditional Agents

- Usar `release` para upgrades ou analise de release do Playwright
- Usar `data` quando um dado estiver deixando de ser especifico de uma spec
- Usar `report` quando houver multiplas falhas ou artefatos de report para triagem
