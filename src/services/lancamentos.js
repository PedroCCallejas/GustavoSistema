import { supabase } from "./supabase";
import { estornarFechamento } from "./produtos";

function aplicarFiltros(query, filters = {}) {
  if (filters.busca?.trim()) {
    query = query.ilike("descricao", `%${filters.busca.trim()}%`);
  }
  if (filters.tipo && filters.tipo !== "todos") {
    query = query.eq("tipo", filters.tipo);
  }
  if (filters.formaPagamento && filters.formaPagamento !== "todos") {
    query = query.eq("forma_pagamento", filters.formaPagamento);
  }
  if (filters.statusPagamento && filters.statusPagamento !== "todos") {
    query = query.eq("status_pagamento", filters.statusPagamento);
  }

  const hoje = new Date();
  const yyyy = hoje.getFullYear();
  const mm = String(hoje.getMonth() + 1).padStart(2, "0");
  const dd = String(hoje.getDate()).padStart(2, "0");
  const hojeStr = `${yyyy}-${mm}-${dd}`;

  if (filters.periodo === "hoje") {
    query = query.eq("data_lancamento", hojeStr);
  }
  if (filters.periodo === "este-mes") {
    query = query
      .gte("data_lancamento", `${yyyy}-${mm}-01`)
      .lte("data_lancamento", `${yyyy}-${mm}-31`);
  }
  if (filters.periodo === "mes-passado") {
    const prev = new Date(yyyy, hoje.getMonth() - 1, 1);
    const py = prev.getFullYear();
    const pm = String(prev.getMonth() + 1).padStart(2, "0");
    query = query
      .gte("data_lancamento", `${py}-${pm}-01`)
      .lte("data_lancamento", `${py}-${pm}-31`);
  }
  if (filters.periodo === "personalizado") {
    if (filters.dataInicio) query = query.gte("data_lancamento", filters.dataInicio);
    if (filters.dataFim) query = query.lte("data_lancamento", filters.dataFim);
  }

  return query;
}

export async function listarLancamentos(filters) {
  let query = supabase.from("lancamentos").select("*");
  query = aplicarFiltros(query, filters);
  query = query
    .order("data_lancamento", { ascending: false })
    .order("created_at", { ascending: false });
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function resumoLancamentos(filters) {
  let query = supabase.from("lancamentos").select("tipo, valor");
  query = aplicarFiltros(query, filters);
  const { data, error } = await query;
  if (error) throw error;

  let entrada = 0;
  let saida = 0;
  for (const l of data ?? []) {
    if (l.tipo === "entrada") entrada += Number(l.valor) || 0;
    else if (l.tipo === "saida") saida += Number(l.valor) || 0;
  }
  return { entrada, saida };
}

export async function criarLancamento({
  tipo,
  descricao,
  valor,
  forma_pagamento,
  status_pagamento = "pendente",
  data_lancamento,
}) {
  const { data, error } = await supabase
    .from("lancamentos")
    .insert({
      tipo,
      descricao,
      valor: Number(valor) || 0,
      forma_pagamento,
      status_pagamento,
      data_lancamento,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data?.id ?? null;
}

export async function atualizarLancamento(id, campos) {
  const { error } = await supabase.from("lancamentos").update(campos).eq("id", id);
  if (error) throw error;
}

export async function alternarStatusLancamento(id, statusAtual) {
  const novo = statusAtual === "pago" ? "pendente" : "pago";
  const { error } = await supabase
    .from("lancamentos")
    .update({ status_pagamento: novo })
    .eq("id", id);
  if (error) throw error;
}

// Exclui o lancamento e estorna o estoque das movimentacoes ligadas a ele.
export async function excluirLancamento(id) {
  await estornarFechamento(id);
  const { error } = await supabase.from("lancamentos").delete().eq("id", id);
  if (error) throw error;
}
