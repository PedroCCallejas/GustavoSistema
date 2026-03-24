import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./app/AppRouter";
import { initDatabase } from "./services/initDB";

export default function Root() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}