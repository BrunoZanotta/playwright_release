# Release Workflow

1. Criar branch `release/playwright-<versao>`.
2. Ler `.ia/memory`, `.ia/rules` e `.ia/workflows/agent-lifecycle.md` antes de mudar qualquer artefato.
3. Passar pelo `release` para transformar release notes oficiais em impacto local do repositorio.
4. Revisar release notes oficiais do Playwright.
5. Atualizar `@playwright/test` para a versao alvo com versao exata.
6. Instalar browsers com o binario local do projeto.
7. Planejar impactos de release com `planner` quando houver mudanca funcional, de API ou de comportamento esperado.
8. Atualizar testes, fixtures, Page Objects, helper de login ou config apenas quando houver impacto real.
9. Passar as mudancas por `reviewer` e `guardian`, especialmente se tocarem config, auth, env, dados ou convencoes do projeto.
10. Usar `report` para consolidar falhas de validacao antes do `healer`, quando houver multiplas quebras ou artefatos de report.
11. Usar `healer` para estabilizar quebras reais encontradas na validacao.
12. Atualizar memoria, regras e agentes via `knowledge` quando a release introduzir novo padrao.
13. Registrar mudancas de agents em `.ia/agents/CHANGELOG.md`.
14. Rodar `npm run audit:security`, `npm run audit:signatures`, `npm run typecheck` e `npm run test:all`.
15. Abrir PR com resumo da release, impactos e resultados de validacao.
