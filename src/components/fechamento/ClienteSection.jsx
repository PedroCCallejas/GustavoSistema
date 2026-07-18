import { useMemo } from "react";
import { Link } from "react-router-dom";
import PrintInput from "./PrintInput";

export default function ClienteSection({ client, setClient, clientes = [], animais = [] }) {
  const animaisDoCliente = useMemo(() => {
    const nomeCliente = client.name?.trim().toLowerCase();
    if (!nomeCliente) return animais;
    return animais.filter((a) => a.cliente_nome?.trim().toLowerCase() === nomeCliente);
  }, [animais, client.name]);

  const animalSelecionado = useMemo(() => {
    const nomeAnimal = client.animal?.trim().toLowerCase();
    if (!nomeAnimal) return null;
    return animaisDoCliente.find((a) => a.nome?.trim().toLowerCase() === nomeAnimal) || null;
  }, [animaisDoCliente, client.animal]);

  return (
    <div className="avoid-break mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5 print:break-inside-avoid">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Proprietário
          </label>
          <PrintInput
            className="border-b border-slate-300 bg-transparent py-1 text-lg font-bold text-slate-800 outline-none"
            placeholder="Nome do cliente..."
            value={client.name}
            list="lista-clientes"
            onChange={(e) =>
              setClient((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <datalist id="lista-clientes">
            {clientes.map((c) => (
              <option key={c.id} value={c.nome} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Data atendimento
          </label>
          <PrintInput
            className="border-b border-slate-300 bg-transparent py-1 text-lg font-bold text-slate-800 outline-none"
            placeholder="Ex: Março/2026"
            value={client.ref}
            onChange={(e) =>
              setClient((prev) => ({ ...prev, ref: e.target.value }))
            }
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Animal / Paciente
          </label>
          <PrintInput
            className="border-b border-slate-300 bg-transparent py-1 text-lg font-bold text-slate-800 outline-none"
            placeholder="Nome do cavalo..."
            value={client.animal}
            list="lista-animais"
            onChange={(e) =>
              setClient((prev) => ({ ...prev, animal: e.target.value }))
            }
          />
          <datalist id="lista-animais">
            {animaisDoCliente.map((a) => (
              <option key={a.id} value={a.nome} />
            ))}
          </datalist>

          {animalSelecionado && (
            <Link
              to={`/historico?animalId=${animalSelecionado.id}`}
              className="no-print mt-1 inline-block text-xs font-medium text-blue-600 hover:underline"
            >
              Ver histórico de atendimentos deste animal
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
