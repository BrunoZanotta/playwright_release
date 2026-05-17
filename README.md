# Playwright Releases

Projeto de automacao end-to-end para acompanhar evolucoes do Playwright por release, usando SauceDemo como aplicacao alvo.

## Baseline

- Playwright Test: `1.56.1`
- Linguagem: TypeScript
- Aplicacao alvo: `https://www.saucedemo.com`
- Padrao de testes: Page Object + fixtures
- Cliente de agents: Cursor, via chatmodes compativeis com VS Code

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

## Release workflow

Cada release do Playwright deve entrar em uma branch propria, por exemplo `release/playwright-1.57`.

Os agents foram criados no baseline e devem evoluir incrementalmente. Nao recrie os agents a cada release; revise as release notes, atualize o que fizer sentido e registre a mudanca em `.IA/agents/CHANGELOG.md`.

## Seguranca

O projeto usa versoes exatas, lockfile, audit do npm e MCP configurado com `npx --no-install` para evitar download implicito de pacotes durante o uso dos agents.
