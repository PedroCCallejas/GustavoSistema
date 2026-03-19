import PrintInput from "./PrintInput";

export default function ClienteSection({ client, setClient }) {
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
            onChange={(e) =>
              setClient((prev) => ({ ...prev, name: e.target.value }))
            }
          />
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
            onChange={(e) =>
              setClient((prev) => ({ ...prev, animal: e.target.value }))
            }
          />
        </div>
      </div>
    </div>
  );
}