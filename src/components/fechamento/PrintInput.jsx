export default function PrintInput({
  label,
  value,
  onChange,
  placeholder = "",
  className = "",
  type = "text",
  readOnly = false,
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 print:hidden ${className}`}
      />

      <div className="hidden min-h-[38px] w-full border-b border-slate-300 px-1 py-2 text-sm text-slate-900 print:block">
        {value || ""}
      </div>
    </div>
  );
}