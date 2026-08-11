import { useCallback, useEffect, useState } from "react";
import { FiPackage, FiPlus, FiRefreshCw, FiTrash2, FiSave, FiX, FiEdit2 } from "react-icons/fi";
import {
  listarProdutos,
  criarProduto,
  atualizarProduto,
  deletarProduto,
  repor,
} from "../../services/produtos";
import { confirmar } from "../../utils/dialogs";

const initialForm = {
  nome: "",
  quantidade: "",
  unidade: "un",
  custoTotal: "",
};

const initialReporForm = {
  quantidadeAdicionada: "",
  custoTotal: "",
};

// Divide o que foi pago no total pela quantidade, pra achar o custo por
// unidade (por ml, por un, etc) sem o Gustavo ter que fazer essa conta.
function custoPorUnidade(custoTotal, quantidade) {
  const total = Number(custoTotal) || 0;
  const qtd = Number(quantidade) || 0;
  if (qtd <= 0) return total;
  return total / qtd;
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function calcularVariacao(custoAnterior, custoAtual) {
  const anterior = Number(custoAnterior || 0);
  const atual = Number(custoAtual || 0);

  if (anterior <= 0) return null;

  return ((atual - anterior) / anterior) * 100;
}

export default function EstoquePage() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [salvando, setSalvando] = useState(false);
  const [reporId, setReporId] = useState(null);
  const [reporForm, setReporForm] = useState(initialReporForm);
  const [editandoId, setEditandoId] = useState(null);
  const [editForm, setEditForm] = useState({ nome: "", unidade: "un" });

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      const dados = await listarProdutos();
      setProdutos(dados);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const salvar = async () => {
    try {
      if (!form.nome.trim()) {
        alert("Informe o nome do produto.");
        return;
      }

      setSalvando(true);

      await criarProduto({
        nome: form.nome.trim(),
        quantidade: form.quantidade || 0,
        unidade: form.unidade || "un",
        custoAtual: custoPorUnidade(form.custoTotal, form.quantidade),
      });

      setForm(initialForm);
      await carregar();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Não foi possível salvar o produto.");
    } finally {
      setSalvando(false);
    }
  };

  const iniciarEdicao = (produto) => {
    setEditandoId(produto.id);
    setEditForm({ nome: produto.nome || "", unidade: produto.unidade || "un" });
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditForm({ nome: "", unidade: "un" });
  };

  const salvarEdicao = async (id) => {
    if (!editForm.nome.trim()) {
      alert("Informe o nome do produto.");
      return;
    }
    try {
      await atualizarProduto(id, {
        nome: editForm.nome.trim(),
        unidade: editForm.unidade.trim() || "un",
      });
      cancelarEdicao();
      await carregar();
    } catch (error) {
      console.error("Erro ao editar produto:", error);
      alert("Não foi possível editar o produto.");
    }
  };

  const excluir = async (id) => {
    const ok = await confirmar("Tem certeza que deseja excluir este produto?");
    if (!ok) return;

    try {
      await deletarProduto(id);
      await carregar();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Não foi possível excluir o produto.");
    }
  };

  const iniciarReposicao = (produto) => {
    setReporId(produto.id);
    setReporForm(initialReporForm);
  };

  const cancelarReposicao = () => {
    setReporId(null);
    setReporForm(initialReporForm);
  };

  const confirmarReposicao = async (id) => {
    try {
      if (!reporForm.quantidadeAdicionada || Number(reporForm.quantidadeAdicionada) <= 0) {
        alert("Informe uma quantidade válida.");
        return;
      }

      if (reporForm.custoTotal === "" || Number(reporForm.custoTotal) < 0) {
        alert("Informe quanto você pagou nessa compra.");
        return;
      }

      const novoCusto = custoPorUnidade(
        reporForm.custoTotal,
        reporForm.quantidadeAdicionada
      );

      await repor(id, Number(reporForm.quantidadeAdicionada), novoCusto);

      cancelarReposicao();
      await carregar();
    } catch (error) {
      console.error("Erro ao repor produto:", error);
      alert("Não foi possível repor o produto.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Estoque</h1>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900">Novo produto</h2>
          <p className="text-sm text-slate-500">Cadastre um produto no estoque.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="xl:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Nome
            </label>
            <input
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
              placeholder="Ex: Ferradura, casco de resina..."
              value={form.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Quantidade
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
              placeholder="0"
              value={form.quantidade}
              onChange={(e) => handleChange("quantidade", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Unidade
            </label>
            <input
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
              placeholder="un, kg, caixa..."
              value={form.unidade}
              onChange={(e) => handleChange("unidade", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Quanto você pagou no total
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
              placeholder="0,00"
              value={form.custoTotal}
              onChange={(e) => handleChange("custoTotal", e.target.value)}
            />
            {form.custoTotal && form.quantidade ? (
              <p className="mt-1 text-xs text-slate-400">
                ≈ {formatCurrency(custoPorUnidade(form.custoTotal, form.quantidade))} por{" "}
                {form.unidade || "un"}
              </p>
            ) : null}
          </div>

          <div className="flex items-end xl:col-span-4">
            <button
              onClick={salvar}
              disabled={salvando}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <FiPlus />
              {salvando ? "Salvando..." : "Cadastrar produto"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900">Produtos</h2>
          <p className="text-sm text-slate-500">Itens cadastrados no estoque.</p>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Carregando produtos...</p>
        ) : produtos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <p className="text-sm font-medium text-slate-600">
              Nenhum produto cadastrado.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Use o formulário acima para cadastrar o primeiro produto.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {produtos.map((produto) => {
              const variacao = calcularVariacao(produto.custo_anterior, produto.custo_atual);
              const isRepondo = reporId === produto.id;
              const isEditando = editandoId === produto.id;

              return (
                <div
                  key={produto.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100"
                >
                  {isEditando ? (
                    <div className="flex flex-col flex-wrap items-stretch gap-2 sm:flex-row sm:items-end">
                      <div className="flex-1">
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Nome
                        </label>
                        <input
                          type="text"
                          value={editForm.nome}
                          onChange={(e) =>
                            setEditForm((p) => ({ ...p, nome: e.target.value }))
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                        />
                      </div>
                      <div className="sm:w-32">
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Unidade
                        </label>
                        <input
                          type="text"
                          value={editForm.unidade}
                          onChange={(e) =>
                            setEditForm((p) => ({ ...p, unidade: e.target.value }))
                          }
                          placeholder="un, ml, kg..."
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => salvarEdicao(produto.id)}
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          <FiSave size={16} /> Salvar
                        </button>
                        <button
                          onClick={cancelarEdicao}
                          className="inline-flex items-center gap-2 rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300"
                        >
                          <FiX size={16} /> Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <FiPackage className="text-slate-500" />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">{produto.nome}</p>

                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                            <span>
                              {produto.quantidade} {produto.unidade}
                            </span>
                            <span>Anterior: {formatCurrency(produto.custo_anterior)}</span>
                            <span>Atual: {formatCurrency(produto.custo_atual)}</span>
                            <span className="font-semibold text-slate-700">Média: {formatCurrency(produto.custo_medio)}</span>
                            {variacao !== null && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                  variacao > 0
                                    ? "bg-red-50 text-red-700"
                                    : variacao < 0
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {variacao > 0 ? "+" : ""}
                                {variacao.toFixed(1)}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 md:justify-end">
                        <button
                          onClick={() => iniciarEdicao(produto)}
                          className="inline-flex items-center gap-2 rounded-lg bg-slate-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                        >
                          <FiEdit2 size={16} />
                          Editar
                        </button>

                        <button
                          onClick={() => iniciarReposicao(produto)}
                          className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                        >
                          <FiRefreshCw size={16} />
                          Repor
                        </button>

                        <button
                          onClick={() => excluir(produto.id)}
                          className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                        >
                          <FiTrash2 size={16} />
                          Excluir
                        </button>
                      </div>
                    </div>
                  )}

                  {isRepondo && (
                    <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2 xl:grid-cols-4">
                      <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Quantidade a adicionar
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={reporForm.quantidadeAdicionada}
                          onChange={(e) =>
                            setReporForm((prev) => ({
                              ...prev,
                              quantidadeAdicionada: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Quanto pagou nessa compra (total)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={reporForm.custoTotal}
                          onChange={(e) =>
                            setReporForm((prev) => ({
                              ...prev,
                              custoTotal: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                        />
                        {reporForm.custoTotal && reporForm.quantidadeAdicionada ? (
                          <p className="mt-1 text-xs text-slate-400">
                            ≈{" "}
                            {formatCurrency(
                              custoPorUnidade(
                                reporForm.custoTotal,
                                reporForm.quantidadeAdicionada
                              )
                            )}{" "}
                            por {produto.unidade || "un"}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex items-end gap-2 xl:col-span-2">
                        <button
                          onClick={() => confirmarReposicao(produto.id)}
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          <FiSave size={16} />
                          Confirmar reposição
                        </button>

                        <button
                          onClick={cancelarReposicao}
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
    </div>
  );
}
