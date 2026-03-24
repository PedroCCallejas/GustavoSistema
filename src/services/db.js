import Database from "@tauri-apps/plugin-sql";

let dbInstance = null;

function isTauriRunning() {
  return typeof window !== "undefined" && !!window.__TAURI_INTERNALS__;
}

export async function getDB() {
  if (!isTauriRunning()) {
    throw new Error(
      "O banco SQLite só funciona dentro do app Tauri. Abra com 'npm run tauri dev'."
    );
  }

  if (!dbInstance) {
    dbInstance = await Database.load("sqlite:financeiro.db");
  }

  return dbInstance;
}