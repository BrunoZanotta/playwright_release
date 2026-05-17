# Config Rules

## Environment Boundary

- Somente `playwright.config.ts` e `src/helpers/loginEnv.ts` podem ler `.env`, chamar `process.loadEnvFile()` ou acessar `process.env`
- `src/helpers/loginEnv.ts` e o helper permitido para leitura de `BASE_URL`, `USERNAME` e `PASSWORD` do fluxo de login
- Fixtures, specs e demais modulos devem consumir funcoes ou constantes exportadas, nunca `.env` direto
- Agentes nao devem orientar leitura direta de `.env` fora de `playwright.config.ts` e `src/helpers/loginEnv.ts`

## Access Variables

- Variaveis de acesso devem ficar em `.env`
- O contrato versionado dessas variaveis deve ficar em `.env.example`
- Credenciais de acesso nao devem permanecer hardcoded em `src/data`
- Quando uma nova variavel for introduzida, atualizar `playwright.config.ts`, `src/helpers/loginEnv.ts` quando aplicavel, e `.env.example`
- Nao usar fallback hardcoded para credenciais, URLs de acesso ou variaveis obrigatorias
- Nao criar wrapper extra de configuracao sem ganho claro de reutilizacao

Se for necessario novo acesso a configuracao, ele deve sair de `playwright.config.ts` para runtime do Playwright ou de `src/helpers/loginEnv.ts` no fluxo de login.

## Forbidden Patterns

- `process.env` fora de `playwright.config.ts` e `src/helpers/loginEnv.ts`
- `process.loadEnvFile()` fora de `playwright.config.ts` e `src/helpers/loginEnv.ts`
- import de `dotenv` ou variantes sem necessidade
- leitura direta de `.env` em specs, fixtures, dados ou agentes
- fallback hardcoded para variaveis obrigatorias de acesso
