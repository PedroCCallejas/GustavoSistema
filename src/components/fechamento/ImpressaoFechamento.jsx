import HeaderFechamento from "./HeaderFechamento";
import TotaisCard from "./TotaisCard";

const money = (v) =>
  Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formasPagamento = {
  pix: "PIX",
  dinheiro: "Dinheiro",
  cartao: "Cartão",
  transferencia: "Transferência",
};

// Vista de reimpressao: mostra o snapshot salvo de um fechamento antigo,
// sem campos editaveis.
export default function ImpressaoFechamento({ config, fechamento, logo }) {
  const materiais = fechamento.materiais || [];
  const servicos = fechamento.servicos || [];
  const pagamento = fechamento.pagamento || {};
  const dataFormatada = fechamento.data_atendimento
    ? new Date(`${fechamento.data_atendimento}T00:00:00`).toLocaleDateString("pt-BR")
    : "";

  return (
    <div className="printable-area relative rounded-2xl border border-slate-200 bg-white p-6 shadow">
      {logo && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 0 }}
        >
          <img
            src={logo}
            alt="Marca d'água"
            className="w-[70%] max-w-[520px] object-contain opacity-[0.05] grayscale"
          />
        </div>
      )}

      <div className="relative" style={{ zIndex: 10 }}>
        <HeaderFechamento
          logo={logo}
          nome={config.nome}
          subtitulo={config.subtitulo}
          crmv={config.crmv}
          tituloDocumento="Fechamento de Conta (2ª via)"
          data={dataFormatada}
        />

        <div className="avoid-break mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Proprietário
              </p>
              <p className="text-lg font-bold text-slate-800">
                {fechamento.cliente_nome || "-"}
              </p>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Data atendimento
              </p>
              <p className="text-lg font-bold text-slate-800">{dataFormatada}</p>
            </div>
            <div className="md:col-span-2">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Animal / Paciente
              </p>
              <p className="text-lg font-bold text-slate-800">
                {fechamento.animal_nome || "-"}
              </p>
            </div>
          </div>
        </div>

        {fechamento.relatorio && (
          <div className="avoid-break mt-6">
            <h3 className="mb-2 border-b border-slate-300 pb-1 text-xs font-bold uppercase tracking-wider text-slate-800">
              Relatório
            </h3>
            <div className="min-h-[60px] whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-3 text-sm leading-relaxed text-slate-700">
              {fechamento.relatorio}
            </div>
          </div>
        )}

        {materiais.length > 0 && (
          <div className="avoid-break mt-6">
            <h3 className="mb-2 border-b border-slate-300 pb-1 text-xs font-bold uppercase tracking-wider text-slate-800">
              Materiais
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-slate-500">
                  <th className="py-1 pr-2">Descrição</th>
                  <th className="py-1 pr-2 text-center">Qtd</th>
                  <th className="py-1 pr-2 text-right">Valor unit.</th>
                  <th className="py-1 pr-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {materiais.map((m, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-1 pr-2">{m.desc || "-"}</td>
                    <td className="py-1 pr-2 text-center">{m.qtd}</td>
                    <td className="py-1 pr-2 text-right font-mono">{money(m.price)}</td>
                    <td className="py-1 pr-2 text-right font-mono">
                      {money((Number(m.qtd) || 0) * (Number(m.price) || 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {servicos.length > 0 && (
          <div className="avoid-break mt-6">
            <h3 className="mb-2 border-b border-slate-300 pb-1 text-xs font-bold uppercase tracking-wider text-slate-800">
              Serviços
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-slate-500">
                  <th className="py-1 pr-2">Descrição</th>
                  <th className="py-1 pr-2">Data</th>
                  <th className="py-1 pr-2 text-center">Km</th>
                  <th className="py-1 pr-2 text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {servicos.map((s, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-1 pr-2">{s.desc || "-"}</td>
                    <td className="py-1 pr-2">{s.date || "-"}</td>
                    <td className="py-1 pr-2 text-center">{s.km || "-"}</td>
                    <td className="py-1 pr-2 text-right font-mono">{money(s.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8">
          <TotaisCard total={fechamento.total} />
        </div>

        <div className="avoid-break mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Forma de pagamento
          </p>
          <p className="mt-1 font-semibold text-slate-800">
            {formasPagamento[pagamento.method] || pagamento.method || "-"}
            {pagamento.status ? ` · ${pagamento.status}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
