import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [precisaDefinirSenha, setPrecisaDefinirSenha] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setCarregando(false);
    });

    // Quando o link de convite/recuperacao de senha e aberto, o Supabase
    // cria uma sessao temporaria e dispara este evento: precisamos pedir
    // para a pessoa criar a senha antes de liberar o app.
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === "PASSWORD_RECOVERY") {
        setPrecisaDefinirSenha(true);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const entrar = (email, senha) =>
    supabase.auth.signInWithPassword({ email, password: senha });

  const sair = () => supabase.auth.signOut();

  // Envia um e-mail com link para redefinir a senha. Ao clicar no link, o
  // Supabase dispara o evento PASSWORD_RECOVERY acima e a tela de definir
  // senha (a mesma do convite) e mostrada automaticamente.
  const recuperarSenha = (email) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

  const definirSenha = async (novaSenha) => {
    const { error } = await supabase.auth.updateUser({ password: novaSenha });
    if (!error) setPrecisaDefinirSenha(false);
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        carregando,
        entrar,
        sair,
        precisaDefinirSenha,
        definirSenha,
        recuperarSenha,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
