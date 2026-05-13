import { save, open } from "@tauri-apps/plugin-dialog";
import { writeTextFile, readTextFile } from "@tauri-apps/plugin-fs";
import { getDB } from "./db";

export async function exportarBackupFinanceiro() {
  const db = await getDB();

  const lancamentos = await db.select(
    "SELECT * FROM lancamentos ORDER BY id ASC"
  );

  const backup = {
    versao: 1,
    exportadoEm: new Date().toISOString(),
    lancamentos,
  };

  const filePath = await save({
    defaultPath: `backup-financeiro-${new Date().toISOString().slice(0, 10)}.json`,
    filters: [
      {
        name: "JSON",
        extensions: ["json"],
      },
    ],
  });

  if (!filePath) return false;

  await writeTextFile(filePath, JSON.stringify(backup, null, 2));
  return true;
}

export async function importarBackupFinanceiro() {
  const filePath = await open({
    multiple: false,
    directory: false,
    filters: [
      {
        name: "JSON",
        extensions: ["json"],
      },
    ],
  });

  if (!filePath || Array.isArray(filePath)) return false;

  const content = await readTextFile(filePath);
  const backup = JSON.parse(content);

  if (!backup?.lancamentos || !Array.isArray(backup.lancamentos)) {
    throw new Error("Arquivo de backup inválido.");
  }

  const db = await getDB();

  const confirmar = window.confirm(
    "Importar este backup vai adicionar os lançamentos ao banco atual. Deseja continuar?"
  );

  if (!confirmar) return false;

  for (const item of backup.lancamentos) {
    await db.execute(
      `INSERT INTO lancamentos (tipo, descricao, valor, forma_pagamento, status_pagamento, data_lancamento)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        item.tipo,
        item.descricao || "",
        Number(item.valor || 0),
        item.forma_pagamento || "",
        item.status_pagamento || "pendente",
        item.data_lancamento || "",
      ]
    );
  }

  return true;
}