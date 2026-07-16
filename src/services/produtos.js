import { supabase } from "./supabase";

const CACHE_PRODUTOS = "cache_produtos";

export async function listarProdutos() {
  try {
    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .order("nome", { ascending: true });
    if (error) throw error;
    const lista = data ?? [];
    try {
      localStorage.setItem(CACHE_PRODUTOS, JSON.stringify(lista));
    } catch {
      // ignora falha ao gravar cache
    }
    return lista;
  } catch (erro) {
    // offline: usa o ultimo cache salvo, se houver
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_PRODUTOS) || "[]");
      if (Array.isArray(cache) && cache.length) return cache;
    } catch {
      // ignora
    }
    throw erro;
  }
}

export async function criarProduto({ nome, quantidade = 0, unidade = "un", custoAtual = 0 }) {
  const c = Number(custoAtual) || 0;
  const { error } = await supabase.from("produtos").insert({
    nome,
    quantidade: Number(quantidade) || 0,
    unidade,
    custo_anterior: c,
    custo_atual: c,
    custo_medio: c,
  });
  if (error) throw error;
}

export async function atualizarProduto(id, { nome, unidade }) {
  const { error } = await supabase.from("produtos").update({ nome, unidade }).eq("id", id);
  if (error) throw error;
}

export async function deletarProduto(id) {
  const { error } = await supabase.from("produtos").delete().eq("id", id);
  if (error) throw error;
}

// Reposicao com custo medio ponderado.
export async function repor(id, quantidadeAdicionada, novoCusto) {
  const qtdAdd = Number(quantidadeAdicionada) || 0;
  const custoNovo = Number(novoCusto) || 0;

  const { data: prod, error: e1 } = await supabase
    .from("produtos")
    .select("quantidade, custo_atual, custo_medio")
    .eq("id", id)
    .single();
  if (e1) throw e1;

  const qtdAtual = Math.max(Number(prod.quantidade) || 0, 0);
  const medioAtual = Number(prod.custo_medio) || 0;
  const baseQtd = qtdAtual + qtdAdd;
  const novoMedio =
    baseQtd > 0 ? (qtdAtual * medioAtual + qtdAdd * custoNovo) / baseQtd : custoNovo;

  const { error: e2 } = await supabase
    .from("produtos")
    .update({
      custo_anterior: Number(prod.custo_atual) || 0,
      custo_atual: custoNovo,
      custo_medio: novoMedio,
      quantidade: (Number(prod.quantidade) || 0) + qtdAdd,
    })
    .eq("id", id);
  if (e2) throw e2;
}

export async function baixarEstoque(id, quantidade) {
  const qtd = Number(quantidade) || 0;
  if (!id || qtd <= 0) return;
  const { data: prod, error: e1 } = await supabase
    .from("produtos")
    .select("quantidade")
    .eq("id", id)
    .single();
  if (e1) throw e1;
  const { error: e2 } = await supabase
    .from("produtos")
    .update({ quantidade: (Number(prod.quantidade) || 0) - qtd })
    .eq("id", id);
  if (e2) throw e2;
}

export async function registrarSaidaFechamento({
  produtoId,
  quantidade,
  precoUnit = 0,
  lancamentoId = null,
}) {
  const qtd = Number(quantidade) || 0;
  if (!produtoId || qtd <= 0) return;

  const { data: prod, error: e1 } = await supabase
    .from("produtos")
    .select("quantidade, custo_medio")
    .eq("id", produtoId)
    .single();
  if (e1) throw e1;

  const custoUnit = Number(prod.custo_medio) || 0;
  const hoje = new Date().toISOString().slice(0, 10);

  const { error: e2 } = await supabase.from("movimentacoes_estoque").insert({
    produto_id: produtoId,
    quantidade: qtd,
    custo_unit: custoUnit,
    preco_unit: Number(precoUnit) || 0,
    data: hoje,
    lancamento_id: lancamentoId,
  });
  if (e2) throw e2;

  const { error: e3 } = await supabase
    .from("produtos")
    .update({ quantidade: (Number(prod.quantidade) || 0) - qtd })
    .eq("id", produtoId);
  if (e3) throw e3;
}

export async function estornarFechamento(lancamentoId) {
  if (!lancamentoId) return;

  const { data: movs, error: e1 } = await supabase
    .from("movimentacoes_estoque")
    .select("produto_id, quantidade")
    .eq("lancamento_id", lancamentoId);
  if (e1) throw e1;

  for (const m of movs ?? []) {
    if (!m.produto_id) continue;
    const { data: prod, error: e2 } = await supabase
      .from("produtos")
      .select("quantidade")
      .eq("id", m.produto_id)
      .single();
    if (e2) throw e2;
    const { error: e3 } = await supabase
      .from("produtos")
      .update({ quantidade: (Number(prod.quantidade) || 0) + (Number(m.quantidade) || 0) })
      .eq("id", m.produto_id);
    if (e3) throw e3;
  }

  const { error: e4 } = await supabase
    .from("movimentacoes_estoque")
    .delete()
    .eq("lancamento_id", lancamentoId);
  if (e4) throw e4;
}

export async function listarMovimentacoes() {
  const { data, error } = await supabase
    .from("movimentacoes_estoque")
    .select("*, produtos(nome)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((m) => ({ ...m, produto_nome: m.produtos?.nome ?? null }));
}
