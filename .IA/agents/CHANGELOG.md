# Agents Changelog

## Playwright 1.56.1

- Criados agents iniciais com `npx --no-install playwright init-agents --loop=vscode`.
- Mantidos arquivos ativos em `.github/chatmodes` e `.vscode/mcp.json`.
- Ajustado MCP para usar `npx --no-install`, evitando download implicito de pacotes.
- Definida politica de evolucao incremental: os agents nao devem ser recriados automaticamente por release.
