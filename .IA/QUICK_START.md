# Guia Rapido: run-create-new-test

## O Que É

Workflow automatizado que cria novos testes Playwright do zero, sem intervencao manual.

## Como Usar

### Comando Basico

```
/loop Execute run-create-new-test para: <sua descricao aqui>
```

### Exemplos Reais

```
# Teste de checkout com multiplos produtos
/loop Execute run-create-new-test para: fluxo de checkout com multiples produtos

# Teste de login invalido
/loop Execute run-create-new-test para: validar login com senha incorreta

# Teste de carrinho
/loop Execute run-create-new-test para: adicionar e remover produtos do carrinho

# Teste de ordenacao
/loop Execute run-create-new-test para: ordenar produtos por preco
```

## O Que Acontece (Automaticamente)

1. **Contextualizacao** - Le o projeto e entende a estrutura
2. **Planejamento** - Cria um plano de teste detalhado
3. **Geracao** - Escreve o codigo do teste
4. **Revisao** - Valida tecnica e segurancamente
5. **Execucao** - Roda todos os testes
6. **Correcao** - Se falhar, corrige automaticamente
7. **Memoria** - Atualiza a documentacao do projeto

## O Que Voce Ganha

Apos o workflow completar:
- ✅ Arquivo de teste criado em `tests/*.spec.ts`
- ✅ Plano documentado em `.ia/test-plans/*.md`
- ✅ Typecheck passando
- ✅ Testes passando em chromium e todos os browsers
- ✅ Revisoes tecnica e de seguranca aprovadas
- ✅ Memoria do projeto atualizada

## Quando Nao Usar

- Para correcoes simples de testes existentes (use o agent `healer` diretamente)
- Para mudancas triviais (edite o arquivo diretamente)
- Para apenas executar testes (use `npm test`)

## Troubleshooting

### O workflow parou no meio
- O workflow tem rollback automatico
- Ele corrige o problema e continua
- Verifique o output para entender o que aconteceu

### Teste falhou em um browser especifico
- O workflow reporta isso automaticamente
- O agent `healer` analisa e corrige
- O workflow reexecuta ate passar

### Preciso cancelar o workflow
- Use Ctrl+C para interromper
- O workflow deixa um log do que foi feito
- Arquivos criados sao mantidos para revisao
