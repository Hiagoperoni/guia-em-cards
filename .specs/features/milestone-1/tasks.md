# Tasks — M1: MVP Funcional

**Convenção:** `[P]` = pode rodar em paralelo com outras tasks do mesmo grupo
**Status:** PLANNED | IN PROGRESS | COMPLETE | BLOCKED

---

## Grupo 0 — Setup & Infraestrutura

### B-01 — Setup backend NestJS
**Onde:** `backend/`
**Status:** COMPLETE
**Depende de:** —
**O que fazer:**
- `npx @nestjs/cli new backend --package-manager npm`
- Instalar: `@prisma/client prisma @nestjs/config`
- Configurar `ConfigModule` global com `.env`
- Configurar `PrismaService` (singleton, `onModuleInit`)
- Configurar `ValidationPipe` global em `main.ts`
- Configurar CORS com `CORS_ORIGIN` da env
**Pronto quando:** `npm run start:dev` sobe sem erro; GET /health retorna 200.

### F-01 — Setup frontend React+Vite [P]
**Onde:** `frontend/`
**Status:** COMPLETE
**Depende de:** —
**O que fazer:**
- `npm create vite@latest frontend -- --template react-ts`
- Instalar: `tailwindcss @tanstack/react-query zustand axios react-router-dom`
- Instalar rich content: `react-markdown remark-math rehype-katex rehype-sanitize mermaid katex`
- Configurar Tailwind (`tailwind.config.ts`, `index.css`)
- Configurar Axios instance (`src/api/axios.ts`) com interceptor Bearer token
- Configurar React Query Provider em `main.tsx`
- Criar `vercel.json` com rewrite SPA
**Pronto quando:** `npm run dev` abre app vazia sem erros TypeScript; Tailwind classes funcionam.

---

## Grupo 1 — Banco de Dados

### B-02 — Schema Prisma + migrations
**Onde:** `backend/prisma/schema.prisma`
**Status:** COMPLETE
**Depende de:** B-01
**Refs:** `architecture/design.md` (modelo completo)
**O que fazer:**
- Criar `schema.prisma` com modelos: User, Subject, **Topic**, Card, StudySession, CardResult
- Hierarquia: Subject → Topic → Card; StudySession referencia `topicId`
- Rodar `npx prisma migrate dev --name init`
- Criar `seed.ts`: 1 admin, 2 matérias, 3 tópicos, cards por tópico
- Adicionar script `"seed": "ts-node prisma/seed.ts"` no package.json
**Pronto quando:** `npx prisma migrate dev` sem erros; `npx prisma studio` mostra tabelas; seed popula dados.

---

## Grupo 2 — Auth Backend + Frontend

### B-03 — AuthModule backend
**Onde:** `backend/src/auth/`
**Status:** COMPLETE
**Depende de:** B-02
**Refs:** `auth/spec.md` (REQ-AUTH-001 a REQ-AUTH-031)
**O que fazer:**
- Instalar: `@nestjs/passport @nestjs/jwt passport passport-jwt bcrypt @types/bcrypt @types/passport-jwt`
- `AuthModule` com: `AuthController`, `AuthService`, `JwtStrategy`, `JwtAuthGuard`, `RolesGuard`, `@Roles()` decorator
- POST /auth/register → hash bcrypt, cria User STUDENT
- POST /auth/login → valida credenciais, retorna JWT 7d
- GET /auth/me → retorna usuário logado (sem senha)
- PATCH /auth/me → atualiza nome
**Pronto quando:** Todos os endpoints de auth/spec.md critérios de aceite passam.

### F-02 — Páginas de Auth + Zustand [P com B-03]
**Onde:** `frontend/src/`
**Status:** COMPLETE
**Depende de:** F-01
**O que fazer:**
- `authStore.ts` (Zustand): token, user, login(), logout()
- `/login` page: form e-mail + senha → POST /auth/login → store
- `/register` page: form nome + e-mail + senha → POST /auth/register → redirect /login
- Axios interceptor: injeta `Authorization: Bearer` de forma automática
- Interceptor 401 → logout() + redirect /login
**Pronto quando:** Login salva token; rotas protegidas redirecionam sem token.

