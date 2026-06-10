# Feature: Autenticação & Usuários

**ID Prefix:** REQ-AUTH
**Milestone:** M1
**Status:** PLANNED

## Contexto

Sistema de autenticação com e-mail/senha e dois perfis (ADMIN e STUDENT). JWT armazenado no localStorage (front) e validado via Bearer token no back. Refresh token fora do escopo M1.

## Requisitos

### Registro

| ID            | Requisito                                                                 | Prioridade |
|---------------|---------------------------------------------------------------------------|------------|
| REQ-AUTH-001  | Aluno pode se registrar com nome, e-mail e senha                         | Must       |
| REQ-AUTH-002  | E-mail deve ser único no sistema                                          | Must       |
| REQ-AUTH-003  | Senha deve ter mínimo 8 caracteres                                        | Must       |
| REQ-AUTH-004  | Senha armazenada com hash bcrypt (cost 10)                                | Must       |
| REQ-AUTH-005  | Novo usuário recebe role STUDENT por padrão                               | Must       |
| REQ-AUTH-006  | ADMIN só pode ser criado por outro ADMIN (ou seed inicial)                | Must       |

### Login

| ID            | Requisito                                                                 | Prioridade |
|---------------|---------------------------------------------------------------------------|------------|
| REQ-AUTH-010  | Usuário faz login com e-mail e senha                                      | Must       |
| REQ-AUTH-011  | Retorno: access token JWT (expiração 7 dias) + dados básicos do usuário  | Must       |
| REQ-AUTH-012  | Credenciais inválidas retornam 401 com mensagem genérica                  | Must       |
| REQ-AUTH-013  | Token JWT contém: userId, email, role                                     | Must       |

### Guards & Proteção de Rotas

| ID            | Requisito                                                                 | Prioridade |
|---------------|---------------------------------------------------------------------------|------------|
| REQ-AUTH-020  | Rotas protegidas exigem Bearer token válido                               | Must       |
| REQ-AUTH-021  | Rotas de ADMIN rejeitam STUDENT com 403                                   | Must       |
| REQ-AUTH-022  | Token expirado retorna 401                                                | Must       |
| REQ-AUTH-023  | Frontend redireciona para /login quando token ausente/inválido            | Must       |
| REQ-AUTH-024  | Frontend redireciona para /home após login bem-sucedido                   | Must       |

### Perfil

| ID            | Requisito                                                                 | Prioridade |
|---------------|---------------------------------------------------------------------------|------------|
| REQ-AUTH-030  | Usuário logado pode consultar seu próprio perfil (GET /me)                | Must       |
| REQ-AUTH-031  | Usuário pode atualizar nome (PATCH /me)                                   | Should     |

## Modelo de Dados

```
User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String   // bcrypt hash
  role      Role     @default(STUDENT)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role { ADMIN STUDENT }
```

## Endpoints Backend

| Método | Rota            | Auth   | Descrição                  |
|--------|-----------------|--------|----------------------------|
| POST   | /auth/register  | Público | Registrar novo usuário     |
| POST   | /auth/login     | Público | Login, retorna JWT          |
| GET    | /auth/me        | JWT    | Perfil do usuário logado   |
| PATCH  | /auth/me        | JWT    | Atualizar nome             |

## Critérios de Aceite

- [ ] Registro com dados válidos retorna 201 + token
- [ ] Login com credenciais corretas retorna 200 + token
- [ ] Rota /subjects sem token retorna 401
- [ ] Rota de admin com token STUDENT retorna 403
- [ ] Senha não aparece em nenhuma resposta da API
