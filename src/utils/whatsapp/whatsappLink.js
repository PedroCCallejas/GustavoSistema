// Monta um link "wa.me" para abrir o WhatsApp (app ou web) ja com a
// mensagem pronta pro cliente. Nao usa nenhuma API paga: e so um link —
// o Gustavo confere e aperta enviar manualmente, sem custo nenhum.

function sanitizeTelefone(telefone = "") {
  const digits = String(telefone).replace(/\D/g, "");
  if (!digits) return "";

  // ja veio com o 55 (DDI Brasil) na frente
  if (digits.length >= 12 && digits.startsWith("55")) return digits;

  // DDD + numero (10 digitos fixo ou 11 celular) -> adiciona o 55
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;

  return digits;
}

export function montarLinkWhatsapp({ telefone, mensagem }) {
  const numero = sanitizeTelefone(telefone);
  if (!numero) return null;

  const texto = encodeURIComponent(mensagem || "");
  return `https://wa.me/${numero}?text=${texto}`;
}
