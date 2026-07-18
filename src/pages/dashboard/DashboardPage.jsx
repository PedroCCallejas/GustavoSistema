import { useEffect, useMemo, useState } from "react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiAlertTriangle,
  FiPackage,
  FiDollarSign,
} from "react-icons/fi";
import { listarProdutos, listarMovimentacoes } from "../../services/produtos";

const money = (v) =>
  Number(v || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export default function DashboardPage() {
  const [produtos, setProdutos] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [filtroProduto, setFiltroProduto] = useState("");
  const [periodo, setPeriodo] = useState("todos");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [prods, movs] = await Promise.all([
          listarProdutos(),
          listarMovimentacoes(),
        ]);
        setProdutos(prods || []);
        setMovimentacoes(movs || []);
      } catch (error) {
        setErro(
          error?.message ||
            "Não foi possível carregar os dados. Abra pelo app (Tauri)."
        );
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  const produtosFiltrados = useMemo(
    () =>
      filtroProduto
        ? produtos.filter((p) => String(p.id) === filtroProduto)
        : produtos,
    [produtos, filtroProduto]
  );

  const dentroDoPeriodo = (dataStr) => {
    if (periodo === "todos" || !dataStr) return true;

    const hoje = new Date();
    const yyyy = hoje.getFullYear();
    const mm = String(hoje.getMonth() + 1).padStart(2, "0");

    if (periodo === "este-mes") {
      return dataStr.startsWith(`${yyyy}-${mm}`);
    }
    if (periodo === "mes-passado") {
      const prev = new Date(yyyy, hoje.getMonth() - 1, 1);
      const py = prev.getFullYear();
      const pm = String(prev.getMonth() + 1).padStart(2, "0");
      return dataStr.startsWith(`${py}-${pm}`);
    }
    if (periodo === "personalizado") {
      if (dataInicio && dataStr < dataInicio) return false;
      if (dataFim && dataStr > dataFim) return false;
      return true;
    }
    return true;
  };

  const movimentacoesFiltradas = useMemo(
    () =>
      movimentacoes.filter((m) => {
        if (filtroProduto && String(m.produto_id) !== filtroProduto) return false;
        if (!dentroDoPeriodo(m.data)) return false;
        return true;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [movimentacoes, filtroProduto, periodo, dataInicio, dataFim]
  );

  const resumo = useMemo(() => {
    const valorEstoque = produtosFiltrados.reduce(
      (acc, p) =>
        acc +
        (Number(p.quantidade) > 0
          ? Number(p.quantidade) * Number(p.custo_medio || 0)
          : 0),
      0
    );

    const receita = movimentacoesFiltradas.reduce(
      (acc, m) => acc + Number(m.preco_unit || 0) * Number(m.quantidade || 0),
      0
    );
    const custo = movimentacoesFiltradas.reduce(
      (acc, m) => acc + Number(m.custo_unit || 0) * Number(m.quantidade || 0),
      0
    );

    return { valorEstoque, receita, custo, margem: receita - custo };
  }, [produtosFiltrados, movimentacoesFiltradas]);

  const alertasPreco = useMemo(
    () =>
      produtosFiltrados
        .filter(
          (p) =>
            Number(p.custo_anterior) > 0 &&
            Number(p.custo_atual) > Number(p.custo_anterior)
        )
        .map((p) => ({
          ...p,
          variacao:
            ((Number(p.custo_atual) - Number(p.custo_anterior)) /
              Number(p.custo_anterior)) *
            100,
        }))
        .sort((a, b) => b.variacao - a.variacao),
    [produtosFiltrados]
  );

  const prejuizos = useMemo(
    () =>
      movimentacoesFiltradas
        .filter((m) => Number(m.preco_unit) < Number(m.custo_unit))
        .map((m) => ({
          ...m,
          perda:
            (Number(m.custo_unit) - Number(m.preco_unit)) *
            Number(m.quantidade || 0),
        })),
    [movimentacoesFiltradas]
  );

  const estoqueBaixo = useMemo(
    () => produtosFiltrados.filter((p) => Number(p.quantidade) <= 0),
    [produtosFiltrados]
  );

  if (carregando) {
    return <div className="p-6 text-slate-500">Carregando dashboard...</div>;
  }

  if (erro) {
    return (
      <div className="p-6">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
          {erro}
        </p>
      </div>
    );
  }

  const cards = [
    {
      label: "Valor em estoque",
      value: money(resumo.valorEstoque),
      icon: FiPackage,
      color: "text-slate-700",
    },
    {
      label: "Receita de produtos",
      value: money(resumo.receita),
      icon: FiDollarSign,
      color: "text-blue-600",
    },
    {
      label: "Custo dos produtos usados",
      value: money(resumo.custo),
      icon: FiTrendingDown,
      color: "text-slate-700",
    },
    {
      label: "Margem",
      value: money(resumo.margem),
      icon: FiTrendingUp,
      color: resumo.margem >= 0 ? "text-green-600" : "text-red-600",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Produto
            </label>
            <select
              value={filtroProduto}
              onChange={(e) => setFiltroProduto(e.target.value)}
              className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
            >
              <option value="">Todos os produtos</option>
              {produtos.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Período
            </label>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
            >
              <option value="todos">Todo o período</option>
              <option value="este-mes">Este mês</option>
              <option value="mes-passado">Mês passado</option>
              <option value="personalizado">Personalizado</option>
            </select>
          </div>

          {periodo === "personalizado" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
              <span className="text-xs text-slate-400">até</span>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Icon size={14} />
                {c.label}
              </div>
              <div className={`text-2xl font-bold ${c.color}`}>{c.value}</div>
            </div>
          );
        })}
      </div>

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800">
          <FiAlertTriangle className="text-amber-500" />
          Alertas de preço (custo subiu)
        </h2>
        {alertasPreco.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nenhum produto com aumento de custo registrado.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-2">Produto</th>
                  <th className="py-2 pr-2 text-right">Custo anterior</th>
                  <th className="py-2 pr-2 text-right">Custo atual</th>
                  <th className="py-2 pr-2 text-right">Variação</th>
                </tr>
              </thead>
              <tbody>
                {alertasPreco.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100">
                    <td className="py-2 pr-2 font-medium text-slate-800">
                      {p.nome}
                    </td>
                    <td className="py-2 pr-2 text-right font-mono">
                      {money(p.custo_anterior)}
                    </td>
                    <td className="py-2 pr-2 text-right font-mono">
                      {money(p.custo_atual)}
                    </td>
                    <td className="py-2 pr-2 text-right">
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                        +{p.variacao.toFixed(1)}% · reveja o preço
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800">
          <FiTrendingDown className="text-red-500" />
          Prejuízos (cobrou abaixo do custo)
        </h2>
        {prejuizos.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nenhum item vendido abaixo do custo. Bom trabalho!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-2">Produto</th>
                  <th className="py-2 pr-2 text-center">Qtd</th>
                  <th className="py-2 pr-2 text-right">Cobrado (un)</th>
                  <th className="py-2 pr-2 text-right">Custo (un)</th>
                  <th className="py-2 pr-2 text-right">Perda</th>
                </tr>
              </thead>
              <tbody>
                {prejuizos.map((m) => (
                  <tr key={m.id} className="border-b border-slate-100">
                    <td className="py-2 pr-2 font-medium text-slate-800">
                      {m.produto_nome || "-"}
                    </td>
                    <td className="py-2 pr-2 text-center">{m.quantidade}</td>
                    <td className="py-2 pr-2 text-right font-mono">
                      {money(m.preco_unit)}
                    </td>
                    <td className="py-2 pr-2 text-right font-mono">
                      {money(m.custo_unit)}
                    </td>
                    <td className="py-2 pr-2 text-right font-mono font-bold text-red-600">
                      -{money(m.perda)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800">
          <FiPackage className="text-slate-500" />
          Estoque zerado ou negativo
        </h2>
        {estoqueBaixo.length === 0 ? (
          <p className="text-sm text-slate-500">
            Todos os produtos com saldo positivo.
          </p>
        ) : (
          <ul className="space-y-1 text-sm">
            {estoqueBaixo.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between border-b border-slate-100 py-1"
              >
                <span className="font-medium text-slate-800">{p.nome}</span>
                <span className="font-mono text-red-600">
                  {Number(p.quantidade)} {p.unidade}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
