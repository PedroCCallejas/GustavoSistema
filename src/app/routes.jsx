import AppLayout from "../layouts/AppLayout";
import Home from "../pages/Home";
import FinanceiroPage from "../pages/financeiro/FinanceiroPage";
import FechamentoPage from "../pages/Fechamento/FechamentoPage";

export const routes = [
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/fechamento", element: <FechamentoPage /> },
      { path: "/financeiro", element: <FinanceiroPage /> },
    ],
  },
];