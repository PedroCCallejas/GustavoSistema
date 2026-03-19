import { FiClipboard } from "react-icons/fi";
import AutoResizeTextarea from "./AutoResizeTextarea";

export default function RelatorioSection({ value, onChange }) {
  return (
    <div className="avoid-break mt-6 print:break-inside-avoid">
      <h3 className="mb-2 flex items-center gap-2 border-b border-slate-300 pb-1 text-xs font-bold uppercase tracking-wider text-slate-800">
        <FiClipboard />
        Relatório
      </h3>

      <div className="min-h-[80px] rounded-lg border border-slate-200 bg-white p-3">
        <AutoResizeTextarea
          className="bg-transparent text-sm leading-relaxed text-slate-700 outline-none"
          placeholder="Descreva o histórico, atendimento, observações clínicas, materiais utilizados e demais informações..."
          value={value}
          onChange={onChange}
          rows={3}
        />
      </div>
    </div>
  );
}