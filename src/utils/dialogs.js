import {
  confirm as tauriConfirm,
  message as tauriMessage,
} from "@tauri-apps/plugin-dialog";

function isTauri() {
  return typeof window !== "undefined" && !!window.__TAURI_INTERNALS__;
}

// Confirmacao que funciona no Tauri (dialogo nativo, assincrono) e no navegador.
export async function confirmar(mensagem, titulo = "Confirmação") {
  if (isTauri()) {
    return await tauriConfirm(mensagem, { title: titulo, kind: "warning" });
  }
  return window.confirm(mensagem);
}

export async function avisar(mensagem, titulo = "Aviso") {
  if (isTauri()) {
    await tauriMessage(mensagem, { title: titulo });
    return;
  }
  window.alert(mensagem);
}
