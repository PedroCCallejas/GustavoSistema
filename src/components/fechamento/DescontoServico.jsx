const money = (v) =>
  Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Controle de desconto aplicado apenas na parte de Servicos do fechamento.
// A parte editavel (checkbox/tipo/valor) some na impressao; o resumo
// (subtotal / desconto / total) sempre aparece, para ficar claro pro cliente.
export default function DescontoServico({ desconto, setDesconto, subtotal, valorDesconto }) {
  const totalComDesconto = subtotal - valorDesconto;

  return (
    <div className="mt-3 border-t border-slate-200 pt-3">
      <div className="no-print mb-2 flex flex-wrap items-center gap-3 text-xs">
        <label className="flex cursor-pointer items-center gap-2 font-semibold text-slate-600">
          <input
            type="checkbox"
            checked={desconto.ativo}
            onChange={(e) =>
              setDesconto((prev) => ({ ...prev, ativo: e.target.checked }))
            }
          />
          Aplicar desconto nos serviços
        </label>

        {desconto.ativo && (
          <>
            <select
              value={desconto.tipo}
              onChange={(e) =>
                setDesconto((prev) => ({ ...prev, tipo: e.target.value }))
              }
              className="cursor-pointer rounded border border-slate-300 px-2 py-1"
            >
              <option value="percentual">%</option>
              <option value="valor">R$</option>
            </select>
            <input
              type="number"
              min="0"
              step="0.01"
              value={desconto.valor}
              onChange={(e) =>
                setDesconto((prev) => ({ ...prev, valor: e.target.value }))
              }
              className="w-24 rounded border border-slate-300 px-2 py-1"
              placeholder={desconto.tipo === "percentual" ? "Ex: 10" : "Ex: 20,00"}
            />
          </>
        )}
      </div>

      <div className="text-right text-xs font-bold uppercase tracking-wide text-slate-500">
        Subtotal serviços:{" "}
        <span className="text-sm text-slate-900 normal-case">{money(subtotal)}</span>
      </div>

      {desconto.ativo && valorDesconto > 0 && (
        <div className="text-right text-xs font-bold uppercase tracking-wide text-red-500">
          Desconto{desconto.tipo === "percentual" ? ` (${Number(desconto.valor) || 0}%)` : ""}:{" "}
          <span className="text-sm normal-case">-{money(valorDesconto)}</span>
        </div>
      )}

      <div className="text-right text-xs font-bold uppercase tracking-wide text-slate-500">
        Total serviços:{" "}
        <span className="text-sm text-slate-900 normal-case">{money(totalComDesconto)}</span>
      </div>
    </div>
  );
}
