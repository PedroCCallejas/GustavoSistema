import { supabase } from "./supabase";

// Lista o historico de fechamentos (snapshot completo) com filtros simples.
export async function listarFechamentos({ busca = "", clienteId = "", animalId = "" } = {}) {
  let query = supabase
    .from("fechamentos")
    .select("*")
    .order("data_atendimento", { ascending: false })
    .order("created_at", { ascending: false });

  if (clienteId) query = query.eq("cliente_id", clienteId);
  if (animalId) query = query.eq("animal_id", animalId);
  if (busca.trim()) {
    const termo = busca.trim();
    query = query.or(`cliente_nome.ilike.%${termo}%,animal_nome.ilike.%${termo}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function obterFechamento(id) {
  const { data, error } = await supabase.from("fechamentos").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}
