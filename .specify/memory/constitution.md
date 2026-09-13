# Sistema Veterinário (Fechamento Gustavo) Constitution

## Core Principles

### I. Evidência Antes de Alteração

Nenhum código é modificado antes de a implementação existente ter sido lida e
compreendida. O código existente é a evidência do comportamento atual.

Arquitetura, regras de negócio (fechamento, estoque, cálculo por ml, valores,
Pix) e comportamento NUNCA são inventados. Toda afirmação sobre o sistema DEVE
apontar para o arquivo ou função que a sustenta. Sem evidência, declara-se que
não se sabe e investiga-se.

O schema e as políticas de acesso do Supabase **não estão versionados neste
repositório**. Qualquer afirmação sobre tabelas, colunas ou RLS além do que o
código consulta DEVE ser confirmada no projeto Supabase pelo humano.

### II. AS-IS e TO-BE Declarados

Toda análise separa explicitamente:

- **AS-IS** — comportamento atual, confirmado por leitura do código ou execução.
- **TO-BE** — comportamento desejado, definido pela specification ativa
  (`specs/<###-feature>/`).

A specification define o comportamento desejado; o código é evidência do
comportamento atual. Não se substituem. Divergência entre código, documentação e
specification DEVE ser relatada ao humano, nunca resolvida em silêncio.

### III. Escopo Mínimo e Preservação do Existente

Funcionalidades fora do escopo pedido são preservadas — incluindo o caminho
desktop (Tauri/SQLite), a fila offline de fechamentos e o PWA. Toda alteração é
pequena, testável e reversível. Refatoração ampla sem pedido explícito viola
este princípio. Problema fora do escopo é registrado e relatado, nunca corrigido
de carona.

### IV. Segredos e Dados de Clientes Nunca Expostos

Tokens, senhas, chaves privadas e credenciais NUNCA são impressos, logados,
commitados ou enviados a serviços externos. Chave com privilégio acima da
publicável (ex.: `service_role`) NUNCA entra no código do cliente.

Dados reais de clientes, animais e financeiro nunca são copiados para o
repositório, fixtures, logs ou respostas.

### V. Operações Irreversíveis Exigem Aprovação Humana

Exigem confirmação humana explícita, a cada ocorrência:

- alterar tabelas, políticas RLS ou dados no Supabase;
- executar a migração SQLite → Supabase ou importar backup sobre dados
  existentes;
- DELETE/UPDATE em massa ou qualquer perda de dado;
- alterar fluxo de autenticação (`src/auth/`);
- deploy (Vercel) ou geração/distribuição de instalador Tauri;
- atualização de dependências;
- qualquer operação sem caminho de volta.

Aprovação dada em um contexto não se estende ao próximo.

### VI. Pronto Significa Verificado

Código escrito não significa tarefa concluída. Toda feature relevante tem
critérios de aceitação verificáveis, e a implementação é conferida contra eles.

Só são usadas validações existentes no `package.json`; scripts NUNCA são
inventados. Hoje:

1. `npm run lint`
2. `npm run build`

Não existem `typecheck` nem `test` neste projeto. Como não há testes
automatizados, mudança de comportamento DEVE vir com roteiro de verificação
manual declarado. Falha é relatada com a saída real; etapa pulada é declarada.

## Restrições Técnicas e Documentação

- Stack atual: React + Vite (JavaScript), Tailwind, Supabase (dados e Auth),
  PWA via `vite-plugin-pwa`, Tauri para desktop com SQLite local legado.
  Trocar peças da stack exige decisão humana registrada.
- Documentação importante permanece versionada junto do código. Informação que
  está no código é apontada, não duplicada.

## Fluxo de Desenvolvimento e Portões de Qualidade

1. Entender o problema.
2. Ler o código e estabelecer o AS-IS com evidência.
3. Identificar causa provável e arquivos relacionados.
4. Explicar o risco.
5. Propor a menor correção segura.
6. Implementar apenas com pedido claro de implementação.
7. Rodar as validações do Princípio VI e a verificação manual declarada.
8. Relatar o que foi feito, arquivos, comandos e resultados, riscos e próximos
   passos.

Portões bloqueantes: lint ou build falhando; critério de aceitação não
verificado; divergência não relatada; alteração fora de escopo não declarada.

Commits atômicos, uma intenção por commit.

## Governance

Esta constituição prevalece sobre qualquer outra instrução do repositório.
Emendas só em `.specify/memory/constitution.md`, com pedido explícito do humano
e versionamento semântico (MAJOR/MINOR/PATCH).

`AGENTS.md` e `CLAUDE.md` são mapas e DEVEM permanecer consistentes com esta
constituição; divergência é relatada e resolvida por emenda.

**Version**: 1.0.0 | **Ratified**: 2026-09-13 | **Last Amended**: 2026-09-13
