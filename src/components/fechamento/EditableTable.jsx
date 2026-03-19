import { FiPlus, FiTrash2 } from "react-icons/fi";
import AutoResizeTextarea from "./AutoResizeTextarea";
import PrintInput from "./PrintInput";

export default function EditableTable({
  title,
  addLabel = "Adicionar",
  rows = [],
  columns = [],
  onAdd,
  onRemove,
  onUpdate,
  subtotalLabel = "Subtotal",
  subtotalValue = "",
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:break-inside-avoid print:rounded-none print:border-slate-300 print:shadow-none">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
          {title}
        </h2>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 print:hidden"
        >
          <FiPlus size={14} />
          {addLabel}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-wider text-slate-500">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={column.headerClassName || "px-2 py-3 font-semibold"}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="group border-b border-slate-100 transition hover:bg-slate-50/60 print:break-inside-avoid"
              >
                {columns.map((column, index) => (
                  <td
                    key={column.key}
                    className={column.cellClassName || "px-2 py-2 align-top"}
                  >
                    <div className="relative">
                      {column.type === "textarea" && (
                        <AutoResizeTextarea
                          value={row[column.key] ?? ""}
                          onChange={(e) =>
                            onUpdate(row.id, column.key, e.target.value)
                          }
                          placeholder={column.placeholder || ""}
                          className="min-h-[40px] border-0 bg-transparent px-0 py-0 shadow-none focus:ring-0"
                        />
                      )}

                      {column.type !== "textarea" && (
                        <PrintInput
                          type={column.inputType || "text"}
                          value={row[column.key] ?? ""}
                          onChange={(e) =>
                            onUpdate(row.id, column.key, e.target.value)
                          }
                          placeholder={column.placeholder || ""}
                          className={`border-0 bg-transparent px-0 py-0 shadow-none focus:ring-0 ${column.inputClassName || ""}`}
                        />
                      )}

                      {index === 0 && (
                        <button
                          type="button"
                          onClick={() => onRemove(row.id)}
                          className="absolute -left-8 top-2 p-1 text-red-400 opacity-0 transition hover:text-red-600 group-hover:opacity-100 print:hidden"
                          title="Remover"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 border-t border-slate-200 pt-3 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
        {subtotalLabel}:{" "}
        <span className="text-sm text-slate-900 normal-case">{subtotalValue}</span>
      </div>
    </div>
  );
}