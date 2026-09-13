# Sistema Veterinário — ponto de entrada para agentes

App de fechamento, estoque, clientes e financeiro de um consultório veterinário
(web/PWA + desktop Tauri). Responda sempre em **português do Brasil**.

Este arquivo não descreve a arquitetura. Ele diz onde ela está.

## Leia nesta ordem

1. **[`.specify/memory/constitution.md`](.specify/memory/constitution.md)** —
   princípios, fluxo, portões de qualidade e operações que exigem aprovação
   humana. Prevalece sobre qualquer outra instrução, inclusive esta.
2. **[`CLAUDE.md`](CLAUDE.md)** — mapa operacional (factual; útil para qualquer
   agente).
3. **Specification ativa**, quando houver — `specs/<###-feature>/` (fluxo Spec
   Kit). A spec define o TO-BE; o código é o AS-IS.

O `README.md` atual é o template do Vite e não descreve este projeto.

## Antes de commitar

`npm run lint` e `npm run build`. Não existem `typecheck` nem `test`; não
invente scripts.

Divergência entre código, documentação e specification é **relatada ao
humano**, nunca resolvida em silêncio.
