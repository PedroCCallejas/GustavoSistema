import { useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { FiUpload, FiPrinter } from "react-icons/fi";

import logoPadrao from "../../assets/LogoGustavo.png";
import { gerarPixCopiaECola } from "../../utils/pix/pixPayload";

import HeaderFechamento from "../../components/fechamento/HeaderFechamento";
import ClienteSection from "../../components/fechamento/ClienteSection";
import RelatorioSection from "../../components/fechamento/RelatorioSection";
import ItensTable from "../../components/fechamento/ItensTable";
import TotaisCard from "../../components/fechamento/TotaisCard";
import PagamentoSection from "../../components/fechamento/PagamentoSection";

import "./fechamento.print.css";

export default function FechamentoPage() {
  const printRef = useRef(null);

  const [logo, setLogo] = useState(logoPadrao);

  const [client, setClient] = useState({
    name: "",
    animal: "",
    ref: "",
    date: new Date().toLocaleDateString("pt-BR"),
  });

  const [relatorio, setRelatorio] = useState("");

  const [materials, setMaterials] = useState([
    { id: 1, desc: "", qtd: 1, price: 0 },
  ]);

  const [services, setServices] = useState([
    { id: 1, desc: "", date: "", price: 0 },
  ]);

  const [payment, setPayment] = useState({
  method: "pix",
  status: "pendente",
  discount: 0,
  addition: 0,
  pix: "+5565996910049",
  bank: "NUBANK",
  agency: "0001",
  cc: "64462938-4",
  favorecido: "Gustavo Miguel Monteiro de Andrade",
  cidade: "CUIABA",
  txid: "***",
  descricaoPix: "Fechamento de atendimento",
});

  const onPrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `fechamento-${client.name || "cliente"}`,
  });

  const money = (value) =>
    Number(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const totalMat = useMemo(() => {
    return materials.reduce((acc, item) => {
      const qtd = Number(item.qtd) || 0;
      const price = Number(item.price) || 0;
      return acc + qtd * price;
    }, 0);
  }, [materials]);

  const totalSrv = useMemo(() => {
    return services.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      return acc + price;
    }, 0);
  }, [services]);

  const subtotal = totalMat + totalSrv;
  const desconto = Number(payment.discount) || 0;
  const acrescimo = Number(payment.addition) || 0;
  const totalGeral = subtotal - desconto + acrescimo;

  const pixPayload = useMemo(() => {
    if (payment.method !== "pix") return "";
    if (!payment.pix) return "";

    return gerarPixCopiaECola({
      chave: payment.pix,
      nome: payment.favorecido,
      cidade: payment.cidade,
      valor: totalGeral,
      txid: payment.txid || "***",
      descricao: payment.descricaoPix || "Fechamento",
    });
  }, [
    payment.method,
    payment.pix,
    payment.favorecido,
    payment.cidade,
    payment.txid,
    payment.descricaoPix,
    totalGeral,
  ]);

  const handleLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setLogo(reader.result);
    reader.readAsDataURL(file);
  };

  const updateMat = (id, key, value) => {
    setMaterials((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  };

  const addMat = () => {
    setMaterials((prev) => [
      ...prev,
      { id: Date.now(), desc: "", qtd: 1, price: 0 },
    ]);
  };

  const delMat = (id) => {
    setMaterials((prev) => prev.filter((item) => item.id !== id));
  };

  const updateSrv = (id, key, value) => {
    setServices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  };

  const addSrv = () => {
    setServices((prev) => [
      ...prev,
      { id: Date.now(), desc: "", date: "", price: 0 },
    ]);
  };

  const delSrv = (id) => {
    setServices((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20 md:pb-10">
      {/* Barra de controles */}
      <div className="no-print sticky top-0 z-50 mb-8 bg-slate-900 p-4 text-white shadow-lg">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 md:flex-row">
          <h1 className="flex items-center gap-2 text-xl font-bold">
            Gerador de Fechamento
            <span className="rounded bg-blue-600 px-2 py-0.5 text-xs">Vite</span>
          </h1>

          <div className="flex flex-wrap justify-center gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded bg-slate-700 px-3 py-2 text-sm font-medium transition hover:bg-slate-600">
              <FiUpload />
              {logo ? "Trocar logo" : "Adicionar logo"}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleLogo}
              />
            </label>

            <button
              type="button"
              onClick={onPrint}
              className="flex items-center gap-2 rounded bg-green-600 px-5 py-2 text-sm font-bold shadow-md transition hover:bg-green-500"
            >
              <FiPrinter />
              SALVAR PDF
            </button>
          </div>
        </div>
      </div>

      {/* Área imprimível */}
      <div className="mx-auto max-w-5xl px-4">
        <div
          ref={printRef}
          className="printable-area relative rounded-2xl border border-slate-200 bg-white p-6 shadow"
        >
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
              nome="Gustavo Miguel Monteiro de Andrade"
              subtitulo="Clínica & Podologia Equina"
              crmv="CRMV-MT 08415"
              tituloDocumento="Fechamento de Conta"
              data={client.date}
            />

            <ClienteSection client={client} setClient={setClient} />

            <RelatorioSection
              value={relatorio}
              onChange={(e) => setRelatorio(e.target.value)}
            />

            <div className="mt-6 space-y-6">
              <ItensTable
                tipo="materiais"
                rows={materials}
                onAdd={addMat}
                onRemove={delMat}
                onUpdate={updateMat}
                subtotalValue={money(totalMat)}
              />

              <ItensTable
                tipo="servicos"
                rows={services}
                onAdd={addSrv}
                onRemove={delSrv}
                onUpdate={updateSrv}
                subtotalValue={money(totalSrv)}
              />
            </div>

            <div className="mt-8">
              <TotaisCard
                subtotal={subtotal}
                desconto={desconto}
                acrescimo={acrescimo}
                total={totalGeral}
              />
            </div>

            <PagamentoSection
              payment={payment}
              setPayment={setPayment}
              pixPayload={pixPayload}
              totalGeral={totalGeral}
            />
          </div>
        </div>
      </div>
    </div>
  );
}