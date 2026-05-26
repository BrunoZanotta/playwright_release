# Testing Rules

## Specs

- Usar `test.describe` para agrupar fluxo funcional
- Usar `test.step` para separar etapas observaveis do fluxo
- Usar tags quando houver valor operacional real: smoke, regression, checkout, login
- Cada teste deve ser independente
- O estado inicial deve ser previsivel
- Specs NAO devem conter `const` com calculos, `expect` inline ou logica de UI
- Toda logica de verificacao e calculo deve estar em metodos de Page Object (ex: `expectValidTotal()`)
- Specs so devem chamar metodos de Page Objects e consumir dados de `src/data`
- Specs em `tests/<versao>/` usam imports com prefixo `../../src/`

## Fixtures

- Existe uma fixture central unica em `src/fixtures/fixtures.ts`
- A fixture deve expor apenas objetos existentes no projeto
- A fixture deve reexportar `expect`
- Nao adicionar fixture para um unico teste trivial

## Page Objects

- Metodos devem representar acoes e verificacoes de dominio
- Evitar detalhe de seletor espalhado nas specs
- Todos os locators DEVEM ser declarados como `readonly` na classe e inicializados no `constructor`
- Metodos NAO devem conter seletores inline (`this.page.locator(...)`, `this.page.getByRole(...)`) — todo seletor deve ser propriedade `readonly`
- Excecao: `.filter({ hasText: name })` pode ser encadeado inline sobre um `readonly` base
- Preferir locators por role, placeholder, label ou `data-test`
- Assertions estruturais devem ficar no Page Object quando forem reutilizaveis
- NAO criar metodos duplicados que aceitam 1 vs N items (ex: `expectProduct` + `expectProducts`) — usar a versao pluralizada com array
- Pages nao devem ler `.env` nem `process.env`; `src/pages/loginPage.ts` deve consumir `src/helpers/loginEnv.ts`

## Data

- Dados compartilhados devem ficar em `src/data`
- Credenciais de acesso devem sair de `.env` via `src/helpers/loginEnv.ts`
- Nao replicar credenciais em multiplos arquivos

## Validation

- Rodar `npm run typecheck` quando houver alteracao em TypeScript compartilhado
- Rodar o menor teste possivel para validar mudanca
- Ampliar validacao quando a mudanca tocar fixture, Page Object ou config
