# .ia

Esta pasta guarda ativos de IA versionaveis do projeto: agents, workflows, regras e memoria operacional.

Nao incluir:

- secrets, tokens ou credenciais privadas
- traces, videos, screenshots ou reports pesados
- estado local de ferramenta
- arquivos gerados que dependam da maquina do usuario

Estrutura principal:

- `.ia/agents`: definicoes dos agentes de planejamento, geracao, revisao, seguranca, memoria, release, dados e triagem
- `.ia/memory`: memoria persistente do projeto e dos agentes
- `.ia/rules`: guardrails tecnicos, operacionais e de seguranca
- `.ia/workflows`: processos de release e manutencao
- `.ia/decisions`: decisoes tecnicas versionadas
- `.ia/test-plans`: planos gerados pelo planner, quando aplicavel

Boundary de configuracao:

- `.env` guarda variaveis locais de acesso
- `.env.example` guarda o contrato versionado dessas variaveis
- somente `playwright.config.ts` e `src/helpers/loginEnv.ts` podem ler `.env` ou `process.env`

O MCP local continua em `.vscode/mcp.json` porque e configuracao do cliente/editor. As regras e contratos dos agentes ficam centralizados nesta pasta.
