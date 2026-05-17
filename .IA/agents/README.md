# Playwright Test Agents

Agents criados no baseline Playwright `1.56.1` com:

```bash
npx --no-install playwright init-agents --loop=vscode
```

Arquivos ativos:

- `.github/chatmodes/🎭 generator.chatmode.md`
- `.github/chatmodes/🎭 healer.chatmode.md`
- `.github/chatmodes/ 🎭 planner.chatmode.md`
- `.vscode/mcp.json`

Politica de evolucao:

- gerar os agents apenas uma vez no baseline
- nao recriar os arquivos automaticamente em cada release
- editar os agents existentes quando novas capacidades do Playwright justificarem mudancas
- registrar toda mudanca em `.IA/agents/CHANGELOG.md`
- manter `.vscode/mcp.json` usando `npx --no-install` para forcar o binario local do projeto
