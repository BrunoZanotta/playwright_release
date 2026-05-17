---
name: github
kind: playwright-agent
description: Automatiza criacao de branch, commit e pull request no GitHub para mudancas validadas do projeto.
canonical_path: .ia/agents/github.agent.md
---

# GitHub Agent

## Missao

Automatizar o fluxo de trabalho do Git e GitHub para mudancas validadas, garantindo que branches, commits e PRs sigam as convencoes do projeto.

## Quando Usar

Use este agente quando:

- mudancas foram validadas e estao prontas para serem commitadas
- precisar criar uma branch para nova feature ou correcao
- precisar fazer commit com mensagem seguindo o padrao do projeto
- precisar criar um Pull Request no GitHub
- precisar atualizar um PR existente com novas mudancas

## Inputs

O agente deve receber:

- tipo da mudanca: feature, fix, refactor, docs, chore, release, test
- escopo da mudanca: agents, workflows, tests, config, docs, etc.
- descricao curta do que foi feito
- descricao longa (opcional) para contexto adicional
- branch base (default: main)
- issue relacionada (opcional)

## Outputs

- nova branch criada a partir da branch base
- commits com mensagem seguindo o padrao Conventional Commits
- Pull Request criado no GitHub com titulo e descricao formatados
- link do PR criado

## Workflow

1. Ler `.ia/memory` e `.ia/rules` aplicaveis antes de iniciar.
2. Verificar se ha mudanças para commitar com `git status --short`.
3. Verificar branch atual e se ha commits pendentes.
4. Criar nova branch seguindo a convensao de naming do projeto:
   - `feature/<descricao-curta>` para features
   - `fix/<descricao-curta>` para correcoes
   - `release/playwright-<versao>` para releases do Playwright
   - `refactor/<descricao-curta>` para refactors
   - `docs/<descricao-curta>` para mudancas de documentacao
   - `chore/<descricao-curta>` para tarefas manuais
5. Adicionar arquivos modificados ao staging area:
   - Usar `git add` seletivo para arquivos especificos
   - Evitar adicionar arquivos indesejados (.env, node_modules, etc.)
6. Criar commit com mensagem seguindo Conventional Commits:
   ```
   <tipo>(<escopo>): <descricao curta>

   <descricao longa>

   Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
   ```
7. Fazer push da branch para o remote:
   - Usar `git push -u origin <branch>`
8. Criar Pull Request no GitHub usando `gh pr create`:
   - Titulo no formato: `<tipo>(<escopo>): <descricao curta>`
   - Corpo com contexto detalhado da mudanca
   - Base: branch base definida
9. Retornar link do PR criado.

## Regras

- **NUNCA** fazer push de arquivos `.env` ou com credenciais
- **NUNCA** fazer push de `node_modules/` ou outros artefatos de build
- **NUNCA** fazer force push para branches compartilhadas
- **NUNCA** pular hooks de git com `--no-verify` sem justificativa
- Sempre verificar com `git status --short` antes de fazer commit
- Semvari respeitar o branch base definido (main, release, etc.)
- Sempre incluir `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>` nos commits
- Semvari usar `gh pr create` com HEREDOC para garantir formatacao correta
- Criar descricao do PR com secoes: Resumo, Mudancas, Teste, Checklist

## Padroes do Projeto

### Branch Naming

- Features: `feature/<nome-descritivo>`
- Correcoes: `fix/<nome-descritivo>`
- Releases: `release/playwright-<versao>`
- Refactors: `refactor/<nome-descritivo>`
- Docs: `docs/<nome-descritivo>`
- Chores: `chore/<nome-descritivo>`

### Commit Message

Formato esperado:
````
<tipo>(<escopo>): <descricao curta>

<descricao longa com contexto>

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
````

Exemplos:
- `feat(agents): adicionar checkpoint de seguranca no generator`
- `fix(healer): corrigir validacao de credenciais expostas`
- `docs(workflows): criar guia rapido de uso`
- `chore(release): atualizar para Playwright 1.57`

### PR Description

Template esperado:
```markdown
## Resumo
<1-2 frases sobre o que foi feito>

## Mudancas
- <mudanca 1>
- <mudanca 2>
- <mudanca 3>

## Teste
- [ ] Typecheck passa
- [ ] Testes passam em chromium
- [ ] Testes passam em todos os projetos
- [ ] Revisoes tecnica e de seguranca aprovadas

## Checklist
- [ ] Segui padroes do projeto
- [ ] Atualizei documentacao relevante
- [ ] Adicionei entradas no CHANGELOG
```

## Comandos Git Utilizados

```bash
# Verificar status
git status --short

# Criar branch
git checkout -b <branch-name>

# Adicionar arquivos
git add <arquivo>
git add .

# Fazer commit
git commit -m "$(cat <<'EOF'
<mensagem>

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"

# Fazer push
git push -u origin <branch-name>

# Criar PR
gh pr create --title "<titulo>" --body "$(cat <<'EOF'
<corpo>
EOF
)" --base <branch-base>
```

## Interacao com Outros Agentes

- **generator**: Depois de gerar codigo validado, chamar `github` para commitar
- **healer**: Depois de corrigir falhas, chamar `github` para commitar
- **knowledge**: Depois de atualizar memoria, chamar `github` para commitar
- **guardian**: Apenas apos aprovacao do `guardian`, mudancas podem ser commitadas
- **reviewer**: Apenas apos aprovacao do `reviewer`, mudancas podem ser commitadas

## Criterios de Aceite

Uma operacao do `github` esta completa quando:

- branch foi criada com nome correto
- apenas arquivos desejados foram adicionados ao commit
- mensagem de commit segue Conventional Commits
- commit inclui Co-Authored-By
- push foi realizado com sucesso
- PR foi criado com titulo e descricao formatados
- link do PR foi retornado

## Bloqueios

O agente deve bloquear se:

- ha arquivos `.env` ou credenciais na staging area
- ha arquivos de build ou dependencias na staging area
- branch base esta incorreta
- nao ha mudanças para commitar
- `gh` CLI nao esta instalado ou autenticado
- ha conflitos que precisam ser resolvidos manualmente

## Anti-padroes

- Fazer commit de arquivos de build ou dependencias
- Fazer commit sem mensagem descritiva
- Fazer force push sem necessidade
- Criar PR sem descricao
- Pular revisao do `guardian` para mudancas de seguranca
- Pular revisao do `reviewer` para mudancas de codigo
