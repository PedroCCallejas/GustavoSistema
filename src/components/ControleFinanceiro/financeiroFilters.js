export function buildWhereClause(filters) {
  const conditions = [];
  const params = [];

  if (filters.busca?.trim()) {
    conditions.push("descricao LIKE ?");
    params.push(`%${filters.busca.trim()}%`);
  }

  if (filters.tipo && filters.tipo !== "todos") {
    conditions.push("tipo = ?");
    params.push(filters.tipo);
  }

  if (filters.formaPagamento && filters.formaPagamento !== "todos") {
    conditions.push("forma_pagamento = ?");
    params.push(filters.formaPagamento);
  }

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const hoje = `${yyyy}-${mm}-${dd}`;

  if (filters.periodo === "hoje") {
    conditions.push("data_lancamento = ?");
    params.push(hoje);
  }

  if (filters.periodo === "este-mes") {
    const inicio = `${yyyy}-${mm}-01`;
    const fim = `${yyyy}-${mm}-31`;
    conditions.push("data_lancamento BETWEEN ? AND ?");
    params.push(inicio, fim);
  }

  if (filters.periodo === "mes-passado") {
    const prev = new Date(yyyy, today.getMonth() - 1, 1);
    const prevYear = prev.getFullYear();
    const prevMonth = String(prev.getMonth() + 1).padStart(2, "0");
    const inicio = `${prevYear}-${prevMonth}-01`;
    const fim = `${prevYear}-${prevMonth}-31`;
    conditions.push("data_lancamento BETWEEN ? AND ?");
    params.push(inicio, fim);
  }

  if (filters.periodo === "personalizado") {
    if (filters.dataInicio) {
      conditions.push("data_lancamento >= ?");
      params.push(filters.dataInicio);
    }

    if (filters.dataFim) {
      conditions.push("data_lancamento <= ?");
      params.push(filters.dataFim);
    }
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  return { where, params };
}