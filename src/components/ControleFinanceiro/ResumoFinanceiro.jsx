import { useEffect, useState } from "react";
import { FiArrowUpRight, FiArrowDownRight, FiDollarSign } from "react-icons/fi";
import { resumoLancamentos } from "../../services/lancamentos";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function ResumoFinanceiro({ refresh, filters }) {
  const [entrada, setEntrada] = useState(0);
  const [saida, setSaida] = useState(0);

  useEffect(() => {
    async function loadResumo() {
      try {
        const { entrada, saida } = await resumoLancamentos(filters);
        setEntrada(entrada);
        setSaida(saida);
      } catch (error) {
        console.error("Erro ao carregar resumo:", error);
      }
    }

    loadResumo();
  }, [refresh, filters]);

  const saldo = entrada - saida;

  return (
    <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <FiArrowUpRight className="text-green-600" />
          Entradas
        </div>
        <p className="mt-2 text-xl font-bold text-green-600">
          {formatCurrency(entrada)}
        </p>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <FiArrowDownRight className="text-red-600" />
          Saídas
        </div>
        <p className="mt-2 text-xl font-bold text-red-600">
          {formatCurrency(saida)}
        </p>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <FiDollarSign className="text-blue-600" />
          Saldo
        </div>
        <p className={`mt-2 text-xl font-bold ${saldo >= 0 ? "text-blue-600" : "text-red-600"}`}>
          {formatCurrency(saldo)}
        </p>
      </div>
    </div>
  );
}