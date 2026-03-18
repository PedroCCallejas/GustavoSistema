import AutoResizeTextarea from "./AutoResizeTextarea";
import PrintInput from "./PrintInput";
import { FiTrash2, FiPlus } from "react-icons/fi";

export default function EditableTable({
  title,
  columns,
  rows,
  onAdd,
  onRemove,
  onUpdate,
  addLabel = "Adicionar",
  subtotalLabel = "Subtotal",
  subtotalValue = null,
}) {
  return (
    <div className="mt-6">
      <div className="flex justify-between items-end border-b-2 border-gray-800 mb-3 pb-2 avoid-break">
        <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wider">{title}</h3>

        <button
          onClick={onAdd}
          className="no-print bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-full flex items-center gap-2 transition font-medium"
        >
          <FiPlus /> {addLabel}
        </button>
      </div>

      <table className="w-full text-sm border-collapse bg-white rounded">
        <thead>
          <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
            {columns.map((c) => (
              <th key={c.key} className={c.thClassName || "pb-3 font-medium"}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="text-gray-700">
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100 group hover:bg-gray-50 transition-colors avoid-break">
              {columns.map((c) => (
                <td key={c.key} className={c.tdClassName || "py-2 align-top"}>
                  {c.type === "textarea" ? (
                    <div className="relative">
                      <AutoResizeTextarea
                        className="w-full bg-transparent outline-none font-medium resize-none overflow-hidden text-sm"
                        placeholder={c.placeholder}
                        value={row[c.key] ?? ""}
                        onChange={(e) => onUpdate(row.id, c.key, e.target.value)}
                      />

                      {c.key === columns[0].key && (
                        <button
                          onClick={() => onRemove(row.id)}
                          className="no-print absolute -left-8 top-2 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                          title="Remover"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  ) : (
                    <PrintInput
                      type={c.inputType || "text"}
                      className={c.inputClassName || "w-full bg-transparent outline-none"}
                      placeholder={c.placeholder}
                      value={row[c.key] ?? ""}
                      onChange={(e) => onUpdate(row.id, c.key, e.target.value)}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {subtotalValue !== null && (
        <div className="text-right text-xs font-bold text-gray-500 mt-2 border-t border-gray-100 pt-1 avoid-break">
          {subtotalLabel}: {subtotalValue}
        </div>
      )}
    </div>
  );
}