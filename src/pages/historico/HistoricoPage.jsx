import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiPrinter, FiSearch } from "react-icons/fi";
import { listarFechamentos } from "../../services/fechamentos";
import { obterConfiguracoes, configPadrao } from "../../services/configuracoes";
import logoPadrao from "../../assets/LogoGustavo.png";
import ImpressaoFechamento from "../../components/fechamento/ImpressaoFechamento";
import "../Fechamento/fechamento.print.css";

const money = (v) =>
  Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function HistoricoPage() {
  const [searchParams] = useSearchParams();
  const animalId = searchParams.get("animalId") || "";

  const [fechamentos, setFechamentos] = useState([]);
  const [config, setConfig] = useState(configPadrao);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [selecionado, setSelecionado] = useState(null);

  // Imprime a propria pagina direto (nao um iframe clonado -- no celular,
  // esse metodo antigo as vezes nao copiava o CSS certo, e o PDF saia com
  // os campos duplicados e os controles editaveis aparecendo).
  const imprimir = () => window.print();

  // No celular, o nome sugerido pro arquivo PDF vem do titulo da pagina.
  // Mantemos sincronizado o tempo todo (nao so no instante de imprimir),
  // porque o menu de salvar/compartilhar do celular abre de forma
  // assincrona e um "trocar e ja restaurar" chega tarde demais.
  useEffect(() => {
    const nome = selecionado?.cliente_nome?.trim();
    document.title = nome ? `fechamento-${nome}` : "Fechamento Gustavo";

    return () => {
      document.title = "Fechamento Gustavo";
    };
  }, [selecionado]);

  const carregar = async (filtros) => {
    setCarregando(true);
    try {
      const [lista, cfg] = await Promise.all([
        listarFechamentos(filtros),
        obterConfiguracoes(),
      ]);
      setFechamentos(lista || []);
      setConfig(cfg);
    } catch (error) {
      setErro(error?.message || "Não foi possível carregar o histórico.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar({ animalId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animalId]);

  const buscar = (e) => {
    e.preventDefault();
    carregar({ busca, animalId });
  };

  const logoParaImpressao = useMemo(() => config.logo_url || logoPadrao, [config]);

  const reimprimir = async (fechamento) => {
    setSelecionado(fechamento);
    // aguarda o proximo ciclo para o ImpressaoFechamento montar com os dados
    // certos e o titulo da pagina (useEffect acima) atualizar antes de imprimir
    setTimeout(() => imprimir?.(), 50);
  };

  return (
    <div className="p-6">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Histórico de Fechamentos</h1>
      <p className="mb-6 text-sm text-slate-500">
        Busque por cliente ou animal e reimprima um atendimento antigo.
      </p>

      <form onSubmit={buscar} className="no-print mb-6 flex flex-wrap gap-2">
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por cliente ou animal..."
          className="min-w-[240px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          <FiSearch /> Buscar
        </button>
      </form>

      {erro && <p className="no-print mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{erro}</p>}

      {carregando ? (
        <p className="no-print text-sm text-slate-500">Carregando...</p>
      ) : fechamentos.length === 0 ? (
        <p className="no-print text-sm text-slate-500">Nenhum fechamento encontrado.</p>
      ) : (
        <div className="no-print overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Animal</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {fechamentos.map((f) => (
                <tr key={f.id} className="border-b border-slate-100">
                  <td className="px-4 py-3">
                    {f.data_atendimento
                      ? new Date(`${f.data_atendimento}T00:00:00`).toLocaleDateString("pt-BR")
                      : "-"}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {f.cliente_nome || "-"}
                  </td>
                  <td className="px-4 py-3">{f.animal_nome || "-"}</td>
                  <td className="px-4 py-3 text-right font-mono">{money(f.total)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => reimprimir(f)}
                      className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      <FiPrinter size={14} /> Reimprimir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Area de impressao, escondida na tela normal e visivel so ao imprimir */}
      <div className="only-print">
        {selecionado && (
          <ImpressaoFechamento
            config={config}
            fechamento={selecionado}
            logo={logoParaImpressao}
          />
        )}
      </div>
    </div>
  );
}
