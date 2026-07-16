import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../auth/AuthContext";
import BarraPendentes from "../components/BarraPendentes";

const links = [
  { to: "/fechamento", label: "Fechamento" },
  { to: "/financeiro", label: "Financeiro" },
  { to: "/estoque", label: "Estoque" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/migracao", label: "Migrar" },
];

export default function AppLayout() {
  const { sair } = useAuth();
  const [aberto, setAberto] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 p-4">
          <Link
            to="/"
            onClick={() => setAberto(false)}
            className="min-w-0 truncate font-semibold text-slate-900"
          >
            <span className="md:hidden">Gustavo Andrade</span>
            <span className="hidden md:inline">
              Gustavo Miguel Monteiro de Andrade
            </span>
          </Link>

          {/* Menu do computador */}
          <nav className="hidden items-center gap-3 text-sm md:flex">
            {links.map((l) => (
              <Link key={l.to} className="hover:underline" to={l.to}>
                {l.label}
              </Link>
            ))}
            <button
              onClick={sair}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-200 px-3 py-1.5 font-medium text-slate-700 transition hover:bg-slate-300"
            >
              <FiLogOut size={14} />
              Sair
            </button>
          </nav>

          {/* Botao hamburguer (celular) */}
          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            aria-label="Menu"
            className="inline-flex shrink-0 items-center rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
          >
            {aberto ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {/* Menu aberto no celular */}
        {aberto && (
          <nav className="flex flex-col gap-1 border-t border-slate-100 px-4 pb-3 pt-2 text-sm md:hidden">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setAberto(false)}
                className="rounded-lg px-2 py-2 text-slate-700 transition hover:bg-slate-100"
              >
                {l.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setAberto(false);
                sair();
              }}
              className="mt-1 inline-flex items-center gap-2 rounded-lg bg-slate-200 px-2 py-2 font-medium text-slate-700 transition hover:bg-slate-300"
            >
              <FiLogOut size={16} />
              Sair
            </button>
          </nav>
        )}
      </header>

      <BarraPendentes />

      <main className="mx-auto max-w-5xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
