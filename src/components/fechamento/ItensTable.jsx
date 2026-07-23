import EditableTable from "./EditableTable";
import DescontoServico from "./DescontoServico";

export default function ItensTable({
  tipo = "materiais",
  rows = [],
  onAdd,
  onRemove,
  onUpdate,
  subtotalValue = "",
  produtos = [],
  desconto,
  setDesconto,
  subtotalBruto = 0,
  valorDesconto = 0,
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
          headerClassName: "pb-3 min-w-[160px] font-medium pl-2",
          cellClassName: "py-2 pr-2 pl-2 align-top",
          placeholder: "Item...",
        },
        {
          key: "qtd",
          label: "Qtd",
          inputType: "number",
          headerClassName: "pb-3 text-center min-w-[64px] font-medium",
          cellClassName: "py-2 align-top text-center",
          inputClassName: "w-full bg-transparent text-center outline-none",
        },
        {
          key: "price",
          label: "Valor",
          inputType: "number",
          headerClassName: "pb-3 text-right min-w-[90px] font-medium pr-2",
          cellClassName:
            "py-2 align-top text-right font-mono text-slate-900 pr-2",
          inputClassName: "w-full bg-transparent text-right outline-none",
        },
        {
          key: "produtoId",
          label: "Estoque",
          type: "select",
          printHidden: true,
          options: produtos.map((p) => ({
            value: String(p.id),
            label: p.nome,
          })),
          headerClassName: "pb-3 text-center min-w-[120px] font-medium",
          cellClassName: "py-2 align-top text-center",
          placeholder: "— nenhum —",
        },
      ]
    : [
        {
          key: "desc",
          label: "Descrição",
          type: "textarea",
          headerClassName: "pb-3 min-w-[160px] font-medium pl-2",
          cellClassName: "py-2 pr-2 pl-2 align-top",
          placeholder: "Serviço...",
        },
        {
          key: "date",
          label: "Data",
          headerClassName: "pb-3 text-center min-w-[80px] font-medium",
          cellClassName: "py-2 align-top text-center",
          inputClassName: "w-full bg-transparent text-center outline-none",
          placeholder: "dd/mm",
        },
        {
          key: "km",
          label: "Km",
          inputType: "number",
          headerClassName: "pb-3 text-center min-w-[70px] font-medium",
          cellClassName: "py-2 align-top text-center",
          inputClassName: "w-full bg-transparent text-center outline-none",
          placeholder: "Km",
        },
        {
          key: "price",
          label: "Valor",
          inputType: "number",
          headerClassName: "pb-3 text-right min-w-[90px] font-medium pr-2",
          cellClassName:
            "py-2 align-top text-right font-mono text-slate-900 pr-2",
          inputClassName: "w-full bg-transparent text-right outline-none",
        },
      ];

  const footer =
    !isMateriais && desconto && setDesconto ? (
      <DescontoServico
        desconto={desconto}
        setDesconto={setDesconto}
        subtotal={subtotalBruto}
        valorDesconto={valorDesconto}
      />
    ) : undefined;

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
      footer={footer}
    />
  );
}
