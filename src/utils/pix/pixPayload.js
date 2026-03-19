import { crc16CCITT } from "./crc16";

function formatField(id, value) {
  const size = String(value.length).padStart(2, "0");
  return `${id}${size}${value}`;
}

function removeAccents(text = "") {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

export function gerarPixCopiaECola({
  chave,
  nome,
  cidade,
  valor,
  txid = "***",
  descricao = "",
}) {
  const chaveLimpa = String(chave || "").trim();
  const nomeLimpo = removeAccents(nome || "").slice(0, 25);
  const cidadeLimpa = removeAccents(cidade || "").slice(0, 15);
  const txidLimpo = String(txid || "***").slice(0, 25);
  const descricaoLimpa = String(descricao || "").slice(0, 50);

  const merchantAccountInfo =
    formatField("00", "BR.GOV.BCB.PIX") +
    formatField("01", chaveLimpa) +
    (descricaoLimpa ? formatField("02", descricaoLimpa) : "");

  const payload =
    formatField("00", "01") +
    formatField("01", "12") +
    formatField("26", merchantAccountInfo) +
    formatField("52", "0000") +
    formatField("53", "986") +
    (valor ? formatField("54", Number(valor).toFixed(2)) : "") +
    formatField("58", "BR") +
    formatField("59", nomeLimpo) +
    formatField("60", cidadeLimpa) +
    formatField("62", formatField("05", txidLimpo)) +
    "6304";

  const crc = crc16CCITT(payload);

  return payload + crc;
}