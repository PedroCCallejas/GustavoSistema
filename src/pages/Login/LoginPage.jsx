import { useState } from "react";
import { FiLogIn } from "react-icons/fi";
import { useAuth } from "../../auth/AuthContext";

export default function LoginPage() {
  const { entrar } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    const { error } = await entrar(email.trim(), senha);
    setCarregando(false);
    if (error) setErro("E-mail ou senha inválidos.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form
        onSubmit={enviar}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h1 className="mb-1 text-xl font-bold text-slate-900">Entrar</h1>
        <p className="mb-5 text-sm text-slate-500">
          Acesse o sistema com seu e-mail e senha.
        </p>

        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          E-mail
        </label>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
          placeholder="voce@email.com"
        />

        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Senha
        </label>
        <input
          type="password"
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="mb-4 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
          placeholder="••••••••"
        />

        {erro && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={carregando}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <FiLogIn />
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
