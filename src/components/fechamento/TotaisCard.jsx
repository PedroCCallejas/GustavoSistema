import { formatCurrency } from "../../utils/format/currency";

export default function TotaisCard({
  total = 0,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:break-inside-avoid print:rounded-none print:border-slate-300 print:shadow-none">
      <div className="mb-4 border-b border-slate-200 pb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
          Resumo Financeiro
        </h2>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-slate-700">         
        </div>
        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Total a Pagar
            </span>
            <span className="text-2xl font-black text-slate-900">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}