export default function HeaderFechamento({
  logo,
  nome = "Gustavo Miguel Monteiro de Andrade",
  subtitulo = "Clínica & Podologia Equina",
  crmv = "CRMV-MT 08415",
  tituloDocumento = "Fechamento de Conta",
  data = "",
}) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 border-b-2 border-slate-800 pb-4 md:flex-row print:break-inside-avoid">
      <div className="flex w-full items-center gap-5">
        {logo ? (
          <img
            src={logo}
            className="h-24 w-auto object-contain"
            alt="Logo"
          />
        ) : (
          <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded border-2 border-dashed border-slate-300 bg-slate-100 text-center text-xs text-slate-400">
            Sua Logo
          </div>
        )}

        <div>
          <h1 className="text-2xl font-black uppercase leading-tight tracking-wide text-slate-900">
            {nome}
          </h1>

          <p className="mt-1 text-sm font-bold tracking-wider text-slate-600">
            {subtitulo}
          </p>

          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {crmv}
          </p>
        </div>
      </div>

      <div className="w-full flex-shrink-0 text-left md:w-auto md:text-right">
        <div className="mb-2 inline-block rounded bg-slate-100 px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-slate-800">
          {tituloDocumento}
        </div>

        <p className="text-sm font-medium text-slate-500">{data}</p>
      </div>
    </div>
  );
}