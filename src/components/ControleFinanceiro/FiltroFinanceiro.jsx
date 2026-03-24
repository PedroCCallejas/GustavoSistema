export default function FiltroFinanceiro({ filters, setFilters }) {
  const updateFilter = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h2 className="text-base font-bold text-slate-900">Filtros</h2>
        <p className="text-sm text-slate-500">
          Refine os dados da lista e do resumo financeiro.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Buscar descrição
          </label>
          <input
            type="text"
            value={filters.busca}
            onChange={(e) => updateFilter("busca", e.target.value)}
            placeholder="Ex: atendimento"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Tipo
          </label>
          <select
            value={filters.tipo}
            onChange={(e) => updateFilter("tipo", e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
          >
            <option value="todos">Todos</option>
            <option value="entrada">Entradas</option>
            <option value="saida">Saídas</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Forma de pagamento
          </label>
          <select
            value={filters.formaPagamento}
            onChange={(e) => updateFilter("formaPagamento", e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
          >
            <option value="todos">Todos</option>
            <option value="pix">Pix</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="cartao">Cartão</option>
            <option value="transferencia">Transferência</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Período
          </label>
          <select
            value={filters.periodo}
            onChange={(e) => updateFilter("periodo", e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
          >
            <option value="todos">Todos</option>
            <option value="hoje">Hoje</option>
            <option value="este-mes">Este mês</option>
            <option value="mes-passado">Mês passado</option>
            <option value="personalizado">Personalizado</option>
          </select>
        </div>
      </div>

      {filters.periodo === "personalizado" && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Data inicial
            </label>
            <input
              type="date"
              value={filters.dataInicio}
              onChange={(e) => updateFilter("dataInicio", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Data final
            </label>
            <input
              type="date"
              value={filters.dataFim}
              onChange={(e) => updateFilter("dataFim", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}