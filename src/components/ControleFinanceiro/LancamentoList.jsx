import { useCallback, useEffect, useState } from "react";
import {
  FiTrash2,
  FiArrowUpRight,
  FiArrowDownRight,
  FiEdit2,
  FiSave,
  FiX,
} from "react-icons/fi";
import {
  listarLancamentos,
  atualizarLancamento,
  alternarStatusLancamento,
  excluirLancamento,
} from "../../services/lancamentos";
import { confirmar } from "../../utils/dialogs";

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
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    descricao: "",
    valor: "",
    forma_pagamento: "pix",
    status_pagamento: "pendente",
    data_lancamento: "",
  });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const result = await listarLancamentos(filters);
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
    const ok = await confirmar(
      "Tem certeza que deseja excluir este lançamento? As unidades usadas voltarão ao estoque."
    );
    if (!ok) return;

    try {
      await excluirLancamento(id);
      await load();
    } catch (error) {
      console.error("Erro ao excluir lançamento:", error);
      alert("Não foi possível excluir o lançamento.");
    }
  };

  const iniciarEdicao = (item) => {
    setEditingId(item.id);
    setEditForm({
      descricao: item.descricao || "",
      valor: item.valor ?? "",
      forma_pagamento: item.forma_pagamento || "pix",
      status_pagamento: item.status_pagamento || "pendente",
      data_lancamento: item.data_lancamento || "",
    });
  };

  const cancelarEdicao = () => {
    setEditingId(null);
    setEditForm({
      descricao: "",
      valor: "",
      forma_pagamento: "pix",
      status_pagamento: "pendente",
      data_lancamento: "",
    });
  };

  const salvarEdicao = async (id) => {
    try {
      if (!editForm.descricao.trim()) {
        alert("Informe a descrição.");
        return;
      }

      if (!editForm.valor || Number(editForm.valor) <= 0) {
        alert("Informe um valor válido.");
        return;
      }

      if (!editForm.data_lancamento) {
        alert("Informe a data.");
        return;
      }

      await atualizarLancamento(id, {
        descricao: editForm.descricao.trim(),
        valor: Number(editForm.valor),
        forma_pagamento: editForm.forma_pagamento,
        status_pagamento: editForm.status_pagamento,
        data_lancamento: editForm.data_lancamento,
      });

      cancelarEdicao();
      await load();
    } catch (error) {
      console.error("Erro ao editar lançamento:", error);
      alert("Não foi possível editar o lançamento.");
    }
  };

  const alternarStatus = async (item) => {
    try {
      await alternarStatusLancamento(item.id, item.status_pagamento);
      await load();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      alert("Não foi possível alterar o status.");
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
            const isEditing = editingId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{tipoStyle.icon}</div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-800">
                          {item.descricao || "Sem descrição"}
                        </p>

                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tipoStyle.badge}`}
                        >
                          {tipoStyle.label}
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                        <span>{item.forma_pagamento || "-"}</span>
                        <span>{formatDate(item.data_lancamento)}</span>

                        <button
                          onClick={() => alternarStatus(item)}
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold transition ${
                            item.status_pagamento === "pago"
                              ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                              : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                          }`}
                        >
                          {item.status_pagamento === "pago" ? "Pago" : "Pendente"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 md:justify-end">
                    <span className={`text-base font-bold ${tipoStyle.value}`}>
                      {item.tipo === "saida" ? "- " : "+ "}
                      {formatCurrency(item.valor)}
                    </span>

                    <button
                      onClick={() => iniciarEdicao(item)}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                      <FiEdit2 size={16} />
                      Editar
                    </button>

                    <button
                      onClick={() => excluir(item.id)}
                      className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                    >
                      <FiTrash2 size={16} />
                      Excluir
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2 xl:grid-cols-5">
                    <div className="xl:col-span-2">
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Descrição
                      </label>
                      <input
                        type="text"
                        value={editForm.descricao}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            descricao: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Valor
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editForm.valor}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            valor: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Data
                      </label>
                      <input
                        type="date"
                        value={editForm.data_lancamento}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            data_lancamento: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Forma
                      </label>
                      <select
                        value={editForm.forma_pagamento}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            forma_pagamento: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                      >
                        <option value="pix">Pix</option>
                        <option value="dinheiro">Dinheiro</option>
                        <option value="cartao">Cartão</option>
                        <option value="transferencia">Transferência</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </label>
                      <select
                        value={editForm.status_pagamento}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            status_pagamento: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                      >
                        <option value="pendente">Pendente</option>
                        <option value="pago">Pago</option>
                      </select>
                    </div>

                    <div className="flex items-end gap-2 xl:col-span-5">
                      <button
                        onClick={() => salvarEdicao(item.id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        <FiSave size={16} />
                        Salvar edição
                      </button>

                      <button
                        onClick={cancelarEdicao}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
                      >
                        <FiX size={16} />
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}