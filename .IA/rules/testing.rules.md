# Testing Rules

## Specs

- Usar `test.describe` para agrupar fluxo funcional
- Usar `test.step` para separar etapas observaveis do fluxo
- Usar tags quando houver valor operacional real: smoke, regression, checkout, login
- Cada teste deve ser independente
- O estado inicial deve ser previsivel

## Fixtures

- Existe uma fixture central unica em `src/fixtures/fixtures.ts`
- A fixture deve expor apenas objetos existentes no projeto
- A fixture deve reexportar `expect`
- Nao adicionar fixture para um unico teste trivial

## Page Objects

- Metodos devem representar acoes e verificacoes de dominio
- Evitar detalhe de seletor espalhado nas specs
- Preferir locators por role, placeholder, label ou `data-test`
- Assertions estruturais devem ficar no Page Object quando forem reutilizaveis
- Pages nao devem ler `.env` nem `process.env`; `src/pages/loginPage.ts` deve consumir `src/helpers/loginEnv.ts`

## Data

- Dados compartilhados devem ficar em `src/data`
- Credenciais de acesso devem sair de `.env` via `src/helpers/loginEnv.ts`
- Nao replicar credenciais em multiplos arquivos

## Validation

- Rodar `npm run typecheck` quando houver alteracao em TypeScript compartilhado
- Rodar o menor teste possivel para validar mudanca
- Ampliar validacao quando a mudanca tocar fixture, Page Object ou config
