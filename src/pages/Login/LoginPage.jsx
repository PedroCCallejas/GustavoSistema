import { useState } from "react";
import { FiLogIn, FiMail } from "react-icons/fi";
import { useAuth } from "../../auth/AuthContext";

export default function LoginPage() {
  const { entrar, recuperarSenha } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [modoRecuperar, setModoRecuperar] = useState(false);
  const [emailRecuperar, setEmailRecuperar] = useState("");
  const [mensagemRecuperar, setMensagemRecuperar] = useState("");
  const [erroRecuperar, setErroRecuperar] = useState("");
  const [enviandoRecuperar, setEnviandoRecuperar] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    const { error } = await entrar(email.trim(), senha);
    setCarregando(false);
    if (error) setErro("E-mail ou senha inválidos.");
  };

  const enviarRecuperacao = async (e) => {
    e.preventDefault();
    setErroRecuperar("");
    setMensagemRecuperar("");
    if (!emailRecuperar.trim()) {
      setErroRecuperar("Digite seu e-mail.");
      return;
    }
    setEnviandoRecuperar(true);
    const { error } = await recuperarSenha(emailRecuperar.trim());
    setEnviandoRecuperar(false);
    if (error) {
      setErroRecuperar("Não foi possível enviar o e-mail. Tente novamente.");
    } else {
      setMensagemRecuperar(
        "Se esse e-mail estiver cadastrado, enviamos um link para você criar uma nova senha."
      );
    }
  };

  if (modoRecuperar) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <form
          onSubmit={enviarRecuperacao}
          className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h1 className="mb-1 text-xl font-bold text-slate-900">Recuperar senha</h1>
          <p className="mb-5 text-sm text-slate-500">
            Informe seu e-mail. Vamos te mandar um link para criar uma nova senha.
          </p>

          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            E-mail
          </label>
          <input
            type="email"
            autoComplete="email"
            value={emailRecuperar}
            onChange={(e) => setEmailRecuperar(e.target.value)}
            className="mb-4 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
            placeholder="voce@email.com"
          />

          {erroRecuperar && (
            <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {erroRecuperar}
            </p>
          )}
          {mensagemRecuperar && (
            <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {mensagemRecuperar}
            </p>
          )}

          <button
            type="submit"
            disabled={enviandoRecuperar}
            className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FiMail />
            {enviandoRecuperar ? "Enviando..." : "Enviar link de recuperação"}
          </button>

          <button
            type="button"
            onClick={() => {
              setModoRecuperar(false);
              setErroRecuperar("");
              setMensagemRecuperar("");
            }}
            className="w-full text-center text-sm font-medium text-slate-500 hover:underline"
          >
            Voltar para o login
          </button>
        </form>
      </div>
    );
  }

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

        <div className="mb-1 flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Senha
          </label>
          <button
            type="button"
            onClick={() => {
              setModoRecuperar(true);
              setEmailRecuperar(email);
            }}
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            Esqueci minha senha
          </button>
        </div>
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
