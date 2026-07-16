import { supabase } from "./supabase";

const CHAVE = "fila_fechamentos";

function ler() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE) || "[]");
  } catch {
    return [];
  }
}

function gravar(lista) {
  localStorage.setItem(CHAVE, JSON.stringify(lista));
  window.dispatchEvent(new Event("fila-alterada"));
}

export function contarPendentes() {
  return ler().length;
}

function novoId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Envia um fechamento ao servidor via a funcao atomica e idempotente.
async function enviar(registro) {
  const { error } = await supabase.rpc("sincronizar_fechamento", {
    p_lancamento_id: registro.lancamentoId,
    p_lancamento: registro.lancamento,
    p_itens: registro.itens,
  });
  if (error) throw error;
}

function enfileirar(registro) {
  const lista = ler();
  lista.push({ ...registro, criadoEm: new Date().toISOString() });
  gravar(lista);
}

// Salva o fechamento: envia agora se online; senao guarda na fila local.
export async function processarFechamento({ lancamento, itens }) {
  const registro = { lancamentoId: novoId(), lancamento, itens: itens || [] };

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    enfileirar(registro);
    return { modo: "offline" };
  }

  try {
    await enviar(registro);
    return { modo: "online" };
  } catch (erro) {
    // provavelmente sem conexao: guarda para sincronizar depois
    enfileirar(registro);
    return { modo: "offline", erro };
  }
}

// Tenta enviar todos os pendentes. Mantem na fila os que falharem.
export async function sincronizarPendentes() {
  const lista = ler();
  if (lista.length === 0) return { enviados: 0, restantes: 0 };

  let enviados = 0;
  const restantes = [];

  for (const registro of lista) {
    try {
      await enviar(registro);
      enviados++;
    } catch {
      restantes.push(registro);
    }
  }

  gravar(restantes);
  return { enviados, restantes: restantes.length };
}
