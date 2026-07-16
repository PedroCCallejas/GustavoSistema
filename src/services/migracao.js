import { getDB } from "./db";
import { supabase } from "./supabase";

function isTauri() {
  return typeof window !== "undefined" && !!window.__TAURI_INTERNALS__;
}

// Verifica se a nuvem ja tem dados (para avisar sobre possivel duplicacao).
export async function nuvemJaTemDados() {
  const [prod, lanc] = await Promise.all([
    supabase.from("produtos").select("*", { count: "exact", head: true }),
    supabase.from("lancamentos").select("*", { count: "exact", head: true }),
  ]);
  return (prod.count || 0) > 0 || (lanc.count || 0) > 0;
}

// Le o banco SQLite local (so no app Tauri) e envia tudo para o Supabase,
// convertendo os IDs inteiros locais em UUIDs e remapeando as ligacoes.
export async function migrarDadosLocaisParaNuvem() {
  if (!isTauri()) {
    throw new Error(
      "A migração só funciona no app instalado no computador, que tem acesso ao banco local."
    );
  }

  const db = await getDB();

  const produtos = await db.select("SELECT * FROM produtos ORDER BY id ASC");
  const lancamentos = await db.select("SELECT * FROM lancamentos ORDER BY id ASC");
  const movimentacoes = await db.select(
    "SELECT * FROM movimentacoes_estoque ORDER BY id ASC"
  );

  const mapProduto = new Map();
  const mapLancamento = new Map();

  for (const p of produtos) {
    const { data, error } = await supabase
      .from("produtos")
      .insert({
        nome: p.nome,
        quantidade: Number(p.quantidade) || 0,
        unidade: p.unidade || "un",
        custo_anterior: Number(p.custo_anterior) || 0,
        custo_atual: Number(p.custo_atual) || 0,
        custo_medio: Number(p.custo_medio ?? p.custo_atual) || 0,
      })
      .select("id")
      .single();
    if (error) throw error;
    mapProduto.set(p.id, data.id);
  }

  for (const l of lancamentos) {
    const { data, error } = await supabase
      .from("lancamentos")
      .insert({
        tipo: l.tipo,
        descricao: l.descricao || null,
        valor: Number(l.valor) || 0,
        forma_pagamento: l.forma_pagamento || null,
        status_pagamento: l.status_pagamento || "pendente",
        data_lancamento: l.data_lancamento || null,
      })
      .select("id")
      .single();
    if (error) throw error;
    mapLancamento.set(l.id, data.id);
  }

  for (const m of movimentacoes) {
    const { error } = await supabase.from("movimentacoes_estoque").insert({
      produto_id: m.produto_id != null ? mapProduto.get(m.produto_id) ?? null : null,
      quantidade: Number(m.quantidade) || 0,
      custo_unit: Number(m.custo_unit) || 0,
      preco_unit: Number(m.preco_unit) || 0,
      data: m.data || null,
      lancamento_id:
        m.lancamento_id != null ? mapLancamento.get(m.lancamento_id) ?? null : null,
    });
    if (error) throw error;
  }

  return {
    produtos: produtos.length,
    lancamentos: lancamentos.length,
    movimentacoes: movimentacoes.length,
  };
}
