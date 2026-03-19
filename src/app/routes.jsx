import AppLayout from "../layouts/AppLayout";
import Home from "../pages/Home";
import Financeiro from "../pages/Financeiro";
import Fechamento from "../pages/Fechamento/FechamentoPage";

export const routes = [
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/fechamento", element: <Fechamento /> },
      { path: "/financeiro", element: <Financeiro /> },
    ],
  },
];