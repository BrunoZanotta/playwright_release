# Workflows

Workflows automatizados que orquestram os agentes do projeto.

## Workflows Disponiveis

### [run-create-new-test](./run-create-new-test.md)

Workflow unico para criar novos testes do zero.

**Quando usar:**
- Criar novos testes para uma feature
- Automatizar um cenario do SauceDemo
- Expandir cobertura de testes

**Comando:**
```bash
/loop Execute run-create-new-test para: <descricao do cenario>
```

**O que faz:**
1. Contextualiza com o projeto
2. Planeja os cenarios (agent: planner)
3. Gera a spec automaticamente (agent: generator)
4. Revisa tecnica e segurancamente (agents: reviewer, guardian)
5. Executa todos os testes
6. Corrige falhas automaticamente (agents: report, healer)
7. Atualiza a memoria do projeto (agent: knowledge)

**Resultado:**
- ✅ Teste funcionando
- ✅ Typecheck passando
- ✅ Testes passando em todos os browsers
- ✅ Revisoes aprovadas
- ✅ Memoria atualizada

### [agent-lifecycle](./agent-lifecycle.md)

Sequencia canonica para orquestrar os agentes em qualquer mudanca de automacao.

### [release](./release.md)

Workflow para acompanhar releases do Playwright.
