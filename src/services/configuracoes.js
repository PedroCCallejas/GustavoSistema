import { supabase } from "./supabase";

const CACHE_CONFIG = "cache_configuracoes";

export const configPadrao = {
  nome: "Gustavo Miguel Monteiro de Andrade",
  subtitulo: "Médico Veterinário",
  crmv: "CRMV-MT 08415",
  logo_url: "",
  pix_chave: "+5565996910049",
  pix_favorecido: "Gustavo Miguel Monteiro de Andrade",
  pix_cidade: "CUIABA",
  pix_descricao: "Fechamento de atendimento",
  banco: "NUBANK",
  agencia: "0001",
  conta: "64462938-4",
};

// Busca a linha unica de configuracoes da marca. Usa cache local para
// funcionar offline (fechamento no campo sem internet).
export async function obterConfiguracoes() {
  try {
    const { data, error } = await supabase
      .from("configuracoes")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    const config = data || configPadrao;
    try {
      localStorage.setItem(CACHE_CONFIG, JSON.stringify(config));
    } catch {
      // ignora falha ao gravar cache
    }
    return config;
  } catch (erro) {
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_CONFIG) || "null");
      if (cache) return cache;
    } catch {
      // ignora
    }
    return configPadrao;
  }
}

export async function atualizarConfiguracoes(id, campos) {
  const { error } = await supabase.from("configuracoes").update(campos).eq("id", id);
  if (error) throw error;
}
