import { useState } from "react";
import { FiDollarSign, FiCalendar, FiFileText, FiSave } from "react-icons/fi";
import { getDB } from "../../services/db";

const initialForm = {
  tipo: "entrada",
  descricao: "",
  valor: "",
  forma: "pix",
  data: new Date().toISOString().slice(0, 10),
};

export default function LancamentoForm({ onSaved }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const salvar = async () => {
    try {
      if (!form.descricao.trim()) {
        alert("Informe a descrição.");
        return;
      }

      if (!form.valor || Number(form.valor) <= 0) {
        alert("Informe um valor válido.");
        return;
      }

      if (!form.data) {
        alert("Informe a data.");
        return;
      }

      setLoading(true);

      const db = await getDB();

      await db.execute(
        `INSERT INTO lancamentos (tipo, descricao, valor, forma_pagamento, data_lancamento)
         VALUES (?, ?, ?, ?, ?)`,
        [
          form.tipo,
          form.descricao.trim(),
          Number(form.valor),
          form.forma,
          form.data,
        ]
      );

      setForm(initialForm);
      onSaved?.();
    } catch (error) {
  console.error("Erro ao salvar lançamento:", error);
  alert(
    typeof error === "string"
      ? error
      : JSON.stringify(error, null, 2)
  );
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Novo lançamento</h2>
          <p className="text-sm text-slate-500">
            Cadastre entradas e saídas do financeiro.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Tipo
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
            value={form.tipo}
            onChange={(e) => handleChange("tipo", e.target.value)}
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
        </div>

        <div className="xl:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Descrição
          </label>
          <div className="flex items-center rounded-xl border border-slate-300 bg-white px-3">
            <FiFileText className="mr-2 text-slate-400" />
            <input
              className="w-full bg-transparent py-2.5 text-sm outline-none"
              placeholder="Ex: Atendimento clínico, compra de material..."
              value={form.descricao}
              onChange={(e) => handleChange("descricao", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Valor
          </label>
          <div className="flex items-center rounded-xl border border-slate-300 bg-white px-3">
            <FiDollarSign className="mr-2 text-slate-400" />
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full bg-transparent py-2.5 text-sm outline-none"
              placeholder="0,00"
              value={form.valor}
              onChange={(e) => handleChange("valor", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Data
          </label>
          <div className="flex items-center rounded-xl border border-slate-300 bg-white px-3">
            <FiCalendar className="mr-2 text-slate-400" />
            <input
              type="date"
              className="w-full bg-transparent py-2.5 text-sm outline-none"
              value={form.data}
              onChange={(e) => handleChange("data", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Forma de pagamento
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
            value={form.forma}
            onChange={(e) => handleChange("forma", e.target.value)}
          >
            <option value="pix">Pix</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="cartao">Cartão</option>
            <option value="transferencia">Transferência</option>
          </select>
        </div>

        <div className="flex items-end xl:col-span-3">
          <button
            onClick={salvar}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FiSave />
            {loading ? "Salvando..." : "Salvar lançamento"}
          </button>
        </div>
      </div>
    </div>
  );
}