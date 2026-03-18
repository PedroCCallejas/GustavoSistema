import { useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { FiUpload, FiPrinter, FiClipboard } from "react-icons/fi";

import PrintInput from "./components/PrintInput";
import AutoResizeTextarea from "./components/AutoResizeTextarea";
import EditableTable from "./components/EditableTable";

import "./fechamento.print.css";

export default function Fechamento() {
  const printRef = useRef(null);

  const [logo, setLogo] = useState(null);

  const [client, setClient] = useState({
    name: "",
    animal: "",
    ref: "",
    date: new Date().toLocaleDateString("pt-BR"),
  });

  const [relatorio, setRelatorio] = useState("");

  const [materials, setMaterials] = useState([{ id: 1, desc: "", qtd: 1, price: 0 }]);
  const [services, setServices] = useState([{ id: 1, desc: "", date: "", price: 0 }]);

  const [payment, setPayment] = useState({
    pix: "(65) 996910049",
    bank: "NUBANK",
    agency: "0001",
    cc: "64462938-4",
    favorecido: "Gustavo Miguel Monteiro de Andrade",
  });

  const onPrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `fechamento-${client.name || "cliente"}`,
  });

  const totalMat = useMemo(
    () => materials.reduce((acc, m) => acc + (Number(m.qtd) || 0) * (Number(m.price) || 0), 0),
    [materials]
  );

  const totalSrv = useMemo(
    () => services.reduce((acc, s) => acc + (Number(s.price) || 0), 0),
    [services]
  );

  const totalGeral = totalMat + totalSrv;

  const money = (v) => (Number(v) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setLogo(reader.result);
    reader.readAsDataURL(file);
  };

  const updateMat = (id, key, val) =>
    setMaterials((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: val } : r)));
  const addMat = () => setMaterials((prev) => [...prev, { id: Date.now(), desc: "", qtd: 1, price: 0 }]);
  const delMat = (id) => setMaterials((prev) => prev.filter((r) => r.id !== id));

  const updateSrv = (id, key, val) =>
    setServices((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: val } : r)));
  const addSrv = () => setServices((prev) => [...prev, { id: Date.now(), desc: "", date: "", price: 0 }]);
  const delSrv = (id) => setServices((prev) => prev.filter((r) => r.id !== id));

  return (
    <div className="min-h-screen pb-20 md:pb-10 bg-gray-100">
      {/* Barra de controles */}
      <div className="no-print bg-gray-900 text-white p-4 sticky top-0 z-50 shadow-lg mb-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            Gerador de Fechamento <span className="bg-blue-600 text-xs px-2 py-0.5 rounded">Vite</span>
          </h1>

          <div className="flex gap-2 flex-wrap justify-center">
            <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded flex items-center gap-2 transition text-sm font-medium">
              <FiUpload /> {logo ? "Trocar" : "Logo"}
              <input type="file" className="hidden" accept="image/*" onChange={handleLogo} />
            </label>

            <button
              onClick={onPrint}
              className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded flex items-center gap-2 font-bold transition shadow-md text-sm"
            >
              <FiPrinter /> SALVAR PDF
            </button>
          </div>
        </div>
      </div>

      {/* config pagamento (tela) */}
      <div className="no-print max-w-4xl mx-auto mb-8 px-4">
        <div className="bg-white p-4 rounded shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Chave PIX</label>
            <input
              className="w-full border p-2 rounded bg-gray-50"
              value={payment.pix}
              onChange={(e) => setPayment((p) => ({ ...p, pix: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Dados Bancários</label>
            <div className="flex gap-2">
              <input
                className="w-1/3 border p-2 rounded bg-gray-50"
                value={payment.bank}
                onChange={(e) => setPayment((p) => ({ ...p, bank: e.target.value }))}
              />
              <input
                className="w-1/3 border p-2 rounded bg-gray-50"
                value={payment.agency}
                onChange={(e) => setPayment((p) => ({ ...p, agency: e.target.value }))}
              />
              <input
                className="w-1/3 border p-2 rounded bg-gray-50"
                value={payment.cc}
                onChange={(e) => setPayment((p) => ({ ...p, cc: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Área imprimível */}
      <div className="max-w-4xl mx-auto px-4">
        <div ref={printRef} className="printable-area bg-white rounded shadow border border-gray-200 p-6 relative">
          {/* marca d’água */}
          {logo && (
            <div className="absolute inset-0 flex justify-center pt-40 pointer-events-none" style={{ zIndex: 0 }}>
              <img
                src={logo}
                className="w-[80%] opacity-[0.04] grayscale fixed -rotate-12 object-contain"
                style={{ maxWidth: 500 }}
                alt="Marca d'água"
              />
            </div>
          )}

          <div className="relative" style={{ zIndex: 10 }}>
            {/* cabeçalho */}
            <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-gray-800 pb-4 gap-4">
              <div className="flex items-center gap-5 w-full">
                {logo ? (
                  <img src={logo} className="h-24 w-auto object-contain" alt="Logo" />
                ) : (
                  <div className="h-24 w-24 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs text-center rounded flex-shrink-0">
                    Sua Logo
                  </div>
                )}

                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-wide uppercase leading-tight">
                    Gustavo Miguel Monteiro de Andrade
                  </h1>
                  <p className="text-gray-600 font-bold tracking-wider text-sm mt-1">Clínica & Podologia Equina</p>
                </div>
              </div>

              <div className="text-left md:text-right w-full md:w-auto flex-shrink-0">
                <div className="bg-gray-100 px-4 py-1.5 rounded text-sm font-bold text-gray-800 uppercase inline-block mb-2 tracking-wide">
                  Fechamento de Conta
                </div>
                <p className="text-gray-500 font-medium text-sm">{client.date}</p>
              </div>
            </div>

            {/* dados cliente */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 avoid-break mt-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Proprietário
                  </label>
                  <PrintInput
                    className="w-full bg-transparent border-b border-gray-300 font-bold text-gray-800 text-lg outline-none py-1"
                    placeholder="Nome do Cliente..."
                    value={client.name}
                    onChange={(e) => setClient((c) => ({ ...c, name: e.target.value }))}
                  />
                </div>

                <div className="col-span-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Data Atendimento
                  </label>
                  <PrintInput
                    className="w-full bg-transparent border-b border-gray-300 font-bold text-gray-800 text-lg outline-none py-1"
                    placeholder="Ex: Dezembro/2025"
                    value={client.ref}
                    onChange={(e) => setClient((c) => ({ ...c, ref: e.target.value }))}
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Animal / Paciente
                  </label>
                  <PrintInput
                    className="w-full bg-transparent border-b border-gray-300 font-bold text-gray-800 text-lg outline-none py-1"
                    placeholder="Nome do Cavalo..."
                    value={client.animal}
                    onChange={(e) => setClient((c) => ({ ...c, animal: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* relatório */}
            <div className="avoid-break mt-6">
              <h3 className="font-bold text-gray-800 uppercase text-xs tracking-wider flex items-center gap-2 mb-2 border-b border-gray-300 pb-1">
                <FiClipboard /> Relatório
              </h3>
              <div className="bg-white border border-gray-200 rounded p-3 min-h-[60px]">
                <AutoResizeTextarea
                  className="w-full bg-transparent outline-none text-sm text-gray-700 leading-relaxed"
                  placeholder="Descreva o histórico..."
                  value={relatorio}
                  onChange={(e) => setRelatorio(e.target.value)}
                />
              </div>
            </div>

            {/* tabelas */}
            <EditableTable
              title="1. Materiais e Medicamentos"
              addLabel="Adicionar Item"
              rows={materials}
              onAdd={addMat}
              onRemove={delMat}
              onUpdate={updateMat}
              columns={[
                { key: "desc", label: "Descrição", type: "textarea", thClassName: "pb-3 w-8/12 font-medium pl-2", tdClassName: "py-2 pr-2 pl-2 align-top", placeholder: "Item..." },
                { key: "qtd", label: "Qtd", inputType: "number", thClassName: "pb-3 text-center w-2/12 font-medium", tdClassName: "py-2 align-top text-center", inputClassName: "w-full bg-transparent text-center outline-none" },
                { key: "price", label: "Valor", inputType: "number", thClassName: "pb-3 text-right w-2/12 font-medium pr-2", tdClassName: "py-2 align-top text-right font-mono text-gray-900 pr-2", inputClassName: "w-full bg-transparent text-right outline-none" },
              ]}
              subtotalValue={money(totalMat)}
            />

            <EditableTable
              title="2. Procedimentos e Serviços"
              addLabel="Adicionar Serviço"
              rows={services}
              onAdd={addSrv}
              onRemove={delSrv}
              onUpdate={updateSrv}
              columns={[
                { key: "desc", label: "Descrição", type: "textarea", thClassName: "pb-3 w-8/12 font-medium pl-2", tdClassName: "py-2 pr-2 pl-2 align-top", placeholder: "Serviço..." },
                { key: "date", label: "Data", thClassName: "pb-3 text-center w-2/12 font-medium", tdClassName: "py-2 align-top text-center", inputClassName: "w-full bg-transparent text-center outline-none", placeholder: "dd/mm" },
                { key: "price", label: "Valor", inputType: "number", thClassName: "pb-3 text-right w-2/12 font-medium pr-2", tdClassName: "py-2 align-top text-right font-mono text-gray-900 pr-2", inputClassName: "w-full bg-transparent text-right outline-none" },
              ]}
              subtotalValue={money(totalSrv)}
            />

            {/* total + pagamento */}
            <div className="mt-8 border-t-2 border-gray-800 pt-4 avoid-break">
              <div className="flex justify-end mb-6">
                <div className="bg-gray-900 text-white px-8 py-4 rounded-xl shadow-lg border-l-4 border-gray-600 flex flex-col justify-center">
                  <p className="text-[10px] uppercase tracking-widest font-bold mb-1 opacity-80">Total a Pagar</p>
                  <p className="text-3xl font-mono font-bold leading-none">{money(totalGeral)}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm">
                <h4 className="font-bold text-gray-900 mb-3 uppercase text-xs tracking-wider">
                  Dados para Pagamento
                </h4>

                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <p className="mb-1">
                      <span className="font-bold text-gray-700">PIX:</span> {payment.pix || "_____________________"}
                    </p>
                    <p>
                      <span className="font-bold text-gray-700">Favorecido:</span> {payment.favorecido}
                    </p>
                  </div>

                  <div className="md:text-right">
                    <p className="mb-1">
                      <span className="font-bold text-gray-700">Banco:</span> {payment.bank || "______"}
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="font-bold text-gray-700">Ag:</span> {payment.agency || "____"}
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="font-bold text-gray-700">CC:</span> {payment.cc || "______"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 italic">* Favor enviar comprovante via WhatsApp.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}