import EditableTable from "./EditableTable";

export default function ItensTable({
  tipo = "materiais",
  rows = [],
  onAdd,
  onRemove,
  onUpdate,
  subtotalValue = "",
}) {
  const isMateriais = tipo === "materiais";

  const title = isMateriais
    ? "1. Materiais e Medicamentos"
    : "2. Procedimentos e Serviços";

  const addLabel = isMateriais ? "Adicionar Item" : "Adicionar Serviço";

  const columns = isMateriais
    ? [
        {
          key: "desc",
          label: "Descrição",
          type: "textarea",
          headerClassName: "pb-3 w-8/12 font-medium pl-2",
          cellClassName: "py-2 pr-2 pl-2 align-top",
          placeholder: "Item...",
        },
        {
          key: "qtd",
          label: "Qtd",
          inputType: "number",
          headerClassName: "pb-3 text-center w-2/12 font-medium",
          cellClassName: "py-2 align-top text-center",
          inputClassName: "w-full bg-transparent text-center outline-none",
        },
        {
          key: "price",
          label: "Valor",
          inputType: "number",
          headerClassName: "pb-3 text-right w-2/12 font-medium pr-2",
          cellClassName:
            "py-2 align-top text-right font-mono text-slate-900 pr-2",
          inputClassName: "w-full bg-transparent text-right outline-none",
        },
      ]
    : [
        {
          key: "desc",
          label: "Descrição",
          type: "textarea",
          headerClassName: "pb-3 w-8/12 font-medium pl-2",
          cellClassName: "py-2 pr-2 pl-2 align-top",
          placeholder: "Serviço...",
        },
        {
          key: "date",
          label: "Data",
          headerClassName: "pb-3 text-center w-2/12 font-medium",
          cellClassName: "py-2 align-top text-center",
          inputClassName: "w-full bg-transparent text-center outline-none",
          placeholder: "dd/mm",
        },
        {
          key: "price",
          label: "Valor",
          inputType: "number",
          headerClassName: "pb-3 text-right w-2/12 font-medium pr-2",
          cellClassName:
            "py-2 align-top text-right font-mono text-slate-900 pr-2",
          inputClassName: "w-full bg-transparent text-right outline-none",
        },
      ];

  return (
    <EditableTable
      title={title}
      addLabel={addLabel}
      rows={rows}
      onAdd={onAdd}
      onRemove={onRemove}
      onUpdate={onUpdate}
      columns={columns}
      subtotalValue={subtotalValue}
    />
  );
}