# Feature: Conteúdo Rico (Rich Content)

**ID Prefix:** REQ-RC
**Milestone:** M1
**Status:** COMPLETE

## Contexto

Cards suportam Markdown com extensões: imagens via URL, fórmulas matemáticas LaTeX (KaTeX) e diagramas Mermaid. Toda renderização ocorre no frontend — o backend apenas armazena o texto raw.

## Requisitos

| ID         | Requisito                                                                            | Prioridade |
|------------|--------------------------------------------------------------------------------------|------------|
| REQ-RC-001 | Markdown básico: negrito, itálico, listas, títulos, código inline e em bloco        | Must       |
| REQ-RC-002 | Imagens externas: `![alt](https://...)` renderiza `<img>` com max-width 100%        | Must       |
| REQ-RC-003 | Fórmulas inline: `$E = mc^2$` renderiza via KaTeX                                   | Must       |
| REQ-RC-004 | Fórmulas em bloco: `$$\frac{a}{b}$$` renderiza via KaTeX centralizado               | Must       |
| REQ-RC-005 | Blocos Mermaid: ` ```mermaid ... ``` ` renderizam diagramas via mermaid.js          | Must       |
| REQ-RC-006 | Imagens com URL quebrada exibem placeholder com texto alt                            | Should     |
| REQ-RC-007 | Preview de rich content no formulário admin (renderiza enquanto digita)              | Should     |
| REQ-RC-008 | Diagramas Mermaid com sintaxe inválida exibem mensagem de erro amigável             | Should     |
| REQ-RC-009 | Rich content é sanitizado (sem execução de scripts inline — DOMPurify ou rehype)   | Must       |

## Bibliotecas Frontend

| Biblioteca              | Versão | Uso                                        |
|-------------------------|--------|--------------------------------------------|
| react-markdown          | ^9     | Parser e renderizador de Markdown          |
| remark-math             | ^6     | Plugin: detecta `$...$` e `$$...$$`        |
| rehype-katex            | ^7     | Plugin: renderiza LaTeX via KaTeX          |
| rehype-sanitize         | ^6     | Sanitização HTML (remove scripts)          |
| mermaid                 | ^11    | Renderização de diagramas                  |
| katex (peer dep)        | ^0.16  | Engine KaTeX                               |

## Componente `<RichContent>`

```tsx
// Uso esperado:
<RichContent content="# Título\n\nFórmula: $E = mc^2$\n\n```mermaid\ngraph TD; A-->B\n```" />
```

- Wrapper genérico reutilizado em: frente do card (só pergunta), verso (resposta + resumo), preview admin.
- Responsivo: imagens e diagramas se adaptam ao container.

## Critérios de Aceite

- [ ] Texto com `$F = ma$` renderiza equação (não texto raw)
- [ ] Bloco mermaid `graph LR; A --> B` renderiza diagrama visual
- [ ] Imagem externa renderiza dentro do card
- [ ] `<script>alert(1)</script>` no campo não executa (sanitizado)
- [ ] Preview admin atualiza enquanto admin digita (debounce 300ms)
