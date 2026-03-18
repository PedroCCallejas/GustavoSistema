export default function AutoResizeTextarea({
  value,
  onChange,
  placeholder,
  className = "",
}) {
  const adjust = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    onChange(e);
  };

  return (
    <div className="w-full relative group">
      <textarea
        className={`no-print-area ${className}`}
        rows={1}
        placeholder={placeholder}
        value={value}
        onChange={adjust}
        style={{ overflow: "hidden", minHeight: 24 }}
      />
      <div className={`print-only ${className}`} style={{ minHeight: 24 }}>
        {value || ""}
      </div>
    </div>
  );
}