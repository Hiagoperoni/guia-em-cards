# Feature: Sessão de Estudo

**ID Prefix:** REQ-SS
**Milestone:** M1
**Status:** PLANNED

## Contexto

Aluno escolhe uma matéria → escolhe um tópico → inicia uma sessão de estudo com os cards daquele tópico. Os cards são exibidos um por um. Aluno vê a pergunta, vira o card para ver a resposta e resumo, e marca como acerto ou erro. Ao terminar, a sessão é salva com os resultados.

## Requisitos — Fluxo da Sessão

| ID         | Requisito                                                                       | Prioridade |
|------------|---------------------------------------------------------------------------------|------------|
| REQ-SS-001 | Aluno pode iniciar sessão de estudo em qualquer tópico ativo                   | Must       |
| REQ-SS-002 | Sessão exibe todos os cards ativos do tópico em sequência (ordem padrão)       | Must       |
| REQ-SS-003 | Card mostra apenas a pergunta inicialmente (frente do card)                    | Must       |
| REQ-SS-004 | Aluno pode virar o card para ver resposta e resumo (verso do card)             | Must       |
| REQ-SS-005 | Após virar, aluno marca o card como Acerto (✓) ou Erro (✗)                    | Must       |
| REQ-SS-006 | Não é possível marcar antes de virar o card                                    | Must       |
| REQ-SS-007 | Progresso da sessão é visível (ex: "Card 3 de 20")                             | Must       |
| REQ-SS-008 | Ao final dos cards, sessão mostra tela de resultado (acertos, erros, %)        | Must       |
| REQ-SS-009 | Resultado da sessão é salvo automaticamente no backend ao finalizar            | Must       |
| REQ-SS-010 | Aluno pode abandonar sessão (sem salvar) e voltar para a home                  | Should     |
| REQ-SS-011 | Card exibe conteúdo rich (Markdown, LaTeX, imagens, Mermaid)                  | Must       |
| REQ-SS-012 | Animação de flip (CSS 3D) ao virar o card                                      | Should     |
| REQ-SS-013 | Atalho de teclado: Espaço = virar card; 1 = Erro; 2 = Acerto                  | Should     |

## Requisitos — Persistência

| ID         | Requisito                                                                       | Prioridade |
|------------|---------------------------------------------------------------------------------|------------|
| REQ-SS-020 | Cada sessão salva: userId, topicId, data/hora início e fim                     | Must       |
| REQ-SS-021 | Cada resposta registra: cardId, resultado (CORRECT/INCORRECT), tempo (ms)      | Must       |
| REQ-SS-022 | Backend calcula e armazena: totalCards, totalCorrect, totalIncorrect            | Must       |

## Modelo de Dados

```
StudySession {
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
}

CardResult {
  id             String       @id @default(cuid())
  sessionId      String
  session        StudySession @relation(fields: [sessionId], references: [id])
  cardId         String
  card           Card         @relation(fields: [cardId], references: [id])
  result         ResultType
  timeSpentMs    Int?
}

enum ResultType { CORRECT INCORRECT }
```

## Endpoints Backend

| Método | Rota                              | Auth | Descrição                              |
|--------|-----------------------------------|------|----------------------------------------|
| POST   | /sessions                         | JWT  | Criar nova sessão (`{ topicId }`)      |
| POST   | /sessions/:id/finish              | JWT  | Finalizar sessão com resultados        |
| GET    | /sessions/:id                     | JWT  | Detalhes de uma sessão                 |

## Lógica de Finalização (POST /sessions/:id/finish)

```json
{
  "results": [
    { "cardId": "cuid1", "result": "CORRECT",   "timeSpentMs": 4200 },
    { "cardId": "cuid2", "result": "INCORRECT",  "timeSpentMs": 8100 }
  ]
}
```
Backend salva os CardResult, calcula totais e marca `finishedAt`.

## Critérios de Aceite

- [ ] Sessão criada e finalizada salva corretamente no banco
- [ ] Aluno não pode finalizar sessão de outro usuário (403)
- [ ] Tela de resultado exibe % de acerto calculado no front
- [ ] Card sem resposta registrada não conta na sessão
- [ ] Atalhos de teclado funcionam durante a sessão
