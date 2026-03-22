import { Link, Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <Link to="/" className="font-semibold">
            Gustavo Miguel Monteiro de Andrade
          </Link>

          <nav className="flex gap-3 text-sm">
            <Link className="hover:underline" to="/fechamento">
              Fechamento
            </Link>
            <Link className="hover:underline" to="/financeiro">
              Financeiro
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-4">
        <Outlet />
      </main>
    </div>
  );
}