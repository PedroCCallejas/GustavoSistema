import { useCallback, useEffect, useState } from "react";
import { FiTrash2, FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";
import { getDB } from "../../services/db";
import { buildWhereClause } from "./financeiroFilters";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(date) {
  if (!date) return "-";
  const [year, month, day] = String(date).split("-");
  if (!year || !month || !day) return date;
  return `${day}/${month}/${year}`;
}

function getTipoStyle(tipo) {
  if (tipo === "entrada") {
    return {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      value: "text-emerald-700",
      icon: <FiArrowUpRight className="text-emerald-600" />,
      label: "Entrada",
    };
  }

  return {
    badge: "bg-red-50 text-red-700 border-red-200",
    value: "text-red-700",
    icon: <FiArrowDownRight className="text-red-600" />,
    label: "Saída",
  };
}

export default function LancamentoList({ refresh, filters }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const db = await getDB();
      const { where, params } = buildWhereClause(filters);

      const result = await db.select(
        `SELECT * FROM lancamentos ${where} ORDER BY data_lancamento DESC, id DESC`,
        params
      );

      setData(result);
    } catch (error) {
      console.error("Erro ao carregar lançamentos:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load, refresh]);

  const excluir = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir este lançamento?");
    if (!confirmar) return;

    try {
      const db = await getDB();
      await db.execute("DELETE FROM lancamentos WHERE id = ?", [id]);
      await load();
    } catch (error) {
      console.error("Erro ao excluir lançamento:", error);
      alert("Não foi possível excluir o lançamento.");
    }
  };

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-900">Lançamentos</h2>
        <p className="text-sm text-slate-500">
          Histórico de entradas e saídas cadastradas.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Carregando lançamentos...</p>
      ) : data.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="text-sm font-medium text-slate-600">
            Nenhum lançamento encontrado.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Ajuste os filtros ou cadastre um lançamento.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item) => {
            const tipoStyle = getTipoStyle(item.tipo);

            return (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{tipoStyle.icon}</div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-800">
                        {item.descricao || "Sem descrição"}
                      </p>

                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tipoStyle.badge}`}>
                        {tipoStyle.label}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500">
                      <span>{item.forma_pagamento || "-"}</span>
                      <span>{formatDate(item.data_lancamento)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 md:justify-end">
                  <span className={`text-base font-bold ${tipoStyle.value}`}>
                    {item.tipo === "saida" ? "- " : "+ "}
                    {formatCurrency(item.valor)}
                  </span>

                  <button
                    onClick={() => excluir(item.id)}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                  >
                    <FiTrash2 size={16} />
                    Excluir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}