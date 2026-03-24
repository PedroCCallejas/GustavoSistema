CREATE TABLE IF NOT EXISTS categorias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lancamentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo TEXT NOT NULL,
  descricao TEXT,
  categoria_id INTEGER,
  valor REAL NOT NULL,
  forma_pagamento TEXT,
  data_lancamento TEXT,
  observacoes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);