### F-03 — Roteamento protegido por role
**Onde:** `frontend/src/router/`
**Status:** COMPLETE
**Depende de:** F-02
**O que fazer:**
- `ProtectedRoute` component: verifica auth, redireciona /login se não autenticado
- `AdminRoute` component: verifica role ADMIN, redireciona /home se STUDENT
- Estrutura de rotas: `/login`, `/register`, `/home`, `/subjects/:id`, `/study/:sessionId`, `/progress`, `/admin/subjects`, `/admin/subjects/:id/cards`
**Pronto quando:** STUDENT não acessa /admin/*; ADMIN acessa tudo.

---

## Grupo 3 — CRUD Conteúdo

### B-04 — SubjectsModule + TopicsModule + CardsModule backend
**Onde:** `backend/src/subjects/`, `backend/src/topics/`, `backend/src/cards/`
**Status:** COMPLETE
**Depende de:** B-03
**Refs:** `content-management/spec.md` (REQ-CM-001 a REQ-CM-028)
**O que fazer:**
- `SubjectsModule`: CRUD com guard ADMIN para write, JWT para read
- `TopicsModule`: CRUD aninhado em subject (`/subjects/:id/topics` e `/topics/:id`), guard ADMIN para write
- `CardsModule`: CRUD aninhado em topic (`/topics/:id/cards` e `/cards/:id`), guard ADMIN para write
- Soft delete (campo `active`) nos três
- DTOs com class-validator para todos os endpoints
**Pronto quando:** Todos endpoints de content-management/spec.md critérios de aceite passam.

### F-04 — Admin Panel (Subjects + Topics + Cards) [P com B-04]
**Onde:** `frontend/src/pages/admin/`
**Status:** COMPLETE
**Depende de:** F-03
**O que fazer:**
- `/admin/subjects`: lista matérias, botão criar, editar, arquivar (form: nome, descrição, cor, ícone emoji)
- `/admin/subjects/:subjectId/topics`: lista tópicos da matéria, criar, editar, arquivar (form: nome, descrição, ordem)
- `/admin/topics/:topicId/cards`: lista cards do tópico, criar, editar, arquivar
- Form card: campos question, answer, summary (textarea Markdown) + ordem; preview `<RichContent>` fica para F-05
- React Query para fetch/mutations; `Modal` reutilizável; `AdminHeader` com breadcrumbs + logout
**Pronto quando:** Admin cria matéria → tópico → card; card aparece para aluno.

---

## Grupo 4 — Rich Content

### F-05 — Componente `<RichContent>` + `<FlashCard>`
**Onde:** `frontend/src/components/`
**Status:** COMPLETE
**Depende de:** F-01
**Refs:** `rich-content/spec.md` (REQ-RC-001 a REQ-RC-009)
**O que fazer:**
- `RichContent.tsx`: react-markdown + remark-math + rehype-katex + rehype-sanitize
- Componente `MermaidBlock.tsx`: renderiza bloco mermaid com useEffect + mermaid.initialize()
- Custom renderer: substitui code block `mermaid` pelo `MermaidBlock`
- `FlashCard.tsx`: frente (pergunta) e verso (resposta + resumo), CSS 3D flip animation, botões Acerto/Erro (bloqueados antes do flip)
**Pronto quando:** REQ-RC-001 a REQ-RC-009 critérios de aceite passam; flip funciona.

---

## Grupo 5 — Sessão de Estudo

### B-05 — SessionsModule backend
**Onde:** `backend/src/sessions/`
**Status:** COMPLETE
**Depende de:** B-04
**Refs:** `study-session/spec.md` (REQ-SS-001 a REQ-SS-022)
**O que fazer:**
- POST /sessions: cria StudySession (userId do token, topicId do body)
- POST /sessions/:id/finish: recebe array de resultados, salva CardResult[], atualiza totais
- GET /sessions: lista sessões do usuário logado (paginado, 20/página)
- GET /sessions/:id: detalhes de uma sessão (owner only)
**Pronto quando:** Critérios de aceite de study-session/spec.md passam.

### F-06 — Fluxo de Estudo (Student) [P com B-05]
**Onde:** `frontend/src/pages/student/`
**Status:** COMPLETE
**Depende de:** F-04, F-05
**O que fazer:**
- `/home`: grid de matérias (Subject cards) com cor, ícone e badge "Estudado"
- `/subjects/:id`: lista de tópicos da matéria + contagem de cards por tópico
- `/topics/:id`: lista de cards do tópico + botão "Iniciar Estudo"
- `/study/:topicId`: tela de sessão — usa `<FlashCard>`, controla índice atual, coleta resultados, POST /sessions ao iniciar, POST /sessions/:id/finish ao terminar
- Tela de resultado: acertos, erros, %, botão "Estudar de novo" / "Voltar para home"
- Atalhos de teclado: Espaço=flip, 1=erro, 2=acerto
**Pronto quando:** REQ-SS-001 a REQ-SS-013 critérios de aceite passam; sessão salva no banco.

---

## Grupo 6 — Progresso

### B-06 — ProgressModule backend
**Onde:** `backend/src/progress/`
**Status:** COMPLETE
**Depende de:** B-05
**Refs:** `progress/spec.md` (REQ-PROG-001 a REQ-PROG-006)
**O que fazer:**
- GET /progress/me: agrega dados de StudySession do usuário
- GET /progress/me/subjects: agrega por matéria → tópicos (última sessão + acumulado)
- Queries Prisma otimizadas com `groupBy` e `_count`/`_sum`
**Pronto quando:** Critérios de aceite de progress/spec.md passam; resposta < 500ms.

### F-07 — Dashboard de Progresso [P com B-06]
**Onde:** `frontend/src/pages/student/`
**Status:** COMPLETE
**Depende de:** F-06
**O que fazer:**
- `/progress`: stats gerais (React Query GET /progress/me), lista de matérias estudadas com % acerto
- Histórico de sessões: data, matéria, % acerto, total de cards
- Estado vazio: ilustração + CTA "Comece a estudar"
**Pronto quando:** REQ-PROG-001 a REQ-PROG-004 critérios de aceite passam; dados reais do banco.

---

## Grupo 7 — Deploy

### X-01 — Deploy Frontend (Vercel)
**Onde:** `frontend/`
**Status:** PLANNED
**Depende de:** F-07
**O que fazer:**
- Conectar repo GitHub na Vercel; configurar: Root=`frontend/`, Build=`npm run build`, Out=`dist/`
- Setar variável `VITE_API_URL=https://<render-url>`
- Verificar `vercel.json` com rewrite SPA
- Testar todas as rotas no domínio Vercel
**Pronto quando:** App acessível via URL Vercel; nenhuma rota retorna 404.

### X-02 — Deploy Backend (Render) [P com X-01]
**Onde:** `backend/`
**Status:** PLANNED
**Depende de:** B-06
**O que fazer:**
- Criar conta Neon, provisionar banco `guia-em-cards-prod`, copiar `DATABASE_URL`
- Criar Web Service no Render: Root=`backend/`, Build=`npm install && npm run build`, Start=`node dist/main`
- Setar env vars: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `PORT=3000`
- Rodar migrate prod: `npx prisma migrate deploy`
- Rodar seed inicial: `npm run seed`
**Pronto quando:** POST /auth/login retorna 200 no URL do Render; CORS para domínio Vercel funciona.

---

## Critérios de Conclusão do M1

- [ ] Aluno se registra, faz login, estuda cards e vê progresso
- [ ] Admin cria matéria e cards com rich content (LaTeX, Mermaid, imagem)
- [ ] Frontend deployed na Vercel; backend deployed no Render
- [ ] Nenhum dado sensível no código (envs configuradas)
- [ ] Seed inicial com dados de exemplo criado
