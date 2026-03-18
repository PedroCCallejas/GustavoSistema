export default function PrintInput({
  value,
  onChange,
  placeholder,
  className = "",
  type = "text",
}) {
  return (
    <div className="w-full relative">
      <input
        type={type}
        className={`no-print-area ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <div
        className={`print-only ${className}`}
        style={{ borderBottom: "1px solid #d1d5db", paddingBottom: 4, minHeight: 28 }}
      >
        {value || ""}
      </div>
    </div>
  );
}