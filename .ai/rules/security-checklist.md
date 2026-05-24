# Security Checklist

## Antes de considerar qualquer mudanca pronta, verifique:

### Ambiente e Configuracao
- [ ] Nenhum `process.env` fora de `playwright.config.ts` e `src/helpers/loginEnv.ts`
- [ ] Nenhum `process.loadEnvFile()` fora de `playwright.config.ts` e `src/helpers/loginEnv.ts`
- [ ] Nenhum import de `dotenv` ou variantes
- [ ] `.env.example` esta sincronizado com as variaveis obrigatorias
- [ ] Nao ha fallback hardcoded para variaveis obrigatorias

### Seguranca de Dados
- [ ] Nenhum segredo foi versionado (tokens, cookies, chaves, credenciais privadas)
- [ ] Nenhum dado sensivel em `.ia`, specs, fixtures ou reports versionados
- [ ] Credenciais so sao acessadas via `src/helpers/loginEnv.ts`
- [ ] Dados compartilhados ficam em `src/data`, nao em specs ou fixtures

### Tooling e Infraestrutura
- [ ] MCP continua configurado com `npx --no-install`
- [ ] Nao foram introduzidos comandos destrutivos em fluxos automatizados
- [ ] Nao foram adicionadas ferramentas que baixam dependencias implicitamente

### Agentes e Workflows
- [ ] Novos agentes foram validados pelo `guardian`
- [ ] Mudancas em auth, env, URL ou config passaram pelo `guardian`
- [ ] Mudancas de processo foram registradas em `.ia/workflows`
- [ ] Mudancas de politica foram registradas em `.ia/rules`

### Testes
- [ ] Nao foram mascaradas falhas reais removendo assertions importantes
- [ ] Nao foi usado `test.fixme()` sem explicacao objetiva
- [ ] Nao foi aumentado timeout como resposta padraa a flakiness
- [ ] Nao ha dependencia de `networkidle`

---

## Uso

Este checklist deve ser usado pelos agentes:
- **guardian**: como referencia principal de revisao
- **reviewer**: como verificacao de seguranca adicional
- **knowledge**: como base para atualizar regras quando encontrar novos padroes
