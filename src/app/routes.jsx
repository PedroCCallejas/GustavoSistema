import AppLayout from "../layouts/AppLayout";
import Home from "../pages/Home";
import FinanceiroPage from "../pages/financeiro/FinanceiroPage";
import FechamentoPage from "../pages/Fechamento/FechamentoPage";
import EstoquePage from "../pages/estoque/EstoquePage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import MigracaoPage from "../pages/migracao/MigracaoPage";
import ConfiguracoesPage from "../pages/configuracoes/ConfiguracoesPage";
import ClientesPage from "../pages/clientes/ClientesPage";
import HistoricoPage from "../pages/historico/HistoricoPage";

export const routes = [
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/fechamento", element: <FechamentoPage /> },
      { path: "/financeiro", element: <FinanceiroPage /> },
      { path: "/estoque", element: <EstoquePage /> },
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/migracao", element: <MigracaoPage /> },
      { path: "/configuracoes", element: <ConfiguracoesPage /> },
      { path: "/clientes", element: <ClientesPage /> },
      { path: "/historico", element: <HistoricoPage /> },
    ],
  },
];
