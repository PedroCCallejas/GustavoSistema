import { getDB } from "./db";

export async function initDatabase() {
  try {
    const db = await getDB();

    await db.execute(`
      CREATE TABLE IF NOT EXISTS lancamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT NOT NULL,
        descricao TEXT,
        valor REAL NOT NULL,
        forma_pagamento TEXT,
        data_lancamento TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Banco inicializado com sucesso.");
  } catch (error) {
    console.error("Erro ao inicializar banco:", error);
    alert(
      typeof error === "string"
        ? error
        : JSON.stringify(error, null, 2)
    );
  }
}