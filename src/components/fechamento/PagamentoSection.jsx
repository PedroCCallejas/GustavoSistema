import PixQrCard from "./PixQrCard";

export default function PagamentoSection({
  payment,
  setPayment,
  pixPayload,
  totalGeral,
}) {
  return (
    <div className="mt-6 space-y-6">
      {/* Painel editável - não imprime */}
      <div className="no-print rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-bold uppercase text-slate-400">
              Forma de pagamento
            </label>
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 p-2"
              value={payment.method}
              onChange={(e) =>
                setPayment((prev) => ({ ...prev, method: e.target.value }))
              }
            >
              <option value="pix">Pix</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="cartao">Cartão</option>
              <option value="transferencia">Transferência</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-400">
              Status do pagamento
            </label>
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 p-2"
              value={payment.status}
              onChange={(e) =>
                setPayment((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="pendente">Pendente</option>
              <option value="parcial">Parcial</option>
              <option value="pago">Pago</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-400">
              Chave PIX
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 p-2"
              value={payment.pix}
              onChange={(e) =>
                setPayment((prev) => ({ ...prev, pix: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-400">
              Favorecido
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 p-2"
              value={payment.favorecido}
              onChange={(e) =>
                setPayment((prev) => ({ ...prev, favorecido: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-400">
              Banco
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 p-2"
              value={payment.bank}
              onChange={(e) =>
                setPayment((prev) => ({ ...prev, bank: e.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold uppercase text-slate-400">
                Agência
              </label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 p-2"
                value={payment.agency}
                onChange={(e) =>
                  setPayment((prev) => ({ ...prev, agency: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400">
                Conta
              </label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 p-2"
                value={payment.cc}
                onChange={(e) =>
                  setPayment((prev) => ({ ...prev, cc: e.target.value }))
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resumo impresso */}
      <div className="avoid-break rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm print:break-inside-avoid">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-900">
          Dados para pagamento
        </h4>

        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div>
            <p className="mb-1">
              <span className="font-bold text-slate-700">Forma:</span>{" "}
              {payment.method}
            </p>
            <p className="mb-1">
              <span className="font-bold text-slate-700">Status:</span>{" "}
              {payment.status}
            </p>
            <p className="mb-1">
              <span className="font-bold text-slate-700">PIX:</span>{" "}
              {payment.pix || "_____________________"}
            </p>
            <p>
              <span className="font-bold text-slate-700">Favorecido:</span>{" "}
              {payment.favorecido}
            </p>
          </div>

          <div className="md:text-right">
            <p className="mb-1">
              <span className="font-bold text-slate-700">Banco:</span>{" "}
              {payment.bank || "______"}
              <span className="mx-2 text-slate-300">|</span>
              <span className="font-bold text-slate-700">Ag:</span>{" "}
              {payment.agency || "____"}
              <span className="mx-2 text-slate-300">|</span>
              <span className="font-bold text-slate-700">CC:</span>{" "}
              {payment.cc || "______"}
            </p>
            <p className="mt-1 text-xs italic text-slate-400">
              * Favor enviar comprovante via WhatsApp.
            </p>
          </div>
        </div>
      </div>

      {payment.method === "pix" && pixPayload && (
        <PixQrCard
          payload={pixPayload}
          chave={payment.pix}
          beneficiario={payment.favorecido}
          valor={totalGeral}
        />
      )}
    </div>
  );
}