import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import {
  listarClientes,
  listarAnimais,
  criarCliente,
  deletarCliente,
  criarAnimal,
  deletarAnimal,
} from "../../services/clientes";
import { confirmar } from "../../utils/dialogs";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [animais, setAnimais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [novoCliente, setNovoCliente] = useState({ nome: "", telefone: "" });
  const [novoAnimal, setNovoAnimal] = useState({});

  const carregar = async () => {
    setCarregando(true);
    try {
      const [c, a] = await Promise.all([listarClientes(), listarAnimais()]);
      setClientes(c || []);
      setAnimais(a || []);
    } catch (error) {
      setErro(error?.message || "Não foi possível carregar os clientes.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const animaisPorCliente = useMemo(() => {
    const mapa = {};
    for (const a of animais) {
      if (!mapa[a.cliente_id]) mapa[a.cliente_id] = [];
      mapa[a.cliente_id].push(a);
    }
    return mapa;
  }, [animais]);

  const adicionarCliente = async (e) => {
    e.preventDefault();
    if (!novoCliente.nome.trim()) return;
    try {
      await criarCliente(novoCliente);
      setNovoCliente({ nome: "", telefone: "" });
      carregar();
    } catch (error) {
      setErro(error?.message || "Não foi possível cadastrar o cliente.");
    }
  };

  const removerCliente = async (cliente) => {
    const ok = await confirmar(
      `Excluir ${cliente.nome}? Os animais dele também serão removidos. O histórico de fechamentos já feitos é mantido.`
    );
    if (!ok) return;
    try {
      await deletarCliente(cliente.id);
      carregar();
    } catch (error) {
      setErro(error?.message || "Não foi possível excluir o cliente.");
    }
  };

  const adicionarAnimal = async (clienteId, e) => {
    e.preventDefault();
    const nome = novoAnimal[clienteId]?.trim();
    if (!nome) return;
    try {
      await criarAnimal({ nome, clienteId });
      setNovoAnimal((prev) => ({ ...prev, [clienteId]: "" }));
      carregar();
    } catch (error) {
      setErro(error?.message || "Não foi possível cadastrar o animal.");
    }
  };

  const removerAnimal = async (animal) => {
    const ok = await confirmar(`Excluir ${animal.nome}? O histórico de fechamentos é mantido.`);
    if (!ok) return;
    try {
      await deletarAnimal(animal.id);
      carregar();
    } catch (error) {
      setErro(error?.message || "Não foi possível excluir o animal.");
    }
  };

  if (carregando) {
    return <div className="p-6 text-slate-500">Carregando clientes...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Clientes e Animais</h1>
      <p className="mb-6 text-sm text-slate-500">
        Cadastrados automaticamente a cada fechamento, ou manualmente aqui. Aparecem como sugestão
        ao preencher o fechamento.
      </p>

      {erro && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{erro}</p>
      )}

      <form
        onSubmit={adicionarCliente}
        className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Novo cliente
          </label>
          <input
            type="text"
            value={novoCliente.nome}
            onChange={(e) => setNovoCliente((p) => ({ ...p, nome: e.target.value }))}
            placeholder="Nome"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Telefone (opcional)
          </label>
          <input
            type="text"
            value={novoCliente.telefone}
            onChange={(e) => setNovoCliente((p) => ({ ...p, telefone: e.target.value }))}
            placeholder="(65) 90000-0000"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-500"
        >
          <FiPlus /> Adicionar
        </button>
      </form>

      {clientes.length === 0 ? (
        <p className="text-sm text-slate-500">Nenhum cliente cadastrado ainda.</p>
      ) : (
        <div className="space-y-4">
          {clientes.map((c) => (
            <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">{c.nome}</p>
                  {c.telefone && <p className="text-xs text-slate-500">{c.telefone}</p>}
                </div>
                <button
                  onClick={() => removerCliente(c)}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                  aria-label="Excluir cliente"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>

              <ul className="mb-2 space-y-1">
                {(animaisPorCliente[c.id] || []).map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-sm"
                  >
                    <span className="text-slate-700">{a.nome}</span>
                    <button
                      onClick={() => removerAnimal(a)}
                      className="text-red-600 hover:underline"
                    >
                      Excluir
                    </button>
                  </li>
                ))}
                {(animaisPorCliente[c.id] || []).length === 0 && (
                  <li className="text-xs text-slate-400">Nenhum animal cadastrado.</li>
                )}
              </ul>

              <form
                onSubmit={(e) => adicionarAnimal(c.id, e)}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={novoAnimal[c.id] || ""}
                  onChange={(e) =>
                    setNovoAnimal((prev) => ({ ...prev, [c.id]: e.target.value }))
                  }
                  placeholder="Nome do animal"
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-slate-500"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
                >
                  Adicionar animal
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
