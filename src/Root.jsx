import { BrowserRouter } from "react-router-dom";
import AppRouter from "./app/AppRouter";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import LoginPage from "./pages/Login/LoginPage";
import DefinirSenhaPage from "./pages/DefinirSenha/DefinirSenhaPage";

function Gate() {
  const { session, carregando, precisaDefinirSenha } = useAuth();

  if (carregando) {
    return <div className="p-6 text-slate-500">Carregando...</div>;
  }

  if (session && precisaDefinirSenha) {
    return <DefinirSenhaPage />;
  }

  if (!session) {
    return <LoginPage />;
  }

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default function Root() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
