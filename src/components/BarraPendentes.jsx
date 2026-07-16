import { useEffect, useState } from "react";
import { FiCloud, FiUploadCloud } from "react-icons/fi";
import { contarPendentes, sincronizarPendentes } from "../services/filaOffline";

export default function BarraPendentes() {
  const [pendentes, setPendentes] = useState(0);
  const [online, setOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [sincronizando, setSincronizando] = useState(false);

  const atualizar = () => setPendentes(contarPendentes());

  const sincronizar = async () => {
    setSincronizando(true);
    try {
      await sincronizarPendentes();
    } finally {
      setSincronizando(false);
      atualizar();
    }
  };

  useEffect(() => {
    atualizar();
    const onOnline = () => {
      setOnline(true);
      sincronizar();
    };
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    window.addEventListener("fila-alterada", atualizar);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("fila-alterada", atualizar);
    };
  }, []);

  if (pendentes === 0 && online) return null;

  return (
    <div
      className={`no-print px-4 py-2 text-sm ${
        online ? "bg-amber-50 text-amber-800" : "bg-slate-200 text-slate-700"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        <span className="flex items-center gap-2">
          <FiCloud />
          {!online && "Sem internet — os fechamentos ficam salvos no aparelho. "}
          {pendentes > 0 &&
            `${pendentes} fechamento(s) aguardando sincronização.`}
        </span>
        {pendentes > 0 && online && (
          <button
            onClick={sincronizar}
            disabled={sincronizando}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            <FiUploadCloud size={14} />
            {sincronizando ? "Sincronizando..." : "Sincronizar agora"}
          </button>
        )}
      </div>
    </div>
  );
}
