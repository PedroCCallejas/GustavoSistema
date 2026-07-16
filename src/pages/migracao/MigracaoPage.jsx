import { useEffect, useState } from "react";
import { FiUploadCloud, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import {
  migrarDadosLocaisParaNuvem,
  nuvemJaTemDados,
} from "../../services/migracao";
import { confirmar } from "../../utils/dialogs";

function isTauri() {
  return typeof window !== "undefined" && !!window.__TAURI_INTERNALS__;
}

export default function MigracaoPage() {
  const [temDados, setTemDados] = useState(false);
  const [rodando, setRodando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");
  const noTauri = isTauri();

  useEffect(() => {
    nuvemJaTemDados()
      .then(setTemDados)
      .catch(() => {});
  }, []);

  const migrar = async () => {
    setErro("");
    if (temDados) {
      const ok = await confirmar(
        "A nuvem já tem dados. Migrar de novo pode duplicar registros. Deseja continuar mesmo assim?"
      );
      if (!ok) return;
    }
    setRodando(true);
    try {
      const r = await migrarDadosLocaisParaNuvem();
      setResultado(r);
      setTemDados(true);
    } catch (e) {
      setErro(e?.message || "Não foi possível migrar os dados.");
    } finally {
      setRodando(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">
        Migrar dados para a nuvem
      </h1>

      <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-600">
          Este botão envia os dados que estão salvos <strong>neste computador</strong>{" "}
          (fechamentos, produtos e movimentações) para a nuvem, de uma vez. Faça
          isso <strong>apenas uma vez</strong>, no computador que tem o histórico.
        </p>

        {!noTauri && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            <FiAlertTriangle className="mt-0.5 shrink-0" />
            <span>
              Abra esta tela pelo <strong>app instalado no computador</strong>. No
              navegador não há acesso ao banco local para migrar.
            </span>
          </div>
        )}

        {temDados && !resultado && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            <FiAlertTriangle className="mt-0.5 shrink-0" />
            <span>
              A nuvem já contém dados. Se migrar de novo, os registros podem
              duplicar.
            </span>
          </div>
        )}

        {erro && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{erro}</p>
        )}

        {resultado && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
            <FiCheckCircle className="mt-0.5 shrink-0" />
            <span>
              Migração concluída: {resultado.produtos} produto(s),{" "}
              {resultado.lancamentos} lançamento(s) e {resultado.movimentacoes}{" "}
              movimentação(ões) enviados para a nuvem.
            </span>
          </div>
        )}

        <button
          onClick={migrar}
          disabled={rodando || !noTauri}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiUploadCloud />
          {rodando ? "Enviando..." : "Enviar dados locais para a nuvem"}
        </button>
      </div>
    </div>
  );
}
