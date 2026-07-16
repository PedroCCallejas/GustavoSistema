import { getDB } from "./db";

export async function listarProdutos() {
  const db = await getDB();
  return db.select(`SELECT * FROM produtos ORDER BY nome ASC`);
}

export async function criarProduto({ nome, quantidade = 0, unidade = "un", custoAtual = 0 }) {
  const db = await getDB();
  const c = Number(custoAtual) || 0;
  await db.execute(
    `INSERT INTO produtos (nome, quantidade, unidade, custo_anterior, custo_atual, custo_medio)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nome, Number(quantidade), unidade, c, c, c]
  );
}

export async function atualizarProduto(id, { nome, unidade }) {
  const db = await getDB();
  await db.execute(
    `UPDATE produtos SET nome = ?, unidade = ?, atualizado_em = CURRENT_TIMESTAMP WHERE id = ?`,
    [nome, unidade, id]
  );
}

export async function deletarProduto(id) {
  const db = await getDB();
  await db.execute(`DELETE FROM produtos WHERE id = ?`, [id]);
}

// Reposicao:
// - custo_atual  = ultimo preco de compra (o que ele acabou de pagar)
// - custo_anterior = preco de compra anterior (para o alerta de aumento)
// - custo_medio  = media ponderada, usada para custear as vendas
export async function repor(id, quantidadeAdicionada, novoCusto) {
  const qtdAdd = Number(quantidadeAdicionada) || 0;
  const custoNovo = Number(novoCusto) || 0;
  const db = await getDB();

  const rows = await db.select(
    `SELECT quantidade, custo_atual, custo_medio FROM produtos WHERE id = ?`,
    [id]
  );
  const atual = rows && rows[0] ? rows[0] : { quantidade: 0, custo_atual: 0, custo_medio: 0 };
  const qtdAtual = Math.max(Number(atual.quantidade) || 0, 0);
  const medioAtual = Number(atual.custo_medio) || 0;

  const baseQtd = qtdAtual + qtdAdd;
  const novoMedio =
    baseQtd > 0 ? (qtdAtual * medioAtual + qtdAdd * custoNovo) / baseQtd : custoNovo;

  await db.execute(
    `UPDATE produtos
     SET custo_anterior = custo_atual,
         custo_atual = ?,
         custo_medio = ?,
         quantidade = quantidade + ?,
         atualizado_em = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [custoNovo, novoMedio, qtdAdd, id]
  );
}

// Baixa simples de estoque (mantida por compatibilidade).
export async function baixarEstoque(id, quantidade) {
  const qtd = Number(quantidade) || 0;
  if (!id || qtd <= 0) return;
  const db = await getDB();
  await db.execute(
    `UPDATE produtos
     SET quantidade = quantidade - ?,
         atualizado_em = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [qtd, id]
  );
}

// Saida de um produto num fechamento: grava a movimentacao (custo medio do
// momento + preco cobrado + vinculo com o lancamento) e baixa a quantidade.
export async function registrarSaidaFechamento({
  produtoId,
  quantidade,
  precoUnit = 0,
  lancamentoId = null,
}) {
  const qtd = Number(quantidade) || 0;
  if (!produtoId || qtd <= 0) return;
  const db = await getDB();

  const rows = await db.select(
    `SELECT custo_medio FROM produtos WHERE id = ?`,
    [produtoId]
  );
  const custoUnit = rows && rows[0] ? Number(rows[0].custo_medio) || 0 : 0;

  const hoje = new Date().toISOString().slice(0, 10);

  await db.execute(
    `INSERT INTO movimentacoes_estoque (produto_id, quantidade, custo_unit, preco_unit, data, lancamento_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [produtoId, qtd, custoUnit, Number(precoUnit) || 0, hoje, lancamentoId]
  );

  await db.execute(
    `UPDATE produtos
     SET quantidade = quantidade - ?,
         atualizado_em = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [qtd, produtoId]
  );
}

// Ao excluir um fechamento (lancamento): devolve as quantidades ao estoque
// e remove as movimentacoes (saem da contagem de receita/custo do dashboard).
export async function estornarFechamento(lancamentoId) {
  if (!lancamentoId) return;
  const db = await getDB();

  const movs = await db.select(
    `SELECT produto_id, quantidade FROM movimentacoes_estoque WHERE lancamento_id = ?`,
    [lancamentoId]
  );

  for (const m of movs) {
    await db.execute(
      `UPDATE produtos
       SET quantidade = quantidade + ?,
           atualizado_em = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [Number(m.quantidade) || 0, m.produto_id]
    );
  }

  await db.execute(
    `DELETE FROM movimentacoes_estoque WHERE lancamento_id = ?`,
    [lancamentoId]
  );
}

export async function listarMovimentacoes() {
  const db = await getDB();
  return db.select(`
    SELECT m.*, p.nome AS produto_nome
    FROM movimentacoes_estoque m
    LEFT JOIN produtos p ON p.id = m.produto_id
    ORDER BY m.id DESC
  `);
}
