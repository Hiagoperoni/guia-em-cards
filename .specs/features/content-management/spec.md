# Feature: Gerenciamento de Conteúdo (Admin)

**ID Prefix:** REQ-CM
**Milestone:** M1
**Status:** BACKEND COMPLETE

## Contexto

Admins gerenciam o catálogo de matérias, tópicos e cards. Alunos têm acesso de leitura. A hierarquia é: **Matéria → Tópico → Card**. Campos de texto suportam Markdown, LaTeX e Mermaid (renderizados no front).

## Requisitos — Matérias (Subjects)

| ID         | Requisito                                                                        | Prioridade |
|------------|----------------------------------------------------------------------------------|------------|
| REQ-CM-001 | ADMIN pode criar matéria com nome, descrição, cor e ícone emoji                  | Must       |
| REQ-CM-002 | ADMIN pode editar matéria existente                                               | Must       |
| REQ-CM-003 | ADMIN pode arquivar/desativar matéria (soft delete)                              | Must       |
| REQ-CM-004 | STUDENT pode listar todas as matérias ativas                                     | Must       |
| REQ-CM-005 | STUDENT pode ver detalhes de uma matéria (nome, descrição, lista de tópicos)    | Must       |
| REQ-CM-006 | Matéria exibe contador de tópicos ativos                                          | Should     |

## Requisitos — Tópicos (Topics)

| ID         | Requisito                                                                        | Prioridade |
|------------|----------------------------------------------------------------------------------|------------|
| REQ-CM-007 | ADMIN pode criar tópico vinculado a uma matéria (nome, descrição, ordem)        | Must       |
| REQ-CM-008 | ADMIN pode editar tópico existente                                                | Must       |
| REQ-CM-009 | ADMIN pode arquivar tópico (soft delete)                                          | Must       |
| REQ-CM-010 | STUDENT pode listar tópicos ativos de uma matéria                               | Must       |
| REQ-CM-011 | Tópico exibe contador de cards ativos                                             | Should     |

## Requisitos — Cards

| ID         | Requisito                                                                          | Prioridade |
|------------|------------------------------------------------------------------------------------|------------|
| REQ-CM-020 | ADMIN pode criar card vinculado a um tópico                                       | Must       |
| REQ-CM-021 | Card tem: pergunta (Markdown), resposta (Markdown), resumo (Markdown), ordem      | Must       |
| REQ-CM-022 | Campos de texto aceitam Markdown com imagens externas (URL), LaTeX e Mermaid    | Must       |
| REQ-CM-023 | ADMIN pode editar card existente                                                    | Must       |
| REQ-CM-024 | ADMIN pode arquivar card (soft delete — não aparece para alunos)                  | Must       |
| REQ-CM-025 | ADMIN pode reordenar cards dentro de um tópico (campo `order`)                    | Should     |
| REQ-CM-026 | STUDENT pode listar cards de um tópico (somente campos: id, pergunta, ordem)     | Must       |
| REQ-CM-027 | Admin vê preview do card (renderização rich content) antes de salvar              | Should     |
| REQ-CM-028 | ADMIN pode duplicar um card                                                        | Could      |

## Modelo de Dados

```
Subject  →  Topic  →  Card
```

Ver `architecture/design.md` para o schema Prisma completo.

## Endpoints Backend

| Método | Rota                              | Auth        | Descrição                        |
|--------|-----------------------------------|-------------|----------------------------------|
| GET    | /subjects                         | JWT         | Listar matérias ativas           |
| POST   | /subjects                         | JWT+ADMIN   | Criar matéria                    |
| GET    | /subjects/:id                     | JWT         | Detalhes de uma matéria          |
| PATCH  | /subjects/:id                     | JWT+ADMIN   | Editar matéria                   |
| DELETE | /subjects/:id                     | JWT+ADMIN   | Arquivar matéria                 |
| GET    | /subjects/:id/topics              | JWT         | Listar tópicos da matéria        |
| POST   | /subjects/:id/topics              | JWT+ADMIN   | Criar tópico                     |
| GET    | /topics/:id                       | JWT         | Detalhes de um tópico            |
| PATCH  | /topics/:id                       | JWT+ADMIN   | Editar tópico                    |
| DELETE | /topics/:id                       | JWT+ADMIN   | Arquivar tópico                  |
| GET    | /topics/:id/cards                 | JWT         | Listar cards do tópico           |
| POST   | /topics/:id/cards                 | JWT+ADMIN   | Criar card                       |
| GET    | /cards/:id                        | JWT         | Detalhes completos de um card    |
| PATCH  | /cards/:id                        | JWT+ADMIN   | Editar card                      |
| DELETE | /cards/:id                        | JWT+ADMIN   | Arquivar card                    |

## Critérios de Aceite

- [ ] Admin cria matéria → tópico → card; card aparece para o aluno via GET /topics/:id/cards
- [ ] Admin cria card com Markdown+LaTeX; campo salvo como string raw
- [ ] Aluno não vê cards/tópicos arquivados
- [ ] STUDENT tentando POST /subjects recebe 403
- [ ] Matéria arquivada não aparece na listagem de alunos
