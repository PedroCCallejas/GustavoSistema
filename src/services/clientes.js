import { supabase } from "./supabase";

const CACHE_CLIENTES = "cache_clientes";
const CACHE_ANIMAIS = "cache_animais";

export async function listarClientes() {
  try {
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("nome", { ascending: true });
    if (error) throw error;
    const lista = data ?? [];
    try {
      localStorage.setItem(CACHE_CLIENTES, JSON.stringify(lista));
    } catch {
      // ignora
    }
    return lista;
  } catch (erro) {
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_CLIENTES) || "[]");
      if (Array.isArray(cache) && cache.length) return cache;
    } catch {
      // ignora
    }
    throw erro;
  }
}

export async function listarAnimais() {
  try {
    const { data, error } = await supabase
      .from("animais")
      .select("*, clientes(nome)")
      .order("nome", { ascending: true });
    if (error) throw error;
    const lista = (data ?? []).map((a) => ({ ...a, cliente_nome: a.clientes?.nome ?? null }));
    try {
      localStorage.setItem(CACHE_ANIMAIS, JSON.stringify(lista));
    } catch {
      // ignora
    }
    return lista;
  } catch (erro) {
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_ANIMAIS) || "[]");
      if (Array.isArray(cache) && cache.length) return cache;
    } catch {
      // ignora
    }
    throw erro;
  }
}

export async function criarCliente({ nome, telefone = "" }) {
  const { data, error } = await supabase
    .from("clientes")
    .insert({ nome: nome.trim(), telefone: telefone?.trim() || null })
    .select("id")
    .single();
  if (error) throw error;
  return data?.id ?? null;
}

export async function atualizarCliente(id, campos) {
  const { error } = await supabase.from("clientes").update(campos).eq("id", id);
  if (error) throw error;
}

export async function deletarCliente(id) {
  const { error } = await supabase.from("clientes").delete().eq("id", id);
  if (error) throw error;
}

export async function criarAnimal({ nome, clienteId, especie = "" }) {
  const { data, error } = await supabase
    .from("animais")
    .insert({ nome: nome.trim(), cliente_id: clienteId, especie: especie?.trim() || null })
    .select("id")
    .single();
  if (error) throw error;
  return data?.id ?? null;
}

export async function atualizarAnimal(id, campos) {
  const { error } = await supabase.from("animais").update(campos).eq("id", id);
  if (error) throw error;
}

export async function deletarAnimal(id) {
  const { error } = await supabase.from("animais").delete().eq("id", id);
  if (error) throw error;
}
