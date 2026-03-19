export default function SectionCard({ title, right, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print:break-inside-avoid print:rounded-none print:border-slate-300 print:shadow-none ${className}`}
    >
      {(title || right) && (
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            {title}
          </h2>
          {right && <div>{right}</div>}
        </div>
      )}

      {children}
    </section>
  );
}