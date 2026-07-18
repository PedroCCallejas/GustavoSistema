import { useState } from "react";
import { FiKey } from "react-icons/fi";
import { useAuth } from "../../auth/AuthContext";

export default function DefinirSenhaPage() {
  const { definirSenha } = useAuth();
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setErro("");

    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (senha !== confirmar) {
      setErro("As senhas não são iguais.");
      return;
    }

    setCarregando(true);
    const { error } = await definirSenha(senha);
    setCarregando(false);
    if (error) setErro(error.message || "Não foi possível salvar a senha.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form
        onSubmit={enviar}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h1 className="mb-1 text-xl font-bold text-slate-900">Criar senha</h1>
        <p className="mb-5 text-sm text-slate-500">
          Você foi convidado para o sistema. Crie sua senha para continuar.
        </p>

        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Nova senha
        </label>
        <input
          type="password"
          autoComplete="new-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="mb-4 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
          placeholder="••••••••"
        />

        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Confirmar senha
        </label>
        <input
          type="password"
          autoComplete="new-password"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          className="mb-4 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
          placeholder="••••••••"
        />

        {erro && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{erro}</p>
        )}

        <button
          type="submit"
          disabled={carregando}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <FiKey />
          {carregando ? "Salvando..." : "Salvar senha e entrar"}
        </button>
      </form>
    </div>
  );
}
