import { useState } from "react";
import LancamentoForm from "../../components/ControleFinanceiro/LancamentosForm";
import LancamentoList from "../../components/ControleFinanceiro/LancamentoList";
import ResumoFinanceiro from "../../components/ControleFinanceiro/ResumoFinanceiro";
import FiltroFinanceiro from "../../components/ControleFinanceiro/FiltroFinanceiro";

export default function FinanceiroPage() {
  const [refresh, setRefresh] = useState(0);

  const [filters, setFilters] = useState({
    busca: "",
    tipo: "todos",
    formaPagamento: "todos",
    periodo: "todos",
    dataInicio: "",
    dataFim: "",
  });

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Financeiro</h1>

      <ResumoFinanceiro refresh={refresh} filters={filters} />

      <FiltroFinanceiro filters={filters} setFilters={setFilters} />

      <LancamentoForm onSaved={() => setRefresh((r) => r + 1)} />

      <LancamentoList refresh={refresh} filters={filters} />
    </div>
  );
}