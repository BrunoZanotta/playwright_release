# Release Workflow

1. Criar branch `release/playwright-<versao>`.
2. Revisar release notes oficiais do Playwright.
3. Atualizar `@playwright/test` para a versao alvo com versao exata.
4. Instalar browsers com o binario local do projeto.
5. Atualizar testes, fixtures, Page Objects ou config apenas quando houver impacto real.
6. Evoluir os agents existentes se a release trouxer recurso util para planejamento, geracao ou healing.
7. Registrar mudancas de agents em `.IA/agents/CHANGELOG.md`.
8. Rodar `npm run audit:security`, `npm run audit:signatures`, `npm run typecheck` e `npm run test:all`.
9. Abrir PR com resumo da release, impactos e resultados de validacao.
