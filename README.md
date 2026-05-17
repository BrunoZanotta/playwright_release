# Playwright Releases

Projeto de automacao end-to-end para acompanhar evolucoes do Playwright por release, usando SauceDemo como aplicacao alvo.

## Baseline

- Playwright Test: `1.56.1`
- Linguagem: TypeScript
- Aplicacao alvo: `https://www.saucedemo.com`
- Padrao de testes: Page Object + fixtures
- Cliente de agents: definicoes versionadas em `.ia/agents`

## Scripts

```bash
npm test
npm run test:all
npm run test:ui
npm run report
npm run typecheck
npm run audit:security
npm run audit:signatures
```

## Workflows

### run-create-new-test

Workflow unico que orquestra todos os agentes para criar novos testes automaticamente:

```bash
/loop Execute run-create-new-test para: <descricao do cenario>
```

Exemplos:
```
/loop Execute run-create-new-test para: fluxo de checkout com multiples produtos
/loop Execute run-create-new-test para: validar login com usuario bloqueado
```

O workflow:
1. Contextualiza com o projeto
2. Cria plano de teste
3. Gera a spec automaticamente
4. Revisa tecnica e segurancamente
5. Executa todos os testes
6. Corrige falhas automaticamente
7. Atualiza a memoria do projeto

### Release workflow

Cada release do Playwright deve entrar em uma branch propria, por exemplo `release/playwright-1.57`.

Os agents foram criados no baseline e devem evoluir incrementalmente. Nao recrie os agents a cada release; revise as release notes, atualize o que fizer sentido e registre a mudanca em `.ia/agents/CHANGELOG.md`.

As definicoes canonicas dos agents ficam em `.ia/agents`.

## Seguranca

O projeto usa versoes exatas, lockfile, audit do npm e MCP configurado com `npx --no-install` para evitar download implicito de pacotes durante o uso dos agents.
