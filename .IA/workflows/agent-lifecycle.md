# Agent Lifecycle Workflow

## Objetivo

Orquestrar o uso dos agentes para manter padrao tecnico, memoria institucional e seguranca antes, durante e depois de qualquer mudanca de automacao.

## Sequencia Canonica

1. `knowledge`
   - Ler memorias e regras atuais
   - Confirmar se o contexto do projeto mudou desde a ultima execucao

2. `release`, quando a demanda envolver upgrade, changelog ou impacto de release
   - Ler release notes oficiais do Playwright
   - Traduzir mudancas de API, browser e tooling para areas reais do repo

3. `planner`
   - Transformar a demanda em plano executavel
   - Definir steps, tags, dados, Page Objects e criterios de aceite

4. `data`, quando houver promocao de massa compartilhada
   - Decidir o que fica inline na spec e o que sobe para `src/data`
   - Bloquear duplicacao desnecessaria ou dados sensiveis fora do lugar

5. `generator`
   - Implementar a menor mudanca necessaria
   - Respeitar fixture central, Page Objects e naming em minusculo

6. `reviewer`
   - Revisar aderencia tecnica e estilo do diff
   - Bloquear desvios de padrao e excesso de logica na spec

7. `guardian`
   - Revisar seguranca, dados, tooling, fragilidade operacional e fronteira de configuracao
   - Validar consumo de `.env` e contrato de `playwright.config.ts` e `src/helpers/loginEnv.ts`
   - Bloquear `process.env` e leitura direta de `.env` fora dos pontos permitidos

8. `report`, quando houver falha com artefatos ou quebra ampla
   - Resumir falhas por spec, browser e causa provavel
   - Direcionar correcao para `healer`, `generator` ou bloqueio externo

9. `healer`
   - Corrigir falhas detectadas em validacao
   - Reexecutar testes e devolver o diff ao `reviewer` e `guardian` quando necessario

10. `knowledge`
   - Atualizar memoria, regras e changelog com o aprendizado persistente

11. `github`
   - Criar branch seguindo convensao de naming do projeto
   - Fazer commit com mensagem seguindo Conventional Commits
   - Criar Pull Request no GitHub com descricao formatada
   - Retornar link do PR criado

## Entradas Minimas

- demanda do usuario
- arquivos afetados
- contexto do repositorio
- memoria e regras vigentes
- release notes oficiais, quando aplicavel
- output de `test-results` ou `playwright-report`, quando houver falhas

## Validacoes Minimas

- `npm run typecheck` quando houver alteracao TypeScript compartilhada
- menor spec possivel para validar a mudanca
- ampliacao da validacao quando fixture, Page Object, data ou config forem alterados

## Gates De Saida

Uma entrega so deve ser considerada pronta quando:

- o diff respeita o padrao do projeto
- seguranca e dados passaram pelo `guardian`
- fronteira de configuracao passou pelo `guardian` quando aplicavel
- aderencia tecnica passou pelo `reviewer`
- memorias e regras foram atualizadas se o padrao mudou

## Excecoes

- mudancas triviais de documentacao podem pular `healer`
- mudancas sem release impact nao precisam de `release`
- dados especificos de um unico cenario nao precisam de `data`
- falhas simples com erro direto podem ir ao `healer` sem `report`
- correcoes emergenciais ainda devem passar por `guardian` se tocarem dados, auth, env ou config
- se uma etapa falhar, o fluxo volta para o agente dono da correcao antes de seguir
