# Security Rules

## Secrets And Data

- Nao versionar tokens, segredos, cookies, chaves ou credenciais privadas
- Nao registrar dados sensiveis em `.ia`, specs, fixtures ou reports versionados
- Usar apenas usuarios de teste controlados e esperados pelo projeto
- Nao acessar `process.env` fora dos modulos dedicados de configuracao
- Nao ler `.env` diretamente em specs, fixtures, dados ou Page Objects; `src/helpers/loginEnv.ts` e o helper permitido para o fluxo de login

## Tooling Safety

- Manter MCP local com `npx --no-install`
- Evitar ferramentas que baixem dependencias implicitamente durante execucao
- Nao introduzir comandos destrutivos em fluxos automatizados

## Test Safety

- Nao mascarar falhas reais removendo assertions importantes
- Nao usar `test.fixme()` sem explicacao objetiva
- Nao aumentar timeout como resposta padrao a flakiness
- Nao depender de `networkidle`

## Review Gates

- Toda geracao relevante deve passar por revisao tecnica
- Toda alteracao que toque dados, config ou autenticacao deve passar por revisao de seguranca
- Toda nova regra descoberta deve voltar para memoria ou rules
