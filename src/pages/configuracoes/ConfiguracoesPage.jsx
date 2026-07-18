import { useEffect, useState } from "react";
import { FiSave, FiUpload } from "react-icons/fi";
import {
  obterConfiguracoes,
  atualizarConfiguracoes,
  configPadrao,
} from "../../services/configuracoes";

export default function ConfiguracoesPage() {
  const [config, setConfig] = useState(configPadrao);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const dados = await obterConfiguracoes();
        setConfig(dados);
      } catch (error) {
        setErro(error?.message || "Não foi possível carregar as configurações.");
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  const campo = (chave, valor) => setConfig((prev) => ({ ...prev, [chave]: valor }));

  const handleLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => campo("logo_url", reader.result);
    reader.readAsDataURL(file);
  };

  const salvar = async (e) => {
    e.preventDefault();
    if (!config.id) {
      setErro("Configuração ainda não carregada. Aguarde e tente novamente.");
      return;
    }
    setSalvando(true);
    setMensagem("");
    setErro("");
    try {
      await atualizarConfiguracoes(config.id, {
        nome: config.nome,
        subtitulo: config.subtitulo,
        crmv: config.crmv,
        logo_url: config.logo_url,
        pix_chave: config.pix_chave,
        pix_favorecido: config.pix_favorecido,
        pix_cidade: config.pix_cidade,
        pix_descricao: config.pix_descricao,
        banco: config.banco,
        agencia: config.agencia,
        conta: config.conta,
        valor_km: Number(config.valor_km) || 0,
      });
      setMensagem("Configurações salvas. O próximo fechamento já usa esses dados.");
    } catch (error) {
      setErro(error?.message || "Não foi possível salvar as configurações.");
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return <div className="p-6 text-slate-500">Carregando configurações...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Configurações</h1>
      <p className="mb-6 text-sm text-slate-500">
        Dados que aparecem no cabeçalho e no PIX de cada fechamento.
      </p>

      <form onSubmit={salvar} className="max-w-2xl space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-800">
            Cabeçalho
          </h2>

          <div className="mb-4 flex items-center gap-4">
            {config.logo_url ? (
              <img
                src={config.logo_url}
                alt="Logo"
                className="h-16 w-16 rounded-lg border border-slate-200 object-contain"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-slate-300 text-[10px] text-slate-400">
                Sem logo
              </div>
            )}
            <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700">
              <FiUpload />
              Trocar logo
              <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Campo label="Nome" value={config.nome} onChange={(v) => campo("nome", v)} />
            <Campo
              label="Subtítulo"
              value={config.subtitulo}
              onChange={(v) => campo("subtitulo", v)}
            />
            <Campo label="CRMV" value={config.crmv} onChange={(v) => campo("crmv", v)} />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-800">
            Dados de pagamento (PIX)
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Campo
              label="Chave PIX"
              value={config.pix_chave}
              onChange={(v) => campo("pix_chave", v)}
            />
            <Campo
              label="Favorecido"
              value={config.pix_favorecido}
              onChange={(v) => campo("pix_favorecido", v)}
            />
            <Campo
              label="Cidade"
              value={config.pix_cidade}
              onChange={(v) => campo("pix_cidade", v)}
            />
            <Campo
              label="Descrição do PIX"
              value={config.pix_descricao}
              onChange={(v) => campo("pix_descricao", v)}
            />
            <Campo label="Banco" value={config.banco} onChange={(v) => campo("banco", v)} />
            <Campo label="Agência" value={config.agencia} onChange={(v) => campo("agencia", v)} />
            <Campo label="Conta" value={config.conta} onChange={(v) => campo("conta", v)} />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-800">
            Deslocamento
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Campo
              label="Valor por Km rodado (R$)"
              type="number"
              value={config.valor_km}
              onChange={(v) => campo("valor_km", v)}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Ao lançar um serviço de "Deslocamento" e informar os Km rodados, o valor é calculado
            automaticamente.
          </p>
        </section>

        {mensagem && (
          <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{mensagem}</p>
        )}
        {erro && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{erro}</p>}

        <button
          type="submit"
          disabled={salvando}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <FiSave />
          {salvando ? "Salvando..." : "Salvar configurações"}
        </button>
      </form>
    </div>
  );
}

function Campo({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <input
        type={type}
        step={type === "number" ? "0.01" : undefined}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
      />
    </div>
  );
}
