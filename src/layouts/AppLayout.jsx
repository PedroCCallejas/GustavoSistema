import { Link, Outlet } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../auth/AuthContext";
import BarraPendentes from "../components/BarraPendentes";

export default function AppLayout() {
  const { sair } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <Link to="/" className="font-semibold">
            Gustavo Miguel Monteiro de Andrade
          </Link>

          <nav className="flex items-center gap-3 text-sm">
            <Link className="hover:underline" to="/fechamento">
              Fechamento
            </Link>
            <Link className="hover:underline" to="/financeiro">
              Financeiro
            </Link>
            <Link className="hover:underline" to="/estoque">
              Estoque
            </Link>
            <Link className="hover:underline" to="/dashboard">
              Dashboard
            </Link>
            <Link className="hover:underline text-slate-400" to="/migracao">
              Migrar
            </Link>
            <button
              onClick={sair}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-200 px-3 py-1.5 font-medium text-slate-700 transition hover:bg-slate-300"
            >
              <FiLogOut size={14} />
              Sair
            </button>
          </nav>
        </div>
      </header>

      <BarraPendentes />

      <main className="mx-auto max-w-5xl p-4">
        