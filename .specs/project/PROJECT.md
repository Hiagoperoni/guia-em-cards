# Guia em Cards

**Vision:** Plataforma de estudo com flashcards para alunos do ensino médio, com suporte a conteúdo rico (imagens, fórmulas matemáticas e diagramas).
**For:** Alunos do ensino médio e administradores/professores que gerenciam conteúdo.
**Solves:** Facilitar o aprendizado ativo e a revisão de matérias por meio da metodologia de perguntas e respostas com resumos detalhados.

## Goals

- Alunos conseguem revisar flashcards de múltiplas matérias com perguntas, respostas e resumos ricos.
- Administradores conseguem gerenciar o catálogo de matérias e cards sem depender de código.
- Plataforma online, gratuita e acessível via browser (web responsivo).

## Tech Stack

**Core:**

- **Frontend:** React 18 + TypeScript 5 — Vite, React Router v6, Tailwind CSS v3
- **Backend:** NestJS 10 + TypeScript 5
- **ORM:** Prisma 5
- **Banco de dados:** Neon (Postgres serverless, free tier)
- **Auth:** JWT via @nestjs/jwt + Passport.js

**Key dependencies:**
- React Query (TanStack Query v5) — cache e fetch no front
- Zustand — estado global de auth/sessão no front
- react-markdown + remark-math + rehype-katex — renderização rich content
- mermaid.js — diagramas no front
- class-validator + class-transformer — validação no back

**Deploy:**
- Frontend → Vercel (free)
- Backend → Render (free tier, Node.js)
- Database → Neon (free tier, Postgres serverless)

## Scope

**v1 inclui:**

- Autenticação (registro + login, e-mail/senha, JWT)
- Roles: ADMIN (gerencia conteúdo) e STUDENT (estuda e acompanha progresso)
- CRUD de matérias (Subjects) — apenas ADMIN
- CRUD de cards (pergunta + resposta + resumo) por matéria — apenas ADMIN
- Conteúdo rico: imagens via URL, fórmulas LaTeX (KaTeX), diagramas Mermaid
- Sessão de estudo: exibir cards em sequência, virar card, marcar acerto/erro
- Progresso básico: cards estudados, taxa de acerto por matéria

**Explicitamente fora do escopo (v1):**

- Upload de imagens/arquivos (usa URL externa)
- Algoritmo de repetição espaçada avançado (SM-2) — fica para v2
- Criação de cards por alunos
- Decks compartilháveis/públicos
- Gamificação, badges, ranking
- App mobile nativo
- Pagamentos ou planos premium

## Constraints

- **Técnico:** Backend no Render free tier dorme após 15 min de inatividade (cold start ~30s) — aceitável para MVP
- **Técnico:** Neon free tier: 0.5 GB storage, 1 branch, 190 compute hours/mês — suficiente para MVP
- **Técnico:** Vercel free: sem limite para sites estáticos com React
- **Recursos:** Projeto solo/pessoal, sem prazo fixo
