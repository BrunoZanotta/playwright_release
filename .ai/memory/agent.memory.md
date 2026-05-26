# Agent Memory

## Existing Core Agents

- `planner`: planeja cenarios, cobertura, dados e estrutura de steps
- `generator`: implementa specs, Page Objects, fixtures e dados de forma controlada
- `healer`: corrige falhas de teste com foco em causa raiz

## Supporting Agents

- `reviewer`: valida aderencia tecnica e de estilo antes de considerar a entrega pronta
- `guardian`: revisa seguranca, exposicao de dados, fronteira de configuracao, APIs desencorajadas e riscos operacionais
- `knowledge`: atualiza memorias, regras e rastreabilidade da `.ia` quando o repositorio muda
- `data`: decide quando dados devem permanecer na spec ou subir para `src/data`
- `report`: resume falhas por spec, browser e causa provavel antes do `healer`
- `release`: analisa release notes do Playwright e traduz impacto para o repositorio
- `github`: automatiza criacao de branch, commit e pull request no GitHub para mudancas validadas

## Orchestration Intent

- Nenhum agente deve operar sem ler primeiro as memorias e regras aplicaveis
- `planner` nao fecha plano sem respeitar `test.step`, fixture central, convenios de naming e estrutura `tests/<versao>/`
- `generator` nao fecha implementacao sem passar pelo crivo de `reviewer` e `guardian`
- `guardian` acumula o gate de seguranca e configuracao quando houver mudancas em auth, config, env ou URLs
- `generator` deve passar por `data` quando introduzir ou mover massa de teste reutilizavel
- `report` deve ser acionado antes do `healer` quando houver report, trace ou multiplas falhas concorrentes
- `release` deve anteceder `planner` em upgrades ou investigacoes de impacto de release do Playwright
- `healer` nao encerra uma correcao sem atualizar memoria relevante quando uma regra nova for descoberta
- `knowledge` consolida aprendizado institucional, evitando que padroes fiquem apenas nas conversas
- Testes ficam em `tests/<versao>/` organizados por release — cada nova release ganha subdiretorio proprio
- Testes que gerenciam multiplos contextos (ex: `setStorageState`) podem importar Page Objects diretamente sem usar fixtures

## Change Discipline

- Mudancas estruturais do projeto devem refletir em `.ia/memory`
- Mudancas de politica devem refletir em `.ia/rules`
- Mudancas de processo devem refletir em `.ia/workflows`
- Mudancas de responsabilidade devem refletir em `.ia/agents`
