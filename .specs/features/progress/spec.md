# Feature: Progresso do Aluno

**ID Prefix:** REQ-PROG
**Milestone:** M1
**Status:** COMPLETE

## Contexto

Aluno acompanha seu progresso de estudo: matérias estudadas, taxa de acerto, histórico de sessões. Sem algoritmo SM-2 no M1 — apenas estatísticas acumuladas.

## Requisitos

| ID            | Requisito                                                                             | Prioridade |
|---------------|---------------------------------------------------------------------------------------|------------|
| REQ-PROG-001  | Dashboard na home mostra resumo: total de sessões, total de matérias estudadas       | Must       |
| REQ-PROG-002  | Por matéria: mostrar total de cards, % de acerto (última sessão e acumulado)         | Must       |
| REQ-PROG-003  | Listar histórico de sessões do aluno (data, matéria, resultado)                      | Must       |
| REQ-PROG-004  | Cada card na lista de matérias indica se o aluno já a estudou (badge "Estudado")    | Should     |
| REQ-PROG-005  | Estatística de streak (dias consecutivos de estudo)                                   | Could      |
| REQ-PROG-006  | Admin pode ver estatísticas agregadas: cards mais errados, matérias mais estudadas   | Could      |

## Endpoints Backend

| Método | Rota                              | Auth | Descrição                                            |
|--------|-----------------------------------|------|------------------------------------------------------|
| GET    | /progress/me                      | JWT  | Resumo geral do aluno logado                         |
| GET    | /progress/me/subjects             | JWT  | Progresso por matéria do aluno                       |
| GET    | /sessions                         | JWT  | Histórico de sessões do aluno (paginado)             |
| GET    | /progress/subjects/:id/stats      | JWT+ADMIN | Estatísticas agregadas de uma matéria (admin) |

## Formato de Resposta — GET /progress/me

```json
{
  "totalSessions": 12,
  "totalSubjectsStudied": 3,
  "totalCardsStudied": 87,
  "overallAccuracy": 0.72
}
```

## Formato de Resposta — GET /progress/me/subjects

```json
[
  {
    "subjectId": "cuid1",
    "subjectName": "Matemática",
    "totalCards": 40,
    "sessionsCount": 5,
    "lastSessionAt": "2026-06-08T21:00:00Z",
    "lastSessionAccuracy": 0.80,
    "overallAccuracy": 0.75
  }
]
```

## Critérios de Aceite

- [ ] Dashboard exibe dados reais do banco (não mock)
- [ ] Aluno sem sessões vê estado vazio com CTA para começar a estudar
- [ ] Progresso de um aluno não é visível para outro aluno
- [ ] GET /progress/me responde em < 500ms (query otimizada)
