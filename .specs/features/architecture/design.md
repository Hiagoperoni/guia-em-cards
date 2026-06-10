# Design de Arquitetura — Guia em Cards

## Visão Geral

```
[Browser]
   │
   ├── React + Vite (Vercel)
   │     Zustand (auth) │ React Query (cache)
   │
   ├── HTTPS/REST ──────────────────────────────────────┐
   │                                                     ▼
   │                                        NestJS API (Render)
   │                                        Passport JWT │ Guards
   │                                        Prisma ORM   │
   │                                                     │
   └─────────────────────────────────── Neon Postgres ◄──┘
                                        (serverless)
```

## Estrutura do Monorepo

```
guia-em-cards/
├── frontend/                     # React + Vite + TypeScript
│   ├── src/
│   │   ├── api/                  # Axios instance + hooks React Query
│   │   ├── components/           # UI compartilhado
│   │   │   ├── RichContent/      # Markdown+KaTeX+Mermaid renderer
│   │   │   └── FlashCard/        # Card flip component
│   │   ├── pages/
│   │   │   ├── auth/             # Login, Register
│   │   │   ├── student/          # Home, Subject, Study, Progress
│   │   │   └── admin/            # Admin subjects, cards
│   │   ├── store/                # Zustand (auth store)
│   │   ├── router/               # React Router + protected routes
│   │   └── types/                # Tipos compartilhados (DTOs)
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── vercel.json               # SPA rewrite rules
│
├── backend/                      # NestJS + TypeScript
│   ├── src/
│   │   ├── auth/                 # AuthModule: register, login, guards
│   │   ├── users/                # UsersModule: CRUD users
│   │   ├── subjects/             # SubjectsModule: CRUD subjects
│   │   ├── cards/                # CardsModule: CRUD cards
│   │   ├── sessions/             # SessionsModule: study sessions
│   │   ├── progress/             # ProgressModule: stats
│   │   ├── common/               # Guards, decorators, filters
│   │   ├── prisma/               # PrismaService + schema
│   │   └── main.ts               # Bootstrap (CORS, ValidationPipe)
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts               # Seed admin user + dados exemplo
│   └── .env.example
│
├── .specs/                       # Este diretório
├── README.md
└── package.json                  # Scripts de root (opcional)
```

## Hierarquia de Conteúdo

```
Subject (Matéria)   → cor + ícone + descrição
  └── Topic (Tópico) → ordem + descrição
        └── Card     → pergunta, resposta, resumo (Markdown/LaTeX/Mermaid)
```

A `StudySession` é sempre por **Tópico** — o aluno escolhe Matéria → Tópico → Estudar.

## Modelo de Dados Completo (Prisma)

```prisma
model User {
  id        String         @id @default(cuid())
  name      String
  email     String         @unique
  password  String
  role      Role           @default(STUDENT)
  sessions  StudySession[]
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt
}

model Subject {
  id          String    @id @default(cuid())
  name        String
  description String?
  color       String    @default("#6366f1")
  icon        String    @default("📚")
  active      Boolean   @default(true)
  topics      Topic[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Topic {
  id          String         @id @default(cuid())
  name        String
  description String?
  order       Int            @default(0)
  active      Boolean        @default(true)
  subjectId   String
  subject     Subject        @relation(fields: [subjectId], references: [id])
  cards       Card[]
  sessions    StudySession[]
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  @@index([subjectId])
}

model Card {
  id        String       @id @default(cuid())
  topicId   String
  topic     Topic        @relation(fields: [topicId], references: [id])
  question  String
  answer    String
  summary   String?
  order     Int          @default(0)
  active    Boolean      @default(true)
  results   CardResult[]
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt
  @@index([topicId])
}

model StudySession {
  id             String       @id @default(cuid())
  userId         String
  user           User         @relation(fields: [userId], references: [id])
  topicId        String
  topic          Topic        @relation(fields: [topicId], references: [id])
  startedAt      DateTime     @default(now())
  finishedAt     DateTime?
  totalCards     Int          @default(0)
  totalCorrect   Int          @default(0)
  totalIncorrect Int          @default(0)
  results        CardResult[]
  @@index([userId])
  @@index([topicId])
}

model CardResult {
  id          String       @id @default(cuid())
  sessionId   String
  session     StudySession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  cardId      String
  card        Card         @relation(fields: [cardId], references: [id])
  result      ResultType
  timeSpentMs Int?
  @@index([sessionId])
  @@index([cardId])
}

enum Role       { ADMIN STUDENT }
enum ResultType { CORRECT INCORRECT }
```

## Fluxo de Auth (Frontend)

```
Usuário → /login → POST /auth/login → { token, user }
                                          │
                                    Zustand.setAuth()
                                    localStorage.setItem('token')
                                          │
                              Axios interceptor: Authorization: Bearer <token>
                                          │
                              ProtectedRoute: verifica role → redireciona
```

## Deploy

| Serviço   | Plataforma | Config                                              |
|-----------|------------|-----------------------------------------------------|
| Frontend  | Vercel     | Root: `frontend/`, Build: `npm run build`, Out: `dist/` |
| Backend   | Render     | Root: `backend/`, Build: `npm run build`, Start: `node dist/main` |
| Database  | Neon       | Connection string via `DATABASE_URL` no Render      |

### vercel.json (SPA rewrite)

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Variáveis de Ambiente Backend (.env)

```
DATABASE_URL=postgresql://...@neon.tech/guia-em-cards?sslmode=require
JWT_SECRET=<secret-forte>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://guia-em-cards.vercel.app
PORT=3000
```

### Variáveis de Ambiente Frontend (.env)

```
VITE_API_URL=https://guia-em-cards-api.onrender.com
```

## Decisões de Design

| Decisão                        | Escolha                           | Motivo                                              |
|-------------------------------|-----------------------------------|-----------------------------------------------------|
| Rich content renderização     | Totalmente no front               | Backend sem lógica de render; dados raw no DB       |
| Paginação de cards            | Não no M1                         | Matérias pequenas (<100 cards); adicionar em M2     |
| Refresh token                 | Não no M1                         | JWT 7d suficiente para MVP; add em M2               |
| Soft delete                   | Campo `active: boolean`           | Histórico preservado; FK integridade mantida        |
| Monorepo vs repos separados   | Monorepo (1 repo)                 | Dev solo; mais fácil compartilhar tipos e configs   |
