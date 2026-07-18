import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./Root";
import "./index.css";

// O app desktop (Tauri) nao precisa de service worker/PWA - isso e so para
// o site publicado (celular/navegador). Se o webview do Tauri registrou um
// antes, ele guarda os arquivos antigos em cache e a atualizacao nao aparece
// mesmo depois de reinstalar. Aqui a gente garante que fica desativado.
if (typeof window !== "undefined" && window.__TAURI_INTERNALS__) {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => reg.unregister());
    });
  }
  if (window.caches) {
    caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);