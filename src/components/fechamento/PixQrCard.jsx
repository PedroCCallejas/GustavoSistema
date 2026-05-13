import QRCode from "react-qr-code";
import { FiCopy } from "react-icons/fi";
import { formatCurrency } from "../../utils/format/currency";

export default function PixQrCard({
  payload = "",
  chave = "",
  beneficiario = "",
  valor = 0,
}) {
  const chavePix = chave || "+5565996910049";

  const handleCopy = async () => {
    if (!payload) return;

    try {
      await navigator.clipboard.writeText(payload);
      alert("Código Pix copiado.");
    } catch (error) {
      console.error("Erro ao copiar Pix:", error);
    }
  };

  return (
    <div className="avoid-break rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:break-inside-avoid print:rounded-none print:border-slate-300 print:shadow-none">
      <div className="mb-4 border-b border-slate-200 pb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
          Pagamento via Pix
        </h2>
      </div>

      <div className="flex flex-col gap-5 md:flex-row md:items-start">
        <div className="mx-auto rounded-2xl border border-slate-200 bg-white p-4 print:border-slate-400 print:bg-white">
          <div className="bg-white p-2">
            <QRCode
              value={payload || " "}
              size={170}
              bgColor="#FFFFFF"
              fgColor="#000000"
              level="M"
              style={{
                height: "auto",
                maxWidth: "100%",
                width: "170px",
                display: "block",
              }}
              viewBox="0 0 256 256"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="space-y-2 text-sm text-slate-700">
            <p>
              <span className="font-semibold text-slate-900">Beneficiário:</span>{" "}
              {beneficiario || "-"}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Chave Pix:</span>{" "}
              <span className="break-all">{chavePix}</span>
            </p>
            <p>
              <span className="font-semibold text-slate-900">Valor:</span>{" "}
              <span className="text-base font-bold">{formatCurrency(valor)}</span>
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <p className="text-xs leading-relaxed text-slate-500">
              Escaneie o QR Code ou copie o codigo Pix abaixo no app do banco.
            </p>

            <div className="space-y-2 text-sm text-slate-700">
              <p>
                <span className="font-semibold text-slate-900">Chave Pix:</span>{" "}
                <span className="break-all">{chavePix}</span>
              </p>
              <div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  Pix Copia e Cola:
                </p>
                <div className="select-text break-all rounded-xl border border-slate-300 bg-slate-50 p-3 font-mono text-xs leading-relaxed text-slate-700 print:bg-slate-50">
                  {payload}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 print:hidden"
            >
              <FiCopy size={16} />
              Copiar código Pix
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
