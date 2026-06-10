# Roadmap — Guia em Cards

**Current Milestone:** M1 — MVP Funcional
**Status:** Planning

---

## M1 — MVP Funcional

**Goal:** Plataforma funcional com auth, gerenciamento de conteúdo, sessão de estudo e progresso básico — pronta para uso real.
**Target:** Milestone completo quando aluno consegue se registrar, estudar cards de pelo menos 2 matérias e ver seu progresso.

### Features

**Autenticação & Usuários** — PLANNED
- Registro com e-mail e senha
- Login com retorno de JWT
- Roles: ADMIN e STUDENT
- Perfil básico (nome, e-mail)
- Guards de rota no backend e frontend

**Gerenciamento de Conteúdo (Admin)** — PLANNED
- CRUD de matérias (nome, descrição, ícone/cor)
- CRUD de cards por matéria (pergunta, resposta, resumo)
- Suporte a markdown no corpo dos campos
- Preview do card no admin antes de salvar

**Conteúdo Rico** — PLANNED
- Renderização de Markdown nos campos de resposta e resumo
- Fórmulas matemáticas via LaTeX/KaTeX
- Diagramas via Mermaid.js
- Imagens externas via URL

**Sessão de Estudo** — PLANNED
- Listar matérias disponíveis
- Iniciar sessão de estudo por matéria
- Card com frente (pergunta) e verso (resposta + resumo)
- Animação de virar card
- Marcar card como Acerto / Erro
- Finalizar sessão e salvar resultado

**Progresso do Aluno** — PLANNED
- Estatísticas por matéria: total de cards, cards estudados, taxa de acerto
- Histórico de sessões de estudo
- Dashboard simples na home do aluno

---

## M2 — Experiência Aprimorada

**Goal:** Tornar o estudo mais eficaz com repetição espaçada e melhorar a usabilidade.

### Features

**Repetição Espaçada (SM-2)** — PLANNED
- Algoritmo SM-2 para agendamento de revisões
- Fila de revisão diária por aluno
- Indicador de cards "para revisar hoje"

**Busca e Filtros** — PLANNED
- Busca de cards por texto dentro de uma matéria
- Filtro por status: não estudados, acertos, erros

**UX Aprimorada** — PLANNED
- Modo noturno
- Atalhos de teclado na sessão de estudo (espaço = virar, 1 = erro, 2 = acerto)
- Animações de progresso (streaks)

---

## M3 — Social e Conteúdo Colaborativo

**Goal:** Permitir criação de conteúdo pela comunidade e engajamento social.

### Features

**Decks Compartilháveis** — PLANNED
- Aluno cria deck público ou privado
- Compartilhar deck via link

**Criação por Alunos** — PLANNED
- Aluno sugere cards que ADMIN aprova

**Gamificação** — PLANNED
- Badges por sequências de estudo
- Ranking por matéria (opt-in)

---

## Future Considerations

- App mobile (React Native)
- Import/export de decks (Anki format)
- Integração com IA para geração automática de cards a partir de textos
- Planos premium (mais storage, decks ilimitados)
