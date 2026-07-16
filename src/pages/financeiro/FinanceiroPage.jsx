import { useState } from "react";
import LancamentoForm from "../../components/ControleFinanceiro/LancamentosForm";
import LancamentoList from "../../components/ControleFinanceiro/LancamentoList";
import ResumoFinanceiro from "../../components/ControleFinanceiro/ResumoFinanceiro";
import FiltroFinanceiro from "../../components/ControleFinanceiro/FiltroFinanceiro";

import {
  exportarBackupFinanceiro,
  importarBackupFinanceiro,
} from "../../services/backup";

function isTauri() {
  return typeof window !== "undefined" && !!window.__TAURI_INTERNALS__;
}

export default function FinanceiroPage() {
  const [refresh, setRefresh] = useState(0);

  const [filters, setFilters] = useState({
    busca: "",
    tipo: "todos",
    formaPagamento: "todos",
    statusPagamento: "todos",
    periodo: "todos",
    dataInicio: "",
    dataFim: "",
  });

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Financeiro</h1>

      {/* Backup em arquivo so faz sentido no app do PC (banco local). */}
      {isTauri() && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={async () => {
              try {
                const ok = await exportarBackupFinanceiro();
                if (ok) alert("Backup exportado com sucesso.");
              } catch (error) {
                console.error(error);
                alert("Não foi possível exportar o backup.");
              }
            }}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Exportar Backup
          </button>

          <button
            onClick={async () => {
              try {
                const ok = await importarBackupFinanceiro();
                if (ok) {
                  alert("Backup importado com sucesso.");
                  setRefresh((r) => r + 1);
                }
              } catch (error) {
                console.error(error);
                alert(error?.message || "Não foi possível importar o backup.");
              }
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Importar Backup
          </button>
        </div>
      )}

      <ResumoFinanceiro refresh={refresh} filters={filters} />

      <FiltroFinanceiro filters={filters} setFilters={setFilters} />

      <LancamentoForm onSaved={() => setRefresh((r) => r + 1)} />

      <LancamentoList refresh={refresh} filters={filters} />
    </div>
  );
}
