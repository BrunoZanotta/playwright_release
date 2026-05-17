# Workflow: run-create-new-test

## Objetivo

Workflow unico que orquestra todos os agentes necessarios para criar novos testes, executar e garantir qualidade, sem intervencao manual em cada etapa.

## Gatilho

Execute este workflow quando precisar criar um novo teste do zero.

## Comando Unico

```bash
/loop Execute run-create-new-test para: <descricao do cenario>
```

## Exemplos de Uso

```
/loop Execute run-create-new-test para: fluxo de checkout com multiples produtos
/loop Execute run-create-new-test para: validar login com usuario bloqueado
/loop Execute run-create-new-test para: teste de adicao de produtos ao carrinho
```

## Fluxo Automatizado

### 1. Contextualizacao
- Ler `.ia/memory/project.memory.md`
- Ler specs, Page Objects e fixtures existentes
- Identificar o que pode ser reutilizado

### 2. Planejamento (Agent: planner)
- Criar plano de teste em `.ia/test-plans/<feature>.md`
- Definir steps, tags, dados e criterios de aceite

### 3. Geracao (Agent: generator)
- Gerar spec Playwright baseada no plano
- Salvar em `tests/<fluxo>.spec.ts`

### 4. Revisao Tecnica (Agent: reviewer)
- Validar aderencia aos padroes do projeto
- Retornar ajustes necessarios

### 5. Revisao de Seguranca (Agent: guardian)
- Validar que nenhum segredo foi exposto
- Confirmar uso correto de `.env`

### 6. Execucao de Testes
```bash
npm run typecheck
npm test
npm run test:all
```

### 7. Correcao de Falhas (Agents: report + healer)
- Se houver falhas, analisar e corrigir automaticamente
- Reexecutar ate passar

### 8. Atualizacao de Memoria (Agent: knowledge)
- Registrar novos padroes aprendidos
- Atualizar changelog se necessario

## O Que Voce Ganha

Ao final do workflow voce tera:
- ✅ Plano de teste documentado
- ✅ Spec funcionando
- ✅ Typecheck passando
- ✅ Testes passando em todos os browsers
- ✅ Revisoes tecnica e de seguranca aprovadas
- ✅ Memoria do projeto atualizada

## Gates de Qualidade

O workflow so conclui quando:
- [ ] Typecheck sem erros
- [ ] Testes passam em chromium
- [ ] Testes passam em todos os projetos
- [ ] Sem bloqueios do reviewer
- [ ] Sem bloqueios do guardian
- [ ] Memoria atualizada

## Rollback Automatico

Se qualquer gate falhar:
- Pausa automaticamente
- Reporta o problema
- Aplica correcao
- Retoma do ponto de falha
