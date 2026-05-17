# Guia Rápido: Agente GitHub

## O Que É

Agente que automatiza o fluxo completo de Git e GitHub: cria branch, faz commit e abre Pull Request.

## Como Usar

### Comando Básico

```
/loop Execute github agent para: <tipo>/<escopo>: <descricao>
```

### Exemplos Reais

```
# Nova feature
/loop Execute github agent para: feat(agents): adicionar checkpoint de seguranca

# Correção de bug
/loop Execute github agent para: fix(healer): corrigir validacao de credenciais

# Documentação
/loop Execute github agent para: docs(workflows): criar guia rapido de uso

# Release
/loop Execute github agent para: release(playwright): atualizar para versao 1.57
```

## O Que Acontece (Automaticamente)

1. **Verificação** - Confirma que há mudanças para commitar
2. **Branch** - Cria branch seguindo convenção de naming
3. **Commit** - Faz commit com mensagem Conventional Commits
4. **Push** - Envia branch para o remoto
5. **PR** - Cria Pull Request com descrição formatada
6. **Link** - Retorna URL do PR criado

## Convenções de Branch

| Tipo | Formato | Exemplo |
|------|---------|---------|
| Feature | `feature/<nome>` | `feature/checkpoint-seguranca` |
| Fix | `fix/<nome>` | `fix/validacao-credenciais` |
| Release | `release/playwright-<versao>` | `release/playwright-1.57` |
| Refactor | `refactor/<nome>` | `refactor/agent-structure` |
| Docs | `docs/<nome>` | `docs/usage-guide` |
| Chore | `chore/<nome>` | `chore/update-dependencies` |

## Formato de Commit

```
<tipo>(<escopo>): <descricao curta>

<descricao longa com contexto>

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

## Template de PR

O PR é criado automaticamente com:

```markdown
## Resumo
<1-2 frases sobre o que foi feito>

## Mudanças
- <mudanca 1>
- <mudanca 2>

## Teste
- [ ] Typecheck passa
- [ ] Testes passam em chromium
- [ ] Testes passam em todos os projetos

## Checklist
- [ ] Segui padrões do projeto
- [ ] Atualizei documentação relevante
- [ ] Adicionei entradas no CHANGELOG
```

## Segurança

O agente **bloqueia** se:

- Há arquivos `.env` na staging area
- Há arquivos de build/dependências
- Branch base está incorreto
- Não há mudanças para commitar
- `gh` CLI não está instalado/autenticado

## Integração com Workflow

O agente `github` é o **step final** do workflow:

```
planner → generator → reviewer → guardian → healer → knowledge → github
```

Somente após:
- ✅ Código validado
- ✅ Revisões aprovadas
- ✅ Testes passando
- ✅ Memória atualizada

É que o `github` cria branch, commit e PR.

## Pré-requisitos

1. **GitHub CLI instalado:**
   ```bash
   brew install gh
   ```

2. **Autenticado:**
   ```bash
   gh auth login
   ```

3. **Na branch correta:**
   ```bash
   git checkout main
   ```

## Quando NÃO Usar

- Para commits triviais de desenvolvimento (use `git commit` diretamente)
- Para experimentos locais (nem tudo precisa virar PR imediatamente)
- Para merges ou hotfixes em produção (use procedimentos específicos)

## Exemplo Completo

```
/loop Execute github agent para: feat(agents): criar agente github para automatizar branch, commit e PR
```

Resultado:
1. Branch criada: `feature/agente-github`
2. Commit feito com mensagem Conventional Commits
3. Push enviado para origin
4. PR criado em: https://github.com/usuario/repo/pull/123
