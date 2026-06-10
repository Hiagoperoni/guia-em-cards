# State — Guia em Cards

## Decisions

| ID   | Decisão                                                     | Motivo                                                                    | Data       |
|------|-------------------------------------------------------------|---------------------------------------------------------------------------|------------|
| D-01 | Backend no Render (não Vercel serverless)                   | NestJS precisa de servidor persistente; Vercel serverless tem limitações  | 2026-06-09 |
| D-02 | Banco de dados: Neon (Postgres serverless)                  | Integração nativa com Vercel, free tier generoso, Postgres real           | 2026-06-09 |
| D-03 | Auth via JWT (e-mail/senha), sem OAuth v1                   | Simplicidade no MVP; OAuth é M2+                                          | 2026-06-09 |
| D-04 | Roles: ADMIN e STUDENT                                      | Admin gerencia conteúdo; Student só estuda                                | 2026-06-09 |
| D-05 | Imagens via URL externa (sem upload)                        | Evita custo de storage no MVP; upload é M2+                               | 2026-06-09 |
| D-06 | Rich content: Markdown + KaTeX + Mermaid no front           | Flexível e gratuito; renderização no browser evita dependência de backend | 2026-06-09 |
| D-07 | Monorepo (frontend/ + backend/ na mesma raiz do repo)       | Facilita desenvolvimento solo e compartilhamento de tipos                 | 2026-06-09 |
| D-08 | ORM: Prisma 5 com Neon                                      | Type-safe, migrations fáceis, suporte oficial ao Neon                     | 2026-06-09 |
| D-09 | State management front: Zustand (auth) + React Query (data) | Zustand para sessão/auth global; React Query para cache de API            | 2026-06-09 |
| D-10 | SM-2 repetição espaçada postergado para M2                  | Aumenta complexidade do MVP; progresso básico suficiente para v1          | 2026-06-09 |

## Preferences

- Modelo econômico para tarefas leves (validação, state updates, session handoff): reconhecido pelo usuário.

## Blockers

_Nenhum no momento._

## Todos

- [x] Inicializar monorepo com `frontend/` e `backend/`
- [x] Configurar variáveis de ambiente (`.env.example`)
- [ ] Criar conta Neon e provisionar banco dev (Aguardando conexão)
- [ ] Rodar migrations iniciais e Seed (B-02)
- [ ] Criar conta Render e configurar serviço Node

## Deferred Ideas

- OAuth (Google) para login — M2
- Algoritmo SM-2 — M2
- Upload de imagens (S3/Cloudflare R2) — M2
- App mobile React Native — M3
- Geração de cards por IA — M3+
