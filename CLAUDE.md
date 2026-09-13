# Sistema Veterinário — guia do Claude

Responda sempre em **português do Brasil**.

**Governança:** [`.specify/memory/constitution.md`](.specify/memory/constitution.md)
prevalece sobre este arquivo. Aqui fica só o mapa operacional.

## Onde os dados vivem (AS-IS)

**Supabase é a fonte de dados e de login** do app web.

- Cliente: `src/services/supabase.js` (chave publicável no código; o acesso
  depende das políticas RLS do projeto Supabase).
- Tabelas consultadas pelo código: `clientes`, `animais`, `configuracoes`,
  `fechamentos`, `lancamentos`, `produtos`, `movimentacoes_estoque`.
- **Schema e RLS não estão versionados aqui.** Não afirme nada além do que o
  código consulta sem confirmação humana.
- Auth: `src/auth/AuthContext.jsx` (`supabase.auth`, e-mail e senha).

**SQLite local é legado do app desktop.** `src/services/db.js` só funciona
dentro do Tauri (`financeiro.db`). É usado por `initDB.js`, `backup.js` e pela
migração SQLite → Supabase (`src/services/migracao.js`, rota `/migracao`).

**Fila offline de fechamentos** em `localStorage` (`src/services/filaOffline.js`,
chave `fila_fechamentos`).

## Mapa

| Procurando | Vá em |
|---|---|
| Rotas | `src/app/routes.jsx` |
| Telas | `src/pages/` |
| Acesso a dados por domínio | `src/services/` |
| Pix e WhatsApp | `src/utils/pix/`, `src/utils/whatsapp/` |
| PWA (só no build web) | `vite.config.js` |
| Desktop | `src-tauri/` (`tauri.conf.json`) |
| Deploy web | `vercel.json` (rewrite SPA) |

## Validação

```bash
npm run lint    # eslint .
npm run build   # vite build
```

Não há `typecheck`, testes nem CI.

**Baseline em 2026-09-13:** `npm run lint` já falha na `main` (erros
pré-existentes em `src/` e `vite.config.js`) e, quando existe build local do
Tauri, também varre `src-tauri/target/`. Compare com a baseline antes de
atribuir um erro de lint à sua mudança.

## Operações que exigem pedido explícito

| Operação | Por quê |
|---|---|
| Rota `/migracao`, importar backup | Grava em massa no Supabase; pode duplicar dados |
| Qualquer mudança de tabela/RLS no Supabase | Fora do repositório, sem volta |
| `src/auth/`, `src/services/supabase.js` | Fluxo de autenticação e credencial |
| `npm run tauri build`, deploy Vercel | Distribuição/produção |
