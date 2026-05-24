# Playwright Agents

Agents criados no baseline Playwright `1.56.1` com:

```bash
npx --no-install playwright init-agents --loop=vscode
```

Atualizados para Playwright `1.60.0` com refino de padroes de Page Object e Spec.

Arquivos canonicos:

- `.ia/agents/planner.agent.md`
- `.ia/agents/generator.agent.md`
- `.ia/agents/healer.agent.md`
- `.ia/agents/reviewer.agent.md`
- `.ia/agents/guardian.agent.md`
- `.ia/agents/knowledge.agent.md`
- `.ia/agents/data.agent.md`
- `.ia/agents/report.agent.md`
- `.ia/agents/release.agent.md`
- `.ia/agents/github.agent.md`
- `.vscode/mcp.json`

## Catalogo

| Agent | Responsabilidade | Input principal | Output principal |
| --- | --- | --- | --- |
| `planner` | Planejar cenarios e cobertura | feature, fluxo, URL, escopo, contexto do repo | plano em `.ia/test-plans/*.md` |
| `generator` | Gerar specs Playwright | plano ou cenario, destino, dados, Page Objects | codigo em `tests`, `src/pages`, `src/fixtures` ou `src/data` |
| `healer` | Diagnosticar e corrigir falhas | comando/erro/log/trace/teste falhando | patch minimo e relatorio de causa raiz |
| `reviewer` | Revisar aderencia tecnica e de estilo | diff, plano, validacao executada | parecer tecnico e bloqueios |
| `guardian` | Revisar seguranca, conformidade e configuracao | diff, dados, config, contexto da release | parecer de seguranca, configuracao e mitigacoes |
| `knowledge` | Atualizar memoria institucional | diff, decisao, aprendizado | memoria, regras e changelog atualizados |
| `data` | Governar massa de teste compartilhada | specs, dados repetidos, diff, contratos | dados em `src/data` ou recomendacao de permanencia inline |
| `report` | Triage de falhas e reports | CLI output, report, trace, `test-results` | resumo priorizado de causa provavel e proximo agente |
| `release` | Traduzir release notes do Playwright em impacto local | versao alvo, release notes, diff esperado | mapa de impacto, risco e areas para validar |
| `github` | Automatizar branch, commit e PR no GitHub | tipo, escopo, descricao, branch base | branch criada, commit feito, PR criado com link |

Politica de evolucao:

- gerar os agents apenas uma vez no baseline
- nao recriar os arquivos automaticamente em cada release
- editar os agents canonicos em `.ia/agents` quando novas capacidades do Playwright justificarem mudancas
- registrar toda mudanca em `.ia/agents/CHANGELOG.md`
- manter `.vscode/mcp.json` usando `npx --no-install` para forcar o binario local do projeto

## Regras Globais

- Antes de planejar, gerar ou curar testes, ler o contexto atual do repositorio.
- Antes de qualquer execucao, ler `.ia/memory` e `.ia/rules` relevantes.
- Preservar o padrao Page Object + fixtures existente.
- Page Objects DEVEM ter todos os locators como `readonly` no constructor — NUNCA seletores inline nos metodos.
- Specs NAO DEVEM ter logica inline (const com calculos, expect, seletores) — toda logica fica no Page Object.
- Page Objects NAO DEVEM ter metodos duplicados para 1 vs N items — usar versao pluralizada com array.
- Page Objects NAO DEVEM ter metodos intermediarios chamados por apenas um metodo — inliner a logica.
- Usar dados compartilhados em `src/data` quando o dado for reutilizavel.
- Gerar specs com `test.step` para passos relevantes e tags quando o plano definir.
- Manter a fixture central em `src/fixtures/fixtures.ts`, exportando `expect` e somente objetos existentes.
- Manter arquivos de Page Object com nomes iniciando em minusculo.
- Centralizar leitura de `.env` em `playwright.config.ts`, com helper explicito em `src/helpers/loginEnv.ts` para URL e credenciais de login.
- Evitar sleeps, `networkidle`, seletores frageis e dependencias entre testes.
- Passar mudancas relevantes por `reviewer` e `guardian` antes de considera-las prontas.
- Passar mudancas de auth, env, URL ou config por `guardian`.
- Passar mudancas que introduzam ou promovam massa compartilhada por `data`.
- Passar falhas com report, trace ou quebra ampla por `report` antes do `healer`.
- Passar upgrades ou estudo de impacto de release por `release` antes do `planner`.
- Atualizar memoria e regras via `knowledge` quando um padrao do projeto mudar.
- Manter artefatos de IA dentro de `.ia`.
- Manter testes, Page Objects e fixtures nos diretorios do projeto, porque sao codigo executavel.
