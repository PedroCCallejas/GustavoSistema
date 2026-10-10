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

// CPF valido pelos digitos verificadores. Necessario porque CPF e celular
// (DDD + 9 digitos) tem os dois 11 digitos -- sem essa checagem, um CPF
// virava "+55..." e o QR/copia e cola apontava pra um telefone inexistente.
function ehCpfValido(digits) {
  if (!/^\d{11}$/.test(digits) || /^(\d)\1{10}$/.test(digits)) return false;

  const dv = (len) => {
    let soma = 0;
    for (let i = 0; i < len; i++) soma += Number(digits[i]) * (len + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return dv(9) === Number(digits[9]) && dv(10) === Number(digits[10]);
}

function sanitizePixKey(chave = "") {
  const raw = String(chave).trim();

  // e-mail e chave aleatoria (tem letras): mantem como esta
  if (raw.includes("@") || /[a-z]/i.test(raw)) {
    return raw;
  }

  const digits = raw.replace(/\D/g, "");

  // digitado com "+" na frente: e telefone
  if (raw.startsWith("+")) {
    return `+${digits}`;
  }

  // 11 digitos: CPF (se os digitos verificadores baterem) ou DDD + celular.
  // CPF vai so com numeros, sem ponto/traco, como o Pix exige.
  if (digits.length === 11) {
    return ehCpfValido(digits) ? digits : `+55${digits}`;
  }

  // 13 digitos ja com 55: telefone
  if (digits.length === 13 && digits.startsWith("55")) {
    return `+${digits}`;
  }

  // 14 digitos: CNPJ, so numeros
  if (digits.length === 14) {
    return digits;
  }

  return raw;
}

function sanitizeTxid(txid = "***") {
  const clean = String(txid).trim();
  return clean || "***";
}

export function gerarPixCopiaECola({
  chave,
  nome,
  cidade,
  valor,
  txid = "***",
  descricao = "",
}) {
  const chaveLimpa = sanitizePixKey(chave);
  const nomeLimpo = removeAccents(nome || "").slice(0, 25);
  const cidadeLimpa = removeAccents(cidade || "").slice(0, 15);
  const txidLimpo = sanitizeTxid(txid).slice(0, 25);
  const descricaoLimpa = String(descricao || "").trim().slice(0, 50);

  const merchantAccountInfo =
    formatField("00", "BR.GOV.BCB.PIX") +
    formatField("01", chaveLimpa) +
    (descricaoLimpa ? formatField("02", descricaoLimpa) : "");

  const payload =
    formatField("00", "01") +
    formatField("01", "11") +
    formatField("26", merchantAccountInfo) +
    formatField("52", "0000") +
    formatField("53", "986") +
    (Number(valor) > 0 ? formatField("54", Number(valor).toFixed(2)) : "") +
    formatField("58", "BR") +
    formatField("59", nomeLimpo) +
    formatField("60", cidadeLimpa) +
    formatField("62", formatField("05", txidLimpo)) +
    "6304";

  const crc = crc16CCITT(payload);
  return payload + crc;
}