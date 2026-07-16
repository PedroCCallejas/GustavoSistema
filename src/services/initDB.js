import { getDB } from "./db";

export async function initDatabase() {
  const db = await getDB();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS lancamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL,
      descricao TEXT,
      valor REAL NOT NULL,
      forma_pagamento TEXT,
      status_pagamento TEXT DEFAULT 'pendente',
      data_lancamento TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    await db.execute(`
      ALTER TABLE lancamentos ADD COLUMN status_pagamento TEXT DEFAULT 'pendente'
    `);
  } catch {
    // ignora se a coluna ja existir
    console.log("Coluna status_pagamento ja existe ou nao precisa ser criada.");
  }

  await db.execute(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      quantidade REAL NOT NULL DEFAULT 0,
      unidade TEXT DEFAULT 'un',
      custo_anterior REAL DEFAULT 0,
      custo_atual REAL DEFAULT 0,
      custo_medio REAL DEFAULT 0,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS movimentacoes_estoque (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      produto_id INTEGER NOT NULL,
      quantidade REAL NOT NULL DEFAULT 0,
      custo_unit REAL DEFAULT 0,
      preco_unit REAL DEFAULT 0,
      data TEXT,
      lancamento_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migracoes para bancos que ja existiam antes destas colunas.
  try {
    await db.execute(`ALTER TABLE produtos ADD COLUMN custo_medio REAL DEFAULT 0`);
  } catch {
    // coluna ja existe
  }
  try {
    await db.execute(`ALTER TABLE movimentacoes_estoque ADD COLUMN lancamento_id INTEGER`);
  } catch {
    // coluna ja existe
  }
  try {
    await db.execute(
      `UPDATE produtos SET custo_medio = custo_atual WHERE custo_medio IS NULL OR custo_medio = 0`
    );
  } catch {
    // ignora
  }
}
