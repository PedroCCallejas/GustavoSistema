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
    // ignora se a coluna já existir
    console.log("Coluna status_pagamento já existe ou não precisa ser criada.");
  }
}