export default function AutoResizeTextarea({
  label,
  value,
  onChange,
  placeholder = "",
  className = "",
  rows = 1,
}) {
  const handleResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    onChange(e);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {label}
        </label>
      )}

      <textarea
        rows={rows}
        value={value}
        onChange={handleResize}
        placeholder={placeholder}
        className={`w-full resize-none overflow-hidden rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm leading-relaxed text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 print:hidden ${className}`}
        style={{ minHeight: "44px" }}
      />

      <div className="hidden min-h-[44px] w-full whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-relaxed text-slate-900 print:block">
        {value || ""}
      </div>
    </div>
  );
}